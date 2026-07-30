# Implementation Plan: Content Pieces and the Stack

**Branch**: `develop` (no per-feature git branch — no `.specify/extensions.yml`
git hook is configured; work happens on `develop` per root `PLAN.md` §6) | **Date**: 2026-07-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-content-stack/spec.md`

## Summary

Build the content collection schema for pieces, populate it with the five
finished pieces, and render them as the Home page stack: full-width images
with per-piece captions, 20px gaps, the first image eager/high-priority and
the rest lazy, zero layout shift. Delivers `spec.md`'s three stories — see
the actual work, fast/stable loading, and adding a piece is one file — as
one feature, per the Milestone 2+3 merge recorded in root `PLAN.md` §7.

## Technical Context

**Language/Version**: Astro 7.1.6 on Node 24.18.0 LTS — inherited from
`001-shell`, not re-decided here.

**Primary Dependencies**: `astro` only — `image()`, `<Image>`, and the
Content Layer API are all built in; no new package.

**Storage**: N/A in the database sense — content is `.md` files with
frontmatter under `src/content/pieces/`, which *is* the storage
(Constitution III).

**Testing**: No automated framework, unchanged from `001-shell` — verified
manually against [quickstart.md](./quickstart.md).

**Target Platform**: Static site, evergreen browsers. The stack must render
identically with JavaScript disabled (S12.1) — `<Image>` emits a plain
`<img>` with `srcset`, no client script.

**Project Type**: Single static site — same as `001-shell`.

**Performance Goals**: Multiple image widths generated per piece (S12.3);
first image eager-loaded at high `fetchpriority`, every other image lazy
(S6.10/S6.11); zero cumulative layout shift (S6.12); zero `<script>` tags
in the build output, unchanged from `001-shell` (S12.1).

**Constraints**: One column at every width, never a grid (S11.4); nothing
scrolls horizontally from 320px up (S11.3); the 20px minimum gap (S6.7,
S6.8) is one property on the stack container, not per-piece margins, so it
cannot drift piece-to-piece (root `PLAN.md` §5).

**Scale/Scope**: Five pieces now; schema supports the remaining five
launch pieces as plain file additions with no code change (S2.1, S2.3).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Checked against `.specify/memory/constitution.md`:

| Principle | Status | Note |
|---|---|---|
| I. The work wins | PASS | This is the first feature where real work exists. Chrome stays exactly as restrained as `001-shell` left it — nothing new competes with the images; captions are plain text blocks, no ornament. |
| II. One gallery, not several | PASS | All five pieces are the same medium (live photography); nothing in the schema or layout introduces a category, filter, or section. `order` is the only differentiator. |
| III. Content is files in Git | PASS | This is what the feature builds — one `.md` file per piece, no database, no admin UI. |
| IV. Static output, portable host | PASS | Astro's image pipeline runs at build time; output is plain files with no host-specific dependency. |
| V. JavaScript must earn its place | PASS | `<Image>` renders a plain `<img>` with `srcset`/`sizes`; no client-side script is introduced anywhere in this feature. |
| VI. Portfolio, not shop | PASS (N/A) | No commerce surface touched. |
| VII. No image without alt text | PASS | The first feature where this is actively exercised rather than theoretical — `image()` + a non-empty `alt` schema field make a missing one a build failure (S2.2), not a review-time convention. |
| Spec before code | PASS | This plan implements `spec.md`, which itself only scopes `SPEC.md`. |

**No violations. Complexity Tracking is not needed and is omitted.**

*Post-Phase-1 re-check*: unchanged. `research.md`'s decisions (`image()`
schema helper, `layout: 'full-width'`, the `priority` prop) are all
build-time/static — none of them introduce a server, a new dependency
beyond Astro itself, or a runtime script.

## Project Structure

### Documentation (this feature)

```text
specs/002-content-stack/
├── plan.md              # this file
├── research.md          # Phase 0 — image() schema helper, layout config, priority prop
├── data-model.md         # Phase 1 — the Piece entity
├── quickstart.md        # Phase 1 — manual verification steps
└── checklists/
    └── requirements.md  # spec quality checklist (from /speckit-specify)
```

No `contracts/` — same reasoning as `001-shell`: a static site with no
exposed interface has nothing to contract.

### Source Code (repository root)

```text
astro.config.mjs           # add image: { layout: 'full-width', responsiveStyles: true }

src/
├── content.config.ts       # new — pieces collection: glob() loader + schema
├── content/
│   └── pieces/             # new — one .md file per piece, five for this feature
│       ├── kirk-hammett-london.md
│       ├── mario-duplantier-frankfurt.md
│       ├── jean-michel-labadie-cardiff.md
│       ├── rex-brown-london.md
│       └── phil-anselmo-london.md
├── assets/
│   └── pieces/              # new — source images, already copied into place
│       ├── kirk-hammett-london.jpg
│       ├── mario-duplantier-frankfurt.jpg
│       ├── jean-michel-labadie-cardiff.jpg
│       ├── rex-brown-london.jpg
│       └── phil-anselmo-london.jpg
├── components/
│   └── Piece.astro          # new — S6.3: image + its own caption, flush together
├── pages/
│   └── index.astro          # modified — renders the stack instead of an empty body
└── styles/
    └── global.css           # modified — stack container gap (S6.7/S6.8)
```

**Structure Decision**: single project, unchanged from `001-shell`. This
feature adds exactly the `src/content/`, `src/assets/pieces/`, and
`Piece.astro` pieces that `001-shell`'s plan deliberately left for
Milestone 2 — nothing outside that scope is touched. `Header.astro`,
`Footer.astro`, and `Base.astro` are not modified.

## Complexity Tracking

*Not applicable — no Constitution Check violations were found.*
