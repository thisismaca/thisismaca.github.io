# Tasks: The Shell

**Input**: Design documents from `specs/001-shell/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not included. `research.md` records the decision against an
automated test framework for this project — verification is the manual
`quickstart.md` scenarios, referenced directly from the relevant phases below.

**A note on "independently testable" for this feature**: Spec Kit's model
assumes each user story touches mostly distinct files (its own model,
service, endpoint). This feature is a shared page shell, so `Header.astro`
and `Footer.astro` each carry requirements from more than one story — the
header's *existence and one-line layout* is US1, its *shadow and typography*
is US2; the footer's *structure* is foundational, its *content and layout*
is US3. Where a file is touched across phases, tasks are ordered so each
phase still ends at a state matching that story's Independent Test in
`spec.md`, even though the file isn't exclusive to one phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: Which user story this task belongs to (US1/US2/US3)

## Path Conventions

Single project. All paths relative to repository root.

---

## Phase 1: Setup

**Purpose**: Config shared by every route and component.

- [ ] T001 Add a `fonts:` array to `astro.config.mjs` registering `"Grenze Gotisch"` and `"Zalando Sans SemiExpanded"` via `fontProviders.google()`, per the decision in [research.md](./research.md)
- [ ] T002 [P] Create `src/styles/global.css`: custom properties for the fixed palette (`--color-home-bg: #444444`, `--color-white: #FFFFFF`, `--color-menu-text: #333333`; body text black; Instagram glyph grey — S10) and a minimal box-sizing/margin reset

**Checkpoint**: Font config and palette variables exist; nothing renders yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared layout and components every route composes. No user
story is independently testable until this phase is done.

**⚠️ CRITICAL**: Do not start Phase 3+ before this checkpoint.

- [ ] T003 [P] Create `src/components/Header.astro`: three `<a>` items (Home → `/`, About → `/about`, Contact → `/contact`); accept a `shadow` boolean prop (default `false`)
- [ ] T004 [P] Create `src/components/Footer.astro`: two-half structure — left half plain text `thisismaca@gmail.com` (not an anchor); right half an `<a href="https://instagram.com/thisismaca" target="_blank" rel="noopener noreferrer">` containing `@thisismaca` and an Instagram glyph
- [ ] T005 Create `src/layouts/Base.astro` (depends on T003, T004): imports `global.css`, accepts a `headerShadow` boolean prop (default `false`) forwarded to `<Header shadow={headerShadow} />`, renders `<Footer />`, and a `<slot />` for page content

**Checkpoint**: `Base`/`Header`/`Footer` exist and compose, but are not yet
wired to routes, responsive, typeset, or styled for shadow/colour.

---

## Phase 3: User Story 1 - Move between the three pages from anywhere (Priority: P1) 🎯 MVP

**Goal**: All three routes exist, are reachable through the header, stay on
one line down to 320px, and work with JavaScript disabled and via keyboard.

**Independent Test**: Load `/`, `/about`, `/contact` at 320px with
JavaScript disabled; confirm the header renders as one unbroken row on every
page and each item navigates correctly. Tab through with no mouse.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Replace the scaffold placeholder in `src/pages/index.astro` with `Base` (`headerShadow={false}`), empty body (FR-001, FR-002…FR-013 via Base)
- [ ] T007 [P] [US1] Create `src/pages/about.astro` using `Base` (`headerShadow={true}`), empty body
- [ ] T008 [P] [US1] Create `src/pages/contact.astro` using `Base` (`headerShadow={true}`), empty body
- [ ] T009 [US1] In `src/components/Header.astro`, style the nav row: `flex-wrap: nowrap`, centred, `clamp(15px, 3vw, 30px)` padding-top (S4.5), `clamp(5px, 1vw, 8px)` padding-bottom (S4.6), 5px minimum horizontal padding (S4.7), `clamp(8px, 4vw, 30px)` gap between items (S4.8), height left as a consequence of padding and line-box, never set directly (S4.9)
- [ ] T010 [US1] Run [quickstart.md](./quickstart.md) Scenario 1 against all three routes; fix any wrap, overflow, or keyboard-focus issue found

**Checkpoint**: User Story 1 is independently functional — three real pages,
working JS-free navigation, one-line header at 320px.

