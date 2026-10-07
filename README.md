# SukunLife 40-Day Challenge — Next.js

Standalone Next.js landing page for SukunLife's 40-day challenge.

## Stack
- Next.js App Router
- React
- TypeScript
- CSS
- Static export
- GitHub Pages + GitHub Actions

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

The static export is generated in `out/`.

## Deployment
Every push to `main` automatically builds and deploys through GitHub Actions.

The workflow reads GitHub Pages' actual `base_path` before building. This means the same code works both on the repository URL and on the custom domain without manually changing asset paths.

## Custom domain
Production domain planned for this landing page:

`ruqyah-challenge.sukunlife.com`

One-time GitHub setup:
1. Open this repository → Settings → Pages.
2. Set Custom domain to `ruqyah-challenge.sukunlife.com` and save.
3. Enable Enforce HTTPS when GitHub makes the option available.

One-time DNS setup by the SukunLife domain administrator:
- Type: `CNAME`
- Host/Name: `ruqyah-challenge`
- Target/Value: `umar-vai.github.io`

Do not point the CNAME to `umar-vai.github.io/Sukun-landing-`.

After the one-time GitHub Pages + DNS setup is complete, normal updates require only a push to `main`.

## Main files
- `app/page.tsx` — route entry
- `components/LandingPage.tsx` — page UI and interactions
- `app/globals.css` — styling, responsive layout, animations and liquid-glass tuning
- `next.config.mjs` — static export and automatic GitHub Pages base-path handling
- `.github/workflows/deploy-pages.yml` — automatic build and deployment
