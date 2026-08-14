# Packages reference

| Public entrypoint | Main exports | Role |
|---|---|---|
| `acrolls/mdsvex` | `createAcrollsMdsvexPreprocessor`, `createAcrollsMdsvexOptions`, `renderAcrollsArticleHtml`, … | Compile pipeline + source safety |
| `acrolls/svelte` | `Publication`, `Callout`, `Figure`, … | Article components |
| `acrolls/styles/*` | CSS / Sass entrypoints | Article styles |
| `acrolls/docs` | `DocsShell`, `DocsNav` types, helpers | Docs chrome |
| `acrolls/docs/content` | `createDocsContentSource`, `defineDocsConfig` | Generated docs tree |
| `acrolls/sveltekit` | SvelteKit preprocessor and generated-source helpers | Host integration |
| `acrolls` binary | `onboard`, `validate`, `studio`, `integrate` | CLI workflow |

Install all of these through one dependency:

```bash
pnpm add acrolls@latest
```

The scoped `@acrolls/*` packages are internal dependencies. Consumer projects should not add
or import them directly.

---

## `acrolls/mdsvex`

```ts
import {
  createAcrollsMdsvexOptions,
  renderAcrollsArticleHtml,
  parseFenceMeta,
  createAcrollsHighlighter
} from 'acrolls/mdsvex';
```

| Export | Use |
|---|---|
| `createAcrollsMdsvexPreprocessor(opts?)` | Preferred Svelte preprocessor; normalizes unsafe Markdown before mdsvex |
| `createAcrollsMdsvexOptions(opts?)` | Lower-level options object for direct `mdsvex(...)` usage |
| `normalizeAcrollsMarkdown(source, opts?)` | Normalize Markdown and return source-safety findings |
| `renderAcrollsArticleHtml(source)` | Studio / HTML preview string |
| `parseFenceMeta` | Test or custom tools |

---

## `acrolls/svelte`

```ts
import {
  Publication,
  Banner,
  Callout,
  Figure,
  Video,
  ZoomableImage,
  PublicationLayout
} from 'acrolls/svelte';
```

Wrap article content with **`Publication`** so code-frame enhancement + mermaid run.

---

## `acrolls/styles`

```
acrolls/styles/foundation.css
acrolls/styles/default.css
acrolls/styles/foundation
acrolls/styles/default
acrolls/styles/tokens
```

---

## `acrolls/docs`

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
} from 'acrolls/docs';

import 'acrolls/docs/styles.css';
```

For Sass layouts, use `import 'acrolls/docs/styles.sass'` in the layout script. A host global
Sass file can instead use `@use 'acrolls/docs/styles'`.

---

## Versioning

Install or update the public package with `pnpm add acrolls@latest` or
`pnpm up acrolls@latest`. Acrolls is pre-1.0, so pin an exact version in production when a
host needs repeatable builds and review release notes before upgrading.
