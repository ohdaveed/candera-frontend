# Design System — Candera

_Created by /design-consultation · Approved mockup: Variant C · 2026-05-10_

## Product Context

- **What this is:** A luxury botanical candle storefront — hand-poured, micro-batch, high desert origin
- **Who it's for:** The spiritual/ritual buyer who treats scent as a practice, not decoration (Otherland, Boy Smells territory)
- **Space/industry:** Premium DTC home goods / wellness / botanical
- **Project type:** Headless e-commerce storefront (React + Vite)
- **Memorable thing:** "This feels like a ritual, not a purchase" — every design decision serves this sentence

## Aesthetic Direction

- **Direction:** Mineral stillness with botanical warmth
- **Decoration level:** Intentional — subtle grain texture on key surfaces, no pattern fills, no decorative blobs. Texture as material evidence of handcraft.
- **Mood:** Sun-bleached, hand-touched, unhurried. A site that knows you'll wait for it. Not cold luxury — warm, grounded, slightly sacred.
- **Approved visual reference:** `/c/Users/david/.gstack/projects/ohdaveed-candera-frontend/designs/design-system-20260510/variant-C.png`

## Color

**Approach:** Restrained — palette tells the same story as the product. High desert, not spa.

| Token              | Hex       | Usage                                                                         |
| ------------------ | --------- | ----------------------------------------------------------------------------- |
| `candera-vellum`   | `#F5F2ED` | Primary content background — warm aged cream                                  |
| `candera-field`    | `#D8D5CC` | Feature panel background — the sage-olive left panel (from approved mockup)   |
| `candera-obsidian` | `#141412` | Primary text — deeper than current #1A1A1B, less blue-black                   |
| `candera-sage`     | `#7A8174` | Secondary text, muted labels — field-dried, not spa-green                     |
| `candera-stone`    | `#C8BAA6` | Borders, dividers — desaturated and mineral                                   |
| `candera-ash`      | `#E2DDD6` | Quiet UI moments, section breaks                                              |
| `candera-ember`    | `#D67B62` | Warm accent — Inner Circle CTAs, hover states, ritual moments. Use sparingly. |

**Dropped:** Lavender `#9A91A4` — reads spa-generic, not high desert. Remove from codebase.

**Dark mode strategy:** Invert: obsidian as background surface, vellum as text, ember accent stays. Not currently implemented — design for it intentionally when adding.

### CSS Implementation (Tailwind v4 @theme)

```css
@theme {
  --color-candera-vellum: #f5f2ed;
  --color-candera-field: #d8d5cc;
  --color-candera-obsidian: #141412;
  --color-candera-sage: #7a8174;
  --color-candera-stone: #c8baa6;
  --color-candera-ash: #e2ddd6;
  --color-candera-ember: #d67b62;
}
```

## Typography

**Approach:** Three specific fonts, each with a defined role. No Inter anywhere.

| Role                  | Font          | Source       | Usage                                                                                                                                                         |
| --------------------- | ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display/Hero          | **Fraunces**  | Google Fonts | Wordmark, hero headings, product names at large scale. Variable optical-size — use `font-optical-sizing: auto`. At hero scale it reads pressed, not rendered. |
| Editorial/Pull quotes | **Cormorant** | Google Fonts | Ritual page, About, scent descriptions in italic, pull quotes. Narrow and devotional.                                                                         |
| Body/UI               | **DM Sans**   | Google Fonts | All body copy, nav, labels, prices, buttons. Tabular nums for vessel numbers and prices: `font-variant-numeric: tabular-nums`.                                |

**Font blacklist for this project:** Inter (removed), Playfair Display (replaced by Fraunces), system-ui as primary.

### Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Cormorant:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300..500;1,9..40,300..500&display=swap"
  rel="stylesheet"
