# TypeScript config cheatsheet

Quick reference: key → purpose, example, when to use (package vs app).

---

## `declaration`

**Purpose:** Emits `.d.ts` files next to compiled `.js` so other projects get types and autocomplete when importing your code.

**Example:** `src/utils.ts`:

```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

With `"declaration": true` → e.g. `dist/utils.d.ts`:

```ts
export declare function greet(name: string): string;
```

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (library, shared code) | `true` — consumers need types |
| **App** (Next.js, SPA) | `false` or omit — types only inside the project |

---

## `declarationMap`

**Purpose:** Emits `.d.ts.map` files so IDEs can map from `.d.ts` back to original `.ts` source. "Go to definition" in a consuming project then opens your source, not the declaration file.

**Example:** With `declaration: true` + `declarationMap: true` you get `dist/utils.d.ts` and `dist/utils.d.ts.map`. Clicking a type in the consumer’s editor jumps to your `src/utils.ts`.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `true` — better DX for consumers (jump to source) |
| **App** | `false` or omit — no external consumers |

---

## `esModuleInterop`

**Purpose:** Lets you use default imports from CommonJS modules. Without it, `import X from 'cjs-package'` can fail; TypeScript expects `import * as X from '...'` for CJS.

**Example:**

```ts
// With esModuleInterop: true — works
import React from 'react';
import fs from 'fs';

// Without it you often need:
import * as React from 'react';
```

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `true` — most deps are CJS or mixed |
| **App** | `true` — same; default in many setups |

---

## `incremental`

**Purpose:** When `true`, TypeScript writes a `.tsbuildinfo` file and reuses it so the next build only recompiles changed files. When `false`, every build is a full rebuild.

**Example:** First build compiles everything. With `incremental: true`, the second run skips unchanged files → faster local/build CI when only a few files changed.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `false` — no `.tsbuildinfo` to ship or ignore; full rebuild is fine for libs |
| **App** | `true` — faster dev and CI; `.tsbuildinfo` in `.gitignore` if desired |

---

## `isolatedModules`

**Purpose:** Type-checks each file as if it were compiled alone (no cross-file type-only analysis). Required when a transpiler (Babel, esbuild, swc) compiles one file at a time — they can’t erase type-only exports or `const enum`, so TS flags code that would break.

**Example:** Without `isolatedModules`, `export { Foo } from './a'` is fine when `Foo` is only a type. With it, TS errors: use `export type { Foo }` so the transpiler doesn’t emit a runtime export. Same for `const enum` (use plain `enum` or union).

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `true` — consumers may use Babel/swc/esbuild |
| **App** | `true` — Next/Vite/etc. use file-by-file transpilation |

---

## `lib`

**Purpose:** Which built-in type definitions are available (e.g. `Promise`, `Map`, `document`, `fetch`). Omitted = default set based on `target` (e.g. ES5 → ES5 libs only).

**Example:** Node-only package: `["ES2022"]`. Browser or Next.js: `["ES2022", "DOM", "DOM.Iterable"]`. No DOM types: no `document`, `window`, etc.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `["ES2022", "DOM", "DOM.Iterable"]` — consumed by browser/bundler |
| **App** | Same; `["ES2022", "DOM", "DOM.Iterable"]` |

---

## `target`

**Purpose:** Which JS version `tsc` emits (syntax and features). Doesn’t change runtime by itself if you use a bundler (Babel/swc do their own transpilation).

**Example:** `"ES2022"` → classes, optional chaining, etc. `"ES5"` → down to IE-friendly. For bundled apps, `"ES2022"` or `"ESNext"` is common; bundler handles older targets.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `ES2022` or `ESNext` — app’s bundler sets real browser target |
| **App** | `ES2022` or `ESNext` when using a bundler; let bundler set browser target |

---

## `skipLibCheck`

**Purpose:** Skip type checking of declaration files (`.d.ts`), including `node_modules`. Faster builds and fewer errors from broken or outdated typings.

**Example:** A dependency’s `.d.ts` has a typo or wrong types. With `skipLibCheck: true` you don’t get errors from it; your own code is still fully checked.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `true` — faster, avoids dependency type noise |
| **App** | `true` — same |

---

## `module`

**Purpose:** Which module format `tsc` emits: `"CommonJS"`, `"ESNext"`/`"ES2022"`, or `"NodeNext"` (follows Node’s native ESM/CJS). Bundlers often ignore this and do their own thing.

**Example:** `"NodeNext"` → output and resolution match Node (`.mjs`/`package.json` "type"). `"ESNext"` → emit `import`/`export` as-is. `"CommonJS"` → emit `require`/`module.exports`.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `ESNext` or `NodeNext` — consumed by app’s bundler |
| **App** (bundled) | `ESNext` or `NodeNext`; bundler decides final format |

---

## `moduleDetection`

**Purpose:** How TS decides if a file is a module. `"auto"` = module if it has `import`/`export`. `"legacy"` = script if no import/export (old Node behavior). `"force"` = treat every file as a module.

**Example:** With `"force"`, a file with no import/export is still a module (no global scope leakage, consistent behavior). With `"legacy"`, it’s a script and top-level variables are global.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** | `force` — no script/module ambiguity |
| **App** | `force` — same; default in strict ESM setups |

---

## `moduleResolution`

**Purpose:** How TS resolves `import 'pkg'` and `import './file'`: `"node"`, `"node16"`/`"NodeNext"`, or `"bundler"`. Controls respect for `package.json` `exports`, `.mjs`/`.cjs`, etc.

**Example:** `"NodeNext"` = Node’s real rules (exports, conditions). `"bundler"` = assume a bundler will resolve (e.g. Vite); allows `exports` but more relaxed. `"node"` = classic Node (no `exports`).

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `bundler` or `NodeNext` — consumed by Next/Vite/etc. |
| **App** (bundler) | `NodeNext` or `bundler` — `bundler` if you don’t need Node resolution |

---

## `strict`

**Purpose:** Enables a bundle of strict checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, and others. Catches more bugs at compile time; code must be more explicit.

**Example:** With `strict: true`, `function f(x) { return x }` errors (implicit `any`). `const n: number = null` errors (`strictNullChecks`). You add types and handle `null`/`undefined` explicitly.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `true` — stable API, fewer runtime surprises for consumers |
| **App** | `true` — same; default for new projects |

---

## `resolveJsonModule`

**Purpose:** Allows importing `.json` files so TypeScript treats them as modules and infers types (e.g. `import data from './config.json'`).

**Example:** With `resolveJsonModule: true`, `import pkg from './package.json'` works and `pkg.version` is typed. Without it, TS doesn’t resolve `.json` as a module and the import errors.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `true` if you import JSON (config, fixtures); else optional |
| **App** | `true` — common for config, i18n, static data |

---

## `allowJs`

**Purpose:** Lets TypeScript include and type-check `.js` (and `.jsx`) files. Use when migrating from JS to TS or when the project mixes JS and TS.

**Example:** With `allowJs: true`, a `.js` file in `include` is checked (and can get type errors from `// @ts-check` or from inference). Imports from `.js` into `.ts` work; TS uses allowImplicitAny-style checking for JS unless you add types.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `false` unless you ship or consume plain JS |
| **App** | `true` during JS→TS migration; `false` once all TS |

