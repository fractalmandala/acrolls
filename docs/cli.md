# CLI

Binary (local monorepo):

```bash
ACROLLS=/Users/amrit/acrolls
CLI="$ACROLLS/packages/cli/dist/index.js"

$CLI --help
$CLI --version
```

Rebuild after CLI changes: `cd $ACROLLS && pnpm --filter @acrolls/cli build`.

---

## `validate`

Compile one article through mdsvex **and** the HTML pipeline.

```bash
$CLI validate ./content/guide.md
$CLI validate ./content/guide.md --strict
```

| Exit | Meaning |
|---|---|
| 0 | OK (warnings may print) |
| 1 | Compile / validation failure |
| 2 | Bad usage |

---

## `studio`

Local source-authoritative editor + Publication HTML preview.

```bash
$CLI studio ./content/guide.md
$CLI studio ./content/guide.md --mode foundation --port 4317 --no-open
```

| Flag | Meaning |
|---|---|
| `--mode foundation\|default` | CSS preset |
| `--port N` | Prefer port (auto-increments if busy) |
| `--no-open` | Don’t launch browser |

- Binds **`127.0.0.1` only**  
- Save is atomic (temp file + rename)  
- SVX scripts stripped in HTML preview  

---

## `init`

Create an empty content directory (no sample article).

```bash
$CLI init
$CLI init --content-dir content/docs --dry-run
```

---

## `integrate`

Inspect a SvelteKit host and optionally apply a **reviewed** plan.

```bash
# always dry-run first
$CLI integrate --dry-run
$CLI integrate --dry-run --mode foundation

# apply (writes backups under .acrolls/backup/<timestamp>/)
$CLI integrate --yes --mode default
```

Apply may:

- Create or patch `svelte.config.js`  
- Inject CSS import into layout  
- Create `content/blog` if missing  

**Still install packages yourself** (file: or future npm). Integrate does not replace `pnpm add`.

Run from the **host app root**, not the Acrolls monorepo root (unless you want a new mini-app scaffold there).

---

## Status (no args)

```bash
$CLI
```

Prints host detection (sveltekit / node) and config hints.
