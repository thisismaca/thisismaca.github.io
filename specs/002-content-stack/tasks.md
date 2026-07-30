# Tasks: Content Pieces and the Stack

**Input**: Design documents from `specs/002-content-stack/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not included — `001-shell`'s `research.md` decision against an
automated framework holds project-wide. Verification is the manual
`quickstart.md` scenarios, referenced directly from the phases below.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)

## Path Conventions

Single project. All paths relative to repository root.

---

## Phase 1: Setup

- [ ] T001 Add `image: { layout: 'full-width', responsiveStyles: true }` to `astro.config.mjs`, per the decision in [research.md](./research.md)
- [ ] T002 [P] Create `scripts/check-contrast.mjs`: a standalone Node script computing WCAG relative luminance and contrast ratio for one or more `background,text` hex pairs, printing PASS/FAIL at the 4.5:1 threshold — the tool `quickstart.md` Scenario 4 and root `PLAN.md` §8 both reference

**Checkpoint**: Image config and the reusable contrast checker exist; no content yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The schema and rendering unit every piece depends on. No user
story is independently testable until this phase is done.

**⚠️ CRITICAL**: Do not start Phase 3+ before this checkpoint.

- [ ] T003 Create `src/content.config.ts`: a `pieces` collection using a `glob()` loader over `src/content/pieces/`, schema `{ title: z.string().min(1), description: z.string().min(1), image: image(), alt: z.string().min(1), captionBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/), captionText: z.string().regex(/^#[0-9a-fA-F]{6}$/), order: z.number().int() }` (S2, S2.2, S2.4 — no orientation field)
- [ ] T004 Create `src/components/Piece.astro` (depends on T003): accepts one collection entry's `data` plus its rendered `<Image>`; renders the image immediately followed by a caption block (title bold, description below) with inline `background-color`/`color` from that piece's own fields, no gap between image and caption (S6.3, S6.4, S6.5)
- [ ] T005 [P] In `src/styles/global.css`, add a stack container rule: `display: flex; flex-direction: column; gap: max(20px, ...)` — a single `gap` property, not per-piece margins, so S6.7/S6.8's 20px minimum can't drift out of sync (root `PLAN.md` §5)

**Checkpoint**: Schema, rendering unit, and gap CSS exist. Nothing is
populated with real content yet.

---

## Phase 3: User Story 1 - See the actual work, not a placeholder (Priority: P1) 🎯 MVP

**Goal**: Five real pieces render on `/`, in order, each with its own
image, bold title, description, and caption colours.

**Independent Test**: Load `/` and confirm five piece units in ascending
`order`, each showing the right image, title, description, and colours.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `src/content/pieces/kirk-hammett-london.md`: title "Kirk Hammett in London, July 5th 2026", order 1, captionBackground `#302d2d`, captionText `#e9e1e1`, image → `src/assets/pieces/kirk-hammett-london.jpg`, description and alt per [data-model.md](./data-model.md)
- [ ] T007 [P] [US1] Create `src/content/pieces/mario-duplantier-frankfurt.md`: order 2, captionBackground `#5c432f`, captionText `#fff1c4`, image → `src/assets/pieces/mario-duplantier-frankfurt.jpg`
- [ ] T008 [P] [US1] Create `src/content/pieces/jean-michel-labadie-cardiff.md`: order 3, captionBackground `#494949`, captionText `#f3a797` (WCAG-corrected), image → `src/assets/pieces/jean-michel-labadie-cardiff.jpg`
- [ ] T009 [P] [US1] Create `src/content/pieces/rex-brown-london.md`: order 4, captionBackground `#38543d`, captionText `#eab875` (WCAG-corrected), image → `src/assets/pieces/rex-brown-london.jpg`
- [ ] T010 [P] [US1] Create `src/content/pieces/phil-anselmo-london.md`: order 5, captionBackground `#8f8f8f`, captionText `#000000`, image → `src/assets/pieces/phil-anselmo-london.jpg`
- [ ] T011 [US1] Rewrite `src/pages/index.astro` (depends on T003–T010): `getCollection('pieces')`, sort by `order`, render `<Piece>` for each inside the gap container from T005
- [ ] T012 [US1] Run [quickstart.md](./quickstart.md) Scenario 1; fix any ordering, caption, or colour issue found

**Checkpoint**: User Story 1 independently functional — five real pieces,
correctly ordered and captioned.

---

## Phase 4: User Story 2 - Fast loading, no layout shift (Priority: P2)

**Goal**: The first image loads immediately at high priority; every other
image is deferred; nothing shifts as they arrive; multiple widths exist per
image.

**Independent Test**: Throttle the network, load `/`, confirm the first
image's attributes and loading order, and that no visible shift occurs.

### Implementation for User Story 2

- [ ] T013 [US2] In `src/pages/index.astro` or `Piece.astro` (depends on T011), pass `priority` to the `<Image>` only for the piece with `order === 1` — expands to `loading="eager"`, `decoding="sync"`, `fetchpriority="high"` per [research.md](./research.md); every other piece gets none of those, defaulting to lazy
- [ ] T014 [US2] Run [quickstart.md](./quickstart.md) Scenario 2; confirm the first image's attributes and that later images don't fetch until scrolled near
- [ ] T015 [US2] Run [quickstart.md](./quickstart.md) Scenario 3; confirm multiple widths exist per piece under `dist/_astro/`
- [ ] T016 [US2] Run [quickstart.md](./quickstart.md) Scenario 7; confirm no horizontal scroll 320px–2560px and zero `<script>` tags in `dist/`

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 5: User Story 3 - Add a piece by adding a file (Priority: P3)

**Goal**: A new piece can be added as one file with no other change, and a
missing `alt` fails the build rather than shipping silently.

**Independent Test**: Add a sixth piece file, rebuild, confirm it appears;
remove `alt` from a piece, confirm the build fails.

### Implementation for User Story 3

- [ ] T017 [US3] Run [quickstart.md](./quickstart.md) Scenario 5 (add a temporary sixth piece, rebuild, confirm position 6, remove it, rebuild again)
- [ ] T018 [US3] Run [quickstart.md](./quickstart.md) Scenario 6 (temporarily delete an `alt` field, confirm the build fails with a schema error naming the file, restore it)

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 [P] Run [quickstart.md](./quickstart.md) Scenario 4 (`node scripts/check-contrast.mjs`) against all five real pairs; confirm every one reports PASS
- [ ] T020 Update root `PLAN.md` §7 Milestones 2/3 checklist once T001–T019 all pass

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks every user story.
- **User Story 1 (Phase 3)**: Depends on Phase 2. T006–T010 are five
  independent files and fully parallel; T011 waits on all of them plus the
  schema and component.
- **User Story 2 (Phase 4)**: Depends on Phase 3 (T011 must exist before a
  `priority` prop has anywhere to attach).
- **User Story 3 (Phase 5)**: Depends on Phase 3 only — proving the
  add-a-file mechanism doesn't need US2's loading behaviour to exist first.
  Independent of Phase 4's files.
- **Polish (Phase 6)**: Depends on Phases 3–5 all complete.

## Parallel Example: Phase 3

```bash
# T006-T010 are five different content files with no dependency between them:
Task: "Create src/content/pieces/kirk-hammett-london.md"
Task: "Create src/content/pieces/mario-duplantier-frankfurt.md"
Task: "Create src/content/pieces/jean-michel-labadie-cardiff.md"
Task: "Create src/content/pieces/rex-brown-london.md"
Task: "Create src/content/pieces/phil-anselmo-london.md"
# T011 waits for all five plus T003/T004.
```

## Implementation Strategy

**MVP first**: Phases 1–3 alone produce a real, deployable Home page
showing all five finished pieces correctly — before performance tuning or
proving the add-a-file mechanism. That is the MVP.

**Incremental delivery**: Phase 4 (loading behaviour) and Phase 5 (the
add-a-file proof) can be built in either order after Phase 3 — neither
depends on the other's files. Land Phase 6 last, since `check-contrast.mjs`
and the `PLAN.md` update both assume every prior phase is done.
