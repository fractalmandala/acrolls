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
| `acrolls create` | Scaffold a new pre-wired SvelteKit docs project | Yes (writes a new project directory) |
| `acrolls onboard` | Walk through a complete docs installation | No |
| `acrolls validate` | Compile and report one page or a corpus | Only with `--report` |
| `acrolls studio` | Preview and edit one source file locally | Yes, only when its editor saves the selected source file |
| `acrolls init` | Create an empty content directory | Yes |
| `acrolls docs init` | Seed the docs directory with a starter `index.md` | Yes (never overwrites) |
| `acrolls integrate` | Plan or apply reviewed host edits | Only with `--yes` |
| `acrolls search-index` | Build the Pagefind search bundle from the built site | Yes (writes the bundle into the site output) |
| `acrolls api-ref` | Generate Markdown API-reference pages from an OpenAPI/AsyncAPI/GraphQL spec | Yes (writes Markdown pages) |

Start a brand-new project with `create`; to add Acrolls to an existing host, the normal first-run
order is `onboard` → `validate` → host `pnpm check`/`pnpm build` → `search-index` → deploy. Use
`integrate` only when you explicitly want its generator to edit the host.

## Flags at a glance

Global flags:

| Flag | Meaning |
|---|---|
| `--help`, `-h` | Print command syntax and exit |
| `--version`, `-v` | Print the CLI version and exit |
| `--cwd <path>` | Run against a host directory without changing directories first |

