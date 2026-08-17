# ADR-0004: Theme builder is an optional add-on

**Date**: 2026-08-16
**Status**: accepted (supersedes the dependency decision in [ADR-0003](./0003-fractalthemer-theming-kit.md))
**Deciders**: Amrit, Claude

## Context

[ADR-0003](./0003-fractalthemer-theming-kit.md) made `fractalthemer` a hard runtime
**dependency** of `@acrolls/styles` and the `acrolls` umbrella. That forced every consumer —
including one who only wants basic docs wiring with light/dark — to install fractalthemer's full
theme engine. fractalthemer is a standalone package, so this coupling is avoidable.

Investigation also surfaced a gap: a lean install (foundation/default/docs, no theme surface) had
**no built-in light/dark colors** — `foundation.sass` reads `--background`/`--foreground` with
`transparent`/`currentColor` fallbacks, so real colors came only from fractalthemer or host-defined
tokens. So "lean = docs + light/dark without fractalthemer" was not actually true.

## Decision

Make the theme builder an **optional add-on** with three color tiers:

1. **Mechanics + typography** — `foundation` / `default`; host owns colors (unchanged).
2. **Lean color scheme** — a new self-contained surface `acrolls/styles/colors` providing a
   light **and** dark baseline of the fractalthemer-shaped tokens (`--bg`, `--text-primary`,
   `--theme-color`, `--md-*`, …) plus the shadcn-name bridge. **No fractalthemer.** This is the
   "docs + light/dark" tier.
3. **Theme builder** — `acrolls/styles/theme` forwards fractalthemer (40+ themes, auras, picker)
   layered over the same baseline. Requires fractalthemer, now declared as an **optional peer
   dependency** of `@acrolls/styles` and `acrolls`.

Internally the color layer is split into `_scheme.sass` (self-contained light/dark baseline) and
`_bridge.sass` (shadcn-name mapping); `colors.sass` = scheme + bridge, `theme.sass` = scheme +
bridge + fractalthemer forwards. Emission order keeps the `scheme` baseline before the forwarded
`.theme-*` classes so named themes win the cascade; the bridge's position is immaterial because it
maps via runtime `var()` and never sets the raw tokens the theme classes define.

## Alternatives Considered

### Alternative 1: Keep fractalthemer a hard dependency (ADR-0003)

- **Pros**: One install; theme surface always available.
- **Cons**: Forces the full theme engine on lean consumers who never import it.
- **Why not**: Unnecessary footprint; fractalthemer is standalone and opt-in-able.

### Alternative 2: A separate `@acrolls/theme` package

- **Pros**: Leanest core — the compiled `theme.css` wouldn't ship in `@acrolls/styles` at all.
- **Cons**: More packages and moving parts for ~5% more benefit.
- **Why not**: Optional-peer + the lean `colors` surface achieves the goal at far lower cost;
  revisit the separate package only if package weight becomes a real complaint.

## Consequences

### Positive

- `pnpm add acrolls` installs no fractalthemer; the lean `colors` surface gives working
  light/dark. `pnpm add fractalthemer` any time unlocks `acrolls/styles/theme`.
- Non-breaking: nothing is publicly released yet, and this only reduces the lean footprint.

### Negative

- The precompiled `theme.css` (fractalthemer inlined) still ships inside `@acrolls/styles`; it is
  inert unless imported. (See Alternative 2 if this ever needs to go.)
- Importing `acrolls/styles/theme` (sass) without fractalthemer installed fails at compile — but
  that path is gated behind the explicit opt-in, and the CSS build is self-contained.

### Risks

- The lean dark palette is currently seed values; final colors are an authoring decision.
