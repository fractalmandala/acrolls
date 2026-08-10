# @acrolls/docs

**Fumadocs-class documentation shell for SvelteKit.**

Config-driven navigation, nested accordions, on-page TOC, breadcrumbs, prev/next pager, and persisted open state — without owning your content pipeline. Pair with `@acrolls/mdsvex` + `@acrolls/svelte` `Publication` for article bodies.

## Install

```bash
pnpm add @acrolls/docs @acrolls/svelte @acrolls/styles @acrolls/mdsvex
```

```js
import '@acrolls/docs/styles.css';
import '@acrolls/styles/foundation.css'; // or default.css
import { DocsShell, type DocsNav } from '@acrolls/docs';
```

## Nested nav

```ts
export const developerNav: DocsNav = {
  title: 'Developer',
  baseHref: '/docs/developer',
  storageKey: 'dharmalib-developer', // localStorage namespace
  sections: [
    {
      id: 'core',
      title: 'Core systems',
      defaultOpen: true,
      items: [
        { title: 'Architecture', href: '/docs/developer/architecture' },
        {
          id: 'data',
          title: 'Data layer',
          defaultOpen: true,
          children: [
            { title: 'Corpus pipeline', href: '/docs/developer/corpus-pipeline' },
            { title: 'Artifact contracts', href: '/docs/developer/artifact-contracts' }
          ]
        }
      ]
    }
  ]
};
```

## Shell

```svelte
<script>
  import { page } from '$app/state';
  import { DocsShell } from '@acrolls/docs';
  import { developerNav } from '$lib/docs/developer-nav';
  import '@acrolls/docs/styles.css';
  let { children } = $props();
</script>

<DocsShell
  nav={developerNav}
  pathname={page.url.pathname}
  homeHref="/"
  homeLabel="App"
  showToc={true}
  persistOpen={true}
>
  {@render children()}
</DocsShell>
```

### Features

| Feature | API |
|---|---|
| Nested sidebar groups | `DocsNavNode.children` (unlimited depth) |
| Accordion open state | `persistOpen` → `localStorage` key `acrolls-docs:open:<storageKey>` |
| On-page TOC | `showToc` scans `h2–h3` in the article (configurable levels) |
| Breadcrumbs | Auto from nav trail |
| Prev / next | Flattened leaf order |
| Mobile | Drawer sidebar + menu button |
| Filter | Sidebar search expands matching groups |

## Roadmap (product)

Themes, full marketing/docs site, npm publish — see root `PRODUCT.md`.
