# Agent instructions for `candera-frontend`

This is a Vite + React single-page app. Keep AI-driven edits focused and lightweight.

## Continuous Documentation Mandate

**CRITICAL:** Every AI agent performing changes or adding new code MUST automatically update `AGENTS.md`, `CLAUDE.md`, and `README.md` to reflect changes in:

- App structure and logic
- Database design and schema (if applicable)
- API routes and external tool integrations (e.g., MailChimp, Etsy Proxy)
- UI/UX patterns and design system updates

## Agent Domain & Cooperation

**Domain Restriction (Backend/Logic):** This file (and Codex/general agents using it) is restricted to **Backend logic, API integration, E2E Testing, and Code Reviews**.

**Cooperation Rules:**

- Do NOT modify `.claude/` or `CLAUDE.md`. These are reserved for frontend AI agents.
- Do NOT modify `.gemini/` as it contains system-level configuration.
- Treat `.kombai/` files as strictly read-only (reserved for UI generation).

## Agent Skills

This workspace is optimized for AI agents with the following global skills installed (`npx skills add <name> -g`):

- **Core Frameworks:** `vercel-react-best-practices`, `react-router-framework-mode`, `framer-motion-animator`.
- **Styling:** `shadcn`, `tailwind-v4-shadcn`.
- **Build & Test:** `vite`, `vitest`, `playwright-cli`.
- **Cloud & Backend:** `vercel-composition-patterns`, `agent-browser`, `supabase`, `supabase-postgres-best-practices`.
- **Collaboration & CI/CD:** `gh-cli`, `github-actions-docs`.
- **Reasoning Superpowers:** `writing-plans`, `systematic-debugging`, `brainstorming`, `test-driven-development`.

## What to know

- Entry flow: `index.html` → `src/main.jsx` → `src/App.jsx`.
- Routing: `react-router-dom` (v7) is fully active. `src/App.jsx` defines routes for Home, Collection, Quiz, About, Ritual, and Inner Circle.
- Structure: Modularized into `src/pages/` (route-level views) and `src/components/` (reusable UI).
- Exhibit sync module:
  - `src/modules/exhibitSync/` contains an isolated multi-panel synchronization module at `/exhibit-sync`.
  - `footprintWorker.js` delegates uploaded file footprint parsing off the main UI thread.
  - `footprintParser.js` detects PDF and TIFF page/frame counts, falling back to one page for single-frame images or unknown formats.
  - `sequence.js` owns pure chronological sorting, bijective exhibit codes, and zero-padded page ranges.
  - `store.js` keeps normalized `{ items, itemOrder }` state and derived synchronized panel selectors.
  - The Master panel supports both file picker and drag-and-drop ingestion; worker crashes mark active parse jobs as reviewable errors instead of leaving rows stuck in-flight.
- Styling: Tailwind CSS v4 is integrated via the `@tailwindcss/vite` plugin. Global styles in `src/index.css`.
- Backend/API:
  - `api/subscribe.js`: Handles newsletter subscriptions via **MailChimp API v3** (uses tags for list segmentation).
  - `api/etsy/listings.js`: Handles Etsy listing sync through the **Etsy Open API v3** (requires `ETSY_KEYSTRING:ETSY_SHARED_SECRET` in the `x-api-key` header).
  - `api/etsy/oauth/authorize.js` and `api/etsy/oauth/callback.js`: Handle the Etsy OAuth 2.0 PKCE authorization-code flow and token exchange.
  - `server.js`: Local Express helper for Etsy OAuth manual testing and API ping checks.
  - `vite.config.js`: Provides local Vite middleware for Vercel-style `/api/etsy/listings` and `/api/subscribe` routes.
- Product sync UX:
  - `src/hooks/useProductSync.js` uses an explicit catalog lifecycle: `loading`, `live`, `fallback`, and `error`.
  - `fetchStudioCatalog()` returns `{ items, status, error, fallbackReason }`, keeping live Etsy data and fallback catalog data separate.
  - `src/hooks/useProductSync.js` still exposes `noActiveListings` when Etsy is reachable but returns an empty active-listings payload.
  - `src/pages/Home.jsx` and `src/pages/Collection.jsx` render a clear status notice and continue showing curated fallback products.
- UI layout pattern:
  - `src/components/ui/section.jsx` owns the default responsive section padding.
  - Home and Collection favor restrained editorial spacing, clamped hero type, stable product aspect ratios, and mobile-safe controls.
  - Home catalog rendering is split into `src/components/catalog/ProductGrid.jsx` and `src/components/catalog/FragranceProfileCard.jsx`.
  - Newsletter signup state lives in `src/components/forms/NewsletterSubscribe.jsx`.
  - External Etsy CTAs use `src/components/RedirectButton.jsx` with visible external-link affordance text.
- Assets: `src/assets/` for imports; `public/` for static files (including `icons.svg` sprite).

## Work style

- Prefer the existing JavaScript + JSX stack.
- Keep components and styles small, local, and easy to reason about.
- Preserve `StrictMode` in `src/main.jsx`.
- Prioritize accessibility (semantic HTML, alt text, keyboard support).

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — create the production build.
- `npm run lint` — run ESLint across the app.
- `npm run preview` — preview the built app locally.
- `npm run server` — run the local Express Etsy OAuth helper server on port 3003.
- Vite+ lint ignores build output, test artifacts, and local agent skill folders (`.agents/`, `.superpowers/`) so `vp lint` reports project code instead of generated/tooling files.

## Good references

- `README.md` for the base Vite template notes.
- `package.json` for the canonical scripts and dependencies.
- `eslint.config.js` for the linting rules used here.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
