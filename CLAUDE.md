# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development is managed with Vite + pnpm/npm. The package scripts auto-install dependencies if `node_modules/.bin` is missing.

- Install dependencies
  ```bash
  pnpm install
  # or
  npm install
  ```

- Start dev server
  ```bash
  npm run dev
  ```
  Runs `vite --port=3000 --host=0.0.0.0`. The `predev` hook ensures dependencies are present.

- Build for production
  ```bash
  npm run build
  ```
  Runs `vite build`. `prebuild` ensures dependencies are present.

- Lint / type check
  ```bash
  npm run lint
  ```
  Runs `tsc --noEmit`. `prelint` ensures dependencies are present.

Tests are not configured in this repository.

## Architecture Overview

React 19 + Vite 8 single-page landing page with TypeScript. No router; all sections are rendered in one `App` component.

**Entry**
- `src/main.tsx` mounts `<App />` into `#root` and imports `src/styles/main.css`.
- `index.html` is a minimal Vite template with `data-theme="light"` default.

**Core UI**
- `src/App.tsx` contains all UI state and sections:
  - Theme toggle light/dark via `data-theme` on `<html>`
  - Finish/size configurator for the product with price calculation
  - Bag drawer state, quantity updates, checkout simulation
  - Scroll-driven animations with GSAP + ScrollTrigger
  - Smooth scrolling via Lenis, disabled on `prefers-reduced-motion`
  - Hero tilt interaction, pinned 4-angle showcase with clipPath wipes, thermal comparison slider, bento editorial grid, order configurator

**Styling**
- `src/styles/main.css` defines design tokens as CSS variables for light/dark themes, typography via self-hosted DM Sans / DM Mono fonts in `public/assets/fonts/`, and all component styles.
- Theme colors, radius tokens, easing curves (`--ease-out`, `--ease-in-out`, `--ease-drawer`) are centralized in `:root`.

**WebGL / Canvas**
- `src/webgl/heroCanvas.ts` — WebGL2 procedural Alpine light & topographic mist shader. Renders to `#hero-gl-canvas`, reacts to pointer position and theme, skips on reduced motion.
- `src/webgl/specsCanvas.ts` — Canvas2D rotating architectural wireframe / double-wall cross-section for the specs bento tile, speeds up on hover.

**Build tooling**
- `vite.config.ts` enables React plugin, dev server on port 3000 host 0.0.0.0.
- `tsconfig.json` targets ES2022, strict mode, JSX `react-jsx`, `noEmit` for type checking only.

**Public assets**
- `public/favicon.svg`, fonts under `public/assets/fonts/`.
- Untracked demo assets in `public/camisetas/` and `public/logos/` — football shirt images and logos for a future e-commerce variant described in `DESIGN.md`.

## Design System Note

`DESIGN.md` describes a separate brand concept *Fútbol en la Piel* — Uruguayan retro football shirts store with color palette celeste `#0072CE`, dorado `#FDB813`, sangre `#C8102E`, Barlow Condensed / Inter / JetBrains Mono typography, and WhatsApp checkout. The current codebase implements the *Material Flask* water bottle demo. Keep changes consistent with the existing React/GSAP/WebGL structure unless migrating to the football store concept.
