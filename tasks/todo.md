# Tasks — Acrolls repair and verification

- [x] Remove the example's eager compiled-Markdown/Shiki client graph and clear the chunk-size warning budget.
  - Acceptance: named metadata/facts globs keep article components lazy; `pnpm build:example` exits without `Some chunks are larger than 500 kB`.
- [x] Fix built-in naming-convention return types so `numbered()` and `dated()` expose `verify()` while custom conventions may omit it.
  - Acceptance: `pnpm --filter @acrolls/docs check` passes.
  - Verify: `pnpm --filter @acrolls/docs test`.
- [x] Re-run repository package checks, tests, and build after the type repair.
  - Acceptance: `pnpm check`, `pnpm test`, and `pnpm build` pass.
- [ ] Verify root CLI and packed public-package behavior.
  - Acceptance: starter validation passes; pack manifest and fresh consumer build are proven.
- [ ] Reconcile stale task/checklist and onboarding guidance with the implemented content API.
  - Acceptance: no completed feature remains represented as an unchecked or malformed task.
- [ ] Audit and repair source-level styling-rule violations within the approved class/style boundaries.
  - Acceptance: no inline styles or component style blocks remain in Acrolls-owned scope.
- [ ] Complete browser acceptance for docs navigation, TOC, pager, persistence, accessibility, and console errors.
  - Acceptance: the checklist is evidenced against the built example, not inferred from static checks.
