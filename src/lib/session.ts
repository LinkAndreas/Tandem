import type { Pair } from "./rounds";

/** A saved session: the group and all rounds, as a small JSON file. */
export type SessionData = { participants: string[]; rounds: Pair[][] };

const APP = "tandem";
const VERSION = 1;

export function serializeSession(data: SessionData): string {
  return JSON.stringify({ app: APP, version: VERSION, savedAt: new Date().toISOString(), ...data }, null, 2);
}

/** Returns the session stored in the file's text, or null if it is not a valid Tandem session. */
export function parseSession(text: string): SessionData | null {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const { app, participants, rounds } = data as Record<string, unknown>;

  const isName = (value: unknown): value is string => typeof value === "string" && value.trim() !== "";
  const isPair = (value: unknown): value is Pair =>
    Array.isArray(value) && (value.length === 1 || value.length === 2) && value.every(isName);
  const isRound = (value: unknown): value is Pair[] => Array.isArray(value) && value.every(isPair);

  if (app !== APP) return null;
  if (!Array.isArray(participants) || !participants.every(isName)) return null;
  if (!Array.isArray(rounds) || !rounds.every(isRound)) return null;

  return { participants: [...new Set(participants.map((name) => name.trim()))], rounds };
}

export function downloadSession(data: SessionData, fileName: string) {
  const blob = new Blob([serializeSession(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
