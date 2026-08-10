# Acrolls — TECH

## Stack

- **Node** ≥ 20.19
- **pnpm** workspaces
- **Svelte 5** (runes) for `@acrolls/svelte` and Studio UI
- **SvelteKit 2** for the example and Studio shell
- **mdsvex** for Markdown / `.svx` compilation
- **Shiki** for compile-time highlighting
- **TypeScript** throughout packages
- **CSS** primary styles; optional **indented SASS** token source for hosts

## Monorepo layout

```text
acrolls/
  packages/
    mdsvex/       @acrolls/mdsvex
    svelte/       @acrolls/svelte
    styles/       @acrolls/styles
    sveltekit/    @acrolls/sveltekit
    cli/          @acrolls/cli
  examples/
    kit-consumer/ @acrolls/example-kit
    starter/      starter article assets
  PRODUCT.md
  TECH.md
  SKILL.md
```

## Compile pipeline

```text
.md / .svx
  → mdsvex (remark-gfm + frontmatter)
  → rehype: slugs, table wrap, code frames (Shiki)
  → Svelte component graph
  → <article class="acrolls"> via Publication layout
```

`@acrolls/mdsvex` exports `createAcrollsMdsvexOptions()` consumed by:

- host `svelte.config.js` via `@acrolls/sveltekit`
- CLI `validate` / `studio` (same options object)

## Runtime model

- Most markup is SSR-friendly static HTML from mdsvex + components.
- Client islands only where needed:
  - copy button / wrap toggle on code frames
  - image zoom dialog
  - Mermaid (lazy, post-v0 optional in v0 stub)
- No compiler deps in browser bundles (Shiki stays compile-time).

## Style architecture

- `.acrolls` publication boundary
- CSS variables `--acrolls-*` with host fallbacks (`--font-body`, `--foreground`, …)
- `foundation.css` — mechanics only
- `default.css` — foundation + editorial scale
- `src/tokens.sass` — optional indented SASS map for hosts that compile SASS

## CLI

| Command | Behavior |
|---|---|
| `acrolls init` | Create content dir (no article body) |
| `acrolls integrate` | Detect SvelteKit + mdsvex; dry-run plan; apply with confirm |
| `acrolls validate <file>` | Compile through shared options; exit codes 0/1/2 |
| `acrolls studio <file>` | Local Vite/SvelteKit mini app, source file as truth |

## SvelteKit integration (host)

```js
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { createAcrollsMdsvexOptions } from '@acrolls/sveltekit';

const config = {
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [vitePreprocess(), mdsvex(createAcrollsMdsvexOptions())],
  kit: { adapter: adapter() }
};
export default config;
```

Layout imports:

```js
import '@acrolls/styles/default.css';
```

Article routes import `.svx` / `.md` modules or load content via filesystem in `+page.ts`.

## Build

- Packages use `tsup` or native `tsc` for TS libraries
- `@acrolls/svelte` ships source + preprocessed components (Svelte package convention)
- Example uses `@sveltejs/adapter-static` or `adapter-auto`

## Testing (v0)

- Unit: fence meta parser, slug, table wrap helpers (vitest)
- Example production build as smoke
- Studio manual / later Playwright

## Security

- Studio binds `127.0.0.1` only
- Validate does not execute host app code paths beyond mdsvex compile
- `.svx` is executable Svelte — open only trusted local files in Studio
