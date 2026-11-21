import type { Metadata } from "next";
import LanguageRedirect from "@/components/legal/LanguageRedirect";
import { MESSAGES } from "@/lib/i18n";

export const metadata: Metadata = { title: `${MESSAGES.en.privacyTitle} – Tandem`, robots: { index: false } };

export default function PrivacyRedirect() {
  return <LanguageRedirect page="privacy" />;
}
