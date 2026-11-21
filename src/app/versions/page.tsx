import type { Metadata } from "next";
import LanguageRedirect from "@/components/legal/LanguageRedirect";
import { MESSAGES } from "@/lib/i18n";

export const metadata: Metadata = { title: `${MESSAGES.en.versionsTitle} – Tandem`, robots: { index: false } };

export default function VersionsRedirect() {
  return <LanguageRedirect page="versions" />;
}
