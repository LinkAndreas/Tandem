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
 * Rounds are separated by blank lines or heading lines ("Runde 2", "Round 2", "Раунд 2", "第 2 轮", "# …", "---"),
 * i.e. what `round(n)` produces in any language. Names within a pair may be separated by & + , ; / tab or a
 * spaced dash, or by their full-width forms ＆ ＋ 、 ， ； ／ used with CJK input.
 */

const SEPARATOR = /\s*(?:[&+,;/\t＆＋、，；／]|\s[-–—]\s)\s*/;
const HEADING =
  /^(?:#.*|-{3,}|(?:runde|round|tour|ronda|turno|rodada|ronde|раунд|ラウンド|라운드)\s*\d*\s*[:：]?|第\s*\d*\s*(?:轮|輪)\s*[:：]?)$/iu;

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
