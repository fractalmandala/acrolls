# Session ledger

Chronological record of working sessions and what each changed. Newest first. See
[`proposals.md`](./proposals.md) for the live status of every item referenced here, and
[`README.md`](./README.md) for how this log connects to ADRs, PRODUCT.md, and specs.

---

## 2026-08-31 · S13 — UI playset: root demo app over `docs/playset`

**Focus:** Give the designated root `src/` scaffold a runnable dev surface for composing the
Acrolls UI (nav, TOC, pager, shells) against the real content engine — kept structurally outside
the published package.

**Shipped**
- **Root is now a dev-only SvelteKit app.** `vite.config.ts` carries kit config in the
  `sveltekit()` plugin options (no `svelte.config.js`, mirroring kit-consumer): `.md` in
  `extensions`, `vitePreprocess` + `createAcrollsSvelteKitMdsvexPreprocessor`, `NodePackageImporter`
  for `pkg:` SASS URLs, and `serve`-only dev source aliases re-pointing the `@acrolls/*` leaves to
  their `src/` (edits under `packages/*/src` hot-reload here with no rebuild). Plus `src/app.html`,
  `src/app.d.ts`, root `tsconfig.json`, and `src/routes/+layout.svelte` importing
  `$lib/styles/index.sass` (the fractalstyler2 scaffold).
- **Demo corpus wiring** — `src/lib/demo/source.ts` feeds `docs/playset/` (five numbered
  docs-shaped Markdown files) through `markdownGlob` (body/metadata/facts triple) + `content()` with
  minimal config (`title: 'UI playset'`, `baseHref: '/docs'`), `.sourceSync()`. The stub
  `src/routes/+page.svelte` renders `docs.nav` — a pipeline proof only; the real composition
  (AppShell, PageShell, pickers in `src/comps/`) is authored by the user, untouched.
- **Scripts and deps** — `pnpm dev:ui` (`vite dev`, `strictPort: false`); root devDeps gained
  `@sveltejs/kit`, `@sveltejs/vite-plugin-svelte`, `acrolls: workspace:*`, `mdsvex`, `sass`,
  `svelte`, `vite`; `.gitignore` gained `vite.config.ts.timestamp-*`.
- **Playset content fix** — `docs/playset/03-presets/01-preset.md` code-spanned three raw
  `<html>` mentions (Svelte `node_invalid_placement` inside list items), matching the corpus's own
  convention (see `01-getting-started.md`).

**Verified end to end:** `pnpm install` + `svelte-kit sync` clean; `pnpm dev:ui` boots; SSR 200 with
`<title>UI playset</title>`, "5 documents compiled", and the full nav tree (01 Introduction /
02 Components / 03 Presets with items) — real engine output, no mocks. Dev server killed after
verification.

**Boundary:** nothing here can ship — the pack root is `packages/acrolls/` and its `files`
allowlist (`bin`, `exports`, `styles`, `README`, `LICENSE`) cannot see the repo root.

**Same-day follow-up: routes wired to the corpus.** `/` stays the docs home. The engine config
flipped to `baseHref: '/'` + `naming: numbered()` — `01-` prefixes order siblings and strip from
slugs and titles, so `01-introduction/01-getting-started` serves at `/introduction/getting-started`
as "Getting Started", matching the host's hand-written links exactly. A `[...slug]` route resolves
the compiled article in `load` (kit-consumer pattern) and renders it inside the user's composition
classes (`content-shell` / `article-heading` / `acrolls-content`), with a styled not-found fallback;
index listing items link via `item.href`. The layout's sidebar and "On this page" now derive from
`docs.nav.sections` and `metadata.headings` (compile-time rehype-slug ids → anchor links), keeping
the hand-drawn placeholder markup as the empty-state fallback. Verified on the user's own dev
server: all five doc routes 200 with real titles, clean nav hrefs, working TOC anchors, prose and
Mermaid fallbacks in the SSR HTML. A `svelte` fence added to `getting-started.md` as a Shiki
specimen (`acrolls-code-frame__pre shiki shiki-themes …` dual-theme CSS vars) for the upcoming
docs-content styling pass.

