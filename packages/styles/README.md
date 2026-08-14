# acrolls/styles

Canonical CSS and indented Sass styles for Acrolls.

## Modes

```js
import 'acrolls/styles/foundation.css'; // mechanics only
import 'acrolls/styles/default.css';    // foundation + editorial scale
```

## Sass

```sass
@use 'acrolls/styles/default'
@use 'acrolls/styles/tokens' as *
@include acrolls-tokens()
```

Import the Sass preset from a Svelte layout script as `import 'acrolls/styles/default.sass'`.
In a host-authored global Sass entry, use `@use 'acrolls/styles/default'`. Do not also import the
matching CSS preset.

## Tokens

Set `--acrolls-*` (or host fallbacks like `--foreground`, `--accent`) on `.acrolls` or an ancestor.
