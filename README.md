# World Cup 2026 Bracket Generator

Create and share your FIFA World Cup 2026 bracket predictions! Drag teams into order, pick knockout winners, and generate a shareable link with your name.

**Live at:** [wc2026bracketgenerator.vercel.app](https://wc2026bracketgenerator.vercel.app/)

---

## Features

- **Group Stage** — Drag and drop all 48 teams across 12 groups to set your predicted standings
- **Third-Place Qualifiers** — Pick which 8 of the 12 third-place teams advance (auto-selects top 8 by FIFA ranking)
- **Knockout Bracket** — Full tournament bracket from Round of 32 through the Final, with proper FIFA 495-combination 3rd-place team mapping
- **Shareable Links** — Your entire bracket is encoded into a compact URL parameter. No database, no backend, no localStorage needed for sharing
- **Named Brackets** — Add your name so shared links show "*YourName's* World Cup 2026 Bracket Prediction"
- **Bracket Summary** — Shared links open a beautiful read-only view with group standings, knockout results, and a podium display (Champion, Runner-up, 3rd Place)
- **Auto-Save** — Your progress is saved to localStorage while editing, so you never lose your picks
- **Responsive** — Vertical round-by-round layout on mobile, horizontal columns on desktop

---

## How It Works

1. **Reorder groups** by dragging teams into 1st–4th place
2. **Pick 8 third-place teams** to advance (or auto-select)
3. **Click winners** through each knockout round
4. **Enter your name** and click **Generate Shareable Link**
5. A new tab opens with your bracket summary — copy the URL and share!

---

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router + Static Export)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Zero external dependencies for UI — flag emojis and native drag-and-drop

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Data Sources

- Group fixtures parsed from `wc2026.csv`
- 48 teams and FIFA rankings from official 2026 World Cup draw
- Complete Round of 32 third-place team mapping table (495 combinations) from [FIFA regulations](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage)

---

## Share Example

Your bracket link looks like:

```
https://wc2026bracketgenerator.vercel.app/?b=AAAAAAH_AAAAAAAAAAA&n=Messi
```

Anyone who opens it sees your full bracket prediction with your name on top.

---

*Not affiliated with FIFA. For entertainment purposes only.*
