# Draft spec: authored docs frontmatter contract

**Status:** Implemented locally; not yet released. This document defines the approved contract.

## Objective

Make Acrolls-generated documentation pages content-addressable and consistently headed without
making hosts duplicate page metadata. In authored mode, Markdown frontmatter is the admission
contract for ordinary pages: Acrolls derives the visible page header, generated navigation,
pager, static entries, and document metadata from it.

The contract applies to generated `.md` docs consumed through `content()` — and equally through
the deprecated-but-supported `createAcrollsDocsSource` and the lower-level
`createDocsContentSource`, since all three resolve to the same engine. It does not change
migration mode, standalone publication pages, or executable `.svx` content.

An optional `schema` on `content()` layers host-defined frontmatter validation on top of this
contract; it does not replace it. A schema failure raises an `ACROLLS_SCHEMA_INVALID`
diagnostic and then obeys the mode already in force — authored mode rejects the document
alongside the admission failures defined below, migration mode keeps it with raw frontmatter
and reports. Keep `title` optional in a host schema: `ACROLLS_TITLE_REQUIRED` below is the
authority on titles and derives index titles from folder names, so a required-title schema
would double-reject every `index.md`.

## Authoring contract

### Ordinary pages

Every non-`index.md` document requires a YAML frontmatter block with a non-empty string `title`.
`description` is optional.

```md
---
title: Install Acrolls
description: Add Acrolls to a SvelteKit application.
---

# Install Acrolls

The article body starts here.
```

Acrolls renders one page header from the effective title and, when present, description. A
leading Markdown H1 is suppressed so the reader sees one H1. If that leading H1 text differs
from the effective title, Acrolls emits an author warning but still renders the document.

### Index pages

`index.md` has an inferred title and does not require frontmatter `title`:

- `guides/index.md` receives the effective title `Guides`.
- Root `index.md` receives the configured docs title.
- A folder/group title supplied by the host configuration is used instead of the raw folder name.

Frontmatter is optional for an index page. If present, its `description` is displayed. The
effective index title always comes from the host-defined folder/group title; a supplied
frontmatter `title` never overrides it. Acrolls emits an author warning
(`ACROLLS_INDEX_TITLE_IGNORED`) when it ignores that supplied value.

### Metadata precedence

Admission always happens before host overrides. A host `documents` or `entries` title cannot make
an invalid ordinary document valid. Once admitted, the existing precedence remains:
explicit entry override → document configuration → frontmatter → inferred index title.

This keeps the host authoritative over information architecture while Acrolls owns the minimum
content contract.

## Invalid-document matrix

The table defines **authored mode**. Migration mode retains its existing permissive frontmatter
fallback behavior.

| Source condition | Status | Generated docs result | Author diagnostic and gate |
| --- | --- | --- | --- |
| Ordinary `.md` has no YAML frontmatter block | Rejected | No document record, route, nav item, pager item, static entry, or generated Acrolls link; direct generated route is the host's 404 | `ACROLLS_FRONTMATTER_REQUIRED` error; `acrolls validate --mode authored` and CI fail after reporting all files |
| Ordinary `.md` has YAML but no `title`, an empty title, or a non-string title | Rejected | Same exclusion | `ACROLLS_TITLE_REQUIRED` or `ACROLLS_TITLE_INVALID` error; validation/build gate fails |
| `index.md` has no frontmatter or no `title` | Ready | Included with inferred effective title; description omitted | No diagnostic |
| Any admitted page has no description or an empty description | Ready | Header has title only | No diagnostic |
| YAML frontmatter is malformed or has duplicate/ambiguous `title` data | Rejected | Not admitted | `ACROLLS_FRONTMATTER_INVALID` error with source location; validation/build gate fails |
| First body node is an H1 equal to the effective title | Ready | The H1 is removed from rendered body; Acrolls header is the sole visible H1 | No diagnostic |
| First body node is an H1 different from the effective title | Ready with warning | The H1 is removed from rendered body; Acrolls header remains authoritative | `ACROLLS_LEADING_H1_MISMATCH` warning in dev terminal, CLI output, JSON report, and CI log; it does not fail CI |
| H1 occurs after substantive body content, or is H2–H6 | Ready | It remains authored body content | No diagnostic |
| A valid page declares `hidden: true` | Ready but unlisted | Existing hidden behavior: excluded from generated navigation/pager, with the host's configured routability unchanged | No diagnostic. `hidden` never waives frontmatter or title requirements. |
| An explicit host entry, landing, or parent points at a rejected document | Configuration error | The entry/group is not generated; no fallback link is produced | `ACROLLS_ENTRY_TARGET_REJECTED` error naming both entry and source; validation/build gate fails |
| A valid document links to a rejected Acrolls-resolvable internal doc route | Link error | The target remains absent; no generated replacement link | `ACROLLS_LINK_TO_REJECTED_DOCUMENT` error in authored mode. This includes author-written Markdown links; external URLs and host-owned non-document routes are out of scope. |
| Two admitted documents normalize to the same route | Rejected pair | Neither conflicting route is generated | `ACROLLS_ROUTE_COLLISION` errors for both sources; validation/build gate fails |
| Markdown fails normalization, mdsvex, Svelte, or safe HTML preflight | Rejected | Authored mode fails after aggregate reporting; migration retains configured `fail` / `error-page` behavior | Existing normalized/compile/render diagnostic codes and the authored validation/build gate |
| Unsupported extension or executable `.svx` in this generated Markdown source | Out of scope / rejected by the current source contract | No generated `.md` document is created | Existing unsupported-source or compiler diagnostic; `.svx` support needs an explicit future contract |