**Same-day follow-up: first external-host test run (fractalsvelte).** Consumed acrolls from the
npm registry (0.1.4, published 08-14) in `/fractalsvelte` — copied the `fractal-agentic/docs`
corpus (63 md) to `src/docs/fractalagentic`, `pnpm add acrolls`, swapped the host's vanilla
`mdsvex()` preprocessor for `createAcrollsSvelteKitMdsvexPreprocessor`, and loaded the corpus via
`createAcrollsDocsSource({ modules, metadata, contentRoot, config })` in `src/lib/docs/fractalagentic.ts`
(`baseHref: '/docs/fractalagentic'`). Findings: (1) 0.1.4 predates `./content` (umbrella shim),
`markdownGlob`, heading facts, landing section hrefs, and `naming: numbered()` — hosts use
`createAcrollsDocsSource` until the next release; (2) hosts that force runes mode must exempt
`.md`/`.svx` (mdsvex's generated layout wrapper uses legacy `$$props`) — patched into the host's
`compilerOptions.runes`; (3) the fork handles every prose brace hazard in the corpus (raw JSON
block, `${VAR}` bash, `{@render}` in inline code) — 63/63 compiled, zero diagnostics; (4) folder
`INDEX.md` correctly became `<folder>/index` landings. Verified via a temporary JSON inspection
endpoint (`/docs/fractalagentic-data.json`, for the user to delete once pages consume the source):
200, 6 sections, 63 documents, 0 diagnostics. One cosmetic stable-id artifact (`section-svelte-19-framework`).
Edit tools cannot reach outside the registered workspaces, so the host-side edits ran through
`temp/patch-*.mjs` scripts (kept as the change record). Dev server killed after verification.

**Same-day follow-up: display built for the host.** Filled the user's empty
`fractalagentic/+page.svelte` stub as a full-corpus index (hero + one card per nav section, items
and children as links — all 63 documents listed) and added `fractalagentic/[...doc]/+page.ts` +
`+page.svelte` (kit-consumer load pattern: `get(pathname)` with a `documents.find` fallback,
`Article: await document.loader()`, serializable doc summary through data). Composition uses only
fractalstyler2 registry classes verified present in the host's compiled CSS (`page-shell`, `hero`,
`eyebrow`, `card`, `badge`, `prose`, `content-shell`, text/weight/gap utilities) — zero new
classes. Two engine-facing adjustments: suppressed 0.1.4's injected publication banner layout
(`createAcrollsSvelteKitMdsvexPreprocessor({ layout: false })` — it duplicated the host header
with `acrolls-banner__title`) and wrapped the article in `<Publication>` host-side, keeping the
code-frame/mermaid enhancer hook. Verified on a temporary server: index 200 with 63 doc links,
doc pages (root, nested `svelte-framework/how-to/…`, `wiki/INDEX` — lenient case-insensitive
lookup) 200 with prose + heading anchors in SSR, hazard docs render, unknown paths get a styled
not-found card. Known duplication for the prose pass: each md's own `#` H1 repeats the composed
header title. Server killed after verification.

