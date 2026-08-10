# Local / monorepo install

Until `@acrolls/*` is on npm, hosts link the built packages from your clone.

## Path form

```bash
ACROLLS=/Users/amrit/acrolls   # change me

cd "$ACROLLS" && pnpm install && pnpm build

cd /path/to/your-app
pnpm add \
  "file:$ACROLLS/packages/mdsvex" \
  "file:$ACROLLS/packages/svelte" \
  "file:$ACROLLS/packages/styles" \
  "file:$ACROLLS/packages/docs"

pnpm add -D mdsvex
```

In `package.json` this looks like:

```json
{
  "dependencies": {
    "@acrolls/docs": "file:../acrolls/packages/docs",
    "@acrolls/mdsvex": "file:../acrolls/packages/mdsvex",
    "@acrolls/styles": "file:../acrolls/packages/styles",
    "@acrolls/svelte": "file:../acrolls/packages/svelte"
  },
  "devDependencies": {
    "mdsvex": "^0.12.6"
  }
}
```

Relative `file:../acrolls/...` is fine if both repos are siblings.

## After pulling Acrolls changes

```bash
cd /Users/amrit/acrolls && pnpm build
cd /path/to/your-app && pnpm install   # refresh file: links if needed
```

## Do not install (for now)

| Package | Why |
|---|---|
| `@acrolls/sveltekit` via `file:` | Depends on `workspace:*` internals; use `@acrolls/mdsvex` APIs instead |
| `@acrolls/cli` as dependency | Optional; run the built binary by absolute path |

## CLI without installing

```bash
ACROLLS=/Users/amrit/acrolls
"$ACROLLS/packages/cli/dist/index.js" --help
"$ACROLLS/packages/cli/dist/index.js" validate ./path/to/article.md
"$ACROLLS/packages/cli/dist/index.js" studio ./path/to/article.md
"$ACROLLS/packages/cli/dist/index.js" integrate --dry-run
```

## pnpm + file: tips

- Always `pnpm build` Acrolls before `pnpm add file:…`  
- If types/resolves go stale: delete `node_modules/@acrolls` and `pnpm install`  
- Do not publish the host app with `file:` deps — wait for registry versions  

## Multiple hosts

You can point several projects at the same Acrolls clone. They all share one `pnpm build` output.
