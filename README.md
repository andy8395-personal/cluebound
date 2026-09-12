# Cluebound: Murder Connections

Unravel the evidence. Unmask the killer.

A browser mystery that mixes *Connections*-style 16-tile grouping with a five-phase investigation. You pin clues on a speakeasy case board, lock categories, break alibis, and deliver a Clue-style accusation.

## Play

1. Create an investigator on the Official Dossier (name, silhouette, perk).
2. Open **Case 01: The Silent Inheritance**.
3. Group 16 clues into four hidden categories on each of four boards.
4. Accuse with culprit + weapon + location + motive.

Three chapters are included. Later cases unlock after you close the previous file.

### Perks

- **Deductive Reasoning** — 2 hints per chapter.
- **Sharp Instincts** — 5 strikes instead of 4.

Hints mark two tiles from an unsolved group. A guess that is one tile away shows **1 tile off!**

Progress is saved in the browser (`localStorage`). No account required.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:47321](http://localhost:47321).

```bash
npm run build
npm start
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui. The original GDD targeted mobile; this slice is a responsive web case board with the Warm Speakeasy (crimson velvet & brass) palette.
