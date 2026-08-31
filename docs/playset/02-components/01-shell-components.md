---
title: Shell Components
description: Begin from here
---

This document explains the shell components that provide application layout structure in Fractal Styler: AppShell, PageShell, and PageSplit. It covers their responsibilities, prop interfaces, slot definitions, responsive behavior, and how they integrate with the preset system. It also provides usage patterns for nesting and composing shells to build consistent layouts across devices.

## Project Structure
The shell components are thin Svelte wrappers around canonical markup classes. They do not add custom styles; instead, they emit the exact class structure required by the stylesheet so that responsive behavior (rails, drawers, TOC folding) works as designed.

```mermaid
graph TB
subgraph "Components"
A["AppShell.svelte"]
B["PageShell.svelte"]
C["PageSplit.svelte"]
end
subgraph "Styles"
S["_05_shells.sass"]
end
subgraph "Registry & Docs"
R["registry.json"]
D["08-shells-and-markups.md"]
end
A --> S
B --> S
C --> S
A -.-> R
B -.-> R
C -.-> R
A -.-> D
B -.-> D
C -.-> D
```