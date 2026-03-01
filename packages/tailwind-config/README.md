# @repo/tailwind-config

Shared Tailwind CSS configuration and theme for the monorepo.

## Setup in a package

### 1. Add the workspace dependency

In your package’s `package.json`:

```json
{
  "dependencies": {
    "@repo/tailwind-config": "workspace:*"
  }
}
```

### 2. Add Tailwind dev dependencies

Add the same Tailwind versions used by this config to your package’s `devDependencies`:

```json
{
  "devDependencies": {
    "tailwindcss": "4.2.1",
    "@tailwindcss/postcss": "4.2.1"
  }
}
```

Check this package’s `package.json` for the current versions and keep them in sync.

### 3. Import the shared styles

In your package’s main CSS file (e.g. `src/styles/globals.css`):

```css
@import "@repo/tailwind-config";
```

This brings in Tailwind and the shared theme (colors, etc.). Add package-specific rules below this import if needed.

### 4. Add PostCSS config

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

After that, run your package’s build/dev and Tailwind should work with the shared setup.
