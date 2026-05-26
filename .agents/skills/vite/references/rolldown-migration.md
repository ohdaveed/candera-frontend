---
name: vite-rolldown
description: Vite 8 Rolldown bundler and Oxc transformer migration
---

# Rolldown Migration (Vite 8)

Vite 8 replaces esbuild+Rollup with Rolldown, a unified Rust-based bundler.

## What Changed

<<<<<<< HEAD
| Before (Vite 7)            | After (Vite 8)    |
| -------------------------- | ----------------- |
| esbuild (dev transform)    | Oxc Transformer   |
| esbuild (dep pre-bundling) | Rolldown          |
| Rollup (production build)  | Rolldown          |
| `rollupOptions`            | `rolldownOptions` |
| `esbuild` option           | `oxc` option      |
=======
| Before (Vite 7) | After (Vite 8) |
|-----------------|----------------|
| esbuild (dev transform) | Oxc Transformer |
| esbuild (dep pre-bundling) | Rolldown |
| Rollup (production build) | Rolldown |
| `rollupOptions` | `rolldownOptions` |
| `esbuild` option | `oxc` option |
>>>>>>> origin/master

## Performance Impact

- 10-30x faster than Rollup for production builds
- Matches esbuild's dev performance
- Unified behavior between dev and build

## Config Migration

### rollupOptions → rolldownOptions

```ts
// Before (Vite 7)
export default defineConfig({
  build: {
    rollupOptions: {
<<<<<<< HEAD
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
=======
      external: ['vue'],
      output: { globals: { vue: 'Vue' } },
    },
  },
})
>>>>>>> origin/master

// After (Vite 8)
export default defineConfig({
  build: {
    rolldownOptions: {
<<<<<<< HEAD
      external: ["vue"],
      output: { globals: { vue: "Vue" } },
    },
  },
});
=======
      external: ['vue'],
      output: { globals: { vue: 'Vue' } },
    },
  },
})
>>>>>>> origin/master
```

### esbuild → oxc

```ts
// Before (Vite 7)
export default defineConfig({
  esbuild: {
<<<<<<< HEAD
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
=======
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
>>>>>>> origin/master

// After (Vite 8)
export default defineConfig({
  oxc: {
    jsx: {
<<<<<<< HEAD
      runtime: "classic",
      pragma: "h",
      pragmaFrag: "Fragment",
    },
  },
});
=======
      runtime: 'classic',
      pragma: 'h',
      pragmaFrag: 'Fragment',
    },
  },
})
>>>>>>> origin/master
```

### JSX Configuration

```ts
export default defineConfig({
  oxc: {
    jsx: {
<<<<<<< HEAD
      runtime: "automatic", // or 'classic'
      importSource: "react", // for automatic runtime
    },
    jsxInject: `import React from 'react'`, // auto-inject
  },
});
=======
      runtime: 'automatic',  // or 'classic'
      importSource: 'react', // for automatic runtime
    },
    jsxInject: `import React from 'react'`,  // auto-inject
  },
})
>>>>>>> origin/master
```

### Custom Transform Targets

```ts
export default defineConfig({
  oxc: {
<<<<<<< HEAD
    include: ["**/*.ts", "**/*.tsx"],
    exclude: ["node_modules/**"],
  },
});
=======
    include: ['**/*.ts', '**/*.tsx'],
    exclude: ['node_modules/**'],
  },
})
>>>>>>> origin/master
```

## Plugin Compatibility

Most Vite plugins work unchanged. Rolldown supports Rollup's plugin API.

If a plugin only works during build:

```ts
{
  ...rollupPlugin(),
  enforce: 'post',
  apply: 'build',
}
```

## New Capabilities

Rolldown unlocks features not possible before:

- Full bundle mode (experimental)
- Module-level persistent cache
- More flexible chunk splitting
- Module Federation support

## Gradual Migration

For large projects, migrate via `rolldown-vite` first:

```bash
# Step 1: Test with rolldown-vite
pnpm add -D rolldown-vite

# Replace vite import in config
import { defineConfig } from 'rolldown-vite'

# Step 2: Once stable, upgrade to Vite 8
pnpm add -D vite@8
```

## Overriding Vite in Frameworks

When framework depends on older Vite:

```json
{
  "pnpm": {
    "overrides": {
      "vite": "8.0.0"
    }
  }
}
```

<!--
Source references:
- https://vite.dev/blog/announcing-vite8-beta
- https://vite.dev/blog/announcing-vite7
- https://vite.dev/config/shared-options#oxc
-->
