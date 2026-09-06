---
kind: business_term
name: Business Glossary
category: business_term
scope:
    - '**'
---

### Publication
- Definition：The root Acrolls article component (`acrolls/svelte`) that wraps any rendered document to apply publication-grade typography, accessibility, print styles, and responsive behavior. It is the standard way to render a compiled mdsvex/SVX document inside a host page.
- Aliases：publication

### DocsShell
- Definition：The full-page docs layout primitive from `acrolls/docs` that owns the left sidebar navigation, article body grid, and optional right-hand table-of-contents rail. Hosts use it when they do not already have an app-level sidebar; otherwise they compose `DocsSidebar` inside their own layout.
- Aliases：docs shell

### DocsSidebar
- Definition：A sidebar-only primitive from `acrolls/docs` intended for hosts that already own an app shell with a left/right column layout. It preserves generated navigation behavior without nesting a second full `DocsShell`.
- Aliases：docs sidebar

### DocsNav
- Definition：The typed navigation tree consumed by the docs shell. It describes sections, groups, items, routes, labels, visibility, ordering, badges, and open state. It can be hand-authored or generated from a Markdown directory tree via the content-source adapter.
- Aliases：navigation tree、nav

### Authored mode
- Definition：A corpus validation policy where every Markdown document must satisfy the configured mdsvex/frontmatter contract; invalid documents fail the build with aggregated diagnostics. This is the default for existing integrations.
- Aliases：authored

### Migration mode
- Definition：A corpus validation policy for importing an existing Markdown corpus where frontmatter is optional, safe normalizations are reported, and invalid documents are handled by a chosen policy (`fail` or `error-page`) rather than stopping the build immediately.
- Aliases：migration

### Corpus preflight
- Definition：The process by which Acrolls discovers all supported `.md` documents before rendering, validates each against the selected policy, and reports a summary of ready / normalized / rejected documents. Used by `acrolls validate` and during host builds.
- Aliases：preflight、validation

### Content collection
- Definition：A single developer-facing declaration that names where documents come from, how they are validated, which are published, and how they are configured. It resolves to one content source powering navigation, routes, breadcrumbs, pager order, and static entries — replacing scattered hand-keyed build inputs.
- Aliases：collection、content source

### Generated source
- Definition：Host-defined scaffolding that derives routes, navigation, breadcrumbs, pager order, and static entries from a declared page tree over a Markdown directory. Filesystem conventions provide defaults but the explicit host definition wins.
- Aliases：generated source、generated nav

### Foundation / Default / SASS tokens
- Definition：Three style modes Acrolls offers to hosts. Foundation gives minimal structure and behavior for hosts that already own article typography; Default provides a complete editorial preset; SASS tokens expose indented token maps for hosts that prefer custom CSS authored via SASS.
- Aliases：style modes、foundation.css、default.css

### fractalthemer
- Definition：The theming kit shipped under `acrolls/styles/theme` that provides 40+ light/dark themes, auras, and a theme picker. It is the mechanism by which Acrolls delivers multi-theme support without owning the host's theme system.
- Aliases：theme kit、themes

### Open gates
- Definition：Known limits or incomplete areas of a capability as recorded in the repo's capability inventory. Each child page lists Open Gates alongside Implementing Source and Test Coverage to mark what still needs work before launch readiness.
- Aliases：open gate
