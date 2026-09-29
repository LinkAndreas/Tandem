'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import generateNextRound from "@/app/pairing_algorithm";
import { splitAt } from "@/lib/i18n";
import { analyzeRounds, createRound, openPairCount, type Pair, type Round } from "@/lib/rounds";
import { createSample } from "@/lib/sample";
import { downloadSession, parseSession } from "@/lib/session";
import { SettingsProvider, useSettings } from "@/lib/settings";
import Onboarding from "./Onboarding";
import ParticipantList from "./ParticipantList";
import RoundCard from "./RoundCard";
import RoundTextEditor from "./RoundTextEditor";
import SettingsMenu from "./SettingsMenu";
import { Button, Logo } from "./ui";

const STORAGE_KEY = "tandem:data";
const ONBOARDED_KEY = "tandem:onboarded";

type Snapshot = { participants: string[]; rounds: Round[] };
/** A short notice at the bottom of the screen; with a snapshot it also offers to undo. */
type Undo = { message: string; snapshot?: Snapshot };

function loadSnapshot(): Snapshot {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as { participants?: string[]; rounds?: Pair[][] };
      return {
        participants: data.participants ?? [],
        rounds: (data.rounds ?? []).map((pairs) => createRound(pairs)),
      };
    }
  } catch {
    // Storage may be unavailable (private mode) or corrupt; start fresh.
  }
  return { participants: [], rounds: [] };
}

function hasSeenOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDED_KEY) === "1";
  } catch {
    return true;
  }
}

const subscribeNoop = () => () => {};

/** A round that was started but never filled is not a real round. */
const withoutEmptyRounds = (rounds: Round[]) => rounds.filter((round) => round.pairs.length > 0);

export default function TandemApp() {
  // Settings and the saved session live in the browser, so only render the app once we are on the client.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  if (!isClient) return null;
  return (
    <SettingsProvider>
      <Planner initial={loadSnapshot()} showOnboarding={!hasSeenOnboarding()} />
    </SettingsProvider>
  );
}

