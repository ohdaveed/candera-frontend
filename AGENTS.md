# Agent instructions for `candera-frontend`

This is a small Vite + React single-page app. Keep AI-driven edits focused and lightweight.

## What to know
- Entry flow: `index.html` → `src/main.jsx` → `src/App.jsx`.
- Styling lives in `src/index.css` and `src/App.css`; the app uses CSS custom properties and CSS nesting.
- Assets are split between `src/assets/` for imported files and `public/` for static files.
- `react-router-dom` is installed but not wired up yet; only introduce routing if the task explicitly needs it.
- Tailwind and PostCSS packages are present, but there is no Tailwind config; do not assume Tailwind is configured.

## Work style
- Prefer the existing JavaScript + JSX stack unless the user asks for TypeScript.
- Keep components and styles small, local, and easy to reason about.
- Preserve `StrictMode` in `src/main.jsx` unless there is a clear reason not to.
- When adding UI, keep accessibility basics in place: semantic elements, meaningful alt text, and keyboard-friendly interactions.

## Commands
- `npm run dev` — start the Vite dev server.
- `npm run build` — create the production build.
- `npm run lint` — run ESLint across the app.
- `npm run preview` — preview the built app locally.

## Good references
- `README.md` for the base Vite template notes.
- `package.json` for the canonical scripts and dependencies.
- `eslint.config.js` for the linting rules used here.
