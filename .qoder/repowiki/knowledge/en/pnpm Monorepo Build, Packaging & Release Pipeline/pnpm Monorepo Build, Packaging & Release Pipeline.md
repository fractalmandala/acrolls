---
kind: build_system
name: pnpm Monorepo Build, Packaging & Release Pipeline
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - pnpm-workspace.yaml
    - packages/acrolls/package.json
    - packages/cli/package.json
    - packages/mdsvex/package.json
    - packages/sveltekit/package.json
    - packages/docs/package.json
    - packages/svelte/package.json
    - packages/styles/scripts/build.mjs
    - scripts/verify-packed-consumer.mjs
    - docs/release.md
---

## What system/approach is used

Acrolls is built as a **pnpm workspace** (root `pnpm-workspace.yaml` declares `packages/*` and `examples/*`) with Node ≥20.19.0 enforced via the root `package.json` `engines` field. There are no Makefiles, Dockerfiles, or CI manifests in this repository; build orchestration lives entirely in per-package `scripts` plus a few top-level scripts.

The workspace composes seven packages:
- `packages/acrolls` — public npm entrypoint that re-exports sub-packages and ships bundled CLI + CSS
- `packages/cli`, `packages/docs`, `packages/mdsvex`, `packages/svelte`, `packages/styles`, `packages/sveltekit` — private implementation units (`"private": true`)

Each package builds independently into its own `dist/` (or equivalent) directory using either **tsup** (for TypeScript-only packages: `cli`, `mdsvex`, `sveltekit`) or **@sveltejs/package** (`svelte-package`) for Svelte component packages (`docs`, `svelte`). The styles package compiles `.sass` to `.css` via a custom `node ./scripts/build.mjs` that invokes `sass` directly.

## Key files and packages

- Root orchestrator: `package.json` — defines `build`, `check`, `test`, `release:pack`, `verify:packed-consumer`, `release`, `dev:*` scripts that delegate to `pnpm -r --filter './packages/*' run ...`
- Workspace definition: `pnpm-workspace.yaml`
- Public package manifest: `packages/acrolls/package.json` — declares `bin.acrolls`, `exports.*` mapping each sub-package, `bundledDependencies` listing the private `@acrolls/*` units plus unist visitors, `sideEffects` for CSS entrypoints, and `peerDependencies` on `svelte` and optional `fractalthemer`
- Per-package build scripts:
  - `packages/cli/package.json`: `tsup src/index.ts --format esm --clean && node ./scripts/binify.mjs`
  - `packages/mdsvex/package.json`: `tsup src/index.ts --format esm --dts --clean`
  - `packages/sveltekit/package.json`: `tsup src/index.ts src/content.ts --format esm --dts --clean`
  - `packages/docs/package.json`: `svelte-package -i src/lib -o dist && cp styles.css dist/styles.css && cp styles.sass dist/styles.sass`
  - `packages/svelte/package.json`: `svelte-package -i src/lib -o dist`
  - `packages/styles/scripts/build.mjs`: loops over `foundation/default/docs/colors/theme` surfaces and runs `sass src/<surface>.sass <surface>.css --pkg-importer=node --style=expanded --no-source-map`
- Packed-tarball verification: `scripts/verify-packed-consumer.mjs` — packs `acrolls`, asserts version/tarball presence, checks that `unist-util-is`, `unist-util-visit`, `unist-util-visit-parents` and all style entrypoints land in the tarball, then spins up a temporary consumer site that installs the tarball via `file:` protocol, probes `acrolls/sveltekit`, `acrolls/docs`, and `acrolls/styles` exports, runs Sass compilation and `vite build`, and fails if any assertion does not pass.
- Release guide: `docs/release.md` documents the canonical release contract (single `acrolls` package, private `@acrolls/*` units stay unpublished).

## Architecture and conventions

### Build composition
- **Workspace-first**: consumers install only the single `acrolls` package; internal `@acrolls/*` packages are declared in `packages/acrolls/bundledDependencies` so they ship inside the published tarball rather than being resolved from the registry at runtime.
- **Per-package tooling**: TypeScript packages use `tsup` with `--format esm --dts --clean`; Svelte packages use `@sveltejs/package` (`svelte-package`); styles compile Sass to both source `.sass` and generated `.css` entrypoints.
- **Exports map**: every package exposes a precise `exports` map in its `package.json` (e.g. `acrolls/mdsvex`, `acrolls/svelte`, `acrolls/docs`, `acrolls/sveltekit`, `acrolls/styles/foundation.css`, etc.), which is what `verify-packed-consumer.mjs` exercises against the packed tarball.
- **Side effects**: CSS entrypoints are declared under `sideEffects` so bundlers can tree-shake them safely.

### Versioning
- Each package carries its own `version` field in its `package.json`. The public `acrolls` package version (`0.1.4`) is the one that gets published; the verification script asserts that the packed tarball version matches the manifest version.
- No automated version bumping was found — versions are bumped manually before running `pnpm release`.

### Testing strategy
- Unit tests live alongside sources and are invoked via `vitest run` in each package's `scripts.test`.
- Integration smoke-test of the published artifact is implemented in `scripts/verify-packed-consumer.mjs` and is wired as `pnpm verify:packed-consumer`.

### Conventions and constraints
- **Single publish target**: per `docs/release.md`, only `acrolls` is published to the npm registry; scoped `@acrolls/*` packages are private and must never be released separately.
- **Hoisted linker for releases**: both `pnpm release:pack` and `pnpm release` invoke pnpm with `--config.node-linker=hoisted` to ensure bundled dependencies resolve correctly inside the tarball.
- **Node engine lock**: `engines.node >= 20.19.0` is declared at the root and repeated in several packages; the workspace enforces this via pnpm's engine check.
- **Dev vs. production builds**: example sites under `examples/` use `vite build` (with `pagefind` post-build in `kit-consumer`), while library packages produce ESM bundles via tsup/svelte-package — examples are not part of the packaged distribution.
- **No CI / Docker**: there is no GitHub Actions workflow, Dockerfile, or Makefile in this repository; the documented pre-release checklist in `docs/release.md` (`pnpm build && pnpm check && pnpm test && pnpm verify:packed-consumer`) is the de-facto quality gate.