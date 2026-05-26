---
name: vite-plugin-api
description: Vite plugin authoring with Vite-specific hooks
---

# Vite Plugin API

Vite plugins extend Rolldown's plugin interface with Vite-specific hooks.

## Basic Structure

```ts
function myPlugin(): Plugin {
  return {
<<<<<<< HEAD
    name: "my-plugin",
    // hooks...
  };
=======
    name: 'my-plugin',
    // hooks...
  }
>>>>>>> origin/master
}
```

## Vite-Specific Hooks

### config

Modify config before resolution:

```ts
const plugin = () => ({
<<<<<<< HEAD
  name: "add-alias",
  config: () => ({
    resolve: {
      alias: { foo: "bar" },
    },
  }),
});
=======
  name: 'add-alias',
  config: () => ({
    resolve: {
      alias: { foo: 'bar' },
    },
  }),
})
>>>>>>> origin/master
```

### configResolved

Access final resolved config:

```ts
const plugin = () => {
<<<<<<< HEAD
  let config: ResolvedConfig;
  return {
    name: "read-config",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    transform(code, id) {
      if (config.command === "serve") {
        /* dev */
      }
    },
  };
};
=======
  let config: ResolvedConfig
  return {
    name: 'read-config',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    transform(code, id) {
      if (config.command === 'serve') { /* dev */ }
    },
  }
}
>>>>>>> origin/master
```

### configureServer

Add custom middleware to dev server:

```ts
const plugin = () => ({
<<<<<<< HEAD
  name: "custom-middleware",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // handle request
      next();
    });
  },
});
=======
  name: 'custom-middleware',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // handle request
      next()
    })
  },
})
>>>>>>> origin/master
```

Return function to run **after** internal middlewares:

```ts
configureServer(server) {
  return () => {
    server.middlewares.use((req, res, next) => {
      // runs after Vite's middlewares
    })
  }
}
```

### transformIndexHtml

Transform HTML entry files:

```ts
const plugin = () => ({
<<<<<<< HEAD
  name: "html-transform",
  transformIndexHtml(html) {
    return html.replace(/<title>(.*?)<\/title>/, "<title>New Title</title>");
  },
});
=======
  name: 'html-transform',
  transformIndexHtml(html) {
    return html.replace(/<title>(.*?)<\/title>/, '<title>New Title</title>')
  },
})
>>>>>>> origin/master
```

Inject tags:

```ts
transformIndexHtml() {
  return [
    { tag: 'script', attrs: { src: '/inject.js' }, injectTo: 'body' },
  ]
}
```

### handleHotUpdate

Custom HMR handling:

```ts
handleHotUpdate({ server, modules, timestamp }) {
  server.ws.send({ type: 'custom', event: 'special-update', data: {} })
  return [] // empty = skip default HMR
}
```

## Virtual Modules

Serve virtual content without files on disk:

```ts
const plugin = () => {
<<<<<<< HEAD
  const virtualModuleId = "virtual:my-module";
  const resolvedId = "\0" + virtualModuleId;

  return {
    name: "virtual-module",
    resolveId(id) {
      if (id === virtualModuleId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) {
        return `export const msg = "from virtual module"`;
      }
    },
  };
};
=======
  const virtualModuleId = 'virtual:my-module'
  const resolvedId = '\0' + virtualModuleId

  return {
    name: 'virtual-module',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedId
    },
    load(id) {
      if (id === resolvedId) {
        return `export const msg = "from virtual module"`
      }
    },
  }
}
>>>>>>> origin/master
```

Usage:

```ts
<<<<<<< HEAD
import { msg } from "virtual:my-module";
=======
import { msg } from 'virtual:my-module'
>>>>>>> origin/master
```

Convention: prefix user-facing path with `virtual:`, prefix resolved id with `\0`.

## Plugin Ordering

Use `enforce` to control execution order:

```ts
{
  name: 'pre-plugin',
  enforce: 'pre',  // runs before core plugins
}

{
  name: 'post-plugin',
  enforce: 'post', // runs after build plugins
}
```

Order: Alias → `enforce: 'pre'` → Core → User (no enforce) → Build → `enforce: 'post'` → Post-build

## Conditional Application

```ts
{
  name: 'build-only',
  apply: 'build',  // or 'serve'
}

// Function form:
{
  apply(config, { command }) {
    return command === 'build' && !config.build.ssr
  }
}
```

## Universal Hooks (from Rolldown)

These work in both dev and build:

- `resolveId(id, importer)` - Resolve import paths
- `load(id)` - Load module content
- `transform(code, id)` - Transform module code

```ts
transform(code, id) {
  if (id.endsWith('.custom')) {
    return { code: compile(code), map: null }
  }
}
```

## Client-Server Communication

Server to client:

```ts
configureServer(server) {
  server.ws.send('my:event', { msg: 'hello' })
}
```

Client side:

```ts
if (import.meta.hot) {
<<<<<<< HEAD
  import.meta.hot.on("my:event", (data) => {
    console.log(data.msg);
  });
=======
  import.meta.hot.on('my:event', (data) => {
    console.log(data.msg)
  })
>>>>>>> origin/master
}
```

Client to server:

```ts
// Client
<<<<<<< HEAD
import.meta.hot.send("my:from-client", { msg: "Hey!" });

// Server
server.ws.on("my:from-client", (data, client) => {
  client.send("my:ack", { msg: "Got it!" });
});
=======
import.meta.hot.send('my:from-client', { msg: 'Hey!' })

// Server
server.ws.on('my:from-client', (data, client) => {
  client.send('my:ack', { msg: 'Got it!' })
})
>>>>>>> origin/master
```

<!--
Source references:
- https://vite.dev/guide/api-plugin
-->
