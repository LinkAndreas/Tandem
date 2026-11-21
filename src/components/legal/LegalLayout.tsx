import Link from "next/link";
import type { ReactNode } from "react";
import { LOCALE_NAMES, LOCALES, MESSAGES, labelSeparator, type Locale } from "@/lib/i18n";
import { legalPath, type LegalPage } from "@/lib/legal";
import { Logo } from "../ui";

const PAGES: LegalPage[] = ["imprint", "privacy", "versions"];

/** The frame of the Legal Notice, Privacy Policy and Version History pages. */
export default function LegalLayout({
  page,
  locale,
  meta,
  toc,
  children,
}: {
  page: LegalPage;
  locale: Locale;
  /** Line under the title, e.g. the effective date. */
  meta?: ReactNode;
  toc: { id: string; text: string }[];
  children: ReactNode;
}) {
  const t = MESSAGES[locale];
  const titles: Record<LegalPage, string> = { imprint: t.imprintTitle, privacy: t.privacyTitle, versions: t.versionsTitle };
  const shortTitles: Record<LegalPage, string> = { imprint: t.imprintShort, privacy: t.privacyShort, versions: t.versionsShort };

  return (
    <>
      {/* The root layout sets the app's saved language; these pages have their own. */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(locale)}` }} />

      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pt-5 sm:px-6 sm:pt-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-accent">
          <Logo className="size-8 shrink-0 sm:size-9" />
          <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{t.appName}</span>
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 shrink-0 items-center rounded-full bg-accent px-4 text-sm font-medium text-on-accent shadow-sm hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t.backToApp}
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="pt-8 pb-6 sm:pt-10">
          <h1 id="page-title" className="font-display text-3xl leading-tight font-semibold tracking-tight hyphens-auto sm:text-4xl">
            {titles[page]}
          </h1>
          {meta && <p className="mt-2 text-sm text-muted">{meta}</p>}
          <p className="mt-2 text-sm text-muted">
            {t.otherLanguages}
            {labelSeparator(locale)}
            {LOCALES.filter((code) => code !== locale).map((code, i) => (
              <span key={code}>
                {i > 0 && " · "}
                <a href={legalPath(page, code)} hrefLang={code} lang={code} className="whitespace-nowrap text-accent underline-offset-4 hover:underline">
                  {LOCALE_NAMES[code]}
                </a>
              </span>
            ))}
          </p>
        </div>

        <div className={`grid gap-6 pb-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-10 ${page === "versions" ? "max-lg:[&>nav]:hidden" : ""}`}>
          <nav aria-labelledby="toc-title" className="lg:sticky lg:top-6">
            <h2 id="toc-title" className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
              {t.contents}
            </h2>
            <ol role="list" className="space-y-1.5 text-sm">
              {toc.map(({ id, text }) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-muted hover:text-ink" dangerouslySetInnerHTML={{ __html: text }} />
                </li>
              ))}
            </ol>
          </nav>
          <article aria-labelledby="page-title" className="legal rounded-2xl border border-line bg-surface px-5 pt-2 pb-6 sm:px-7">
            {children}
          </article>
        </div>
      </main>

      <footer className="mx-auto max-w-5xl border-t border-line px-4 pt-5 pb-10 text-sm sm:px-6">
        <nav aria-label={t.legalNav} className="flex flex-wrap gap-x-6 gap-y-2">
          {PAGES.map((p) => (
            <a
              key={p}
              href={legalPath(p, locale)}
              aria-current={p === page ? "page" : undefined}
              className={`underline-offset-4 hover:underline ${p === page ? "text-ink" : "text-muted hover:text-ink"}`}
            >
              {shortTitles[p]}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}
