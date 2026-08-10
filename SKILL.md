# Acrolls skill

Use when integrating or authoring publication content with **Acrolls** on SvelteKit.

## Install

```bash
pnpm add @acrolls/svelte @acrolls/styles @acrolls/mdsvex @acrolls/sveltekit
pnpm add -D @acrolls/cli mdsvex
```

Or from the monorepo workspace packages during development.

## Wire SvelteKit

1. Extend `svelte.config.js` with `mdsvex(createAcrollsMdsvexOptions())` and extensions `.svx`, `.md`.
2. Import `@acrolls/styles/default.css` (or `foundation.css`) in root layout.
3. Wrap article content with `Publication` or use the provided mdsvex layout.
4. Write content as `.md` / `.svx` with optional YAML frontmatter.

## Primitives in content

```md
---
title: Peer state
description: How peers negotiate
---

<Callout variant="insight" title="Note">
  Something important.
</Callout>

```ts filename="src/peer.ts" lineNumbers highlight="2-3"
export type State = 'choked' | 'interested';
```
```

Use `Figure`, `Banner`, `Video` as imported Svelte components in `.svx` or via mdsvex components map.

## CLI

```bash
pnpm exec acrolls init
pnpm exec acrolls integrate --dry-run
pnpm exec acrolls validate ./content/article.md
pnpm exec acrolls studio ./content/article.md
```

## Invariants

- Source file is authoritative.
- Host owns chrome, routing, theme toggle.
- Prefer foundation mode when host already styles prose.
- Never invent a second document store in Studio.
