# Feature Specification: The Visual Redesign

**Feature Branch**: `005-visual-redesign`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "The visual redesign. Not part of the original build order — Milestones 0-5 already shipped a fully verified launch state. This is a deliberate second pass at the site's identity, requested by the site owner after seeing it live."

**Relationship to `SPEC.md`**: this feature does not define new requirements. It implements the amendments in `SPEC.md` draft 4 (repo root). Every requirement below cites the numbered clause it implements; where `SPEC.md` and this document ever disagree, `SPEC.md` wins.

**Relationship to `PLAN.md` §7**: this is Milestone 6, added after Milestones 0–5 closed. Built as one feature rather than split, since every part of the redesign arrived in a single request as one coherent design decision — unlike the Milestone 2/3 merge or the Milestone 4 split, both driven by content literally arriving at different times.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the work in a narrower, more editorial frame (Priority: P1)

A visitor on a large screen loads Home and sees the piece stack no longer
stretching edge to edge on a dark background — it now sits in a centred
column against white, with pieces running flush into each other rather
than separated by visible gaps.

**Why this priority**: Home is the site's actual purpose — the gallery a
commissioner arrives to see (`SPEC.md` §1). This is the single highest-value
change in the redesign; every other page's treatment follows from it.

**Independent Test**: Load `/` at 1024px+ and confirm white background,
a centred column roughly a third of the viewport wide, and no gap between
one piece's caption and the next piece's image.

**Acceptance Scenarios**:

1. **Given** a visitor on `/` at 768px or wider, **When** the page loads,
   **Then** the background is white and the piece stack is horizontally
   centred, constrained to roughly the middle third of the viewport width
   (S6.2, S6.13).
2. **Given** the same visitor, **When** they view any piece unit, **Then**
   its image spans the full width of that centred column — not the full
   viewport — and nothing is cropped (S6.6).
3. **Given** the same visitor, **When** they scroll past one piece's
   caption into the next piece's image, **Then** there is no visible gap
   between them; the caption instead carries its own bottom padding
   (S6.14).
4. **Given** a visitor below 768px, **When** the page loads, **Then** the
   stack returns to full width with no visible margin — today's mobile
   behaviour, unchanged (S6.13).

---

### User Story 2 - About and Contact feel centred and considered (Priority: P2)

The same visitor clicks through to About or Contact and finds the same
narrower framing, but centred vertically too, since both pages are short
enough to fit inside a single screen.

**Why this priority**: Depends on Story 1's width mechanism existing but is
independently valuable and breakable — About/Contact could easily get the
width change without the vertical centring, or vice versa.

**Independent Test**: Load `/about` and `/contact` at 1024px+ and confirm
both the horizontal narrowing and vertical centring; confirm neither
applies below 768px.

**Acceptance Scenarios**:

1. **Given** a visitor on `/about` at 768px or wider, **When** the page
   loads, **Then** its content is both horizontally constrained to the
   middle third of the viewport and vertically centred within the
   viewport height (S7.8).
2. **Given** the same visitor, **When** they look at the photo, **Then**
   it is 200px tall (grown from 100px), still 80px wide, and the body
   text carries an additional 20px of left padding beyond the photo's own
   margin (S7.2, S7.9).
3. **Given** a visitor on `/contact` at 768px or wider, **When** the page
   loads, **Then** its content is likewise narrowed and vertically
   centred (S8.7), and the footer stays pinned to the bottom of the
   viewport rather than floating partway up the page (S8.8).
4. **Given** either visitor below 768px, **When** the page loads,
   **Then** neither the narrowing nor the vertical centring applies —
   full width, natural document flow, as before this feature.

---

### User Story 3 - Notice the refined chrome and type (Priority: P3)

The same visitor, on any page, sees a header whose menu now spans a
deliberate width and reads larger, a shadow beneath it everywhere rather
than only on two of three pages, a footer with a consistent height on
large screens, and body text set in a different typeface throughout.

**Why this priority**: These are real, visible changes, but they're
finishing details layered on top of Stories 1–2's structural changes —
independently testable and independently breakable, but not the reason a
visitor would notice the redesign first.

**Independent Test**: Load any page at 768px+ and confirm the header nav
span, its shadow, the footer height, and the body typeface.

**Acceptance Scenarios**:

1. **Given** a visitor on any page at 768px or wider, **When** the header
   renders, **Then** the three nav items, as a group, span from one-third
   to two-thirds of the viewport width, evenly spaced within that span
   (S4.3, S4.8), and read larger than before (28px, up from 20px) (S9.1).
2. **Given** the same visitor, **When** they look at the header on `/`,
   **Then** a shadow is visible beneath it — previously absent there, now
   identical to `/about` and `/contact` (S4.11).
3. **Given** the same visitor, **When** they reach the footer, **Then**
   it has a fixed height of 80px with its contents centred inside —
   unchanged below 768px (S5.8).
4. **Given** the same visitor, **When** they read any body text, **Then**
   it renders in the new default typeface, not the previous one — except
   the header menu, which keeps its original typeface, and each piece's
   caption title, which has its own distinct treatment (S9.2, S9.4).

---

### Edge Cases

- What happens to the piece stack's per-piece caption colours (`S6.5`)
  now that the surrounding page background is white instead of dark?
  Nothing — caption colours are per-piece fields, independent of the page
  background, and this feature doesn't touch them.
- What happens if About or Contact's content is ever long enough to
  exceed the viewport height, given they're now meant to vertically
  centre? Vertical centring only has an effect when content is shorter
  than the viewport; once it's taller, the page simply scrolls, the same
  way it always has.
