import { releases } from "@/content/releases";
import { MESSAGES, type Locale } from "@/lib/i18n";
import LegalLayout from "./LegalLayout";

const anchor = (version: string) => `v${version.replaceAll(".", "-")}`;

/** Version history in one language, from src/content/releases.ts. */
export default function VersionsPage({ locale }: { locale: Locale }) {
  const t = MESSAGES[locale];
  const month = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const toc = releases.map(({ version }) => ({ id: anchor(version), text: `${t.version} ${version}` }));
  return (
    <LegalLayout page="versions" locale={locale} meta={t.versionsLede} toc={toc}>
      {releases.map(({ version, date, notes }) => (
        <section key={version} aria-labelledby={anchor(version)} className="border-line not-first:border-t">
          <h2 id={anchor(version)}>
            {t.version} {version}
          </h2>
          <p className="legal-meta">
            <time dateTime={date}>{month.format(new Date(`${date}-01T12:00:00Z`))}</time>
          </p>
          <ul>
            {notes[locale].map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ))}
    </LegalLayout>
  );
}