## Runtime and build behavior

### Admission-invalid documents

Missing or invalid required frontmatter is known from document metadata. Acrolls excludes those
records before it derives `documents`, navigation, pager order, route entries, or generated links.
`docs.get()` and `docs.entries()` never expose them.

### Compile-invalid documents

Compilation failures need corpus preflight. An unrestricted `import.meta.glob()` can still let
Vite reach a broken module before a runtime filter runs. To guarantee the same exclusion promise
for all rejected files, Acrolls needs a generated, validated import manifest that imports only
admitted documents. Until that manifest exists, authored mode must fail the build after reporting
all diagnostics rather than claim runtime exclusion for compile-invalid source.

### Author visibility

Diagnostics are for the author/operator, not documentation readers:

- Development: terminal diagnostics and optional dev-only summary from `docs.diagnostics`.
- Validation: `acrolls validate <docs-dir> --mode authored --on-invalid fail` with path, code,
  location, severity, and remediation.
- CI: the same command exits non-zero for rejected documents and emits JSON when `--report` is
  requested.

No reader-facing invalid-document page is generated in authored mode.

## Proposed public surface

The names below are design targets, not existing API:

```ts
const convention = defineDocsConvention({
	mode: 'authored',
	frontmatter: {
		ordinaryPageTitle: 'required',
		indexTitle: 'folder',
		description: 'optional',
		leadingH1: 'suppress-and-warn'
	},
	invalidDocument: 'exclude'
});
```

The docs source exposes serializable diagnostics alongside only admitted documents. `DocsShell`
accepts the resolved current document and renders its page header. The Markdown pipeline receives
the same convention so it can remove only an initial H1 for an admitted generated docs page.

## Commands

```bash
pnpm --filter @acrolls/docs test
pnpm --filter @acrolls/mdsvex test
pnpm --filter @acrolls/cli test
pnpm check
pnpm test
pnpm --filter @acrolls/example-kit check
pnpm build:example
pnpm exec acrolls validate examples/kit-consumer/src/content --mode authored --on-invalid fail
pnpm dev:docs
```

## Implementation structure

```text
packages/mdsvex/    frontmatter-presence marker and leading-H1 transform
packages/docs/      admission policy, diagnostics, record/nav/entry filtering, page-header API
packages/sveltekit/ Vite glob adaptation and future validated import-manifest integration
packages/cli/       corpus diagnostics and authored-mode validation fixtures
examples/kit-consumer/
                    strict authored configuration and browser acceptance corpus
docs/               authoring, CLI, integration, and troubleshooting guidance
```

## Testing strategy

- Unit tests cover each row in the matrix, including the index exception and precedence rules.
- mdsvex tests prove frontmatter presence is distinguishable from an empty metadata object and
  that only an initial H1 is suppressed.
- Content-source tests prove rejected documents are absent from `get`, `documents`, `entries`,
  nav, pager, route generation, and explicit entries.
- CLI tests prove diagnostics aggregate with stable codes and authored mode exits non-zero only
  for rejected documents, not the leading-H1 mismatch warning.
- The kit consumer verifies the visible page header, no duplicate H1, excluded routes returning
  404, nested navigation, and browser-console cleanliness.

## Boundaries

- Always preserve migration mode and the existing host-owned hierarchy/configuration model.
- Always aggregate diagnostics before failing an authored corpus gate.
- Always keep accepted frontmatter as the source of page title/description, not a duplicated
  Markdown heading.
- Ask first before changing defaults for existing integrations, adding dependencies, or changing
  CI configuration.
- Never silently fall back to a filename for an invalid ordinary authored page.
- Never expose a rejected page through generated nav, pager, route entries, link helpers, or
  Acrolls-resolvable author-written Markdown links.

## Success criteria

1. An admitted ordinary page renders exactly one visible H1 from frontmatter title.
2. An admitted page with no description renders no empty description element.
3. A frontmatter-less ordinary page cannot appear in any generated docs surface or static entry.
4. An index page without a title remains valid and uses its inferred title.
5. All rejected documents are reported together with stable, actionable diagnostics.
6. Authored validation fails for rejected documents but not for a leading-H1 mismatch warning.
7. Migration behavior remains unchanged.
8. Generated links and Acrolls-resolvable author-written Markdown links to a rejected document
   receive an author error rather than silently becoming broken reader links.

## Approved decisions

1. `guides` is a host/example folder name, not a permanent Acrolls route. For every index page,
   the host-defined folder/group title always wins; a supplied frontmatter `title` is ignored
   with an author warning.
2. “Not anywhere in links” includes Acrolls-resolvable author-written internal Markdown links.
   A link to a rejected document is an authored-mode error.
3. `hidden: true` is available only to otherwise valid documents and cannot suppress any
   validity diagnostic.
