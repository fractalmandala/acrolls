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

## Next to build (accepted, not yet implemented)

- **P10** — empty-state placeholder in `DocumentPage`/`DocsShell` (no writes) + `acrolls docs init`
  scaffold; update onboarding "create content" step to optional.

## Awaiting a decision (proposed)

- **P5–P8** — each is scoped and prototyped/described; needs a go/no-go to move to `accepted`.
- **P4** — needs the prose typography authored, then documented.
