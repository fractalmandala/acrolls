# Styles

## Modes

| CSS import | Sass layout import | When |
|---|---|---|
| `acrolls/styles/default.css` | `acrolls/styles/default.sass` | Greenfield articles; want full editorial scale |
| `acrolls/styles/foundation.css` | `acrolls/styles/foundation.sass` | Host already owns fonts, rhythm, colors |
| `acrolls/styles/colors.css` | `acrolls/styles/colors` | **Lean** light/dark colors — no fractalthemer, no extra deps |
| `acrolls/styles/theme.css` | `acrolls/styles/theme` | **Full** theme builder (fractalthemer: 40+ themes, auras, picker) |

**Two color tiers** (the theme builder is optional):

- **Lean** — `pnpm add acrolls`, import `colors`. Self-contained light/dark, no fractalthemer downloaded.
- **Full** — also `pnpm add fractalthemer`, import `theme` instead. Adds the named themes, auras, and picker. Switch any time; it's a superset of `colors`.

Import **one** of `colors` / `theme` per app — `theme` already includes the `colors` baseline.

```ts
import 'acrolls/styles/default.css';
// or
import 'acrolls/styles/foundation.css';
```

Or, in a layout script in a host that uses Sass:

```svelte
<script>
  import 'acrolls/styles/default.sass';
</script>
```

Docs shell has its own sheet (always import if you use DocsShell):

```ts
import 'acrolls/docs/styles.css';
```

```svelte
<script>
  import 'acrolls/docs/styles.sass';
</script>
```

---

## Token bridge

Acrolls reads host CSS variables when present:

| Host token | Used for |
|---|---|
| `--font-body` | Body font |
| `--font-heading` | Headings |
| `--font-mono` | Code |
| `--foreground` | Text |
| `--muted-foreground` | Secondary text |
| `--border` | Rules / frames |
| `--accent` | Links / accents |
| `--card` / `--muted` | Surfaces |
| `--background` | Article background |
| `--radius` | Corners |

Override Acrolls tokens directly on `.acrolls` or `.acrolls-docs-shell`:

```css
.acrolls {
  --acrolls-content-width: 68ch;
  --acrolls-accent: #0f766e;
}

.acrolls-docs-shell {
  --acrolls-docs-sidebar-width: 18rem;
  --acrolls-docs-toc-width: 14rem;
  --acrolls-docs-accent: #0f766e;
}
```

---

## Sass tokens

```sass
@use 'acrolls/styles/tokens' as *
@include acrolls-tokens()
```

Choose one format for each entrypoint: CSS imports or Sass layout imports. The Sass presets include
the same compiled style rules as their CSS counterparts; no separate CSS mechanics import is needed.
For a host-authored global Sass file, `@use 'acrolls/styles/default'` and
`@use 'acrolls/docs/styles'` are also supported.

> **Sass pipeline:** these Sass entrypoints are package subpath exports that forward the bundled
> `@acrolls/styles`, so compile them through your bundler. In Vite, register a Node package importer:
> `css.preprocessorOptions.sass.importers: [new NodePackageImporter()]`. The raw `sass` CLI with
> `--load-path` resolves neither the subpath exports nor the nested bundled dependency.

---

## Dark mode

Default/foundation respond to:

- `prefers-color-scheme`  
- `data-theme="light|dark"` on `.acrolls`  

Host owns the theme toggle; Acrolls styles follow. When you use the theming kit
below, dark mode is handled for you by the light/dark theme pairs.

---

## Theming kit

Acrolls ships a complete theming kit built on
[fractalthemer](https://www.npmjs.com/package/fractalthemer): 40+ curated
light/dark themes, aura gradient backgrounds, and a styled theme picker.
`acrolls/styles/theme` **forwards** fractalthemer, layers it over the lean
`colors` baseline, and bridges fractalthemer's semantic tokens onto the names the
Acrolls surfaces read.

fractalthemer is an **optional peer dependency** — it is *not* installed by
`acrolls` alone. Add it explicitly to use the builder:

```bash
pnpm add fractalthemer
```

If you only need light/dark, use `acrolls/styles/colors` instead and skip
fractalthemer entirely.

Import the theme surface once at the app root, next to `default`/`foundation`:

```ts
import 'acrolls/styles/theme.css';   // precompiled — nothing else required
```

or as Sass:

```sass
@use 'acrolls/styles/theme'
```

> **Sass consumers only:** `acrolls/styles/theme` resolves fractalthemer through
> `pkg:` URLs, so a Node package importer must be registered. In Vite:
>
> ```ts
> import { NodePackageImporter } from 'sass';
> export default defineConfig({
>   css: { preprocessorOptions: { sass: { importers: [new NodePackageImporter()] } } }
> });
> ```
>
> The precompiled `acrolls/styles/theme.css` needs no importer.

Pick a theme by setting fractalthemer's markers on `<html>` — a `theme-*` class
plus `data-theme`, with `data-mode` for the light/dark axis:

```html
<html class="theme-dracula-dark" data-theme="theme-dracula-dark" data-mode="dark">
```

fractalthemer's runtime components drive this for you:

```svelte
<script lang="ts">
  import { AuraBackground, ThemePicker } from 'fractalthemer';
</script>

<AuraBackground />
<ThemePicker />
```

Add fractalthemer's anti-flicker script to `app.html` to apply the saved theme
before hydration (see the fractalthemer README).

### Owning the palette

The Acrolls-authored baseline in `packages/styles/src/_colors.sass` sets only
colors, backgrounds, and borders (the no-theme-class `:root` fallback). Named
`theme-*` classes from fractalthemer override it. To customise, override
fractalthemer tokens (`--bg`, `--theme-color`, `--text-primary`, …) or the
Acrolls bridge names (`--background`, `--accent`, …) per selector.
