---
kind: dependency_management
name: pnpm Workspace Monorepo with Bundled Public Package and Peer/Workspace Dependency Strategy
category: dependency_management
scope:
    - '**'
source_files:
    - pnpm-workspace.yaml
    - package.json
    - packages/acrolls/package.json
    - packages/cli/package.json
    - packages/docs/package.json
    - packages/mdsvex/package.json
    - packages/styles/package.json
    - packages/svelte/package.json
    - packages/sveltekit/package.json
    - examples/kit-consumer/package.json
    - examples/docs-template/package.json
---

## System Overview

Acrolls is a **pnpm workspace monorepo** (root `pnpm-workspace.yaml`) that manages dependencies across seven packages under `packages/` (`acrolls`, `cli`, `docs`, `mdsvex`, `styles`, `svelte`, `sveltekit`) plus two example apps under `examples/`. The root `package.json` pins the toolchain via `packageManager: "pnpm@10.28.2"` and `engines.node: ">=20.19.0"`, enforcing a single Node/pnpm version for all contributors.

## Workspace & Internal Package Dependencies

Internal cross-package references use pnpm's `workspace:` protocol:
- `packages/acrolls/package.json` depends on every sibling package via `workspace:^` (`@acrolls/cli`, `@acrolls/docs`, `@acrolls/mdsvex`, `@acrolls/styles`, `@acrolls/svelte`, `@acrolls/sveltekit`).
- `packages/sveltekit` depends on `@acrolls/docs` and `@acrolls/mdsvex` via `workspace:*`.
- `packages/docs` depends on `@acrolls/styles` via `workspace:^`.
- `packages/cli` depends on `@acrolls/mdsvex` via `workspace:*`.

The `examples/*` apps consume the public entrypoint via `acrolls: "workspace:*"` (e.g., `examples/kit-consumer/package.json`), demonstrating the published surface rather than importing internal `@acrolls/*` packages directly.

## Versioning Strategy

- **Internal packages**: each has its own `version` field in `package.json` (e.g., `acrolls@0.1.4`, `@acrolls/docs@0.3.0`, others at `0.1.x`–`0.2.x`). They are not independently published; only the top-level `acrolls` package is marked `publishConfig.access: public`.
- **External runtime dependencies**: pinned with caret ranges (`^`) — e.g., `mdsvex ^0.12.6`, `svelte ^5.38.1`, `shiki ^3.12.2`, `mermaid ^11.9.0`, `sass ^1.102.0`, `vite ^7.1.3`, `typescript ^5.9.2`.
- **Peer dependencies**: declared to let host apps supply compatible versions — `svelte ^5.0.0` (peer, required) and `fractalthemer ^0.1.0` (peer, optional via `peerDependenciesMeta.optional: true`) appear in `packages/acrolls`, `packages/styles`, and `packages/sveltekit` declares `@acrolls/svelte workspace:*` as peer.
- **Dev-only tooling** (tsup, vitest, svelte-check, @sveltejs/package, @types/*) lives exclusively in `devDependencies` of individual packages.

## Bundling / Vendoring Approach

The public `acrolls` package uses `bundledDependencies` to ship a self-contained distribution that includes the five sibling `@acrolls/*` packages plus `unist-util-is`, `unist-util-visit`, `unist-util-visit-parents`. This means consumers install one `acrolls` npm package and get everything needed without resolving the internal workspace graph at publish time.

Publishing is driven by root scripts:
- `pnpm release:pack` runs `pnpm --config.node-linker=hoisted --filter acrolls pack` — explicitly using the hoisted node linker for a deterministic bundle.
- `pnpm release` publishes with `--access public` from the same hoisted context.
- A post-pack verification step `scripts/verify-packed-consumer.mjs` exercises the packed tarball against a consumer project to ensure no missing transitive deps.

There is **no vendored `node_modules/`** directory and **no private registry configuration** in this repo; dependencies resolve from the public npm registry via pnpm's default store.

## Build-Time vs Runtime Split

Each package separates build-time tooling from runtime code:
- `packages/{cli,mdsvex,sveltekit}` use `tsup` to emit ESM bundles under `dist/` and declare `main`/`types` pointing there.
- `packages/{docs,svelte}` use `svelte-package` to compile Svelte components into `dist/`.
- `packages/styles` ships both prebuilt `.css` files and source `.sass` files via dual `exports` entries.
- `packages/acrolls` re-exports sub-package APIs through an `exports` map (`./mdsvex`, `./svelte`, `./docs`, `./docs/content`, `./content`, `./sveltekit`, plus `./styles/*` entrypoints) and marks CSS side effects.

## Constraints Observed

- All packages declare `type: "module"`, so the entire workspace uses ESM.
- The root `engines.node >= 20.19.0` is mirrored in most packages' `engines` fields, constraining the runtime environment uniformly.
- Internal package references consistently use `workspace:^` (allowing minor/patch bumps within the workspace) or `workspace:*` (exact workspace version); examples mirror this pattern when consuming the public `acrolls` package.
- The `files` field in each package's `package.json` restricts what gets published, excluding source trees, tests, and dev artifacts from distributions.