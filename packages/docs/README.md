# @acrolls/docs

Config-driven documentation shell for SvelteKit hosts:

- **Sidebar** with collapsible accordion sections
- **Breadcrumbs**
- **Prev / next pager**
- Optional nav filter
- Mobile drawer menu

Pairs with `@acrolls/svelte` `Publication` for article body content.

## Install

```bash
pnpm add @acrolls/docs
```

```js
import '@acrolls/docs/styles.css';
import { DocsShell, type DocsNav } from '@acrolls/docs';
```

## Nav config

```ts
export const userDocsNav: DocsNav = {
  title: 'User guide',
  baseHref: '/docs/user',
  subtitle: 'Read, explore, discover',
  sections: [
    {
      id: 'start',
      title: 'Start here',
      defaultOpen: true,
      items: [
        { title: 'Getting started', href: '/docs/user/getting-started', slug: 'getting-started' },
        { title: 'Finding texts', href: '/docs/user/finding-texts', slug: 'finding-texts' }
      ]
    },
    {
      id: 'explore',
      title: 'Explore',
      items: [
        { title: 'Word lens', href: '/docs/user/word-lens', slug: 'word-lens' }
      ]
    }
  ]
};
```

## Layout usage

```svelte
<script>
  import { page } from '$app/state';
  import { DocsShell } from '@acrolls/docs';
  import { userDocsNav } from '$lib/docs/user-nav';
  import '@acrolls/docs/styles.css';
  let { children } = $props();
</script>

<DocsShell nav={userDocsNav} pathname={page.url.pathname} homeHref="/" homeLabel="App">
  {@render children()}
</DocsShell>
```

Article pages still render body (e.g. mdsvex `Publication`) inside the shell content area.
