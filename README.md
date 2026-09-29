<div align="center">

<img src="docs/brand/mark.svg" alt="" width="96">

# Tandem

**Jede Runde ein neues Gegenüber.**

Für Teams, die sich gegenseitig Feedback geben: Tandem teilt die Feedback-Partner ein –<br>
Runde für Runde, ohne dass sich ein Paar wiederholt.

[![Deploy](https://github.com/LinkAndreas/Tandem/actions/workflows/deploy.yml/badge.svg)](https://github.com/LinkAndreas/Tandem/actions/workflows/deploy.yml)
![Version](https://img.shields.io/badge/version-1.0.1-2f5d50)
[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-2f5d50)](LICENSE)
<br>
![Next.js](https://img.shields.io/badge/Next.js-16-1f1d1a?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-1f1d1a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6-1f1d1a?logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-1f1d1a?logo=tailwindcss&logoColor=06B6D4)
![Sprachen](https://img.shields.io/badge/Sprachen-DE_·_EN_·_FR_·_ES-f3d9cc)
![Kein Backend](https://img.shields.io/badge/Daten-bleiben_im_Browser-f3d9cc)

</div>

## Funktionen

- **Gruppe anlegen** – Namen einzeln eintragen oder eine ganze Liste (z. B. aus Excel oder einer
  E-Mail) auf einmal einfügen.
- **Bisherige Runden nachtragen** – Paare per Antippen bilden oder alle Runden auf einmal als Text
  eingeben.
- **Neue Runde auslosen** – findet immer eine Einteilung ohne Wiederholung, sofern es noch eine gibt.
  Bei ungerader Gruppengröße setzt reihum eine Person aus.
- **Teilen** – Paare einer Runde kopieren oder alle Runden als PDF herunterladen, inklusive einer
  Übersicht, wer mit wem in welcher Runde ein Paar gebildet hat.
- **Sitzungen speichern und laden** – Gruppe und Runden als Datei sichern, etwa um auf einem anderen
  Gerät weiterzumachen oder mehrere Teams zu verwalten.
- **Beispiel ansehen** – eine Beispielgruppe mit acht Runden zum Ausprobieren; die eigenen Daten
  bleiben dabei unberührt.
- **Rückgängig** – Löschen, Zurücksetzen und Laden lassen sich direkt wieder rückgängig machen.
- **Deutsch, Englisch, Französisch, Spanisch** sowie helles und dunkles Design.

## Textformat für Runden

Über „Runden als Text bearbeiten“ lassen sich viele Runden schnell eintragen:

```text
Runde 1
Anna M. & Ben K.
Clara S. & David L.

Runde 2
Anna M. & Clara S.
Ben K. & David L.
Emil R.
```

- Ein Paar pro Zeile, Namen mit `&` trennen (`+`, `,`, `;`, `/` und ` - ` funktionieren auch).
- Eine Leerzeile oder eine Überschrift wie „Runde 2“ (auch „Round“, „Tour“, „Ronda“ oder `#`)
  beginnt die nächste Runde.
- Steht nur ein Name in der Zeile, setzt diese Person in der Runde aus.
- Unbekannte Namen werden automatisch zur Gruppe hinzugefügt.

## Datenschutz und Speicherung

Tandem ist eine rein statische Web-App ohne Backend und ohne Konto. Gruppe, Runden und Einstellungen
liegen nur im `localStorage` des jeweiligen Browsers; es werden keine Daten an einen Server
übertragen. Gespeicherte Sitzungen sind JSON-Dateien, die nur lokal erzeugt und gelesen werden:

```json
{
  "app": "tandem",
  "version": 1,
  "savedAt": "2026-09-29T09:00:00.000Z",
  "participants": ["Anna M.", "Ben K."],
  "rounds": [[["Anna M.", "Ben K."]]]
}
```

## Marke

**Name:** Tandem – zwei Menschen, die gemeinsam in eine Richtung arbeiten. Das Wort gibt es auf Deutsch,
Englisch, Französisch und Spanisch, daher braucht die Marke keine Übersetzung.

**Claim:** „Jede Runde ein neues Gegenüber.“ (EN: „Someone new every round.“)

**Logo:** Zwei überlappende Kreise stehen für ein Paar. Dateien: [`docs/brand/mark.svg`](docs/brand/mark.svg)
(freistehend) und [`src/app/icon.svg`](src/app/icon.svg) (App-Icon mit Hintergrund).

<img src="docs/brand/palette.svg" alt="Farbpalette: Forest #2F5D50, Cream #F6F2EB, Peach #F3D9CC, Ink #1F1D1A" width="640">

| Rolle | Farbe | Hell | Dunkel |
| --- | --- | --- | --- |
| Akzent (Buttons, Links) | Forest | `#2F5D50` | `#8CC3AD` |
| Hintergrund | Cream | `#F6F2EB` | `#141311` |
| Logo, Personenfarben | Peach | `#F3D9CC` | `#4A2A1D` |
| Text | Ink | `#1F1D1A` | `#EFEBE4` |

Alle Farben inklusive der acht Personenfarben für die Initialen-Kreise sind als CSS-Variablen in
[`src/app/globals.css`](src/app/globals.css) definiert.

**Schrift:** Überschriften in [Fraunces](https://fonts.google.com/specimen/Fraunces) (Serif, 500/600),
Fließtext in der Systemschrift. Im PDF wird Helvetica verwendet.

**Tonalität:** klar, freundlich und kurz; im Deutschen mit „Sie“, im Französischen mit „vous“,
im Spanischen mit „tú“.

## Entwicklung

Voraussetzung ist Node.js 22 (wie im Docker-Build).

```bash
npm run bootstrap   # Abhängigkeiten installieren
npm run dev         # Dev-Server auf http://localhost:3000
npm run lint        # ESLint
npm run build       # statischer Export nach out/
```

Das Projekt nutzt Next.js (App Router, `output: 'export'`), React 19, Tailwind CSS 4 und jsPDF.
Den Dev-Server kann man auch vom Smartphone im lokalen Netz aufrufen (`allowedDevOrigins` in
`next.config.ts`).

| Pfad | Inhalt |
| --- | --- |
| `src/components/` | Oberfläche: Gruppe, Runden, Dialoge, Einstellungen |
| `src/app/pairing_algorithm.tsx` | Auslosung per Backtracking-Suche ohne wiederholte Paare |
| `src/lib/i18n.ts` | Alle Texte in vier Sprachen |
| `src/lib/pdf.ts` | PDF-Export |
| `src/lib/roundText.ts` | Textformat für Runden |
| `src/lib/session.ts` | Sitzungsdateien speichern und laden |
| `src/lib/sample.ts` | Beispieldaten |

## Deployment

Jeder Push auf `main` startet `.github/workflows/deploy.yml`:

1. GitHub Actions baut das Docker-Image – statischer Next.js-Export, ausgeliefert von Caddy – und
   pusht es nach `ghcr.io/linkandreas/tandem`, getaggt mit dem Commit-SHA.
2. Der Hostinger-VPS erhält nur `compose.yaml` in `~/tandem`, zieht das Image und
   startet den Container neu.

Der Container veröffentlicht keine Ports, sondern hängt im Docker-Netzwerk `web`. Der
`cloudflared`-Container erreicht ihn dort unter `http://tandem:32774` und stellt
ihn per Cloudflare Tunnel mit HTTPS unter der Domain bereit.

Benötigte Repository-Secrets: `HOSTINGER_HOST`, `HOSTINGER_USERNAME`, `HOSTINGER_SSH_KEY`.

**Rollback** auf dem VPS:

```bash
cd ~/tandem && TAG=<älterer Commit-SHA> docker compose up -d
```

**Docker-Image lokal testen** (danach unter <http://localhost:32774> erreichbar):

```bash
docker build -t tandem . && docker run --rm -p 32774:32774 tandem
```

## Lizenz

[MIT](LICENSE) © 2026 Andreas Link
