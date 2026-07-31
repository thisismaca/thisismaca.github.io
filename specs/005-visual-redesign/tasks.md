# Tasks: The Visual Redesign

**Input**: Design documents from `specs/005-visual-redesign/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not included — no automated framework project-wide. Verified
manually against [quickstart.md](./quickstart.md).

**A note on scope**: the header, footer, and typography changes (US3) are
entirely shared-component work that has to exist before any page can be
correctly verified — there's no page-specific "wiring" step left over for
US3 the way About/Contact needed their own prop additions for US2. So US3's
phase below is verification-only; its implementation lives in Foundational.
This is the same shape `001-shell` and `003-about` used when a shared
change front-loaded a later story's actual work.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)

---

## Phase 1: Setup

- [X] T001 In `astro.config.mjs`, add Vazirmatn to the `fonts:` array via `fontProviders.google()`, `cssVariable: '--font-body'` (reusing the existing variable name — the underlying family changes, callers don't need to), `weights: [300, 400]`; remove the Zalando Sans SemiExpanded entry entirely

**Checkpoint**: Font config updated. Nothing renders differently yet — no `<Font>` call points at the new registration.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared layout, component, and style changes every user
story depends on.

**⚠️ CRITICAL**: Do not start Phase 3+ before this checkpoint.

- [X] T002 In `src/layouts/Base.astro` (depends on T001): remove the `headerShadow` and `background` props entirely (both are now dead — shadow is universal, every page is white); wrap `<slot />` in a `<main>` element; add `narrowContent`/`centerContent` boolean props (both default `false`) with `@media (min-width: 768px)` CSS on `<main>` — `narrowContent` sets `width: 33.333%; margin-inline: auto`, `centerContent` additionally sets `display: flex; flex-direction: column; justify-content: center`; make `body` a flex column with `min-height: 100vh` and `<main>` `flex: 1 0 auto` (this alone satisfies S8.8's sticky footer for every page, not just Contact); replace the Zalando Sans SemiExpanded `<Font>` call with nothing (same `--font-body` variable now serves Vazirmatn per T001); remove `<Header shadow={...} />`'s prop, calling it unconditionally
- [X] T003 In `src/styles/global.css` (depends on T001): remove the `--color-home-bg` custom property and the `body[data-bg='dark']` rule entirely (dead now that every page is white); update `body`'s font rule to `font-weight: 300; font-size: 18px` (was 400/14px)
- [X] T004 [P] In `src/components/Header.astro`: remove the `shadow` prop, apply the `has-shadow` class unconditionally; add a `@media (min-width: 768px)` block wrapping the nav items in a `width: 33.333%; margin-inline: auto` span with `justify-content: space-between` (replacing `gap` at this breakpoint only — below 768px, today's `justify-content: center` and `gap: clamp(8px, 4vw, 30px)` stay exactly as they are); update menu font-size to `28px` (was 20px) inside that same media query, and `24px` (was 16px) in the base/mobile rule
- [X] T005 [P] In `src/components/Footer.astro`, add `@media (min-width: 768px) { footer { height: 80px; display: flex; align-items: center; } }` — no change below 768px
- [X] T006 [P] In `src/components/Piece.astro`, change `.title` from `font-weight: 700` to `font-family: var(--font-body); font-weight: 400; font-size: 20px` (S9.4) — `.description` needs no change, it already inherits the new S9.2 default from `body`

**Checkpoint**: Every shared component reflects the redesign. Pages
haven't been wired to the new `Base` props yet, so width/centring won't
show up until Phase 3+.

---

## Phase 3: User Story 1 - See the work in a narrower, more editorial frame (Priority: P1) 🎯 MVP

**Goal**: Home is white, narrowed to the middle third at 768px+, with no
gap between piece units.

**Independent Test**: Load `/` at 1024px and confirm white background,
narrowed column, and flush piece units with 10px caption padding as the
only separation.

- [X] T007 [US1] In `src/pages/index.astro` (depends on T002): remove the `background="dark"` prop (Base has no such prop anymore); add `narrowContent={true}`
- [X] T008 [US1] Remove the `.stack`'s `gap`/`padding-block: 20px` rule from `src/styles/global.css`; add `padding-bottom: 10px` to `Piece.astro`'s `.caption` rule (S6.14)
- [X] T009 [US1] Run [quickstart.md](./quickstart.md) Scenario 1; fix any issue found

**Checkpoint**: User Story 1 independently functional.

---

## Phase 4: User Story 2 - About and Contact feel centred and considered (Priority: P2)

**Goal**: Both pages narrow and vertically centre at 768px+; About's photo
grows to 200px tall with new text padding; Contact's footer sticks to the
viewport bottom.

**Independent Test**: Load `/about` and `/contact` at 1024px and confirm
both horizontal narrowing and vertical centring; confirm neither applies
below 768px.

- [X] T010 [US2] In `src/pages/about.astro` (depends on T002): remove the `headerShadow` prop; add `narrowContent={true} centerContent={true}`; change the `<Image>` `height` prop from `100` to `200` (width stays `80`); add `padding-left: 20px` to the body text (not the photo)
- [X] T011 [US2] In `src/pages/contact.astro` (depends on T002): remove the `headerShadow` prop; add `narrowContent={true} centerContent={true}`
- [X] T012 [US2] Run [quickstart.md](./quickstart.md) Scenario 2; fix any issue found

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 5: User Story 3 - Notice the refined chrome and type (Priority: P3)

**Goal**: Header nav spans the middle third at 768px+ and reads larger;
the header shadow is universal; the footer has a fixed height at 768px+;
body text is in the new typeface; caption titles have their own distinct
treatment.

**Independent Test**: Load any page at 768px+ and confirm the header
span/size/shadow, footer height, and typography — all already built in
Phase 2 (T004–T006); this phase verifies rather than implements.

- [X] T013 [US3] Run [quickstart.md](./quickstart.md) Scenario 3 (depends on T002–T006); fix anything found

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T014 [P] Run [quickstart.md](./quickstart.md) Scenario 4 (`grep -ril "<script" dist/`, throttled font check, continuous resize 320px–2560px on all three pages); confirm no output, no invisible text, no horizontal scroll
- [X] T015 Update root `PLAN.md` Milestone 6 checklist once T001–T014 all pass

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks every user story. T002 depends on T001 (needs the new font registration to reference); T003 likewise. T004–T006 are independent files and fully parallel.
- **User Story 1 (Phase 3)**: Depends on Phase 2 (specifically T002, T003, T006).
- **User Story 2 (Phase 4)**: Depends on Phase 2 (specifically T002). Independent of Phase 3's files.
- **User Story 3 (Phase 5)**: Depends on Phase 2 in full — it's verifying what Phase 2 already built.
- **Polish (Phase 6)**: Depends on Phases 3–5 all complete.

## Parallel Example: Phase 2

```bash
# T004, T005, T006 touch three different files with no dependency between them:
Task: "Update src/components/Header.astro"
Task: "Update src/components/Footer.astro"
Task: "Update src/components/Piece.astro"
# T002 and T003 must run first (T004-T006 don't depend on them, but they
# share no files either, so ordering between the two groups doesn't matter).
```

## Implementation Strategy

**MVP first**: Phases 1–3 alone produce a redesigned Home page — the
site's actual purpose — before About, Contact, or the chrome details are
touched. That is the MVP.

**Incremental delivery**: Phase 4 (About/Contact) and Phase 5
(verification of chrome/type, already built in Phase 2) can happen in
either order after Phase 3. Land Phase 6 last.
