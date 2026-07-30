# Implementation Plan: The Shell

**Branch**: `develop` (no per-feature git branch — no `.specify/extensions.yml`
git hook is configured; work happens on `develop` per root `PLAN.md` §6) | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-shell/spec.md`

## Summary

Build the base layout, header, and footer shared by all three routes
(`/`, `/about`, `/contact`), with the fixed palette and both typefaces, and
stub `/about` and `/contact` as empty white pages. No piece content, no
images, no content collection — this feature is structural chrome only, per
`spec.md`'s three user stories (navigate; read as a considered gallery, not a
template; find a way to make contact).

## Technical Context

**Language/Version**: Astro 7.1.6 on Node 24.18.0 LTS — decided and confirmed
in root `PLAN.md` §1.1; not re-litigated here.

**Primary Dependencies**: `astro` only. No UI framework (React/Vue/Svelte) —
root `PLAN.md` §1.3 calls for plain Astro components and CSS, and nothing in
this feature (three static routes, no interactivity) needs more.

**Storage**: N/A. No content collection is touched by this feature — that's
Milestone 2 (root `PLAN.md` §7).

**Testing**: No automated framework. Verified manually against
[quickstart.md](./quickstart.md) and root `PLAN.md` §8 — see
[research.md](./research.md) for why.

**Target Platform**: Static site, evergreen browsers, must render and behave
identically with JavaScript disabled (S12.1) and via keyboard only (S12.5).

**Project Type**: Single static site — Option 1 (single project) below, with
the unused options removed.

**Performance Goals**: Zero `<script>` tags in build output (S12.1); no
invisible or mismatched text during font load (S9.3).

**Constraints**: Exactly one breakpoint, 768px (S11.1); no horizontal scroll
from 320px up (S11.3); three header items on one line down to 320px (S4.4);
header padding/spacing fluid via `clamp()`, never snapping across a
breakpoint (S4.5–S4.8).

**Scale/Scope**: Three routes, two shared components (`Header`, `Footer`),
one shared layout (`Base`), one stylesheet, one font config entry per
typeface. No data entities.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

| Principle | Status | Note |
|---|---|---|
| I. The work wins | PASS (N/A) | No images exist yet in this feature; chrome is kept minimal (plain white blocks, no ornament) so it won't compete with work added later. |
| II. One gallery, not several | PASS (N/A) | No content/medium distinction exists at the chrome level. |
| III. Content is files in Git | PASS (N/A) | This feature touches no content collection. |
| IV. Static output, portable host | PASS | Header/footer/layout are plain Astro components compiled to static HTML/CSS; nothing depends on GitHub Pages specifically. |
| V. JavaScript must earn its place | PASS | Navigation is plain `<a>` elements; the Instagram link is a plain anchor with `target="_blank" rel="noopener noreferrer"`. No script is needed for anything in this feature's scope. |
| VI. Portfolio, not shop | PASS (N/A) | No commerce surface in this feature. |
| VII. No image without alt text | PASS (N/A) | No images in this feature. |
| Spec before code | PASS | This plan implements `spec.md`, which itself only scopes `SPEC.md` — no behaviour is being invented here. |

**No violations. Complexity Tracking is not needed and is omitted.**

*Post-Phase-1 re-check: unchanged — the font and testing decisions in
`research.md` introduce no new dependency, server, or piece of client
JavaScript, so no principle above is newly at risk.*

## Project Structure

### Documentation (this feature)

```text
specs/001-shell/
├── plan.md              # this file
├── research.md          # Phase 0 — font provider and testing-approach decisions
├── data-model.md         # Phase 1 — states explicitly: no entities this feature
├── quickstart.md        # Phase 1 — manual verification steps
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify)
```

No `contracts/` directory: this feature exposes no API, CLI, or other
consumable interface — it is page markup and styling in a purely static
site. Generating one would be ceremony with nothing to contract.

### Source Code (repository root)

```text
astro.config.mjs        # add `fonts:` array (research.md)

src/
├── layouts/
│   └── Base.astro       # <head>, font links, shared <body> shell;
│                         # takes a `headerShadow` boolean prop (default false)
├── components/
│   ├── Header.astro     # S4 — three nav items, reads `headerShadow` from Base
│   └── Footer.astro     # S5 — email + Instagram halves; built as one
│                         # component so /contact's later content-swap (S5.7,
│                         # Milestone 4) doesn't require restructuring it
├── pages/
│   ├── index.astro       # replaces scaffold placeholder; headerShadow=false
│   ├── about.astro       # new; empty white body; headerShadow=true
│   └── contact.astro     # new; empty white body; headerShadow=true
└── styles/
    └── global.css        # palette custom properties, resets, clamp() values
```

**Structure Decision**: single project (no `backend/`/`frontend/` split —
there is no backend). This matches the tree already sketched in root
`PLAN.md` §2; this feature builds only the `layouts/`, `Header`/`Footer`
components, the three page files, and `global.css` from that sketch.
`src/content/` and `src/assets/` are deliberately not created by this
feature — they belong to Milestone 2.

## Complexity Tracking

*Not applicable — no Constitution Check violations were found.*
