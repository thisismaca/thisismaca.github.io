# Phase 0 Research: The Shell

Most technical decisions for this feature were already made at the whole-repo
level in root `PLAN.md` §1 and are inherited rather than re-researched here:
Astro 7.1.6 on Node 24.18.0 LTS, plain CSS with custom properties (no utility
framework), and images imported from `src/assets/` — the last of which this
feature doesn't touch, since it ships no images. This file covers only what
was genuinely unresolved going into this feature.

## Font delivery: Astro's Fonts API

**Unknown going in** (`PLAN.md` §1.4): "Verify both faces are available
through it before committing; Grenze Gotisch and Zalando Sans SemiExpanded
are both Google fonts, so they should be, but 'should be' is not 'is'."

**Decision**: Use Astro 7's built-in Fonts API — a `fonts` array in
`astro.config.mjs` — with `fontProviders.google()` for both typefaces,
registering the family names exactly as they appear on Google Fonts:
`"Grenze Gotisch"` and `"Zalando Sans SemiExpanded"`.

**Rationale**: Confirmed 2026-07-30, both directly against Google's own
Fonts listings:

- **Grenze Gotisch** is a static family with 9 weights (100–900), so weight
  500 (S9.1) is a real, directly-selectable weight — no variable-font axis
  interpolation needed.
- **Zalando Sans SemiExpanded** is registered on Google Fonts as its own
  distinct family, not a named instance or width-axis setting of the parent
  "Zalando Sans" family. That matters for the Fonts API, which registers by
  family name — had it been an axis of the parent, the config would need
  variable-font instance selection instead of a plain family lookup. It's a
  variable font in its own right (weights 200–900), so weight 400 ("regular,"
  S9.2) is covered.
- The Fonts API is **stable** in Astro 7, not experimental. It self-hosts
  the font and generates a metric-matched fallback automatically, which is
  what satisfies S9.3 (no invisible text while loading) without any manual
  `font-display` or preload work.

**Correction, discovered during implementation (T011)**: registering a font
in `astro.config.mjs`'s `fonts:` array only makes it *available* — it does
not, by itself, emit any `@font-face` rule or define the `cssVariable` as
an actual CSS custom property anywhere. Referencing `var(--font-menu)` in a
component's `<style>` with nothing else done resolves to nothing, and
because an unresolved `var()` invalidates the whole property at
computed-value time, the browser fell back to its default serif font
(observed as `"Times New Roman"`) rather than even reaching the `sans-serif`
fallback in the same declaration.

The font must additionally be **rendered** once per page via the `Font`
component from `astro:assets` (`node_modules/astro/components/Font.astro`
in this installed version) — that render is what emits the `@font-face`
rules, the fallback `@font-face`, and the `:root { --font-menu: ...}`
declaration into the page's CSS:

```astro
import { Font } from 'astro:assets';
// in <head>:
<Font cssVariable="--font-menu" preload />
```

Done in `src/layouts/Base.astro` so every page gets it once, rather than
per-component. Confirmed by inspecting the built `dist/about/index.html`
directly rather than trusting documentation a second time: `@font-face` and
the metric-matched fallback (`size-adjust`, `ascent-override`, etc.) are
present, and computed styles in-browser show `16px` at 767px and `20px` at
768px with the real font family resolved.

**Alternatives considered**:

- `fontProviders.fontsource()` — Fontsource also mirrors both faces. Rejected
  only because the Google provider needs no extra package install and
  Fontsource would add one for no behavioural difference.
- `fontProviders.local()` with manually downloaded font files — rejected as
  unneeded ceremony when a first-party provider already covers both faces
  under their exact names.

**Remaining risk not resolved here**: whether Grenze Gotisch stays legible at
16px on a real phone screen (`PLAN.md` §9, risk 1) is a design judgment, not
a technical unknown, and can only be checked by looking at it. If it fails,
the fix is a `SPEC.md` amendment to S9.1 — out of scope for this plan.

## Testing approach

**Decision**: No automated test framework. Verification is manual, run
against this feature's `quickstart.md` and the relevant rows of root
`PLAN.md` §8. This matches the project as a whole (`CLAUDE.md`: "no test
runner and no linter") — the site is three static routes with no logic to
unit-test; what needs checking is rendered layout and behaviour, which is
what the quickstart's browser-based steps do directly.

**Alternatives considered**: a visual-regression tool (e.g. Playwright
screenshot diffing). Rejected for this milestone as disproportionate to three
pages of static chrome; worth reconsidering once the piece stack (Milestone
3) makes manual pixel-checking more tedious.
