# Acrolls — PRODUCT

## Summary

**Acrolls** is an open-source publishing SDK for **SvelteKit**. It turns ordinary Markdown and mdsvex (`.md` / `.svx`) into publication-grade technical articles on websites you already own.

> Just write. Acrolls handles the rest.

Acrolls is for developers who own a SvelteKit site and want production typography, code frames, tables, banners, callouts, figures, responsive behavior, and accessibility without assembling a publishing design system themselves.

## What it is not

Not a hosted blog platform, CMS, website builder, proprietary document format, collaboration service, or replacement for SvelteKit routing, deployment, analytics, or content storage.

## Responsibility boundary

| Acrolls owns | Host owns |
|---|---|
| mdsvex compilation semantics | Routing, deployment, SEO policy |
| Publication structure & primitives | Visual identity outside the article |
| Code highlighting (compile-time) | Content location & metadata schema |
| Article a11y / print / reduced-motion | Runtime theme toggle persistence |
| Local Studio and docs-shell scaffolding from host definitions | Content/navigation definition, global navigation, analytics |

## Content dialect

- **Primary:** Markdown + **mdsvex** (`.md`, `.svx`)
- Svelte components may appear in `.svx` content
- YAML frontmatter for metadata (title, description, …) — not prose. `title` and
  `description` are the author-facing source for standard article display metadata;
  Acrolls surfaces them through generated document records and banner/layout primitives.

## Style modes

| Mode | Use when |
|---|---|
| **Foundation** | Host already owns article typography / density |
| **Default** | Host wants a complete editorial preset |
| **SASS tokens** | Host prefers indented SASS token maps (optional layer) |

CSS is first-class. SASS is an additional pack for token authoring, not a requirement.

## Packages

| Package | Role |
|---|---|
| `@acrolls/mdsvex` | Shared mdsvex options: GFM, frontmatter, slugs, tables, Shiki, validation |
| `@acrolls/svelte` | `Publication` + editorial primitives (Svelte 5) |
| `@acrolls/styles` | `foundation.css`, `default.css`, optional SASS tokens |
| `@acrolls/docs` | Docs shell plus generated content records and `DocsNav` |
| `@acrolls/sveltekit` | SvelteKit mdsvex glue plus Markdown content-source adapter |
| `@acrolls/cli` | `init`, `integrate`, `validate`, `studio` |

## v0 scope (A + B + C)

### A — Reader surface (P0)

- mdsvex pipeline with heading slugs + anchors
- Shiki dual-theme code frames (copy + wrap)
- Fence metadata: `filename`, `lineNumbers`, `highlight`, `focus`, `add`, `remove`, `wrap`
- Semantic tables with keyboard-focusable overflow
- `Publication`, `Banner`, `Callout`, `Figure`, `Video`
- Zoomable images (opt-out `#nozoom` / `zoom={false}`)
- foundation + default CSS + SASS token pack
- Working SvelteKit example (`examples/kit-consumer`)

### B — Author tooling (P1)

- CLI: `init`, `onboard`, `integrate --dry-run`, `validate`
- Project-local binary; reviewed integrate plan

### C — Studio (P2)

- Local source-authoritative studio: Markdown edit + production preview
- Explicit Save; no proprietary document store
- Bind `127.0.0.1`; no telemetry

### Polish (0.1.1)

- Studio: live Publication HTML preview (banner, tables, Shiki, mermaid) + copy/wrap enhancement
- CLI `integrate --yes`: backup + patch svelte.config / layout CSS import
- Mermaid fences → lazy client render
- Shared `renderAcrollsArticleHtml()` for Studio/validate parity
- **`@acrolls/docs`**: docs shell templates — sidebar, collapsible accordion sections, breadcrumbs, pager, mobile drawer; config-driven `DocsNav`
- **Content source**: host-defined page-tree scaffolding over Markdown discovery, frontmatter
  metadata, normalized routes, generated `DocsNav`, lazy document loading, and static route
  entries

## Feature: Generated docs source and recursive navigation

### Summary

An Acrolls host declares what should be linked, at which level, and whether each entry is a
page or a group. Acrolls scaffolds that definition into one coherent, routeable page tree,
including navigation, routes, breadcrumbs, pager order, and static entries. Filesystem
conventions are useful defaults, not a substitute for the host's information architecture.

