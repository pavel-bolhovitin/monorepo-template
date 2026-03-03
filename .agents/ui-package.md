# UI Package (packages/ui)

Apply these rules when working with the shared `@repo/ui` package.

## Barrel exports

- After **adding, removing, or renaming** a component file in `packages/ui/src/components/ui/`, run **`pnpm run generate:exports`** so `index.generated.ts` is updated. Suggest this to the user when you change that folder.