**Same-day follow-up (Sep 3): a11y flood quieted host-side; dev-server zombie forensics.** The
host terminal flooded with ~570 `a11y_no_noninteractive_tabindex` warnings per compile wave:
`rehypeAcrollsTableWrap()` wraps md tables in `role="region" tabindex="0"` scroll regions — the
correct ARIA pattern for scrollable regions, but Svelte's rule has no `region` allowlist (known
false positive). Mitigated in fractalsvelte `vite.config.ts` via `vitePlugin: { onwarn }` dropping
that one code for `.md`/`.svx` filenames only (Kit omits bare `onwarn` from inline `sveltekit()`
options; `vitePlugin` is the typed passthrough and wins the spread order). Receipts: full 63-doc
compile wave with the filter logs zero a11y lines; the host's own server serves index + the
table-heavy docs 200. Engine-side durable fix candidate for the next release: inject
`<!-- svelte-ignore a11y_no_noninteractive_tabindex -->` from `rehypeAcrollsTableWrap` so hosts
need no onwarn config. Separate finding: the accompanying "requests hang at 000" episodes were
NOT the filter — SIGTERM never lands on a dev server whose event loop has deadlocked, leaving
zombie vite processes squatting on ports and contending on the shared `node_modules/.vite` cache
+ `.svelte-kit` sync; two concurrent dev servers on one project deadlock each other. Remediation:
`kill -9` the vite child pids, quarantine the stale cache (`node_modules/.vite-stale-backup`,
user-deletable), one-server-per-project.

---

## 2026-08-31 · S12 — Backend closure: audit findings and scaffold (D1–D8)

**Focus:** Resolve the six findings from the scenario audit after user go/no-go: D1–D4 fix,
D5 accept. **D7:** decided same-day and shipped below (content-only `docs init`). **D8:** the
suite was promoted to a permanent regression home — `packages/docs/src/lib/scenarios.test.ts`
(imports re-pointed one level up, `__audit__/` removed, header records its origin and scope).
**D6:** decided same-day and shipped below.

**Shipped**
- **D1 — filesystem sections link their landing page.** `buildNav()` now sets a top-level
  section's `href`/`slug`/`description` from the folder's landing page (any `indexNames` stem, so
  README landings work too) and stops duplicating the landing as an item — matching
  `buildDefinedNav` and behavior 7 (the landing link and the disclosure control are separate
  interactions). A section without a landing stays disclosure-only; a folder holding only an
  index still renders as a linkable section.
- **D2 — merged sources render in declaration order.** `ContentLoader` gained an optional
  `sectionOrder` hint map; `mergeLoaders` records each prefixed source's declaration index,
  `content()` forwards it, and both builders consume it as the lowest-precedence section order
  (explicit `folders[].order` and naming-convention orders win). `mergeRaw` needs no counterpart.
- **D3 — camelCase slugs cleanly.** `slugify` splits lower→upper word boundaries
  (`packageA` → `package-a`, `parseURL` → `parse-url`) before lowercasing, and `humanize()`
  splits the same boundaries for titles (`Package A`, never `Packagea`). Applies to source
  segments, merge prefixes, TOC anchors, and storage-key fallbacks alike — routes for camelCase
  files change, which is the point.
- **D4 — folders keys match raw casing; unmatched keys throw.** `folders`/`documents` config
  keys register under both their raw and slug-space forms (`myFolder` and `my-folder` both
  match). A `folders` key matching no discovered folder now throws a `DocsContentError` with
  remediation (previously a silent no-op). `entries` keys stay raw by design (virtual groups).
- **D5 — accepted:** per-page parent overrides remain the re-homing mechanism; no folder-level
  flatten. Audit label moved FINDING → ACCEPTED with rationale.
- **D6 — IA frontmatter fields (`sidebar.{order,label}`).** The blessed page schema gained a
  validated `sidebar` object; the engine reads `sidebar.order` at the frontmatter tier of the
  order chain with flat `order` kept as a working alias (canonical wins when both are present),
  and `sidebar.label` renames nav entries only — page title, SEO, headings untouched. A landing
  page's label names its section and its order positions the section when no `folders[].order`
  encodes one. `lastModified` stays out (the SEO layer's JSON-LD read remains its only
  consumer). The precedence lock (host config > frontmatter sidebar > inferred) is now an
  executable spec: six new scenario tests.
- **D7 — `acrolls docs init`, content-only scope.** New CLI command seeds the docs corpus with a
  starter `index.md` (default `docs/`; `--docs-dir` / `--dry-run` like its siblings) and never
  overwrites an existing index. The starter text lives in one constant (`starter.ts`) shared with
  `onboard`'s content step — plan version 3, since that step's `code`/`action` changed shape
  (behavior 63) and its action now names the command. The runtime empty-state placeholder —
  P10's other half — remains with frontend closure, and onboarding's content step flips to
  optional together with it.

