# Getting started

Goal: in one existing SvelteKit app, render a Markdown page with Acrolls article styling, then (optionally) wrap a docs area with the shell.

**Time:** ~15 minutes if the app already uses Svelte 5 + Kit 2.

---

## 0. Build Acrolls (once)

```bash
cd /Users/amrit/acrolls   # or your clone path
pnpm install
pnpm build
```

Confirm:

```bash
ls packages/mdsvex/dist/index.js
ls packages/svelte/dist/index.js
ls packages/docs/dist/index.js
ls packages/styles/default.css
```

---

## 1. Add packages to your app

From **your SvelteKit project root**:

```bash
pnpm add \
  file:/Users/amrit/acrolls/packages/mdsvex \
  file:/Users/amrit/acrolls/packages/svelte \
  file:/Users/amrit/acrolls/packages/styles \
  file:/Users/amrit/acrolls/packages/docs

pnpm add -D mdsvex
```

If `pnpm` complains about `workspace:*` from a package, only add the four above — do **not** add `@acrolls/sveltekit` via `file:` until published (it has workspace deps). Import mdsvex options from `@acrolls/mdsvex` instead.

---

## 2. Wire mdsvex in `svelte.config.js`

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

const acrolls = createAcrollsMdsvexOptions({
  // no default layout — you wrap with Publication in the page/layout
  extensions: ['.md', '.svx']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [vitePreprocess(), mdsvex(acrolls)],
  kit: { adapter: adapter() }
};

export default config;
```

Full file: [snippets/svelte.config.js](./snippets/svelte.config.js).

---

## 3. Minimal article page (no docs shell)

**`src/routes/blog/hello.md`**

```md
---
title: Hello Acrolls
description: First article
---

# Hello Acrolls

Write normal Markdown. Code fences get Shiki:

```ts filename="src/hi.ts" lineNumbers
export const hi = 'acrolls';
```
```

**`src/routes/blog/hello/+page.svelte`** — if you prefer a folder route, or import the md:

```svelte
<script lang="ts">
  import Article from './hello.md';
  import { Publication } from '@acrolls/svelte';
  import '@acrolls/styles/default.css';
</script>

<main class="wrap">
  <Publication>
    <Article />
  </Publication>
</main>

<style>
  .wrap {
    max-width: 70ch;
    margin: 2rem auto;
    padding: 0 1rem;
  }
</style>
```

Or use a catch-all that loads `*.md` with `import.meta.glob` (see [integrate-sveltekit.md](./integrate-sveltekit.md)).

---

## 4. Run

```bash
pnpm dev
# open the route that renders your .md
```

You should see:

- Readable article measure (default CSS)  
- Code frame with filename + copy/wrap after hydrate  
- Heading anchors on hover  

---

## 5. Optional: docs shell for a `/docs` area

See [docs-shell.md](./docs-shell.md). Short version:

1. Define a `DocsNav` object  
2. Put `<DocsShell>` in `src/routes/docs/+layout.svelte`  
3. Render articles with `<Publication>` inside pages  

---

## 6. Validate content from the CLI

```bash
/Users/amrit/acrolls/packages/cli/dist/index.js validate ./src/routes/blog/hello.md
/Users/amrit/acrolls/packages/cli/dist/index.js studio ./src/routes/blog/hello.md
```

---

## Checklist

- [ ] `pnpm build` succeeded in acrolls monorepo  
- [ ] Host has `mdsvex` + four `@acrolls/*` packages  
- [ ] `svelte.config.js` uses `createAcrollsMdsvexOptions`  
- [ ] Extensions include `.md` / `.svx`  
- [ ] CSS imported once (`default` or `foundation`)  
- [ ] Body wrapped in `Publication`  
- [ ] `pnpm dev` shows the article  

If something fails → [troubleshooting.md](./troubleshooting.md).
