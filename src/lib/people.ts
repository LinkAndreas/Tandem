export const PERSON_COLOR_COUNT = 8;

/** Stable color slot per name, so a person looks the same everywhere (see --p0…--p7 in globals.css). */
export function colorIndex(name: string): number {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % PERSON_COLOR_COUNT;
}

export function initials(name: string): string {
  const parts = name.replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
