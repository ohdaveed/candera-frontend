# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Continuous Documentation Mandate

**CRITICAL:** Every AI agent performing changes or adding new code MUST automatically update `AGENTS.md`, `CLAUDE.md`, and `README.md` to reflect changes in:

- App structure and logic
- Database design and schema (if applicable)
- API routes and external tool integrations (e.g., MailChimp, Etsy Proxy)
- UI/UX patterns and design system updates

## Agent Domain & Cooperation

**Domain Restriction (Frontend):** Claude's primary domain in this workspace is **Frontend UI/UX development and React component implementation**.

**Cooperation Rules:**

- Do NOT modify `.codex/` or `AGENTS.md`. These are reserved for backend and generic agents.
- Do NOT modify `.gemini/` as it contains system-level configuration.
- Treat `.kombai/` files as strictly read-only (reserved for UI generation).

## Commands

```powershell
npm run dev       # start dev server (Vite HMR)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
npm run server    # start the local Etsy OAuth helper server
```

There is no test suite configured yet.

## Agent Skills

The agent environment is equipped with the following specialized skills:

- **Architecture:** `vercel-composition-patterns`, `writing-plans`, `brainstorming`.
- **Frontend:** `vercel-react-best-practices`, `react-router-framework-mode`, `framer-motion-animator`.
- **Design System:** `shadcn`, `tailwind-v4-shadcn`.
- **Tooling:** `vite`, `vitest`, `playwright-cli`, `gh-cli`, `github-actions-docs`.
- **Cloud/DB:** `supabase`, `supabase-postgres-best-practices`, `agent-browser`.
- **Quality:** `systematic-debugging`, `test-driven-development`.

## Stack

- **React 19** with JSX (`.jsx` files)
- **Vite 8** (`@vitejs/plugin-react` using Oxc transform)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **React Router v7** for routing
- **Framer Motion** for animation
- **lucide-react** for icons
- **clsx** + **tailwind-merge** for conditional class composition
- **MailChimp Marketing API v3** for newsletter subscriptions

## Architecture

`src/main.jsx` mounts `<App />`. Routing is handled in `src/App.jsx` using `BrowserRouter`.

The app is structured into:

- `src/pages/`: Route-level components (Home, Collection, Product, Ritual, Quiz, InnerCircle).
- `src/components/`: Shared UI components (Nav, Footer, ScentQuiz).
- `api/`: Serverless functions (e.g., `subscribe.js` for MailChimp).
- `server.js`: A local Express helper server for Etsy OAuth manual testing and API ping checks.

Product sync behavior:

- `src/hooks/useProductSync.js` exposes `noActiveListings` when Etsy responds successfully with zero active listings.
- `src/pages/Home.jsx` and `src/pages/Collection.jsx` show a user-facing notice in that case and continue rendering fallback products.

Styling is split between `src/index.css` (global/base styles) and `src/App.css` (component-scoped styles). Tailwind utility classes are used directly in JSX.

SVG icons are sprite-based: `/public/icons.svg` contains named symbols referenced via `<use href="/icons.svg#symbol-id">`.

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
