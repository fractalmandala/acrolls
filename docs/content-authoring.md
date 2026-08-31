# Content authoring

Acrolls content is **source-owned** Markdown or mdsvex. Git is the CMS.

---

## File types

| Extension | Use |
|---|---|
| `.md` | Pure Markdown + YAML frontmatter; best default |
| `.svx` | Markdown + Svelte (import Callout, Figure, …) |

---

## Frontmatter

Frontmatter is optional. When it is absent, the Acrolls mdsvex preprocessor emits an
empty `metadata` export so the eager module glob remains build-safe. Docs navigation then
falls back to the configured entry title or a humanized filename. A body `# Heading`
still renders normally, but it is not used as navigation metadata.

### Authored generated docs contract

Set `convention: { mode: 'authored' }` on a generated docs source when its Markdown corpus is
owned and should be validated. Every non-`index.md` page must have YAML frontmatter with a
non-empty string `title`; `description` is optional. Invalid pages are excluded from the source,
generated navigation, routes, pager entries, and Acrolls link helpers.

`index.md` is the exception: its visible title comes from the host folder/group name (or the docs
title at the root), so it needs no frontmatter title. A supplied index title is ignored and emits
an author warning. Acrolls renders the resolved title and optional description through
`DocsPageHeader`; an initial Markdown H1 is removed. A different initial H1 emits an author
warning in `acrolls validate`, CI output, and `docs.diagnostics`, never to documentation readers.

Declare the corpus as one collection, as in the kit example. The eager `modules` glob carries
both frontmatter and the preprocessor's static document facts, so no separate facts glob is
needed:

```ts
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

export const docs = content({
  loader: markdownGlob({
    body: import.meta.glob('../../content/**/*.md', { import: 'default' }),
    modules: import.meta.glob('../../content/**/*.md', { eager: true }),
    root: '../../content'
  }),
  config: defineDocsConfig({ /* convention: { mode: 'authored' }, … */ })
}).sourceSync();
```

