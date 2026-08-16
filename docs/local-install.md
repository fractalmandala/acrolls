---
title: Install from npm
description: Install and activate Acrolls in a SvelteKit host using the public npm package.
tags:
  - installation
  - npm
  - sveltekit
---

## Install

Acrolls is installed into a SvelteKit host as one npm package:

```bash
pnpm add acrolls@latest
pnpm exec acrolls --version
```

Do not clone Acrolls into the host, add `file:` dependencies, or install `@acrolls/*`
packages directly. Those scoped packages are implementation details of the published
`acrolls` package.

## Activate docs

Run the read-only onboarding guide from the SvelteKit application root:

```bash
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
```

The default command assumes authors write Markdown in the host's `docs/` directory and the
host publishes it below `/docs`. Change both flags if the source directory or public URL is
different.

Public entrypoints include:

```text
acrolls/mdsvex
acrolls/svelte
acrolls/docs
acrolls/content
acrolls/docs/content
acrolls/sveltekit
acrolls/styles/foundation.css
acrolls/styles/default.css
acrolls/styles/theme.css
acrolls/docs/styles.css
acrolls/styles/foundation
acrolls/styles/default
acrolls/styles/theme
acrolls/styles/tokens
acrolls/docs/styles
```

After following the generated checkpoints, run:

```bash
pnpm exec acrolls validate ./docs
pnpm check
pnpm build
```

## Update an installation

```bash
pnpm up acrolls@latest
pnpm exec acrolls --version
```

Restart the host development server after updating.

## Maintainer publication model

The public `acrolls` tarball bundles its internal `@acrolls/*` runtime packages. Publish only
`acrolls`; the scoped implementation packages do not need a registry scope and consumers do
not resolve or install them separately.
