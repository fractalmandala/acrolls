# Self-serve integration checklist

Print or keep open while wiring a host.

Recommended first: use the CLI-led drop-in. From the existing host root, run
`acrolls onboard --docs-dir docs --base-href /docs` for exact file paths, snippets, cautions,
and deployment checks. Use `acrolls onboard --check` to rescan completed checkpoints or `--json`
when another UI/agent will render the flow.

## Acrolls monorepo

- [ ] Clone/path known: `______________________________`
- [ ] `pnpm install && pnpm build` succeeds
- [ ] `packages/mdsvex/dist/index.js`, `packages/svelte/dist/index.js`, and `packages/docs/dist/index.js` exist

## Host app

- [ ] SvelteKit 2.62+ or 3 + Svelte 5
- [ ] `pnpm add acrolls@latest`
- [ ] `pnpm exec acrolls --version` resolves from the host
- [ ] No direct `@acrolls/*`, `file:`, or cloned-source dependencies in the host
- [ ] Host `pnpm install` finishes after package add

## Config

- [ ] `vite.config.ts` → `createAcrollsMdsvexPreprocessor({…})` in the `sveltekit()` options
- [ ] `extensions` includes `.svelte`, `.md`, `.svx`
- [ ] Optional `*.md` / `*.svx` module declarations in `app.d.ts`

## Article path

- [ ] At least one `.md` route content file
- [ ] Page wraps with `<Publication>`
- [ ] Imports `default.css` **or** `foundation.css` (once)

## Docs path (optional)

- [ ] Choose a filesystem content root (`docs/`, `content/`, `posts/`, etc.)
- [ ] Configure the public `baseHref` (`/docs`, `/content`, `/posts`, etc.) independently
- [ ] Generated source is one `content({ loader: markdownGlob({ body, metadata, facts, root }), config })`
- [ ] `body`, `metadata`, and `facts` globs use the identical pattern string (lazy `body` = `import: 'default'`; eager `metadata` = `import: 'metadata'`; eager `facts` = `import: '__acrollsDocument'`)
- [ ] Drafts or unpublished pages use `filter` (unreachable), not `hidden` (unlisted but routeable)
- [ ] Secret or embargoed content is kept out of the globbed directory entirely — `filter` is a publication boundary, not a confidentiality one
- [ ] `DocsShell` receives generated `docs.nav` (or a deliberately manual `DocsNav`)
- [ ] `docs/index.md` has a root `src/routes/docs/+page` that renders slug `''`, or the host intentionally provides its own overview
- [ ] Use a `[...slug]` catch-all route when nested folders are allowed
- [ ] Catch-all `entries()` excludes the empty root slug
- [ ] `docs/+layout.svelte` uses `DocsShell` + `acrolls/docs/styles.css`
- [ ] Article pages still use `Publication`
- [ ] Index disables TOC/pager if desired

## Verify

- [ ] `pnpm dev` — article renders
- [ ] `pnpm build` — host production build succeeds
- [ ] Code fence shows copy after click
- [ ] Docs root and one nested document both return 200
- [ ] Docs: sidebar sections collapse/expand and **persist** after reload
- [ ] Docs: nested child highlights and opens ancestors
- [ ] Docs: group landing links and any badges display as configured
- [ ] Docs: TOC lists h2/h3 and tracks scroll
- [ ] Browser console has no runtime errors during docs navigation
- [ ] CLI: `validate` exits 0 on a real page

## If blocked

- [ ] Minimal repro route only
- [ ] Read [troubleshooting.md](./troubleshooting.md)
- [ ] Compare `examples/kit-consumer` in the Acrolls repo
- [ ] After an Acrolls package update: rebuild Acrolls → `pnpm install` in host → restart `pnpm dev`
