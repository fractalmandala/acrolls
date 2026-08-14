# Troubleshooting

## Installed package is stale

Update the public package from the host root and restart the development server:

```bash
pnpm up acrolls@latest
pnpm exec acrolls --version
pnpm dev
```

Confirm the host declares only `acrolls`, not direct `@acrolls/*` or `file:` dependencies.

---

## `workspace:*` / `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

The host installed an internal package or local source manifest. Remove direct `@acrolls/*`
and `file:` dependencies, then install the public package:

```bash
pnpm add acrolls@latest
```

Use only `acrolls/*` imports.

---

## Root docs page is blank or 404

The generated source maps `docs/index.md` to the root docs slug (`''`). Create
`src/routes/docs/+page.ts` that returns `{ slug: '' }` and render the shared `DocumentPage`
with `slug=""`. Do not redirect the root page to an arbitrary child. If the host needs a
custom overview instead, omit `docs/index.md` and build that overview directly in
`src/routes/docs/+page.svelte`.

---

## Navigation key warning or duplicate keyed item

Update `acrolls` using the routine above. If it remains, confirm two
Markdown sources do not resolve to the same route (for example both a folder landing and an
explicit entry pointing at the same public URL). `createDocsContentSource` reports duplicate
routes with both source keys.

---

## `Logical expressions and coalesce expressions cannot be mixed`

The host is using an older Acrolls release. Update the package and restart the dev server.

```bash
pnpm up acrolls@latest
pnpm dev
```

---

## Code blocks break Svelte compile (`Unexpected token` near `{`)

Fixed in current highlighters by escaping `{` / `}` for Svelte. Rebuild `acrolls/mdsvex`.

## Markdown examples break Svelte compile (`<svelte:head>`, `Result<T, String>`, or `{ name: string }`)

Use `createAcrollsMdsvexPreprocessor()` in the host's `preprocess` array. It wraps a narrow
set of Svelte-shaped literals in `.md` prose before mdsvex parses them. `.svx` files are not
normalized because they may contain intentional components.

Run the validator to see source locations:

```bash
acrolls validate ./path/to/page.md
acrolls validate ./path/to/page.md --strict
```

Default validation reports and safely normalizes findings. Strict validation fails so a host
can require authors to add explicit Markdown inline-code spans. Mermaid blocks are excluded
from this normalization and are handled by the dedicated Mermaid guard.

## A large corpus produces dozens of Svelte errors

Do not fix the compiler output one file at a time first. That usually means an existing
Markdown corpus has entered the Svelte module graph without a corpus preflight.

Run the directory validator:

```bash
acrolls validate ./docs --mode migration --on-invalid error-page --report acrolls-report.json
```

Then configure the host preprocessor with the same policy:

```js
createAcrollsMdsvexPreprocessor({ onInvalidDocument: 'error-page' })
```

This keeps malformed `.md` documents routable as explicit diagnostic pages while valid pages
continue to build. If the corpus must be clean, use `--on-invalid fail` or authored mode.
Do not use this policy to hide `.svx` errors: `.svx` remains executable Svelte and fails fast.

---

## Code has no copy buttons

`Publication` must wrap the content (it mounts enhancers). CSS alone is not enough.

---

## TOC empty

- Headings must be inside the shell content (children of `DocsShell`).  
- Need `h2`/`h3` (default levels).  
- Wait for client hydrate; TOC scans the DOM.  
- Index routes often hide TOC with `showToc={false}`.  

---

## Accordion always closed after refresh

- `persistOpen={true}` (default).  
- Check `storageKey` on `DocsNav` is set and stable.  
- Private browsing may block `localStorage`.  

---

## `integrate` says `Host: node`

You ran the CLI outside a SvelteKit app (e.g. Acrolls monorepo root). `cd` into the host project.

---

## Host has no `svelte.config.js`

That is expected in SvelteKit 3 and supported from SvelteKit 2.62 onward. Pass the Acrolls
extensions and preprocessor to `sveltekit()` in `vite.config.ts` as described in
[Integrate into SvelteKit](./integrate-sveltekit.md). Use `acrolls onboard` for the merge;
`integrate --yes` will refuse to rewrite an existing Vite config.

---

## Styles look unstyled / double fonts

- Import **one** of foundation/default.  
- Import `acrolls/docs/styles.css` if using the shell.
- Avoid importing Acrolls CSS twice.  
- For foundation mode, set host tokens (`--foreground`, etc.).  

---

## Tables: a11y warning on `tabindex`

Known Svelte a11y warning on scroll regions with `role="region"`. Harmless for v0; scroll keyboard access is intentional.

## Deprecated `<slot>` warning in `PublicationLayout`

`PublicationLayout.svelte` still uses the classic `<slot />` contract because mdsvex injects
compiled article content through it. Svelte 5 reports this as a deprecation warning, not a
compile failure. Keep the wrapper until mdsvex exposes an equivalent snippet contract; the
warning does not indicate malformed Markdown or a deployment blocker.

---

## mdsvex `metadata` name clash

Do not use frontmatter key `metadata:`. Use `reading:` or `meta:`.

---

## Studio preview ≠ production SVX

Studio HTML pipeline strips `<script>` blocks. Use `pnpm dev` for full SVX components.

---

## Still stuck

1. Minimal repro: one route + one `.md` + `Publication` + `default.css`  
2. `validate` that file  
3. Rerun `pnpm exec acrolls onboard --check` and compare each generated checkpoint with the host
