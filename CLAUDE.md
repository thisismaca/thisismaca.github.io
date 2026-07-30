# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This repository currently contains **no code** — only governing documents. It is at
"Milestone 0" of `PLAN.md`: nothing has been scaffolded yet. Before writing any Astro
code, check whether that has changed (`ls src/`, `package.json`) rather than assuming
this description is current.

## The three-document model

This project is built spec-driven. Three documents govern the work, in a strict
hierarchy, and **must not be conflated**:

1. **`CONSTITUTION.md`** — the rules that outrank everything else. Rarely changes.
   If a decision conflicts with the constitution, the decision is wrong, not the
   constitution. Read this first; it governs every other choice in this repo
   (no CMS, no JS unless load-bearing, no shop, spec-before-code, etc.).
2. **`SPEC.md`** — *what must be true* of the finished site, checkable against the
   built output. Names no framework, host, or library on purpose. Requirements are
   numbered (e.g. `S6.7`) so they can be referenced precisely from code, commits,
   and `PLAN.md`.
3. **`PLAN.md`** — *how* the spec gets built: framework choices, repo structure,
   build order, verification steps. Disposable — can be rewritten entirely without
   touching `SPEC.md`. Every decision in `PLAN.md` should cite the spec
   requirement(s) it serves; a decision serving no requirement is scope creep.

`DRAFT.md` is the original informal brief that `SPEC.md` was derived from — historical
context, not a source of truth once it conflicts with `SPEC.md`.

**Workflow rule:** behavior is decided in `SPEC.md` before it is implemented. If
asked to build something the spec doesn't describe, stop and add the spec entry
(with a numbered requirement) first, rather than improvising in code. When a
requirement changes, update `SPEC.md`'s "Changed since draft N" note.

## Key constraints from the constitution (CONSTITUTION.md)

These are non-negotiable and should shape any implementation suggestion:

- **Zero JavaScript by default.** Any script must be load-bearing (the feature
  cannot exist without it) and justified in the spec before it's written.
- **Content is files in Git.** No database, no CMS, no runtime content fetching.
  Adding a piece of work = adding one file, no code changes.
- **Static output, portable host.** The build must produce plain static files
  deployable to any host — no vendor-specific runtime features.
- **No image without alt text.** The build must fail if `alt` is missing —
  this is enforced at the content-schema level, not by convention.
- **One gallery, no categories.** Medium (illustration vs. photography) is a
  caption, never a filter/section/route.
- **Portfolio, not shop.** No cart, prices, or checkout; print sales are always
  linked out to a third party.

## Intended architecture (per PLAN.md — not yet built)

- **Framework:** Astro (content collections + Content Layer API with a `glob()`
  loader), chosen specifically for zero-JS-by-default and build-time responsive
  images/schema validation. Requires Node ≥ 22.12.
- **Content schema** (`src/content.config.ts`): one file per piece under
  `src/content/pieces/`, fields `title`, `description`, `image`, `alt`,
  `captionBackground`, `captionText`, `order` — all required, `alt` non-empty,
  no orientation field (spec `S2.4` explicitly excludes it).
- **Images:** source files live in `src/assets/` (NOT `public/`) so they pass
  through Astro's build-time image pipeline and get responsive widths + known
  intrinsic dimensions (required for layout-shift-free loading per `S6.12`).
  Putting images in `public/` silently defeats this — called out in `PLAN.md`
  as the most common mistake.
- **Routes:** exactly three pages — `/` (home, the vertical piece stack),
  `/about`, `/contact`. No per-piece detail pages/URLs (deliberate non-goal).
- **Styling:** plain CSS with custom properties, no framework — the whole
  visual surface is 3 pages, 1 breakpoint (768px), 6 colors, and a handful of
  `clamp()` values.
- **Fonts:** Astro's built-in Fonts API (self-hosted, subsetted, preloaded) for
  Grenze Gotisch (menu) and Zalando Sans SemiExpanded (body text).
- **Shared header/footer:** one boolean prop on the base layout controls the
  header shadow (on for About/Contact, off for Home) rather than three copies
  of the header.
- **Hosting:** Cloudflare Pages (decide for real at Milestone 0), GitHub Pages
  as the proof-of-portability fallback. `main` = production, `develop` =
  integration/preview.

See `PLAN.md` §7 for the milestone build order and §8 for how each spec
requirement gets verified (e.g. deleting an `alt` value must fail the build).
Numbered spec requirements (`S4.11`, `S6.7`, etc.) are the shared vocabulary
between `SPEC.md`, `PLAN.md`, and should be used in commits/PRs that implement
or verify them.
