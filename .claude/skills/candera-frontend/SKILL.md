```markdown
# candera-frontend Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `candera-frontend` repository. The codebase is a JavaScript frontend project built with Vite, using React components and a modular file structure. It emphasizes clear feature development, consistent design system updates, and standardized coding practices to ensure maintainability and scalability.

## Coding Conventions

### File Naming
- **Component and Page Files:** Use PascalCase.
  - Example: `ProductList.jsx`, `HomePage.jsx`
- **Data, Hooks, and Utility Files:** Use camelCase or descriptive names.
  - Example: `products.json`, `useCart.js`, `apiClient.js`

### Import Style
- **Relative imports** are preferred for internal modules.
  ```js
  import ProductList from '../components/ProductList.jsx';
  import useCart from '../hooks/useCart.js';
  ```

### Export Style
- **Mixed exports** are used (both default and named).
  ```js
  // Default export
  export default ProductList;

  // Named export
  export function useCart() { ... }
  ```

### Commit Messages
- **Conventional commit types** are used, with prefixes like `feat` and `style`.
  - Example: `feat: add product filtering to ProductList component`
  - Example: `style: unify button colors across all pages`

## Workflows

### Feature Development Across Multiple Components and Pages
**Trigger:** When adding or refactoring a feature that affects several parts of the frontend (components, pages, data, styles).
**Command:** `/feature`

1. Update or add relevant React component files in `src/components/`.
2. Update or add relevant page files in `src/pages/`.
3. Modify or add data files in `src/data/` (e.g., `products.json`).
4. Update shared utilities or hooks in `src/hooks/` or `src/lib/`.
5. Adjust global or component-level styles in `src/index.css`.
6. Update configuration or meta files if necessary (e.g., `vite.config.js`, `package.json`).

**Example:**
```js
// src/components/ProductFilter.jsx
import React from 'react';

export default function ProductFilter({ onFilter }) {
  // ...
}
```
```js
// src/pages/ProductsPage.jsx
import ProductFilter from '../components/ProductFilter.jsx';
// ...
```
```json
// src/data/products.json
[
  { "id": 1, "name": "Item A", "price": 10 }
]
```

### Design System and Style Consolidation
**Trigger:** When updating the design system, unifying color tokens, or refactoring styling for consistency.
**Command:** `/design-system-update`

1. Update color variables or tokens in CSS (e.g., `src/index.css`, `@theme` blocks).
2. Replace or refactor Tailwind classes in component and page files.
3. Update relevant React components and pages to use new design tokens.
4. Test visual consistency across the app.

**Example:**
```css
/* src/index.css */
:root {
  --primary-color: #4f46e5;
  --secondary-color: #f59e42;
}
```
```js
// src/components/Button.jsx
export default function Button({ children }) {
  return (
    <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

## Testing Patterns

- **Test files** follow the pattern `*.test.*` (e.g., `ProductList.test.jsx`).
- **Testing framework** is not specified in the repository analysis.
- **Location:** Test files are typically placed alongside the components they test.
- **Example:**
  ```js
  // src/components/ProductList.test.jsx
  import { render } from '@testing-library/react';
  import ProductList from './ProductList';

  test('renders product list', () => {
    render(<ProductList products={[]} />);
    // assertions...
  });
  ```

## Commands

| Command                | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| /feature               | Start feature development across multiple components and pages           |
| /design-system-update  | Standardize or refactor design system and styles across the codebase     |
```
