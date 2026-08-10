# Integrate into SvelteKit

Step-by-step host wiring. Assumes packages are already installed ([local-install.md](./local-install.md)).

---

## A. Compiler (`svelte.config.js`)

Use **`createAcrollsMdsvexOptions` from `@acrolls/mdsvex`** (not `@acrolls/sveltekit` until published).

```js
import adapter from '@sveltejs/adapter-auto'; // or adapter-vercel, etc.
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createAcrollsMdsvexOptions } from '@acrolls/mdsvex';

const acrolls = createAcrollsMdsvexOptions({
  extensions: ['.md', '.svx']
  // layout: omit for full control, or set a path to a layout .svelte
  // strict: true  // fail on unknown fence languages
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [vitePreprocess(), mdsvex(acrolls)],
  kit: {
    adapter: adapter()
  }
};

export default config;
```

### Options you care about

| Option | Default | Meaning |
|---|---|---|
| `extensions` | `['.svx','.md']` | Files mdsvex pretreats |
| `layout` | none | mdsvex layout map or string path |
| `strict` | `false` | Unknown code languages error instead of plaintext |

Do **not** set a global Publication layout unless every Markdown file on the site is an article (including random READMEs in routes). Prefer wrapping with `Publication` only on docs/blog routes.

---

## B. TypeScript (optional but useful)

**`src/app.d.ts`** (merge with existing):

```ts
declare module '*.md' {
  import type { Component } from 'svelte';
  export default Component;
  export const metadata: Record<string, unknown>;
}

declare module '*.svx' {
  import type { Component } from 'svelte';
  export default Component;
  export const metadata: Record<string, unknown>;
}
```

---

## C. Styles

Pick **one** mode and import **once** per docs/blog surface (layout is ideal).

```ts
// Full editorial preset (good for greenfield)
import '@acrolls/styles/default.css';

// Or mechanics only (host already owns type scale / colors)
import '@acrolls/styles/foundation.css';
```

Bridge host tokens (optional):

```css
:root {
  --font-body: 'Your Serif', Georgia, serif;
  --font-heading: system-ui, sans-serif;
  --font-mono: ui-monospace, monospace;
  --foreground: #171714;
  --muted-foreground: #5c5c56;
  --border: #deded8;
  --accent: #6d28d9;
  --card: #fafaf7;
  --background: transparent;
  --radius: 0.75rem;
}
```

Foundation/default read these fallbacks via `--acrolls-*` mapping. Details: [styles.md](./styles.md).

---

## D. Pattern 1 — single imported article

```
src/routes/notes/
  first.md
  +page.svelte
```

**`+page.svelte`**

```svelte
<script lang="ts">
  import First from './first.md';
  import { Publication } from '@acrolls/svelte';
  import '@acrolls/styles/default.css';
</script>

<Publication>
  <First />
</Publication>
```

---

## E. Pattern 2 — folder of guides with slug routes

```
src/routes/docs/
  +layout.svelte          ← DocsShell
  +page.svelte            ← index
  [slug]/
    +page.ts
    +page.svelte
  guides/
    intro.md
    api.md
```

**`src/lib/docs/nav.ts`** — see [snippets/nav.ts](./snippets/nav.ts).

**`src/routes/docs/+layout.svelte`** — see [snippets/docs-layout.svelte](./snippets/docs-layout.svelte).

**`src/routes/docs/[slug]/+page.ts`**

```ts
import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { PageLoad } from './$types';

const modules = import.meta.glob('../guides/*.md');

export const load: PageLoad = async ({ params }) => {
  const key = `../guides/${params.slug}.md`;
  const loader = modules[key];
  if (!loader) error(404, 'Not found');
  const mod = (await loader()) as {
    default: Component;
    metadata?: Record<string, string>;
  };
  return {
    document: mod.default,
    metadata: mod.metadata ?? {}
  };
};
```

**`src/routes/docs/[slug]/+page.svelte`**

```svelte
<script lang="ts">
  import { Publication } from '@acrolls/svelte';
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  const Doc = $derived(data.document);
</script>

<article>
  <Publication>
    <Doc />
  </Publication>
</article>
```

Co-locate guides next to the route if you prefer:

```ts
const modules = import.meta.glob('./*.md'); // for docs/user/*.md style
```

---

## F. Pattern 3 — `.svx` with components

```svx
---
title: With callout
---

<script>
  import { Callout, Figure } from '@acrolls/svelte';
</script>

<Callout variant="insight" title="Tip">
  SVX can import Svelte components.
</Callout>
```

Open only trusted local SVX (it is executable).

---

## G. What **not** to do

1. Import Acrolls CSS in root layout **and** docs layout twice (duplicated rules — pick one place).  
2. Use `createAcrollsSvelteKitMdsvexOptions` from `@acrolls/sveltekit` while that package is only `workspace:*` — stick to `@acrolls/mdsvex`.  
3. Put non-article Markdown under the same extensions without wrapping (or they get Shiki transforms but no shell — usually fine).  
4. Expect Studio to execute full SVX component trees (Studio HTML pipeline strips `<script>` for safety).  

---

## H. Adapter note

Acrolls is adapter-agnostic (static, Node, Vercel). Ensure `md` / `svx` routes are not excluded from prerender if you prerender docs.
