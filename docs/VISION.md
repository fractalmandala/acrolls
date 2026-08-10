# Acrolls product vision

Acrolls is the **SvelteKit equivalent** of Fumadocs / Starlight / Astro starlight-class docs systems: a publishing + documentation framework you own, not a hosted CMS.

## Layers

| Layer | Package | Role |
|---|---|---|
| Compile | `@acrolls/mdsvex` | Markdown / `.svx` → slugs, Shiki, tables, validation |
| Article UI | `@acrolls/svelte` | `Publication`, callouts, figures, mermaid |
| Styles | `@acrolls/styles` | Foundation / default CSS + SASS tokens |
| **Docs shell** | **`@acrolls/docs`** | Nested nav, TOC, crumbs, pager, persistence |
| Kit glue | `@acrolls/sveltekit` | Host config helpers |
| CLI | `@acrolls/cli` | integrate, validate, studio |

## Docs shell (current)

- Nested accordion trees (unlimited depth)
- On-page TOC from article headings
- Breadcrumbs from nav trail
- Prev/next leaf order
- localStorage open-state persistence
- Mobile drawer + filter

## Next (framework finish)

1. **Themes** — polished light/dark docs themes (Fumadocs-grade density)
2. **`sites/acrolls`** — marketing + full docs of Acrolls itself
3. **npm publish** — stable `0.x` packages under `@acrolls/*`
4. **CLI** — `acrolls docs init` scaffold for a docs area
5. **Search** — optional client/index search plug-in (later)

Consumers (e.g. Dharmalib) stay optional demos; the product is the packages + docs site.
