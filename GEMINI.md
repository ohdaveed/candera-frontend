# Candera Frontend Context

This repository contains the frontend application for **Candera**, a luxury botanical candle brand. The project emphasizes a "ritual-first" editorial aesthetic, high-performance product synchronization with Etsy, and a modular architecture.

## Project Overview

- **Purpose**: A high-end DTC e-commerce storefront for botanical candles and ritual goods.
- **Brand Aesthetic**: "Mineral stillness with botanical warmth." Editorial-heavy layouts, fluid typography, and restrained interactive motion.
- **Key Modules**:
  - **Storefront**: Dynamic catalog synced from Etsy v3 API.
  - **Exhibit Sync**: A specialized multi-panel worker-driven document indexing tool (`/exhibit-sync`).
  - **Etsy Proxy & OAuth**: A secure Vercel-style backend (`api/etsy/`) for listing retrieval and PKCE OAuth 2.0 flow.
  - **Inner Circle**: Newsletter integration via MailChimp Marketing API v3.

## Core Technologies

- **Framework**: React 19 (JSX)
- **Toolchain**: **Vite+** (`vp`) - A unified toolchain wrapping Vite, Rolldown, and Oxlint.
- **Styling**: **Tailwind CSS v4** via `@tailwindcss/vite`.
  - Uses specific brand tokens: `candera-vellum` (bg), `candera-lavender` (primary), `candera-obsidian` (text), `candera-ember` (accent).
- **Routing**: React Router v7 (BrowserRouter).
- **Animation**: Framer Motion.
- **Testing**: Vitest (Unit) and Playwright (E2E).
- **Backend**: Vercel Serverless Functions (JavaScript) in the `api/` directory.

## Building and Running

Commands are unified under the `vp` (Vite+) CLI and `npm`.

- **Setup**: `vp install`
- **Development**: `npm run dev` (starts the `vp dev` server).
- **Build**: `npm run build` (outputs to `dist/`).
- **Validation**: `vp check` (lints, formats, and type-checks).
- **Etsy OAuth Helper**: `npm run server` (starts a local Express server on port 3003 for OAuth testing).
- **Testing**: `npm run test:e2e` (Playwright).

## Architecture & Structure

- **`src/pages/`**: Route-level components (Home, Collection, Product, Ritual, Quiz, InnerCircle).
- **`src/components/`**:
  - `ui/`: Fundamental building blocks (Section, Container, Button).
  - `catalog/`: Presentation logic for products and fragrance profiles.
  - `forms/`: Interactive states like `NewsletterSubscribe`.
- **`src/hooks/`**: Core business logic, notably `useProductSync.js` for Etsy/Fallback data management.
- **`src/modules/exhibitSync/`**: Isolated module using Web Workers (`footprintWorker.js`) for non-blocking file processing.
- **`api/`**: Vercel-style serverless functions.
  - `api/etsy/listings.js`: Proxy with 5-minute TTL cache and deduplication.
  - `api/etsy/oauth/`: PKCE flow implementation.
  - `api/subscribe.js`: MailChimp handler.

## Development Conventions

### Styling & Spacing

- **Responsive Primitives**: Always prefer `Section`, `Container`, and `Grid` from `src/components/ui/section.jsx`.
- **Typography**:
  - `font-display`: Fraunces (Wordmarks/Hero)
  - `font-editorial`: Cormorant (Ritual/Descriptions)
  - `font-sans`: DM Sans (Body/UI)
- **Icons**: Sprite-based system in `public/icons.svg`. Use `<use href="/icons.svg#id" />`.

### Data Lifecycle

- **Product Sync**: The app uses an explicit lifecycle: `loading` → `live` | `fallback` | `error`.
- **Fallback**: If Etsy is unreachable or empty, the app gracefully degrades to `src/data/products.json`.

### Documentation Mandate

**CRITICAL:** Any major changes to app structure, API routes, or design patterns must be reflected in:

- `AGENTS.md` (Agent-specific instructions)
- `CLAUDE.md` (Claude-specific guidance)
- `README.md` (General documentation)

## Agent Cooperation

- **Frontend Focus**: Follow instructions in `CLAUDE.md`.
- **Backend/Logic Focus**: Follow instructions in `AGENTS.md`.
- **System Config**: Do NOT modify `.gemini/`, `.claude/`, or `.kombai/` unless explicitly directed.
