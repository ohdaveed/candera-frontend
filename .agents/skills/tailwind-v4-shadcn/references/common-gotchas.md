# Common Gotchas & Solutions

## Critical Failures (Will Break Your Build)

### 1. `:root` Inside `@layer base`

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
@layer base {
  :root {
    --background: hsl(0 0% 100%);
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
:root {
  --background: hsl(0 0% 100%);
}

@layer base {
  body {
    background-color: var(--background);
  }
}
```

**Why:** Tailwind v4 strips CSS outside `@theme`/`@layer`, but `:root` must be at root level.

---

### 2. Nested `@theme` Directive

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
@theme {
  --color-primary: hsl(0 0% 0%);
}

.dark {
  @theme {
    --color-primary: hsl(0 0% 100%);
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
:root {
  --primary: hsl(0 0% 0%);
}

.dark {
  --primary: hsl(0 0% 100%);
}

@theme inline {
  --color-primary: var(--primary);
}
```

**Why:** Tailwind v4 doesn't support `@theme` inside selectors.

---

### 3. Double `hsl()` Wrapping

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
@layer base {
  body {
    background-color: hsl(var(--background));
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

```css
@layer base {
  body {
    background-color: var(--background); /* Already has hsl() */
=======
```css
@layer base {
  body {
    background-color: var(--background);  /* Already has hsl() */
>>>>>>> origin/master
  }
}
```

**Why:** Variables already contain `hsl()`, double-wrapping creates `hsl(hsl(...))`.

---

### 4. Colors in `tailwind.config.ts`

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        primary: "hsl(var(--primary))",
      },
    },
  },
};
```

✅ **CORRECT:**

=======
        primary: 'hsl(var(--primary))'
      }
    }
  }
}
```

✅ **CORRECT:**
>>>>>>> origin/master
```typescript
// Delete tailwind.config.ts entirely OR leave it empty
export default {}

// components.json
{
  "tailwind": {
    "config": ""  // ← Empty string
  }
}
```

**Why:** Tailwind v4 completely ignores `theme.extend.colors`.

---

### 5. Missing `@theme inline` Mapping

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
:root {
  --background: hsl(0 0% 100%);
}

/* No @theme inline block */
```

Result: `bg-background` class doesn't exist

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
:root {
  --background: hsl(0 0% 100%);
}

