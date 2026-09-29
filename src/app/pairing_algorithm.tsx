/**
 * Draws the next round: pairs everyone with someone they have not been paired with before.
 *
 * Uses a randomized backtracking search (always pairing the person with the fewest remaining options
 * first), so it finds a valid round whenever one exists instead of relying on lucky shuffles. With an
 * odd number of participants, the person who has sat out least often sits out.
 *
 * Throws if no round without repeated pairs exists.
 */
export default function generateNextRound(
    participants: string[],
    previousRounds: string[][][]
): string[][] {
    const people = shuffled([...new Set(participants)]);
    const previousPairs = new Set<string>();
    const sitOutCount = new Map<string, number>();

    for (const round of previousRounds) {
        for (const pair of round) {
            if (pair.length === 2) {
                previousPairs.add(key(pair[0], pair[1]));
            } else if (pair.length === 1) {
                sitOutCount.set(pair[0], (sitOutCount.get(pair[0]) ?? 0) + 1);
            }
        }
    }

    const canPair = (a: string, b: string) => !previousPairs.has(key(a, b));

    if (people.length % 2 === 0) {
        const round = findPairs(people, canPair);
        if (round) return round;
    } else {
        // Try those who sat out least often first; the shuffle above breaks ties randomly.
        const candidates = [...people].sort((a, b) => (sitOutCount.get(a) ?? 0) - (sitOutCount.get(b) ?? 0));
        for (const sitter of candidates) {
            const round = findPairs(people.filter((person) => person !== sitter), canPair);
            if (round) return [...round, [sitter]];
        }
    }

    throw new Error("Unable to generate a round without repeated pairs.");
}

const MAX_STEPS = 200_000;

function findPairs(people: string[], canPair: (a: string, b: string) => boolean): string[][] | null {
    let steps = 0;

    const search = (open: string[]): string[][] | null => {
        if (open.length === 0) return [];
        if (++steps > MAX_STEPS) return null;

        // Pair the most constrained person first to fail fast.
        let person = open[0];
        let options = open.filter((other) => other !== person && canPair(person, other));
        for (const candidate of open.slice(1)) {
            const candidateOptions = open.filter((other) => other !== candidate && canPair(candidate, other));
            if (candidateOptions.length < options.length) {
                person = candidate;
                options = candidateOptions;
            }
        }

        for (const partner of options) {
            const rest = search(open.filter((other) => other !== person && other !== partner));
            if (rest) return [[person, partner], ...rest];
        }
        return null;
    };

    return search(people);
}

function key(a: string, b: string): string {
    return a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`;
}

function shuffled<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
