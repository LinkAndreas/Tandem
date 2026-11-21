import type { Metadata } from "next";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";
import { notFound } from "next/navigation";
import { LOCALE_URL_CODES, LOCALES, MESSAGES, localeFromUrlCode, type Locale } from "@/lib/i18n";
import { legalPath, legalSite } from "@/lib/legal";

/** `lang` is the URL code of the language (LOCALE_URL_CODES), e.g. pt-br. */
type Props = { params: Promise<{ lang: string }> };

async function pageLocale(params: Props["params"]): Promise<Locale> {
  const locale = localeFromUrlCode((await params).lang);
  if (!locale) notFound();
  return locale;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: LOCALE_URL_CODES[locale] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await pageLocale(params);
  const t = MESSAGES[locale];
  return {
    title: `${t.privacyTitle} – Tandem`,
    description: t.privacyDescription,
    alternates: {
      canonical: `${legalSite.url}${legalPath("privacy", locale)}`,
      languages: Object.fromEntries(LOCALES.map((code) => [code, `${legalSite.url}${legalPath("privacy", code)}`])),
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await pageLocale(params);
  return <LegalDocumentPage page="privacy" locale={locale} />;
}
