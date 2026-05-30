# Agent instructions for `candera-frontend`

Vite+ (vite-plus) React 19 SPA. Domain: backend/logic/API/E2E. Frontend agents use `CLAUDE.md`.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Vite HMR dev server (port 5173) |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | Vite+ lint (`vp lint .`) — oxc + typescript + unicorn + react plugins |
| `npm run server` | Local Express Etsy OAuth helper (port 3003) |
| `npx playwright test` | E2E tests in `e2e/` |
| Set `PLAYWRIGHT_SKIP_UI_TESTS=1` to skip browser-dependent tests locally |
| `node --run <script>` | Also works (Node 23+); prefers `npm run <script>` |
| `npx vitest` | Run unit tests (`*.test.js`) |

## Architecture

- **Entry**: `index.html` → `src/main.jsx` → `src/App.jsx` (BrowserRouter)
- **Routing**: `src/App.jsx` defines routes for `/`, `/variant-nocturnal`, `/collection`, `/collection/:slug`, `/about`, `/ritual`, `/quiz`, `/inner-circle`, `/exhibit-sync`
- **`@` alias** → `src/` (configured in vite.config.js + jsconfig.json)
- **API routes** (`api/`): Vercel serverless functions. `vite.config.js` provides local middleware via `vercelApiPlugin()`
  - `api/etsy/listings.js`: 5-min in-memory cache, concurrent-refresh dedup via `_pendingRefresh`
  - `api/etsy/oauth/`: PKCE OAuth 2.0 flow (`authorize.js` + `callback.js`)
  - `api/etsy/helper/`: Vercel-hosted manual OAuth helper
  - `api/subscribe.js`: MailChimp v3 (tags for segmentation)
- **Supabase**: Used as REST API data source (not client SDK). Products served via `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- **Env**: `.env` (gitignored), `.env.example` documents all vars. `dotenv` loaded in `vite.config.js`.
- **Vercel config**: `vercel.ts` — 1yr immutable cache on assets, 1wk on icons.svg, cron warms `/api/etsy/listings` every 4min
- **Node**: 24 (`.nvmrc`). Package manager: npm 11.15.0

## Styling & UI

- **Tailwind v4** via `@tailwindcss/vite` plugin. Custom theme tokens (`--color-candera-*`, `--font-*`) in `src/index.css`
- **shadcn/ui** components (JSX, not TSX) in `src/components/ui/`. Alias: `@/components/ui`
- **Fonts**: Fraunces (display), Cormorant (editorial), DM Sans (sans-serif) — via both Google Fonts link and `@fontsource-variable` packages
- **Icons**: `lucide-react` + SVG sprite at `/icons.svg` (`<use href="/icons.svg#id">`)

## Testing

- **Unit tests**: Vitest, co-located `*.test.js`. Run: `npx vitest`
- **E2E**: Playwright in `e2e/`. Run: `npx playwright test`. UI tests skip locally via `PLAYWRIGHT_SKIP_UI_TESTS=1` (Ubuntu 26.04 browser compat gap). WebServer auto-starts via `npm run dev`.

## Domain & Cooperation

- This file (`AGENTS.md`): backend/logic/API/E2E agents
- `CLAUDE.md`: frontend/UI agents
- `.kombai/`: read-only (UI generation)
- `.gemini/`: system-level config, do not modify

## Verification

1. `npm run lint` (Vite+ oxc lint + type checking — `typeAware: true` in config)
2. `npx vitest` (unit tests)
3. `npx playwright test` (e2e, requires `.env` with Supabase credentials)
