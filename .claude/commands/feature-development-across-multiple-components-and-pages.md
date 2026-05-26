---
name: feature-development-across-multiple-components-and-pages
description: Workflow command scaffold for feature-development-across-multiple-components-and-pages in candera-frontend.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /feature-development-across-multiple-components-and-pages

Use this workflow when working on **feature-development-across-multiple-components-and-pages** in `candera-frontend`.

## Goal

Implements or refactors features that require coordinated updates to multiple React components, page files, data sources, and styling. Frequently includes enhancements to UX, data flow, and UI consistency.

## Common Files

- `src/components/*.jsx`
- `src/pages/*.jsx`
- `src/data/*.json`
- `src/data/*.js`
- `src/hooks/*.js`
- `src/lib/*.js`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update or add relevant React component files in src/components/
- Update or add relevant page files in src/pages/
- Modify or add data files in src/data/ (e.g., products.json)
- Update shared utilities or hooks in src/hooks/ or src/lib/
- Adjust global or component-level styles in src/index.css

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.