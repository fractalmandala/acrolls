---
kind: external_dependency
name: Pagefind — optional client-side search indexer for Acrolls docs
slug: pagefind
category: external_dependency
category_hints:
    - sdk_real_api
    - framework_behavior
scope:
    - '**'
---

Acrolls ships an optional `DocsSearch` component that indexes prerendered HTML via Pagefind. The integration is opt-in: the host installs `pagefind` and `@sveltejs/adapter-static`, runs `pagefind --site build` after the SvelteKit static build, and mounts `<DocsSearch />` in the docs shell header. Acrolls marks article content with `data-pagefind-body` and chrome (sidebar/TOC/pager) with `data-pagefind-ignore`; per-page frontmatter can set `search.exclude` to omit a page. Content must be prerendered (rendered directly in route load, not awaited at render time) so Pagefind has HTML to index. This is a post-build indexer — Acrolls takes no runtime dependency on Pagefind.