# Feature Specification: The About Page

**Feature Branch**: `003-about`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "The About page. Covers PLAN.md Milestone 4's About half, specified as its own feature since About's content arrived and Contact's has not."

**Relationship to `SPEC.md`**: this feature does not define new requirements. It scopes a subset of the whole-site contract in `SPEC.md` (repo root) for delivery as one unit. Every requirement below cites the numbered clause it implements; where `SPEC.md` and this document ever disagree, `SPEC.md` wins.

**Relationship to `PLAN.md` §7**: Milestone 4 originally covered About and Contact together. It splits here because About's content (bio copy, the site's photo, the source-repo link) exists and Contact's (the invitation text) does not — the mirror of why Milestones 2 and 3 merged. Contact remains a future feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Decide whether to take the work seriously (Priority: P1)

A commissioner who liked the Home page stack clicks through to About to learn
who made it, before deciding whether to reach out.

**Why this priority**: This is the credibility check `SPEC.md` §1 names as
the site's purpose. Without real bio content, About is an empty page with a
header on it — nothing else in this feature matters if this doesn't work.

**Independent Test**: Load `/about` and confirm the real bio copy renders in
full, including the influences named within it, with no placeholder text
anywhere.

**Acceptance Scenarios**:

1. **Given** a visitor on `/about`, **When** the page loads, **Then** both
   paragraphs of the site owner's bio render as written, including the
   named influences (Virgil Finlay, Richey Beckett, Peeter Baltens, the
   2013 Tumblr aesthetic, nature) as running text, not a separate list or
   images (`SPEC.md` §7's resolved influences note).
2. **Given** a visitor on `/about`, **When** they look at the page,
   **Then** the background is white throughout and body text is black
   (S7.1, S7.5).
3. **Given** a visitor on `/about`, **When** the header renders, **Then**
   its shadow is visible, matching `/contact` and unlike `/` (S7.6,
   already built — this feature only confirms it still holds).

---

### User Story 2 - See the photo and text arranged sensibly at any size (Priority: P2)

A visitor on a phone and a visitor on a desktop both get a layout that
reads correctly for their screen — not the same fixed arrangement squeezed
or stretched.

**Why this priority**: Depends on Story 1's content existing but is a
separable, independently-breakable concern: the same bio and photo could
render with a broken or nonsensical layout at either size.

**Independent Test**: Load `/about` at 768px and above, confirm the photo
sits top-left with text flowing around it; load it below 768px, confirm
the photo is centred above all the text.

**Acceptance Scenarios**:

1. **Given** a visitor at 768px width or above, **When** `/about` loads,
   **Then** the photo appears at the top left, approximately 100px tall by
   80px wide, with 5px of margin on every side, and body text flows around
   it (S7.2, S7.3).
2. **Given** a visitor below 768px width, **When** `/about` loads,
   **Then** the photo is centred and all body text sits beneath it, not
   beside it (S7.4).
3. **Given** a visitor resizing across 768px, **When** the width crosses
   that point, **Then** the layout switches between the two arrangements
   above with no JavaScript involved (Constitution V) and no horizontal
   scrolling introduced at any width from 320px up (S11.3).

---

### User Story 3 - Find out how the site itself was built (Priority: P3)

A visitor curious about the site's own construction (the meta angle named
in the bio's second paragraph) finds a working link to its source code.

**Why this priority**: A single link, useful to a narrower audience than
Stories 1–2, and fully independent of them — it's one anchor tag anywhere
on the page.

**Independent Test**: Load `/about` and confirm the source-repository URL
in the second paragraph is a real, working hyperlink.

**Acceptance Scenarios**:

1. **Given** a visitor reading the second paragraph, **When** they look at
   the source-code mention, **Then** it renders as an actual link, not
   plain text (S7.7).
2. **Given** a visitor, **When** they activate that link, **Then** it
   opens the site's GitHub repository.

---

### Edge Cases

- What happens to the photo's aspect ratio inside its ~100×80px box, given
  the actual source photo is a tall portrait (1066×1895px, ratio ≈0.56),
  not the box's own ratio (80:100 = 0.8)? Answer: the photo is deliberately
  cropped to fit — unlike the piece stack's S6.6 ("nothing is cropped"),
  which applies only to §6, S7.2 specifies a fixed small display footprint
  for what is effectively a headshot thumbnail, and no other requirement
  says otherwise.
- What happens exactly at 768px — does S7.3's wrap or S7.4's stack apply?
  `SPEC.md` S11.1 says one breakpoint at 768px "governs... the About
  layout (S7.3, S7.4)" without stating which side is inclusive.
  `001-shell`'s precedent (S9.1's menu type: 20px *from* 768px up, 16px
  *below*) treats 768px itself as belonging to the "and above" side — the
  same convention applies here for consistency.
