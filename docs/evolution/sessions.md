# Session ledger

Chronological record of working sessions and what each changed. Newest first. See
[`proposals.md`](./proposals.md) for the live status of every item referenced here, and
[`README.md`](./README.md) for how this log connects to ADRs, PRODUCT.md, and specs.

---

## 2026-08-17 · S10 — Scoped: multi-source docs (P22)

**Focus:** A use case not yet covered — docs that are NOT already consolidated in one folder.
Several separate sets (set1 / set2 / set3, each in its own location) should appear on one site
under a single docs hierarchy, each set becoming a first-level subsection.

**Finding (engine already supports it):** `content()` takes one `ContentLoader`, but a loader is
just `{ eager, list() }` returning `LoadedDocument[]`, and the nav tree is built purely by
splitting each document's `key` on `/` (`insertRecord` walks segments into a virtual root). There
is **no assumption that keys share a filesystem root**, and the first path segment becomes a
first-level section. So merging N sources with per-set key prefixes (`set1/…`, `set2/…`) yields
exactly the requested hierarchy, and breadcrumbs/pager/TOC/search/SEO/OG all keep working because
they consume the merged source.

**Gap:** no first-class merge helper. Proposed `mergeLoaders([{ prefix, loader }, …])` (concat +
prefix keys + collision error) plus a matching `mergeRaw` so the AI tier stays aligned.

**Real constraint (decides the design):** `.md` bodies must be compiled by Vite, and
`import.meta.glob` needs static literal patterns. Reach strategies for out-of-tree folders:
relative globs (needs `server.fs.allow` in dev), **symlink each set into one content dir
(recommended default)**, or a copy/sync step before build (most robust for CI / other repos). A
pure Node-`fs` loader cannot replace these for component bodies — only for raw-HTML rendering via
`renderAcrollsArticleHtml`.

**Status:** logged as P22, `proposed`. Spec first, then build — not started.

---

## 2026-08-17 · S9 — Santa-loop review of the P14–P19 batch

**Verdict: NICE** (Reviewer A: Opus = PASS; Reviewer B: Sonnet = PASS). Zero critical issues.

**Tooling caveat:** codex (capped to Aug 20) and gemini (daily quota exhausted) were both
unavailable, so Reviewer B fell back to a same-host Sonnet agent — context-isolated but NOT
cross-vendor model diversity this round.

**Both reviewers independently converged on two real accuracy nits (fixed):**
- `theme.sass` header comment and ADR-0004 described the layer order as scheme → fractalthemer →
  bridge, but the code emits scheme → **bridge** → fractalthemer. Harmless (bridge is pure `var()`
  indirection; fractalthemer never sets the shadcn names) but the prose overstated it — corrected.
- `@sveltejs/adapter-auto` remained a devDependency of the example though only adapter-static is
  used — removed.

**Non-blocking suggestions (tracked):** finalize the `_scheme.sass` dark seed values before release
(P14 note); keyed `{#each}` in DocsSearch; a diagnostic when raw source is missing for a known doc.

Post-fix: styles + example checks green.

---

## 2026-08-17 · S8 — Build: OG images (P17)

**Focus:** Build-time Open Graph images, one per page.

**Shipped**
- **`og.ts`** (`@acrolls/docs`): `acrollsOgCard()` returns a Satori element tree (plain objects —
  Acrolls takes NO satori dependency), plus `docsOgSlug` / `docsOgImagePath` / `docsOgEntries`.
- **SEO wiring**: `buildDocsSeo`/`DocsSeo` gained an `ogImage` input; precedence is per-page
  frontmatter `seo.image` > auto OG > site default. Setting it flips twitter card to
  `summary_large_image`.
- **Example**: `og/[slug]` prerendered endpoint renders each card via satori + `@resvg/resvg-js`
  with Inter (`.woff` from `@fontsource/inter`, read via `$app/server` `read()`); build-time
  devDeps only. Layout passes `docsOgImagePath(currentDoc)` to `DocsSeo`.

**Key finding:** nested OG slugs caused a SvelteKit prerender file-vs-directory conflict
(`/og/guides.png` + `/og/guides/…`). Fixed by **flattening** slugs (`/` → `--`) into a single
`og/[slug]` route.

**Verification:** docs + example `svelte-check` 0 errors; production build emitted 5 valid
1200×630 PNGs; card renders correctly (eyebrow/title/description/brand, Inter font); page
`og:image`/`twitter:image` resolve to absolute `https://example.com/og/<slug>.png` and the
twitter card is `summary_large_image`.

---

## 2026-08-16 · S7 — Build: Pagefind search (P15)