- What happens to the site's single breakpoint rule (`S11.1`) with this
  many new large/small distinctions introduced? All of them use the
  existing 768px line — no second breakpoint is introduced anywhere in
  this feature.
- What happens to the retired typeface (Zalando Sans SemiExpanded) and
  colour (`#444444`)? Both are fully removed, not just unreferenced —
  the font is dropped from the font-loading configuration entirely, and
  the colour is removed from the palette.

## Requirements *(mandatory)*

### Functional Requirements

**Header**

- **FR-001** (S4.3, S4.8): The three nav items, as a group, MUST span the
  horizontal middle third of the viewport, distributed evenly within that
  span rather than separated by a fixed gap.
- **FR-002** (S9.1): Menu text MUST render at 28px from 768px up and 24px
  below, in Grenze Gotisch weight 500 — unchanged font and weight, larger
  sizes.
- **FR-003** (S4.11): The header shadow MUST be visible on all three
  pages identically. No page-specific toggle remains.

**Footer**

- **FR-004** (S5.8): At 768px and up, the footer MUST have a fixed height
  of 80px with its contents vertically centred inside. Below 768px, its
  height MUST remain unchanged — a consequence of padding and content,
  not set directly.

**Home**

- **FR-005** (S6.2): The Home page background MUST be white, replacing
  the previous `#444444`.
- **FR-006** (S6.13): At 768px and up, the piece stack MUST be
  horizontally centred and constrained to the middle third of the
  viewport width. Below 768px, it MUST return to full width.
- **FR-007** (S6.6): Each image MUST span the full width of its content
  column (full viewport below 768px, the middle third at 768px and up),
  uncropped, with no imposed height.
- **FR-008** (S6.14): No gap MUST exist between one piece unit and the
  next. Each caption MUST instead carry 10px of padding below its own
  content.
- **FR-009** (S6.4, S9.4): Each piece's caption title MUST no longer be
  bold — it MUST use its own distinct typeface treatment instead (see
  Typography below).

**About**

- **FR-010** (S7.2): The photo MUST be 200px tall (grown from 100px),
  width unchanged at 80px.
- **FR-011** (S7.8): At 768px and up, About's content MUST be both
  horizontally constrained to the middle third of the viewport and
  vertically centred within the viewport height. Below 768px, neither
  MUST apply.
- **FR-012** (S7.9): Body text MUST carry an additional 20px of left
  padding, independent of the photo's own 5px margin.

**Contact**

- **FR-013** (S8.7): At 768px and up, Contact's content MUST receive the
  same horizontal-narrowing-and-vertical-centring treatment as About.
- **FR-014** (S8.8): The footer MUST stay pinned to the bottom of the
  viewport when page content is shorter than the screen, and MUST behave
  normally (follow the content) once content exceeds viewport height.

**Typography**

- **FR-015** (S9.2): The default typeface for all text except the header
  menu MUST change to Vazirmatn, weight 300 (Light), 18px. The previous
  default typeface MUST be removed from the font-loading configuration
  entirely — not merely unused.
- **FR-016** (S9.4): Each piece's caption title MUST use Vazirmatn,
  weight 400 (Regular), 20px, distinct from its description (which uses
  the FR-015 default).
- **FR-017** (S9.3): No text MUST be invisible while fonts load — this
  guarantee MUST hold for both remaining typefaces (Grenze Gotisch,
  Vazirmatn).

**Cross-cutting**

- **FR-018** (S11.1): No requirement in this feature MUST introduce a
  breakpoint other than the existing 768px line.
- **FR-019** (S12.1, Constitution V): No requirement in this feature MUST
  be implemented with JavaScript. Every behaviour described above is
  achievable in CSS alone.

## Key Entities

None — this feature changes layout, colour, and typography across
existing pages and components. It introduces no data model.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At 768px and up, Home's background is white and its piece
  stack measures roughly one-third of the viewport width, centred.
- **SC-002**: At 768px and up, no gap is measurable between any piece
  unit and the next; each caption's own bottom padding measures 10px.
- **SC-003**: At 768px and up, About and Contact are both horizontally
  narrowed to roughly a third of the viewport and vertically centred
  within the viewport height; below 768px, neither page shows either
  effect.
- **SC-004**: About's photo measures 200px tall by 80px wide on every
  tested width.
- **SC-005**: The header shadow is present on all three pages at every
  tested width — zero pages show it absent.
- **SC-006**: The footer measures exactly 80px tall at 768px and up on
  all three pages, and reverts to its prior (auto) height below 768px.
- **SC-007**: All body text (outside the header menu) renders in the new
  default typeface; the header menu remains in its original typeface at
  the new, larger sizes; each piece's caption title renders in its own
  distinct typeface treatment.
- **SC-008**: No horizontal scrollbar appears on any page at any tested
  width from 320px to 2560px.
- **SC-009**: The built output contains zero `<script>` tags, unchanged
  from every prior feature.

## Assumptions

- The remaining five launch pieces, the content schema, the image
  pipeline, and per-piece detail pages are all out of scope — this
  feature only changes layout, colour, and typography on top of what
  already exists.
- "Middle third of the viewport" is applied literally (each side margin
  approximately one-third of viewport width) everywhere it's specified,
  for consistency across Header, Home, About, and Contact — not
  approximated differently per section.
- Vazirmatn is available through the same font-loading mechanism already
  used for Grenze Gotisch (both are Google Fonts), confirmed before this
  spec was written.
