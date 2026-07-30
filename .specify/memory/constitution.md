# thisismaca.com Constitution

These are the rules that outrank everything else. When a later decision conflicts
with one of these, the later decision is wrong. If one of these turns out to be
wrong, it gets changed here first, deliberately, before any code moves.

## Core Principles

### I. The work wins

Nothing on the page competes with an image. Chrome, captions, navigation and
future ornament exist to hold the work, never to be looked at. If a decision
makes the site more interesting and the work less visible, it is the wrong
decision.

### II. One gallery, not several

The work is a single body with one visual language. Medium is a quiet caption,
never a category, never a filter, never a section. There is no "illustration"
page and no "photography" page.

### III. Content is files in Git

Every piece is a file in the repository. No database, no CMS, no admin panel, no
runtime content fetching. Adding a piece is adding a file and nothing else.

### IV. Static output, portable host

The build produces static files that could be served by any host without
modification. No feature depends on a specific vendor's runtime. Moving hosts is
a DNS change, not a rewrite.

### V. JavaScript must earn its place

Ships zero JavaScript by default. Any script must be load-bearing — the feature
genuinely cannot exist without it — and must be justified in the spec before it
is written. Convenience is not justification.

### VI. Portfolio, not shop

Nothing is sold on this site. No cart, no prices, no checkout. Prints are linked
out to an existing print house, never handled here.

### VII. No image without a text alternative (NON-NEGOTIABLE)

Every image carries alt text. The build fails if one is missing. This is not
negotiable for accessibility, and it is also how the work gets found.

## Governance

### Spec before code

Behaviour is decided in the spec and only then implemented. If something is
being built that the spec does not describe, stop and write the spec entry
first. The spec describes *what must be true*; it never names a framework.

### Document hierarchy

Three documents govern this project, in strict order of authority:

1. **This constitution** — supersedes all other practices. Rarely changes.
2. **`SPEC.md`** (repo root) — the whole-site contract: what must be true of the
   finished site, as numbered requirements (`S4.11`, `S6.7`). Names no
   framework, host or library.
3. **`PLAN.md`** (repo root) — how the spec gets built. Disposable; can be
   rewritten entirely without touching `SPEC.md`.

`DRAFT.md` is the original informal brief. It is deliberately untracked (see
`.gitignore`), so it will not be present in a fresh clone. Where it survives
locally it is historical context, not authority.

### Amendment procedure

An amendment to this document is made deliberately and before any code that
depends on it moves. Every decision in `PLAN.md` must cite the spec requirement
it serves; a decision serving no requirement is scope creep, or a sign the spec
has a hole.

**Version**: 1.0.0 | **Ratified**: 2026-07-29 | **Last Amended**: 2026-07-29
