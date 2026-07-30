# Quickstart: Validating Content Pieces and the Stack

Prerequisites: Node 24.x, `npm install` already run. See root `PLAN.md` §8
for the whole-site verification table; below is only what this feature owns.

## Setup

```bash
npm run build
npm run preview -- --host
```

Built output, not the dev server — S12.3's multiple widths and S6.12's
layout-shift behaviour are build-time concerns dev mode can mask.

## Scenario 1 — The stack renders the real work (US1, SC-001)

1. Load `/`.
2. **Expect**: five piece units, in order (Kirk Hammett, Mario Duplantier,
   Jean-Michel Labadie, Rex Brown, Phil Anselmo). Each image spans full
   viewport width; its caption sits flush beneath it with no gap between
   image and caption, and a visible gap before the *next* piece's image.
3. **Expect**: each caption shows its bold title, its description below,
   and that piece's own background/text colours — five visibly different
   caption treatments, not one shared style.

## Scenario 2 — Fast, stable loading (US2, SC-002, SC-003)

1. Open devtools → Network, throttle to "Slow 3G", reload `/`.
2. **Expect**: the first image (Kirk Hammett) starts downloading
   immediately. Scroll down slowly and watch the Network panel — later
   images should not start downloading until they're close to the
   viewport.
3. While scrolling, watch for any visible jump as each image finishes
   loading. **Expect**: none — space was already reserved.
4. Inspect the first `<img>`'s attributes in devtools.
   **Expect**: `loading="eager"`, `fetchpriority="high"`. Inspect any other
   piece's `<img>`. **Expect**: `loading="lazy"`, no `fetchpriority`.

## Scenario 3 — Responsive widths actually exist (SC-004)

```bash
find dist/_astro -iname "*kirk-hammett*"
```

**Expect**: more than one file — several widths of the same source image,
not a single re-encoded copy. Repeat for another piece if in doubt.

## Scenario 4 — Contrast holds for every pair (SC-005)

```bash
node scripts/check-contrast.mjs
```

**Expect**: all five pairs report `PASS` at 4.5:1 or better. This script is
the one referenced in `PLAN.md` §8 — run it against any new piece's colours
before adding the file, not after.

## Scenario 5 — Adding a piece is one file (US3, SC-006)

1. Duplicate any existing piece file under `src/content/pieces/` with a new
   name, change its `title`, `order` (e.g. `6`), and swap the image
   reference to any other image already in `src/assets/pieces/` (reusing
   one is fine for this check — the point is proving the mechanism, not
   adding real content).
2. `npm run build`.
3. **Expect**: the build succeeds and the new piece appears in the stack at
   position 6, with no other file touched.
4. Delete the test file and rebuild to confirm the stack returns to five.

## Scenario 6 — A missing `alt` fails loudly (FR-002/S2.2)

1. Temporarily delete the `alt:` line from any one piece file.
2. `npm run build`.
3. **Expect**: the build fails with a schema validation error naming the
   file, not a silent pass. Restore the line afterward.

## Scenario 7 — No horizontal scroll, no script tags (SC-006, SC-007)

```bash
grep -ril "<script" dist/
```

**Expect**: no output. Then resize the browser continuously from 320px to
2560px on `/`. **Expect**: no horizontal scrollbar at any point.

## Done when

Every "Expect" above holds, and the `S2.1`, `S2.2`, `S6.7`–`S6.12`, `S12.3`,
`S12.4` rows in root `PLAN.md` §8 are ticked.
