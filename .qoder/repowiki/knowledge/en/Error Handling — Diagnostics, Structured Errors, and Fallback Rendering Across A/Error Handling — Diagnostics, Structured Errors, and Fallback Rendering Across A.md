---
kind: error_handling
name: Error Handling — Diagnostics, Structured Errors, and Fallback Rendering Across Acrolls Packages
category: error_handling
scope:
    - '**'
source_files:
    - packages/cli/src/index.ts
    - packages/cli/src/validate.ts
    - packages/mdsvex/src/document-diagnostics.ts
    - packages/mdsvex/src/source-safety.ts
    - packages/docs/src/lib/content.ts
    - packages/sveltekit/src/index.ts
    - packages/cli/src/studio.ts
    - packages/cli/src/onboarding.ts
---

## Overview

Acrolls uses a layered error-handling strategy that differs by package:

- **CLI (`packages/cli`)**: process exits with numeric codes; errors are caught in a single top-level `try/catch` and printed via `console.error`. Validation failures produce structured diagnostics rather than throwing.
- **mdsvex (`packages/mdsvex`)**: converts compile-time and source-safety problems into typed diagnostic objects and, in migration mode, renders a safe fallback Svelte module so the build does not abort.
- **docs (`packages/docs`)**: throws a domain-specific `DocsContentError` for configuration/content-model violations; validation is expressed as `DocsContentDiagnostic` arrays returned from sources.
- **sveltekit (`packages/sveltekit`)**: delegates to mdsvex/diagnostic logic and throws plain `Error` for misconfiguration (e.g. glob key outside `contentRoot`).
- **svelte (`packages/svelte`)**: no runtime error handling found in component files.

There is no centralized error-reporting framework or middleware; each package surfaces errors in the shape most useful to its consumers.

## CLI: exit codes + catch-all handler

The CLI entrypoint (`packages/cli/src/index.ts`) wraps every command dispatch in one `try/catch` block. Unhandled exceptions print `err.message` and set `process.exit(1)`. Command-specific invalid arguments return `2`; missing files return `1`; successful runs return `0`. The `validate` command never throws — it returns a `CorpusValidationResult` whose `summary.rejected` count drives the exit code through `validationExitCode()` (`packages/cli/src/validate.ts`).

## mdsvex: diagnostics and fallback rendering

`packages/mdsvex/src/document-diagnostics.ts` defines the canonical diagnostic type:

```ts
export type AcrollsDocumentDiagnostic = {
  code: string;
  severity: 'warning' | 'error';
  phase: 'normalize' | 'metadata' | 'compile' | 'render';
  file?: string;
  line?: number;
  column?: number;
  message: string;
  remediation?: string;
};
```

Conversions:
- `safetyFindingDiagnostic()` turns source-safety findings (from `source-safety.ts`, which wraps unsafe Svelte-like prose in backticks) into warnings.
- `compileDiagnostic()` wraps any thrown value into an `error` diagnostic, extracting `line`/`column` from `{ start|position }.{ line|column }` shapes common to mdsvex/Svelte compiler errors.
- `diagnosticError()` reverses the conversion to a thrown `Error` when a caller needs to abort.
- `renderInvalidDocumentModule()` emits a self-contained Svelte module (with escaped HTML) that displays the diagnostic on-screen, used as the migration-mode fallback when a document cannot compile.

Source safety lives in `packages/mdsvex/src/source-safety.ts`: `normalizeAcrollsMarkdown()` scans `.md` lines (skipping fenced blocks and Mermaid diagrams), detects Svelte special tags, component-shaped angle brackets, generic-type literals, and object-literal syntax, and rewrites them as inline code spans while recording `AcrollsSafetyFinding` entries with line/column metadata.

The CLI's `validate.ts` orchestrates this pipeline: it reads each Markdown file, runs `normalizeAcrollsMarkdown`, then tries `mdsvex.compile` and `svelte/compiler.compile` inside separate `try/catch` blocks, pushing `compileDiagnostic(error, file)` into the diagnostics array instead of aborting. Render failures are similarly captured with `phase: 'render'`. In `authored` mode, additional frontmatter rules (required title, H1/title mismatch, index-title ignored) are appended as `ACROLLS_*` diagnostic codes.

## docs package: `DocsContentError` + diagnostic arrays

