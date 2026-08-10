# Troubleshooting

## `Cannot find package '@acrolls/mdsvex'`

- Run `pnpm build` inside the Acrolls monorepo.  
- Re-`pnpm install` in the host.  
- Confirm `node_modules/@acrolls/mdsvex/package.json` exists.  

---

## `workspace:*` / `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

You linked `@acrolls/sveltekit` (or another package) that expects the Acrolls pnpm workspace. **Remove it** from the host and import from `@acrolls/mdsvex` instead.

---

## `Logical expressions and coalesce expressions cannot be mixed`

Stale build of `@acrolls/docs`. Rebuild Acrolls and reinstall the host `file:` link.

```bash
cd /Users/amrit/acrolls && pnpm build
cd /path/to/host && pnpm install
```

---

## Code blocks break Svelte compile (`Unexpected token` near `{`)

Fixed in current highlighters by escaping `{` / `}` for Svelte. Rebuild `@acrolls/mdsvex`.

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

## Styles look unstyled / double fonts

- Import **one** of foundation/default.  
- Import `@acrolls/docs/styles.css` if using the shell.  
- Avoid importing Acrolls CSS twice.  
- For foundation mode, set host tokens (`--foreground`, etc.).  

---

## Tables: a11y warning on `tabindex`

Known Svelte a11y warning on scroll regions with `role="region"`. Harmless for v0; scroll keyboard access is intentional.

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
3. Compare with `/Users/amrit/acrolls/examples/kit-consumer` and dharmalib `/docs/user` (local trial)  
