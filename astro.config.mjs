// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // User site (thisismaca.github.io) — serves from the root, so no `base`.
  // See PLAN.md §6.1 and §6.2 for why, and what site: becomes once the
  // custom domain is live.
  site: 'https://thisismaca.github.io',

  // SPEC.md S9.1/S9.2 — menu type and body type. Confirmed against Google
  // Fonts 2026-07-30 (specs/001-shell/research.md): Grenze Gotisch is a
  // static family (weight 500 exists directly); Zalando Sans SemiExpanded
  // is its own family, not an axis of "Zalando Sans". Astro's Fonts API
  // self-hosts and generates a metric-matched fallback automatically,
  // which is what satisfies S9.3 (no invisible text while loading).
  fonts: [
    {
      name: 'Grenze Gotisch',
      cssVariable: '--font-menu',
      provider: fontProviders.google(),
      weights: [500],
    },
    {
      name: 'Zalando Sans SemiExpanded',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400],
    },
  ],

  // SPEC.md S6.6/S12.3. layout: 'full-width' is what makes an image scale
  // to its container without cropping (S6.6) — the default layout is
  // "none", which silently skips responsive width generation entirely
  // (specs/002-content-stack/research.md), so this line is load-bearing,
  // not cosmetic.
  image: {
    layout: 'full-width',
    responsiveStyles: true,
  },
});
