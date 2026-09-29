import type { jsPDF as JsPDF } from "jspdf";
import type { Locale, Messages } from "./i18n";
import { colorIndex, initials } from "./people";
import { pairKey, type Round, type RoundAnalysis } from "./rounds";

// Print palette – mirrors the light theme in globals.css.
const INK = "#1f1d1a";
const MUTED = "#6b665c";
const FAINT = "#a39d90";
const LINE = "#e2dacb";
const TILE = "#f6f2eb";
const ACCENT = "#2f5d50";
const ALERT = "#b3261e";
const ALERT_SOFT = "#fbecea";
const PERSON_COLORS: [bg: string, fg: string][] = [
  ["#f3d9cc", "#8a3b1e"],
  ["#f1e3bd", "#71530c"],
  ["#dbe7d3", "#395a2a"],
  ["#d0e6e4", "#1d5654"],
  ["#d8dff0", "#2e4474"],
  ["#e9d7e7", "#682d61"],
  ["#f2d5db", "#892d44"],
  ["#e6ddcd", "#5b4b33"],
];

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const CONTENT_W = PAGE_W - 2 * MARGIN;
const BOTTOM = PAGE_H - 22; // keeps clear of the footer

type Options = {
  participants: string[];
  rounds: Round[];
  analyses: RoundAnalysis[];
  t: Messages;
  locale: Locale;
};

