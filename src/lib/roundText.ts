import type { Pair } from "./rounds";

/**
 * Plain-text format for entering many rounds at once:
 *
 *   Runde 1
 *   Anna M. & Ben K.
 *   Clara S. & David L.
 *
 *   Runde 2
 *   Anna M. & Clara S.
 *   David L.            ← a single name sits out
 *
 * Rounds are separated by blank lines or heading lines ("Runde 2", "Round 2", "# …", "---").
 * Names within a pair may be separated by & + , ; / tab or a spaced dash.
 */

const SEPARATOR = /\s*(?:&|\+|,|;|\/|\t|\s[-–—]\s)\s*/;
const HEADING = /^(?:#.*|-{3,}|(?:runde|round|tour|ronda)\s*\d*\s*:?)$/i;

export type RoundTextIssue =
  | { kind: "tooManyNames"; line: number }
  | { kind: "duplicateName"; round: number; name: string };

export type ParsedRounds = { rounds: Pair[][]; issues: RoundTextIssue[] };

export function parseRoundsText(text: string): ParsedRounds {
  const rounds: Pair[][] = [];
  const issues: RoundTextIssue[] = [];
  let current: Pair[] = [];

  const closeRound = () => {
    if (current.length === 0) return;
    rounds.push(current);
    const seen = new Set<string>();
    const reported = new Set<string>();
    for (const name of current.flat()) {
      if (seen.has(name) && !reported.has(name)) {
        issues.push({ kind: "duplicateName", round: rounds.length, name });
        reported.add(name);
      }
      seen.add(name);
    }
    current = [];
  };

  text.split("\n").forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (line === "" || HEADING.test(line)) return closeRound();

    const names = line.split(SEPARATOR).map((name) => name.trim()).filter(Boolean);
    if (names.length > 2) {
      issues.push({ kind: "tooManyNames", line: index + 1 });
      return;
    }
    current.push(names);
  });
  closeRound();

  return { rounds, issues };
}

export function formatRoundsText(rounds: Pair[][], heading: (n: number) => string): string {
  return rounds
    .map((pairs, index) => [heading(index + 1), ...pairs.map((pair) => pair.join(" & "))].join("\n"))
    .join("\n\n");
}
