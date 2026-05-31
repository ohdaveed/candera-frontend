# candera-frontend Development Patterns

> Candera is a premium artisanal candle e-commerce site. React 19 + Vite+ + Tailwind v4 + Vercel Functions.

## Stack

| Layer        | Tech                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| UI           | React 19 (JSX), React Router v7, Framer Motion                              |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui, CVA                       |
| Toolchain    | Vite+ (`vp` CLI), Oxlint, Vitest, Playwright                                |
| API          | Vercel Serverless Functions (`api/`)                                        |
| Integrations | MailChimp Marketing API v3, Etsy v3 API (PKCE OAuth), Vercel Speed Insights |

## App Structure

```
src/
  pages/          # Route-level components
  components/     # Shared UI (Nav, Footer, ScentQuiz, catalog/, forms/, ui/)
  hooks/          # useProductSync.js
  data/           # products.json (6 fallback candles), productImages.js
  lib/utils.js    # cn() — clsx + tailwind-merge
  utils/          # formatDate.js, resizeImage.js
  modules/        # exhibitSync/ — self-contained feature module
  App.jsx         # BrowserRouter + routes + ScentQuiz modal state
  main.jsx        # React.createRoot entry
  index.css       # Tailwind v4 theme tokens + global styles
api/
  subscribe.js              # POST /api/subscribe → MailChimp
  etsy/listings.js          # GET /api/etsy/listings → Etsy v3 (5-min cache)
  etsy/oauth/authorize.js   # PKCE OAuth initiation
  etsy/oauth/callback.js    # PKCE OAuth token exchange
  etsy/helper/              # Manual OAuth helper (Vercel-hosted)
  etsy/lib/token.js         # Token refresh with dedup + 3600s fallback
```

## Routes

| Path                 | Page            | Notes                                         |
| -------------------- | --------------- | --------------------------------------------- |
| `/`                  | Home            | Hero, testimonials, newsletter, ScentQuiz CTA |
| `/variant-nocturnal` | HomeNocturnal   | Dark theme variant                            |
| `/collection`        | Collection      | FilterBar, ProductGrid, SensoryMap            |
| `/collection/:slug`  | Product         | Detail page, Etsy redirect CTA                |
| `/about`             | About           | Methodology, founder, FAQ                     |
| `/ritual`            | Ritual          | Philosophy, candle care guide                 |
| `/quiz`              | Quiz            | ScentQuiz standalone page                     |
| `/inner-circle`      | InnerCircle     | Newsletter signup via `/api/subscribe`        |
| `/exhibit-sync`      | ExhibitSyncPage | Self-contained feature module                 |

## Design System

### Color Tokens (defined in `src/index.css`)

```css
--color-candera-vellum: #f5f2ed /* warm cream — primary background */
  --color-candera-obsidian: #141412 /* near-black — dark text/bg */
  --color-candera-lavender: #9b8c9f /* muted purple — accent */ --color-candera-sage: #7a8174
  /* muted green-gray */ --color-candera-stone: #c8baa6 /* warm tan */
  --color-candera-ember: #d67b62 /* coral-orange — CTA accent */ --color-candera-ash: #e2ddd6
  /* light gray */;
```

### Typography

```css
--font-display: "Fraunces" /* serif, hero headings */ --font-editorial: "Cormorant"
  /* serif, smaller editorial text */ --font-sans: "DM Sans" /* body text */;
```

Use Tailwind utility classes (`font-display`, `font-editorial`, `font-sans`) in JSX.

### Class Composition

Always use `cn()` from `src/lib/utils.js` for conditional classes:

```js
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />;
```

## Coding Conventions

### File Naming

- Pages + components → PascalCase: `ProductGrid.jsx`, `HomeNocturnal.jsx`
- Hooks, utils, data → camelCase: `useProductSync.js`, `formatDate.js`, `products.json`
- API endpoints → camelCase: `listings.js`, `subscribe.js`

### Imports

Prefer absolute `@/` alias imports for `src/` modules:

