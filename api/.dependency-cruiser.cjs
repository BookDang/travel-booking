/**
 * Enforces the DDD layer boundaries documented in doc/DDD-ARCHITECTURE.md.
 * Run: npm run check:boundaries
 */
module.exports = {
  forbidden: [
    {
      name: 'domain-must-not-depend-on-outer-layers',
      comment: 'domain/ knows nothing about application/, infrastructure/, or presentation/.',
      severity: 'error',
      from: { path: '^src/.*/domain/' },
      to: { path: '^src/.*/(application|infrastructure|presentation)/' },
    },
    {
      name: 'application-must-not-depend-on-infrastructure-or-presentation',
      comment:
        'application/ orchestrates via domain interfaces only, never a concrete tech or HTTP concern.',
      severity: 'error',
      from: { path: '^src/.*/application/' },
      to: { path: '^src/.*/(infrastructure|presentation)/' },
    },
    {
      name: 'infrastructure-must-not-depend-on-application-or-presentation',
      comment:
        'infrastructure/ implements domain contracts; it has no business calling upward into use-cases or HTTP code.',
      severity: 'error',
      from: { path: '^src/.*/infrastructure/' },
      to: { path: '^src/.*/(application|presentation)/' },
    },
    {
      name: 'presentation-must-not-depend-on-infrastructure',
      comment:
        'presentation/ talks to application/ (use-cases) and domain/ (types) only — never straight to Prisma etc.',
      severity: 'error',
      from: { path: '^src/.*/presentation/' },
      to: { path: '^src/.*/infrastructure/' },
    },
    {
      name: 'no-circular',
      comment:
        'Circular imports between modules make the dependency graph impossible to reason about.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    tsPreCompilationDeps: true,
    exclude: {
      path: 'node_modules|\\.spec\\.ts$|^src/generated/',
    },
  },
};
