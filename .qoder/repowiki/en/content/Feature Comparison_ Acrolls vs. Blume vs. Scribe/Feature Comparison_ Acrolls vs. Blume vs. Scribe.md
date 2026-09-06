# Feature Comparison: Acrolls vs. Blume vs. Scribe

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [PRODUCT.md](file://PRODUCT.md)
- [llms.txt](file://llms.txt)
- [docs/README.md](file://docs/README.md)
- [docs/getting-started.md](file://docs/getting-started.md)
- [docs/content-authoring.md](file://docs/content-authoring.md)
- [docs/docs-shell.md](file://docs/docs-shell.md)
- [docs/VISION.md](file://docs/VISION.md)
- [package.json](file://package.json)
</cite>

## The Three Products in One Paragraph Each

Acrolls is an open-source publishing and documentation framework for SvelteKit that turns Markdown and mdsvex (`.md` / `.svx`) into publication-grade articles and a Fumadocs-class docs shell while leaving routing, deployment, content storage, and global site ownership to the host; it ships compile-time code highlighting, article primitives, generated navigation, SEO helpers, optional Pagefind-based search integration, static agent surfaces (`llms.txt`, `llms-full.txt`, page markdown), OG image card generation, and a CLI-led onboarding flow. Blume (useblume.dev) is an Astro+Vite, markdown-first docs framework whose `blume` CLI owns the site lifecycle (`init`/`dev`/`build`/`eject`), provides MDX-first authoring with a built-in component library (cards, steps, tabs, accordions, badges, code groups, frames, trees, type tables, live previews, diffs), islands auto-hydration, includes/transclusion, math, local/remote content sources, folder `meta.ts`, versioning with switcher, i18n locale routing, client search plus hosted/semantic backends, llms.txt + `.md` mirrors + hosted MCP server + agent skills + evals + translation, analytics, PDF/EPUB export, SEO layer, OpenAPI/AsyncAPI/GraphQL references, changelog/blog genres, and a registry of components and custom pages. Scribe (scribeit.dev) positions itself as a publishing layer for the site you already own: source stays Markdown/MDX in your repo, output is compiled at build time with no hosted CMS or runtime lock-in, it supports Next.js and Vite today, offers single-command onboarding via `bunx @scribe-sdk/cli@beta integrate`, and is currently in public beta with a GitHub-open roadmap.

## Comparison Method & Provenance

This comparison uses two evidence tiers so claims are traceable and not based on marketing copy alone.

- **Tier 1 — Repo evidence (Acrolls only):** All Acrolls capabilities listed here are derived from the repository’s published package contract, example host routes, documentation, and product/technical files. Where a capability exists, this document points to the specific file and section that describes or implements it. If a feature is absent from the repo, it is stated as “not found in the repo.”
- **Tier 2 — External, dated claims (Blume and Scribe only):** Blume and Scribe facts are captured from their public sites on 2026-09-06 and are attributed as external snapshots. They describe what those products advertise; they do not prove implementation depth inside Acrolls.

The comparison matrix below is therefore anchored by:
- Acrolls: packages, examples, docs, PRODUCT.md, llms.txt, and README.
- Blume/Scribe: public site descriptions captured on 2026-09-06.

No claim in this document implies Acrolls implements any Blume or Scribe capability unless the Acrolls repo explicitly contains it.

**Section sources**
- [README.md:1-75](file://README.md#L1-L75)
- [PRODUCT.md:1-521](file://PRODUCT.md#L1-L521)
- [llms.txt:1-114](file://llms.txt#L1-L114)
- [docs/README.md:1-108](file://docs/README.md#L1-L108)
- [docs/getting-started.md:1-424](file://docs/getting-started.md#L1-L424)
- [docs/content-authoring.md:1-319](file://docs/content-authoring.md#L1-L319)
- [docs/docs-shell.md:1-408](file://docs/docs-shell.md#L1-L408)
- [docs/VISION.md:1-38](file://docs/VISION.md#L1-L38)
- [package.json:1-39](file://package.json#L1-L39)

## Overlap Zone (shared philosophy)

All three products share a common axis: they target developers who want to publish Markdown/MDX-based content into a site they control, rather than handing content ownership to a hosted CMS.

| Axis | Acrolls | Blume | Scribe |
|---|---|---|---|
| Content authority | Source Markdown/mdsvex lives in your repo; Git is the CMS. | Markdown/MDX source stays authoritative and local in your repo. | Markdown/MDX source stays authoritative and local in your repo. |
| Build-time output | Compiles content into your SvelteKit app. | Compiles into an Astro+Vite site owned by the `blume` CLI. | Compiles into your existing Next.js or Vite site. |
| No hosted CMS lock-in | Not a CMS or host; you keep routing, auth, deployment, and content storage. | Hosted features exist but core positioning is a local-first docs framework. | Explicitly “no hosted CMS, no runtime lock-in.” |
| Onboarding surface | CLI-led guided onboarding (`onboard`, `integrate`, `validate`, `studio`). | `blume` CLI owns site lifecycle (`init`/`dev`/`build`/`eject`). | Single-command onboarding via `bunx @scribe-sdk/cli@beta integrate`. |
| Agent-facing surface | Static `llms.txt`, `llms-full.txt`, and per-page markdown endpoints wired as routes. | Includes `llms.txt`, `.md` mirrors, hosted MCP server, agent skills, and evals. | Public beta with a roadmap page; agent tooling claims are external. |

Where these three overlap most clearly is around “own your content, compile into your site” and keeping the developer’s repo as the source of truth.

**Section sources**
- [README.md:1-75](file://README.md#L1-L75)
- [PRODUCT.md:11-24](file://PRODUCT.md#L11-L24)
- [llms.txt:1-114](file://llms.txt#L1-L114)
- [docs/README.md:1-108](file://docs/README.md#L1-L108)
- [docs/getting-started.md:13-32](file://docs/getting-started.md#L13-L32)
- [docs/content-authoring.md:1-10](file://docs/content-authoring.md#L1-L10)

## Divergence Zone (irreducible differences)

### Ownership model and boundary

Acrolls deliberately splits responsibility: Acrolls owns mdsvex compilation semantics, Publication article UI, compile-time code highlighting, docs-shell chrome, and CLI tooling; the host owns routing, deployment, SEO policy, content location, global navigation, theme-toggle persistence, and analytics. Blume’s `blume` CLI owns the site lifecycle, which means the framework takes stronger control over the site structure than Acrolls does. Scribe positions itself as a thin publishing layer added to a site you already own, similar in spirit to Acrolls’ host-owned boundary but targeting Next.js and Vite rather than SvelteKit.

| Area | Acrolls | Blume | Scribe |
|---|---|---|---|
| Site owner | Host owns SvelteKit app; Acrolls integrates as a dependency. | `blume` CLI owns the site (`init`/`dev`/`build`/`eject`). | Publishing layer added to your existing Next.js or Vite site. |
| Framework stack | SvelteKit + Svelte 5 + mdsvex. | Astro + Vite + MDX. | Next.js and Vite. |
| Content dialect | Markdown + mdsvex (`.md` / `.svx`); Svelte components in `.svx`. | MDX-first. | Markdown/MDX. |
| Hosting/CMS stance | Not a CMS or host. | Docs framework with optional hosted features. | No hosted CMS, no runtime lock-in. |

**Section sources**
- [README.md:1-75](file://README.md#L1-L75)
- [PRODUCT.md:11-24](file://PRODUCT.md#L11-L24)
- [docs/README.md:1-108](file://docs/README.md#L1-L108)
- [docs/getting-started.md:13-32](file://docs/getting-started.md#L13-L32)

### What each product is for

- **Acrolls:** A SvelteKit publishing + docs framework for teams that already own a SvelteKit application and want production-grade article rendering, a docs shell, generated navigation, and CLI-led onboarding without adopting a hosted CMS.
- **Blume:** An Astro+Vite, markdown-first docs framework whose CLI owns the site and ships a broad set of built-in docs features, including a component library, versioning, i18n, search, analytics, exports, API references, and agent tools.
- **Scribe:** A publishing layer for the site you already own, focused on compiling Markdown/MDX into Next.js or Vite sites with minimal lock-in and simple onboarding.

**Section sources**
- [README.md:1-75](file://README.md#L1-L75)
- [PRODUCT.md:1-521](file://PRODUCT.md#L1-L521)
- [docs/VISION.md:1-38](file://docs/VISION.md#L1-L38)

### Capability divergence: what Acrolls has that Blume and Scribe do not emphasize

| Capability | Acrolls status | Evidence |
|---|---|---|
| Svelte-native interactive content in `.svx` | Implemented in code; Svelte components can appear in `.svx` content. | [docs/content-authoring.md:7-13](file://docs/content-authoring.md#L7-L13) |
| Publication article UI primitives | Implemented in code under `acrolls/svelte`. | [README.md:39-50](file://README.md#L39-L50) |
| Compile-time Shiki code frames with metadata | Implemented in code; fence metadata supported. | [PRODUCT.md:54-65](file://PRODUCT.md#L54-L65) |
| Generated docs tree from Markdown | Implemented in code via collection API and generated source. | [docs/getting-started.md:165-286](file://docs/getting-started.md#L165-L286) |
| Docs shell with sidebar, TOC, breadcrumbs, pager, persistence | Implemented in code under `acrolls/docs`. | [docs/docs-shell.md:1-408](file://docs/docs-shell.md#L1-L408) |
| Pagefind-based full-text search integration | Present but not exercised by a default dependency; host installs Pagefind and marks searchable pages. | [docs/docs-shell.md:297-343](file://docs/docs-shell.md#L297-L343) |
| SEO helpers and JSON-LD | Implemented in code; head metadata and JSON-LD emitted from content tree. | [docs/docs-shell.md:346-371](file://docs/docs-shell.md#L346-L371) |
| OG image cards | Implemented in code; card design and entry helpers provided. | [docs/docs-shell.md:373-407](file://docs/docs-shell.md#L373-L407) |
| Static agent surface (`llms.txt`, `llms-full.txt`, page markdown) | Implemented in code and wired as routes in the example host. | [llms.txt:1-114](file://llms.txt#L1-L114) |
| Corpus validation and migration mode | Implemented in code; authored vs migration modes with stable diagnostics. | [PRODUCT.md:231-301](file://PRODUCT.md#L231-L301) |
| Guided CLI onboarding | Implemented in code; read-only guidance with separate mutation command. | [PRODUCT.md:302-444](file://PRODUCT.md#L302-L444) |
| Theming kit via fractalthemer | Implemented in code; themes, auras, and theme picker available through styles. | [docs/VISION.md:29-32](file://docs/VISION.md#L29-L32) |

### Capability divergence: what Blume and Scribe advertise that are not found in the Acrolls repo

| Capability | Status in Acrolls | Notes |
|---|---|---|
| MDX authoring | Not found in the repo | Acrolls uses Markdown + mdsvex (`.md` / `.svx`), not MDX. |
| Built-in component registry (cards, steps, tabs, accordions, badges, code groups, frames, trees, type tables, live previews, diffs) | Not found in the repo | Acrolls ships article primitives and a docs accordion used for navigation; it does not ship a Blume-style content component registry. |
| Islands auto-hydration | Not found in the repo | Acrolls renders Svelte components through SvelteKit; hydration behavior follows Svelte/SvelteKit conventions. |
| Includes/transclusion | Not found in the repo | Acrolls relies on Markdown/mdsvex composition and Svelte components. |
| Math support | Not found in the repo | Not present in the documented pipeline. |
| Versioning with switcher | Not found in the repo | Not implemented in the repo. |
| i18n/locale routing | Not found in the repo | Not implemented in the repo. |
| RSS feed | Not found in the repo | Not implemented in the repo. |
| OpenAPI/AsyncAPI/GraphQL reference generator | Not found in the repo | Not implemented in the repo. |
| Hosted MCP server, Ask-AI, analytics | Not found in the repo | These are Blume-specific claims; Acrolls exposes static agent surfaces instead. |
| PDF/EPUB export | Not found in the repo | Not implemented in the repo. |
| Changelog/blog genre support | Not found in the repo | Not part of the documented content model. |
| Registry components and custom pages | Not found in the repo | Acrolls encourages host-owned customization rather than a registry. |

**Section sources**
- [docs/content-authoring.md:7-13](file://docs/content-authoring.md#L7-L13)
- [README.md:39-50](file://README.md#L39-L50)
- [PRODUCT.md:54-65](file://PRODUCT.md#L54-L65)
- [docs/getting-started.md:165-286](file://docs/getting-started.md#L165-L286)
- [docs/docs-shell.md:297-407](file://docs/docs-shell.md#L297-L407)
- [llms.txt:1-114](file://llms.txt#L1-L114)
- [PRODUCT.md:231-301](file://PRODUCT.md#L231-L301)
- [PRODUCT.md:302-444](file://PRODUCT.md#L302-L444)
- [docs/VISION.md:29-32](file://docs/VISION.md#L29-L32)

### How to Read the Child Comparisons

When comparing Acrolls to Blume or Scribe, use this reading order:

1. **Start with ownership.** Decide whether you want a framework that integrates into your existing SvelteKit app (Acrolls), a CLI-owned docs site (Blume), or a publishing layer added to Next.js/Vite (Scribe).
2. **Check the content dialect.** If your team writes Svelte components inside content, Acrolls `.svx` is the closest fit. If you prefer MDX with a broader built-in component library, Blume is positioned there. If you want a lightweight publish step into an existing Next.js/Vite site, Scribe is positioned there.
3. **Map required features against repo evidence.** For Acrolls, treat anything described in `packages/`, `examples/`, `docs/`, `PRODUCT.md`, and `llms.txt` as implemented or present in source. Treat everything else as host-owned work. For Blume and Scribe, treat public site claims as dated external information captured on 2026-09-06.
4. **Treat absences as design boundaries, not bugs.** Acrolls intentionally omits i18n routing, doc versioning, RSS, OpenAPI/GraphQL references, MCP servers, analytics, and PDF/EPUB export from its current scope. Those remain host responsibilities or future work.
5. **Use the CLI as the integration signal.** Acrolls’ `onboard`/`integrate`/`validate`/`studio` commands define how a host actually adopts the framework; Blume’s `blume` CLI defines how a site is created and run; Scribe’s `integrate` command defines how a publishing layer is added to an existing site.

**Section sources**
- [README.md:1-75](file://README.md#L1-L75)
- [PRODUCT.md:1-521](file://PRODUCT.md#L1-L521)
- [llms.txt:1-114](file://llms.txt#L1-L114)
- [docs/README.md:1-108](file://docs/README.md#L1-L108)
- [docs/getting-started.md:13-32](file://docs/getting-started.md#L13-L32)
- [docs/content-authoring.md:1-319](file://docs/content-authoring.md#L1-L319)
- [docs/docs-shell.md:1-408](file://docs/docs-shell.md#L1-L408)
- [docs/VISION.md:1-38](file://docs/VISION.md#L1-L38)
- [package.json:1-39](file://package.json#L1-L39)