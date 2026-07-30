# Quickstart: Validating The Shell

Prerequisites: Node 24.x, `npm install` already run. See root `PLAN.md` §8
for the whole-site verification table this feature draws its scope from;
below is only the subset this feature is responsible for.

## Setup

```bash
npm run dev -- --host
```

Open the printed local address on desktop, and the printed LAN address on a
phone on the same Wi-Fi (root `PLAN.md` §6 — this replaces per-branch preview
URLs, which GitHub Pages doesn't have).

## Scenario 1 — Navigate all three pages (spec.md US1, SC-001, SC-006)

1. In devtools, set viewport width to 320px.
2. Disable JavaScript (devtools → Settings → Debugger, or the command menu).
3. Load `/`, then `/about`, then `/contact`.
4. **Expect**: on every page, Home/About/Contact render as a single row, no
   wrapping, no hamburger, no horizontal scrollbar. Each item navigates
   correctly with JS off.
5. Tab through each page with the mouse untouched.
   **Expect**: every nav item and the footer's Instagram link receive
   visible focus, in a sensible order, and Enter activates them.

## Scenario 2 — Read as a considered site, not a template (US2, SC-003, SC-005)

1. In devtools, throttle the network to "Slow 3G" and reload each page.
   **Expect**: menu and body text are visible immediately — no blank text,
   no swap from a mismatched fallback font after the real one arrives.
2. Resize the viewport to exactly 767px, then 768px.
   **Expect**: menu item size changes from 16px to 20px at that boundary and
   nowhere else.
3. Load `/`.
   **Expect**: no shadow under the header. Load `/about` and `/contact`.
   **Expect**: a shadow is visible under the header on both.

## Scenario 3 — Find a way to make contact (US3, SC-004)

1. On each of the three pages, scroll to the footer.
   **Expect**: left half shows `thisismaca@gmail.com` as plain text (not a
   link — check it isn't clickable/underlined/coloured as one); right half
   shows `@thisismaca` with a grey Instagram glyph.
2. Activate the Instagram half.
   **Expect**: Instagram opens in a new tab, not the current one.
3. Narrow the viewport to 320px.
   **Expect**: both footer halves stay side by side, shrinking rather than
   stacking.

## Scenario 4 — Continuous resize (SC-002)

1. Slowly drag the viewport width from 320px to 1440px, watching the header
   padding and item gaps continuously.
   **Expect**: smooth change throughout; no visible jump at any point (this
   is what `clamp()` buys — a single snap point usually means a stray
   breakpoint crept in).

## Scenario 5 — Production parity (SC-006)

Dev mode can hide things a real build wouldn't. Check the actual output:

```bash
npm run build
npm run preview -- --host
```

Repeat Scenarios 1–3 against the preview server, then check the build
artifact directly:

```bash
grep -ril "<script" dist/
```

**Expect**: no output — zero matches across all three built pages.

## Done when

Every "Expect" above holds, and the four checklist rows this feature owns in
root `PLAN.md` §8 are ticked: S4.4, S4.5–S4.8, S4.11, S5.4, S11.3, S12.1.
