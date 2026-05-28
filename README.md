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
- `server.js`: Local Express helper for Etsy OAuth manual testing and API ping checks.
- `vite.config.js`: Includes a local Vite middleware shim for `/api/etsy/listings` and `/api/subscribe`.

## Etsy Backend Connection

The storefront pulls live product data from `/api/etsy/listings` while keeping `src/data/products.json` as a fallback.

If Etsy is reachable but returns zero active listings, `useProductSync` sets a `noActiveListings` flag. Home and Collection pages render a clear status notice and keep showing the curated fallback catalog.

1. Create or update `.env`.
2. Set frontend variables:
   - `VITE_PRODUCTS_API_URL` only when overriding the default `/api/etsy/listings` endpoint.
   - `VITE_ETSY_BACKEND_API_KEY` only when a backend requires a simple API key header.
   - `VITE_ETSY_SHOP_URL` for fallback listing links.
3. Set server-side variables for the Etsy route:
   - `ETSY_KEYSTRING` for Etsy credentials. This can be either a combined `key:shared_secret` string or just the key.
   - `ETSY_SHARED_SECRET` is optional and only needed if `ETSY_KEYSTRING` contains the key only.
   - `ETSY_SHOP_ID`, `ETSY_LISTINGS_LIMIT`.

## Etsy OAuth 2.0 Setup

The app includes a PKCE authorization-code flow for Etsy OAuth 2.0:

1. Register an exact HTTPS redirect URI in the Etsy app settings.
2. Set `ETSY_REDIRECT_URI` to that exact callback URL.
3. Visit `/api/etsy/oauth/authorize` in a browser to start the consent flow.
4. After Etsy redirects back to `/api/etsy/oauth/callback`, copy the returned `refresh_token` into `ETSY_REFRESH_TOKEN`.
5. For manual local testing, run `npm run server` and open `http://localhost:3003` to generate a PKCE verifier/challenge and start the OAuth flow.

Important details:

- Etsy requires the redirect URI to use `https://` and match the registered string exactly.
- `ETSY_SCOPES` defaults to `listings_r shops_r`, but you can expand it to include only the scopes your app actually needs.
- The callback route exchanges the authorization code for an access token and refresh token using PKCE.
- `api/etsy/lib/token.js` uses `ETSY_REFRESH_TOKEN` to refresh access tokens for backend requests.

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
