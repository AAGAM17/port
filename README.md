# aagamshah.dev — Portfolio

Aagam Shah's portfolio. Next.js 16 (App Router) · Tailwind CSS 4 · framer-motion · Firebase.

## Features

- **Six themes**, switchable live (bottom-right palette button): the cinematic default,
  Galaxy (skills rendered as an interactive Milky Way), Generic (classic editorial),
  Google Search, The Daily Aagam (broadsheet), and VS Code.
- **Veda** — an in-browser AI assistant who speaks (Web Speech API) and answers
  anything about Aagam from the site's data. No cloud, no API keys (`lib/veda.ts`).
- **Live testimonials** — visitors submit on-site; entries appear in realtime once
  approved in the Firebase console. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).
- Cinematic once-per-session intro, command palette (⌘K), interactive terminal (`/terminal`).

## Develop

```bash
npm install
cp .env.example .env.local   # fill in Firebase keys (optional — see FIREBASE_SETUP.md)
npm run dev
```

## Deploy

```bash
npm run build && npm start
```

Any Node host or Vercel works. Set the four `NEXT_PUBLIC_FIREBASE_*` env vars in the
host's dashboard to enable the live testimonial wall; without them the site still
works and testimonial submission falls back to email.

## Content

All copy and data live in `lib/data.ts` — projects, experience, achievements, skills
(which also feed the Galaxy star map and Veda's brain).
