# ADR-0003: Theming kit built on fractalthemer (depend + forward)

**Date**: 2026-08-16
**Status**: accepted
**Deciders**: Amrit, Claude

## Context

Acrolls needed its own theming kit — light/dark themes, backgrounds, and a theme picker — rather
than leaving all color decisions to each host. [fractalthemer](https://www.npmjs.com/package/fractalthemer)
(same author) already provides 40+ curated light/dark themes, aura backgrounds, a styled theme
picker, and a semantic token contract (`--bg`, `--text-primary`, `--theme-color`, …), and ships
its sass partials behind its package `exports` (`./styles/*`). Acrolls' style surfaces already
read shadcn-style names (`--background`, `--card`, `--accent`, `--border`), so a bridge onto
fractalthemer's tokens was the missing seam — it lived only in the example, not the package.

The question was how fractalthemer's theme system should live inside Acrolls.

## Decision

Acrolls **depends on and forwards** fractalthemer instead of vendoring it. A new public surface,
`acrolls/styles/theme` (with a precompiled `theme.css`), `@forward`s fractalthemer's `themes`,
`auras`, and `theme-picker` partials via `pkg:` URLs, adds an Acrolls-owned **colors-only** `:root`
baseline (`_colors.sass`) as the no-theme-class fallback, and bridges fractalthemer's semantic
tokens onto the shadcn names Acrolls surfaces consume. `fractalthemer` is a dependency of
`@acrolls/styles` and the public `acrolls` package; the build/check scripts pass
`--pkg-importer=node`, and sass-source consumers register a Node package importer (precompiled CSS
consumers need nothing).

## Alternatives Considered

### Alternative 1: Vendor / copy fractalthemer's sass into Acrolls

- **Pros**: Self-contained; no fractalthemer dependency; can carve out a colors-only token file freely.
- **Cons**: ~3,500 lines duplicated across two of the same author's packages; the copies drift.
- **Why not**: Single source of truth and update propagation outweigh self-containment here.

### Alternative 2: Hand-rolled Acrolls themes (no fractalthemer)

- **Pros**: No external dependency; full control.
- **Cons**: Reinvents a solved, mature system; ongoing maintenance of themes/auras/picker.
- **Why not**: fractalthemer already exists and is owned by the same author.

## Consequences

### Positive

- Acrolls ships a complete theming kit; switching any fractalthemer theme re-themes Acrolls content.
- No duplication; fractalthemer stays the theme engine and source of truth.
- Colors-only baseline honors the "only colors/backgrounds/borders" constraint; non-color scales
  stay the host's concern.

### Negative

- Sass-source consumers must register `NodePackageImporter` for the `pkg:` URLs (documented).
- Adds a runtime dependency to the `acrolls` package.

### Risks

- fractalthemer's partial layout / token names are now an implicit contract — mitigated by the
  bridge layer isolating Acrolls surfaces from direct fractalthemer token names.
