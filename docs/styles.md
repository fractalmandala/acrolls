# Styles

## Modes

| CSS import | Sass layout import | When |
|---|---|
| `acrolls/styles/default.css` | `acrolls/styles/default.sass` | Greenfield articles; want full editorial scale |
| `acrolls/styles/foundation.css` | `acrolls/styles/foundation.sass` | Host already owns fonts, rhythm, colors |

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

---

## Dark mode

Default/foundation respond to:

- `prefers-color-scheme`  
- `data-theme="light|dark"` on `.acrolls`  

Host owns the theme toggle; Acrolls styles follow.

---

## Themes roadmap

Polished multi-theme packs are planned (see VISION). Today you theme via CSS variables + host design system.
