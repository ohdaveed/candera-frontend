---
name: design-system-and-style-consolidation
description: Workflow command scaffold for design-system-and-style-consolidation in candera-frontend.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /design-system-and-style-consolidation

Use this workflow when working on **design-system-and-style-consolidation** in `candera-frontend`.

## Goal

Standardizes and enhances the design system by updating color tokens, CSS variables, and Tailwind classes across multiple components and pages for visual consistency.

## Common Files

- `src/index.css`
- `src/components/*.jsx`
- `src/pages/*.jsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update color variables or tokens in CSS (e.g., src/index.css, @theme blocks)
- Replace or refactor Tailwind classes in component and page files
- Update relevant React components and pages to use new design tokens
- Test visual consistency across the app

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.