**Focus:** Full-text search over the prerendered docs.

**Shipped**
- **`DocsSearch.svelte`** (`@acrolls/docs`) — dynamically loads `/pagefind/pagefind.js` (Acrolls
  takes NO pagefind dependency), debounced query, renders results with Pagefind's `<mark>`
  excerpts, and degrades to a note when the index is absent (dev).
- **Indexing scope** in `DocsShell`: `data-pagefind-body` on the article, `data-pagefind-ignore`
  on sidebar/top/toc/pager (and the copy button), plus a `searchable` prop so a page can be
  excluded (honors frontmatter `search: { exclude: true }`).
- **Example wiring**: switched to `@sveltejs/adapter-static` + full prerender, added `pagefind`
  devDep and a `vite build && pagefind --site build` step, placed `<DocsSearch>` in the shell
  header, minimal search styles in `docs.sass`.

**Key finding (P21):** `{#await document.loader()}` in DocumentPage renders only the *pending*
branch during prerender, so the static HTML had an empty article — Pagefind indexed 0 pages, and
SSR/SEO/no-JS all lose the content. Fixed by resolving the article component in the universal
`load` (non-serializable is allowed in `+page.ts`) and rendering it synchronously. The
onboarding-recommended snippet still teaches `{#await}` and should be updated.

**Verification:** docs + example `svelte-check` 0 errors; production build indexed 5 pages / 242
words (article-only — chrome ignored); served `build/` and confirmed a live query returns a
highlighted result with the correct URL.

---

## 2026-08-16 · S6 — Build: optional theme (P14), site origin (P19), SEO (P16), AI static (P18)

**Focus:** Implement the mechanical / no-new-dep proposals toward public release.

