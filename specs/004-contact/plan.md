# Implementation Plan: The Contact Page

**Branch**: `develop` (no per-feature git branch — no `.specify/extensions.yml`
git hook is configured; work happens on `develop` per root `PLAN.md` §6) | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-contact/spec.md`

## Summary

Extract the existing email/Instagram footer content into a shared
`ContactInfo` component, render it as page content on `/contact` alongside
the finalized invitation text, and give `Footer.astro` a `copyright`
boolean prop so `/contact`'s footer shows only the copyright line while
`/` and `/about` are unaffected. Closes Milestone 4 (`PLAN.md` §7).

## Technical Context

**Language/Version**: Astro 7.1.6 on Node 24.18.0 LTS — inherited.

**Primary Dependencies**: `astro` only — no new package; this is a
component refactor using the boolean-prop pattern already established by
`Header.astro`'s `shadow` prop.

**Storage**: N/A — no content collection, same reasoning as `003-about`.

**Testing**: No automated framework — verified against
[quickstart.md](./quickstart.md).

**Target Platform**: Static site, evergreen browsers. No script anywhere
in this feature (Constitution V) — a prop swap and a plain paragraph.

**Project Type**: Single static site — unchanged.

**Performance Goals**: N/A beyond what's already established — no images,
no new assets.

**Constraints**: The refactor must not visibly change `/` or `/about`'s
footer (spec.md User Story 3) — the real constraint this feature has to
satisfy that prior features didn't.

**Scale/Scope**: One new component (`ContactInfo.astro`), one modified
component (`Footer.astro`), one modified layout (`Base.astro`), one
modified page (`contact.astro`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

| Principle | Status | Note |
|---|---|---|
| I. The work wins | PASS (N/A) | Contact isn't gallery content; untouched by this feature. |
| II. One gallery, not several | PASS (N/A) | Not applicable. |
| III. Content is files in Git | PASS | The invitation text is a committed file, same as everything else. |
| IV. Static output, portable host | PASS | Plain markup; nothing host-specific. |
| V. JavaScript must earn its place | PASS | A boolean prop and a `{condition ? a : b}` in the template — no script. |
| VI. Portfolio, not shop | PASS (N/A) | No commerce surface. |
| VII. No image without alt text | PASS (N/A) | No images in this feature. |
| Spec before code | PASS | This plan implements `spec.md`, which scopes `SPEC.md` directly. |

**No violations. Complexity Tracking is not needed and is omitted.**

*Post-Phase-1 re-check*: unchanged — the extraction introduces no
dependency, server, or script; it's a refactor of already-static markup.

## Project Structure

### Documentation (this feature)

```text
specs/004-contact/
├── plan.md              # this file
├── research.md          # Phase 0 — the extraction decision
├── data-model.md         # Phase 1 — states explicitly: no entities
├── quickstart.md        # Phase 1 — manual verification steps
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify)
```

No `contracts/` — same reasoning as every prior feature.

### Source Code (repository root)

```text
src/
├── components/
│   ├── ContactInfo.astro   # new — extracted from Footer.astro
│   └── Footer.astro         # modified — `copyright` prop, renders
│                             # <ContactInfo /> or the copyright line
├── layouts/
│   └── Base.astro           # modified — forwards a `footerCopyright` prop
└── pages/
    └── contact.astro        # modified — invitation text + <ContactInfo />
```

**Structure Decision**: single project, unchanged. `Header.astro` and the
piece stack (`Piece.astro`, `content.config.ts`, `src/content/pieces/`)
are untouched — this feature's blast radius is exactly the footer/contact
chain research.md identifies, nothing wider.

## Complexity Tracking

*Not applicable — no Constitution Check violations were found.*
