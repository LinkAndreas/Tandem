import type { jsPDF as JsPDF } from "jspdf";

// jsPDF's built-in Helvetica only covers Windows-1252 (Western European) characters. When a PDF
// contains anything else – Russian, Japanese, Korean or Chinese texts, or such names in any language –
// a TrueType font from public/fonts is loaded on demand and embedded (jsPDF writes a subset with
// only the glyphs used):
//  - Noto Sans (regular and bold, SIL OFL 1.1): Latin, Greek and Cyrillic.
//  - Droid Sans Fallback (Apache 2.0): Japanese, Korean and Chinese, plus Latin and Cyrillic. It has a
//    single weight, so bold is simulated by outlining the glyphs. Japanese kanji are drawn with this
//    font's (Chinese-style) shapes. Scripts that neither font covers, e.g. Arabic or emoji, are not
//    supported.

export type PdfStyle = "normal" | "bold";

export type PdfFont = {
  /** Selects the family and style for the following text. */
  set: (style: PdfStyle) => void;
  /** Draws text like doc.text, simulating bold where the font has no bold weight. */
  text: (text: string | string[], x: number, y: number, options?: Parameters<JsPDF["text"]>[3]) => void;
};

type Face = { family: string; files: Record<PdfStyle, string> };

const NOTO: Face = { family: "NotoSans", files: { normal: "NotoSans-Regular.ttf", bold: "NotoSans-Bold.ttf" } };
const CJK: Face = { family: "DroidSansFallback", files: { normal: "DroidSansFallback.ttf", bold: "DroidSansFallback.ttf" } };

// Windows-1252 characters outside Latin-1 that Helvetica can draw.
const WIN_ANSI_EXTRA = new Set("€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ");

const isWinAnsi = (code: number, char: string) =>
  code < 0x7f || (code >= 0xa0 && code <= 0xff) || WIN_ANSI_EXTRA.has(char);

// Latin (incl. extensions), IPA, Greek, Cyrillic, Latin Extended Additional, Greek Extended,
// general punctuation and currency signs.
const isNoto = (code: number) =>
  code <= 0x52f || (code >= 0x1e00 && code <= 0x206f) || (code >= 0x20a0 && code <= 0x20c0);

const cache = new Map<string, Promise<string>>();

/** A font file from public/fonts as a binary string, as jsPDF's virtual file system expects. */
function fetchFont(file: string): Promise<string> {
  let pending = cache.get(file);
  if (!pending) {
    pending = fetch(`/fonts/${file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load /fonts/${file} (${response.status})`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return binary;
      });
    pending.catch(() => cache.delete(file)); // allow a retry, e.g. after the connection is back
    cache.set(file, pending);
  }
  return pending;
}

/** Picks and registers a font that can draw all of `texts`. */
export async function loadPdfFont(doc: JsPDF, texts: string[]): Promise<PdfFont> {
  let face: Face | null = null;
  for (const char of texts.join("")) {
    const code = char.codePointAt(0)!;
    if (code < 0x20 || isWinAnsi(code, char)) continue;
    if (!isNoto(code)) {
      face = CJK;
      break;
    }
    face = NOTO;
  }

  if (!face) {
    return {
      set: (style) => doc.setFont("helvetica", style),
      text: (text, x, y, options) => doc.text(text, x, y, options),
    };
  }

  const { family, files } = face;
  const [normal, bold] = await Promise.all([fetchFont(files.normal), fetchFont(files.bold)]);
  doc.addFileToVFS(files.normal, normal);
  doc.addFont(files.normal, family, "normal", undefined, "Identity-H");
  const fauxBold = files.bold === files.normal;
  if (!fauxBold) {
    doc.addFileToVFS(files.bold, bold);
    doc.addFont(files.bold, family, "bold", undefined, "Identity-H");
  }

  let style: PdfStyle = "normal";
  return {
    set: (next) => {
      style = next;
      doc.setFont(family, fauxBold ? "normal" : next);
    },
    text: (text, x, y, options) => {
      if (!fauxBold || style === "normal") {
        doc.text(text, x, y, options);
        return;
      }
      // Outline the glyphs in the text color; restore the line settings used for drawing shapes.
      const lineWidth = doc.getLineWidth();
      const drawColor = doc.getDrawColor();
      doc.setLineWidth(doc.getFontSize() * 0.012);
      doc.setDrawColor(doc.getTextColor());
      doc.text(text, x, y, { ...options, renderingMode: "fillThenStroke" });
      doc.setLineWidth(lineWidth);
      doc.setDrawColor(drawColor);
    },
  };
}