- What happens if the source-repo link opens in the same tab versus a new
  one? `SPEC.md` doesn't specify for this link (unlike S5.4's explicit
  new-tab requirement for Instagram) — no `[NEEDS CLARIFICATION]` needed;
  same-tab is the reasonable default for a link that isn't taking the
  visitor away from a social platform mid-browse.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (S7.1): The `/about` page background MUST be white
  throughout.
- **FR-002** (S7.5): Body text on `/about` MUST be black.
- **FR-003** (S7.6): The header shadow MUST be visible on `/about`
  (already satisfied by `001-shell`'s `Base` layout; this feature must not
  regress it).
- **FR-004**: The page MUST render the site owner's full bio copy, as
  finalized, across both paragraphs, without paraphrase or omission.
- **FR-005**: The influences named within the bio (Virgil Finlay, Richey
  Beckett, Peeter Baltens, the 2013 Tumblr aesthetic, nature) MUST appear
  as running text within the bio, not as a separate labelled section or as
  images.
- **FR-006** (S7.2): The site owner's photograph MUST appear at the top
  left of the content area, approximately 100px tall by 80px wide, with a
  5px margin on every side.
- **FR-007** (S7.3): At 768px width and above, body text MUST flow around
  the photograph rather than being pushed below it.
- **FR-008** (S7.4): Below 768px width, the photograph MUST be centred and
  all body text MUST sit beneath it, not beside it.
- **FR-009** (S7.7): The page MUST include a working hyperlink to the
  site's own source repository, embedded at the URL mentioned in the bio's
  second paragraph.
- **FR-010** (S11.3): Nothing introduced by this feature MUST cause
  horizontal scrolling at any viewport width from 320px up.
- **FR-011** (Constitution V): The breakpoint switch between S7.3's and
  S7.4's layouts MUST be implemented without JavaScript.

## Key Entities

None. This feature adds static page content (bio copy, one photo) with no
data model — unlike Home's pieces (`002-content-stack`), About's content is
not expected to change routinely, so it does not need a content-collection
entry of its own.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The complete, unedited bio copy (both paragraphs) is present
  in the rendered page.
- **SC-002**: At 768px and wider, the photo sits top-left with text
  visibly wrapping around it, not below it.
- **SC-003**: Below 768px, the photo is centred with 100% of body text
  appearing beneath it.
- **SC-004**: The source-repository link is present, correctly targeted,
  and distinguishable as a link (not plain text).
- **SC-005**: No horizontal scrollbar appears at any tested width from
  320px to 2560px.
- **SC-006**: The header shadow remains visible on `/about` after this
  feature, matching its state before.

## Assumptions

- The photo is deliberately cropped to its ~100×80px display box (see
  Edge Cases) — this is a different treatment from the piece stack's
  uncropped full-bleed images (S6.6), and that difference is intentional,
  not an inconsistency to resolve.
- 768px itself belongs to the "768px and above" side of S7.3, consistent
  with how `001-shell` treated the same breakpoint for S9.1.
- The source-repo link opens in the same tab, since `SPEC.md` only
  specifies new-tab behaviour for the Instagram link (S5.4) and this is a
  different, lower-stakes link.
- The Contact page (`SPEC.md` §8) is out of scope — a future feature once
  its content exists.
- No new content-collection entity is introduced; About's copy and photo
  live directly in the page/component, consistent with them being
  one-off content rather than a repeating collection.
