# Preset Architecture & Core Concepts

This document explains the preset system architecture built around a four-axis design philosophy: Layout, Shape, Color, and Motion. The system applies attribute-based styling on the HTML root element to remap CSS variables that drive visual appearance. It covers how presets are persisted, validated, initialized without flicker, and how they interact with themes and mode (light/dark).

## Project Structure
The preset system is implemented as a framework-free runtime plus a Svelte wrapper, with CSS rules that map attributes to token overrides.

## Core Components
- Four axes define the tuning surface:
  - Layout: controls spacing density via gap and padding scales.
  - Shape: controls corner radii channels.
  - Color: adjusts surface ladder tints for light and dark modes.
  - Motion: sets transition durations and easing curves.
- Attribute contract: data-layout, data-shape, data-color, data-motion on `<html>`. Absent means default.
- State management:
  - Central state object holds current values per axis.
  - Validation ensures only allowed values are applied.
  - Persistence stores non-default values in localStorage.
- Anti-flicker initialization:
  - A small inline script runs before first paint to stamp saved attributes and theme class onto `<html>`.
- Theme integration:
  - Themes are classes on `<html>`, paired with data-mode.
  - Color presets override surface tokens after themes so user choice wins.
