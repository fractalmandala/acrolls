---
title: Release Acrolls
description: Build, verify, publish, and test the bundled Acrolls npm package.
tags:
  - release
  - npm
  - verification
---

## Release contract

Consumers install one package:

```bash
pnpm add acrolls@latest
```

The public tarball bundles its internal `@acrolls/*` runtime packages and the unist visitor
closure required by the compiled mdsvex path. Publish only `acrolls`; the scoped implementation
units do not need separate registry releases. Any pre-0.8.0 registry artifact is obsolete — test
only the version you just published.

## Verify from a clean checkout

Build before type-checking because workspace package exports point at generated `dist` files:

```bash
pnpm install
pnpm build
pnpm check
pnpm test
pnpm --filter @acrolls/example-kit check
pnpm --filter @acrolls/example-kit build
pnpm verify:packed-consumer
```

`.github/workflows/ci.yml` runs this same sequence on every push and pull request across Linux and
macOS (Node 20 and 22), so a green CI check is the standing evidence that the release gate passes.

`verify:packed-consumer` proves install + entrypoints + a Vite build against a hand-written consumer.
For the full adoption funnel, run `pnpm verify:fresh-consumer` locally before a release: it packs the
tarball, installs it onto a pristine host (tarball only — no workspace, no `file:` to sources), then
drives the real `acrolls` binary end to end (`--version` → `create` → `validate` → a best-effort
scaffold build). It is network- and time-heavy and intentionally **not** wired into CI.

Create and inspect the public tarball with:

```bash
pnpm release:pack
```

The release script handles the package-layout details needed to bundle Acrolls' private
workspace packages. Confirm that runtime files, README, license, public exports, and bundled
dependencies are present and test/source files are absent.

## Publish the public package

Before publishing, add an entry to [`CHANGELOG.md`](../CHANGELOG.md): move the pending items out of
`[Unreleased]` into a new dated version heading and keep the Keep a Changelog grouping (Added /
Changed / Deprecated / Removed / Fixed / Security). Record only consumer-facing changes to the
`acrolls` package.

Confirm the npm identity first:

```bash
npm whoami
```

Then publish the public package once:

```bash
pnpm release
```

If npm accepts the version, it cannot be published again. Fix any later problem, bump the
`acrolls` version, rebuild, repack, and publish the new version.

## Test the registry package in a new site

After npm shows `acrolls@0.8.0`, create or open an unrelated SvelteKit site and install only the
public package:

```bash
pnpm add acrolls@0.8.0
pnpm exec acrolls --version
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
```

Follow the onboarding checkpoints, then run:

```bash
pnpm exec acrolls validate ./docs
pnpm check
pnpm build
```

Confirm the host has no direct `@acrolls/*`, workspace, clone, or `file:` dependencies. Test
`/docs`, one nested document, direct refreshes, an unknown slug, code highlighting, tables,
Mermaid, navigation, and the deployed URL.
