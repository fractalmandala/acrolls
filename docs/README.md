# Acrolls documentation

**Use this handbook to wire Acrolls into your own SvelteKit project without help.**

Acrolls is a **SvelteKit publishing + docs framework**:

1. **Articles** — Markdown / mdsvex (`.md`, `.svx`) with publication-grade code, tables, figures  
2. **Docs shell** — Fumadocs-class sidebar, nested nav, TOC, breadcrumbs, pager  

It does **not** replace routing, auth, CMS, or hosting. You keep the app; Acrolls owns article compile + docs chrome.

---

## Start here

Coding agents can use the repository-root [`llms.txt`](../llms.txt) as a compact map, then
follow the linked pages below. Human operators should continue with this handbook.

| If you want… | Read |
|---|---|
| First integration end-to-end | [Getting started](./getting-started.md) |
| A guided terminal flow with file-by-file instructions | [CLI onboarding](./cli.md#onboard) |
| Exact SvelteKit file changes | [Integrate into SvelteKit](./integrate-sveltekit.md) |
| Writing `.md` / `.svx` content | [Content authoring](./content-authoring.md) |
| Sidebar, TOC, multi-section docs | [Docs shell](./docs-shell.md) |
| Foundation vs default CSS | [Styles](./styles.md) |
| `onboard` / `validate` / `studio` / `integrate` | [CLI reference](./cli.md) |
| Package map & exports | [Packages reference](./packages.md) |
| Build fails / weird HTML | [Troubleshooting](./troubleshooting.md) |
| Work from this monorepo (`file:`) | [Local / monorepo install](./local-install.md) |
| A clean independent-host trial | [Third-host trial](#third-host-trial) → [checklist](./checklist.md) |

Copy-paste snippets live under [`docs/snippets/`](./snippets/).

---

## Current install reality (read this)

Packages are **not on npm yet**. Today you install from the Acrolls monorepo on disk:

```bash
# after: git clone …/acrolls && cd acrolls && pnpm install && pnpm build
cd /path/to/your-sveltekit-app

pnpm add \
  file:/Users/amrit/acrolls/packages/mdsvex \
  file:/Users/amrit/acrolls/packages/svelte \
  file:/Users/amrit/acrolls/packages/styles \
  file:/Users/amrit/acrolls/packages/docs

pnpm add -D mdsvex
# optional CLI (path to built binary):
# /Users/amrit/acrolls/packages/cli/dist/index.js
```

Adjust absolute paths to your machine. Do **not** add `@acrolls/sveltekit` via `file:` yet:
it uses workspace-internal dependencies. For a local host, use the four packages above,
`@acrolls/mdsvex` for the compiler, and `@acrolls/docs/content` for generated docs.

After an Acrolls change, rebuild it, reinstall the host dependencies, and restart the dev
server: `cd /path/to/acrolls && pnpm build`, then `cd /path/to/host && pnpm install`.

When packages are published, swap `file:…` for `@acrolls/…@x.y.z`.

---

## Two products in one SDK

```text
┌─────────────────────────────────────────────────────┐
│  DocsShell (sidebar · TOC · crumbs · pager)         │  ← @acrolls/docs
│  ┌───────────────────────────────────────────────┐  │
│  │  Publication (article body)                   │  │  ← @acrolls/svelte
│  │  compiled from .md / .svx                     │  │  ← @acrolls/mdsvex
│  └───────────────────────────────────────────────┘  │
│  styles: foundation | default                        │  ← @acrolls/styles
└─────────────────────────────────────────────────────┘
```

- **Blog / essays only** → mdsvex + Publication + styles (no docs shell)  
- **Product docs** → docs shell + Publication inside content  

---

## Requirements

- Node ≥ 20.19  
- SvelteKit 2 + Svelte 5  
- pnpm recommended  
- `mdsvex` as a host dependency

---

## Third-host trial

Use this exact route to validate Acrolls in a new SvelteKit site:

1. Build the Acrolls clone, then add only the four supported local packages shown above.
2. Follow [Getting started](./getting-started.md) through the generated `/docs` route;
   it includes the root page, nested catch-all route, lazy document renderer, and shell.
3. Run the browser checks in [checklist.md](./checklist.md), including an `index.md`, a
   nested page, sidebar persistence, and a production build.
4. If a local package appears stale, use the refresh routine in
   [troubleshooting.md](./troubleshooting.md#local-file-package-is-stale).

This is a local-development installation. Do not deploy an application that depends on
`file:` packages; switch to published, versioned packages when Acrolls is released to a
registry.

---

## Status

Public alpha quality. APIs may change before 1.0. See [VISION.md](./VISION.md) for roadmap (themes, npm, acrolls site).