Optionally add a `schema` to validate frontmatter with any Standard Schema validator you bring
(Valibot, Zod, Arktype — Acrolls depends on none of them), and a `filter` to drop documents from
every addressable surface. Both are documented in
[Integrate into SvelteKit](./integrate-sveltekit.md#typed-frontmatter-with-schema). A frontmatter
block that fails the schema raises an `ACROLLS_SCHEMA_INVALID` diagnostic and then obeys the mode
already in force: authored mode rejects the document, migration mode keeps it with its raw
frontmatter and reports. Schema validation adds no new failure model on top of the two modes
described below.

Configure the matching mdsvex preprocessor with `docs: { mode: 'authored' }`. Before a production
build or in CI, run `acrolls validate <content-directory> --mode authored --on-invalid fail`.
That command aggregates invalid frontmatter, compile failures, leading-H1 warnings, and Markdown
links to rejected Acrolls-resolvable documents.

`DocsPageHeader` is the single heading owner for this surface. Point mdsvex at a docs article
layout that wraps only `<Publication><slot /></Publication>`; do not use `PublicationLayout`,
which intentionally renders its own frontmatter banner for standalone articles.

```md
---
title: Getting started
description: Orientation to the product
eyebrow: Guide
reading: 5 min
---
```

Common keys (for banners / metadata):

| Key | Purpose |
|---|---|
| `title` | Document title |
| `description` / `brief` | Subtitle |
| `eyebrow` / `series` / `project` | Small label above title |
| `reading` | Meta line (avoid key `metadata` — clashes with mdsvex export) |
| `image` / `imageAlt` | Banner image |

Acrolls uses these YAML frontmatter fields to display page titles and descriptions when the
standard `PublicationLayout` or `Banner` is used. With only `<Publication>`, frontmatter is
still available as `export const metadata` from the module, so a host-owned route must pass it
to `Banner` (or render an equivalent accessible header) if it composes the article itself.

### Unpublishing a page: `hidden` versus `filter`

`hidden: true` means **unlisted, not private**. The page disappears from the sidebar, pager, and
breadcrumb listings, but it keeps its route, is still prerendered, and still renders for anyone
who has the link. Use it for an appendix or a deliberately unlinked deep-link target.

To remove a document from every *addressable* surface, including direct URL access, use the
collection's `filter` option instead. `filter` runs before the route engine, so a filtered
document never becomes a route: it is absent from the nav and the prerendered output, and a
direct URL 404s. A `draft: true` page you do not want reachable needs `filter`, not `hidden`.

```ts
content({ loader, filter: (entry) => !entry.data.draft, config });
```

`filter` is a publication boundary, not a confidentiality boundary. With the Markdown glob
loader, Vite materializes every file matching the glob into the module graph at build time and
`filter` runs afterwards, so a filtered draft's compiled body can still be present in the build
output even though nothing routes to it. For secret or embargoed content, keep the file out of
the globbed directory entirely — or behind host-owned authentication — rather than relying on
`filter`. A `customSource` that never returns the document does not materialize it at all.

`filter` receives `{ key, data, meta }` — the source key such as `guides/install.md`, the
frontmatter, and the preprocessor facts. It deliberately has no public `id`, because slugs are
decided by the route engine (and by host `entries[].href` overrides) after filtering runs.

For generated docs, frontmatter `title`, then `description` (or `brief`) supplies the
navigation record by default. A matching `documents` or `entries` configuration value in
`defineDocsConfig` takes precedence. Use configuration for deliberate navigation labels and
frontmatter for content-owned defaults.

### Navigation hints: `sidebar`

Pages can carry navigation-only IA hints in frontmatter:

```md
---
title: The Complete Installation and Setup Guide
sidebar:
  order: 2
  label: Setup
---
```

`sidebar.order` positions the page among its siblings; `sidebar.label` renames it in the
navigation tree only — the page's `<h1>`, SEO title, and pager keep the full title. A landing
page's `sidebar.label` names its section, and its `sidebar.order` positions the section when no
`folders[].order` encodes one.

Order resolves through a fixed precedence — the IA lock:

1. **Host config** — `documents[].order`, `folders[].order`, `entries[].order` in
   `defineDocsConfig`.
2. **Frontmatter** — `sidebar.order`, then flat `order` as a working alias (`sidebar.order`
   wins when both are present).
3. **Inference** — naming conventions such as `01-`, then discovery/declaration order.

Labels resolve the same way: config `title` > `sidebar.label` > the page title. A non-object
`sidebar` or a wrongly typed `sidebar.order`/`sidebar.label` fails loudly instead of being
skipped.

### File URI links

Markdown link destinations cannot contain raw spaces. Exported `file://` references must
percent-encode them as `%20`; otherwise the Markdown parser preserves the source as literal
text instead of creating an anchor. Acrolls does not make a local file URI portable or resolve
it into a web route—the host owns that policy. A host may add its own link-normalization
preprocess, but hand-authored file URIs should already be encoded.

---

## Markdown features

### Headings

Stable slug ids + hover `#` anchors (compile-time). Prefer one `h1` per page if the shell already shows the title.

### Tables

GFM tables wrap in a keyboard-focusable scroll region.

```md
| State | Meaning |
| --- | --- |
| `choked` | Requests paused |
```

### Code fences

Shiki dual-theme (light/dark CSS variables). Meta fields:

```md
​```ts filename="src/peer.ts" lineNumbers highlight="2-4" focus="1-5" wrap
export type PeerState = 'choked' | 'unchoked';

export function canRequest(s: PeerState) {
  return s === 'unchoked';
}
​```
```

| Meta | Effect |
|---|---|
| `filename="…"` | Header label |
| `lineNumbers` | Gutter numbers |
| `wrap` | Soft-wrap by default |
| `highlight="2,4-6"` | Emphasize lines |
| `focus="2-5"` | Dim non-focused lines |
| `add="3-4"` / `remove="1"` | Diff colors |

Copy + wrap controls appear after hydration inside `Publication`.

### Mermaid

```md
​```mermaid
graph TD
  A[Start] --> B{Ok?}
  B -->|yes| C[Done]
​```
```

Renders client-side (lazy). Fallback shows source until JS runs.

### Literal examples in Markdown

Use inline code for syntax that resembles Svelte or a typed-language generic:

```md
The return type is `Result<T, String>` and the path is `content/<Category>/`.
```

The Acrolls preprocessor also protects a narrow set of these constructs automatically in
`.md` files. `.svx` files are intentionally not rewritten because they may contain real
Svelte components. Run `acrolls validate --strict` in CI when explicit authoring is preferred.

## Existing corpus migration

Acrolls distinguishes a controlled authored corpus from a folder of documents imported from
somewhere else. A missing frontmatter block is acceptable in migration mode and receives the
same readable filename fallback used by generated navigation. It is not evidence that the
document body is valid Svelte.

Preflight the entire directory before deployment:

```bash
acrolls validate ./docs --mode migration --on-invalid error-page --report acrolls-report.json
```

Each document is classified as `ready`, `normalized`, or `rejected`. A rejected Markdown
document can become a safe, routable “Document unavailable” page in migration `error-page`
mode, while valid documents continue to render. The diagnostic page is intentionally visible:
Acrolls does not silently discard broken source. Use authored mode or `--on-invalid fail` when
the deployment must be all-or-nothing.

This protection applies to `.md` prose. `.svx` is executable Svelte and remains trusted
content with fail-fast behavior; only open local `.svx` files that you intend to execute.

### Callouts / figures (SVX or imported components)

```svx
<script>
  import { Callout, Figure, Banner } from 'acrolls/svelte';
</script>

<Banner title="Release notes" description="What changed" />

<Callout variant="warning" title="Careful">
  Variants: note, insight, warning, success, error.
</Callout>

<Figure caption="Diagram" wide={true}>
  <img src="/diagram.svg" alt="…" />
</Figure>
```

### Images

Markdown images work. Zoomable dialog is available via `ZoomableImage` in SVX; plain `img` stays static unless you override components.

---

## What the compiler does **not** do

- Site search  
- i18n routing  
- Automatic Open Graph images  
- CMS draft workflows  

Those stay host responsibilities.

---

## Validate before shipping

```bash
pnpm exec acrolls validate ./path/to/page.md
pnpm exec acrolls validate ./path/to/page.md --strict
```

Strict mode fails on unsupported languages and hard errors.

---

## Studio (local authoring)

```bash
pnpm exec acrolls studio ./path/to/page.md --mode default
```

- Source is truth (atomic Save)  
- Live Publication **HTML** preview (banner, code, tables, mermaid)  
- SVX `<script>` blocks stripped in preview for safety  
- Binds `127.0.0.1` only  

---

## Authoring tips

1. Keep docs pages focused; put long reference in nested nav groups.  
2. Use `foundation` CSS when your app already has a strong type system.  
3. Prefer `.md` unless you need interactive components.  
4. After changing Acrolls packages, rebuild Acrolls then refresh the host install.  
