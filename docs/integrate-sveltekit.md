# Integrate into SvelteKit

Step-by-step host wiring. Assumes packages are already installed ([local-install.md](./local-install.md)).

---

## A. Compiler (`vite.config.ts`)

Use **`createAcrollsMdsvexPreprocessor` from `acrolls/mdsvex`**. It normalizes unsafe Markdown before mdsvex parses it.

```ts
import adapter from '@sveltejs/adapter-auto'; // or adapter-vercel, etc.
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { createAcrollsMdsvexPreprocessor } from 'acrolls/mdsvex';
import { defineConfig } from 'vite';

const acrolls = createAcrollsMdsvexPreprocessor({
  extensions: ['.md', '.svx'],
  // Opt into safe migration pages for an existing Markdown corpus.
  // onInvalidDocument: 'error-page'
  // layout: omit for full control, or set a path to a layout .svelte
  // strict: true  // fail on unknown fence languages
});

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.md', '.svx'],
      preprocess: [vitePreprocess(), acrolls],
      adapter: adapter()
    })
  ]
});
```

This is the SvelteKit 3 configuration shape and is also supported by SvelteKit 2.62 and
later. Preserve the host's existing adapter, Vite plugins, and SvelteKit options when merging
it. When configuration is passed to `sveltekit()`, a legacy `svelte.config.js` is ignored.
See the [official SvelteKit configuration reference](https://svelte.dev/docs/kit/configuration).

SvelteKit 3 also changes two host conventions that affect copied route snippets:

- `tsconfig.json` extends `$app/tsconfig` instead of `./.svelte-kit/tsconfig.json`.
- The built-in `$lib` alias is removed in favor of package `imports` such as `#lib`.

Acrolls' generated snippets use explicit relative imports, so the same docs files work in both
SvelteKit 2.62+ and 3 without adding an alias. If the host migrates existing `$lib` imports,
follow the SvelteKit migration guidance for that host before judging the Acrolls build.

### Options you care about

| Option | Default | Meaning |
|---|---|---|
| `extensions` | `['.svx','.md']` | Files mdsvex pretreats |
| `layout` | none | mdsvex layout map or string path |
| `strict` | `false` | Unknown code languages error instead of plaintext |
| `onInvalidDocument` | `fail` | `fail` or Markdown-only `error-page` in migration mode |
| source safety | enabled | Markdown-only Svelte-shaped literals are wrapped as inline code before parsing |

Do **not** set a global Publication layout unless every Markdown file on the site is an article (including random READMEs in routes). Prefer wrapping with `Publication` only on docs/blog routes.

For an existing corpus, preflight it first and opt into the same invalid-document policy in
the host:

```bash
acrolls validate ./docs --mode migration --on-invalid error-page --report acrolls-report.json
```

The preprocessor catches the transformed Svelte parse boundary for `.md` files and returns a
safe diagnostic module when `onInvalidDocument: 'error-page'` is enabled. The default remains
`fail`, so a host that does not opt into migration behavior keeps its existing build gate.

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
import 'acrolls/styles/default.css';

// Or mechanics only (host already owns type scale / colors)
import 'acrolls/styles/foundation.css';
```

Optionally add the theming kit (fractalthemer: 40+ themes, auras, theme picker):

```ts
import 'acrolls/styles/theme.css';
```

Sass consumers use `@use 'acrolls/styles/theme'` and must register a Node package
importer — see [styles.md](styles.md#theming-kit).

For Sass layouts, import the matching Sass entrypoint from the layout script:

```svelte
<script>
  import 'acrolls/styles/default.sass';
</script>
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
  import { Publication } from 'acrolls/svelte';
  import 'acrolls/styles/default.css';
</script>

<Publication>
  <First />
</Publication>
```

---

## E. Pattern 2 — generated docs tree

Use the content-source layer when the docs are maintained as a directory tree. The
filesystem root, public URL prefix, and SvelteKit route directory are independent choices:

| Filesystem | Public URL | SvelteKit route |
|---|---|---|
| `docs/**/*.md` | `/docs/...` | `src/routes/docs/` |
| `content/**/*.md` | `/content/...` | `src/routes/content/` |
| `posts/**/*.md` | `/posts/...` | `src/routes/posts/` |

The first directory level becomes a navigation section, files inside it become section
items, and deeper directories become nested groups. `index.md` becomes the route for its
containing directory. This means a tree such as:

```text
docs/
├── text-collection-organization/
│   ├── grammatical-studies.md
│   └── literary-works/
│       └── classical-kavya.md
└── user-guide/
    ├── getting-started.md
    └── reading-texts.md
```

can generate `DocsNav` sections for `Text Collection Organization` and `User Guide`
without a hand-written `nav.ts`.

Create `src/lib/docs/source.ts`. One `content()` declaration owns the whole surface:

```ts
import type { Component } from 'svelte';
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

type DocsArticle = Component;

export const docs = content({
  loader: markdownGlob<DocsArticle>({
    body: import.meta.glob('../../docs/**/*.md', { import: 'default' }) as Record<
      string,
      () => Promise<DocsArticle>
    >,
    metadata: import.meta.glob('../../docs/**/*.md', { eager: true, import: 'metadata' }),
    facts: import.meta.glob('../../docs/**/*.md', { eager: true, import: '__acrollsDocument' }),
    root: '../../docs'
  }),
  config: defineDocsConfig({
    title: 'Documentation',
    baseHref: '/docs',
    subtitle: 'Guides and reference'
  })
}).sourceSync();
```

All three globs use the **identical pattern string**. `body` is lazy (`{ import: 'default' }`) to
keep compiled document bodies out of the eager module graph, while `metadata` and `facts` are eager
named globs (`import: 'metadata'` and `import: '__acrollsDocument'`) that supply frontmatter and the
preprocessor's static document facts without eagerly importing the article component or its Shiki
runtime. `root` is the directory prefix stripped from each glob key; it is the same option the
deprecated helper called `contentRoot`. A legacy two-glob form — a single eager
`modules: import.meta.glob('…', { eager: true })` that `markdownGlob` reads both `metadata` and
facts off — is still supported but no longer recommended, because it pulls the compiled component
and Shiki into the eager graph.

`.sourceSync()` resolves the collection synchronously and returns the same content source the
rest of this handbook uses. It is legal only for eager loaders such as `markdownGlob`; a
custom source needs `await collection.source()` instead (see
[Custom and remote sources](#custom-and-remote-sources)).

Use `docs.nav` in `DocsShell`, `docs.get(params.slug)` for validation, and
`docs.entries()` for static route entries. The generated source supports Markdown
sources (`.md`) here; `.svx` can still be imported through normal mdsvex routes, but automatic
content discovery is Markdown-first. `content` and `markdownGlob` come from `acrolls/content`;
`defineDocsConfig` and the docs config types stay on `acrolls/docs/content`.

### Typed frontmatter with `schema`

`schema` accepts any [Standard Schema](https://standardschema.dev) validator. Acrolls adds no
validation library to your dependency tree — bring Valibot, Zod, Arktype, or another vendor.
When a schema is supplied, its validated output becomes the document metadata the engine sees,
so schema defaults and coercions reach navigation titles and ordering. It also types `filter`:
`entry.data.draft` is checked at build time, and a misspelled field is a compile error.

```ts
import type { Component } from 'svelte';
import * as v from 'valibot';
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

type DocsArticle = Component;

const schema = v.object({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  order: v.optional(v.number()),
  draft: v.optional(v.boolean())
});

export const docs = content({
  loader: markdownGlob<DocsArticle>({
    body: import.meta.glob('../../docs/**/*.md', { import: 'default' }) as Record<
      string,
      () => Promise<DocsArticle>
    >,
    metadata: import.meta.glob('../../docs/**/*.md', { eager: true, import: 'metadata' }),
    facts: import.meta.glob('../../docs/**/*.md', { eager: true, import: '__acrollsDocument' }),
    root: '../../docs'
  }),
  schema,
  filter: (entry) => !entry.data.draft,
  config: defineDocsConfig({
    title: 'Documentation',
    baseHref: '/docs',
    subtitle: 'Guides and reference'
  })
}).sourceSync();
```

Keep `title` optional even in `authored` mode. The engine's own `ACROLLS_TITLE_REQUIRED`
admission rule already enforces ordinary-page titles and derives index titles from folder
names, so a required-title schema would double-reject every `index.md`.

Schema failures are **not** a new failure model. A document whose frontmatter fails validation
produces an `ACROLLS_SCHEMA_INVALID` diagnostic — naming the file and the offending field path
— and then follows the corpus policy already in force:

| Mode | Effect of a schema failure |
|---|---|
| `convention: { mode: 'authored' }` | The document is rejected and excluded from the source, exactly like any other authored-mode admission failure |
| Migration mode (no `convention.mode`) | The document is kept with its raw, unvalidated frontmatter and the diagnostic is reported |

Read them from `docs.diagnostics` alongside every other corpus diagnostic. See
[Content authoring](./content-authoring.md#existing-corpus-migration) for the mode contract.

### `filter` versus `hidden`

These are different tools and are routinely confused. They compose independently.

| | `filter` (collection option) | `hidden: true` (frontmatter / folder or entry config) |
|---|---|---|
| Where it lives | `content({ filter })` | Document frontmatter or `defineDocsConfig` |
| Sidebar / `DocsNav` | Absent | Absent |
| `docs.get()` / `docs.load()` | Absent | **Resolves normally** |
| `entries()` / `ids()` / prerender | Absent | **Present — the page is still built** |
| Direct URL visit | 404 | **Renders the page** |
| Breadcrumbs and pager | Absent | Absent from listings, reachable by URL |
| Compiled body in build output | **May still be present** (glob loader) | Present |

**`filter` removes a document from every addressable surface, including direct URL access.** It
runs before the route engine, so a filtered document never becomes a route at all — it is not in
the nav JSON and not in the prerendered output. Use it for drafts, for content gated by
environment, and for anything that must not be reachable by guessing a URL.

**`filter` is a publication boundary, not a confidentiality boundary.** With the Markdown glob
loader, Vite materializes every file matching the glob into the module graph at build time and
`filter` runs afterwards, so Rollup cannot tree-shake the document away: a filtered document's
compiled body can still be present in the built server and client chunks even though nothing
routes to it. Do not use `filter` to protect secret or embargoed content. Keep that content out
of the globbed directory entirely, or put it behind host-owned authentication. This limitation
is specific to glob loaders — a `customSource({ list })` that simply never returns the document
does not materialize it at all.

**`hidden` means unlisted, not private.** A hidden page keeps its route, is still prerendered,
and still renders for anyone who has the link. Use it for a deliberately unlinked page you
still want to ship — release notes for a customer, a deep-link target, an appendix.

`filter` receives `{ key, data, meta }`. There is deliberately no `id`: the route engine is the
sole route authority and host `entries[].href` overrides can change a slug, so no trustworthy
public id exists before the engine runs. Filter on the source `key`
(`guides/install.md`) or on validated frontmatter.

### Custom and remote sources

`markdownGlob` is one implementation of a general loader seam. `customSource({ list })` lets a
CMS, database, or HTTP API supply documents instead. The nav and route engine consumes `list()`
output, not globs, so navigation, routing, breadcrumbs, and pager need no changes.

```ts
import { content, customSource, type LoadedDocument } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

type RemoteArticle = { html: string };

export const cms = content({
  loader: customSource<RemoteArticle>({
    async list(): Promise<LoadedDocument<RemoteArticle>[]> {
      const rows = await fetchDocsFromCms();
      return rows.map((row) => ({
        key: row.path, // e.g. 'guides/install.md'
        data: { title: row.title },
        load: async () => ({ html: row.body })
      }));
    }
  }),
  config: defineDocsConfig({ title: 'Documentation', baseHref: '/docs' })
});

const source = await cms.source();
```

Know the limits before you build on it:

- **`sourceSync()` is unavailable.** `customSource` sets `eager: false`, so you must
  `await collection.source()` and wire the host from an async context. `sourceSync()` throws a
  clear error naming `source()` as the alternative.
- **`live()` is not implemented.** The loader type reserves a `live()` seam for future
  incremental or streaming sources. Nothing in Acrolls consumes it today. There is no
  live-content, SSE, or hot-reload-from-CMS behavior in this release.
- Acrolls ships no remote source implementation. `customSource` is the seam; the adapter to
  your particular CMS is host-owned code.

### Migrating from `createAcrollsDocsSource`

`createAcrollsDocsSource` still works, unchanged and without warnings. It is `@deprecated` in
its TSDoc only to point at the newer API, and it is **not scheduled for removal** — internally
it is now the same code path as `content()`. Migrate when you want a schema, a filter, or the
one-declaration shape; there is no deadline.

```ts
// Before — three globs and four hand-keyed options
import { createAcrollsDocsSource, defineDocsConfig, type DocsMetadata } from 'acrolls/sveltekit';

const modules = import.meta.glob('../../docs/**/*.md', { import: 'default' });
const metadata = import.meta.glob('../../docs/**/*.md', { eager: true, import: 'metadata' });
const facts = import.meta.glob('../../docs/**/*.md', { eager: true, import: '__acrollsDocument' });

export const docs = createAcrollsDocsSource({
  modules,
  metadata,
  facts,
  contentRoot: '../../docs',
  config: defineDocsConfig({ title: 'Documentation', baseHref: '/docs' })
});
```

```ts
// After — three globs, one declaration
import { content, markdownGlob } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

export const docs = content({
  loader: markdownGlob({
    body: import.meta.glob('../../docs/**/*.md', { import: 'default' }),
    metadata: import.meta.glob('../../docs/**/*.md', { eager: true, import: 'metadata' }),
    facts: import.meta.glob('../../docs/**/*.md', { eager: true, import: '__acrollsDocument' }),
    root: '../../docs'
  }),
  config: defineDocsConfig({ title: 'Documentation', baseHref: '/docs' })
}).sourceSync();
```

The mapping is mechanical:

| Old | New |
|---|---|
| `modules` (lazy `default` glob) | `loader.body` |
| `metadata` (eager `metadata` glob) | `loader.metadata` |
| `facts` (eager `__acrollsDocument` glob) | `loader.facts` |
| `contentRoot` | `loader.root` |
| `config` | `config` (unchanged) |
| — | `schema`, `filter` (new, both optional) |

The returned value is the same content source with the same `nav`, `documents`, `diagnostics`,
`get`, `load`, and `entries`, so no route, layout, or shell code changes. This is a developer
ergonomics and build-time type-safety change: what a reader receives from the published site is
byte-for-byte what it was before.

Use a catch-all route for nested documents:

```text
src/routes/docs/
├── +layout.svelte
├── +page.svelte
└── [...slug]/
    ├── +page.ts
    └── +page.svelte
```

The complete root page, catch-all files, and lazy `DocumentPage` are in
[`getting-started.md`](./getting-started.md). The root route renders `docs/index.md` rather
than redirecting; omit that source only when the host writes its own `/docs` overview. A
single `[slug]` route is only enough when every document is flat.

---

## F. Pattern 3 — `.svx` with components

```svx
---
title: With callout
---

<script>
  import { Callout, Figure } from 'acrolls/svelte';
</script>

<Callout variant="insight" title="Tip">
  SVX can import Svelte components.
</Callout>
```

Open only trusted local SVX (it is executable).

---

## G. What **not** to do

1. Import Acrolls CSS in root layout **and** docs layout twice (duplicated rules — pick one place).  
2. Use `createAcrollsMdsvexPreprocessor` from `acrolls/mdsvex`; it includes the Markdown source-safety layer.
3. Put non-article Markdown under the same extensions without wrapping (or they get Shiki transforms but no shell — usually fine).  
4. Expect Studio to execute full SVX component trees (Studio HTML pipeline strips `<script>` for safety).  

---

## H. Adapter note

Acrolls is adapter-agnostic (static, Node, Vercel). Ensure `md` / `svx` routes are not excluded from prerender if you prerender docs.

---

## Multiple content sources

Docs are not always consolidated in one folder. When several sets live in separate places and you
want them on one site under a single hierarchy, merge them with `mergeLoaders` — each prefixed set
becomes a **first-level section**:

```ts
import { content, markdownGlob, markdownRaw, mergeLoaders, mergeRaw } from 'acrolls/content';
import { defineDocsConfig } from 'acrolls/docs/content';

export const docs = content({
  loader: mergeLoaders<DocsArticle>([
    {
      prefix: 'set1',
      loader: markdownGlob<DocsArticle>({
        body: import.meta.glob('../../content-a/**/*.md', { import: 'default' }),
        metadata: import.meta.glob('../../content-a/**/*.md', { eager: true, import: 'metadata' }),
        facts: import.meta.glob('../../content-a/**/*.md', { eager: true, import: '__acrollsDocument' }),
        root: '../../content-a'
      })
    },
    {
      prefix: 'set2',
      loader: markdownGlob<DocsArticle>({
        body: import.meta.glob('../../content-b/**/*.md', { import: 'default' }),
        metadata: import.meta.glob('../../content-b/**/*.md', { eager: true, import: 'metadata' }),
        facts: import.meta.glob('../../content-b/**/*.md', { eager: true, import: '__acrollsDocument' }),
        root: '../../content-b'
      })
    }
  ]),
  config: defineDocsConfig({
    title: 'Docs',
    baseHref: '/docs',
    folders: { set1: { title: 'Set 1', order: 1 }, set2: { title: 'Set 2', order: 2 } }
  })
}).sourceSync();
```

`set1/intro.md` becomes `/docs/set1/intro` under a **Set 1** section; nested files keep their
structure underneath. Omit `prefix` to merge a source at the root. Two sources producing the same
key raise a `DocsContentError` naming both sets, so collisions fail loudly instead of silently
overwriting. Navigation, breadcrumbs, pager, TOC, search, SEO, sitemap, and OG images all work
unchanged — they consume the merged source.

Sections render in **declaration order** — the order you list the sources in the array. Explicit
ordering still wins when you need it: a `folders['<prefix>'].order` value (or a naming-convention
order on the prefix) overrides the declaration position. Prefixes slug cleanly regardless of
casing (`packageA` serves from `/docs/package-a` under a **Package A** section), and if a folder
is renamed so a `folders` key no longer matches, the build errors instead of dropping the override
silently.

For the AI tier, merge the raw maps with the **same prefixes** so keys stay aligned:

```ts
export const raw = mergeRaw([
  { prefix: 'set1', raw: markdownRaw({ raw: import.meta.glob('../../content-a/**/*.md', { query: '?raw', import: 'default', eager: true }), root: '../../content-a' }) },
  { prefix: 'set2', raw: markdownRaw({ raw: import.meta.glob('../../content-b/**/*.md', { query: '?raw', import: 'default', eager: true }), root: '../../content-b' }) }
]);
```

`mergeLoaders` composes `ContentLoader`s, so it also merges `customSource` (CMS/API) sets with
filesystem ones. The merged loader is eager only when every source is eager; if any source is
async, use `await source()` instead of `sourceSync()`.

### Reaching folders outside the project

`import.meta.glob` needs **static literal patterns** that Vite can resolve at build time, so how
out-of-tree sets reach the build matters:

| Strategy | Use when | Notes |
|---|---|---|
| **Symlink** each set into one content dir | sets live anywhere on disk | recommended default — one literal glob, no extra config |
| Relative globs (`'../../../docs-a/**/*.md'`) | sets live near the project | outside the project root needs `server.fs.allow` in dev |
| Copy/sync step before build | sets live in other repos / CI | most robust; add the sync to your build script |

A plain Node `fs` loader cannot replace these for `.md` bodies, because Markdown must be compiled
by the Acrolls mdsvex preprocessor through Vite.
