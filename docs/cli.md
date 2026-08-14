# CLI

Install and run the public package from the SvelteKit host root:

```bash
pnpm add acrolls@latest
pnpm exec acrolls --help
pnpm exec acrolls --version
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
```

Install only `acrolls`; do not add direct `@acrolls/*` dependencies or local package links.

---

## Recommended first-run path

For a new host trial, use the CLI before opening the manual integration pages:

```bash
cd /path/to/your-sveltekit-app
pnpm add acrolls@latest
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
```

The command is read-only. It detects the host, prints the exact file/code/command checkpoints,
and stops at the host-owned deployment boundary. Use `--json` for an agent or UI, and use this
page as the reference for each command's flags and error surface.

---

## Commands

Run the CLI from the **host application root**. The CLI reads the host filesystem, but each
command documents whether it writes anything.

| Command | Purpose | Host files changed? |
|---|---|---|
| `acrolls` | Print detected host and configuration hints | No |
| `acrolls onboard` | Walk through a complete docs installation | No |
| `acrolls validate` | Compile and report one page or a corpus | Only with `--report` |
| `acrolls studio` | Preview and edit one source file locally | Yes, only when its editor saves the selected source file |
| `acrolls init` | Create an empty content directory | Yes |
| `acrolls integrate` | Plan or apply reviewed host edits | Only with `--yes` |

The normal first-run order is `onboard` → `validate` → host `pnpm check`/`pnpm build` → deploy.
Use `integrate` only when you explicitly want its generator to edit the host.

## Flags at a glance

Global flags:

| Flag | Meaning |
|---|---|
| `--help`, `-h` | Print command syntax and exit |
| `--version`, `-v` | Print the CLI version and exit |
| `--cwd <path>` | Run against a host directory without changing directories first |

