'use client';

import type { ReactNode } from "react";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n";
import { useSettings, type Theme } from "@/lib/settings";

const themeIcons: Record<Theme, ReactNode> = {
  light: (
    <>
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1 1M14.3 14.3l1 1M4.7 15.3l1-1M14.3 5.7l1-1" />
    </>
  ),
  dark: <path d="M16.5 12.2A6.5 6.5 0 0 1 7.8 3.5a6.5 6.5 0 1 0 8.7 8.7Z" />,
  system: (
    <>
      <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" />
      <path d="M7 16.5h6M10 13.5v3" />
    </>
  ),
};

export default function SettingsMenu() {
  const { t, locale, theme, setLocale, setTheme } = useSettings();
  const themeLabels: Record<Theme, string> = { light: t.themeLight, dark: t.themeDark, system: t.themeSystem };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* A styled pill with the native select laid invisibly on top, so phones get their own picker. */}
      <div className="relative flex h-9 items-center gap-1 rounded-full border border-line bg-surface pr-2.5 pl-2.5 sm:h-10 sm:gap-1.5 sm:pr-3 sm:pl-3 text-sm font-medium hover:border-ink/40 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
        <svg viewBox="0 0 20 20" className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M2.5 10h15M10 2.5c2 2.2 2.8 4.7 2.8 7.5s-.8 5.3-2.8 7.5c-2-2.2-2.8-4.7-2.8-7.5s.8-5.3 2.8-7.5Z" />
        </svg>
        <span aria-hidden="true" className="uppercase sm:hidden">{locale}</span>
        <span aria-hidden="true" className="hidden sm:inline">{LOCALE_NAMES[locale]}</span>
        <svg viewBox="0 0 20 20" className="size-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 8 4 4 4-4" />
        </svg>
        <label htmlFor="locale" className="sr-only">{t.language}</label>
        <select
          id="locale"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="absolute inset-0 cursor-pointer appearance-none rounded-full opacity-0"
        >
          {LOCALES.map((code) => (
            <option key={code} value={code}>
              {LOCALE_NAMES[code]}
            </option>
          ))}
        </select>
      </div>

      <div role="group" aria-label={t.theme} className="flex h-9 items-center rounded-full border border-line bg-surface p-0.5 sm:h-10 sm:p-1">
        {(["light", "dark", "system"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={theme === option}
            aria-label={themeLabels[option]}
            title={themeLabels[option]}
            onClick={() => setTheme(option)}
            className={`flex size-7.5 items-center justify-center rounded-full transition sm:size-8 focus-visible:outline-2 focus-visible:outline-accent ${
              theme === option ? "bg-accent text-on-accent" : "text-muted hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {themeIcons[option]}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
