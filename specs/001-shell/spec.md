# Feature Specification: The Shell

**Feature Branch**: `001-shell`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Milestone 1 — the shell. Base layout, header, and footer used by all three routes (/, /about, /contact), plus the site palette and both typefaces. No piece content or images yet — structural chrome only."

**Relationship to `SPEC.md`**: this feature does not define new requirements. It scopes a subset of the whole-site contract in `SPEC.md` (repo root) for delivery as one unit, per the milestone breakdown in `PLAN.md` §7. Every requirement below cites the numbered clause it implements (`S4.11`, etc.); where `SPEC.md` and this document ever disagree, `SPEC.md` wins and this document is wrong.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Move between the three pages from anywhere (Priority: P1)

A visitor arriving from an Instagram bio link lands on any of the three pages
and can reach the other two without hunting, on their phone.

**Why this priority**: Without working navigation the other two stories have
nothing to attach to. This is the minimum that makes the site a site rather
than three disconnected documents.

**Independent Test**: Load each of `/`, `/about`, `/contact` at 320px width
with no JavaScript enabled, and confirm all three header items are visible on
one line and each navigates correctly.

**Acceptance Scenarios**:

1. **Given** a visitor on `/` on a 320px-wide phone, **When** the page loads,
   **Then** Home, About, and Contact appear in a single horizontal row with no
   wrapping, overflow, or hamburger menu (S4.4).
2. **Given** a visitor on any page, **When** they activate a header item,
   **Then** they land on the corresponding page (S4.10).
3. **Given** a visitor with JavaScript disabled, **When** they use the header,
   **Then** navigation works identically (S12.1, S12.5).
4. **Given** a visitor using only a keyboard, **When** they tab through the
   page, **Then** every header and footer control is reachable and operable
   (S12.5).

---

### User Story 2 - Recognise the site's identity, not a template (Priority: P2)

A commissioner evaluating the work should feel they've landed on a considered
gallery label, not a generic starter site — before a single piece has loaded.

**Why this priority**: This is the site's credibility layer at its most
minimal. It depends on Story 1 existing but delivers value on top of it: the
same three blank pages, now carrying the visual identity the rest of the site
will inherit.

**Independent Test**: Load any page on a throttled connection and confirm the
menu renders in the correct typeface at the correct size for the viewport,
with no flash of invisible text, and the header/footer/page chrome uses the
fixed palette.

**Acceptance Scenarios**:

1. **Given** a visitor on any page at 768px or wider, **When** the header
   renders, **Then** menu items appear in the display typeface at 20px; below
   768px, at 16px (S9.1).
2. **Given** a visitor on a slow connection, **When** fonts are still loading,
   **Then** menu and body text are visible immediately rather than invisible
   or a mismatched fallback flash (S9.3).
3. **Given** a visitor on `/`, **When** the header renders, **Then** it is a
   white block flush with the top of the viewport with no shadow beneath it
   (S4.1, S4.11).
4. **Given** a visitor on `/about` or `/contact`, **When** the header renders,
   **Then** a shadow is visible along its lower edge (S4.11, S7.6, S8.6).

---

### User Story 3 - Find a way to make contact (Priority: P3)

A commissioner who likes what they see should be able to find contact details
without hunting, from any page.

**Why this priority**: This is the site's stated purpose (`SPEC.md` §1,
"can find a way to make contact without hunting"). It is P3 here only because
it depends on the chrome existing first — the content it exposes is two lines
of text, already fully specified.

**Independent Test**: Load any page and confirm the footer shows an email
address and an Instagram handle, and that activating the Instagram half opens
Instagram in a new tab.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they reach the footer, **Then**
   the left half shows `thisismaca@gmail.com` as plain text, not a link
   (S5.2).
2. **Given** a visitor on any page, **When** they reach the footer, **Then**
   the right half shows `@thisismaca` with a grey Instagram glyph (S5.3).
3. **Given** a visitor, **When** they activate the Instagram half, **Then**
   Instagram opens in a new browser tab (S5.4).
4. **Given** a visitor on a narrow phone, **When** they view the footer,
   **Then** both halves remain side by side, shrinking rather than stacking
   (S5.5).

---

### Edge Cases

- What happens at exactly 320px with the real (not estimated) font metrics —
  does the header still fit on one line? (S4.4 — flagged in `PLAN.md` §7 as
  "measured for real," not assumed.)
- What happens between 320px and 768px as the viewport is resized
  continuously — do the header's fluid clamp values ever visibly snap? (S4.5,
  S4.6, S4.8)
- What does `/about` or `/contact` show below the header and above the
  footer, given this feature explicitly excludes their real content? (Answer:
  a white background and nothing else — an intentionally empty shell, not an
  error state. Filling it is Milestone 4.)
- What happens on a very wide monitor (2560px) — does the header stay
  centred and the fixed-width chrome stay legible? (S11 governs one
  breakpoint only; nothing in this feature should assume a maximum viewport.)
- What happens if Grenze Gotisch is illegible at 16px on a real device?
  Out of scope to resolve here — `PLAN.md` §9 risk 1 names the fix (a size
  change to S9.1) as a spec amendment, not something this feature should
  work around silently.

## Requirements *(mandatory)*

### Functional Requirements

**Routes**

- **FR-001** (S3.1): The site MUST expose exactly three routes: `/`, `/about`,
  `/contact`.

**Header** — present and structurally identical on all three routes

