# Session ledger

Chronological record of working sessions and what each changed. Newest first. See
[`proposals.md`](./proposals.md) for the live status of every item referenced here, and
[`README.md`](./README.md) for how this log connects to ADRs, PRODUCT.md, and specs.

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
