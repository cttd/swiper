# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom fork of Swiper focused on the Web Component (`<swiper-container>`, `<swiper-slide>`) implementation. The main output is a customized Swiper element with selected modules.

## Build Commands

```bash
npm install              # Install dependencies
npm run build:custom     # Development build of custom element
npm run build:custom:prod  # Production build of custom element
npm run element:custom   # Run customized element playground with watch
```

Other useful commands:
```bash
npm run lint             # ESLint
npm run format           # Prettier format
npm run validate         # Run lint + format checks
```

## Custom Build Configuration

The custom build is configured in `scripts/custom-build-config.js`. Currently enabled modules:
- virtual, keyboard, mousewheel
- custom-navigation, custom-pagination (custom implementations)
- parallax, a11y, autoplay, free-mode

## Architecture

### Source Structure (src/)

- **core/** - Core slider functionality
  - `core.mjs` - Main Swiper class
  - `defaults.mjs` - Default configuration options
  - `events-emitter.mjs` - Event system

- **modules/** - Feature modules (tree-shakeable)
  - `custom-navigation/` - Custom navigation implementation for this fork
  - `custom-pagination/` - Custom pagination implementation for this fork
  - Other standard Swiper modules

- **shared/** - Shared utilities (DOM helpers, device/browser detection)

- **components-shared/** - Shared logic for element params handling

### Key Custom Element Files

- `src/swiper-element-customized.mjs` - Main custom element implementation
- `src/swiper-element.mjs` - Standard element (not used in custom build)
- `src/swiper-element-bundle.mjs` - Bundle version

### Custom Features in This Fork

- `checkHeight` param - Sets `--swiper-checked-height` CSS variable based on tallest matching element
- `--swiper-slide-size` CSS variable - Automatically set based on slide size
- `composed: true` on swiper events - Events bubble through shadow DOM
- Improved mouse drag support via `touchStartForcePreventDefault`

### Playground

Test the custom element at `playground/element-customized/`. Usage:
```html
<swiper-container navigation loop pagination-type="bullets">
  <swiper-slide>Slide 1</swiper-slide>
</swiper-container>
<script type="module">
  import { register } from 'swiper/element/bundle';
  register();
</script>
```

## Key Conventions

- All source changes go in `src/` only
- Uses ESM modules (.mjs extension)
- Rollup for bundling, Babel for transpilation

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:
1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes
