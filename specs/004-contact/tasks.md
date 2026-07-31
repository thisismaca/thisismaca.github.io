# Tasks: The Contact Page

**Input**: Design documents from `specs/004-contact/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not included — no automated framework project-wide. Verified
manually against [quickstart.md](./quickstart.md).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Extract the shared component every story depends on.

**⚠️ CRITICAL**: Do not start Phase 2+ before this checkpoint.

- [ ] T001 Create `src/components/ContactInfo.astro`: move the two-half email/Instagram markup out of `Footer.astro` verbatim, with its own root wrapper carrying the flex layout (`display: flex`, `.half`, `.glyph` styles) so it works standalone, not only inside `<footer>` (per `research.md`)
- [ ] T002 Modify `src/components/Footer.astro` (depends on T001): import `ContactInfo`, add a `copyright` boolean prop (default `false`); render `<ContactInfo />` when `false`, a `© Maca Sepúlveda 2026` line at 10px when `true` (S8.4); remove the two-half styles now owned by `ContactInfo`, keep the `<footer>` wrapper's own styles (background, no shadow — S5.6) unchanged
- [ ] T003 Modify `src/layouts/Base.astro` (depends on T002): add a `footerCopyright` boolean prop (default `false`), forward it as `<Footer copyright={footerCopyright} />`

**Checkpoint**: The component split exists and compiles. `/` and `/about`
should already render identically to before (default props unchanged);
`/contact` doesn't use the new capability yet.

---

## Phase 2: User Story 1 - Reach out without hunting (Priority: P1) 🎯 MVP

**Goal**: `/contact` shows the invitation text and both contact channels
as page content.

**Independent Test**: Load `/contact`, confirm the invitation and the
email/Instagram blocks both render as page content.

- [ ] T004 [US1] Modify `src/pages/contact.astro` (depends on T001, T003): add the invitation paragraph with the exact finalized text, styled black, centred, with 20px margin above and below (S8.2); render `<ContactInfo />` as page content below it (S8.3)
- [ ] T005 [US1] Run [quickstart.md](./quickstart.md) Scenario 1; fix any issue found

**Checkpoint**: User Story 1 independently functional.

---

## Phase 3: User Story 2 - See a minimal footer here, not the usual one (Priority: P2)

**Goal**: `/contact`'s footer shows only the copyright line.

**Independent Test**: Load `/contact`, scroll to the footer, confirm only
the copyright line appears.

- [ ] T006 [US2] In `src/pages/contact.astro` (depends on T003), pass `footerCopyright={true}` to `<Base>` (S8.4, S8.5)
- [ ] T007 [US2] Run [quickstart.md](./quickstart.md) Scenario 2; fix any issue found

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 4: User Story 3 - Everywhere else stays exactly as it was (Priority: P3)

**Goal**: `/` and `/about` footers are unchanged by this feature.

**Independent Test**: Load `/` and `/about`, compare their footers
against their state before this feature.

- [ ] T008 [US3] Run [quickstart.md](./quickstart.md) Scenario 3 against `/` and `/about`; if either footer differs from its pre-feature state, fix `Footer.astro`/`ContactInfo.astro` until it doesn't

**Checkpoint**: All three user stories independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T009 [P] Run [quickstart.md](./quickstart.md) Scenario 4 (`grep -ril "<script" dist/`, then continuous resize 320px–2560px on all three pages); confirm no output and no horizontal scrollbar anywhere
- [ ] T010 Update root `PLAN.md` §7 Milestone 4 checklist once T001–T009 all pass — this closes the milestone entirely, both halves

---

## Dependencies & Execution Order

- **Foundational (Phase 1)**: No dependencies. Blocks every user story.
  T001 → T002 → T003 in sequence (each depends on the previous file
  existing).
- **User Story 1 (Phase 2)**: Depends on Phase 1.
- **User Story 2 (Phase 3)**: Depends on Phase 1 (specifically T003).
  Independent of Phase 2's file (`contact.astro`'s invitation content vs.
  its `footerCopyright` prop are different edits to the same file, applied
  in sequence, not conflicting).
- **User Story 3 (Phase 4)**: Depends on Phase 1 only — this is
  verification of `/` and `/about`, which this feature doesn't edit
  directly; it only needs the shared-component refactor to be done.
- **Polish (Phase 5)**: Depends on Phases 2–4 all complete.

## Implementation Strategy

**MVP first**: Phases 1–2 alone produce a working `/contact` with the
invitation and contact channels visible — before the footer swap or the
regression check are verified. That is the MVP.

**Incremental delivery**: Phase 3 (footer swap) and Phase 4 (regression
check) can be verified in either order after Phase 2. Land Phase 5 last —
it's the point where Milestone 4 as a whole closes.