/>
```

### Tailwind @theme

```css
@theme {
  --font-display: "Fraunces", serif;
  --font-editorial: "Cormorant", serif;
  --font-sans: "DM Sans", sans-serif;
}
```

### Type Scale (modular 1.25 — Major Third)

| Step        | Size            | Usage                                                |
| ----------- | --------------- | ---------------------------------------------------- |
| `text-xs`   | 0.64rem / ~10px | Vessel numbers, tracking-widest labels               |
| `text-sm`   | 0.8rem / ~13px  | Nav links, captions, timestamps                      |
| `text-base` | 1rem / 16px     | Body copy                                            |
| `text-lg`   | 1.25rem / 20px  | Lead paragraphs, product subtitles                   |
| `text-xl`   | 1.563rem / 25px | Section headings (DM Sans)                           |
| `text-2xl`  | 1.953rem / 31px | Page headings                                        |
| `text-3xl`  | 3rem / 48px     | Display headings (Fraunces)                          |
| `text-hero` | 4.5rem–6rem     | Hero wordmark / hero headline (Fraunces, opsz large) |

## Spacing

- **Base unit:** 8px
- **Density:** Generous — ritual brands need breathing room
- **Scale:** 2(2px) · 4(4px) · 8(8px) · 12(12px) · 16(16px) · 24(24px) · 32(32px) · 48(48px) · 64(64px) · 96(96px) · 128(128px)
- **Section rhythm:** Minimum 96px between page sections. The site should feel like turning pages, not scrolling a feed.

## Layout

- **Approach:** Hybrid
  - **Homepage:** Editorial-first. The Variant C two-panel structure: sage-field left panel with full-bleed candle photography and CANDERA wordmark, vellum right panel with product story. One featured vessel above the fold.
  - **Collection:** Spare 2-column grid (not 4-column). Breathing room between vessels. Each card is tall, image-dominant.
  - **Product page:** Vertical editorial. Large photography first. Scent notes and botanical description in Cormorant italic. Price and add-to-cart appear below the narrative — the product earns its cost before asking.
  - **Ritual / About:** Strict single-column, full-width text blocks in Cormorant. Reads like a field journal.
- **Max content width:** 1280px
- **Grid:** 12 columns at desktop, 4 at mobile
- **Panel split:** 45% / 55% (field / vellum) on editorial pages

## Border Radius

Nearly-square throughout. No bubble-radius.

| Element | Value                           |
| ------- | ------------------------------- |
| Buttons | `0px` — hard square             |
| Cards   | `2px`                           |
| Images  | `0px` — full bleed or hard crop |
| Inputs  | `2px`                           |
| Badges  | `2px`                           |

## Motion

- **Approach:** Intentional — ritual is solemn, not bouncy
- **No:** spring physics, bounce, scale-up entrances, hover lifts
- **Yes:** slow opacity fades, deliberate y-translate entrances, scroll-driven reveals on Ritual page
- **Easing:** enter `cubic-bezier(0.4, 0, 0.2, 1)` · exit `cubic-bezier(0.4, 0, 1, 1)`
- **Duration:** micro `100ms` · entrance `800–1200ms` · section reveal `1000ms`
- **Existing Framer Motion setup is correct** — the 0.8–0.9s duration with y:10→0 and opacity:0→1 is the right pattern. Formalize as the standard entrance across all pages.

## Key Design Decisions (Risks Taken)

| Decision                             | What we're departing from                                                                                    | Why it serves the brief                                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Fraunces over Playfair Display       | Playfair is the default luxury serif — every boutique hotel, botanical brand, and artisan food brand uses it | Fraunces reads micro-batch and hand-pressed. It has character at hero scale that Playfair Display doesn't.                                                         |
| Ember accent (#D67B62) over lavender | Lavender reads spa-wellness-generic                                                                          | Terracotta/ember reads high desert, fire, warmth. The palette now tells the same story as the product.                                                             |
| Price deferred on product pages      | Standard e-commerce: hero photo + title + price + add-to-cart                                                | The ritual description, botanical notes, and photography come first. The product earns its cost. Price and CTA appear after the narrative. "Ritual, not purchase." |
| 2-column collection grid             | 3- or 4-column product grids are the e-commerce default                                                      | Breathing room. Fewer items per row means each vessel gets attention, not comparison.                                                                              |

## Decisions Log

| Date       | Decision                                | Rationale                                                                                                                                    |
| ---------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-10 | Initial design system created           | /design-consultation, approved Variant C (sage-olive two-panel editorial direction)                                                          |
| 2026-05-10 | Replaced Inter with DM Sans             | Inter is the "I gave up on typography" signal. DM Sans has the same readability with more warmth and no SaaS baggage.                        |
| 2026-05-10 | Replaced Playfair Display with Fraunces | Fraunces has the optical-size variable axis that makes it feel pressed at hero scale. Playfair Display is the generic luxury default.        |
| 2026-05-10 | Dropped lavender, added field + ember   | Lavender doesn't fit high desert. Field (#D8D5CC) is the sage-panel from the approved mockup. Ember (#D67B62) is the warm terracotta accent. |
