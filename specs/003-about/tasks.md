# Tasks: The About Page

**Input**: Design documents from `specs/003-about/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not included — no automated framework project-wide. Verified
manually against [quickstart.md](./quickstart.md).

**A note on scope**: this feature touches one file. Writing the bio content
and writing its layout CSS aren't meaningfully separable into different
files the way `001-shell`'s Header/Footer were, so Foundational carries the
actual content (it's needed for every story to be testable at all), and
each user-story phase is the CSS pass and verification specific to that
story's slice of behaviour — the same adaptation `001-shell`'s tasks.md
made, for the same reason.

No Setup phase: no config or dependency changes are needed (the photo
asset is already committed; the `layout="fixed"` override lives in the
component markup itself, per `research.md`).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Real content and structure every story depends on.

**⚠️ CRITICAL**: Do not start Phase 2+ before this checkpoint.

- [X] T001 Rewrite `src/pages/about.astro`: import `../assets/maca-portrait.jpg`, render it via `<Image>` with `layout="fixed" width={80} height={100}` and real descriptive alt text (FR-006); render both bio paragraphs verbatim (FR-004), with the influences named as running text (FR-005) and the source-repo URL in paragraph two as a real `<a href="https://github.com/thisismaca/thisismaca.github.io">` (FR-009); wrap photo + text in a container with `display: flow-root`

**Checkpoint**: `/about` shows real content. Layout is not yet correct at
either breakpoint (no float/centring CSS applied yet).

---

## Phase 2: User Story 1 - Decide whether to take the work seriously (Priority: P1) 🎯 MVP

**Goal**: The complete bio renders correctly, on a white background with
black text, with the header shadow intact.

**Independent Test**: Load `/about`, confirm the full bio text, correct
colours, and header shadow.

- [X] T002 [US1] Run [quickstart.md](./quickstart.md) Scenario 1 (depends on T001) — confirm bio text is complete and unedited, background white and text black (already the `global.css` default from `001-shell`, so this is a regression check, not new CSS), header shadow still visible; fix anything found

**Checkpoint**: User Story 1 independently functional — the credibility
content is correct, even though layout positioning isn't final yet.

---

## Phase 3: User Story 2 - See the photo and text arranged sensibly at any size (Priority: P2)

**Goal**: Photo top-left with text wrapping around it at 768px and up;
photo centred above all text below 768px.

**Independent Test**: Load `/about` at 768px+ and confirm the wrap;
below 768px and confirm the stack.

- [X] T003 [US2] In `src/pages/about.astro`, add the ≥768px photo styling (depends on T001): `float: left`, `margin: 5px` (S7.2/S7.3)
- [X] T004 [US2] In the same file, add a `@media (max-width: 767px)` override: `float: none`, `margin-inline: auto`, `display: block` (S7.4)
- [X] T005 [US2] Run [quickstart.md](./quickstart.md) Scenario 2 (≥768px wrap); fix any issue found
- [X] T006 [US2] Run [quickstart.md](./quickstart.md) Scenario 3 (<768px stack, no horizontal scroll); fix any issue found

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 4: User Story 3 - Find out how the site itself was built (Priority: P3)

**Goal**: The source-repo link works and is distinguishable as a link.

**Independent Test**: Load `/about`, confirm the link's target and that
it's visually distinguishable from plain text.

- [X] T007 [US3] Run [quickstart.md](./quickstart.md) Scenario 4 (depends on T001 — the link itself was already written there; this is verification only); fix anything found

**Checkpoint**: All three user stories independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T008 [P] Run [quickstart.md](./quickstart.md) Scenario 5 (`grep -ril "<script" dist/`); confirm no output
- [X] T009 Update root `PLAN.md` §7 Milestone 4 (About half) checklist once T001–T008 all pass

---

## Dependencies & Execution Order

- **Foundational (Phase 1)**: No dependencies. Blocks every user story.
- **User Story 1 (Phase 2)**: Depends on Phase 1 only.
- **User Story 2 (Phase 3)**: Depends on Phase 1. Edits the same file as
  T001 (expected — see the scope note above), not on Phase 2's outcome.
- **User Story 3 (Phase 4)**: Depends on Phase 1 only. Independent of
  Phases 2–3.
- **Polish (Phase 5)**: Depends on Phases 2–4 all complete.

## Implementation Strategy

**MVP first**: Phases 1–2 alone produce a real About page with correct,
complete content — before the responsive layout or the link are verified.
That is the MVP.

**Incremental delivery**: Phase 3 (layout) and Phase 4 (link) can be
verified in either order after Phase 1 — neither depends on the other.
Land Phase 5 last.