### Problem

The first generated-source slice discovers nested Markdown and builds navigation, but it
does not yet make the page-tree contract explicit. Its wording risks making `index.md`,
folder depth, and file/folder shape sound like Acrolls-owned product decisions. The host
should own those decisions; Acrolls should own the consistent scaffolding that follows from
them. A docs mount without an explicit landing definition must also never invite an
arbitrary redirect.

### Goals / Non-goals

- Make root pages, folder pages, and nested child pages behave consistently at every depth.
- Make the host's page-tree definition the source of truth, with Markdown discovery as the
  default input when no explicit definition is supplied.
- Scaffold routes, generated navigation, breadcrumbs, pager order, and static entries from
  the same host definition.
- Let hosts define links, hierarchy, page/group roles, labels, ordering, visibility, and open
  state without maintaining separate route, nav, breadcrumb, and pager objects.
- Keep routing, authentication, deployment, search, and the host's surrounding navigation
  under host ownership.
- Do not add CMS storage, remote content, required search/indexing, or automatic `.svx`
  discovery in this feature.

### Behavior

1. A host can mount one generated docs surface at a configured `baseHref` and can define
   which content is linked, at what level, and whether an entry is a page or a group. The
   mount is the docs shell's home and is not implicitly treated as the first article in the
   source tree.

2. An explicit host definition can assign any discovered document as the mount page at
   `baseHref`, regardless of its filename or containing folder. Its title and metadata are
   used for the page and for the mount link wherever the generated navigation exposes it.

3. When the host does not define a mount page, Acrolls does not redirect the mount to an
   arbitrary article. The host may provide its own landing page or overview state at the
   mount, while the generated navigation still represents every discovered page and group.

4. An explicit host definition can assign any discovered document as a group's landing
   page, regardless of whether the document is named `index.md` or lives in the group's
   folder. The group remains expandable, so its landing page and all of its child pages are
   reachable from the same navigation group.

5. A host can define a link target and its level independently of the filesystem. A page may
   be promoted to a group landing link, nested under a chosen group, or exposed as a sibling
   without requiring the content file to move. Acrolls scaffolds the resulting routes and
   navigation; it does not reinterpret the definition according to filename conventions.

6. A group without a landing page remains a navigation group with no parent-page link. Its
   child pages and descendant groups remain visible and routeable; Acrolls never invents a
   page or redirects the group to its first child.

7. A folder is both a possible page and a navigation group. A folder landing link and its
   disclosure control are separate interactions: opening the group does not navigate, and
   navigating to the landing page does not hide the child pages.

8. Files and folders can be siblings at any depth. By default a file is a page and a folder
   is a group, but the host definition may assign either role and may place entries at the
   level that matches the intended information architecture. Relative order follows the
   configured ordering rules.

9. Root-level pages, top-level folders, and nested folders use the same page-tree rules.
   No special-case navigation shape is required from the host for top-level folders that
   have landing pages.

10. Unless the host definition supplies a route, a page route is derived from its normalized
    relative path beneath `baseHref`. Filesystem index conventions may provide the default
    containing-folder route, but an explicit host route wins. Route generation removes
    duplicate separators and does not create arbitrary trailing-slash variants.

11. Every generated page has a usable label. An explicit document title wins; otherwise
    Acrolls derives a readable label from the filename. Folder labels follow the same rule
    from the folder name and may be overridden by host configuration.

12. Folder and page metadata can control label, description, ordering, hidden state, badge,
    and default-open behavior. Host configuration can override content metadata for a
    deliberate migration or site-wide policy.

13. YAML frontmatter `title` and `description` are the default display metadata for a page.
    They flow from the Markdown module into the generated document record, navigation metadata,
    route head metadata, and the visible article banner when the host renders the standard
    `PublicationLayout` or `Banner`. Explicit host configuration may override them deliberately.

14. Explicit ordering is applied before the stable normalized path order. The same source
    and configuration produce the same page and navigation order on every machine.

