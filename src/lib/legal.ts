import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_URL_CODES, type Locale } from "./i18n";

// Settings and content of the legal pages (/imprint/<lang>, /privacy/<lang>, /versions/<lang>, where <lang>
// is the URL code from LOCALE_URL_CODES, e.g. pt-br, zh).
// Server-only: the pages are rendered at build time (static export).

export const legalSite = {
  url: "https://tandem.linkandreas.de",
  privacyEmail: "privacy@linkandreas.de",
  developer: {
    name: "Andreas Link",
    email: "feedback@linkandreas.de",
    address: ["Schwarzwaldstr. 22", "76473 Iffezheim", "Deutschland"],
  },
  /** Effective date of the legal pages (ISO). Update whenever their text changes. */
  effectiveDate: "2026-11-21",
};

export type LegalPage = "imprint" | "privacy" | "versions";

export const legalPath = (page: LegalPage, locale: Locale) => `/${page}/${LOCALE_URL_CODES[locale]}/`;

const escapeHtml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** The Legal Notice or Privacy Policy body from src/content/legal/<page>.<lang>.html, placeholders filled in. */
export function legalDocument(page: "imprint" | "privacy", locale: Locale): string {
  const { name, email, address } = legalSite.developer;
  const addressLines = [`<strong>${escapeHtml(name)}</strong>`, ...address.map(escapeHtml)];
  const html = readFileSync(join(process.cwd(), "src/content/legal", `${page}.${locale}.html`), "utf8")
    .replaceAll("{{developerName}}", escapeHtml(name))
    .replaceAll("{{developerEmail}}", email)
    .replaceAll("{{privacyEmail}}", legalSite.privacyEmail)
    .replaceAll("{{developerBlock}}", [...addressLines, `<a href="mailto:${email}">${email}</a>`].join("<br />\n  "))
    .replaceAll("{{developerAddress}}", addressLines.join("<br />\n  "));
  const unresolved = html.match(/\{\{\w+\}\}/);
  if (unresolved) throw new Error(`Unresolved placeholder ${unresolved[0]} in ${page}.${locale}.html`);
  return html;
}

/** Table of contents entries from the document's <h2 id="…"> headings. */
export function headings(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)].map(([, id, text]) => ({ id, text }));
}
