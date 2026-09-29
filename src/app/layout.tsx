import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const description =
  "Für Teams, die sich gegenseitig Feedback geben: Tandem teilt die Feedback-Partner ein – Runde für Runde, ohne dass sich ein Paar wiederholt.";

export const metadata: Metadata = {
  title: "Tandem",
  description,
  applicationName: "Tandem",
  openGraph: { title: "Tandem – Feedback-Partner einteilen", description, type: "website", locale: "de_DE" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2eb" },
    { media: "(prefers-color-scheme: dark)", color: "#141311" },
  ],
};

// Applies the saved theme and language before the first paint to avoid a flash (key: SETTINGS_KEY in lib/settings).
const settingsScript = `try{var s=JSON.parse(localStorage.getItem("tandem:settings")||"{}");if(s.theme==="light"||s.theme==="dark")document.documentElement.dataset.theme=s.theme;if(s.locale)document.documentElement.lang=s.locale}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
