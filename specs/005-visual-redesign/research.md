# Phase 0 Research: The Visual Redesign

## Header nav's middle-third span — confirmed feasible only at 768px+

Already resolved and recorded directly in `SPEC.md` S4.3/S4.8 (not
duplicated here): the literal "middle third of the viewport" is
mathematically impossible for the nav below roughly 500px at the new sizes,
measured with real rendered text before committing to the requirement.
Scoped to 768px and up; below that, today's existing centred/fluid-gap
layout is unchanged. This is the one finding from this feature significant
enough to belong in the spec itself, not just the plan.

**Decision**: an inner wrapper inside `<nav>`, `width: 33.333%` centred via
`margin-inline: auto`, with `justify-content: space-between` distributing
the three items — active only inside a `@media (min-width: 768px)` block.
Below that, the nav keeps its current `justify-content: center` and
`gap: clamp(8px, 4vw, 30px)`, untouched.

## Sticky footer and vertical centring — one mechanism, not two

**Decision**: wrap `<slot />` in a `<main>` element inside `Base.astro`.
Make `body` a flex column with `min-height: 100vh`; give `<main>`
`flex: 1 0 auto`.

**Rationale**: this single change satisfies S8.8 (footer pinned to the
viewport bottom on short pages) for *every* page, not just Contact —
`Footer` is the last flex child of a `min-height: 100vh` column, so it
naturally sits at the bottom when content is short and simply follows
content when content is tall. Home's stack, already taller than one
screen, is completely unaffected — the flex column just grows past
`100vh` the way a plain block layout already does today.

Vertical *centring* of content (S7.8, S8.7 — About/Contact only, not Home)
is a second, additive step on the same `<main>`: `display: flex;
flex-direction: column; justify-content: center`, gated behind a new
`centerContent` boolean prop on `Base`. Home passes nothing (default
`false`); About and Contact pass `centerContent={true}`. Both this and the
sticky-footer behaviour are scoped to 768px and up via the same media
query used everywhere else in this redesign — below that, `<main>` is a
plain block, matching every page's current mobile behaviour exactly.

**Alternatives considered**: CSS Grid with named template rows
(`header`/`main`/`footer`) — rejected as more machinery than a three-line
flex change needs for this shape of layout.

## Horizontal narrowing — one wrapper, reused by all three pages

**Decision**: the same `<main>` wrapper introduced above also carries the
middle-third width constraint, via a second new `Base` prop,
`narrowContent` (boolean, default `false`): at 768px and up,
`width: 33.333%; margin-inline: auto`. Home, About, and Contact all pass
`narrowContent={true}` — only `centerContent` differs between them (Home:
`false`; About/Contact: `true`).

**Rationale**: putting this on `Base` rather than duplicating it in three
page-specific stylesheets means the "how wide is the narrow column"
decision exists in exactly one place. Every prior feature in this project
has followed the same instinct (`ContactInfo` extraction, the stack's
single `gap` property) — repeating a width value three times is exactly
the kind of drift Constitution III's spirit warns against, even though
this isn't content.

## Font swap: Vazirmatn replaces Zalando Sans SemiExpanded

**Decision**: add Vazirmatn to `astro.config.mjs`'s `fonts:` array via
`fontProviders.google()`, weights `[300, 400]` (300 for the new default,
400 for the caption title, S9.2/S9.4). Remove the Zalando Sans
SemiExpanded entry and its two `<Font>` render calls in `Base.astro`
entirely — not left in place unused.

**Rationale**: confirmed on Google Fonts before writing this into
`SPEC.md` (a variable font spanning weights 100–900, so both 300 and 400
are directly available — same verification `001-shell` did for the
original two typefaces, and the same lesson from that feature's Fonts API
bug applies here: registering a font in config alone does nothing without
also rendering `<Font cssVariable="..." />` in `<head>`, so both the config
entry and its render call move together as one unit, not independently.

## Caption title: dropping bold for a dedicated face

**Decision**: `Piece.astro`'s `.title` rule changes from `font-weight: 700`
to `font-family: var(--font-caption-title); font-weight: 400; font-size:
20px`, using a new `cssVariable` (`--font-caption-title`) on the same
Vazirmatn font-config entry used for the site default — Vazirmatn is
registered once with `weights: [300, 400]`, and both weights are reachable
through the one `cssVariable`/`<Font>` pair by requesting the weight in
CSS (`font-weight: 400` vs `300`) rather than needing two separate config
entries. `.description` keeps inheriting the S9.2 default (300, 18px) with
no override needed.

**Alternatives considered**: two separate `fonts:` entries (one per
weight) — rejected as unnecessary; a single variable-font registration
with multiple `weights` already produces one `@font-face` per requested
weight under one family name, so plain CSS `font-weight` selects between
them.

## Footer's fixed 80px height

**Decision**: `@media (min-width: 768px) { footer { height: 80px; display:
flex; align-items: center; } }`. Below 768px, no height rule — unchanged
from today's padding-derived height.

**Rationale**: no research needed here beyond confirming this doesn't
conflict with `ContactInfo`'s own internal flex layout (it doesn't — a
fixed-height flex container with `align-items: center` simply centres
`ContactInfo`'s existing two-half row, or the copyright line, inside it).
