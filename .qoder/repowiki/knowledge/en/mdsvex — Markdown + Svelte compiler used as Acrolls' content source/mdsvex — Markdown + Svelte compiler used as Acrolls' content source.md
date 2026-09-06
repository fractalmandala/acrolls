---
kind: external_dependency
name: mdsvex — Markdown + Svelte compiler used as Acrolls' content source
slug: mdsvex
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
---

Acrolls is built on top of mdsvex (`@acrolls/mdsvex`) as its Markdown compilation layer. Authors write `.md` and `.svx` files; mdsvex compiles them into Svelte components with GFM, YAML frontmatter, slugs, tables, and Shiki. The host wires Acrolls' mdsvex options into its own SvelteKit config via `acrolls/sveltekit`, which also provides the Markdown content-source adapter. Acrolls intentionally does not replace mdsvex or invent a new format — it extends it.