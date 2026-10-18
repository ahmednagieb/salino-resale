# Salino Project Management (سالينو لإدارة المشروعات) — Project Rules & Design System

## 1. Brand Identity & Core Pillars
**Salino Project Management (سالينو لإدارة المشروعات)** is an integrated corporate powerhouse specializing in three core business sectors:
1. **Internal Transport & Logistics (النقل الداخلي والحلول اللوجستية):** Heavy transport fleets, on-site logistics, port-to-site supply chains, and 24/7 telemetry monitoring.
2. **General Supplies (التوريدات العمومية للمشاريع):** Strategic procurement of building materials, steel, cement, electromechanical components, and finishing packages direct from certified factories.
3. **Real Estate Marketing (التسويق والاستشارات العقارية):** Prime real estate advisory, primary developments, verified resale portfolios, and asset management across Egypt's landmark projects.

---

## 2. Visual DNA & Design Tokens

### Color Palette
- **Pitch Obsidian (Primary Dark Background):** `#000000`
- **Charcoal (Section & Container Background):** `#1F2326`
- **Card Surface (Base Cards & Modals):** `#121517`
- **Elevated Surface (Dropdowns, Hovers & Skeletons):** `#262B2F`
- **Warm Alabaster (Primary Text & Strong Accents):** `#EDEAE4`
- **Muted Stone (Secondary & Helper Text):** `#9A9690`
- **Terracotta Copper (Brand Signature Accent):** `#B8522E`
- **Copper Hover (Interactive States):** `#D16038`
- **Copper Border / Mesh:** `rgba(184, 82, 46, 0.35)`
- **Copper Muted Background:** `rgba(184, 82, 46, 0.15)`

### Geometry & Spacing
- **Card Radius:** `18px` (`rounded-salino` or `rounded-[18px]`)
- **Button Radius:** `9999px` (`rounded-full`)
- **English Subtitle Tracking:** `0.32em` (`tracking-subtitle`)
- **Shadows:**
  - Copper Glow: `0 0 24px -4px rgba(184, 82, 46, 0.4)` (`shadow-copper-glow`)
  - Subtle Card Shadow: `0 8px 30px rgba(0, 0, 0, 0.6)` (`shadow-card-subtle`)

### Typography
- **Arabic Body & Headlines:** `Readex Pro` (`font-ar`, `--font-readex`)
- **English Badges, Numbers & Monograms:** `Montserrat` (`font-en`, `--font-montserrat`)

---

## 3. Engineering Standards
1. **Strict TypeScript:** No `any`, full type definitions for all entities, props, state, and Supabase mutations.
2. **Tailwind Logical Properties:** Always use logical properties for RTL/LTR compatibility (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, `text-end`).
3. **Accessibility (a11y):** Semantic HTML5 elements (`header`, `main`, `section`, `footer`), clear ARIA attributes (`aria-label`, `aria-busy`, `aria-invalid`, `aria-describedby`), and high-contrast accessible focus-visible rings (`ring-2 ring-salino-copper ring-offset-2 ring-offset-salino-obsidian`).
4. **Resilient UI States:** Explicit Loading Skeleton (`ServiceCardSkeleton`), Empty state fallbacks, and user-friendly error banners for all interactive data flows.
5. **Fault-Tolerant Data Layer:** Supabase client with graceful local simulation fallback to prevent app crashes when environment variables are pending.
