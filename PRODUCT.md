# Acrolls — PRODUCT

## Summary

**Acrolls** is an open-source publishing SDK for **SvelteKit**. It turns ordinary Markdown and mdsvex (`.md` / `.svx`) into publication-grade technical articles on websites you already own.

> Just write. Acrolls handles the rest.

Acrolls is for developers who own a SvelteKit site and want production typography, code frames, tables, banners, callouts, figures, responsive behavior, and accessibility without assembling a publishing design system themselves.

## What it is not

Not a hosted blog platform, CMS, website builder, proprietary document format, collaboration service, or replacement for SvelteKit routing, deployment, analytics, or content storage.

## Responsibility boundary

| Acrolls owns | Host owns |
|---|---|
| mdsvex compilation semantics | Routing, deployment, SEO policy |
| Publication structure & primitives | Visual identity outside the article |
| Code highlighting (compile-time) | Content location & metadata schema |
| Article a11y / print / reduced-motion | Runtime theme toggle persistence |
| Local Studio (source-authoritative) | Navigation chrome, analytics |

## Content dialect

- **Primary:** Markdown + **mdsvex** (`.md`, `.svx`)
- Svelte components may appear in `.svx` content
- YAML frontmatter for metadata (title, description, …) — not prose

## Style modes

| Mode | Use when |
|---|---|
| **Foundation** | Host already owns article typography / density |
| **Default** | Host wants a complete editorial preset |
| **SASS tokens** | Host prefers indented SASS token maps (optional layer) |

CSS is first-class. SASS is an additional pack for token authoring, not a requirement.

## Packages

| Package | Role |
|---|---|
| `@acrolls/mdsvex` | Shared mdsvex options: GFM, frontmatter, slugs, tables, Shiki, validation |
| `@acrolls/svelte` | `Publication` + editorial primitives (Svelte 5) |
| `@acrolls/styles` | `foundation.css`, `default.css`, optional SASS tokens |
| `@acrolls/sveltekit` | Thin SvelteKit / svelte.config glue |
| `@acrolls/cli` | `init`, `integrate`, `validate`, `studio` |

## v0 scope (A + B + C)

### A — Reader surface (P0)

- mdsvex pipeline with heading slugs + anchors
- Shiki dual-theme code frames (copy + wrap)
- Fence metadata: `filename`, `lineNumbers`, `highlight`, `focus`, `add`, `remove`, `wrap`
- Semantic tables with keyboard-focusable overflow
- `Publication`, `Banner`, `Callout`, `Figure`, `Video`
- Zoomable images (opt-out `#nozoom` / `zoom={false}`)
- foundation + default CSS + SASS token pack
- Working SvelteKit example (`examples/kit-consumer`)

### B — Author tooling (P1)

- CLI: `init`, `integrate --dry-run`, `validate`
- Project-local binary; reviewed integrate plan

### C — Studio (P2)

- Local source-authoritative studio: Markdown edit + production preview
- Explicit Save; no proprietary document store
- Bind `127.0.0.1`; no telemetry

### Polish (0.1.1)

- Studio: live Publication HTML preview (banner, tables, Shiki, mermaid) + copy/wrap enhancement
- CLI `integrate --yes`: backup + patch svelte.config / layout CSS import
- Mermaid fences → lazy client render
- Shared `renderAcrollsArticleHtml()` for Studio/validate parity

### Deferred

- Medium import
- Full rich-text Studio mode with protected SVX blocks
- Packed consumer CI matrix across OS
- npm publish automation
- mdsvex layout slot → snippet once mdsvex supports it

## Success criteria

1. `pnpm install && pnpm build` succeeds in the monorepo.
2. `examples/kit-consumer` builds and renders the starter article with code, callout, table, figure.
3. `acrolls validate` compiles a sample article and exits 0.
4. `acrolls studio` opens a local preview for one file.
5. Host can import only foundation CSS and still get structure + behavior.

## Non-goals for v0

- Replacing mdsvex or inventing a new content format
- Owning host theme systems
- Pixel-perfect clone of any third-party product
