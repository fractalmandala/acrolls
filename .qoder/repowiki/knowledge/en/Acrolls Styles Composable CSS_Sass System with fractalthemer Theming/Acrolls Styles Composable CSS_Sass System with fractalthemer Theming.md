---
kind: frontend_style
name: 'Acrolls Styles: Composable CSS/Sass System with fractalthemer Theming'
category: frontend_style
scope:
    - '**'
source_files:
    - packages/styles/src/_scheme.sass
    - packages/styles/src/_bridge.sass
    - packages/styles/src/foundation.sass
    - packages/styles/src/default.sass
    - packages/styles/src/docs.sass
    - packages/styles/src/theme.sass
    - packages/styles/src/_tokens.sass
    - packages/styles/README.md
    - packages/styles/package.json
    - examples/kit-consumer/vite.config.ts
    - packages/svelte/src/lib/Banner.svelte
    - docs/adr/0002-cube-composable-styling-system.md
    - docs/adr/0003-fractalthemer-theming-kit.md
---

## What system/approach is used

Acrolls ships a **composable, responsibility-based styling system** built on indented Sass and published as both `.sass` and precompiled `.css` entrypoints. The design follows the planned CUBE CSS methodology (documented in ADR-0002) — separating composition, utilities, blocks, and exceptions — while the current implementation exposes four semantic entrypoints that hosts import independently:

| Entrypoint | Responsibility |
|---|---|
| `acrolls/styles/foundation.css` | Reset + primitive tokens (`--acrolls-*`) for typography, code frames, tables, figures, callouts, banners, zoomable images, Mermaid, print & reduced-motion handling |
| `acrolls/styles/default.css` | Foundation + editorial scale (typography sizes, spacing, banner headline sizing) scoped under `.acrolls` |
| `acrolls/styles/colors.css` | Lean light/dark color scheme only — no fractalthemer dependency; sets `--bg`, `--text-primary`, `--theme-color`, etc. on `:root` and overrides via `[data-mode='dark']`, `[data-theme='dark']`, `.dark` and `prefers-color-scheme: dark` |
| `acrolls/styles/theme.css` | Full theming kit — forwards `fractalthemer` themes, auras, and theme-picker partials over the same baseline |

The system uses **CSS custom properties (design tokens)** as the primary extension surface. Hosts set `--background`, `--foreground`, `--accent`, `--card`, `--border`, `--radius`, etc. on `.acrolls` or an ancestor to override defaults. An optional SASS token map (`_tokens.sass`) exposes `$acrolls-tokens` and an `acrolls-tokens()` mixin that writes `--acrolls-*` variables.

## Key files and packages

- `packages/styles/src/_scheme.sass` — self-contained light/dark color scheme (the "lean tier"); defines `--bg`, `--text-primary`, `--theme-color`, `--md-*` prose tokens and dark overrides guarded by `prefers-color-scheme` and `[data-mode]`/`.dark` selectors.
- `packages/styles/src/_bridge.sass` — maps fractalthemer's shadcn-style tokens (`--bg`, `--text-primary`, …) onto the shadcn names (`--background`, `--card`, `--muted`, `--accent`, …) that Acrolls surfaces consume; every mapping uses a runtime `var(--token, OpenColor fallback)` so theme switching stays dynamic.
- `packages/styles/src/foundation.sass` — base reset, token definitions, code-frame, table, figure, zoom dialog, banner, callout, video, Mermaid, print styles, and `prefers-reduced-motion` handling.
- `packages/styles/src/default.sass` — editorial typography scale, spacing, banner headline sizing, container widths, and dark shadow tweaks.
- `packages/styles/src/docs.sass` — docs-shell layout (sidebar + main + optional TOC grid), sidebar tree/accordion, breadcrumbs, pager, search UI, and responsive breakpoints at 1100px (TOC drops) and 900px (sidebar collapses to drawer with backdrop).
- `packages/styles/src/theme.sass` — layering manifest: imports `scheme`, then `bridge`, then forwards `pkg:fractalthemer/styles/themes`, `auras`, `theme-picker`; ensures `.theme-*` classes are emitted after the baseline so named themes win by source order.
- `packages/styles/package.json` — declares `exports` for all six entrypoints (`.css` and `.sass` variants plus `./tokens`), marks `fractalthemer` as an optional peer dependency, and lists side-effectful CSS files.
- `examples/kit-consumer/vite.config.ts` — demonstrates the required Node package importer setup (`sass.importers: [new NodePackageImporter()]`) needed when consuming `acrolls/styles/theme` from Sass, because it resolves `pkg:` URLs into node_modules.
- `packages/svelte/src/lib/Banner.svelte` (and other components under `packages/svelte/src/lib/`) — Svelte 5 publication primitives that render markup using Acrolls BEM-like class names (`acrolls-banner`, `acrolls-callout`, `acrolls-code-frame`, `acrolls-figure`, `acrolls-video`, `acrolls-mermaid`) consumed by the style layers.

