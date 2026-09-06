# Packages reference

| Public entrypoint | Main exports | Role |
|---|---|---|
| `acrolls/mdsvex` | `createAcrollsMdsvexPreprocessor`, `createAcrollsMdsvexOptions`, `renderAcrollsArticleHtml`, … | Compile pipeline + source safety |
| `acrolls/svelte` | `Publication`, `Callout`, `Figure`, … | Article components |
| `acrolls/styles/*` | CSS / Sass entrypoints | Article styles |
| `acrolls/docs` | `DocsShell`, `DocsNav` types, helpers | Docs chrome |
| `acrolls/content` | `content`, `markdownGlob`, `customSource` | Content collections — the recommended docs front door |
| `acrolls/docs/content` | `defineDocsConfig`, `createDocsContentSource` | Docs config + lower-level source engine |
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
acrolls/styles/theme.css
acrolls/styles/foundation
acrolls/styles/default
acrolls/styles/theme
acrolls/styles/tokens
```

`acrolls/styles/theme` is the theming kit built on
[fractalthemer](https://www.npmjs.com/package/fractalthemer) (40+ themes, auras, theme picker).
See [styles.md](styles.md#theming-kit) for setup and the Sass package-importer requirement.

---

## `acrolls/content`

```ts
import {
  content,
  markdownGlob,
  customSource,
  type ContentLoader,
  type LoadedDocument,
  type Entry,
  type EntrySummary,
  type Collection,
  type StandardSchemaV1
} from 'acrolls/content';
```

| Export | Use |
|---|---|
| `content({ loader, config, schema?, filter? })` | Declare one docs collection; `.sourceSync()` (eager loaders) or `await .source()` |
| `markdownGlob({ body, metadata, facts, root })` | Vite loader over three `import.meta.glob` calls on the identical pattern (a legacy two-glob `modules` form is still supported) |
| `customSource({ list })` | CMS/database/API loader seam; async-only, and its `live()` hook is unimplemented |
| `StandardSchemaV1` | Structural Standard Schema type; hosts supply the validator |

Full usage, the `filter` versus `hidden` distinction, and the migration table are in
[Integrate into SvelteKit](./integrate-sveltekit.md#e-pattern-2--generated-docs-tree).

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
