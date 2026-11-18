---
name: Fútbol en la Piel
description: "Tienda uruguaya de camisetas retro, de colección y actuales con stock real disponible, talles verificados y compra directa por WhatsApp con envíos a todo el país."
theme:
  color_mode: LIGHT
  font: BARLOW # Barlow Condensed (Display) + Inter (Body) + JetBrains Mono (Specs/Talles)
  roundness: ROUND_FOUR # 4px base en tarjetas, inputs y badges
  custom_color: "#0072CE" # Celeste / Azul uruguayo (4.92:1 con texto blanco)
  saturation: 10

colors:
  # Superficies y Lienzo (base clara para destacar fotos flat-lay sobre césped)
  surface: "#F8FAFC"
  surface-dim: "#E2E8F0"
  surface-bright: "#FFFFFF"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#F1F5F9"
  surface-container: "#E2E8F0"
  surface-container-high: "#CBD5E1"
  surface-container-highest: "#94A3B8"

  # Tipografía y Contenido
  on-surface: "#0F172A"          # Texto principal (Negro tinta / marino profundo)
  on-surface-variant: "#475569"  # Metadatos, versión de camiseta, medidas en cm

  # Primario: Celeste / Azul Uruguayo
  primary: "#0072CE"             # Acción principal y foco activo
  on-primary: "#FFFFFF"
  primary-container: "#E0F2FE"
  on-primary-container: "#0369A1"

  # Secundario: Dorado / Sol de Mayo (Colección Retro y Destacados)
  secondary: "#FDB813"           # Badges de colección retro / edición especial
  on-secondary: "#0F172A"
  secondary-container: "#FEF08A"
  on-secondary-container: "#854D0E"

  # Acento / Alerta: Sangre / Garra (Últimas unidades y errores)
  tertiary: "#C8102E"            # Alerta de último talle / stock crítico
  outline: "#CBD5E1"
  outline-variant: "#94A3B8"
---

# Design System: Fútbol en la Piel

## 1. Brand & Personality
- **Tono y Voz:** Directo, futbolero, uruguayo y transparente. Comunica con datos concretos de prenda (equipo, temporada, marca, versión, talles disponibles y precio en `$U`), evitando relleno editorial. Sin noticias, sin podcasts, sin comunidad ni contenido ajeno a la venta de stock real.
- **Atmósfera:** Estética deportiva contemporánea de alto contraste sobre lienzo claro (`#F8FAFC` / `#FFFFFF`), diseñada para que la fotografía real de producto (*flat-lay* limpio sobre césped sintético verde, sin filtros ni grano artificial) sea la protagonista absoluta.

## 2. Typography Hierarchy
- **Display / Titulares:** Bold/Black, condensada, mayúsculas para titulares de catálogo, nombres de camiseta y precios en `$U` (`Barlow Condensed`).
- **Body / Lectura:** Sans-serif neutral y legible para descripciones cortas de versión (*Retro Colección*, *Versión Jugador*, *Fan*, *Golero*), envíos y aclaraciones de talle (`Inter`).
- **Mono / Data:** Para talles (`S`, `M`, `L`, `XL`, `XXL`), medidas en cm, precios alineados y códigos de stock (`JetBrains Mono`).

## 3. UI Components & Layout Principles
- **Grid & Spacing:** Retícula estricta de `4px / 8px` con márgenes generosos, tarjetas de proporción estable (`4:5` en foto de producto) y filtros de stock y talle visibles sin scroll innecesario.
- **Tarjetas de Producto:** Tarjetas limpias (`ROUND_FOUR` / `4px`) con badge de época o versión (ej. *Retro 93–95*, *Versión Jugador*, *2026*), selector rápido de talles disponibles (talles agotados tachados y deshabilitados) y botón de acción directa a WhatsApp con mensaje prearmado.
- **Acciones y Botones:**
  - Primario: Fondo `#0072CE` con texto `#FFFFFF` (contraste AA) para acciones principales de catálogo y navegación; variante directa a WhatsApp desde cada prenda.
  - Secundario / Oro: Destacados de línea *Retro / Colección* en `#FDB813` con texto `#0F172A`.
  - Tags / Badges: Pastillas angulares (`4px`) en mayúsculas pequeñas; `#C8102E` reservado exclusivamente para alertas de última unidad o talle único.
