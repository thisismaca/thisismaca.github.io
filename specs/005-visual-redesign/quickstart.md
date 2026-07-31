# Quickstart: Validating The Visual Redesign

Prerequisites: Node 24.x, `npm install` already run.

## Setup

```bash
npm run build
npm run preview -- --host
```

## Scenario 1 — Home's narrower, editorial frame (US1)

1. Load `/` at 1024px width.
2. **Expect**: white background; the piece stack sits in a centred column
   measuring roughly a third of the viewport width.
3. **Expect**: no gap between one piece's caption and the next piece's
   image — check by measuring the vertical distance directly; it should
   be effectively zero, with the caption itself carrying 10px of padding
   below its own text.
4. Resize to 767px, then 320px.
   **Expect**: full width returns, no visible side margin, matching
   today's mobile behaviour exactly.

## Scenario 2 — About and Contact, narrowed and centred (US2)

1. Load `/about` at 1024px.
2. **Expect**: content is both horizontally narrowed (same column width as
   Home) and vertically centred within the viewport height.
3. **Expect**: the photo measures 200px tall, 80px wide; body text sits an
   additional 20px further right than the photo's own margin would alone
   explain.
4. Load `/contact` at 1024px.
5. **Expect**: the same narrowing and vertical centring; the footer sits
   at the very bottom of the viewport (not floating above it) if content
   is shorter than the screen.
6. Resize both pages to 767px.
   **Expect**: neither narrowing nor vertical centring applies — full
   width, natural top-to-bottom flow, as before this feature.

## Scenario 3 — Header, footer, and typography (US3)

1. At 1024px, on any page, measure the header nav.
   **Expect**: as a group, the three items span from roughly one-third to
   two-thirds of the viewport width, evenly spaced inside that span; text
   reads at 28px.
2. Load `/`.
   **Expect**: the header shadow is now visible here too — previously
   absent, now identical to `/about` and `/contact`.
3. At 1024px, measure the footer on any page.
   **Expect**: exactly 80px tall, contents vertically centred inside.
4. Resize to 767px.
   **Expect**: the header nav returns to centred with a fluid gap (not
   the middle-third span); the footer returns to its content-derived
   height. Nav text reads at 24px.
5. Inspect body text anywhere except the header menu.
   **Expect**: renders in Vazirmatn, weight 300, 18px — not the previous
   typeface. Inspect a piece's caption title.
   **Expect**: Vazirmatn weight 400, 20px, not bold.

## Scenario 4 — Nothing invisible, nothing broken (cross-cutting)

```bash
grep -ril "<script" dist/
```

**Expect**: no output.

1. Throttle the network in devtools, reload each page.
   **Expect**: no invisible text at any point while fonts load.
2. Resize each page continuously from 320px to 2560px.
   **Expect**: no horizontal scrollbar at any width.

## Done when

Every "Expect" above holds, on all three pages, at both sides of the
768px breakpoint. This closes `PLAN.md` Milestone 6.
