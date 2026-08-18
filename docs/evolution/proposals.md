# Proposals board

Live status of every idea and decision from the [session ledger](./sessions.md). See
[`README.md`](./README.md) for status definitions and the graduation workflow.

| # | Item | Status | Session | Result / artifacts |
| --- | --- | --- | --- | --- |
| P1 | Dev source aliases (instant package editing) | `shipped` | S1 | `examples/kit-consumer/vite.config.ts`, launch config |
| P2 | Theming kit on fractalthemer (`acrolls/styles/theme`, depend+forward) | `shipped` | S1 | `packages/styles/src/{theme,_colors,_palette}.sass`; docs updated; ADR-0003; **PRODUCT behavior: TODO** |
| P3 | Layout/sidebar/nav typography location | `clarified` | S1 | already in `packages/styles/src/docs.sass`; no move |
| P4 | Markdown-content prose typography (`_prose.sass`) | `proposed` | S1 | owner-authored; wire off `--md-*` tokens |
| P5 | Visual onboarding modal (thin client over `onboard --json`) | `proposed` | S2 | prototype built (artifact) |
| P6 | Agent-generated frontmatter (`acrolls frontmatter --from-report --agent`) | `proposed` | S2 | builds on `acrolls validate --report` |
| P7 | Clamped shell width (`clamped` prop + `--acrolls-docs-max-width`) | `proposed` | S2 | Option A only; small CSS + prop |
| P8 | Docs vs section page-type store | `proposed` | S2 | per-route `$state`; backed by existing shell props |
| P9 | Docs source location default | `clarified` | S2 | stays `project/docs`; not enforced |
| P10 | Empty-corpus: runtime empty-state + optional `acrolls docs init` scaffold | `accepted` | S2 | replaces manual content step; `index.md` not `BLANK.md`; guidance-only preserved |
| P11 | Step 8 dual layout options in onboarding (DocsShell / DocsSidebar) | `proposed` | S2 | demonstrated in the prototype only; the CLI plan still emits one layout — fold into `onboarding.ts` + docs when built |
| P12 | Base href as the variable — no hardcoded routes in logic/prose | `shipped` | S3 | `docs.nav.baseHref`-derived `isIndex` in snippets, `docs-shell.md`, `onboarding.ts`, example docs layout; base-href prose; CLI tests pass |
| P13 | CLI test asserting generated layout derives `isIndex` from `docs.nav.baseHref` | `proposed` | S4 | regression guard so a future edit can't reintroduce a hardcoded route |
| P14 | Theme builder as an optional add-on (fractalthemer → optional peer dep) + lean self-contained light/dark baseline surface | `shipped` | S5→S6 | `acrolls/styles/colors` (lean light/dark) + `theme` (full); `_scheme`/`_bridge` split; fractalthemer optional peer on styles + umbrella; ADR-0004; build/check green (colors.css self-contained, theme.css inlines fractalthemer). Dark palette = seed values to refine |
| P15 | Search via Pagefind (post-build index over static output; optional add-on; honor `search.exclude`) | `shipped` | S5→S7 | `DocsSearch.svelte` (dynamic-loads `/pagefind/pagefind.js`, degrades gracefully); `data-pagefind-body`/`-ignore` scoping in DocsShell + `searchable` prop; example on adapter-static + `pagefind` devDep. Verified live: index 5 pages/242 words, query returns highlighted results. `search.tags` filters = follow-up |
| P16 | SEO layer — site `seo{}` config + per-page `seo{}` frontmatter + JSON-LD (WebSite/TechArticle/BreadcrumbList from `buildDocsCrumbs`) + sitemap.xml/robots.txt | `shipped` | S5→S6 | `seo.ts` (`buildDocsSeo`/`docsSitemap`/`docsRobots`) + `DocsSeo.svelte`; per-page `seo{}` frontmatter; verified in example (canonical, og, JSON-LD, sitemap, robots) |
| P17 | OG images — build-time PNG per page (satori+resvg), fed from the `content()` tree, per-page `seo.image` override; optional | `shipped` | S5→S8 | `og.ts` (`acrollsOgCard` element tree — no satori dep — + `docsOgImagePath`/`docsOgSlug`/`docsOgEntries`); example `og/[slug]` prerendered endpoint (satori+resvg+Inter woff devDeps); og/twitter:image wired, twitter card → summary_large_image. Verified: 5 valid 1200×630 PNGs. Flat slugs avoid prerender conflicts |
| P18 | AI features — static tier now (llms.txt + llms-full.txt, per-page `.md`, copy-as-markdown, `ai.exclude`); server tier later (Ask chat, MCP) | `shipped` (static tier) | S5→S6 | `ai.ts` + `CopyPageMarkdown.svelte` + `markdownRaw` helper; example routes /llms.txt, /llms-full.txt; server tier still deferred |
| P19 | `site` origin config primitive (absolute URLs for canonical/OG/sitemap/llms) | `shipped` | S5→S6 | `site?` on `DocsContentConfig` + `DocsNav`, surfaced as `docs.nav.site`; used by SEO + AI helpers |
| P20 | Frontmatter breadth — adopt Blume's optional nested fields (`seo`/`search`/`ai`/`draft`/`date`/`lastModified`/`sidebar`) while keeping title-required-in-authored | `proposed` | S5 | **decision to lock:** IA precedence = host config > frontmatter `sidebar.{order,label,…}` > inferred |
| P21 | Resolve article component in route `load` (not `{#await}`) so pages prerender with content | `shipped (example); onboarding TODO` | S7 | required for SSR/SEO/Pagefind — `{#await document.loader()}` renders only the pending branch during prerender. Fixed in example; `onboarding.ts` docs`+page`/DocumentPage snippets still teach `{#await}` and should switch |
| P22 | Multi-source docs — merge N separate content folders into one hierarchy, each set a first-level section (`mergeLoaders`/`mergeRaw` + key prefixing) | `shipped` | S10→S11 | `packages/docs/src/lib/merge.ts` (framework-neutral ContentLoader composition), re-exported via `acrolls/content` + `acrolls/docs`; collision → `DocsContentError`; 9 unit tests. Example merges `src/content` + `src/content-handbook`; verified: 8 pages indexed, handbook routes/nav/crumbs/pager/OG/llms/sitemap all correct. Docs in integrate-sveltekit.md incl. out-of-tree reach strategies |

## Next to build (accepted, not yet implemented)

- **P10** — empty-state placeholder in `DocumentPage`/`DocsShell` (no writes) + `acrolls docs init`
  scaffold; update onboarding "create content" step to optional.

## Awaiting a decision (proposed)

- **P5–P8** — each is scoped and prototyped/described; needs a go/no-go to move to `accepted`.
- **P4** — needs the prose typography authored, then documented.
