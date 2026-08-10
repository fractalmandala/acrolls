# Acrolls documentation

**Use this handbook to wire Acrolls into your own SvelteKit project without help.**

Acrolls is a **SvelteKit publishing + docs framework**:

1. **Articles** — Markdown / mdsvex (`.md`, `.svx`) with publication-grade code, tables, figures  
2. **Docs shell** — Fumadocs-class sidebar, nested nav, TOC, breadcrumbs, pager  

It does **not** replace routing, auth, CMS, or hosting. You keep the app; Acrolls owns article compile + docs chrome.

---

## Start here

| If you want… | Read |
|---|---|
| First integration end-to-end | [Getting started](./getting-started.md) |
| Exact SvelteKit file changes | [Integrate into SvelteKit](./integrate-sveltekit.md) |
| Writing `.md` / `.svx` content | [Content authoring](./content-authoring.md) |
| Sidebar, TOC, multi-section docs | [Docs shell](./docs-shell.md) |
| Foundation vs default CSS | [Styles](./styles.md) |
| `validate` / `studio` / `integrate` | [CLI](./cli.md) |
| Package map & exports | [Packages reference](./packages.md) |
| Build fails / weird HTML | [Troubleshooting](./troubleshooting.md) |
| Work from this monorepo (`file:`) | [Local / monorepo install](./local-install.md) |

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

Adjust absolute paths to your machine. Rebuild Acrolls after SDK changes: `cd ~/acrolls && pnpm build`.

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

## Status

Public alpha quality. APIs may change before 1.0. See [VISION.md](./VISION.md) for roadmap (themes, npm, acrolls site).
