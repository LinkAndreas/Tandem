'use client';

import { useState, type FormEvent } from "react";
import { splitNames } from "@/lib/rounds";
import { useSettings } from "@/lib/settings";
import { Avatar, Button } from "./ui";

type Props = {
  participants: string[];
  onAdd: (names: string[]) => void;
  onRemove: (name: string) => void;
};

export default function ParticipantList({ participants, onAdd, onRemove }: Props) {
  const { t } = useSettings();
  const [draft, setDraft] = useState("");
  const [bulkDraft, setBulkDraft] = useState("");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  // Names that were already in the group; rendered at display time so the hint follows the language.
  const [duplicates, setDuplicates] = useState<string[]>([]);

  const addNames = (names: string[]) => {
    // Names are compared case-insensitively, so "ben k." is recognised as the existing "Ben K.".
    const taken = new Set(participants.map((name) => name.toLowerCase()));
    const existing: string[] = [];
    const added: string[] = [];
    for (const name of names) {
      if (taken.has(name.toLowerCase())) {
        existing.push(participants.find((participant) => participant.toLowerCase() === name.toLowerCase()) ?? name);
      } else {
        added.push(name);
        taken.add(name.toLowerCase());
      }
    }
    if (added.length > 0) onAdd(added);
    setDuplicates(existing);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const names = splitNames(draft);
    if (names.length === 0) return;
    addNames(names);
    setDraft("");
  };

  const submitBulk = () => {
    addNames(splitNames(bulkDraft));
    setBulkDraft("");
    setIsBulkOpen(false);
  };

  const bulkCount = splitNames(bulkDraft).length;

  return (
    <section aria-labelledby="group-title" className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 id="group-title" className="font-display text-2xl font-semibold">{t.group}</h2>
        <span className="text-sm text-muted tabular-nums">{t.people(participants.length)}</span>
      </div>

      {isBulkOpen ? (
        <div className="mt-4">
          <label htmlFor="bulk-participants" className="text-sm font-medium">{t.bulkLabel}</label>
          <p id="bulk-help" className="mt-1 text-sm text-muted">{t.bulkHelp}</p>
          <textarea
            id="bulk-participants"
            aria-describedby="bulk-help"
            autoFocus
            rows={7}
            value={bulkDraft}
            onChange={(e) => setBulkDraft(e.target.value)}
            placeholder={t.sampleNames.slice(0, 3).join("\n")}
            className="mt-3 block w-full resize-y rounded-2xl border border-line bg-page px-4 py-3 text-base leading-7 placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none sm:text-sm"
          />
          <div className="mt-3 flex gap-2">
            <Button variant="primary" className="h-11 flex-1 text-sm" onClick={submitBulk} disabled={bulkCount === 0}>
              {t.bulkAdd(bulkCount)}
            </Button>
            <Button variant="secondary" className="h-11" onClick={() => setIsBulkOpen(false)}>
              {t.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={submit} className="relative mt-4">
            <label htmlFor="new-participant" className="sr-only">{t.nameLabel}</label>
            <input
              id="new-participant"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setDuplicates([]);
              }}
              onPaste={(e) => {
                // A pasted list goes straight into the list view.
                const text = e.clipboardData.getData("text");
                if (/[\n;]/.test(text.trim())) {
                  e.preventDefault();
                  setBulkDraft(text);
                  setIsBulkOpen(true);
                }
              }}
              placeholder={t.namePlaceholder}
              autoComplete="off"
              enterKeyHint="done"
              className="h-12 w-full rounded-full border border-line bg-page pr-14 pl-5 text-base placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none sm:text-sm"
            />
            <button
              type="submit"
              disabled={draft.trim() === ""}
              aria-label={t.add}
              title={t.add}
              className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-full bg-accent text-on-accent transition hover:brightness-110 disabled:bg-raised disabled:text-faint"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <button
            type="button"
            onClick={() => setIsBulkOpen(true)}
            className="mt-2 ml-5 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
              <path d="M3 4h10M3 8h10M3 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {t.bulkToggle}
          </button>
        </>
      )}
      {duplicates.length > 0 && <p className="mt-2 text-sm text-note" role="status">{t.alreadyInGroup(duplicates)}</p>}

      {participants.length === 0 ? (
        <div className="mt-6 flex flex-col items-center pb-2 text-center">
          <div className="flex -space-x-3" aria-hidden="true">
            {["Anna", "Ben", "Clara"].map((name) => (
              <Avatar key={name} name={name} size="lg" className="ring-4 ring-surface" />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{t.emptyGroup}</p>
        </div>
      ) : (
        <ul
          // On large screens a long list scrolls inside the panel so the sticky sidebar stays usable.
          className="mt-5 grid content-start gap-1.5 lg:-mr-2 lg:max-h-[max(16rem,calc(100dvh-24rem))] lg:overflow-y-auto lg:pr-2"
        >
          {participants.map((name) => (
            <li
              key={name}
              className="group flex min-h-10 min-w-0 animate-pop-in items-center gap-2 rounded-[1.25rem] bg-page p-1"
            >
              <Avatar name={name} size="sm" />
              <span className="min-w-0 flex-1 text-sm leading-tight break-words">{name}</span>
              <button
                type="button"
                onClick={() => onRemove(name)}
                aria-label={t.removePerson(name)}
                title={t.remove}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-faint hover:bg-alert-soft hover:text-alert focus-visible:outline-2 focus-visible:outline-accent pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-visible:opacity-100"
              >
                <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {participants.length % 2 === 1 && (
        <p className="mt-3 rounded-xl bg-page px-3 py-2 text-sm text-muted">{t.oddGroup}</p>
      )}
    </section>
  );
}
