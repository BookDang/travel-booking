# Project conventions

- Write all documentation files (`*.md`) in English, regardless of the language used in chat.

## api/ (NestJS)

- No relative imports across folders (`../foo`, `./sub/foo`). Use the `@/` path alias instead
  (e.g. `@/<module>/domain/entities`), which maps to `api/src/*`. A relative import is only
  allowed between two files in the exact same folder (e.g. `./create-x.dto`).
  Enforced by the `style/noRestrictedImports` rule in `api/biome.json`.
- Every folder gets an `index.ts` barrel re-exporting its files, except the 4 top-level DDD
  layer folders themselves (`domain/`, `application/`, `infrastructure/`, `presentation/`) —
  their subfolders (`domain/entities`, `application/use-cases`, etc.) do get one. This keeps
  multi-file imports (e.g. all use-cases) to a single `@/.../use-cases` import line.
- Lint + format is Biome (`api/biome.json`), not ESLint/Prettier. See `doc/BIOME.md` for
  commands and style settings.
