# Test install: Acrolls → fractaldesign

**Date:** 2026-08-17 · **Target:** `/Users/amrit/fractalmandala/fractaldesign` · **Mode:** test run —
issues are *documented, not live-fixed*.

## Target environment

| | fractaldesign | acrolls example (kit-consumer) |
|---|---|---|
| SvelteKit | ^2.63.0 | ^2.62.0 |
| Svelte | ^5.56.1 | ^5.38.1 |
| Vite | **^8.0.16** | ^7.1.3 |
| vite-plugin-svelte | **^7.1.2** | ^6.1.3 |
| TypeScript | **^6.0.3** | ^5.9.2 |
| adapter | adapter-vercel | adapter-static |
| sass | ^1.102.0 ✓ | ✓ |
| mdsvex | **absent** | ✓ |
| fractalthemer | `link:../fractalthemer` ✓ | ✓ |

Also: project has its own `pnpm-workspace.yaml`, `runes: true` compilerOptions, only 2 routes
(`+page.svelte`, `+layout.svelte`).

## Sources requested

| # | From | Section |
|---|---|---|
| 1 | `/Users/amrit/fractalmandala/acrolls/docs` (25 md) | `acrolls` |
| 2 | new folder in fractaldesign | `fractalicons` |
| 3 | `/Users/amrit/fractalmandala/fractalthemer/docs` (17 md) | `fractalthemer` |
| 4 | `/Users/amrit/fractalmandala/fractaldesign/docs` (21 md) | `posts` |

Sources 1 and 3 are **outside the project root** → exercises the P22 out-of-tree path.

---

## Issues log

### ISSUE-01 — Published `acrolls@0.1.4` is stale but shares the local version number · **HIGH**

npm has `acrolls@0.1.4`; the local package is *also* `0.1.4`, but local carries ~9 sessions of
unpublished work (P14–P22). The published tarball has no `./styles/colors`, no `./styles/theme`,
no `DocsSeo`/`DocsSearch`/`og`/`ai`/`mergeLoaders`. So `pnpm add acrolls@latest` silently installs
old code under a version the repo treats as current.

**Impact:** any consumer following the documented install path gets a package that cannot do what
the docs describe. Blocks a real-world install.
**Workaround for this test:** pack the local build and install the tarball.
**Fix (later):** version bump + publish before the docs claim these features; consider a
`release:check` that fails when local exports differ from the published version.

### ISSUE-02 — `acrolls --version` reports the wrong version · **MEDIUM**

`pnpm exec acrolls --version` → **`0.1.1`**, but the installed package is `acrolls@0.1.4`. The CLI
prints `@acrolls/cli`'s own internal version instead of the public package version.

**Why it matters:** `docs/README.md` (third-host trial, step 5) explicitly tells users to
"confirm the installed version with `pnpm exec acrolls --version`" — the documented verification
step returns a number that matches nothing the user installed, so a stale install can't be
diagnosed this way.
**Fix (later):** print the `acrolls` umbrella version (or both, labelled).

### ISSUE-03 — Onboarding plan is stale vs shipped features · **HIGH**

`acrolls onboard` still emits the pre-P14 11-step plan. It has **no step and no `--flag`** for
anything shipped in S6–S11:

- multi-source docs (P22) — the plan assumes **one** `--docs-dir`; my install has **4 sources**,
  which the guided flow simply cannot express
- lean `colors` vs full `theme` styles (P14) — step 3 offers only `foundation`/`default`
- search (P15), SEO/sitemap/robots (P16), OG images (P17), AI/llms (P18) — absent entirely
- `site` origin (P19) — not asked for, though SEO/OG/llms need it

**Impact:** a user following the official onboarding ends up with a docs site missing every
capability the docs advertise, and no path to a multi-source setup.
**Fix (later):** extend the plan with optional add-on steps + a multi-source variant; the JSON
plan already supports arbitrary steps, so this is plan-authoring, not engine work.

### ISSUE-04 — Onboarding step 4 teaches the `{#await}` renderer (P21 regression path) · **HIGH**

The `document-page` step still emits the in-component `{#await document.loader()}` shape. Per S7,
that renders only the pending branch during prerender, so **the article is empty in the static
HTML** — Pagefind indexes 0 pages and SEO/no-JS readers get nothing. The example was fixed in S7;
the onboarding snippet that every new host copies was not.

