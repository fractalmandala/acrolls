---
kind: configuration_system
name: Configuration System — Host Detection, CLI Onboarding, and Declarative Content Collection
category: configuration_system
scope:
    - '**'
source_files:
    - packages/acrolls/bin/acrolls.mjs
    - packages/cli/src/integrate.ts
    - packages/sveltekit/src/index.ts
    - packages/docs/src/lib/collection.ts
    - packages/mdsvex/src/index.ts
    - packages/mdsvex/src/frontmatter.ts
    - examples/kit-consumer/vite.config.ts
---

## Overview

Acrolls does not use a single monolithic configuration file. Instead, configuration is layered across three mechanisms that together bootstrap the docs engine in a host SvelteKit project:

1. **Host discovery** — the CLI inspects the host's `package.json`, presence of `@sveltejs/kit` / `mdsvex` / `svelte`, and the location of Vite or legacy Svelte config files to determine integration strategy.
2. **CLI-driven onboarding** — `acrolls integrate` writes or patches `vite.config.ts` (or legacy `svelte.config.js`) and injects style imports into the root layout, with backups under `.acrolls/backup/<timestamp>`.
3. **Declarative content collection** — at runtime, hosts declare document sources via `content({ loader, config })` from `@acrolls/docs/collection`, optionally layering Standard Schema validators and filters before the navigation/route engine consumes them.

There is no application-wide YAML/TOML/env-file configuration for the docs engine; all behavior is expressed through JavaScript/TypeScript option objects passed to Acrolls APIs.

## Key Files and Packages

- `packages/acrolls/bin/acrolls.mjs` — public CLI entrypoint; spawns `@acrolls/cli/dist/index.js` and injects `ACROLLS_VERSION` into its child process environment.
- `packages/cli/src/integrate.ts` — host detection (`detectHost`) and the `cmdIntegrate` command that creates/patches Vite/Svelte config and layout files.
- `packages/sveltekit/src/index.ts` — re-exports mdsvex preprocessor factories (`createAcrollsMdsvexOptions`, `createAcrollsMdsvexPreprocessor`, `createAcrollsSvelteKitMdsvexOptions`, `createAcrollsSvelteKitMdsvexPreprocessor`) plus `markdownGlob`, `customSource`, and `createAcrollsDocsSource` for wiring Vite globs into the content pipeline.
- `packages/docs/src/lib/collection.ts` — defines `ContentLoader`, `Collection`, `StandardSchemaV1`, and the `content()` factory that runs load → validate → filter → engine.
- `packages/mdsvex/src/index.ts` — builds the mdsvex processor, injects `metadata` and `__acrollsDocument` exports into every compiled Markdown module, and enforces source-safety normalization.
- `examples/kit-consumer/vite.config.ts` — canonical consumer showing how to register `createAcrollsSvelteKitMdsvexPreprocessor`, set extensions to `['.svelte', '.svx', '.md']`, and pass `{ docs: { mode: 'authored' } }`.
- Root `package.json` — exposes `pnpm acrolls` which resolves to `packages/acrolls/bin/acrolls.mjs`.

## Architecture and Conventions

### Host detection and safe mutation
`detectHost` reads the host's `package.json` dependencies and scans for `vite.config.{ts,js,mts,mjs,cts,cjs}` and `svelte.config.{js,ts}`. It returns a shape including `kind` (`sveltekit` | `svelte` | `node`), `hasKit`, `hasMdsvex`, `hasSvelte`, `hasAcrolls`, `viteConfig`, `svelteConfig`, and `layout`. This drives the CLI's plan printed during `acrolls integrate`.

The integration command enforces safety rules:
- If an existing `vite.config.*` is detected, automatic edits are **intentionally disabled**; the CLI prints a message directing users to merge options manually via `pnpm exec acrolls onboard`.
- All writes are preceded by snapshotting originals into `.acrolls/backup/<epoch_ms>/`.
- A `--dry-run` flag prints the plan without touching the filesystem.
- A `--yes` flag is required to apply changes non-interactively.

