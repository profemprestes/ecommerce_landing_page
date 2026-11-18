# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Development is managed with Next.js App Router + `pnpm`.

- Install dependencies
  ```bash
  pnpm install
  ```

- Start dev server
  ```bash
  pnpm run dev
  ```
  Runs `next dev --port 3000`.

- Build for production
  ```bash
  pnpm run build
  ```
  Runs `next build` (Turbopack).

- Start production server
  ```bash
  pnpm run start
  ```

- Type check
  ```bash
  pnpm exec tsc --noEmit
  ```

Tests are not configured in this repository.

## Architecture Overview

Next.js 16 App Router + React 19 + TypeScript storefront for **Fútbol en la Piel** (following `DESIGN.md`).

**Entry & Layout**
- `src/app/layout.tsx` — Root Server layout loading `Barlow Condensed`, `Inter`, and `JetBrains Mono` via `next/font/google`, exporting `metadata`, and importing `src/styles/main.css`.
- `src/app/page.tsx` — Server Component rendering `CatalogShell` (with hoisted `PRODUCTS`), `SizeGuideSection`, and `StoreFooter`.

**Catalog & Components**
- `src/data/catalog.ts` — Typed product inventory (`PRODUCTS`), size measurements in cm, category tabs, `$U` currency formatter, and WhatsApp URL builders.
- `src/components/CatalogShell.tsx` — Client Component managing category/size/last-unit filters and order drawer state with memoized callbacks.
- `src/components/ProductCard.tsx` — Memoized (`React.memo`) Client Component for each `4:5` flat-lay jersey card with per-card size selector, cm measurements, last-unit alert badge, and direct WhatsApp CTA.
- `src/components/OrderDrawer.tsx` — Slide-over drawer for multi-item WhatsApp orders.
- `src/components/SizeGuideSection.tsx` & `src/components/StoreFooter.tsx` — Zero-JS Server Components.

**Styling & Assets**
- `src/styles/main.css` — Light-mode design tokens (`#F8FAFC` / `#FFFFFF` surfaces, `#0072CE` primary celeste, `#FDB813` retro gold, `#C8102E` last-unit alert, `4px` radius).
- `public/camisetas/` — Real flat-lay product photography.
- `public/logos/` — Brand logos (`futbolenlapiel_horizontal_transparente.png`, `futbol_logo_mejorado_v2.png`).
