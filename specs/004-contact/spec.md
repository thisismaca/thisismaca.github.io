# Feature Specification: The Contact Page

**Feature Branch**: `004-contact`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "The Contact page. Covers PLAN.md Milestone 4's Contact half, the last piece of that milestone, specified as its own feature now that its content has arrived."

**Relationship to `SPEC.md`**: this feature does not define new requirements. It scopes a subset of the whole-site contract in `SPEC.md` (repo root). Every requirement below cites the numbered clause it implements; where `SPEC.md` and this document ever disagree, `SPEC.md` wins.

**Relationship to `PLAN.md` §7**: this closes Milestone 4, which split into `003-about` and this feature when About's content arrived before Contact's. With this feature done, Milestone 4 is complete.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach out without hunting (Priority: P1)

A commissioner who has decided to make contact goes to `/contact` and
immediately finds an invitation to do so plus the actual channels — no
scrolling past unrelated content, no separate footer to notice.

**Why this priority**: This is `SPEC.md` §1's stated success condition
verbatim — "can find a way to make contact without hunting." Nothing else
in this feature matters if this doesn't work.

**Independent Test**: Load `/contact` and confirm the invitation text and
both contact channels (email, Instagram) appear as page content.

**Acceptance Scenarios**:

1. **Given** a visitor on `/contact`, **When** the page loads, **Then** a
   short invitation to make contact appears in black, centred, with 20px
   margin above and below (S8.2), reading exactly "If you have any
   inquiries (art or software related) please contact me through email or
   Instagram."
2. **Given** a visitor on `/contact`, **When** they look below the
   invitation, **Then** the email (`thisismaca@gmail.com`, plain text) and
   Instagram (`@thisismaca` with a grey glyph, opening in a new tab)
   appear as page content, not tucked into the footer (S8.3, S5.2–S5.4).
3. **Given** a visitor on `/contact`, **When** the page renders,
   **Then** the background is white (S8.1) and the header shadow is
   visible (S8.6).

---

### User Story 2 - See a minimal footer here, not the usual one (Priority: P2)

The same visitor scrolls to the bottom of `/contact` and sees only a
copyright line — not a second, redundant copy of the email/Instagram
blocks they already saw as page content above.

**Why this priority**: Depends on Story 1's content existing (the
email/Instagram blocks must be page content before it's meaningful to
also *not* have them in the footer) but is separately breakable — the
footer could easily still show the normal content by mistake.

**Independent Test**: Load `/contact`, scroll to the footer, confirm it
shows only the copyright line.

**Acceptance Scenarios**:

1. **Given** a visitor on `/contact`, **When** they reach the footer,
   **Then** it contains only `© Maca Sepúlveda 2026`, at 10px (S8.4).
2. **Given** a visitor on `/contact`, **When** they look at that footer,
   **Then** it does not contain the email or Instagram blocks — those
   already appeared above, as page content.

---

### User Story 3 - Everywhere else stays exactly as it was (Priority: P3)

A visitor on `/` or `/about` continues to see the familiar footer — the
mechanism change behind Stories 1–2 must not leak into pages that were
already correct.

**Why this priority**: Not new value, but the real risk in this feature:
`SPEC.md` §5's email/Instagram blocks and this page's footer swap share
one component. Getting that sharing wrong regresses two already-shipped,
already-verified pages silently.

**Independent Test**: Load `/` and `/about`, confirm their footers render
identically to how they did before this feature.

**Acceptance Scenarios**:

1. **Given** a visitor on `/` or `/about`, **When** they reach the
   footer, **Then** it shows the email and Instagram blocks exactly as
   before — same content, same layout, same behaviour (S5.1–S5.6).
2. **Given** a visitor on `/` or `/about`, **When** the footer renders,
   **Then** no copyright line appears — that's `/contact`-only (S8.5).

---

### Edge Cases

- What happens if the shared email/Instagram component is used both
  standalone (Contact's page content) and inside `<footer>` (other
  pages) — does its internal two-half flex layout still work identically
  in both contexts? Yes — this must hold regardless of which element
  wraps it; that portability is the whole point of extracting it.
- What happens to spacing between the invitation text and the
  email/Instagram blocks below it on `/contact`? Not numerically
  specified beyond S8.2's 20px margin on the invitation itself — default
  document flow spacing is acceptable; no requirement is being invented
  here.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (S8.1): The `/contact` page background MUST be white.
- **FR-002** (S8.2): The invitation text MUST render exactly as
  finalized, in black, centred, with 20px margin above and below.
- **FR-003** (S8.3): The email and Instagram blocks (S5.2–S5.4) MUST
  render as `/contact` page content, using the same shared component that
  renders them in the footer elsewhere — not a second, independently
  maintained copy.
- **FR-004** (S8.4): The footer on `/contact` MUST contain only
  `© Maca Sepúlveda 2026`, at 10px.
- **FR-005** (S8.5): The copyright line MUST appear on `/contact` only —
  not on `/` or `/about`.
- **FR-006** (S8.6): The header shadow MUST be visible on `/contact`
  (already satisfied by `001-shell`; this feature must not regress it).
- **FR-007** (Regression, S5.1–S5.6): The footer on `/` and `/about` MUST
  continue to render the email and Instagram blocks exactly as before —
  unchanged content, layout, and behaviour.

## Key Entities

None — same reasoning as `003-about`: fixed, one-off page content, not a
repeating collection.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The exact invitation text is present, styled per S8.2, on
  first load of `/contact`.
- **SC-002**: Both contact channels (email, Instagram) are present as
  `/contact` page content and function identically to their existing
  footer behaviour (plain-text email, Instagram opening in a new tab).
- **SC-003**: The `/contact` footer contains the copyright line and
  nothing else.
- **SC-004**: `/` and `/about` footers are visually and functionally
  unchanged from their state before this feature.
- **SC-005**: No horizontal scrollbar appears at any tested width from
  320px to 2560px.
- **SC-006**: Zero `<script>` tags in the build output, unchanged.

## Assumptions

- Spacing between the invitation and the contact blocks below it is not
  separately specified and follows normal document flow (see Edge Cases).
- The email/Instagram extraction is a refactor of existing, already-built
  functionality (`001-shell`) — no new visual design decision is being
  made about how those blocks look, only where else they can render.
