# Acrolls

**SvelteKit publishing + documentation framework** — Markdown/mdsvex articles and a Fumadocs-class docs shell.

> Just write. Acrolls handles the rest.

Not a CMS or host. You own the SvelteKit app; Acrolls owns compile, article UI, and docs chrome.

## Documentation (start here)

**→ [docs/README.md](./docs/README.md)** — self-serve handbook to wire Acrolls into **your** projects.
For the next independent host trial, begin with the [third-host setup path](./docs/README.md#third-host-trial) and work through the [checklist](./docs/checklist.md).

For coding agents, start with [`llms.txt`](./llms.txt), then follow the linked integration and
validation guides in order.

| Guide | Topic |
|---|---|
| [Getting started](./docs/getting-started.md) | First integration |
| [Local install](./docs/local-install.md) | `file:` packages before npm |
| [Integrate SvelteKit](./docs/integrate-sveltekit.md) | Config + route patterns |
| [Content authoring](./docs/content-authoring.md) | Markdown / SVX / fences |
| [Docs shell](./docs/docs-shell.md) | Sidebar, TOC, nav, persistence |
| [Styles](./docs/styles.md) | foundation / default / tokens |
| [CLI reference](./docs/cli.md) | onboard · validate · studio · integrate |
| [Troubleshooting](./docs/troubleshooting.md) | Common failures |
| [Checklist](./docs/checklist.md) | Printable integration list |

Copy-paste: [docs/snippets/](./docs/snippets/).

## Packages

| Package | Purpose |
|---|---|
| `@acrolls/mdsvex` | mdsvex pipeline (GFM, slugs, tables, Shiki, fence meta) |
| `@acrolls/svelte` | `Publication`, Banner, Callout, Figure, Video, Mermaid |
| `@acrolls/styles` | `foundation.css`, `default.css`, SASS tokens |
| `@acrolls/docs` | Docs shell: nested nav, TOC, breadcrumbs, pager |
| `@acrolls/cli` | `init`, `integrate`, `validate`, `studio` |

`@acrolls/sveltekit` is intentionally not listed for external `file:` installation yet: it
uses workspace-internal dependencies. External hosts should use `@acrolls/mdsvex` and
`@acrolls/docs/content` directly until registry packages are available.

## Develop this monorepo

```bash
cd /Users/amrit/acrolls
pnpm install
pnpm build
pnpm --filter @acrolls/example-kit dev
./packages/cli/dist/index.js validate examples/starter/article.md
```

## Status

Alpha. Not on npm yet — install via `file:` from this repo ([local-install.md](./docs/local-install.md)). Roadmap: [docs/VISION.md](./docs/VISION.md).

## License

Apache-2.0