Onboarding flags are described in [onboard](#onboard). The other commands keep their flags
local to the operation: `validate` has corpus-policy flags, `studio` has preview flags, and
`integrate` has dry-run/apply flags. Unknown commands and invalid flag values exit with code 2.

`--cwd` is global and should normally appear before the command. It changes into the selected
host directory before resolving relative content paths, route paths, and reports.

---

## `onboard`

Walk an existing SvelteKit host through a complete Acrolls docs installation without silently
editing host files:

```bash
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
pnpm exec acrolls onboard --docs-dir docs --base-href /docs --check
pnpm exec acrolls onboard --docs-dir docs --base-href /docs --json
```

Each checkpoint tells the operator which file to open, what code to add, which command to run,
what can go wrong, and how to verify the result. The walkthrough covers package installation,
the Markdown preprocessor, CSS, content, generated source, docs shell, routes, corpus preflight,
local checks, production build, and deployment verification. It is guidance-only; `integrate`
remains the separate command for reviewed automated edits.

The default is interactive when attached to a terminal. Interactive mode shows one pending
checkpoint at a time and waits for Enter or `next` before moving forward; type `q` to pause.
This prevents the full nine-plus-step plan from becoming a scroll-heavy terminal wall. Use
`--non-interactive` in an agent or CI session to print the complete plan at once. `--check`
rescans the host and marks filesystem checkpoints complete. `--json` emits a versioned plan with
the same steps, snippets, cautions, and checks so a future modal dialog can render the exact same
flow.

The filesystem checkpoints also inspect required Acrolls wiring markers—matching content globs,
the docs shell, lazy loading, and the 404 route. An existing file with unrelated content stays
pending for manual correction.

Important onboarding cautions are deliberate: install only the `acrolls` package and use its
public `acrolls/*` entrypoints. Keep the lazy component glob and eager metadata glob identical.
The generated source discovers every
folder automatically; leave `folders` out unless you need a label/order/presentation override.
Use `error-page` only as an explicit Markdown migration policy; `.svx` remains executable and
fail-fast. Acrolls does not choose the host adapter or deployment provider.

### Onboarding flags

| Flag | Meaning |
|---|---|
| `--docs-dir <path>` | Filesystem directory containing the Markdown corpus (default: `docs`) |
| `--base-href <path>` | Public docs URL and matching route directory (default: `/docs`) |
| `--mode foundation\|default` | Style preset to show in the snippets (default: `default`) |
| `--check` | Rescan the host and mark filesystem checkpoints complete |
| `--non-interactive` | Print the plan and return; useful for agents and CI |
| `--interactive` | Force the Enter-to-continue walkthrough when a TTY is available |
| `--json` | Emit the versioned onboarding plan as JSON |

`--json` is intentionally a plan, not an editor protocol: it does not write files, install
packages, or run the host build. A modal or coding agent can render each `file`, `code`,
`caution`, `command`, and `verify` field, then ask the operator to rerun with `--check`.

### Agent handoff

Give an agent the repository's `llms.txt`, then ask it to run the following from the host root:

```bash
acrolls onboard --non-interactive --docs-dir docs --base-href /docs --json \
  > .acrolls-onboarding.json
```

The agent should follow the plan in order, preserve the host adapter and layout, run the
preflight, and finish with the host's own build/deployment commands. Acrolls intentionally
stops at the deployment boundary: the host still owns credentials, adapter selection,
environment variables, CDN/base-path rules, and the final public URL.

---

## `validate`

Compile one article or an entire Markdown corpus through mdsvex, the Svelte parser, and the
HTML pipeline.

```bash
pnpm exec acrolls validate ./content/guide.md
pnpm exec acrolls validate ./content/guide.md --strict
pnpm exec acrolls validate ./docs --mode migration --on-invalid error-page --report ./acrolls-report.json
```

Validation reports Markdown source-safety findings with line and column locations. The default
mode normalizes supported Svelte-shaped literals before compiling; `--strict` turns those
findings into a failure so CI can require explicit inline code. Mermaid source and fenced code
are preserved. Directory validation does not stop at the first error: it reports every
document and prints a corpus summary.

| Flag | Meaning |
|---|---|
| `--mode authored\|migration` | Authored mode treats source-safety findings as errors; migration mode reports safe normalizations. |
| `--on-invalid fail\|error-page` | Fail the validation gate, or choose the host migration policy that renders a safe diagnostic page. |
| `--report <file>` | Write the serializable document statuses and diagnostics as JSON. |

Example summary:

```text
619 discovered · 590 ready · 20 normalized · 9 rejected
```

`error-page` is a runtime preprocessor policy; the CLI still reports rejected documents so
they are visible to authors and deployment agents.

### Verify while developing

Keep the host dev server in one terminal and run validation in another:

```bash
# terminal 1 — host runtime
pnpm dev

# terminal 2 — corpus gate
pnpm exec acrolls validate ./docs --mode migration --on-invalid error-page --report ./.acrolls-report.json
```

Then open the docs root and one nested page, refresh both directly, and inspect the browser
console. If the host reports dozens of Svelte errors, fix the first source file named by the
validation report; generated diagnostics are usually downstream symptoms of one malformed
Markdown document.

### CI and production verification

For a corpus that is expected to be authored to Acrolls' strict rules, use:

```bash
pnpm exec acrolls validate ./docs --strict --report ./.acrolls-report.json
pnpm check
pnpm build
```

`pnpm check` and `pnpm build` are host commands, not CLI subcommands. They catch SvelteKit
route/type errors and adapter/build errors that corpus validation cannot see.

| Exit | Meaning |
|---|---|
| 0 | OK (warnings may print) |
| 1 | Compile / validation failure |
| 2 | Bad usage |

---

## `studio`

Local source-authoritative editor + Publication HTML preview.

```bash
pnpm exec acrolls studio ./content/guide.md
pnpm exec acrolls studio ./content/guide.md --mode foundation --port 4317 --no-open
```

| Flag | Meaning |
|---|---|
| `--mode foundation\|default` | CSS preset |
| `--port N` | Prefer port (auto-increments if busy) |
| `--no-open` | Don’t launch browser |

- Binds **`127.0.0.1` only**  
- Save is atomic (temp file + rename)  
- SVX scripts stripped in HTML preview  

Studio is a local authoring aid, not a substitute for the host's SvelteKit runtime. It does
not validate generated routes, adapter behavior, authentication, or deployment configuration.

---

## `init`

Create an empty content directory (no sample article).

```bash
pnpm exec acrolls init
pnpm exec acrolls init --content-dir content/docs --dry-run
```

---

## `integrate`

Inspect a SvelteKit host and optionally apply a **reviewed** plan.

```bash
# always dry-run first
pnpm exec acrolls integrate --dry-run
pnpm exec acrolls integrate --dry-run --mode foundation

# apply (writes backups under .acrolls/backup/<timestamp>/)
pnpm exec acrolls integrate --yes --mode default
```

Apply may:

- Create `vite.config.ts` only when the SvelteKit host has no Vite or legacy config
- Patch a legacy `svelte.config.js` when no Vite-based SvelteKit config exists
- Inject CSS import into layout  
- Create `content/blog` if missing  

### SvelteKit 3 and Vite-based configuration

SvelteKit 3 keeps its configuration in the `sveltekit()` plugin inside `vite.config.ts`;
SvelteKit 2.62+ supports the same shape. `onboard` detects that file and prints the correct
merge. `integrate --yes` refuses to rewrite an existing Vite config because arbitrary plugin
arrays and adapter options require review; use the onboarding snippet for that step.

**Install `acrolls` before running this command.** Integrate does not run `pnpm add`. It also
refuses non-SvelteKit hosts and refuses all edits when a Vite config already
exists, so it cannot overwrite a custom plugin array.

Run from the **host app root**. Use [Getting started](./getting-started.md) for the full manual
route and content wiring.

### Live deployment check

After the host build and deployment succeed, verify the actual public URL rather than assuming
the build output is routable:

```bash
curl -fsSI https://example.com/docs
curl -fsSI https://example.com/docs/guides/installation
```

Also test direct refreshes, a deliberately unknown slug (expected 404), code highlighting,
Mermaid, navigation persistence, and any host-owned auth or base path. Acrolls does not make
network requests, audit the deployed site, or manage the deployment provider.

## Error surfaces and exit codes

The CLI reports the first actionable usage or filesystem error, while corpus validation keeps
scanning the directory so an operator can fix several documents in one pass.

| Exit | Meaning | Typical response |
|---|---|---|
| `0` | Command completed; validation may still print warnings | Continue to the next checkpoint |
| `1` | Host, filesystem, compile, or validation failure | Fix the reported source/host issue and rerun |
| `2` | Unknown command, missing argument, or invalid flag value | Correct the invocation |

`error-page` is a migration fallback for rejected `.md` documents. It is not import exclusion:
invalid `.svx` remains executable and fail-fast, and the CLI still reports rejected documents.
The CLI also does not promise that arbitrary frontmatter or arbitrary Svelte-shaped text is
valid; use `validate` before a production build.

---

## Status (no args)

```bash
pnpm exec acrolls
```

Prints host detection (sveltekit / node) and config hints.
