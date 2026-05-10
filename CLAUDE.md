# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
npm run dev       # start dev server (Vite HMR)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
```

There is no test suite configured yet.

## Stack

- **React 19** with JSX (`.jsx` files — no TypeScript)
- **Vite 8** (`@vitejs/plugin-react` using Oxc transform)
- **Tailwind CSS v4** with PostCSS/autoprefixer
- **React Router v7** for routing
- **Framer Motion** for animation
- **lucide-react** for icons
- **clsx** + **tailwind-merge** for conditional class composition

## Architecture

This is currently a minimal scaffold. `src/main.jsx` mounts `<App />` into `#root`. All app logic lives in `src/App.jsx` — there are no separate routes, components, or state management layers yet.

Styling is split between `src/index.css` (global/base styles) and `src/App.css` (component-scoped styles). Tailwind utility classes can be used directly in JSX alongside these CSS files.

SVG icons are sprite-based: `/public/icons.svg` contains named symbols referenced via `<use href="/icons.svg#symbol-id">`.