15. `hidden: true` means unlisted, not private. A hidden page remains directly routeable and
    available to the source lookup and static route entries, but it is omitted from the
    generated sidebar, breadcrumbs, and previous/next navigation. A hidden folder hides its
    descendants from generated navigation without becoming an access-control boundary.

16. A page and a group may not silently claim the same normalized route. Duplicate routes,
    contradictory definitions, and invalid metadata produce a clear source/build error that
    identifies the relevant source path and field.

17. A missing page is distinguishable from an empty page, so a host catch-all route can
    return a normal 404 response. A source with no documents produces an empty, deterministic
    navigation result rather than a fabricated page.

18. Page bodies remain lazy. Discovering metadata and building the serializable page tree
    does not execute every document component in the browser; a host loads only the page
    selected by the current route.

19. The generated navigation is deterministic and serializable. It contains page and group
    data only, never loaders, component functions, filesystem handles, or host runtime state.

20. The generated source powers document lookup, navigation, breadcrumbs, pager order, and
    static route entries from the same host-defined page tree. A host does not need to
    duplicate its definition across separate route, nav, breadcrumb, and pager objects.

21. Manual navigation remains a supported escape hatch for external links, custom sections,
    multiple docs surfaces, or pages intentionally managed outside the Markdown source.

22. Generated groups and links remain usable with keyboard navigation and assistive
    technology. A folder with children exposes an understandable expanded/collapsed state,
    and a folder landing link remains independently reachable when present.

23. Acrolls exposes two supported layout compositions: `DocsShell` for a complete docs
    page scaffold, including an explicit `fullBleed` escape hatch for constrained hosts; and
    `DocsSidebar` for hosts that already own a sidebar/center/sidebar app shell. The
    sidebar-only composition preserves generated navigation behavior without contracting a
    second docs shell into the host's center column.

24. Generated navigation node identities are deterministic and unique for distinct routes,
    including routes with long shared prefixes. Bounded display slugs must not be the only
    source of identity for open-state persistence or keyed navigation rendering.

25. The rendered docs navigation is defensive at the host boundary. If stale generated data or
    host-provided IDs collide, Acrolls deterministically isolates the entries with unique
    fallback identities instead of allowing one malformed navigation surface to crash the site.

## Feature: Corpus preflight and invalid-document policy

Acrolls must support the reality that an existing documentation corpus may not satisfy a
strict authored-docs contract. A single malformed or frontmatter-free document must never
turn into an uncontrolled cascade of Vite/Svelte compiler errors that obscures which source
files are usable.

### Product position

Acrolls has two explicit content modes:

- **Authored mode** is for a controlled corpus whose authors agree to the configured
  Markdown/mdsvex contract. Invalid documents fail the build with aggregated diagnostics.
- **Migration mode** is for importing an existing Markdown corpus. Frontmatter is optional,
  known safe normalizations are reported, and invalid documents are handled by policy before
  they can take down the rest of the docs surface.

Acrolls does not promise to make arbitrary Svelte or Markdown syntax valid. The Svelte/mdsvex
compiler remains the final authority; Acrolls owns when and how compiler failures become
actionable document diagnostics.

### Behavior

26. A host chooses the invalid-document policy explicitly; the default remains fail-fast for
    existing integrations so their current contract does not silently change. The CLI labels
    the same decision as `authored` or `migration` mode.

27. Corpus validation discovers all supported `.md` documents before rendering. A validation
    run reports every document's status as `ready`, `normalized`, or `rejected`, rather than
    stopping at the first file.

28. Every diagnostic includes a stable code, severity, phase, source path, line and column
    where available, a human-readable message, and a remediation hint. JSON output is
    available for CI and agent workflows; human output is concise and grouped by file.

29. Frontmatter is optional in migration mode. A missing title receives the existing readable
    filename fallback; missing frontmatter never causes a named `metadata` export failure.

30. Safe source normalization is visible in the report. Acrolls never silently rewrites a
    source without identifying the finding and the resulting document status.

31. In authored mode, any rejected document fails the validation/build gate after all
    diagnostics have been collected. In migration mode, the host may choose `fail` or
    `error-page` for rejected documents.

32. `error-page` produces a safe, routable diagnostic page for the affected source while the
    rest of the corpus remains available. The page must not echo unescaped source into Svelte.

