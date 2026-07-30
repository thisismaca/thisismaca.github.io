# Quickstart: Validating The About Page

Prerequisites: Node 24.x, `npm install` already run.

## Setup

```bash
npm run build
npm run preview -- --host
```

Built output, not the dev server — the photo's cropping and generated
widths are build-time concerns.

## Scenario 1 — The real bio renders (US1, SC-001)

1. Load `/about`.
2. **Expect**: both paragraphs of the bio render in full, unedited —
   including "Virgil Finlay, Richey Beckett, Peeter Baltens, the 2013
   Tumblr aesthetic and nature" as running text, not a separate list.
3. **Expect**: background white, body text black (S7.1, S7.5).
4. **Expect**: the header shadow is visible, same as `/contact` and
   unlike `/` (S7.6 regression check — this feature shouldn't change it).

## Scenario 2 — Wrap layout at 768px and up (US2, SC-002)

1. Set viewport width to 768px.
2. **Expect**: the photo sits at the top left, roughly 80px wide by 100px
   tall, with a small margin visible on every side.
3. **Expect**: the first lines of body text appear beside the photo, at
   the same vertical position — not pushed below it. Later lines, once
   past the photo's height, span the full width.

## Scenario 3 — Stacked layout below 768px (US2, SC-003)

1. Set viewport width to 767px, then 320px.
2. **Expect**: the photo is horizontally centred, and every line of body
   text appears below it — none beside it at any point.
3. **Expect**: no horizontal scrollbar at either width (S11.3).

## Scenario 4 — The source link works (US3, SC-004)

1. Locate the source-code mention in the second paragraph.
2. **Expect**: it is a real `<a>` element (inspect it), not styled
   identically to plain text — the browser's default underline should
   still be visible even though link colour inherits black.
3. Activate it. **Expect**: it points to
   `https://github.com/thisismaca/thisismaca.github.io`.

## Scenario 5 — Production parity (project-wide invariant)

```bash
grep -ril "<script" dist/
```

**Expect**: no output.

## Done when

Every "Expect" above holds, and `/about` no longer shows an empty body —
the last state it was left in by `001-shell`.