---

## `noEmit`

**Purpose:** TypeScript only type-checks; it does not emit any `.js`, `.d.ts`, or other output. Used when a bundler (Next, Vite, esbuild) does the emit.

**Example:** With `noEmit: true`, `tsc` exits with 0 only if types are valid; no `dist/` or `.js` files. Next.js/Vite run their own transpilation, so `tsc` is often used only for checking (e.g. `tsc --noEmit` in CI).

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `false` — you usually emit JS + `.d.ts` for consumers |
| **App** (bundled) | `true` — bundler emits; use `tsc` for type-check only |

---

## `jsx`

**Purpose:** How TypeScript transforms JSX: emit as-is, to React.createElement, or to the new JSX runtime (e.g. `react-jsx`). Affects both type-checking and emitted code when `tsc` emits.

**Example:** `"react"` → `React.createElement(...)`. `"react-jsx"` → `_jsx(...)` (no React in scope). `"react-jsxdev"` = dev version of react-jsx. `"preserve"` → leave JSX for another tool (e.g. Babel). With `noEmit: true`, only typing behavior matters.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app, React) | `"react-jsx"` — modern runtime; or `"react"` for older React |
| **App** (React, bundler) | `"react-jsx"` (or what your framework sets, e.g. Next.js) |

---

## `baseUrl`

**Purpose:** Base directory for resolving non-relative module names. Required for `paths`; also lets `import 'utils/foo'` resolve from project root instead of `node_modules`.

**Example:** With `"baseUrl": "."` (or `"./"`), `import { x } from 'src/utils'` can resolve to `./src/utils` when combined with `paths`. Without `baseUrl`, `paths` are resolved relative to the config file.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | `"."` if you use `paths`; else omit |
| **App** | `"."` — common with path aliases (`@/components`, etc.) |

---

## `paths`

**Purpose:** Map import specifiers to actual paths (path aliases). Only affects type-checking; bundler must be configured separately (e.g. Next.js `compilerOptions.paths`, Vite `resolve.alias`).

**Example:** `"@/*": ["./src/*"]` lets you write `import { Button } from '@/components/Button'` instead of `'../../../components/Button'`. TS resolves types; Next/Vite resolve at build time.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | Usually omit — avoid aliases that consumers must mirror |
| **App** | Use with `baseUrl` for `@/...` or `~/...`; keep in sync with bundler |

---

## `plugins`

**Purpose:** TypeScript language/service plugins that run during type-checking. They can add custom diagnostics, transform types, or integrate with the editor (e.g. Next.js plugin adds checks for pages, config, and conventions).

**Example:** `"plugins": [{ "name": "next" }]` enables the Next.js TypeScript plugin: checks for invalid `next/head`/`next/image` usage, enforces route and config conventions, etc. Plugins are loaded by `tsc` and by the editor when it uses the project’s tsconfig.

**Recommendations:**

| Context   | Use |
|-----------|-----|
| **Package** (for web app) | Omit unless the package is a framework/tool that provides a plugin |
| **App** (Next.js) | `[{ "name": "next" }]` in the app’s tsconfig (or in shared nextjs config) |

---

<!-- Add more keys below in the same format -->