```js
import { cn } from "@/lib/utils";
import ProductGrid from "@/components/catalog/ProductGrid";
import { useProductSync } from "@/hooks/useProductSync";
```

Use relative imports only for sibling files in the same directory.

### Exports

Mixed — default for components/pages, named for hooks and utilities:

```js
// Component
export default function ProductGrid({ products }) { ... }

// Hook
export function useProductSync() { ... }

// Utility
export function extractMetadata(description, tags, index) { ... }
```

### Commit Messages

Conventional commits: `feat:`, `fix:`, `style:`, `chore:`, `refactor:`

```
feat: add scent-profile filter to Collection page
fix: resolve noActiveListings fallback not rendering on Collection
style: update ember accent color on CTA buttons
```

## Key Patterns

### Product Sync (`src/hooks/useProductSync.js`)

The single source of truth for product data. Fetches from Etsy API → falls back to `src/data/products.json`.

```js
const { products, getProductBySlug, isLoading, noActiveListings, catalogStatus } = useProductSync();
```

- `catalogStatus`: `LOADING | LIVE | FALLBACK | ERROR`
- `noActiveListings`: `true` when Etsy returns 0 active listings — Home and Collection show a user-facing notice
- `getProductBySlug(slug)` — used in Product page to resolve `:slug` param
- `extractMetadata(description, tags, index)` — parses scent profile + sensory coordinates from Etsy listing description
- `toProductShape(listing, index)` — normalizes Etsy listing to internal product schema

### ScentQuiz Modal

Modal state lives in `App.jsx` and is passed down via `openQuiz` callback prop to pages that need it. The quiz collects an email and redirects to `/inner-circle?match=<slug>`.

### API Endpoints (Vercel Functions)

All endpoints live in `api/`. The Vite dev server routes these via `vercelApiPlugin` in `vite.config.js`.

- **CORS**: `api/subscribe.js` handles `OPTIONS` preflight — replicate this pattern for new endpoints
- **Etsy auth header**: `api/etsy/listings.js` expects `x-api-key: KEYSTRING:SECRET`
- **Token refresh**: Always use `api/etsy/lib/token.js` — it has dedup logic and a `|| 3600` expiry fallback

### SVG Icons

Sprite-based via `/public/icons.svg`. Reference symbols with:

```jsx
<svg>
  <use href="/icons.svg#symbol-id" />
</svg>
```

## Workflows

### /feature — Feature development across components and pages

1. Add/update components in `src/components/`
2. Add/update pages in `src/pages/` and routes in `App.jsx`
3. Update data in `src/data/` or API in `api/` if needed
4. Update hooks in `src/hooks/` for new data-fetching logic
5. Use existing design tokens and `cn()` for styling
6. **CRITICAL**: Update `AGENTS.md`, `CLAUDE.md`, and `README.md` to reflect structural/logic/integration changes

### /design-system-update — Design token and style updates

1. Update `--color-candera-*` or font tokens in `src/index.css`
2. Replace hardcoded color values with token references in JSX
3. Verify across both light (`/`) and dark (`/variant-nocturnal`) page variants
4. Check shadcn components in `src/components/ui/` — they use CVA and may need variant updates

## Testing

- **Unit tests**: Vitest, co-located with source (`useProductSync.test.js`)
- **E2E tests**: Playwright in `e2e/` (skipped locally by default via `SKIP_UI_TESTS`)
- **Run tests**: `vp test` (unit) or `npx playwright test` (e2e)
- **Lint + format**: `vp check` (format + lint + type check) before committing

## Commands

```bash
npm run dev        # vp dev — Vite HMR dev server
npm run build      # vp build — production build → dist/
npm run preview    # vp preview — serve production build
npm run lint       # vp lint .
npm run server     # node server.js — local Etsy OAuth helper
npx playwright test  # run e2e tests
vp check           # format + lint + type check (run before commits)
vp test            # run unit tests
```

| Skill Command           | When to use                                        |
| ----------------------- | -------------------------------------------------- |
| `/feature`              | Adding or refactoring across components and pages  |
| `/design-system-update` | Updating color tokens, fonts, or Tailwind patterns |
