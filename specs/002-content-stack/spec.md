# Feature Specification: Content Pieces and the Stack

**Feature Branch**: `002-content-stack`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Content pieces and the stack. Covers PLAN.md Milestones 2 and 3, merged into one feature since five of the ten launch pieces arrived finished at once rather than one file at a time."

**Relationship to `SPEC.md`**: this feature does not define new requirements. It scopes a subset of the whole-site contract in `SPEC.md` (repo root) for delivery as one unit, per `PLAN.md` §7. Every requirement below cites the numbered clause it implements; where `SPEC.md` and this document ever disagree, `SPEC.md` wins and this document is wrong.

**Relationship to `PLAN.md` §7**: originally two milestones — prove the content pipeline with one piece, then build the stack's own behaviour once ten pieces existed. Five of the ten launch pieces arrived finished together, so both are delivered here as one feature rather than as two near-identical Spec Kit cycles. See `PLAN.md` §7 for the reasoning.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the actual work, not a placeholder (Priority: P1)

A commissioner arriving from an Instagram bio link scrolls the home page and
sees five real photographs — each with its own title and the story behind
it — in a single continuous column.

**Why this priority**: This is the site's entire reason to exist
(`SPEC.md` §1: "a commissioner... sees the work within one screen"). Nothing
else in this feature has value without this.

**Independent Test**: Load `/` and confirm five pieces render in order, each
showing its image, bold title, and description, with that piece's own
caption colours.

**Acceptance Scenarios**:

1. **Given** a visitor on `/`, **When** the page loads, **Then** exactly
   five piece units appear, stacked vertically, in ascending `order` (S6.1).
2. **Given** a visitor viewing a piece unit, **When** they look at it,
   **Then** the image spans the full viewport width at its own intrinsic
   height, and its caption block sits flush beneath it with no gap between
   the two (S6.3, S6.6).
3. **Given** a visitor viewing a caption block, **When** they read it,
   **Then** the title appears in bold with the description below it, in
   that piece's own background and text colours (S6.4, S6.5).
4. **Given** a visitor scrolling from the header, **When** they reach the
   first image, and again when they reach the last caption and the footer,
   **Then** at least 20px of the page background separates them (S6.7,
   S6.8).
5. **Given** a visitor on any device, **When** they look for a carousel,
   arrows, dots, or pagination, **Then** none exist — the page is a single
   scroll (S6.9).

---

### User Story 2 - The page loads fast and doesn't jump around (Priority: P2)

A visitor on a phone, possibly on a slow connection, opens the home page and
the first photo appears immediately; the page never shifts under them as
they scroll and the rest of the images arrive.

**Why this priority**: Depends on Story 1's pieces existing but is a
distinct, separately-verifiable slice — the stack could technically render
without this and still deliver Story 1's value, just badly.

**Independent Test**: Throttle the network, load `/`, and confirm the first
image begins loading immediately while later ones wait until scrolled near,
and that nothing visibly shifts at any point.

**Acceptance Scenarios**:

1. **Given** a visitor loading `/`, **When** the page starts loading,
   **Then** the first piece's image begins loading immediately and is not
   deferred (S6.11).
2. **Given** a visitor who has not scrolled, **When** the page loads,
   **Then** images below the fold have not started downloading (S6.10).
3. **Given** a visitor scrolling down, **When** each new image arrives,
   **Then** the page does not shift — space for it was already reserved
   from its known dimensions (S6.12).
4. **Given** a visitor on any viewport from 320px up, **When** the page is
   full-bleed images wide, **Then** nothing scrolls horizontally (S11.3).
5. **Given** a visitor's device or viewport, **When** the browser requests
   an image, **Then** it receives a size appropriate to that viewport, not
   one oversized file scaled down in the browser (S12.3).

---

### User Story 3 - Add a piece by adding a file (Priority: P3)

The site owner has a new photograph ready. Publishing it means creating one
file and changing nothing else.

**Why this priority**: This is Constitution III made concrete, and the
mechanism this feature must prove works — but it is P3 because stories 1
and 2 must already work correctly for a newly-added piece to render
correctly at all.

**Independent Test**: Add a sixth piece file with all required fields,
rebuild, and confirm it appears in the stack at its specified position
without any other file changing.

**Acceptance Scenarios**:

1. **Given** the site owner has a new image and its details, **When** they
   add one file under `src/content/pieces/`, **Then** the piece appears on
   `/` at its `order` position after a rebuild, with no other file touched
   (S2.1).
2. **Given** a piece file is missing its `alt` field, **When** the site is
   built, **Then** the build fails rather than shipping the piece without
   a text alternative (S2.2).
3. **Given** a piece's caption colours, **When** they are added, **Then**
   nothing in the schema or pipeline assumes or requires the image's
   orientation (S2.4) — portrait and landscape pieces are handled
   identically.

---

### Edge Cases

- What happens with fewer than ten pieces, as is the case here (five of
  ten)? Answer: nothing — `SPEC.md` S2.3's "ten pieces at launch" is a
  launch-readiness target, not a rendering assumption. The stack renders
  however many pieces exist.
- What happens to `S6.7`/`S6.8`'s 20px gap if the stack itself changes size
  as the viewport does? The gap is a property of the stack container, not
  computed per piece, so it cannot drift piece-to-piece regardless of
  viewport (see `PLAN.md` §5).
