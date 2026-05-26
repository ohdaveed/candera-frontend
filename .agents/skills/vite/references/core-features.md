---
name: vite-features
description: Vite-specific import patterns and runtime features
---

# Vite Features

## Glob Import

Import multiple modules matching a pattern:

```ts
<<<<<<< HEAD
const modules = import.meta.glob("./dir/*.ts");
=======
const modules = import.meta.glob('./dir/*.ts')
>>>>>>> origin/master
// { './dir/foo.ts': () => import('./dir/foo.ts'), ... }

for (const path in modules) {
  modules[path]().then((mod) => {
<<<<<<< HEAD
    console.log(path, mod);
  });
=======
    console.log(path, mod)
  })
>>>>>>> origin/master
}
```

### Eager Loading

```ts
<<<<<<< HEAD
const modules = import.meta.glob("./dir/*.ts", { eager: true });
=======
const modules = import.meta.glob('./dir/*.ts', { eager: true })
>>>>>>> origin/master
// Modules loaded immediately, no dynamic import
```

### Named Imports

```ts
<<<<<<< HEAD
const modules = import.meta.glob("./dir/*.ts", { import: "setup" });
// Only imports the 'setup' export from each module

const defaults = import.meta.glob("./dir/*.ts", { import: "default", eager: true });
=======
const modules = import.meta.glob('./dir/*.ts', { import: 'setup' })
// Only imports the 'setup' export from each module

const defaults = import.meta.glob('./dir/*.ts', { import: 'default', eager: true })
>>>>>>> origin/master
```

### Multiple Patterns

```ts
<<<<<<< HEAD
const modules = import.meta.glob(["./dir/*.ts", "./another/*.ts"]);
=======
const modules = import.meta.glob(['./dir/*.ts', './another/*.ts'])
>>>>>>> origin/master
```

### Negative Patterns

```ts
<<<<<<< HEAD
const modules = import.meta.glob(["./dir/*.ts", "!**/ignored.ts"]);
=======
const modules = import.meta.glob(['./dir/*.ts', '!**/ignored.ts'])
>>>>>>> origin/master
```

### Custom Queries

```ts
<<<<<<< HEAD
const svgRaw = import.meta.glob("./icons/*.svg", { query: "?raw", import: "default" });
const svgUrls = import.meta.glob("./icons/*.svg", { query: "?url", import: "default" });
=======
const svgRaw = import.meta.glob('./icons/*.svg', { query: '?raw', import: 'default' })
const svgUrls = import.meta.glob('./icons/*.svg', { query: '?url', import: 'default' })
>>>>>>> origin/master
```

## Asset Import Queries

### URL Import

```ts
<<<<<<< HEAD
import imgUrl from "./img.png";
=======
import imgUrl from './img.png'
>>>>>>> origin/master
// Returns resolved URL: '/src/img.png' (dev) or '/assets/img.2d8efhg.png' (build)
```

### Explicit URL

```ts
<<<<<<< HEAD
import workletUrl from "./worklet.js?url";
=======
import workletUrl from './worklet.js?url'
>>>>>>> origin/master
```

### Raw String

```ts
<<<<<<< HEAD
import shaderCode from "./shader.glsl?raw";
=======
import shaderCode from './shader.glsl?raw'
>>>>>>> origin/master
```

### Inline/No-Inline

```ts
<<<<<<< HEAD
import inlined from "./small.png?inline"; // Force base64 inline
import notInlined from "./large.png?no-inline"; // Force separate file
=======
import inlined from './small.png?inline'    // Force base64 inline
import notInlined from './large.png?no-inline'  // Force separate file
>>>>>>> origin/master
```

### Web Workers

```ts
<<<<<<< HEAD
import Worker from "./worker.ts?worker";
const worker = new Worker();

// Or inline:
import InlineWorker from "./worker.ts?worker&inline";
=======
import Worker from './worker.ts?worker'
const worker = new Worker()

// Or inline:
import InlineWorker from './worker.ts?worker&inline'
>>>>>>> origin/master
```

Preferred pattern using constructor:

```ts
<<<<<<< HEAD
const worker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});
=======
const worker = new Worker(new URL('./worker.ts', import.meta.url), {
  type: 'module',
})
>>>>>>> origin/master
```

## Environment Variables

### Built-in Constants

```ts
<<<<<<< HEAD
import.meta.env.MODE; // 'development' | 'production' | custom
import.meta.env.BASE_URL; // Base URL from config
import.meta.env.PROD; // true in production
import.meta.env.DEV; // true in development
import.meta.env.SSR; // true when running in server
=======
import.meta.env.MODE      // 'development' | 'production' | custom
import.meta.env.BASE_URL  // Base URL from config
import.meta.env.PROD      // true in production
import.meta.env.DEV       // true in development
import.meta.env.SSR       // true when running in server
>>>>>>> origin/master
```

### Custom Variables

Only `VITE_` prefixed vars exposed to client:

```
# .env
VITE_API_URL=https://api.example.com
DB_PASSWORD=secret  # NOT exposed to client
```

```ts
<<<<<<< HEAD
console.log(import.meta.env.VITE_API_URL); // works
console.log(import.meta.env.DB_PASSWORD); // undefined
=======
console.log(import.meta.env.VITE_API_URL) // works
console.log(import.meta.env.DB_PASSWORD)  // undefined
>>>>>>> origin/master
```

### Mode-specific Files

```
.env                # always loaded
.env.local          # always loaded, gitignored
.env.[mode]         # only in specified mode
.env.[mode].local   # only in specified mode, gitignored
```

### TypeScript Support

```ts
// vite-env.d.ts
interface ImportMetaEnv {
<<<<<<< HEAD
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
=======
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
>>>>>>> origin/master
}
```

### HTML Replacement

```html
<p>Running in %MODE%</p>
<<<<<<< HEAD
<script>
  window.API = "%VITE_API_URL%";
</script>
=======
<script>window.API = "%VITE_API_URL%"</script>
>>>>>>> origin/master
```

## CSS Modules

Any `.module.css` file treated as CSS module:

```ts
<<<<<<< HEAD
import styles from "./component.module.css";
element.className = styles.button;
=======
import styles from './component.module.css'
element.className = styles.button
>>>>>>> origin/master
```

With camelCase conversion:

```ts
// .my-class -> myClass (if css.modules.localsConvention configured)
<<<<<<< HEAD
import { myClass } from "./component.module.css";
=======
import { myClass } from './component.module.css'
>>>>>>> origin/master
```

## JSON Import

```ts
<<<<<<< HEAD
import pkg from "./package.json";
import { version } from "./package.json"; // Named import with tree-shaking
=======
import pkg from './package.json'
import { version } from './package.json'  // Named import with tree-shaking
>>>>>>> origin/master
```

## HMR API

```ts
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle update
<<<<<<< HEAD
  });

  import.meta.hot.dispose((data) => {
    // Cleanup before module is replaced
  });

  import.meta.hot.invalidate(); // Force full reload
=======
  })
  
  import.meta.hot.dispose((data) => {
    // Cleanup before module is replaced
  })
  
  import.meta.hot.invalidate()  // Force full reload
>>>>>>> origin/master
}
```

<!--
Source references:
- https://vite.dev/guide/features
- https://vite.dev/guide/env-and-mode
- https://vite.dev/guide/assets
- https://vite.dev/guide/api-hmr
-->
