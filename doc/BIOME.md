# Biome (lint + format)

`api/` uses [Biome](https://biomejs.dev/) for linting and formatting instead of ESLint/Prettier.
Config lives in `api/biome.json`.

## Commands

Run from `api/`:

| Command | What it does |
|---|---|
| `npm run lint` | `biome check --write .` — lints and formats, applying safe fixes (import order, restricted-import rule, style rules). |
| `npm run format` | `biome format --write .` — formatting only, no lint rules. |
| `npm run check` | `biome check .` — same checks as `lint`, but read-only (no `--write`) — fast way to see if anything's off before fixing, or to use in CI. |
| `npx biome check --write . --unsafe` | Also applies fixes marked unsafe (review the diff after). |

## Style

- 2-space indent, single quotes, semicolons always, trailing commas everywhere, 100-char line width.
- Line endings: CRLF (matches this Windows checkout).
- Import order is enforced and auto-fixed (`assist.actions.source.organizeImports`).
- `@/` path alias is required for any import that crosses folders — a relative import (`../`,
  `./sub/foo`) triggers `lint/style/noRestrictedImports`. Only same-folder relative imports
  (`./sibling-file`) are allowed. See `CLAUDE.md` for the full rule.

## Known gap vs the old ESLint setup

Biome does not do type-aware linting the way `typescript-eslint`'s `recommendedTypeChecked` did.
There is no equivalent for rules like `no-floating-promises` or `no-unsafe-argument` — those
checks are gone. Rely on `tsc --noEmit` and code review for that class of bug instead.

## Editor integration

Install the [Biome VS Code extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
for inline diagnostics and format-on-save, instead of the ESLint/Prettier extensions.
