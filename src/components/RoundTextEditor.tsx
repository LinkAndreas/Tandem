'use client';

import { useMemo, useState } from "react";
import type { Pair } from "@/lib/rounds";
import { formatRoundsText, parseRoundsText } from "@/lib/roundText";
import { useSettings } from "@/lib/settings";
import Dialog from "./Dialog";
import { Button } from "./ui";

type Props = {
  open: boolean;
  rounds: Pair[][];
  participants: string[];
  onApply: (rounds: Pair[][], newPeople: string[]) => void;
  onClose: () => void;
};

export default function RoundTextEditor(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} labelledBy="text-editor-title" className="w-[min(44rem,calc(100%-2rem))]">
      <Editor {...props} />
    </Dialog>
  );
}

// Mounted fresh each time the dialog opens, so the text always starts from the current rounds.
function Editor({ rounds, participants, onApply, onClose }: Props) {
  const { t } = useSettings();
  const [text, setText] = useState(() => formatRoundsText(rounds, t.round));

  const parsed = useMemo(() => parseRoundsText(text), [text]);
  // Lines with more than two names would be dropped, so they must be fixed before applying.
  const hasBlockingIssue = parsed.issues.some((issue) => issue.kind === "tooManyNames");

  // Match names case-insensitively against everyone known so far – the group and people in earlier
  // rounds (who may have left the group) – so "anna m." becomes "Anna M." and nobody is re-added.
  const { normalizedRounds, newPeople } = useMemo(() => {
    const known = new Map<string, string>();
    for (const name of [...participants, ...rounds.flat(2)]) {
      if (!known.has(name.toLowerCase())) known.set(name.toLowerCase(), name);
    }
    const normalized = parsed.rounds.map((round) =>
      round.map((pair) => pair.map((name) => known.get(name.toLowerCase()) ?? name))
    );
    const added = new Map<string, string>();
    for (const name of normalized.flat(2)) {
      if (!known.has(name.toLowerCase()) && !added.has(name.toLowerCase())) added.set(name.toLowerCase(), name);
    }
    return { normalizedRounds: normalized, newPeople: [...added.values()] };
  }, [parsed, participants, rounds]);

  const pairCount = normalizedRounds.reduce((sum, round) => sum + round.filter((pair) => pair.length === 2).length, 0);

  return (
    <form
      method="dialog"
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (hasBlockingIssue) return;
        onApply(normalizedRounds, newPeople);
        onClose();
      }}
    >
      <div className="px-6 pt-7 sm:px-8">
        <h2 id="text-editor-title" className="font-display text-2xl font-semibold">{t.textEditorTitle}</h2>
        <p className="mt-1 text-sm text-muted">{t.textEditorIntro}</p>

        <details className="group mt-4 rounded-2xl bg-page px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium text-accent marker:content-none">
            <span className="inline-block transition group-open:rotate-90">›</span> {t.textFormatTitle}
          </summary>
          <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto]">
            <ul className="list-disc space-y-1 pl-4 text-muted">
              {t.textFormatRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <pre className="rounded-xl border border-line bg-surface px-3 py-2 font-mono text-xs leading-5 text-ink">{t.textExample}</pre>
          </div>
        </details>

        <label htmlFor="rounds-text" className="sr-only">{t.textEditorLabel}</label>
        <textarea
          id="rounds-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.textExample}
          rows={14}
          spellCheck={false}
          autoFocus
          className="mt-4 block w-full resize-y rounded-2xl border border-line bg-page px-4 py-3 font-mono text-sm leading-6 placeholder:text-faint focus:border-accent focus:ring-4 focus:ring-accent/15 focus:outline-none"
        />

        <div className="mt-3 space-y-1.5 text-sm" aria-live="polite">
          <p className="font-medium text-accent">{t.textRecognized(normalizedRounds.length, pairCount)}</p>
          {newPeople.length > 0 && <p className="text-muted">{t.textNewPeople(newPeople)}</p>}
          {parsed.issues.map((issue) => (
            <p key={JSON.stringify(issue)} className="text-alert">
              {issue.kind === "tooManyNames" ? t.textTooManyNames(issue.line) : t.textDuplicateName(issue.round, issue.name)}
            </p>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col-reverse gap-2 border-t border-line bg-surface px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
        <Button variant="secondary" onClick={onClose}>{t.cancel}</Button>
        <Button type="submit" variant="primary" disabled={hasBlockingIssue}>{t.textApply}</Button>
      </div>
    </form>
  );
}
