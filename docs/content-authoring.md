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

If you use mdsvex **layout** that reads frontmatter into a banner, those fields drive it. With only `<Publication>`, frontmatter is still available as `export const metadata` from the module — your page can render a title if you want.

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

### Callouts / figures (SVX or imported components)

```svx
<script>
  import { Callout, Figure, Banner } from '@acrolls/svelte';
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
/Users/amrit/acrolls/packages/cli/dist/index.js validate ./path/to/page.md
/Users/amrit/acrolls/packages/cli/dist/index.js validate ./path/to/page.md --strict
```

Strict mode fails on unsupported languages and hard errors.

---

## Studio (local authoring)

```bash
/Users/amrit/acrolls/packages/cli/dist/index.js studio ./path/to/page.md --mode default
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
