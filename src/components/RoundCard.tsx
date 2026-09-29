'use client';

import { useEffect, useRef, useState } from "react";
import { pairKey, type Pair, type Round, type RoundAnalysis } from "@/lib/rounds";
import { splitAt } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { Avatar, Button } from "./ui";

type Props = {
  number: number;
  round: Round;
  analysis: RoundAnalysis;
  featured: boolean;
  animate: boolean;
  startInEditMode: boolean;
  onChange: (pairs: Pair[]) => void;
  onRemove: () => void;
  /** Called when editing ends with no pairs left. */
  onEmptied: () => void;
};

export default function RoundCard({ number, round, analysis, featured, animate, startInEditMode, onChange, onRemove, onEmptied }: Props) {
  const { t } = useSettings();
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (startInEditMode) ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [startInEditMode]);

  const { pairs } = round;
  const { repeatedPairs, unknownNames, unassigned } = analysis;

  const pickName = (name: string) => {
    if (selected === null) return setSelected(name);
    if (selected === name) return setSelected(null);
    onChange([...pairs, [selected, name]]);
    setSelected(null);
  };

  const finishEditing = () => {
    if (pairs.length === 0) return onEmptied();
    setIsEditing(false);
    setSelected(null);
  };

  const copy = async () => {
    const lines = pairs.map((pair) => (pair.length === 2 ? `${pair[0]} & ${pair[1]}` : `${pair[0]} (${t.sitsOut})`));
    try {
      await navigator.clipboard.writeText([t.copyHeading(number), ...lines].join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; nothing else to do.
    }
  };

  return (
    <article
      ref={ref}
      aria-labelledby={`round-${round.id}`}
      className={`scroll-mt-6 border bg-surface ${
        featured ? "rounded-3xl border-line p-5 shadow-[0_1px_0_var(--line),0_12px_32px_-16px_rgb(0_0_0/0.18)] sm:p-7" : "rounded-2xl border-line/70 p-4 sm:p-5"
      }`}
    >
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          {featured && (
            <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-accent uppercase">
              {isEditing ? t.editingRound : t.currentRound}
            </p>
          )}
          <h3 id={`round-${round.id}`} className={`font-display font-semibold ${featured ? "text-3xl" : "text-lg"}`}>
            {t.round(number)}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 text-sm">
          {isEditing ? (
            <Button variant="text" onClick={finishEditing} className="font-semibold text-accent">
              {t.done}
            </Button>
          ) : (
            <>
              <Button variant="text" onClick={copy} disabled={pairs.length === 0}>
                {copied ? t.copied : t.copy}
              </Button>
              <Button variant="text" onClick={() => setIsEditing(true)}>
                {t.edit}
              </Button>
              <Button variant="danger" onClick={onRemove}>
                {t.delete}
              </Button>
            </>
          )}
        </div>
      </header>

      {pairs.length > 0 && (
        <ul className={`grid sm:grid-cols-2 ${featured ? "mt-5 gap-3" : isEditing ? "mt-3 gap-2" : "mt-3 gap-x-6 gap-y-1"}`}>
          {pairs.map((pair, index) => {
            const earlierRound = pair.length === 2 ? repeatedPairs.get(pairKey(pair[0], pair[1])) : undefined;
            return (
              <li
                key={`${index}:${pair.join("|")}`}
                className={`${animate ? "animate-pop-in" : ""} ${
                  featured
                    ? `flex items-center gap-3 rounded-2xl px-3 py-3 ${earlierRound ? "bg-alert-soft" : "bg-page"}`
                    : isEditing
                      ? // While editing, each pair gets its own frame so its button clearly belongs to it.
                        `flex min-h-12 items-center gap-2.5 rounded-2xl py-1.5 pr-1.5 pl-2 ${earlierRound ? "bg-alert-soft" : "bg-page"}`
                      : "flex min-h-10 items-center gap-2.5 py-1"
                }`}
                style={animate ? { animationDelay: `${index * 70}ms` } : undefined}
              >
                <div className={`flex shrink-0 ${featured ? "-space-x-2.5" : "-space-x-1"}`}>
                  {pair.map((name) => (
                    <Avatar
                      key={name}
                      name={name}
                      size={featured ? "lg" : "sm"}
                      className={`ring-[3px] ${featured || isEditing ? (earlierRound ? "ring-alert-soft" : "ring-page") : "ring-surface"}`}
                    />
                  ))}
                </div>
                <div className={`min-w-0 flex-1 ${featured ? "" : "text-sm"}`}>
                  {featured ? (
                    <>
                      <PersonName name={pair[0]} unknown={unknownNames.has(pair[0])} className="block leading-snug font-medium" />
                      {pair.length === 2 ? (
                        <PersonName name={pair[1]} unknown={unknownNames.has(pair[1])} className="mt-1 block leading-snug font-medium" />
                      ) : (
                        <span className="mt-1 block text-sm leading-snug text-muted">{t.sitsOutThisRound}</span>
                      )}
                    </>
                  ) : (
                    <span className="block">
                      <PersonName name={pair[0]} unknown={unknownNames.has(pair[0])} />
                      {pair.length === 2 ? (
                        <>
                          <span className="mx-1 text-faint">&amp;</span>
                          <PersonName name={pair[1]} unknown={unknownNames.has(pair[1])} />
                        </>
                      ) : (
                        <span className="ml-1 text-muted">{t.sitsOut}</span>
                      )}
                    </span>
                  )}
                  {earlierRound && (
                    <span className="block text-xs text-alert">{t.repeatedIn(earlierRound)}</span>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => onChange(pairs.filter((_, i) => i !== index))}
                    aria-label={`${t.unpair}: ${pair.join(" & ")}`}
                    className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm font-medium text-muted transition hover:border-alert/40 hover:bg-alert-soft hover:text-alert focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true">
                      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {t.unpair}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {isEditing ? (
        <div className="mt-5 rounded-2xl border border-dashed border-line bg-page p-4">
          {unassigned.length > 0 ? (
            <>
              <p className="text-sm text-muted">
                {selected ? (
                  <>
                    {splitAt(t.pairWith, "name")[0]}
                    <strong className="font-semibold text-ink">{selected}</strong>
                    {splitAt(t.pairWith, "name")[1]}
                  </>
                ) : (
                  t.tapTwoNames
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {unassigned.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={selected === name}
                    onClick={() => pickName(name)}
                    className={`flex h-11 items-center gap-2 rounded-full border py-1 pr-4 pl-1 text-sm transition active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-accent ${
                      selected === name
                        ? "border-ink bg-select font-medium"
                        : "border-line bg-surface hover:border-ink/40"
                    }`}
                  >
                    <Avatar name={name} size="md" />
                    {name}
                  </button>
                ))}
              </div>
              {selected && unassigned.length === 1 && (
                <button
                  type="button"
                  onClick={() => {
                    onChange([...pairs, [selected]]);
                    setSelected(null);
                  }}
                  className="mt-3 text-sm text-muted underline underline-offset-4 hover:text-ink"
                >
                  {t.personSitsOut(selected)}
                </button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">{t.everyonePaired}</p>
          )}
        </div>
      ) : (
        <>
          {pairs.length === 0 && <p className="mt-3 text-sm text-muted">{t.emptyRound}</p>}
          {/* Only the current round: older rounds would list everyone who joined the group later. */}
          {featured && pairs.length > 0 && unassigned.length > 0 && (
            <p className={`text-sm text-muted ${featured ? "mt-4" : "mt-2"}`}>{t.unassigned(unassigned)}</p>
          )}
        </>
      )}
    </article>
  );
}

function PersonName({ name, unknown, className = "" }: { name: string; unknown: boolean; className?: string }) {
  const notInGroupTitle = useSettings().t.notInGroup;
  return unknown ? (
    <span className={`text-muted line-through decoration-faint ${className}`} title={notInGroupTitle}>{name}</span>
  ) : (
    <span className={className}>{name}</span>
  );
}