---

## Phase 4: User Story 2 - Recognise the site's identity, not a template (Priority: P2)

**Goal**: Correct typefaces at the correct sizes with no invisible-text
flash, the header shadow present on exactly the right two pages, and the
correct background on each page.

**Independent Test**: Load any page on a throttled connection; confirm menu
and body text render immediately in the right typeface/size, and that the
header shadow appears on `/about`/`/contact` but not `/`.

### Implementation for User Story 2

- [ ] T011 [US2] In `src/components/Header.astro`, set menu item type to the Grenze Gotisch custom property, weight 500, `20px` from 768px up and `16px` below (S9.1), colour `--color-menu-text`
- [ ] T012 [P] [US2] In `src/styles/global.css`, set body text to the Zalando Sans SemiExpanded custom property, regular, `14px`, black on white (S9.2)
- [ ] T013 [US2] In `src/components/Header.astro`, add a shadow style applied only when the `shadow` prop is true (S4.11)
- [ ] T014 [P] [US2] Set page backgrounds: `--color-home-bg` on `src/pages/index.astro` (FR-020a), `--color-white` on `src/pages/about.astro` and `src/pages/contact.astro` (FR-015)
- [ ] T015 [US2] Run [quickstart.md](./quickstart.md) Scenario 2; fix any invisible-text flash or incorrect shadow/background found

**Checkpoint**: User Stories 1 and 2 both independently functional.

---

## Phase 5: User Story 3 - Find a way to make contact (Priority: P3)

**Goal**: The footer exposes the email and Instagram handle correctly on
every page, the Instagram link opens in a new tab, and both halves stay
side by side at every width.

**Independent Test**: On any page, confirm the footer's two halves, that
the email is plain text, and that activating Instagram opens a new tab.

### Implementation for User Story 3

- [ ] T016 [US3] In `src/components/Footer.astro`, lay out the two halves as a non-wrapping flex row, each centred within itself, shrinking rather than stacking at any width (S5.5)
- [ ] T017 [US3] In `src/components/Footer.astro`, style the Instagram glyph grey and confirm the anchor carries both `target="_blank"` and `rel="noopener noreferrer"` (S5.3, S5.4)
- [ ] T018 [US3] Confirm `src/components/Footer.astro` carries no shadow or border in any state (S5.6)
- [ ] T019 [US3] Run [quickstart.md](./quickstart.md) Scenario 3; fix any stacking, styling, or new-tab issue found

**Checkpoint**: All three user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T020 [P] Run [quickstart.md](./quickstart.md) Scenario 4 (continuous resize, 320px→1440px) across all three pages; confirm no visible snap in header padding/gap
- [ ] T021 Run [quickstart.md](./quickstart.md) Scenario 5: `npm run build && npm run preview -- --host`, repeat Scenarios 1–3 against the built site, then confirm `grep -ril "<script" dist/` returns nothing
- [ ] T022 Update root `PLAN.md` §7 Milestone 1 checklist once T001–T021 all pass

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. Blocks every user story.
- **User Story 1 (Phase 3)**: Depends on Phase 2 only.
- **User Story 2 (Phase 4)**: Depends on Phase 2. Edits `Header.astro`
  again (T011, T013) — run after Phase 3's edits to the same file (T009) to
  avoid clobbering, not because US2 depends on US1's outcome.
- **User Story 3 (Phase 5)**: Depends on Phase 2 only. Independent of
  Phases 3–4's files (`Footer.astro` isn't touched by either).
- **Polish (Phase 6)**: Depends on Phases 3–5 all complete.

## Parallel Example: Phase 2

```bash
# T003 and T004 touch different files and share no dependency:
Task: "Create src/components/Header.astro"
Task: "Create src/components/Footer.astro"
# T005 (Base.astro) waits for both.
```

## Implementation Strategy

**MVP first**: Phases 1–3 alone produce a real, deployable, navigable
three-page site with correct structure and accessibility — before any
typography or footer content is styled. That is the MVP.

**Incremental delivery**: Phase 4 (identity) and Phase 5 (contact) can be
built in either order after Phase 3 — neither depends on the other, since
one edits `Header.astro`/pages and the other only `Footer.astro`. Land
Phase 6 last, since its checks assume every prior phase is done.
