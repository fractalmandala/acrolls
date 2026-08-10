# Acrolls

**Acrolls** is an open-source publishing SDK for **SvelteKit**. It turns ordinary Markdown and mdsvex (`.md` / `.svx`) into publication-grade technical articles on websites you already own.

> Just write. Acrolls handles the rest.

Independent of the mandala monorepo — lives at `/Users/amrit/acrolls`.

## Packages

| Package | Purpose |
|---|---|
| `@acrolls/mdsvex` | Shared mdsvex pipeline (GFM, slugs, tables, Shiki, fence meta) |
| `@acrolls/svelte` | `Publication`, Banner, Callout, Figure, Video, … (Svelte 5) |
| `@acrolls/styles` | `foundation.css`, `default.css`, optional SASS tokens |
| `@acrolls/sveltekit` | SvelteKit mdsvex options + layout default |
| `@acrolls/cli` | `init`, `integrate`, `validate`, `studio` |

## Quick start (this repo)

```bash
cd /Users/amrit/acrolls
pnpm install
pnpm build
pnpm --filter @acrolls/example-kit dev
```

Open the kit-consumer example, then try:

```bash
pnpm --filter @acrolls/cli exec node ./dist/index.js validate ../../examples/starter/article.md
pnpm --filter @acrolls/cli exec node ./dist/index.js studio ../../examples/starter/article.md
```

## Host install (when published)

```bash
pnpm add @acrolls/svelte @acrolls/styles @acrolls/mdsvex @acrolls/sveltekit
pnpm add -D @acrolls/cli mdsvex
```

Wire `svelte.config.js` with `mdsvex(createAcrollsSvelteKitMdsvexOptions())` and import `@acrolls/styles/default.css` in the root layout.

## Docs

- [PRODUCT.md](./PRODUCT.md) — product scope (v0 A+B+C)
- [TECH.md](./TECH.md) — architecture
- [SKILL.md](./SKILL.md) — agent integration skill

## License

Apache-2.0