- **FR-002** (S4.1, S4.2): The header MUST be a white block flush with the top
  of the viewport, spanning its full width, at every viewport width.
- **FR-003** (S4.3): The header MUST contain exactly three items — Home,
  About, Contact — as a single horizontal row, centred.
- **FR-004** (S4.4): The three items MUST remain on one line at every
  viewport width from 320px up, with no hamburger, wrapping, or overflow.
- **FR-005** (S4.5–S4.8): Header padding and item spacing MUST follow the
  specified fluid values and change continuously with viewport width, never
  snapping at a breakpoint: padding above `clamp(15px, 3vw, 30px)`, padding
  below `clamp(5px, 1vw, 8px)`, horizontal padding minimum 5px, gap between
  items `clamp(8px, 4vw, 30px)`.
- **FR-006** (S4.9): Header height MUST be a consequence of padding and line
  box, never set as a fixed value.
- **FR-007** (S4.10): Each header item MUST navigate to its corresponding
  page.
- **FR-008** (S4.11): A shadow along the header's lower edge MUST be visible
  on `/about` and `/contact`, and absent on `/`.

**Footer** — present and structurally identical on `/` and `/about`; present
with different contents on `/contact` per `SPEC.md` §8 (that content swap is
out of scope for this feature — see Assumptions)

- **FR-009** (S5.1): The footer MUST be a white block containing two halves.
- **FR-010** (S5.2): The left half, centred within itself, MUST show
  `thisismaca@gmail.com` as plain text, not a hyperlink.
- **FR-011** (S5.3): The right half, centred within itself, MUST show
  `@thisismaca` followed by a grey Instagram glyph.
- **FR-012** (S5.4): Activating the right half MUST open Instagram in a new
  browser tab.
- **FR-013** (S5.5): Both halves MUST remain side by side at every viewport
  width, shrinking rather than stacking.
- **FR-014** (S5.6): The footer MUST carry no shadow.

**About and Contact shells**

- **FR-015** (S7.1, S8.1): The `/about` and `/contact` pages MUST have a
  white background throughout.
- **FR-016** (S7.6, S8.6): The header shadow (FR-008) MUST be visible on
  both pages.

**Typography**

- **FR-017** (S9.1): Header menu items MUST use the display typeface at
  weight 500, 20px from 768px up and 16px below.
- **FR-018** (S9.2): All other text MUST use the body typeface, regular,
  14px.
- **FR-019** (S9.3): Both typefaces MUST be delivered such that no text is
  invisible while fonts load.

**Colour**

- **FR-020** (S10): Header, footer, `/about`, and `/contact` backgrounds
  MUST be `#FFFFFF`; menu lettering MUST be `#333333`; body text on white
  MUST be black.
- **FR-020a** (S6.2, S10): The `/` page background MUST be `#444444`. This
  applies to the Home shell immediately, independent of the piece stack —
  it is a palette property of the page, not of the pieces that will later
  sit on it.

**Responsive behaviour**

- **FR-021** (S11.1): Exactly one breakpoint, at 768px, MUST govern menu
  type size (FR-017).
- **FR-022** (S11.3): Nothing MUST scroll horizontally at any width from
  320px up.

**Performance and accessibility**

- **FR-023** (S12.1): No JavaScript MUST ship. Every requirement above MUST
  hold with JavaScript disabled.
- **FR-024** (S12.5): The shell MUST be fully operable and readable without
  a pointing device.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On every one of the three pages, at every viewport width from
  320px to 2560px, all three header items remain visible on a single line
  with no wrapping, overflow, or menu icon.
- **SC-002**: Resizing the viewport continuously between 320px and 1440px
  produces no visually discontinuous jump ("snap") in header padding or item
  spacing at any point.
- **SC-003**: The header shadow is present on exactly two of the three pages
  (`/about`, `/contact`) and absent on exactly one (`/`), on every load.
- **SC-003a**: `/` renders with a `#444444` background visible around the
  white header and footer; `/about` and `/contact` render white throughout.
- **SC-004**: The footer's email and Instagram information is present and
  reachable, without scrolling past it, on all three pages.
- **SC-005**: No page ever shows invisible or unstyled text while fonts are
  loading, tested on a throttled connection.
- **SC-006**: The built output contains zero `<script>` tags across all
  three pages.
- **SC-007**: All navigation and the Instagram link are operable using only
  a keyboard, on all three pages.

## Assumptions

- Piece content, the image stack, and the content schema are out of scope —
  they belong to Milestones 2 and 3 (`PLAN.md` §7) and this feature does not
  touch `src/content/` or `src/assets/`.
- The About page photo and influences text (`SPEC.md` S7.2–S7.5) are out of
  scope — Milestone 4. This feature delivers `/about` as the header, footer,
  and an otherwise empty white page.
- The Contact page's invitation text, the footer content-swap itself, and the
  copyright line (`SPEC.md` S8.2–S8.5, S5.7) are out of scope — Milestone 4.
  This feature delivers `/contact` as the header, footer, and an otherwise
  empty white page, but the footer MUST be built so that swap is possible
  later without restructuring it (`PLAN.md` §5 — one component used in two
  places, not two components kept manually in agreement).
- No custom domain exists yet; verification happens against whatever origin
  Milestone 0 established (`https://thisismaca.github.io`).
- Grenze Gotisch's legibility at 16px is an open risk (`PLAN.md` §9, risk 1),
  not something this feature resolves. If it fails on inspection, the fix is
  a `SPEC.md` amendment to S9.1, handled outside this feature.