- What happens to a caption's contrast if a future piece's hand-picked
  colours fail WCAG AA, the way two of these five originally did? Out of
  scope for this feature to prevent structurally — `PLAN.md` §8 records
  that the check is now a small script run manually per piece, not a build
  gate. Whether to make it one is a future decision, not this feature's.
- What happens on a very wide monitor, where a full-bleed image becomes
  very large? Named as an open risk in `PLAN.md` §9, not resolved here —
  S6.6 explicitly imposes no height, so this feature does not add a
  maximum width unless `SPEC.md` is amended first.

## Requirements *(mandatory)*

### Functional Requirements

**Content model**

- **FR-001** (S2.1): Adding a piece MUST require creating exactly one file
  and changing no code.
- **FR-002** (S2.2): A piece file missing `alt` MUST fail the build.
- **FR-003** (S2): Every piece MUST carry `title`, `description`, `image`,
  `alt`, `captionBackground`, `captionText`, and `order`, all required.
- **FR-004** (S2.4): The schema MUST have no field or logic representing a
  piece's orientation.
- **FR-005**: The five pieces named in this feature's input MUST exist as
  content files with their specified title, description, order, and final
  (WCAG-passing) caption colours.

**Stack rendering**

- **FR-006** (S6.1): The pieces MUST render as a single vertical column, in
  ascending `order`, beginning below the header.
- **FR-007** (S6.3): Each piece's image and caption block MUST be flush
  against each other, with no gap between them.
- **FR-008** (S6.4, S6.5): Each caption block MUST show its title in bold
  above its description, using that piece's own `captionBackground` and
  `captionText`.
- **FR-009** (S6.6): Each image MUST render at full viewport width and its
  own intrinsic height — never cropped, never height-constrained.
- **FR-010** (S6.7, S6.8): A minimum 20px gap MUST separate consecutive
  piece units, the header from the first image, and the last caption block
  from the footer, implemented as a single property of the stack
  container.
- **FR-011** (S6.9): No carousel, arrows, dots, snap points, or pagination
  MUST exist anywhere in the stack.

**Performance**

- **FR-012** (S6.10): Every image except the first MUST be deferred
  (lazy-loaded) until it is needed.
- **FR-013** (S6.11): The first image MUST NOT be deferred and MUST be
  requested at high priority.
- **FR-014** (S6.12): Layout space for every image MUST be reserved from
  its known intrinsic dimensions before the image itself arrives.
- **FR-015** (S12.3): Each image MUST be served in multiple sizes
  appropriate to viewport width, generated at build time — not a single
  oversized file scaled down by the browser.

**Accessibility**

- **FR-016** (S12.2, satisfied via FR-002): Every rendered image MUST carry
  its `alt` text.
- **FR-017** (S12.4): Every caption's text/background pair MUST meet WCAG
  AA contrast (4.5:1, since 14px is below the "large text" threshold even
  bold — `PLAN.md` §8).
- **FR-018** (S11.3): Nothing introduced by this feature MUST cause
  horizontal scrolling at any viewport width from 320px up.
- **FR-019** (S11.4): The stack MUST remain one column at every width;
  it MUST NOT become a grid.

## Key Entities

- **Piece**: one unit of work in the gallery. Fields: `title` (shown bold
  in the caption), `description` (shown below the title), `image`
  (reference to the source asset), `alt` (text alternative, required
  non-empty), `captionBackground`/`captionText` (hex colours, unique per
  piece), `order` (position in the stack). Deliberately has no field
  representing medium, orientation, or category (`SPEC.md` §2, §13;
  Constitution II).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All five pieces render on `/` in the correct order, each with
  its own image, title, description, and caption colours, on first load.
- **SC-002**: The first image begins downloading immediately on page load;
  every other image's download does not begin until it is scrolled near.
- **SC-003**: No visible layout shift occurs at any point while scrolling
  through the stack on a throttled connection.
- **SC-004**: At least three distinct image widths are generated per piece
  at build time.
- **SC-005**: Every one of the five caption colour pairs meets a 4.5:1
  contrast ratio.
- **SC-006**: Adding a sixth piece file requires touching no file other
  than the one being added, and it appears correctly positioned after a
  rebuild.
- **SC-007**: No horizontal scrollbar appears at any tested width from
  320px to 2560px.

## Assumptions

- The header, footer, and dark Home background already exist from feature
  `001-shell`; this feature adds content inside that shell and does not
  modify it.
- Five of the ten launch pieces are delivered here. The remaining five are
  a future, code-free file addition (S2.1) and are explicitly out of scope
  for this feature.
- The five source images are finished, colour-graded exports at
  1365–2794px wide, portrait orientation, ready for Astro's image
  pipeline as-is — no further editing is this feature's responsibility.
- Two of the five original caption colour pairs (Jean-Michel Labadie, Rex
  Brown) failed WCAG AA and were adjusted to the same hue at a passing
  lightness, confirmed with the site owner before use (`PLAN.md` §7). The
  values in FR-005 are the final, corrected ones.
- The About and Contact pages, the photo wrap, and the footer content-swap
  are out of scope — Milestone 4.
- Hand-drawn frames, an ornament kit, and any carousel remain non-goals
  (`SPEC.md` §13) and are not reconsidered by this feature.