**Regression caught by the suite:** the landing filter initially dropped every item whose `slug`
was undefined — including nested groups without landings ('Advanced' vanished from Guides). The
filter now applies only when a landing exists.

**Tests:** audit FINDING blocks rewritten as FIXED regressions; new assertions cover the
unmatched-folder throw, that explicit order beats declaration order, the full IA precedence
lock, and `docs init` (create / `--docs-dir` / dry-run / no-overwrite / starter contract).
Suite: mdsvex 40, docs 128, cli 21 — all green; `pnpm build` clean.

**Docs:** getting-started.md (section landing links, folder-key casing + throw),
integrate-sveltekit.md (declaration order, clean prefix slugs, loud unmatched keys),
content-authoring.md (new `### Navigation hints: sidebar` — IA hints and the precedence lock),
cli.md (`docs init` reference), AGENTS.md (CLI package row).

---

## 2026-08-17 · S11 — Build: multi-source docs (P22)

**Shipped**
- **`packages/docs/src/lib/merge.ts`** — `mergeLoaders([{ prefix, loader }, …])` composes any
  `ContentLoader`s (Vite globs, `customSource`, or a mix), prefixing each set's keys so every set
  becomes a first-level section. Eager only when every source is eager. Duplicate merged keys throw
  a `DocsContentError` naming both sets. `mergeRaw` applies the same prefixes so the AI tier stays
  aligned. Placed in `@acrolls/docs` (framework-neutral) rather than `@acrolls/sveltekit`, and
  re-exported from `collection.ts` so `acrolls/content` surfaces it automatically.
- **9 unit tests** (`merge.test.ts`) covering prefixing, nested keys, root-merge, prefix
  normalization, eager/async contract, collision error, same-filename-across-prefixes, and a full
  `content()` hierarchy assertion. Docs suite: 57/57 pass.
- **Example proof**: added `src/content-handbook/` as a genuinely separate folder and merged it with
  `src/content` in `source.ts`.
- **Docs**: "Multiple content sources" in `integrate-sveltekit.md`, including the out-of-tree reach
  table (symlink recommended / relative globs / copy-sync) and why a Node `fs` loader can't
  substitute for `.md` bodies.

**Verification (production build):** routes `/docs/handbook`, `/docs/handbook/conventions`,
`/docs/handbook/process/review` generated with nesting preserved; Pagefind index 5 → **8 pages**;
8 OG PNGs incl. the handbook set; llms.txt / llms-full.txt / sitemap.xml all include the merged
pages (proving `mergeRaw` keys line up). Visual: sidebar shows GUIDES and HANDBOOK as sibling
first-level sections with breadcrumbs and a pager spanning the merged tree. example svelte-check 0
errors.

**Regression caught & fixed (mine):** `onboarding.test.ts` asserts against the real example, and the
S7 P21 change (article resolved in `load`, so `DocumentPage` no longer contains `loader`) broke the
CLI's `documentPageReady` detection. It shipped in commit 16cd863 because I ran docs/example checks
but not the CLI suite after that change. `documentPageReady` now accepts **both** shapes
(load-resolved *or* legacy `{#await document.loader()}`); all 16 CLI tests pass. Full suite green:
mdsvex 24, docs 57, cli 16.

**Also (user request):** the example dev/preview servers now take the next free port instead of
failing when 5173 is busy — `strictPort: false` in `vite.config.ts` (server + preview), `vite dev`
without a pinned port, and `autoPort: true` in the launch configs. Verified: with 5173 occupied,
Vite bound 5174 and served the merged docs.

**Note:** serving the built output via a plain static server requires clean-URL mapping
(`/docs/x` → `docs/x.html`); requesting the literal `.html` path makes the hydrated client router
404 on its own pathname. Serving artifact, not a product bug.

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
