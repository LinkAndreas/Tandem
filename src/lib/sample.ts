import type { Pair } from "./rounds";

const ROUNDS = 8;

/**
 * Round-robin circle method: the first person stays fixed while everyone else rotates one seat per
 * round. This yields up to people.length - 1 rounds in which no pair ever repeats.
 */
function circleRounds(names: string[], count: number): Pair[][] {
  const [fixed, ...rotating] = names;
  return Array.from({ length: count }, (_, round) => {
    const seats = [...rotating.slice(round), ...rotating.slice(0, round)];
    const pairs: Pair[] = [[fixed, seats[0]]];
    for (let i = 1; i < names.length / 2; i++) pairs.push([seats[i], seats[seats.length - i]]);
    return pairs;
  });
}

/** Example group for the example mode: ten fictional people, eight rounds without any repeated pair. */
export function createSample(names: string[]) {
  return { participants: names, rounds: circleRounds(names, ROUNDS) };
}
