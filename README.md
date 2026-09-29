<div align="center">

<img src="docs/brand/mark.svg" alt="" width="96">

# Tandem

**Someone new every round.**

For teams that give each other feedback: Tandem assigns the feedback partners –<br>
round after round, without ever repeating a pair.

[![Deploy](https://github.com/LinkAndreas/Tandem/actions/workflows/deploy.yml/badge.svg)](https://github.com/LinkAndreas/Tandem/actions/workflows/deploy.yml)
![Version](https://img.shields.io/badge/version-1.0.2-2f5d50)
[![License: MIT](https://img.shields.io/badge/license-MIT-2f5d50)](LICENSE)
<br>
![Next.js](https://img.shields.io/badge/Next.js-16-1f1d1a?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-1f1d1a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6-1f1d1a?logo=typescript&logoColor=3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-1f1d1a?logo=tailwindcss&logoColor=06B6D4)
![Languages](https://img.shields.io/badge/languages-DE_·_EN_·_FR_·_ES-f3d9cc)
![No backend](https://img.shields.io/badge/data-stays_in_your_browser-f3d9cc)

</div>

## Features

- **Set up your group** – add names one by one or paste a whole list (e.g. from Excel or an email)
  at once.
- **Add past rounds** – pair people by tapping their names or enter all rounds at once as text.
- **Draw a new round** – always finds an arrangement without repeated pairs, as long as one exists.
  With an odd group size, people take turns sitting out.
- **Share** – copy the pairs of a round or download all rounds as a PDF, including an overview of
  who was paired with whom in each round.
- **Save and load sessions** – save the group and rounds as a file, e.g. to continue on another
  device or to manage several teams.
- **See an example** – a sample group with eight rounds to try things out; your own data stays
  untouched.
- **Undo** – deleting, starting over and loading can be undone right away.
- **German (default), English, French and Spanish**, plus a light and a dark theme.

## Text format for rounds

“Edit rounds as text” lets you enter many rounds quickly:

```text
Round 1
Anna M. & Ben K.
Clara S. & David L.

Round 2
Anna M. & Clara S.
Ben K. & David L.
Emil R.
```

- One pair per line, names separated by `&` (`+`, `,`, `;`, `/` and ` - ` work too).
- A blank line or a heading such as “Round 2” (also “Runde”, “Tour”, “Ronda” or `#`) starts the
  next round.
- A line with a single name means that person sits out that round.
- Names are matched case-insensitively; new names are added to the group automatically.

## Privacy and storage

Tandem is a purely static web app without a backend or accounts. The group, rounds and settings are
kept only in the browser’s `localStorage`; no data is sent to a server. Saved sessions are JSON
files that are created and read locally:

```json
{
  "app": "tandem",
  "version": 1,
  "savedAt": "2026-09-29T09:00:00.000Z",
  "participants": ["Anna M.", "Ben K."],
  "rounds": [[["Anna M.", "Ben K."]]]
}
```

## Brand

**Name:** Tandem – two people working together towards the same goal. The word exists in German,
English, French and Spanish, so the brand needs no translation.

**Claim:** “Someone new every round.” (DE: „Jede Runde ein neues Gegenüber.“)

**Logo:** Two overlapping circles represent a pair. Files: [`docs/brand/mark.svg`](docs/brand/mark.svg)
(standalone) and [`src/app/icon.svg`](src/app/icon.svg) (app icon with background).

<img src="docs/brand/palette.svg" alt="Color palette: Forest #2F5D50, Cream #F6F2EB, Peach #F3D9CC, Ink #1F1D1A" width="640">

| Role | Color | Light | Dark |
| --- | --- | --- | --- |
| Accent (buttons, links) | Forest | `#2F5D50` | `#8CC3AD` |
| Background | Cream | `#F6F2EB` | `#141311` |
| Logo, person colors | Peach | `#F3D9CC` | `#4A2A1D` |
| Text | Ink | `#1F1D1A` | `#EFEBE4` |

All colors, including the eight person colors for the initials, are defined as CSS variables in
[`src/app/globals.css`](src/app/globals.css).

**Typography:** Headings in [Fraunces](https://fonts.google.com/specimen/Fraunces) (serif, 500/600),
body text in the system font. The PDF uses Helvetica.

**Tone of voice:** clear, friendly and short; formal address in German (“Sie”) and French (“vous”),
informal in Spanish (“tú”).

## Development

Requires Node.js 22 (as in the Docker build).

```bash
npm run bootstrap   # install dependencies
npm run dev         # dev server at http://localhost:3000
npm run lint        # ESLint
npm run build       # static export to out/
```

Built with Next.js (App Router, `output: 'export'`), React 19, Tailwind CSS 4 and jsPDF. The dev
server can also be opened from a phone on the local network (`allowedDevOrigins` in
`next.config.ts`).

| Path | Contents |
| --- | --- |
| `src/components/` | UI: group, rounds, dialogs, settings |
| `src/app/pairing_algorithm.tsx` | Drawing rounds via backtracking search without repeated pairs |
| `src/lib/i18n.ts` | All texts in four languages |
| `src/lib/pdf.ts` | PDF export |
| `src/lib/roundText.ts` | Text format for rounds |
| `src/lib/session.ts` | Saving and loading session files |
| `src/lib/sample.ts` | Example data |

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`:

1. GitHub Actions builds the Docker image – a static Next.js export served by Caddy – and pushes it
   to `ghcr.io/linkandreas/tandem`, tagged with the commit SHA.
2. The Hostinger VPS only receives `compose.yaml` in `~/tandem`, pulls the image and restarts the
   container.

The container publishes no ports; it joins the Docker network `web`, where the `cloudflared`
container reaches it at `http://tandem:32774` and serves it with HTTPS at the domain via a
Cloudflare Tunnel.

Required secrets (repository or `production` environment): `HOSTINGER_HOST`, `HOSTINGER_USERNAME`,
`HOSTINGER_SSH_KEY`.

**Roll back** on the VPS:

```bash
cd ~/tandem && TAG=<older commit SHA> docker compose up -d
```

**Test the Docker image locally** (then available at <http://localhost:32774>):

```bash
docker build -t tandem . && docker run --rm -p 32774:32774 tandem
```

## License

[MIT](LICENSE) © 2026 Andreas Link