@theme inline {
  --color-background: var(--background);
}
```

**Why:** `@theme inline` generates the utility classes.

---

## Configuration Gotchas

### 6. Wrong components.json Config

❌ **WRONG:**
<<<<<<< HEAD

```json
{
  "tailwind": {
    "config": "tailwind.config.ts" // ← No!
=======
```json
{
  "tailwind": {
    "config": "tailwind.config.ts"  // ← No!
>>>>>>> origin/master
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

```json
{
  "tailwind": {
    "config": "" // ← Empty for v4
=======
```json
{
  "tailwind": {
    "config": ""  // ← Empty for v4
>>>>>>> origin/master
  }
}
```

---

### 7. Using PostCSS Instead of Vite Plugin

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```typescript
// vite.config.ts
export default defineConfig({
  css: {
<<<<<<< HEAD
    postcss: "./postcss.config.js", // Old v3 way
  },
});
```

✅ **CORRECT:**

```typescript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()], // v4 way
});
=======
    postcss: './postcss.config.js'  // Old v3 way
  }
})
```

✅ **CORRECT:**
```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()]  // v4 way
})
>>>>>>> origin/master
```

---

### 8. Missing Path Aliases

❌ **WRONG:**
<<<<<<< HEAD

```typescript
// tsconfig.json has no paths
import { Button } from "../../components/ui/button";
```

✅ **CORRECT:**

=======
```typescript
// tsconfig.json has no paths
import { Button } from '../../components/ui/button'
```

✅ **CORRECT:**
>>>>>>> origin/master
```json
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

```typescript
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
=======
import { Button } from '@/components/ui/button'
>>>>>>> origin/master
```

---

## Color System Gotchas

### 9. Using `dark:` Variants for Semantic Colors

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<div className="bg-primary dark:bg-primary-dark" />
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<div className="bg-primary" />
```

**Why:** With proper CSS variable setup, `bg-primary` automatically responds to theme.

---

### 10. Hardcoded Color Values

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<div className="bg-blue-600 dark:bg-blue-400" />
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<div className="bg-primary" />  {/* Or bg-info, bg-success, etc. */}
```

**Why:** Semantic tokens enable theme switching and reduce repetition.

---

## Component Gotchas

### 11. Missing `cn()` Utility

❌ **WRONG:**
<<<<<<< HEAD

```tsx
<div className={`base ${isActive && "active"}`} />
```

✅ **CORRECT:**

```tsx
import { cn } from "@/lib/utils";
<div className={cn("base", isActive && "active")} />;
=======
```tsx
<div className={`base ${isActive && 'active'}`} />
```

✅ **CORRECT:**
```tsx
import { cn } from '@/lib/utils'
<div className={cn("base", isActive && "active")} />
>>>>>>> origin/master
```

**Why:** `cn()` properly merges and deduplicates Tailwind classes.

---

### 12. Empty String in Radix Select

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<SelectItem value="">Select an option</SelectItem>
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```tsx
<SelectItem value="placeholder">Select an option</SelectItem>
```

**Why:** Radix UI Select doesn't allow empty string values.

---

## Installation Gotchas

### 13. Wrong Tailwind Package

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```bash
npm install tailwindcss@^3.4.0  # v3
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```bash
npm install tailwindcss@^4.1.0  # v4
npm install @tailwindcss/vite
```

---

### 14. Missing Dependencies

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```json
{
  "dependencies": {
    "tailwindcss": "^4.1.0"
    // Missing @tailwindcss/vite
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```json
{
  "dependencies": {
    "tailwindcss": "^4.1.0",
    "@tailwindcss/vite": "^4.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@types/node": "^24.0.0"
  }
}
```

---

### 17. tw-animate-css Import Error (REAL-WORLD ISSUE)

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```bash
npm install tailwindcss-animate  # Deprecated package
```

```css
@import "tw-animate-css";  # Package doesn't exist in v4
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```bash
# Don't install tailwindcss-animate at all
# Use native CSS animations or @tailwindcss/motion
```

**Why:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
- `tailwindcss-animate` is deprecated in Tailwind v4
- Causes import errors during build
- shadcn/ui docs may still reference it (outdated)
- The skill handles animations differently in v4

**Impact:** Build failure, requires manual CSS file cleanup

---

### 18. Duplicate @layer base After shadcn init (REAL-WORLD ISSUE)

❌ **WRONG:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
/* After running shadcn init, you might have: */
@layer base {
  body {
    background-color: var(--background);
  }
}

<<<<<<< HEAD
@layer base {
  /* ← Duplicate added by shadcn init */
=======
@layer base {  /* ← Duplicate added by shadcn init */
>>>>>>> origin/master
  * {
    border-color: hsl(var(--border));
  }
}
```

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
```css
/* Merge into single @layer base block */
@layer base {
  * {
    border-color: var(--border);
  }

  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

**Why:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
- `shadcn init` adds its own `@layer base` block
- Results in duplicate layer declarations
- Can cause unexpected CSS priority issues
- Easy to miss during setup

**Prevention:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
- Check `src/index.css` immediately after running `shadcn init`
- Merge any duplicate `@layer base` blocks
- Keep only one base layer section

**Impact:** CSS priority issues, harder to debug styling problems

---

## Testing Gotchas

### 15. Not Testing Both Themes

❌ **WRONG:**
Only testing in light mode

✅ **CORRECT:**
Test in:
<<<<<<< HEAD

=======
>>>>>>> origin/master
- Light mode
- Dark mode
- System mode
- Both initial load and toggle

---

### 16. Not Checking Contrast

❌ **WRONG:**
Colors look good but fail WCAG

✅ **CORRECT:**
<<<<<<< HEAD

=======
>>>>>>> origin/master
- Use browser DevTools Lighthouse
- Check contrast ratios (4.5:1 minimum)
- Test with actual users

---

## Quick Diagnosis

**Symptoms → Likely Cause:**

<<<<<<< HEAD
| Symptom                   | Likely Cause                                  |
| ------------------------- | --------------------------------------------- |
| `bg-primary` doesn't work | Missing `@theme inline` mapping               |
| Colors all black/white    | Double `hsl()` wrapping                       |
| Dark mode not switching   | Missing ThemeProvider                         |
| Build fails               | `tailwind.config.ts` exists with theme config |
| Text invisible            | Wrong contrast colors                         |
| `@/` imports fail         | Missing path aliases in tsconfig              |
=======
| Symptom | Likely Cause |
|---------|-------------|
| `bg-primary` doesn't work | Missing `@theme inline` mapping |
| Colors all black/white | Double `hsl()` wrapping |
| Dark mode not switching | Missing ThemeProvider |
| Build fails | `tailwind.config.ts` exists with theme config |
| Text invisible | Wrong contrast colors |
| `@/` imports fail | Missing path aliases in tsconfig |
>>>>>>> origin/master

---

## Prevention Checklist

Before deploying:
<<<<<<< HEAD

=======
>>>>>>> origin/master
- [ ] No `tailwind.config.ts` file (or it's empty)
- [ ] `components.json` has `"config": ""`
- [ ] All colors have `hsl()` wrapper in `:root`
- [ ] `@theme inline` maps all variables
- [ ] `@layer base` doesn't wrap `:root`
- [ ] Theme provider wraps app
- [ ] Tested in both light and dark modes
- [ ] All text has sufficient contrast
