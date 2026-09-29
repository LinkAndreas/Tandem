export type Pair = string[];
export type Round = { id: number; pairs: Pair[] };

let nextRoundId = 1;
export const createRound = (pairs: Pair[] = []): Round => ({ id: nextRoundId++, pairs });

export function pairKey(a: string, b: string): string {
  return [a, b].sort((x, y) => x.localeCompare(y)).join("\u0000");
}

/** Splits pasted text (lines or semicolons) into clean, unique names. */
export function splitNames(text: string): string[] {
  return [...new Set(text.split(/[\n;]+/).map((name) => name.trim()).filter((name) => name !== ""))];
}

export type RoundAnalysis = {
  /** Pair keys that already occurred in an earlier round, mapped to that round's number. */
  repeatedPairs: Map<string, number>;
  /** Names that are no longer part of the group. */
  unknownNames: Set<string>;
  /** Group members that are not assigned in this round. */
  unassigned: string[];
};

export function analyzeRounds(participants: string[], rounds: Round[]): RoundAnalysis[] {
  const participantSet = new Set(participants);
  const seenPairs = new Map<string, number>();

  return rounds.map((round, index) => {
    const repeatedPairs = new Map<string, number>();
    for (const pair of round.pairs) {
      if (pair.length !== 2) continue;
      const earlierRound = seenPairs.get(pairKey(pair[0], pair[1]));
      if (earlierRound !== undefined) repeatedPairs.set(pairKey(pair[0], pair[1]), earlierRound);
    }
    for (const pair of round.pairs) {
      if (pair.length !== 2) continue;
      const key = pairKey(pair[0], pair[1]);
      if (!seenPairs.has(key)) seenPairs.set(key, index + 1);
    }

    const names = new Set(round.pairs.flat());
    return {
      repeatedPairs,
      unknownNames: new Set([...names].filter((name) => !participantSet.has(name))),
      unassigned: participants.filter((name) => !names.has(name)),
    };
  });
}

/** Number of pairings within the group that have not happened yet. */
export function openPairCount(participants: string[], rounds: Round[]): number {
  const participantSet = new Set(participants);
  const used = new Set<string>();
  for (const round of rounds) {
    for (const pair of round.pairs) {
      if (pair.length === 2 && participantSet.has(pair[0]) && participantSet.has(pair[1])) {
        used.add(pairKey(pair[0], pair[1]));
      }
    }
  }
  return (participants.length * (participants.length - 1)) / 2 - used.size;
}
