# Docs shell (`@acrolls/docs`)

Fumadocs-class chrome for multi-page documentation areas.

---

## What you get

| UI | Behavior |
|---|---|
| **Sidebar** | Nested accordion tree from `DocsNav` |
| **Filter** | Client search over titles/descriptions |
| **Breadcrumbs** | Auto from nav trail |
| **TOC** | Right rail from `h2–h3` in the article (scroll spy) |
| **Pager** | Previous / next leaf pages |
| **Persistence** | Open/closed groups in `localStorage` |
| **Mobile** | Drawer + menu button |

Article **body** is still yours: usually `<Publication><Doc /></Publication>`.

---

## 1. Define navigation

**`src/lib/docs/nav.ts`** (copy [snippets/nav.ts](./snippets/nav.ts)):

```ts
import type { DocsNav } from '@acrolls/docs';

export const docsNav: DocsNav = {
  title: 'Documentation',
  baseHref: '/docs',
  subtitle: 'Guides and reference',
  storageKey: 'myapp-docs', // unique per host surface
  sections: [
    {
      id: 'start',
      title: 'Start here',
      defaultOpen: true,
      items: [
        {
          title: 'Introduction',
          href: '/docs/intro',
          slug: 'intro',
          description: 'What this product is'
        },
        {
          title: 'Install',
          href: '/docs/install',
          slug: 'install'
        }
      ]
    },
    {
      id: 'guides',
      title: 'Guides',
      items: [
        {
          id: 'advanced',
          title: 'Advanced',
          defaultOpen: false,
          children: [
            { title: 'Performance', href: '/docs/performance', slug: 'performance' },
            { title: 'Security', href: '/docs/security', slug: 'security' }
          ]
        }
      ]
    }
  ]
};
```

### Rules

- **Leaf pages** need `href` (used for pager + active state).  
- **Groups** use `children` (optional `href` for overview pages).  
- **`storageKey`** namespaces accordion state (`acrolls-docs:open:<key>`).  
- **`id`** on sections/groups should be stable (don’t rename casually or open state “resets”).  

Multiple surfaces (user vs developer) = two `DocsNav` objects + two layouts.

---

## 2. Layout

**`src/routes/docs/+layout.svelte`**

```svelte
<script lang="ts">
  import '@acrolls/styles/foundation.css'; // or default.css
  import '@acrolls/docs/styles.css';
  import { page } from '$app/state';
  import { DocsShell } from '@acrolls/docs';
  import { docsNav } from '$lib/docs/nav';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="docs-root">
  <DocsShell
    nav={docsNav}
    pathname={page.url.pathname}
    homeHref="/"
    homeLabel="Home"
    filterable={true}
    showToc={page.url.pathname !== '/docs'}
    showPager={page.url.pathname !== '/docs'}
    persistOpen={true}
    menuLabel="Docs menu"
  >
    {@render children()}
  </DocsShell>
</div>

<style>
  .docs-root {
    /* optional host token bridge */
    --acrolls-docs-accent: var(--brand, #6d28d9);
    --acrolls-docs-border: var(--border, #e5e5e0);
    padding: 1rem 0 3rem;
  }
</style>
```

### DocsShell props

| Prop | Default | Meaning |
|---|---|---|
| `nav` | required | `DocsNav` tree |
| `pathname` | required | usually `page.url.pathname` |
| `homeHref` / `homeLabel` | `/` · `Home` | First breadcrumb |
| `filterable` | `true` | Sidebar filter input |
| `showToc` | `true` | Right TOC rail |
| `showPager` | `true` | Prev/next footer |
| `persistOpen` | `true` | localStorage accordion state |
| `tocMinLevel` / `tocMaxLevel` | `2` / `3` | Heading levels in TOC |
| `menuLabel` | `Docs menu` | Mobile button |

---

## 3. Article page

```svelte
<script lang="ts">
  import { Publication } from '@acrolls/svelte';
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
  const Doc = $derived(data.document);
</script>

<article class="doc-article">
  <Publication>
    <Doc />
  </Publication>
</article>
```

TOC looks inside `.acrolls-docs-shell__article` (shell wraps children). Headings need text content; missing `id`s are assigned automatically.

---

## 4. Index page

On `/docs`, set `showToc={false}` and `showPager={false}` (as above). List cards from your nav:

```ts
import { flattenDocsNav } from '@acrolls/docs';
import { docsNav } from '$lib/docs/nav';

export const guides = flattenDocsNav(docsNav).map((i) => ({
  href: i.href!,
  title: i.title,
  description: i.description ?? ''
}));
```

---

## 5. Nested items example

```ts
{
  id: 'api',
  title: 'API',
  defaultOpen: true,
  children: [
    { title: 'Overview', href: '/docs/api' },
    {
      id: 'api-auth',
      title: 'Auth',
      children: [
        { title: 'OAuth', href: '/docs/api/oauth' },
        { title: 'API keys', href: '/docs/api/keys' }
      ]
    }
  ]
}
```

Pager order = depth-first leaf order.

---

## 6. Persistence details

- Key: `acrolls-docs:open:<storageKey>`  
- Value: JSON map `{ [nodeOrSectionId]: boolean }`  
- Path still forces ancestors open when you land on a nested page  
- Filter mode forces groups open while typing  

Clear state: DevTools → Application → Local Storage → delete the key, or:

```ts
import { clearOpenState } from '@acrolls/docs';
clearOpenState('myapp-docs');
```

---

## 7. Multiple docs areas

```
src/lib/docs/user-nav.ts
src/lib/docs/developer-nav.ts
src/routes/docs/user/+layout.svelte   → nav={userDocsNav}
src/routes/docs/developer/+layout.svelte → nav={developerDocsNav}
```

Use different `storageKey` values.

---

## 8. Without the shell

You can still use Publication alone for blogs. Docs shell is optional.
