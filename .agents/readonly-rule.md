# Readonly Files Rule

Apply these rules when working with files configured as readonly in workspace settings.

## Source of truth

- Read readonly patterns from `.vscode/settings.json`, key `files.readonlyInclude`.
- Current readonly pattern: `**/*.generated.ts`.

## Behavior

- Do not manually edit files that match readonly patterns.
- If a generated file needs updates, modify the source template/script and regenerate.
- Keep generated outputs deterministic to avoid noisy diffs.
- If a change appears to require direct edits in a readonly file, ask for explicit user approval first.

## Verification

- Before editing `*.generated.ts`, confirm whether the file is readonly by checking `.vscode/settings.json`.
