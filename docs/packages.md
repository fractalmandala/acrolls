# Packages reference

| Package | Import | Role |
|---|---|---|
| `@acrolls/mdsvex` | `createAcrollsMdsvexOptions`, `renderAcrollsArticleHtml`, … | Compile pipeline |
| `@acrolls/svelte` | `Publication`, `Callout`, `Figure`, … | Article components |
| `@acrolls/styles` | CSS / SASS entrypoints | Article styles |
| `@acrolls/docs` | `DocsShell`, `DocsNav` types, helpers | Docs chrome |
| `@acrolls/cli` | binary | validate / studio / integrate |
| `@acrolls/sveltekit` | Kit helpers | Prefer mdsvex package until published |

---

## `@acrolls/mdsvex`

```ts
import {
  createAcrollsMdsvexOptions,
  renderAcrollsArticleHtml,
  parseFenceMeta,
  createAcrollsHighlighter
} from '@acrolls/mdsvex';
```

| Export | Use |
|---|---|
| `createAcrollsMdsvexOptions(opts?)` | Pass to `mdsvex(...)` |
| `renderAcrollsArticleHtml(source)` | Studio / HTML preview string |
| `parseFenceMeta` | Test or custom tools |

---

## `@acrolls/svelte`

```ts
import {
  Publication,
  Banner,
  Callout,
  Figure,
  Video,
  ZoomableImage,
  PublicationLayout
} from '@acrolls/svelte';
```

Wrap article content with **`Publication`** so code-frame enhancement + mermaid run.

---

## `@acrolls/styles`

```
@acrolls/styles/foundation.css
@acrolls/styles/default.css
@acrolls/styles/sass/tokens.sass
```

---

## `@acrolls/docs`

```ts
import {
  DocsShell,
  DocsSidebar,
  DocsToc,
  DocsBreadcrumbs,
  DocsPager,
  flattenDocsNav,
  docsPager,
  buildDocsCrumbs,
  clearOpenState,
  type DocsNav,
  type DocsNavNode
} from '@acrolls/docs';

import '@acrolls/docs/styles.css';
```

---

## Versioning

Monorepo packages currently track `0.1.x` / `0.2.x` independently. Treat as alpha: pin `file:` paths and rebuild consciously.
