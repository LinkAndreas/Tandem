import { MESSAGES, labelSeparator, type Locale } from "@/lib/i18n";
import { headings, legalDocument, legalSite } from "@/lib/legal";
import LegalLayout from "./LegalLayout";

/** Legal Notice or Privacy Policy in one language, from src/content/legal. */
export default function LegalDocumentPage({ page, locale }: { page: "imprint" | "privacy"; locale: Locale }) {
  const html = legalDocument(page, locale);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(legalSite.effectiveDate));
  const meta =
    page === "privacy" ? (
      <>
        {MESSAGES[locale].lastUpdated}
        {labelSeparator(locale)}
        <time dateTime={legalSite.effectiveDate}>{date}</time>
      </>
    ) : undefined;
  return (
    <LegalLayout page={page} locale={locale} meta={meta} toc={headings(html)}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalLayout>
  );
}