33. Runtime exclusion is reserved for a future generated import-manifest API. Until that API
    exists, Acrolls never presents exclusion as a supported guarantee: an integration using an
    unrestricted `import.meta.glob()` must use `fail` or `error-page` explicitly.

34. A missing document and an invalid document remain distinguishable. Missing routes use the
    host's normal 404 behavior; invalid documents use the configured preflight policy.

35. The CLI accepts a file or directory. Directory validation uses the same Acrolls Markdown
    normalization and compilation pipeline as host integration and exits non-zero according to
    the selected policy.

36. A host can inspect a preflight summary before deployment, for example:
    `619 discovered · 590 ready · 20 normalized · 9 rejected`.

### Success criteria

6. A corpus with one intentionally invalid `.md` file can render all valid documents in
   migration `error-page` mode without a Vite/Svelte avalanche.
7. Authored mode reports all invalid files in one run and exits non-zero with stable codes.
8. Directory validation and host preprocessing agree on the same normalization and compile
   result for the same fixture corpus.
9. Existing integrations that do not opt into migration mode retain fail-fast behavior.

## Feature: Guided host onboarding

Acrolls must make the path from an existing SvelteKit host to a deployed docs surface
executable by a human or an agent. The operator should never have to infer which file to edit,
which snippet belongs there, or which warning matters while wiring the docs route.

### Product position

The first onboarding surface is terminal-first because it works in local repositories, remote
agent sessions, and CI-like environments. It is read-only guidance: `integrate` remains the
separate reviewed mutation command. The onboarding plan is versioned JSON so a future modal
dialog can render the same steps without creating a second source of truth.

### Behavior

37. `acrolls onboard` detects the current host and refuses to present a SvelteKit docs plan for
    an unsupported host without explaining the prerequisite.

38. Each checkpoint names the exact file, gives the code or command to use, explains the reason,
    calls out a project-specific caution, and states a concrete verification check.

39. The walkthrough covers package installation, mdsvex preprocessor wiring, CSS, the first
    content file, generated docs source, docs shell, document renderer, root/catch-all routes,
    corpus preflight, local verification, production build, and deployment URL checks.

40. Onboarding never silently overwrites host files. It distinguishes guidance from `integrate`
    and tells the operator when an existing complex config needs a manual merge.

41. `--check` rescans filesystem checkpoints and marks completed steps, allowing an interrupted
    human or agent session to resume without repeating completed wiring.

42. `--json` emits a versioned onboarding plan containing steps, snippets, cautions, checks,
    host detection, docs directory, base href, and style mode for a future modal or UI client.

43. The flow explicitly warns external hosts not to install the workspace-only
    `@acrolls/sveltekit` through `file:` and explains the direct `@acrolls/mdsvex` integration.

44. The final deployment checkpoint remains host-owned: Acrolls asks the operator to run the
    host build/deploy command and verify root, nested, refresh, highlighting, Mermaid, 404, and
    browser-console behavior. Acrolls does not assume an adapter, provider, or base path.

### Success criteria

10. A new operator can run `acrolls onboard` and receive a complete, ordered host-specific guide
    without opening a second integration document.
11. `acrolls onboard --check` identifies completed config/content/route checkpoints without
    modifying the host.
12. `acrolls onboard --json` contains enough information for a future modal to reproduce the
    terminal walkthrough exactly.

### Deferred

- Medium import
- Full rich-text Studio mode with protected SVX blocks
- Packed consumer CI matrix across OS
- npm publish automation
- mdsvex layout slot → snippet once mdsvex supports it
- Docs-shell styling pass using custom CSS and pure indented SASS aligned with CUBE CSS;
  Tailwind is not part of the intended styling direction.

## Success criteria

1. `pnpm install && pnpm build` succeeds in the monorepo.
2. `examples/kit-consumer` builds and renders the starter article with code, callout, table, figure.
3. `acrolls validate` compiles a sample article and exits 0.
4. `acrolls studio` opens a local preview for one file.
5. Host can import only foundation CSS and still get structure + behavior.

## Non-goals for v0

- Replacing mdsvex or inventing a new content format
- Owning host theme systems
- Pixel-perfect clone of any third-party product