## Architecture and conventions

1. **Layered composition, not monoliths.** The README explicitly documents four import modes (`foundation`, `default`, `colors`, `theme`). Hosts compose only what they need rather than importing one large stylesheet. The build scripts emit matching `.css` files alongside the `.sass` sources so consumers can choose either path.

2. **Token-driven customization.** All visual decisions flow through CSS custom properties. `foundation.sass` reads `--background`, `--foreground`, `--accent`, `--card`, `--border`, `--radius`, etc. with sensible defaults. `default.sass` adds `--acrolls-*` variables for content width, gutter, radius, body size, leading, heading sizes, code block padding, and table cell padding. Consumers override these on `.acrolls` or any ancestor.

3. **Two-tier theming model.**
   - **Lean tier** (`colors.css` / `_scheme.sass`): zero dependencies; provides light mode on `:root` and dark mode via `@media (prefers-color-scheme: dark)` plus explicit `[data-mode='dark']`, `[data-theme='dark']`, `.dark` overrides.
   - **Full tier** (`theme.css`): depends on `fractalthemer` (optional peer dependency). It forwards fractalthemer's curated themes, aura backgrounds, and theme-picker partials via `pkg:` URLs. The bridge layer isolates Acrolls surfaces from direct fractalthemer token names, so the two systems coexist without collision.

4. **BEM-like naming within the `.acrolls` scope.** Component classes use a consistent `block__element--modifier` pattern scoped under `.acrolls` (e.g. `.acrolls-docs-shell`, `.acrolls-docs-shell__sidebar`, `.acrolls-docs-tree__link--group`, `.acrolls-banner__title`, `.acrolls-code-frame__header`). This keeps component styles isolated from host stylesheets.

5. **Responsive strategy.** Breakpoints are defined inline in `docs.sass`: 1100px hides the TOC column; 900px collapses the sidebar into a fixed drawer with a backdrop overlay and a menu button. Typography uses `clamp()` for fluid scaling (heading sizes, gutter, section spacing, code block padding). Container queries (`container-type: inline-size`) are used where appropriate.

6. **Accessibility and progressive enhancement.** `foundation.sass` includes `prefers-reduced-motion` (disables transitions/animations), `print` media rules (hides code-frame actions and heading anchors, adds link hrefs), focus-visible outlines on interactive elements, and `visually-hidden` utility.

7. **Sass build contract.** The `theme.sass` layer requires a Node package importer to resolve `pkg:fractalthemer/*` URLs; the example Vite config shows the exact setup. Precompiled `.css` outputs ship fractalthemer inlined so CSS-only consumers avoid the runtime dependency.

## Conventions and constraints

- **Import only one of `foundation`/`default`/`colors`/`theme` per role.** The README states: "Import the Sass preset from a Svelte layout script as `import 'acrolls/styles/default.sass'`. In a host-authored global Sass entry, use `@use 'acrolls/styles/default'`. Do not also import the matching CSS preset." This prevents duplicate token emission.
- **Theme selection via HTML markers.** Theme switching uses fractalthemer's `<html>` markers: `class="theme-*"`, `data-theme`, or `data-mode`. The lean scheme additionally honors `[data-mode='dark']`, `[data-theme='dark']`, and `.dark`.
- **Only colors/backgrounds/borders live in the scheme layer.** Per `_scheme.sass` comments, type scales, spacing, radius, and layout remain the consumer's concern — the scheme deliberately avoids owning non-color design tokens.
- **Data visualization palette is theme-independent.** The bridge layer hardcodes chart colors (`--chart-1` through `--chart-5`) from Open Color so series colors stay stable across themes.
- **Component classes must be prefixed with `.acrolls`.** All Acrolls components render inside a `.acrolls` root; styles target `.acrolls .block__element` to avoid leaking into host pages.
- **fractalthemer is an optional peer dependency.** `theme.css` requires it; `colors.css` does not. Consumers who only need light/dark should import `acrolls/styles/colors` instead of `theme`.
- **CUBE migration is documented but not fully implemented.** ADR-0002 records the decision to rework toward CUBE (layout, color-theme, typography responsibilities) and to retire `default`/`foundation` names after review; the current codebase still uses those names as compatibility entrypoints.