Onboarding flags are described in [onboard](#onboard). The other commands keep their flags
local to the operation: `validate` has corpus-policy flags, `studio` has preview flags,
`integrate` has dry-run/apply flags, `search-index` has build-output flags, `api-ref` has
spec/format/output flags, and `create` has scaffold-target flags. Unknown commands and invalid flag
values exit with code 2.

`--cwd` is global and should normally appear before the command. It changes into the selected
host directory before resolving relative content paths, route paths, and reports.

---

## `create`

Scaffold a **new**, minimal SvelteKit project already wired for Acrolls docs — the from-scratch
counterpart to [`onboard`](#onboard), which walks an *existing* host. It writes a complete, buildable
starter: a root landing route, a docs route driven by `DocsShell`, a single-corpus `source.ts`, the
Acrolls mdsvex preprocessor and a static adapter in `vite.config.ts`, plain-CSS style entrypoints,
and four warning-free starter Markdown pages.

```bash
# scaffold into ./my-docs (created if missing), docs served at /docs
pnpm exec acrolls create my-docs

# name the site, move the docs route, and pick the base style preset
pnpm exec acrolls create my-docs --title "Field Handbook" --base-href /handbook --mode foundation

# preview the tree without writing, or tailor the README/next steps to a package manager
pnpm exec acrolls create my-docs --dry-run
pnpm exec acrolls create my-docs --package-manager pnpm
```

The target directory is created if it does not exist. `create` **refuses a non-empty directory**
unless you pass `--force`, so it can never scatter scaffold files into an unrelated project; with
`--force`, colliding files are overwritten and other existing files are left alone. The package name
is derived from the directory (`My Docs Site` → `my-docs-site`) and the title from the name
(`my-docs-site` → `My Docs Site`) when you do not pass `--name`/`--title`. The `acrolls` dependency
is pinned to the running CLI version.

The generated project is CSS-first — it imports `acrolls/styles/<mode>.css` and
`acrolls/docs/styles.css` and assumes no preprocessor — and it chooses neither a theme nor a deploy
target beyond the included static adapter, which you can swap freely.

| Flag | Meaning |
|---|---|
| `--name <pkg>` | npm package name (default: derived from the directory) |
| `--title <name>` | Site/docs title (default: humanized from the name) |
| `--base-href <path>` | Public docs URL and matching route directory (default: `/docs`) |
| `--mode foundation\|default` | Base style preset imported by the root layout (default: `default`) |
| `--package-manager npm\|pnpm\|yarn\|bun` | Package manager for the printed next steps and README (default: `npm`) |
| `--force` | Scaffold into a non-empty directory, overwriting colliding files |
| `--dry-run` | Report the tree; write nothing |

After scaffolding, install and run:

```bash
cd my-docs
pnpm install
pnpm dev          # preview; pnpm build produces the static site + Pagefind index
```

| Exit | Meaning |
|---|---|
| `0` | Project scaffolded, or `--dry-run` reported the tree |
| `1` | Target directory is non-empty and `--force` was not passed |
| `2` | Bad usage: no directory, or an invalid `--mode`/`--package-manager` value |

---

## `onboard`

Walk an existing SvelteKit host through a complete Acrolls docs installation without silently
editing host files:

```bash
pnpm exec acrolls onboard --docs-dir docs --base-href /docs
pnpm exec acrolls onboard --docs-dir docs --base-href /docs --check
pnpm exec acrolls onboard --docs-dir docs --base-href /docs --json
pnpm exec acrolls onboard --docs-dir docs --base-href /docs --style sass
```

Use `--style css` (the default) for JavaScript CSS imports, or `--style sass` when the host
uses `<style lang="sass">` blocks. `integrate` accepts the same flag when it edits a layout.

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
public `acrolls/*` entrypoints. Keep the lazy `body` glob and the eager `metadata` and `facts`
globs on the identical pattern string. The generated source discovers every
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

## `docs init`

Seed the docs corpus with a starter `index.md` — content only, by design. `integrate` wires the
host and `onboard` walks the full installation; this command only gives you a working first page.

```bash
pnpm exec acrolls docs init
pnpm exec acrolls docs init --docs-dir handbook --dry-run
```

| Flag | Meaning |
|---|---|
| `--docs-dir <path>` | Docs corpus directory (default: `docs`) |
| `--dry-run` | Print what would happen; write nothing |

The starter maps to the docs base route and infers its title from the folder, so it never creates
a junk route. An existing `index.md` is left untouched — delete it first to regenerate. The
starter text is the same snippet `onboard`'s content checkpoint shows.

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

---

## `search-index`

Build the [Pagefind](https://pagefind.app) search bundle from the host's **already built** static
output. `DocsSearch` (from `acrolls/docs`) loads that bundle in the browser at runtime; this
command is the post-build step that produces it.

```bash
# after the host build
pnpm build
pnpm exec acrolls search-index

# index a non-default output directory, or scope the file glob
pnpm exec acrolls search-index --site dist --glob "**/*.html"
pnpm exec acrolls search-index --site build --output build/pagefind --verbose
```

Pagefind ships native per-platform binaries, so Acrolls never bundles it. Add it to the host as a
dev dependency first; the command uses the host's own install and fails with a clear message when
it is missing:

```bash
pnpm add -D pagefind
```

| Flag | Meaning |
|---|---|
| `--site <path>` | Built static-site directory to index (default: `build`) |
| `--output <path>` | Where to write the bundle (default: `<site>/pagefind`) |
| `--glob <pattern>` | File glob within `--site` (default: `**/*.{html}`) |
| `--bundle-path <url>` | Public URL printed for `DocsSearch` (default: `/pagefind/pagefind.js`) |
| `--verbose` | Forward verbose logging to Pagefind |

Scoping lives in the markup, not in this command: the docs shell marks the article with
`data-pagefind-body` and its chrome with `data-pagefind-ignore`, so only article content is
indexed. The reported page count is what Pagefind actually indexed (read back from the written
manifest), which can be lower than the number of files scanned.

Wire it into a single post-build script so the bundle is always fresh:

```json
{
  "scripts": {
    "build": "vite build && acrolls search-index"
  }
}
```

The default `--bundle-path` matches `DocsSearch`'s default `bundlePath`, so no extra wiring is
needed. Pass `--bundle-path` only to change the printed hint (for example under a base path); the
bundle location on disk is set by `--output`.

> **`vite preview` does not serve the search bundle.** It serves SvelteKit's client output
> (`.svelte-kit/output/client`, only `/_app/...`), which does **not** include the `build/pagefind/`
> directory that `search-index` writes after the build. So `/pagefind/*` 404s under `vite preview`
> and `DocsSearch` degrades to its "unavailable" note. To preview search, serve the whole `build/`
> directory with a static file server: `pnpm dlx sirv build --port 4173 --cors`. Production hosts
> deploy `build/` as the static output, so the bundle is served correctly there.

| Exit | Meaning |
|---|---|
| `0` | Bundle written |
| `1` | Site directory missing, Pagefind not installed, or a Pagefind error |
| `2` | Bad usage |

---

## `api-ref`

Generate Acrolls Markdown reference pages from an **OpenAPI**, **AsyncAPI**, or **GraphQL** spec — a
single file or a directory of specs. The output is ordinary content-pipeline Markdown (YAML
frontmatter, GFM tables, fenced examples) that Shiki highlights and `Publication` renders like any
other page, so an API reference sits beside your guides with no extra runtime.

```bash
# one spec -> one page under content/api (the default output)
pnpm exec acrolls api-ref ./specs/openapi.json

# choose the output directory, or preview without writing anything
pnpm exec acrolls api-ref ./specs/openapi.json --out src/content/api --dry-run

# a directory of specs -> one page each; force a format or override a single slug
pnpm exec acrolls api-ref ./specs --out src/content/api
pnpm exec acrolls api-ref ./specs/legacy.yaml --format openapi --slug rest-api
```

Pass a file or a directory (walked recursively, skipping `node_modules`); the command reads `.json`,
`.yaml`/`.yml`, and `.graphql`/`.gql` sources. The format is detected from the document (`openapi` or
`swagger`, `asyncapi`, `__schema`, or GraphQL SDL) — pass `--format` only to force one. Each page
carries a frontmatter `title` (plus `description` when the spec has one) and **no leading H1**,
matching the conventions the shell enforces: it renders the title itself and warns on a leading H1.

JSON specs — including GraphQL **introspection JSON** — need no extra dependency. YAML specs use the
optional [`yaml`](https://www.npmjs.com/package/yaml) package and GraphQL **SDL** uses the optional
[`graphql`](https://www.npmjs.com/package/graphql) package. Both are loaded lazily, so add one only
when you need it; the command fails with a clear install hint when a required parser is missing:

```bash
pnpm add -D yaml       # for .yaml/.yml specs
pnpm add -D graphql    # for .graphql/.gql SDL
```

| Flag | Meaning |
|---|---|
| `--out <path>` | Output directory for generated pages (default: `content/api`) |
| `--format openapi\|asyncapi\|graphql` | Force a format instead of auto-detecting from content |
| `--slug <name>` | Override the output filename for a single-file input |
| `--dry-run` | Report what would be written; write nothing |

Point `--out` at a content directory your docs source globs (see [Getting started](./getting-started.md)),
then run the host build. Pages are overwritten in place, so regenerating after a spec change is safe
to wire into a prebuild script:

```json
{
  "scripts": {
    "prebuild": "acrolls api-ref ./specs --out src/content/api"
  }
}
```

| Exit | Meaning |
|---|---|
| `0` | Pages written, or `--dry-run` reported what would be written |
| `1` | Spec/directory not found, undetectable or invalid spec, a missing optional parser (`yaml`/`graphql`), or a render failure |
| `2` | Bad usage: no input, or an invalid `--format` value |

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

For a controlled generated docs corpus, use authored mode:

```bash
acrolls validate src/content --mode authored --on-invalid fail --report acrolls-docs-report.json
```

It requires YAML frontmatter and a string `title` for every non-`index.md` file. Index titles are
derived from their folder/group. The report also identifies frontmatter-less pages, title errors,
leading-H1 mismatches, compiler failures, and author-written Markdown links to rejected docs.

---

## Status (no args)

```bash
pnpm exec acrolls
```

Prints host detection (sveltekit / node) and config hints.