function Planner({ initial, showOnboarding }: { initial: Snapshot; showOnboarding: boolean }) {
  const { t, locale } = useSettings();
  const [participants, setParticipants] = useState(initial.participants);
  const [rounds, setRounds] = useState(initial.rounds);
  // The state in which drawing failed; the notice disappears as soon as the group or rounds change.
  const [drawFailedFor, setDrawFailedFor] = useState<Snapshot | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [manualId, setManualId] = useState<number | null>(null);
  const [drawnId, setDrawnId] = useState<number | null>(null);
  const [undo, setUndo] = useState<Undo | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(showOnboarding);
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  // While the example is shown, the user's own data waits here untouched.
  const [ownData, setOwnData] = useState<Snapshot | null>(null);
  const isExample = ownData !== null;
  // The example names currently shown; they follow the language while the example is open.
  const [exampleNames, setExampleNames] = useState<string[] | null>(null);
  if (isExample && exampleNames && exampleNames !== t.sampleNames) {
    const rename = new Map(exampleNames.map((name, i) => [name, t.sampleNames[i]]));
    const translate = (name: string) => rename.get(name) ?? name;
    setExampleNames(t.sampleNames);
    setParticipants(participants.map(translate));
    setRounds(rounds.map((round) => ({ ...round, pairs: round.pairs.map((pair) => pair.map(translate)) })));
    setUndo(null);
  }

  useEffect(() => {
    if (isExample) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ participants, rounds: rounds.map((round) => round.pairs) })
      );
    } catch {
      // Persisting is a convenience only.
    }
  }, [participants, rounds, isExample]);

  const analyses = useMemo(() => analyzeRounds(participants, rounds), [participants, rounds]);
  const openPairs = useMemo(() => openPairCount(participants, rounds), [participants, rounds]);

  // Each new undo offer restarts the timer.
  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), 8000);
    return () => clearTimeout(timer);
  }, [undo]);

  const offerUndo = (message: string) => setUndo({ message, snapshot: { participants, rounds } });

  const restore = () => {
    if (!undo?.snapshot) return;
    setParticipants(undo.snapshot.participants);
    setRounds(undo.snapshot.rounds);
    setUndo(null);
    setDrawFailedFor(null);
  };

  const replaceAll = (snapshot: Snapshot) => {
    setParticipants(snapshot.participants);
    setRounds(snapshot.rounds);
    setUndo(null);
    setDrawFailedFor(null);
    setDrawnId(null);
    setManualId(null);
  };

  const enterExample = () => {
    if (isExample) return;
    setOwnData({ participants, rounds });
    setExampleNames(t.sampleNames);
    const sample = createSample(t.sampleNames);
    replaceAll({ participants: sample.participants, rounds: sample.rounds.map((pairs) => createRound(pairs)) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exitExample = () => {
    if (!ownData) return;
    replaceAll(ownData);
    setOwnData(null);
  };

  const saveSession = () =>
    downloadSession({ participants, rounds: rounds.map((round) => round.pairs) }, t.sessionFileName);

  const loadSession = async (file: File) => {
    const data = parseSession(await file.text());
    if (!data) {
      setUndo({ message: t.sessionInvalid });
      return;
    }
    // Loading from the example replaces the user's own data, so undo brings that back.
    const previous = ownData ?? { participants, rounds };
    setOwnData(null);
    replaceAll({ participants: data.participants, rounds: data.rounds.map((pairs) => createRound(pairs)) });
    setUndo({ message: t.sessionLoaded, snapshot: previous });
  };

  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      window.localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      // Worst case the welcome shows again next time.
    }
  };

  const drawRound = () => {
    setDrawFailedFor(null);
    setIsDrawing(true);
    // Defer the (potentially long-running) search so the button can show its busy state first.
    setTimeout(() => {
      try {
        const pairs = generateNextRound(participants, rounds.map((round) => round.pairs));
        const round = createRound(pairs);
        setRounds((current) => [...withoutEmptyRounds(current), round]);
        setDrawnId(round.id);
        setManualId(null);
      } catch {
        setDrawFailedFor({ participants, rounds });
      } finally {
        setIsDrawing(false);
      }
    }, 10);
  };

  const addManualRound = () => {
    const round = createRound();
    setRounds((current) => [...withoutEmptyRounds(current), round]);
    setManualId(round.id);
    setDrawFailedFor(null);
  };

  const applyText = (pairsPerRound: Pair[][], newPeople: string[]) => {
    offerUndo(t.textApplied);
    setParticipants((current) => [...current, ...newPeople]);
    setRounds(pairsPerRound.map((pairs) => createRound(pairs)));
    setDrawnId(null);
    setManualId(null);
    setDrawFailedFor(null);
  };

  const exportPdf = async () => {
    setIsExporting(true);
    try {
      const { downloadPdf } = await import("@/lib/pdf");
      await downloadPdf({ participants, rounds, analyses, t, locale });
    } finally {
      setIsExporting(false);
    }
  };

  const updateRound = (id: number, pairs: Pair[]) =>
    setRounds((current) => current.map((round) => (round.id === id ? { ...round, pairs } : round)));

  const removeRound = (id: number, number: number) => {
    offerUndo(t.roundDeleted(number));
    setRounds((current) => current.filter((round) => round.id !== id));
  };

  const removeParticipant = (name: string) => {
    offerUndo(t.personRemoved(name));
    setParticipants((current) => current.filter((participant) => participant !== name));
  };

  const startOver = () => {
    offerUndo(t.everythingCleared);
    setParticipants([]);
    setRounds([]);
    setDrawFailedFor(null);
  };

  const canDraw = participants.length >= 2 && !isDrawing;
  const drawFailed = drawFailedFor?.participants === participants && drawFailedFor.rounds === rounds;
  const hasData = participants.length > 0 || rounds.length > 0;
  const latest = rounds.at(-1);
  const history = rounds.slice(0, -1);
  const [openBefore, openAfter] = splitAt(t.openPairs(openPairs), "n");

  const roundCard = (round: Round, index: number, featured: boolean) => (
    <RoundCard
      key={round.id}
      number={index + 1}
      round={round}
      analysis={analyses[index]}
      featured={featured}
      animate={featured && round.id === drawnId}
      startInEditMode={featured && round.id === manualId}
      onChange={(pairs) => updateRound(round.id, pairs)}
      onRemove={() => removeRound(round.id, index + 1)}
      onEmptied={() =>
        round.id === manualId
          ? setRounds((current) => current.filter((other) => other.id !== round.id))
          : removeRound(round.id, index + 1)
      }
    />
  );

  return (
    <>
      {isExample && (
        <div className="sticky top-0 z-20 bg-ink text-page">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 text-sm sm:px-6">
            <p>{t.exampleBanner}</p>
            <button
              type="button"
              onClick={exitExample}
              className="h-9 rounded-full bg-page px-4 font-semibold text-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page"
            >
              {t.exitExample}
            </button>
          </div>
        </div>
      )}

      <header className="mx-auto max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Logo className="size-8 shrink-0 sm:size-9" />
            <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{t.appName}</span>
          </div>
          <SettingsMenu />
        </div>
        <h1 className="mt-8 max-w-2xl font-display text-3xl leading-tight font-semibold tracking-tight sm:mt-10 sm:text-4xl">
          {t.headline}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted sm:text-lg">{t.subtitle}</p>
        <button
          type="button"
          onClick={() => setIsOnboardingOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M8 8a2 2 0 1 1 2.8 1.8c-.5.2-.8.7-.8 1.2v.5M10 14h.01" />
          </svg>
          {t.help}
        </button>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10 lg:py-10">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <ParticipantList
            participants={participants}
            onAdd={(names) => setParticipants((current) => [...current, ...names])}
            onRemove={removeParticipant}
          />
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="rounded-3xl bg-accent-soft p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="primary" onClick={drawRound} disabled={!canDraw} aria-busy={isDrawing}>
                <svg viewBox="0 0 20 20" className={`size-5 ${isDrawing ? "animate-spin" : ""}`} aria-hidden="true">
                  <path d="M3 6h3.5a4 4 0 0 1 3.3 1.7l.4.6M17 14h-3.5a4 4 0 0 1-3.3-1.7l-.4-.6M3 14h3.5a4 4 0 0 0 3.3-1.7l2.4-3.6A4 4 0 0 1 15.5 7H17M15 4.5 17 6.5l-2 2M15 11.5l2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {isDrawing ? t.drawing : t.drawRound(rounds.length + 1)}
              </Button>
              <Button variant="secondary" onClick={addManualRound} disabled={participants.length < 2}>
                {t.addPastRound}
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              {participants.length < 2 ? (
                t.needTwoPeople
              ) : openPairs > 0 ? (
                <>
                  {openBefore}
                  <strong className="font-semibold text-ink tabular-nums">{openPairs}</strong>
                  {openAfter}
                </>
              ) : (
                t.allPairsUsed
              )}
            </p>
            {drawFailed && (
              <p role="alert" className="mt-4 rounded-2xl bg-alert-soft px-4 py-3 text-sm text-alert">
                {t.noRoundPossible}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-x-6 border-t border-accent/15 pt-3 text-sm">
              <Button variant="text" onClick={exportPdf} disabled={rounds.length === 0 || isExporting}>
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
                </svg>
                {isExporting ? t.preparingPdf : t.downloadPdf}
              </Button>
              <Button variant="text" onClick={() => setIsTextEditorOpen(true)}>
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 5h12M4 10h12M4 15h7" />
                </svg>
                {t.editAsText}
              </Button>
            </div>
          </div>

          {!latest ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-14 text-center">
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="flex -space-x-3">
                  <span className="size-11 rounded-full ring-4 ring-page" style={{ background: "var(--p3-bg)" }} />
                  <span className="size-11 rounded-full ring-4 ring-page" style={{ background: "var(--p0-bg)" }} />
                </div>
                <div className="flex -space-x-3">
                  <span className="size-11 rounded-full ring-4 ring-page" style={{ background: "var(--p4-bg)" }} />
                  <span className="size-11 rounded-full ring-4 ring-page" style={{ background: "var(--p1-bg)" }} />
                </div>
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold">{t.noRoundsTitle}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{t.noRoundsText}</p>
              {!isExample && (
                <Button variant="secondary" className="mt-6" onClick={enterExample}>
                  {t.tryExample}
                </Button>
              )}
            </div>
          ) : (
            roundCard(latest, rounds.length - 1, true)
          )}

          {history.length > 0 && (
            <div>
              <h2 className="mt-4 mb-3 font-display text-xl font-semibold">{t.history}</h2>
              <div className="space-y-3">
                {history.map((round, index) => roundCard(round, index, false)).reverse()}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap gap-x-6 px-4 pt-4 pb-10 text-sm sm:px-6">
        <Button variant="text" onClick={saveSession} disabled={!hasData} title={t.saveSessionHint}>
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3v10M6 9l4 4 4-4M4 16h12" />
          </svg>
          {t.saveSession}
        </Button>
        <Button variant="text" onClick={() => fileInput.current?.click()} title={t.loadSessionHint}>
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13V3M6 7l4-4 4 4M4 16h12" />
          </svg>
          {t.loadSession}
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = ""; // allows loading the same file again
            if (file) void loadSession(file);
          }}
        />
        {isExample ? (
          <Button variant="text" onClick={exitExample}>
            {t.exitExample}
          </Button>
        ) : (
          <Button variant="text" onClick={enterExample}>
            {t.tryExample}
          </Button>
        )}
        <Button variant="danger" onClick={startOver} disabled={!hasData}>
          {t.startOver}
        </Button>
      </footer>

      <Onboarding open={isOnboardingOpen} onClose={closeOnboarding} onTryExample={enterExample} />
      <RoundTextEditor
        open={isTextEditorOpen}
        rounds={rounds.map((round) => round.pairs)}
        participants={participants}
        onApply={applyText}
        onClose={() => setIsTextEditorOpen(false)}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-20 flex justify-center px-4">
        {undo && (
          <div
            className={`pointer-events-auto flex min-h-12 animate-pop-in items-center gap-3 rounded-full bg-ink py-1.5 pl-5 text-sm text-page shadow-xl ${
              undo.snapshot ? "pr-1.5" : "pr-5"
            }`}
          >
            <span>{undo.message}</span>
            {undo.snapshot && (
              <button
                type="button"
                onClick={restore}
                className="h-9 rounded-full bg-page/15 px-4 font-semibold hover:bg-page/25 focus-visible:outline-2 focus-visible:outline-page"
              >
                {t.undo}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
