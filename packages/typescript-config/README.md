# @repo/typescript-config

Shared TypeScript configuration for the monorepo.

## Setup in a package

### 1. Add the workspace dependency

In your package’s `package.json`, add to `devDependencies`:

```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*"
  }
}
```

### 2. Add TypeScript

Install TypeScript with the same version as this config:

```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "5.9.3"
  }
}
```

Check this package’s `package.json` for the current version and keep them in sync.

### 3. Add tsconfig

Create `tsconfig.json` in your package root. Extend the right preset:

**Next.js app:**

```json
{
  "extends": "@repo/typescript-config/app-nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

**React package (library):**

```json
{
  "extends": "@repo/typescript-config/package-react.json"
}
```

**Base only:**

```json
{
  "extends": "@repo/typescript-config/base.json"
}
```

Add or override `compilerOptions`, `include`, and `exclude` as needed for your package.
