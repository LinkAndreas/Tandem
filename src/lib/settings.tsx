'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LOCALES, MESSAGES, detectLocale, type Locale, type Messages } from "./i18n";

export type Theme = "system" | "light" | "dark";

/** Shared with the inline script in the root layout that applies the theme before first paint. */
export const SETTINGS_KEY = "tandem:settings";

type Settings = { locale: Locale; theme: Theme };

type SettingsContextValue = Settings & {
  t: Messages;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

/** Without a saved choice, Tandem starts in the browser's language (else German). */
const browserLocale = () => detectLocale(navigator.languages?.length ? navigator.languages : [navigator.language]);

function loadSettings(): Settings {
  try {
    const stored = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}") as Partial<Settings>;
    return {
      locale: LOCALES.includes(stored.locale as Locale) ? (stored.locale as Locale) : browserLocale(),
      theme: stored.theme === "light" || stored.theme === "dark" ? stored.theme : "system",
    };
  } catch {
    return { locale: browserLocale(), theme: "system" };
  }
}

/** Must only be rendered on the client, as it reads the saved settings synchronously. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const t = MESSAGES[settings.locale];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = settings.locale;
    if (settings.theme === "system") delete root.dataset.theme;
    else root.dataset.theme = settings.theme;
    document.title = t.appName;
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Persisting is a convenience only.
    }
  }, [settings, t]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        t,
        setLocale: (locale) => setSettings((current) => ({ ...current, locale })),
        setTheme: (theme) => setSettings((current) => ({ ...current, theme })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) throw new Error("useSettings must be used within SettingsProvider");
  return value;
}
