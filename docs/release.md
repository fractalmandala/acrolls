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
pnpm add acrolls@0.1.1
```

The public tarball bundles its internal `@acrolls/*` runtime packages. Publish only `acrolls`;
the scoped implementation units do not need separate registry releases. Do not test the obsolete
`acrolls@0.0.1` artifact.

## Verify from a clean checkout

Build before type-checking because workspace package exports point at generated `dist` files:

```bash
pnpm install
pnpm build
pnpm check
pnpm test
pnpm --filter @acrolls/example-kit check
pnpm --filter @acrolls/example-kit build
```

Create and inspect the public tarball with:

```bash
pnpm release:pack
```

The release script handles the package-layout details needed to bundle Acrolls' private
workspace packages. Confirm that runtime files, README, license, public exports, and bundled
dependencies are present and test/source files are absent.

## Publish the public package

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

After npm shows `acrolls@0.1.1`, create or open an unrelated SvelteKit site and install only the
public package:

```bash
pnpm add acrolls@0.1.1
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
