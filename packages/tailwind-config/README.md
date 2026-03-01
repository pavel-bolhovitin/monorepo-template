# @repo/tailwind-config

Shared Tailwind CSS configuration and theme for the monorepo.

## Setup in a package

### 1. Add the workspace dependency

In your package’s `package.json`:

```json
{
  "devDependencies": {
    "@repo/tailwind-config": "workspace:*"
  }
}
```

### 2. Copy Tailwind dev dependencies into your package

Copy the dev dependencies from this package’s `package.json` into your package’s `devDependencies`. Keep versions in sync with this package.

```json
{
  "devDependencies": {
    "tailwindcss": "4.2.1",
    "@tailwindcss/postcss": "4.2.1",
    "postcss": "8.5.6"
  }
}
```

### 3. Add PostCSS config

Create or update `postcss.config.mjs` in your package root to use the shared config:

**Option A – Re-export the config (recommended):**

```js
import postcssConfig from "@repo/tailwind-config/postcss";

export default postcssConfig;
```

**Option B – Extend the config:**

```js
import baseConfig from "@repo/tailwind-config/postcss";

export default {
  ...baseConfig,
  plugins: {
    ...baseConfig.plugins,
    // your extra plugins
  },
};
```

### 4. Add a CSS file in your package

Create a CSS file (e.g. `src/styles/tailwind.css`) with content:

```css
@import "tailwindcss";
@import "@repo/tailwind-config";
```

In `globals.css`:

```css
@import "./tailwind.css";
...
```

After that, run your package’s build/dev and Tailwind should work with the shared setup.
