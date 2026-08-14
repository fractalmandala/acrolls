# Spec: unified CSS and Sass entrypoints

**Status:** Approved for implementation. No public compatibility release exists.

## Objective

Make `packages/styles/` the only authored Acrolls stylesheet source while allowing a host to
choose either precompiled CSS or indented Sass in its SvelteKit layout. The public `acrolls/*`
package remains the only documented consumer import surface.

## Assumptions

1. CSS and Sass entrypoints with the same logical name must render the same visual surface.
2. Sass entrypoints are full stylesheets, not merely token helpers.
3. The supported public paths are the CSS/Sass peers in the table below. The duplicate
   `acrolls/sass/*` and `acrolls/styles/sass/*` aliases are removed now because Acrolls has no
   public users beyond the kit starter.
4. Internal `@acrolls/*` packages remain bundled implementation units and are not documented as
   external consumer dependencies.

## Public contract

| Surface | CSS import | Sass import |
| --- | --- | --- |
| Mechanics only | `acrolls/styles/foundation.css` | `@use 'acrolls/styles/foundation'` |
| Editorial article defaults | `acrolls/styles/default.css` | `@use 'acrolls/styles/default'` |
| Docs shell | `acrolls/docs/styles.css` | `@use 'acrolls/docs/styles'` |
| Tokens/mixins only | n/a | `@use 'acrolls/styles/tokens'` |

Sass users may name the extension explicitly (`default.sass`); extensionless `@use` is the
documented form. CSS users import the explicit `.css` file. A host chooses one entrypoint per
surface and must not import both CSS and its Sass counterpart.

## Project structure

```text
packages/styles/src/
  foundation.sass     canonical mechanics source
  default.sass        canonical editorial source; uses foundation
  docs.sass           canonical DocsShell source
  _tokens.sass        canonical token map and mixin
packages/styles/
  foundation.css      generated CSS artifact
  default.css         generated CSS artifact
  docs.css            generated CSS artifact
  foundation.sass     Sass forwarding entrypoint
  default.sass        Sass forwarding entrypoint
  docs.sass           Sass forwarding entrypoint
  tokens.sass         Sass forwarding entrypoint
packages/acrolls/
  styles/*            generated public-package CSS/Sass relays
packages/docs/styles.*
                    generated public-package relays to shared docs styles
```

There is no `packages/styles/src` placeholder and no `packages/docs/src/lib/styles` directory.

## Commands

```bash
pnpm --filter @acrolls/styles build
pnpm --filter @acrolls/styles check
pnpm --filter @acrolls/docs build
pnpm --filter @acrolls/example-kit check
pnpm build:example
pnpm release:pack
pnpm verify:packed-consumer
```

## Code style

All authored Sass uses indented `.sass` syntax and semantic custom properties:

```sass
.acrolls
	color: var(--acrolls-foreground)
	background: var(--acrolls-background)
```

Generated CSS is not edited by hand. Public facade files contain only an import or `@forward` to
the canonical `@acrolls/styles` entrypoint.

## Testing strategy

- Compile each canonical Sass source to its published CSS counterpart and fail on a diff.
- Compile small consumer Sass fixtures against every public Sass entrypoint.
- Verify CSS imports resolve from the packed `acrolls` tarball.
- Run docs/example checks and production build so CSS import resolution is tested by Vite.

## Boundaries

- Always: retain the supported CSS paths, generate artifacts deterministically, update CLI/templates
  and every human-facing import example together.
- Ask first: add a Sass dependency or publish a package.
- Never: make an external host import a private `@acrolls/*` package, hand-edit generated CSS, or
  delete a source directory without first moving its contents.

## Success criteria

1. All authored styling lives in `packages/styles/src`.
2. Each `foundation`, `default`, and `docs` surface has working CSS and Sass consumer imports.
3. CSS and Sass imports compile to identical CSS for their corresponding surface.
4. CLI-generated integration and all docs show the CSS/Sass choice without recommending both.
5. Empty placeholder style directories are gone.
6. Packed public `acrolls` consumers resolve both CSS and Sass entrypoints.

## Approved removal

Remove `acrolls/sass/*` and `acrolls/styles/sass/*` now. They are duplicate pre-release aliases,
not a promised public compatibility contract.
