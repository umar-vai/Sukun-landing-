# SukunLife 40-Day Challenge — Next.js

This repository now contains the approved SukunLife landing page as a standalone Next.js application.

## Stack
- Next.js App Router
- React
- TypeScript
- CSS
- Static export for GitHub Pages

## Local development
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build
```bash
npm run build
```

The project uses `output: 'export'`, so the production static export is generated in `out/`.

## GitHub Pages
Pushes to `main` are automatically built and deployed with the workflow in `.github/workflows/deploy-pages.yml`.

## Main files
- `app/page.tsx` — route entry
- `components/LandingPage.tsx` — landing page UI and interactions
- `app/globals.css` — approved visual styling, responsive rules, animations and liquid-glass tuning
- `next.config.mjs` — static export and GitHub Pages base path