export async function downloadPdf({ participants, rounds, analyses, t, locale }: Options) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date());
  doc.setProperties({ title: t.pdfTitle, creator: "Tandem" });

  let y = drawTitle(doc, t.pdfTitle, `${t.people(participants.length)} · ${t.roundsCount(rounds.length)} · ${date}`);
  rounds.forEach((round, index) => {
    // Only the latest round lists who is missing; older rounds would list everyone who joined later.
    y = drawRound(doc, y, index + 1, round, analyses[index], t, index === rounds.length - 1);
  });
  if (rounds.length > 0) drawPersonOverview(doc, y, participants, rounds, t);

  drawFooters(doc, t, date);
  doc.save(`${t.pdfFileName}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function drawTitle(doc: JsPDF, title: string, meta: string): number {
  // Brand mark: two overlapping circles, as in the app.
  doc.setFillColor(PERSON_COLORS[0][0]);
  doc.circle(MARGIN + 3, MARGIN + 3, 3, "F");
  doc.setFillColor(ACCENT);
  doc.circle(MARGIN + 6.6, MARGIN + 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(INK);
  doc.text("Tandem", MARGIN + 12, MARGIN + 3, { baseline: "middle" });

  doc.setFontSize(24);
  doc.text(title, MARGIN, MARGIN + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED);
  doc.text(meta, MARGIN, MARGIN + 30);

  doc.setDrawColor(LINE);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, MARGIN + 36, PAGE_W - MARGIN, MARGIN + 36);
  return MARGIN + 46;
}

function drawRound(
  doc: JsPDF,
  top: number,
  number: number,
  round: Round,
  analysis: RoundAnalysis,
  t: Messages,
  showUnassigned: boolean
): number {
  const gap = 3;
  const tileH = 13;
  const colW = (CONTENT_W - gap) / 2;
  const rows = Math.ceil(round.pairs.length / 2);
  const headingH = 11;
  const showNote = showUnassigned && analysis.unassigned.length > 0;
  const noteH = showNote ? 7 : 0;

  // Keep a round together unless it is taller than a page anyway.
  let y = top;
  const needed = headingH + rows * (tileH + gap) + noteH;
  if (y + Math.min(needed, headingH + 2 * (tileH + gap)) > BOTTOM || (y + needed > BOTTOM && needed < BOTTOM - MARGIN)) {
    doc.addPage();
    y = MARGIN;
  }

  doc.setFillColor(ACCENT);
  doc.circle(MARGIN + 3.2, y + 3, 3.2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor("#ffffff");
  doc.text(String(number), MARGIN + 3.2, y + 3.1, { align: "center", baseline: "middle" });
  doc.setFontSize(13);
  doc.setTextColor(INK);
  doc.text(t.round(number), MARGIN + 9, y + 3, { baseline: "middle" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(t.pairsCount(round.pairs.filter((pair) => pair.length === 2).length), PAGE_W - MARGIN, y + 3, { align: "right", baseline: "middle" });
  y += headingH;

  round.pairs.forEach((pair, index) => {
    const row = Math.floor(index / 2);
    let tileY = y + row * (tileH + gap);
    if (tileY + tileH > BOTTOM) {
      doc.addPage();
      y = MARGIN - row * (tileH + gap);
      tileY = MARGIN;
    }
    const x = MARGIN + (index % 2) * (colW + gap);
    const repeated = pair.length === 2 && analysis.repeatedPairs.has(pairKey(pair[0], pair[1]));
    drawPairTile(doc, x, tileY, colW, tileH, pair, repeated, t);
  });
  y += rows * (tileH + gap);

  if (showNote) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(MUTED);
    doc.text(fit(doc, t.unassigned(analysis.unassigned), CONTENT_W), MARGIN, y + 2);
    y += noteH;
  }
  return y + 7;
}

function drawPairTile(
  doc: JsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  pair: string[],
  repeated: boolean,
  t: Messages
) {
  const tile = repeated ? ALERT_SOFT : TILE;
  doc.setFillColor(tile);
  doc.roundedRect(x, y, w, h, 2.5, 2.5, "F");

  const r = 3.8;
  const cy = y + h / 2;
  const firstX = x + 3 + r;
  // Slight overlap like in the app, while keeping both sets of initials readable.
  const step = r * 1.7;
  pair.forEach((name, i) => drawAvatar(doc, firstX + i * step, cy, r, name, tile, 6.5));

  const textX = firstX + step + r + 3;
  const textW = x + w - textX - 3;
  const lineGap = 2.5;
  const drawName = (name: string, dy: number, style: "bold" | "normal", color: string) => {
    doc.setFont("helvetica", style);
    doc.setTextColor(color);
    let size = 9.5;
    doc.setFontSize(size);
    while (size > 7.5 && doc.getTextWidth(name) > textW) doc.setFontSize((size -= 0.5));
    doc.text(fit(doc, name, textW), textX, cy + dy, { baseline: "middle" });
  };
  drawName(pair[0], -lineGap, "bold", repeated ? ALERT : INK);
  if (pair.length === 2) drawName(pair[1], lineGap, "bold", repeated ? ALERT : INK);
  else drawName(t.sitsOutThisRound, lineGap, "normal", MUTED);
}

function drawAvatar(doc: JsPDF, cx: number, cy: number, r: number, name: string, ring: string, fontSize: number) {
  const [bg, fg] = PERSON_COLORS[colorIndex(name)];
  doc.setFillColor(bg);
  doc.setDrawColor(ring);
  doc.setLineWidth(0.7);
  doc.circle(cx, cy, r, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(fontSize);
  doc.setTextColor(fg);
  doc.text(initials(name), cx, cy + 0.1, { align: "center", baseline: "middle" });
}

function drawPersonOverview(doc: JsPDF, top: number, participants: string[], rounds: Round[], t: Messages) {
  const partnersByRound = rounds.map((round) => {
    const partners = new Map<string, string>();
    for (const pair of round.pairs) {
      if (pair.length === 2) {
        partners.set(pair[0], pair[1]);
        partners.set(pair[1], pair[0]);
      } else {
        partners.set(pair[0], "–");
      }
    }
    return partners;
  });
  const people = [...new Set([...participants, ...rounds.flatMap((round) => round.pairs.flat())])];

  const COLUMNS_PER_TABLE = 7;
  const nameW = 46;
  const rowH = 7.5;

  let y = top + 4;
  if (y + 30 > BOTTOM) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(INK);
  doc.text(t.pdfByPerson, MARGIN, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(t.pdfByPersonHint, MARGIN, y + 10);
  y += 17;

  for (let start = 0; start < rounds.length; start += COLUMNS_PER_TABLE) {
    const indexes = rounds.slice(start, start + COLUMNS_PER_TABLE).map((_, i) => start + i);
    const colW = (CONTENT_W - nameW) / indexes.length;

    const drawHeaderRow = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(MUTED);
      doc.text(t.pdfPerson, MARGIN + 2, y + rowH / 2, { baseline: "middle" });
      indexes.forEach((roundIndex, i) => {
        doc.text(fit(doc, t.round(roundIndex + 1), colW - 3), MARGIN + nameW + i * colW + 1.5, y + rowH / 2, { baseline: "middle" });
      });
      doc.setDrawColor(INK);
      doc.setLineWidth(0.4);
      doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);
      y += rowH + 1;
    };

    if (y + 3 * rowH > BOTTOM) {
      doc.addPage();
      y = MARGIN;
    }
    drawHeaderRow();

    people.forEach((person, row) => {
      // Long names wrap onto a second line instead of being cut off; the row grows to fit.
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      const nameLines = wrap(doc, person, nameW - 10);
      doc.setFont("helvetica", "normal");
      const partnerLines = indexes.map((roundIndex) => wrap(doc, partnersByRound[roundIndex].get(person) ?? "–", colW - 3));
      const lineCount = Math.max(nameLines.length, ...partnerLines.map((lines) => lines.length));
      const height = rowH + (lineCount - 1) * LINE_H;

      if (y + height > BOTTOM) {
        doc.addPage();
        y = MARGIN;
        drawHeaderRow();
      }
      if (row % 2 === 0) {
        doc.setFillColor(TILE);
        doc.rect(MARGIN, y, CONTENT_W, height, "F");
      }
      const middle = y + height / 2;
      drawAvatar(doc, MARGIN + 4, middle, 2.5, person, row % 2 === 0 ? TILE : "#ffffff", 5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(INK);
      drawLines(doc, nameLines, MARGIN + 8, middle);

      doc.setFont("helvetica", "normal");
      indexes.forEach((roundIndex, i) => {
        const partner = partnersByRound[roundIndex].get(person);
        doc.setTextColor(partner && partner !== "–" ? INK : FAINT);
        drawLines(doc, partnerLines[i], MARGIN + nameW + i * colW + 1.5, middle);
      });
      y += height;
    });
    y += 8;
  }
}

function drawFooters(doc: JsPDF, t: Messages, date: string) {
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    const y = PAGE_H - 12;
    doc.setDrawColor(LINE);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y - 4, PAGE_W - MARGIN, y - 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(FAINT);
    doc.text(`${t.pdfCreatedWith} · ${date}`, MARGIN, y);
    doc.text(t.pdfPage(page, total), PAGE_W - MARGIN, y, { align: "right" });
  }
}

const LINE_H = 3.6;

/** Breaks text at spaces and hyphens into at most `maxLines` lines; only an overlong last line is shortened. */
function wrap(doc: JsPDF, text: string, maxWidth: number, maxLines = 3): string[] {
  const tokens = text.split(/(?<=[\s-])/); // keeps the space or hyphen at the end of each token
  const lines: string[] = [];
  let current = "";
  for (const token of tokens) {
    if (current && doc.getTextWidth((current + token).trimEnd()) > maxWidth) {
      lines.push(current.trimEnd());
      current = "";
    }
    current += token;
  }
  if (current) lines.push(current.trimEnd());
  if (lines.length <= maxLines) return lines.map((line) => fit(doc, line, maxWidth));
  return [...lines.slice(0, maxLines - 1), fit(doc, lines.slice(maxLines - 1).join(" "), maxWidth)];
}

/** Draws lines vertically centered around `middle`. */
function drawLines(doc: JsPDF, lines: string[], x: number, middle: number) {
  const top = middle - ((lines.length - 1) * LINE_H) / 2;
  lines.forEach((line, i) => doc.text(line, x, top + i * LINE_H, { baseline: "middle" }));
}

/** Shortens text with an ellipsis so it fits the given width at the current font settings. */
function fit(doc: JsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  let shortened = text;
  while (shortened.length > 1 && doc.getTextWidth(`${shortened}…`) > maxWidth) shortened = shortened.slice(0, -1);
  return `${shortened.trimEnd()}…`;
}
