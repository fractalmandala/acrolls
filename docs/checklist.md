# Self-serve integration checklist

Print or keep open while wiring a host.

## Acrolls monorepo

- [ ] Clone/path known: `______________________________`
- [ ] `pnpm install && pnpm build` succeeds
- [ ] `packages/*/dist` or package `styles.css` present

## Host app

- [ ] SvelteKit 2 + Svelte 5
- [ ] `pnpm add file:…/mdsvex file:…/svelte file:…/styles file:…/docs`
- [ ] `pnpm add -D mdsvex`
- [ ] **Not** adding `@acrolls/sveltekit` via file: for now

## Config

- [ ] `svelte.config.js` → `mdsvex(createAcrollsMdsvexOptions({…}))`
- [ ] `extensions` includes `.svelte`, `.md`, `.svx`
- [ ] Optional `*.md` / `*.svx` module declarations in `app.d.ts`

## Article path

- [ ] At least one `.md` route content file
- [ ] Page wraps with `<Publication>`
- [ ] Imports `default.css` **or** `foundation.css` (once)

## Docs path (optional)

- [ ] `DocsNav` in `src/lib/docs/nav.ts` with unique `storageKey`
- [ ] `docs/+layout.svelte` uses `DocsShell` + `@acrolls/docs/styles.css`
- [ ] Article pages still use `Publication`
- [ ] Index disables TOC/pager if desired

## Verify

- [ ] `pnpm dev` — article renders
- [ ] Code fence shows copy after click
- [ ] Docs: sidebar sections collapse/expand and **persist** after reload
- [ ] Docs: nested child highlights and opens ancestors
- [ ] Docs: TOC lists h2/h3 and tracks scroll
- [ ] CLI: `validate` exits 0 on a real page

## If blocked

- [ ] Minimal repro route only
- [ ] Read [troubleshooting.md](./troubleshooting.md)
- [ ] Compare `examples/kit-consumer` in the Acrolls repo