**Shipped**
- **P14 — theme builder optional.** Color layer split into `_scheme.sass` (self-contained light+dark)
  + `_bridge.sass` (shadcn mapping). New lean surface `acrolls/styles/colors` (no fractalthemer);
  `acrolls/styles/theme` layers fractalthemer over it. fractalthemer → **optional peer dependency**
  on `@acrolls/styles` and the `acrolls` umbrella. ADR-0004 (supersedes ADR-0003's dep decision).
  build/check green; `colors.css` self-contained (134 lines), `theme.css` inlines fractalthemer.
  Dark palette = seed values to refine.
- **P19 — `site` origin.** `site?` on `DocsContentConfig` + `DocsNav`, surfaced as `docs.nav.site`.
- **P16 — SEO.** `seo.ts` (`buildDocsSeo` → title/description/canonical/robots/OG/Twitter + JSON-LD
  WebSite·TechArticle·BreadcrumbList; `docsSitemap`; `docsRobots`) + `DocsSeo.svelte`. Per-page
  `seo{}` frontmatter overrides. Verified in the example: absolute canonical/OG, correct JSON-LD
  per page type (WebSite on index, TechArticle on pages), sitemap.xml (namespace bug caught+fixed),
  robots.txt.
- **P18 — AI static tier.** `ai.ts` (`docsLlmsTxt`, `docsLlmsFullTxt`, `docsPageMarkdown`,
  `isAiExcluded`) + `CopyPageMarkdown.svelte` + a `markdownRaw` helper in `@acrolls/sveltekit` that
  keys raw source to `document.key`. Example routes `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`,
  `/robots.txt` (prerenderable). Server tier (Ask/MCP) still deferred.

**Verification:** `@acrolls/docs` svelte-check 0 errors; example `svelte-check` 0 errors (after
rebuilding docs + sveltekit dist so new exports resolve for consumers); live example confirmed all
endpoints + head tags. Copy button's clipboard write is blocked under the sandbox's programmatic
click (works on a real user gesture); raw-source path confirmed via llms-full output.

**Remaining from S5:** P15 (Pagefind) and P17 (OG images) — both need new dependencies + build
pipeline. P20 (frontmatter breadth) partially advanced (seo/ai frontmatter keys now read).

---

## 2026-08-16 · S5 — Pre-release capability decisions (search, SEO, OG, AI, frontmatter)

**Focus:** Lock the direction for the remaining public-release capabilities, benchmarked against
Blume (useblume.dev) and svocs (svocs.dev). Planning only — no code yet.

**Decisions (all logged as proposals; all optional, static-first add-ons):**
- **Search → Pagefind** (P15): post-build index over the prerendered output, chunked, scales
  10→10k, no backend. Preferred over Orama (monolithic, loads whole index client-side).
- **SEO → adopt Blume's shape** (P16): site `seo{}` + per-page `seo{}` frontmatter, JSON-LD
  (WebSite/TechArticle/BreadcrumbList — the last straight from `buildDocsCrumbs`), sitemap/robots.
  Depends on a new **`site` origin** config (P19), which is the first thing to build.
- **OG images → build-time** (P17): satori+resvg default (Takumi as native alt), fed from the
  `content()` tree, per-page `seo.image` override, default card = the Module Tile mark.
- **AI → two tiers** (P18): static now (llms.txt/full, per-page `.md` endpoint, copy-as-markdown,
  `ai.exclude`); server later (Ask chat, MCP server) gated on server output.
- **Frontmatter → keep title-required-authored, add Blume's optional breadth** (P20); lock IA
  precedence as host config > frontmatter `sidebar` > inferred.

**Through-line:** lean install stays lean; each capability bolts on when wanted — same model as
the theme builder (P14).

**Sources:** useblume.dev/docs (seo, ai, frontmatter), svocs.dev/docs/og-images, Pagefind vs Orama
comparisons.

---

## 2026-08-16 · S4 — Santa-loop adversarial review of the theming + base-href changeset

**Focus:** Run the dual-independent-reviewer convergence loop (santa-loop) over the S1–S3
changeset (theming kit, base-href fixes, evolution log) before shipping.

**Round 1 — NAUGHTY** (Reviewer A: Opus = PASS; Reviewer B: GPT‑5.4/codex = FAIL). Real findings,
all fixed:
- `theme.sass` comment overclaimed "every value is a runtime var()" while chart tokens are static
  → corrected the comment (chart palette is an intentional fixed categorical set) and added a
  fallback to `--input`.
- `check.mjs` fixture didn't smoke-test `foundation` as a consumer entrypoint → added `@use 'foundation'`.
- `proposals.md` P11 marked `shipped` but only exists in the prototype, not the CLI → downgraded to `proposed`.
- `styles.md` Modes table had a 2-column delimiter under a 3-column header (Opus) → fixed.
- Docs cited "42 themes" but the installed fractalthemer ships 41 `.theme-*` classes (Opus) → "40+" everywhere.
- Rejected one Opus hallucination (a non-existent inline layout block with cited line numbers past EOF).

**Round 2 — NICE** (Reviewer A: Sonnet = PASS, verified by compiling + running CLI tests 16/16;
Reviewer B: Gemini = PASS). Two residual suggestions applied: a leftover "42" in the `theme.sass`
header comment, and aligning `examples/kit-consumer/src/routes/docs/+layout.svelte` with the
snippets (derive `showToc`/`showPager` from `docs.nav.baseHref`; verified: index hides both,
nested shows TOC).

**Tooling caveat:** codex hit its usage cap (resets Aug 20) and the Opus subagent hit a session
cap mid-round-2, so round 2 used Sonnet (Reviewer A) + Gemini (Reviewer B) — still two
context-isolated, model-diverse reviewers. `gemini-2.5-pro` is retired; use the CLI default model.

**Outcome:** NICE, but **not pushed** — git actions held for explicit user approval.

**Follow-ups:** add a CLI test asserting the generated layout derives `isIndex` from
`docs.nav.baseHref` (P13); formalize the theming behavior in PRODUCT.md (P2).

---

## 2026-08-16 · S3 — Base href is the variable; no hardcoded routes

**Focus:** Ensure the docs route is always expressed as the configurable base href, and no example
or generated code hardcodes a literal route in logic.

**Shipped**
- Fixed the real footgun — index-detection logic that hardcoded `/docs` — to derive from the
  source's own `docs.nav.baseHref`, in: `docs/snippets/docs-layout.svelte`,
  `docs/snippets/docs-generated-layout.svelte`, the inline example in `docs/docs-shell.md`, and the
  CLI's generated layout in `packages/cli/src/onboarding.ts` (`docsLayoutSnippet` no longer bakes a
  `baseHref` literal). CLI tests still pass (16/16).
- Prose now uses base-href language instead of a fixed route: `getting-started.md` route mapping,
  `docs-shell.md` index-page section. Runnable commands keep `/docs` as the labelled default.
- Prototype's Option A layout snippet updated to mirror the generated code (derived `isIndex`).

**Principle recorded:** runnable commands/examples may show `/docs` as the *default* value, but any
logic or behavioral prose must reference the base href variable, never a literal route.

---

## 2026-08-16 · S2 — Onboarding prototype, feature exploration, empty-corpus policy

**Focus:** Whether onboarding can be visual; several docs-layout/authoring features; what to do
about the manual "create first content" step.

**Built**
- Interactive onboarding prototype (visual + terminal views, live-regenerating snippets) as a
  Claude artifact. Not in-repo; it demonstrates the `acrolls onboard --json` plan as a UI.
