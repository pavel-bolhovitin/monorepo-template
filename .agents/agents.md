# Global AI Instructions

**This file is the single source of truth for all AI agents (Cursor, Claude, Cline, Windsurf, etc.).**  
Do not duplicate these rules in tool-specific configs; reference this file instead.

---

## Project Context

- **Monorepo**: pnpm workspaces; apps in `apps/`, shared packages in `packages/`.
- **Tech stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Biome (lint + format).
- **UI**: Shared `@repo/ui` package with shadcn-style components and `cn()` from `tailwind-merge` + `clsx`.

## Documentation Map

Every file under `.agents/` that defines rules or context must be listed here. Add new entries when creating new files in `.agents/`.

- [.agents/common-rule.md](./common-rule.md) — Language and general rules
- [.agents/react-rule.md](./react-rule.md) — React component conventions

## Commands

- App dev: `pnpm -F web dev` or `pnpm --filter web dev`
- Lint: `pnpm run lint` (root), format: `pnpm run format`