`packages/docs/src/lib/content.ts` declares a single domain error class:

```ts
export class DocsContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DocsContentError';
  }
}
```

It is thrown throughout content resolution for configuration mistakes: missing landing sources, duplicate routes, unknown parents, cycles, routes outside `baseHref`, invalid metadata field types, and unsupported source kinds. Callers (e.g. `createAcrollsDocsSource` in `sveltekit/src/index.ts`) are expected to wrap calls in `try/catch` and surface these as user-facing errors.

Configuration validation also produces non-throwing diagnostics: `DocsContentSource` exposes a `diagnostics: readonly DocsContentDiagnostic[]` field alongside `documents` and `nav`, so hosts can render warnings without failing the build. The `collection.ts` loader throws `DocsContentError` only for fatal loader misconfiguration (e.g. eager loader used synchronously).

## sveltekit package: thin wrapper, explicit throws

`sveltekit/src/index.ts` re-exports mdsvex and collection APIs and adds two helpers:
- `markdownGlob()` builds a `ContentLoader` from Vite globs; it does not throw under normal use.
- `removeGlobPath()` validates that a glob key starts with the configured `contentRoot` and throws `new Error(...)` if not, preventing path traversal across content roots.

The preprocessor factories delegate to `@acrolls/mdsvex`, so all compile-time error handling flows through the diagnostic/fallback system described above.

## Conventions observed

| Area | Convention | Evidence |
|---|---|---|
| CLI commands | Return numeric exit codes (0 success, 1 failure, 2 usage error); do not throw past the top-level handler | `packages/cli/src/index.ts` main try/catch |
| Validation | Produce `AcrollsDocumentDiagnostic[]` with `code`, `severity`, `phase`, optional location, and `remediation` | `packages/mdsvex/src/document-diagnostics.ts`, `packages/cli/src/validate.ts` |
| Migration mode | Never crash the build; emit a rendered error page module instead | `packages/mdsvex/src/document-diagnostics.ts::renderInvalidDocumentModule()` |
| Source safety | Wrap dangerous prose in backticks during normalization; report findings as warnings unless `--strict` or `authored` mode upgrades them to errors | `packages/mdsvex/src/source-safety.ts`, `packages/cli/src/validate.ts` |
| Domain errors | Throw `DocsContentError` for content-model/configuration violations in the docs package | `packages/docs/src/lib/content.ts` |
| Non-domain errors | Throw plain `Error` for programming/config mistakes (e.g. glob root mismatch) | `packages/sveltekit/src/index.ts::removeGlobPath()` |
| No global error middleware | Each package handles errors at its boundary (CLI exit, diagnostic arrays, thrown domain errors) | Observed across all packages |

## Key files

- `packages/cli/src/index.ts` — CLI entrypoint, unified try/catch, exit-code policy
- `packages/cli/src/validate.ts` — corpus validation, diagnostic accumulation, exit-code decision
- `packages/mdsvex/src/document-diagnostics.ts` — diagnostic types, compile-error wrapping, fallback Svelte module renderer
- `packages/mdsvex/src/source-safety.ts` — prose normalization that prevents accidental Svelte execution in `.md`
- `packages/docs/src/lib/content.ts` — `DocsContentError` class and content-model validation
- `packages/sveltekit/src/index.ts` — glob-root validation, mdsvex preprocessor factory
- `packages/cli/src/studio.ts` — local dev server error handling (port exhaustion throws `Error('No free port near ...')`)
- `packages/cli/src/onboarding.ts` — per-step try/catch around interactive prompts and file writes
- `packages/cli/src/util.ts` — filesystem helper try/catch wrappers

## Constraints & enforcement

- The `validate` command treats any diagnostic with `severity === 'error'` as `rejected`, and `validationExitCode()` returns exit code `1` when rejected documents exist and either `onInvalid === 'fail'`, `mode === 'authored'`, `strict === true`, or a non-`.md` file is rejected. This is enforced programmatically, not just documented.
- Migration mode is enforced by generating a valid Svelte module (`renderInvalidDocumentModule`) rather than propagating the compile error, ensuring the site remains routable even when individual documents fail.
- Authored mode upgrades all safety findings from `warning` to `error` and enforces required frontmatter fields, making the lint step stricter than default compilation.