- Extended the prototype's docs-layout step to show **both** layout paths: Option A `DocsShell`
  and Option B `DocsSidebar` composed inside a host-owned grid
  (`DocsSidebar` + `DocsBreadcrumbs` + `DocsToc` + `DocsPager` + `buildDocsCrumbs` + `docsPager`).

**Decisions**
- **Visual onboarding modal** is feasible as a thin client over the existing
  `acrolls onboard --json` plan (per-step `completed` detection already exists). → `proposed`
- **Agent-generated frontmatter**: a new `acrolls frontmatter --from-report --agent <name>` that
  feeds the validator's `ACROLLS_FRONTMATTER_REQUIRED` hits to an agent to draft
  `title`/`description` before install. → `proposed`
- **Clamped shell width**: a `clamped` prop + `--acrolls-docs-max-width` token on `DocsShell`
  (default ≈1440–1536px, centered); `unclamped` = today's full-width behavior. → `proposed`
- **Docs vs section page type**: a per-route `$state` store so any page can opt out of the
  three-column layout into a single centered column (backed by existing shell props). → `proposed`
- **Docs source location**: no change — CLI default stays `project/docs` with `/docs` baseHref;
  location is a glob, not enforced. → `clarified`
- **Empty-corpus handling**: replace the manual "create first content" step with (1) a **runtime
  empty-state** placeholder that renders when the corpus resolves to zero documents (no files
  written) and (2) an **optional `acrolls docs init` scaffold** that writes a real starter
  `index.md`. Rejected the "auto-create `BLANK.md`" idea: `BLANK.md` is an ordinary page → junk
  `/docs/blank` route and rejected by authored mode (`ACROLLS_TITLE_REQUIRED`); `index.md` infers
  its title and maps to the base route. Onboarding stays guidance-only, so any file write is
  explicit/opt-in. → `accepted` (to build)

**Findings**
- An empty corpus does not crash: `content().sourceSync()` yields `documents: []`, empty nav, and
  zero routes; the root renders "page not found" rather than erroring. So the content step's real
  value is a working first page, not crash-prevention — making it safe to make optional.

**Follow-ups**
- Build the empty-state placeholder in `DocumentPage`/`DocsShell` and the `acrolls docs init`
  scaffold; update the onboarding "create content" step to "optional".
- Write ADRs for the accepted layout/onboarding decisions if/when they graduate from `proposed`.

---

## 2026-08-16 · S1 — Package-editing distance and the theming kit

**Focus:** Editing inside `examples/kit-consumer` felt disconnected from the real `acrolls`
packages; and standing up Acrolls' own theming.

**Shipped**
- **Dev source aliases** in [`examples/kit-consumer/vite.config.ts`](../../examples/kit-consumer/vite.config.ts):
  `serve`-only aliases from the six `@acrolls/*` leaf packages to their `src/`, so editing any
  `packages/*/src` file is live via HMR with no rebuild. `pnpm build` still exercises real `dist/`.
  Added an `acrolls-kit-consumer` launch config.
- **Theming kit built on fractalthemer** (depend + forward, chosen over vendoring):
  [`packages/styles/src/theme.sass`](../../packages/styles/src/theme.sass) forwards fractalthemer's
  `themes` + `auras` + `theme-picker` via `pkg:` URLs; acrolls owns a colors-only `:root` baseline
  ([`_colors.sass`](../../packages/styles/src/_colors.sass)) plus a shadcn-name bridge. New public
  surface `acrolls/styles/theme` (+ `theme.css`). `fractalthemer` is now a dependency of
  `@acrolls/styles` and the `acrolls` umbrella; build/check use `--pkg-importer=node`; the example
  registers `NodePackageImporter`. Verified: switching a fractalthemer theme re-themes acrolls
  content end to end.
- **Docs updated** for the theme surface: `styles.md`, `styles-entrypoints-spec.md`,
  `packages/styles/README.md`, `integrate-sveltekit.md`, `local-install.md`, `packages.md`,
  `VISION.md`.

**Decisions**
- Theming = **depend + forward** fractalthemer (single source of truth), not vendor/copy. → `shipped`
- Layout + sidebar/nav typography need **no move** — already in `packages/styles/src/docs.sass`;
  only the app-generic utilities stay example-side. → `clarified`

**Follow-ups**
- Author the markdown-content prose typography (`_prose.sass` or extend `default.sass`) — still
  unwritten; owner-authored.
- Add a PRODUCT.md behavior and an ADR for the theming kit (see [ADR-0003](../adr/0003-fractalthemer-theming-kit.md)).
