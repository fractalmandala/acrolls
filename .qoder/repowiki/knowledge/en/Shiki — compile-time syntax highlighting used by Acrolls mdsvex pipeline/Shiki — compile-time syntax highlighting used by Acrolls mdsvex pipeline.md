---
kind: external_dependency
name: Shiki — compile-time syntax highlighting used by Acrolls mdsvex pipeline
slug: shiki
category: external_dependency
category_hints:
    - vendor_identity
scope:
    - '**'
---

The `acrolls/mdsvex` package configures Shiki as the code-frame highlighter for fenced code blocks produced from Markdown/SVX. It renders dual-theme (light/dark) code frames with copy/wrap support and supports fence metadata such as `filename`, `lineNumbers`, `highlight`, `focus`, `add`, `remove`, and `wrap`. Highlighting happens at compile time through the mdsvex preprocessor; the host does not configure Shiki directly.