### Config injection targets
When integrating a new host (no existing `vite.config.*`), the CLI writes a fresh `vite.config.ts` containing `sveltekit({ extensions: ['.svelte', '.svx', '.md'], preprocess: [vitePreprocess(), createAcrollsMdsvexPreprocessor({ extensions: ['.md', '.svx'] })] })`. For legacy hosts with `svelte.config.js|ts`, it attempts to patch the file by adding extensions and injecting `createAcrollsMdsvexPreprocessor()` into the `preprocess` array, emitting notes when manual merging is recommended.

Style imports are injected into the root layout (`src/routes/+layout.svelte` or `src/app.html`) as `import 'acrolls/styles/${mode}.${style}';` where `mode` is `foundation` or `default` and `style` is `css` or `sass`, selected via `--mode` and `--style` flags.

### Runtime content configuration
At build/runtime, hosts configure the docs engine declaratively:

```ts
const modules = import.meta.glob('../../content/**/*.md');
const metadata = import.meta.glob('../../content/**/*.md', { eager: true, import: 'metadata' });

export const docs = content({
  loader: markdownGlob({ body: modules, modules, root: '../../content' }),
  config: defineDocsConfig({ /* folders, naming, nav */ }),
  schema: mySchema,          // optional StandardSchemaV1 or array
  filter: ({ key, data }) => !data.draft
});
```

The `content()` factory composes a pipeline: each loaded document passes through zero-to-N Standard Schema layers (left→right, later fields win), then an optional `filter`, then into `createDocsContentSource` which owns routing, grouping, breadcrumbs, pager, and admission. The synchronous `sourceSync()` path throws if the loader is not `eager: true`; async `source()` awaits loaders and async schemas.

### Environment variables
Only one environment variable is used by the framework itself: `ACROLLS_VERSION`, injected by `packages/acrolls/bin/acrolls.mjs` into the spawned CLI process and read back as `process.env.ACROLLS_VERSION ?? '0.1.1'` in `packages/cli/src/index.ts`. No other env-based configuration is consumed by the packages.

### Frontmatter contract
Frontmatter is parsed by a minimal YAML-ish parser in `packages/mdsvex/src/frontmatter.ts` that matches `key: value` lines (with optional quoted values) between `---` delimiters. Fields like `title`, `description`/`brief`, `eyebrow`/`series`/`project`, `reading`/`metadata`, `image`, `imageAlt` are recognized for banner rendering. There is no enforced schema here; enforcement happens at the collection level via the optional `schema` option described above.

## Conventions and Constraints

- **No global config file**: Configuration lives in host code (`vite.config.ts`, `+page.server.ts`, etc.) passed into Acrolls APIs; there is no `acrolls.config.*` file.
- **Extensions must include `.svx` and `.md`**: The SvelteKit preprocessor defaults to `['.svx', '.md']`; the CLI-generated config also sets `sveltekit({ extensions: ['.svelte', '.svx', '.md'] })`.
- **Layout default is resolved at runtime**: `resolvePublicationLayout()` resolves `@acrolls/svelte/PublicationLayout.svelte` so the default layout path works regardless of whether the package is installed via npm or workspace alias.
- **Content roots are validated**: `removeGlobRoot` throws if a glob key does not start with the configured `contentRoot`, preventing cross-directory document leakage.
- **Eager vs lazy loading is explicit**: `markdownGlob` returns `eager: true` because both globs are already materialized; `customSource` returns `eager: false` and requires `await source()`. `sourceSync()` will throw otherwise.
- **Schema validation is opt-in but powerful**: Any Standard Schema v1 vendor (Zod, Valibot, Arktype) can be layered; issues are collected across all layers and reported as diagnostics with `code: 'ACROLLS_SCHEMA_INVALID'`.
- **Authored mode affects H1 handling**: When `docs.mode === 'authored'`, the mdsvex preprocessor suppresses the leading `<h1>` unless `leadingH1: 'preserve'` is set.
- **Backups before mutation**: The CLI always snapshots modified files under `.acrolls/backup/<timestamp>/` before writing.