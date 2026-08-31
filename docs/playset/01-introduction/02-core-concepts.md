---
title: Core Concepts
description: as they say
---

Fractal Styler is a composition-first styling system where every visual decision is a modular fractal: tokens seed dimensions, dimensions seed containers, containers seed layouts, layouts seed shells, and shells are dressed by visuals. The class registry is the public API; you compose in markup and do not write traditional stylesheets. It ships as plain CSS or SASS-generated CSS from the same source, ensuring zero-runtime bloat while preserving full control over themes, presets, and responsive behavior.

The mental model is intentionally layered:
- L0 Tokens: semantic colors, fluid typography and spacing scales, motion and shape tokens.
- L1 Dimensions: gaps, padding, margins, radii, literal pixel utilities, and responsive bands.
- L2 Containers: flow primitives (box, row, grid) with strict physical X/Y alignment.
- L3 Layouts: harmonic grids, prose measure, frames, scroll reels.
- L4 Shells: canonical application and page scaffolding with role-bound sidebars and overlays.
- L5 Visuals & Interactions: surfaces, ink, borders, controls, and interaction states.

This approach replaces stylesheet authoring with markup composition, guided by a design token engine and four runtime preset axes (layout density, shape sharpness, color contrast, motion physics).

## Project Structure
At a high level, Fractal Styler’s documentation and implementation align with the L0–L5 layers:
- Documentation chapters map directly to each layer, providing reference material and examples.
- The registry documents every class, its layer, property, source file, and example usage.
- The runtime entry exposes metadata, theme helpers, and preset APIs for framework integrations.
