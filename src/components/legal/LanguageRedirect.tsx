import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_URL_CODES, LOCALES } from "@/lib/i18n";
import { legalPath, type LegalPage } from "@/lib/legal";

/**
 * /imprint, /privacy and /versions without a language: forwards to the language chosen in the app
 * (saved settings), else the browser's language, else German.
 */
export default function LanguageRedirect({ page }: { page: LegalPage }) {
  // Same matching as matchLocale in lib/i18n: by primary subtag, so pt-PT → pt-BR and zh-TW → zh-Hans;
  // then the locale's URL code (pt-br, zh).
  const script = `(function(){var s=${JSON.stringify(LOCALES)},l=null;try{l=JSON.parse(localStorage.getItem("tandem:settings")||"{}").locale}catch(e){}if(s.indexOf(l)<0){l=${JSON.stringify(DEFAULT_LOCALE)};var b=function(t){return String(t).toLowerCase().split(/[-_]/)[0]},p=navigator.languages||[navigator.language];outer:for(var i=0;i<p.length;i++)for(var j=0;j<s.length;j++)if(b(s[j])===b(p[i])){l=s[j];break outer}}location.replace("/${page}/"+${JSON.stringify(LOCALE_URL_CODES)}[l]+"/"+location.hash)})()`;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <ul className="space-y-2">
        {LOCALES.map((code) => (
          <li key={code}>
            <a href={legalPath(page, code)} hrefLang={code} lang={code} className="text-accent underline-offset-4 hover:underline">
              {LOCALE_NAMES[code]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
