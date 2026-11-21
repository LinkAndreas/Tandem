import type { Metadata } from "next";
import LanguageRedirect from "@/components/legal/LanguageRedirect";
import { MESSAGES } from "@/lib/i18n";

export const metadata: Metadata = { title: `${MESSAGES.en.imprintTitle} – Tandem`, robots: { index: false } };

export default function ImprintRedirect() {
  return <LanguageRedirect page="imprint" />;
}
