# Implementation Plan: The Visual Redesign

**Branch**: `develop` (no per-feature git branch — no `.specify/extensions.yml`
git hook is configured; work happens on `develop` per root `PLAN.md` §6) | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-visual-redesign/spec.md`

## Summary

Re-skin the shipped site per `SPEC.md` draft 4: white backgrounds
throughout, a narrower centred column on large screens (with vertical
centring on About/Contact only), a header nav that spans a specific width
and reads larger, a fixed-height footer that sticks to the viewport bottom
on short pages, a new default typeface, and a distinct caption-title
treatment. No new routes, no new content, no new breakpoint.

## Technical Context

**Language/Version**: Astro 7.1.6 on Node 24.18.0 LTS — inherited.

**Primary Dependencies**: `astro` only — Vazirmatn via the same
`fontProviders.google()` mechanism already used for the site's other two
typefaces; no new package.

**Storage**: N/A — no content collection touched.

**Testing**: No automated framework — verified against
[quickstart.md](./quickstart.md).

**Target Platform**: Static site, evergreen browsers. Every behaviour in
this feature (width, centring, sticky footer, fonts) is CSS-only —
Constitution V holds, no script anywhere.

**Project Type**: Single static site — unchanged.

**Performance Goals**: No new image or asset weight beyond the two new
Vazirmatn weights (300, 400); no new JavaScript.

**Constraints**: Exactly one breakpoint, 768px, for every large/small
distinction this feature introduces (`SPEC.md` S11.1) — confirmed
necessary, not just convenient, by the header nav math in `research.md`.

**Scale/Scope**: Modifies `Header.astro`, `Footer.astro`, `Piece.astro`,
`Base.astro`, `global.css`, `astro.config.mjs`, and all three page files
(`index.astro`, `about.astro`, `contact.astro`). No new components, no
new routes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

| Principle | Status | Note |
|---|---|---|
| I. The work wins | PASS | A narrower, more considered frame is a deliberate curatorial choice for the work, not chrome competing with it — the site owner's own call to make. |
| II. One gallery, not several | PASS (N/A) | No category/filter introduced. |
| III. Content is files in Git | PASS (N/A) | No content touched. |
| IV. Static output, portable host | PASS | Pure CSS/markup changes; nothing host-specific. |
| V. JavaScript must earn its place | PASS | Every requirement in this feature — width, centring, sticky footer, fonts — is achievable in CSS. Confirmed during spec-writing, not assumed. |
| VI. Portfolio, not shop | PASS (N/A) | No commerce surface touched. |
| VII. No image without alt text | PASS (N/A) | No new images; About's existing photo keeps its existing alt text. |
| Spec before code | PASS | This plan implements `SPEC.md` draft 4 directly; the one real conflict found (header nav math) was fixed in the spec itself before this plan was written, not patched around in code. |

**No violations. Complexity Tracking is not needed and is omitted.**

*Post-Phase-1 re-check*: unchanged — every `research.md` decision is
CSS/config, no new dependency, server, or script.

## Project Structure

### Documentation (this feature)

```text
specs/005-visual-redesign/
├── plan.md              # this file
├── research.md          # Phase 0 — nav math, sticky-footer mechanism, font swap
├── data-model.md         # Phase 1 — states explicitly: no entities
├── quickstart.md        # Phase 1 — manual verification steps
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify)
```

No `contracts/` — same reasoning as every prior feature.

### Source Code (repository root)

```text
astro.config.mjs             # modified — Vazirmatn added, Zalando Sans SemiExpanded removed

src/
├── layouts/
│   └── Base.astro            # modified — <main> wrapper, narrowContent/centerContent props,
│                               # font swap in <head>, universal header shadow (drop the toggle)
├── components/
│   ├── Header.astro           # modified — middle-third nav span (768px+), larger menu text
│   ├── Footer.astro           # modified — fixed 80px height (768px+)
│   └── Piece.astro            # modified — caption title font/weight/size (drop bold)
├── styles/
│   └── global.css             # modified — remove --color-home-bg, update body font
└── pages/
    ├── index.astro             # modified — background prop removed (Base now defaults white),
    │                            # narrowContent={true}, stack gap/padding-block removed
    ├── about.astro              # modified — photo height 200px, +20px text padding,
    │                            # narrowContent+centerContent={true}, headerShadow prop removed
    └── contact.astro            # modified — narrowContent+centerContent={true},
                                  # headerShadow prop removed
```

**Structure Decision**: single project, unchanged. No new files except the
documentation above — this feature only modifies what `001-shell`,
`002-content-stack`, `003-about`, and `004-contact` already built.

## Complexity Tracking

*Not applicable — no Constitution Check violations were found.*
