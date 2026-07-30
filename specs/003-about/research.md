# Phase 0 Research: The About Page

Most of this feature is plain CSS with no framework-specific behaviour.
This file covers the one genuine unknown: how to render a small, fixed-size,
deliberately-cropped photo when `002-content-stack` already set
`image.layout: 'full-width'` globally in `astro.config.mjs` — a setting
built for the piece stack's large, uncropped, viewport-width images, and
wrong for an 80×100px thumbnail.

## Overriding the image layout per-instance

**Decision**: pass `layout="fixed"` and explicit `width={80} height={100}`
directly on this one `<Image>`, overriding the global default for just this
instance.

**Rationale**, read from `node_modules/astro/dist/assets/layout.js` rather
than assumed from the global config's intent:

- The `layout` prop on a component always overrides `astro.config.mjs`'s
  `image.layout` default — confirmed in the config type docs from
  `002-content-stack`'s research ("Can be overridden by the `layout` prop
  on the image component"). No global config change is needed here.
- `getWidths()` branches on `layout`. For `"full-width"` it returns the
  *entire* breakpoint list (eight-to-fifteen sizes) filtered to the source
  image's width — appropriate for a piece filling the viewport, wildly
  excessive for an 80px-wide thumbnail.
- For `"fixed"`, it returns exactly `[width, min(width*2, originalWidth)]`
  — just the 1x and 2x variants of whatever `width` is passed. This is the
  right shape for a small, never-responsive thumbnail: two files, not
  fifteen.
- `"fixed"` requires `width` to be passed — the function returns `[]` with
  no `width` at all, so leaving it unset is not a smaller-scope version of
  full-width, it's silently zero variants.

## Cropping to the specified box

**Decision**: pass both `width={80}` and `height={100}` explicitly (not
inferring one from the other), and set `object-fit: cover` on the `<img>`.

**Rationale**: the source photo is 1066×1895px (ratio ≈0.56); the box
`SPEC.md` S7.2 specifies is 80×100px (ratio 0.8). These don't match, so
some cropping is unavoidable — confirmed as the intended reading in
`spec.md`'s Edge Cases, since S7.2 describes a fixed small footprint, not
an aspect-ratio-preserving one like the piece stack's S6.6. Passing both
dimensions explicitly means neither is inferred from the image's own
aspect ratio (per `002-content-stack`'s research.md on the same
width/height inference logic), so the rendered box is genuinely 80×100
regardless of source shape, and `object-fit: cover` fills it without
distortion.

## Text wrap / stack switch

**Decision**: a CSS float, not a grid or flex layout — `float: left` on
the photo at 768px and up, `float: none` (centred via `margin-inline:
auto`) below it, inside a container with `display: flow-root` so the
float can never visually escape its container regardless of relative
text length.

**Rationale**: this is the one CSS technique that does exactly what S7.3
describes — text continuing to flow in-line around a floated element —
without a component library or a grid template that would need row/column
logic on top of it. `flow-root` is a modern, standards-track replacement
for the old "clearfix" hack; it needs no vendor-specific behaviour and no
JavaScript (Constitution V).

**Alternatives considered**: CSS `shape-outside`/`grid` — rejected as
solving a problem this page doesn't have (an irregularly-shaped wrap
region); a plain float is the direct, simplest match for "text flows
around the photograph."

## Component structure

**Decision**: write the bio and photo directly in `src/pages/about.astro`,
not a separate component.

**Rationale**: unlike `Header`/`Footer`/`Piece`, this markup is used
exactly once and will not repeat. `001-shell`'s own precedent
(`Header.astro`, `Footer.astro`) extracted components specifically because
they're shared across all three routes — About's bio has no second
consumer, so a component here would be an abstraction with one caller.
