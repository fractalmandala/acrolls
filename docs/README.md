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

**Recommended first path:** install `acrolls` from npm, run the CLI onboarding walkthrough from
your host root, and follow its file-by-file checkpoints. The manual pages are the detailed
reference when a host needs a deliberate customization.

| If you want… | Read |
|---|---|
| A CLI-led drop-in to an existing SvelteKit site | [CLI onboarding](./cli.md#onboard) |
| Manual integration details and snippets | [Getting started](./getting-started.md) |
| Exact SvelteKit file changes | [Integrate into SvelteKit](./integrate-sveltekit.md) |
| Declaring a docs collection, typed frontmatter, `filter` vs `hidden` | [Generated docs tree](./integrate-sveltekit.md#e-pattern-2--generated-docs-tree) |
| Moving off `createAcrollsDocsSource` | [Migration](./integrate-sveltekit.md#migrating-from-createacrollsdocssource) |
| Writing `.md` / `.svx` content | [Content authoring](./content-authoring.md) |
| Sidebar, TOC, multi-section docs | [Docs shell](./docs-shell.md) |
| Foundation vs default CSS | [Styles](./styles.md) |
| `onboard` / `validate` / `studio` / `integrate` | [CLI reference](./cli.md) |
| Package map & exports | [Packages reference](./packages.md) |
| Build fails / weird HTML | [Troubleshooting](./troubleshooting.md) |
| Install the published package | [Install from npm](./local-install.md) |
| Publish and test a release | [Release](./release.md) |
| A clean independent-host trial | [Third-host trial](#third-host-trial) → [checklist](./checklist.md) |
| How sessions evolve the product & specs | [Evolution log](./evolution/) (sessions · proposals · ADRs) |

Copy-paste snippets live under [`docs/snippets/`](./snippets/).

---

## Install from npm

Run this from the existing SvelteKit host after publishing the current Acrolls release:

```bash
cd /path/to/your-sveltekit-app
pnpm add acrolls@latest
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
```

The CLI is guidance-only: it prints the exact package commands, files, snippets, cautions, and
checks, then lets the host keep ownership of its adapter and deployment. If you need to wire the
host manually, follow the detailed reference below. Every application import uses an
`acrolls/*` subpath. Do not install or import `@acrolls/*` implementation packages directly.

---

## Two products in one SDK

```text
┌─────────────────────────────────────────────────────┐
│  DocsShell (sidebar · TOC · crumbs · pager)         │  ← acrolls/docs
│  ┌───────────────────────────────────────────────┐  │
│  │  Publication (article body)                   │  │  ← acrolls/svelte
│  │  compiled from .md / .svx                     │  │  ← acrolls/mdsvex
│  └───────────────────────────────────────────────┘  │
│  styles: foundation | default                        │  ← acrolls/styles
└─────────────────────────────────────────────────────┘
```

- **Blog / essays only** → mdsvex + Publication + styles (no docs shell)  
- **Product docs** → docs shell + Publication inside content  

---

## Requirements

- Node ≥ 20.19  
- SvelteKit 2.62+ or 3 + Svelte 5
- pnpm recommended  
- the published `acrolls` package

---

## Third-host trial

Use this exact route to validate Acrolls in a new SvelteKit site:

1. Install `acrolls@latest`, then run `acrolls onboard` from the host root.
2. Follow the CLI checkpoints through the generated `/docs` route; the manual
   [Getting started](./getting-started.md) page explains each generated file in detail.
3. Confirm `package.json` contains `acrolls` and no direct `@acrolls/*` dependencies.
4. Follow [checklist.md](./checklist.md), including an `index.md`, a nested catch-all route,
   lazy document renderer, shell, sidebar persistence, and a production build.
5. If the package appears stale, update `acrolls`, restart the dev server, and confirm the
   installed version with `pnpm exec acrolls --version`.

---

## Status

Public alpha quality. APIs may change before 1.0. See [VISION.md](./VISION.md) for the themes,
CLI, search, and Acrolls-site roadmap.
