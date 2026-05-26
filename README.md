# Candera Frontend

This is the frontend application for Candera, built with React 19, Vite (Vite+), and Tailwind CSS v4.

## Continuous Documentation Mandate

**CRITICAL:** Every AI agent performing changes or adding new code MUST automatically update `AGENTS.md`, `CLAUDE.md`, and `README.md` to reflect changes in:

- App structure, logic, API routes, and external tool integrations.

## Tech Stack

- **React 19**: Frontend UI framework.
- **Vite+**: Unified toolchain for development and builds.
- **Tailwind CSS v4**: Styling engine via `@tailwindcss/vite`.
- **React Router v7**: Client-side routing.
- **Framer Motion**: Animations and transitions.
- **MailChimp Marketing API v3**: Newsletter subscription integration.

## Agent Skills

This project is configured for advanced AI agent collaboration with the following skills:

- **Frameworks:** React 19, React Router v7, Framer Motion.
- **Styling:** Tailwind v4, Shadcn UI.
- **Workflow:** Writing Plans, Brainstorming, Systematic Debugging, TDD.
- **DevOps:** GitHub CLI, GitHub Actions, Vercel Patterns, Supabase.
- **Automated Testing:** Vitest, Playwright.

## Project Structure

- `src/App.jsx`: Main entry point and routing configuration.
- `src/pages/`: Route-level views (Home, Collection, Product, Ritual, Quiz, Inner Circle).
- `src/components/`: Reusable UI components (Nav, Footer, Scent Quiz).
- `api/subscribe.js`: Vercel-style API route for MailChimp subscriptions.
- `api/etsy/listings.js`: Vercel-style API route for Etsy listing sync.
- `vite.config.js`: Includes a local Vite middleware shim for `/api/etsy/listings` and `/api/subscribe`.

## Etsy Backend Connection

The storefront pulls live product data from `/api/etsy/listings` while keeping `src/data/products.json` as a fallback.

1. Create or update `.env`.
2. Set frontend variables:
   - `VITE_PRODUCTS_API_URL` only when overriding the default `/api/etsy/listings` endpoint.
   - `VITE_ETSY_BACKEND_API_KEY` only when a backend requires a simple API key header.
   - `VITE_ETSY_SHOP_URL` for fallback listing links.
3. Set server-side variables for the Etsy route:
   - `ETSY_KEYSTRING` for the Etsy API key value sent in the `x-api-key` header.
   - `ETSY_SHOP_ID`, `ETSY_LISTINGS_LIMIT`.

`ETSY_SHARED_SECRET` is not currently used by the `/api/etsy/listings` backend route and should not be required for this setup.

## MailChimp Integration

The newsletter form is powered by the MailChimp Marketing API.

Required environment variables:

- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX` (e.g., `us1`)
- `MAILCHIMP_LIST_ID`

## Development

```bash
# Install dependencies
vp install

# Start the Vite dev server
npm run dev

# Run checks (lint, format, type-check)
vp check
```