**Impact:** every host onboarded via the CLI starts with broken prerendered content.
**Fix (later):** switch the generated `+page.ts`/`DocumentPage` snippets to the load-resolved shape
(already tracked as P21's remaining half).

### ISSUE-05 — `README.md` / `INDEX.md` are not recognised as folder landing pages · **MEDIUM**

Index detection is exact-lowercase (`content.ts`: `rawSegments.at(-1) === 'index'`). Importing
real-world folders, **every section landing 404'd** except the one I authored with a literal
`index.md`:

| section | landing file present | `/docs/<section>` |
|---|---|---|
| acrolls | `README.md` | 404 → became a leaf page `/docs/acrolls/readme` titled "Readme" |
| fractalthemer | `INDEX.md` | 404 → became `/docs/fractalthemer/index` |
| acrolls/adr, acrolls/evolution | `README.md` | 404 |
| fractalicons | `index.md` (authored) | 200 ✓ |

**Not a broken-link bug:** the sidebar doesn't link section roots and breadcrumbs render those
crumbs as plain text, so the engine correctly avoids linking a missing landing page. It's an
**import-ergonomics** problem: `README.md` is the near-universal convention and is silently demoted
to an oddly-titled leaf.

**Workaround (documented, verified working):** `folders: { acrolls: { index: 'README' },
fractalthemer: { index: 'INDEX' } }` → both became 200.
**Fix (later):** case-insensitive index matching and/or auto-detect `readme`/`index` as a folder
landing; at minimum emit a diagnostic ("folder X has README.md but no index — set folders.X.index").

### ISSUE-06 — Frontmatter-less corpora produce filename-derived titles · **MEDIUM (expected, but costly)**

Most imported files have no frontmatter (acrolls/docs: 25 files, nearly all bare; fractalthemer
specs likewise). In migration mode they're admitted with titles inferred from filenames:
`0004-theme-builder-optional-addon` → **"0004 Theme Builder Optional Addon"**, `README` → "Readme".

Working as designed, but it makes a real imported corpus look unfinished, and there is no bulk
remedy in the product today. **This is the concrete case for P6** (`acrolls frontmatter
--from-report --agent`), which would go from "nice-to-have" to "needed for any real import".

### ISSUE-07 — Symlinking a docs folder into `src/` breaks the host's `pnpm check` · **HIGH**

The P22 docs recommend symlinking out-of-tree sets into one content dir. Doing exactly that put
`acrolls/docs/snippets/*` — illustrative **`.ts` and `.svelte`** files — inside the host's `src/`
tree, where `svelte-check`/tsc compiles them as project code:

```
ERROR src/content/acrolls/snippets/page-load.ts "Cannot find module './$types'"
ERROR src/content/acrolls/snippets/vite.config.ts "Cannot find module '@sveltejs/adapter-auto'"
ERROR src/content/acrolls/snippets/docs-layout.svelte "Cannot find module '../../lib/docs/source'"
… 8 errors → `pnpm check` exits 1
```

The docs site itself works fine — this is purely the host's typecheck/lint surface being polluted
by non-Markdown files that ride along with the symlink.

**Impact:** the recommended strategy breaks CI for any host whose docs folder contains code
samples (very common). Nothing in our docs warns about it.
**Workarounds (untested here):** `exclude: ["src/content"]` in tsconfig; symlink into a
non-`src/` location; or symlink only `**/*.md`.
**Fix (later):** document the tsconfig exclude alongside the symlink recommendation, and prefer a
content dir **outside** `src/` in the guidance.

### ISSUE-08 — Source-safety fails on **nested** object literals → whole build dies · **CRITICAL**

`pnpm build` aborted on a single Markdown file. Minimal repros via `acrolls validate`:

| # | construct | result |
|---|---|---|
| E | bare **flat** braces in prose — `folders: { a: 1 }` | ✅ normalized (safety works) |
| F | bare **nested** braces — `folders: { a: { b: 1 } }` | ❌ **rejected** |
| A | nested braces inside a *single-line* inline code span | ✅ ready |
| B/G | nested braces in an inline code span **spanning a newline** | ❌ **rejected** |
| D | *flat* braces spanning a newline | ✅ ready |

**Root cause:** the source-safety matcher is not brace-balanced — it handles only flat `{ … }`.
On nested literals it emits `source-safety/object-literal` warnings (claiming it wrapped them) yet
still produces invalid Svelte → `mdsvex/compile-error: Expected token }`.

**Impact:** highest-severity finding. Default `onInvalidDocument: 'fail'` means *one* prose
sentence containing a nested object literal **fails the entire production build**. Documentation
corpora are full of nested config examples — the file that broke this build was an ordinary
`.md` note. The safety net reports success while leaving the document broken.

**Related:** error positions point at *generated* output, not source. The build reported
`test-install-fractaldesign.md:240:108` for a **144-line** file, so the author cannot locate the
offending text from the build error. `acrolls validate` was needed to identify the file at all.

### ISSUE-09 — `acrolls validate` does not traverse symlinks (silent false pass) · **HIGH**

Pointed at the recommended symlinked content dir, preflight reported success while seeing almost
nothing:

```
acrolls validate ./src/content   → 1 discovered · 1 ready · 0 rejected
find -L src/content -name '*.md' → 65 files
```

Vite's glob **does** follow the symlinks (all 65 pages built), so preflight and build disagree:
the tool that exists to catch bad documents before the build silently skipped 64 of 65 — including
the one document that later killed the build (ISSUE-08).

**Impact:** preflight gives false confidence exactly in the setup our own P22 docs recommend.
**Fix (later):** follow symlinks when walking (`fs.realpath` / `follow: true`), and/or warn when a
scanned directory contains unfollowed symlinks.

### ISSUE-10 — Nothing paints the page background; the article floats as a white card · **MEDIUM (docs gap)**

The docs site renders as a white article card on an unpainted page, with near-black sidebar text
over the browser's own dark chrome — it looks broken.

**Diagnosis (measured, not assumed):** the tokens are *correct and internally consistent* —
`html.theme-light-default`, `data-mode=light`, `--bg:#fff`, `--text-primary:#0f172a`,
`--background:#fff`. Walking the DOM found **zero** elements painting any background:
`html`/`body` are transparent and no aura element renders (bgStyle `plain`). fractalthemer's
`index.css` has no `body`/`html` rule — it supplies tokens only — and fractaldesign has no global
stylesheet at all. So the page is genuinely unpainted, and the browser's backdrop shows through.
Acrolls' `.acrolls` article *does* paint `var(--acrolls-background)`, hence the white card.

**Correction to an earlier hypothesis in this run:** I first assumed `acrolls/styles/colors.css`
was overriding fractalthemer's theme on source order. Removing it changed nothing — the tokens
were never wrong. Recording this because the wrong theory is the tempting one.

**Impact:** a first-time integrator sees a broken-looking site and has no signal about why. Our
styles docs say "host owns the theme toggle; Acrolls styles follow" but never state the host must
paint `body { background: var(--bg); color: var(--text-primary) }`.
**Fix (later):** document the host's background responsibility in `styles.md`; consider having the
docs shell paint its own surface so a bare host degrades gracefully.
**Note:** `acrolls/styles/colors.css` is redundant (not harmful) when the host already loads
fractalthemer — both define the same baseline. Guidance should say: host owns fractalthemer →
use `theme`/neither, not `colors`.

### ISSUE-11 — Eager metadata glob puts the whole corpus in the server bundle · **LOW/scale**

With 65 documents the built server chunk `source.js` is **1,489 kB (339 kB gzip)** — the eager
`{ eager: true }` modules glob pulls every document's metadata (and the preprocessor facts) into
one chunk. Fine at this size; worth watching for large corpora.

### ISSUE-12 — Add-ons need prerender, which adapter-vercel doesn't do by default · **MEDIUM (docs gap)**

Pagefind (P15) indexes prerendered HTML, and OG images (P17) are prerendered endpoints. This host
uses `adapter-vercel` with no `prerender` setting, so `/docs/**` is SSR — search and OG images
would silently produce nothing. Nothing in the add-on docs states "these require prerendered
output"; the Pagefind section shows adapter-static without saying it is a *requirement*.
**Fix (later):** state the prerender requirement explicitly in the search/OG docs, and have
`DocsSearch` note the missing-index case more loudly in production.

---

## Outcome

**The install works.** All four sources are live under one hierarchy at `/docs` — 65 pages,
sections **Acrolls · Fractalicons · Fractalthemer · Posts** — with sidebar, breadcrumbs, TOC,
pager, code frames (Wrap/Copy), and SEO head tags. Production build succeeds against **Vite 8 /
vite-plugin-svelte 7 / TypeScript 6 / Svelte 5.56**, all newer than Acrolls' own toolchain — no
compatibility problems surfaced.

**What it took beyond the documented happy path:** `onInvalidDocument: 'error-page'` (ISSUE-08),
`folders[].index` for `README`/`INDEX` (ISSUE-05), dropping `colors.css` (ISSUE-10), and knowing
that the guided CLI could not express this setup at all (ISSUE-03).

### Severity roll-up

| ID | Severity | One-line |
|---|---|---|
| 08 | **CRITICAL** | Nested object literals in prose break the whole build; safety net reports success |
| 01 | HIGH | Published `acrolls@0.1.4` is stale under the same version number |
| 03 | HIGH | Onboarding plan predates P14–P22; can't express multi-source or any add-on |
| 04 | HIGH | Onboarding still teaches the `{#await}` renderer that breaks prerender |
| 07 | HIGH | Symlinked docs put `.ts`/`.svelte` samples in `src/` → host `pnpm check` fails |
| 09 | HIGH | `acrolls validate` doesn't follow symlinks → silent false pass (missed ISSUE-08) |
| 02 | MEDIUM | `acrolls --version` prints the CLI's version, not the package's |
| 05 | MEDIUM | `README.md`/`INDEX.md` not recognised as folder landings |
| 06 | MEDIUM | Frontmatter-less corpora get filename-derived titles (case for P6) |
| 10 | MEDIUM | Nothing paints the page background; docs never say the host must |
| 12 | MEDIUM | Search/OG silently need prerendered output |
| 11 | LOW | Eager glob → 1.5 MB server chunk at 65 docs |
