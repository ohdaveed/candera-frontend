---
name: vite-environment-api
description: Vite 6+ Environment API for multiple runtime environments
---

# Environment API (Vite 6+)

The Environment API formalizes multiple runtime environments beyond the traditional client/SSR split.

## Concept

Before Vite 6: Two implicit environments (`client` and `ssr`).

Vite 6+: Configure as many environments as needed (browser, node server, edge server, etc.).

## Basic Configuration

For SPA/MPA, nothing changes—options apply to the implicit `client` environment:

```ts
export default defineConfig({
  build: { sourcemap: false },
<<<<<<< HEAD
  optimizeDeps: { include: ["lib"] },
});
=======
  optimizeDeps: { include: ['lib'] },
})
>>>>>>> origin/master
```

## Multiple Environments

```ts
export default defineConfig({
<<<<<<< HEAD
  build: { sourcemap: false }, // Inherited by all environments
  optimizeDeps: { include: ["lib"] }, // Client only
=======
  build: { sourcemap: false },  // Inherited by all environments
  optimizeDeps: { include: ['lib'] },  // Client only
>>>>>>> origin/master
  environments: {
    // SSR environment
    server: {},
    // Edge runtime environment
    edge: {
      resolve: { noExternal: true },
    },
  },
<<<<<<< HEAD
});
=======
})
>>>>>>> origin/master
```

Environments inherit top-level config. Some options (like `optimizeDeps`) only apply to `client` by default.

## Environment Options

```ts
interface EnvironmentOptions {
<<<<<<< HEAD
  define?: Record<string, any>;
  resolve?: EnvironmentResolveOptions;
  optimizeDeps: DepOptimizationOptions;
  consumer?: "client" | "server";
  dev: DevOptions;
  build: BuildOptions;
=======
  define?: Record<string, any>
  resolve?: EnvironmentResolveOptions
  optimizeDeps: DepOptimizationOptions
  consumer?: 'client' | 'server'
  dev: DevOptions
  build: BuildOptions
>>>>>>> origin/master
}
```

## Custom Environment Instances

Runtime providers can define custom environments:

```ts
<<<<<<< HEAD
import { customEnvironment } from "vite-environment-provider";
=======
import { customEnvironment } from 'vite-environment-provider'
>>>>>>> origin/master

export default defineConfig({
  environments: {
    ssr: customEnvironment({
<<<<<<< HEAD
      build: { outDir: "/dist/ssr" },
    }),
  },
});
=======
      build: { outDir: '/dist/ssr' },
    }),
  },
})
>>>>>>> origin/master
```

Example: Cloudflare's Vite plugin runs code in `workerd` runtime during development.

## Backward Compatibility

- `server.moduleGraph` returns mixed client/SSR view
- `ssrLoadModule` still works
- Existing SSR apps work unchanged

## When to Use

- **End users**: Usually don't need to configure—frameworks handle it
- **Plugin authors**: Use for environment-aware transformations
- **Framework authors**: Create custom environments for their runtime needs

## Plugin Environment Access

Plugins can access environment in hooks:

```ts
{
  name: 'env-aware',
  transform(code, id, options) {
    if (options?.ssr) {
      // SSR-specific transform
    }
  },
}
```

<!--
Source references:
- https://vite.dev/guide/api-environment
- https://vite.dev/blog/announcing-vite6
-->
