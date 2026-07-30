# Implementation Plan: The About Page

**Branch**: `develop` (no per-feature git branch — no `.specify/extensions.yml`
git hook is configured; work happens on `develop` per root `PLAN.md` §6) | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-about/spec.md`

## Summary

Fill `/about`'s existing empty shell (built in `001-shell`) with the site
owner's real bio copy, her photo cropped to a small fixed box, a working
link to the site's own source repository, and a CSS-only breakpoint switch
between text-wraps-photo (≥768px) and photo-centred-above-text (<768px).

## Technical Context

**Language/Version**: Astro 7.1.6 on Node 24.18.0 LTS — inherited, not
re-decided.

**Primary Dependencies**: `astro` only — `<Image>` with a per-instance
`layout="fixed"` override, no new package.

**Storage**: N/A — no content collection; About's copy and photo live
directly in `src/pages/about.astro` (see `research.md`'s Component
Structure decision).

**Testing**: No automated framework, unchanged project-wide — verified
against [quickstart.md](./quickstart.md).

**Target Platform**: Static site, evergreen browsers. The breakpoint
switch must work with JavaScript disabled (S12.1, Constitution V) — it's
a `@media` query, nothing else.

**Project Type**: Single static site — unchanged.

**Performance Goals**: The photo generates exactly two width variants
(1x/2x of 80px), not the piece stack's full responsive set — `research.md`
explains why `layout="fixed"` is the correct override here.

**Constraints**: One breakpoint at 768px, already established by
`001-shell`, now also governing this page's layout (S11.1); nothing
scrolls horizontally from 320px up (S11.3).

**Scale/Scope**: One page, one photo, two paragraphs of fixed copy, one
external link. No data model.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

| Principle | Status | Note |
|---|---|---|
| I. The work wins | PASS (N/A) | About isn't gallery content; nothing here competes with the piece stack, which this feature doesn't touch. |
| II. One gallery, not several | PASS (N/A) | Not applicable to a bio page. |
| III. Content is files in Git | PASS | The bio copy and photo are committed files, same as everything else on the site — just not a content-collection entry, since there's only ever one About page (`research.md`). |
| IV. Static output, portable host | PASS | Plain markup and CSS; the photo goes through the same build-time pipeline as the piece images. |
| V. JavaScript must earn its place | PASS | The breakpoint switch is a `@media` query. No script anywhere in this feature. |
| VI. Portfolio, not shop | PASS (N/A) | No commerce surface. |
| VII. No image without alt text | PASS | The photo gets real, descriptive alt text — same bar as the piece images. |
| Spec before code | PASS | This plan implements `spec.md`, which itself scopes `SPEC.md`; the influences question was resolved in `SPEC.md` §7 directly before this plan was written. |

**No violations. Complexity Tracking is not needed and is omitted.**

*Post-Phase-1 re-check*: unchanged — `research.md`'s decisions (a `layout`
override, `object-fit`, a CSS float) introduce no dependency, server, or
script.

## Project Structure

### Documentation (this feature)

```text
specs/003-about/
├── plan.md              # this file
├── research.md          # Phase 0 — layout override, cropping, float mechanism
├── data-model.md         # Phase 1 — states explicitly: no entities
├── quickstart.md        # Phase 1 — manual verification steps
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify)
```

No `contracts/` — same reasoning as `001-shell`/`002-content-stack`: no
exposed interface to contract.

### Source Code (repository root)

```text
src/
├── assets/
│   └── maca-portrait.jpg   # already committed — the site owner's photo
└── pages/
    └── about.astro          # modified — fills the existing empty shell
```

**Structure Decision**: single project, unchanged. This feature touches
exactly one file (`about.astro`) beyond the already-committed photo asset
— no new component, no schema, no change to `Header`/`Footer`/`Base`/the
piece stack.

## Complexity Tracking

*Not applicable — no Constitution Check violations were found.*
