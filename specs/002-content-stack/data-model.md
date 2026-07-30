# Phase 1 Data Model: Content Pieces and the Stack

## Entity: Piece

One unit of work in the gallery. One `.md` file under `src/content/pieces/`
per piece; the frontmatter *is* the record. No relationships to any other
entity — pieces don't reference each other, and there is no second entity
in this feature (`SPEC.md` §2; root `PLAN.md` §3).

| Field | Type | Required | Validation | Source |
|---|---|---|---|---|
| `title` | string | yes | non-empty | S2 |
| `description` | string | yes | non-empty | S2 |
| `image` | image reference | yes | must resolve via `image()` to a file under `src/assets/` | S2, S12.3 |
| `alt` | string | yes | **non-empty** — a required field satisfied by `""` does not satisfy S2.2 | S2.2 |
| `captionBackground` | string | yes | valid hex colour | S2, S10 |
| `captionText` | string | yes | valid hex colour | S2, S10 |
| `order` | number | yes | integer, unique across pieces | S2, S6.1 |

**Deliberately absent**: any field for orientation, medium, or category
(S2.4, Constitution II). Adding one later would be a `SPEC.md` amendment,
not a schema convenience.

**State**: pieces have no lifecycle — no draft/published flag, no
timestamps. A piece exists the moment its file exists (S2.1). This is a
deliberate absence, not an oversight: `SPEC.md` describes no publishing
workflow, and Constitution III's "adding a piece is adding a file" implies
there is nothing else to toggle.

## The five pieces this feature adds

| File | Title | Order | Background | Text |
|---|---|---|---|---|
| `kirk-hammett-london.md` | Kirk Hammett in London, July 5th 2026 | 1 | `#302d2d` | `#e9e1e1` |
| `mario-duplantier-frankfurt.md` | Mario Duplantier - Frankfurt, May 22 2026 | 2 | `#5c432f` | `#fff1c4` |
| `jean-michel-labadie-cardiff.md` | Jean-Michel Labadie - Cardiff, June 28 2026 | 3 | `#494949` | `#f3a797` |
| `rex-brown-london.md` | Mr. Rex Brown - London, July 5th 2026 | 4 | `#38543d` | `#eab875` |
| `phil-anselmo-london.md` | Phil Anselmo in London, July 5th 2026 | 5 | `#8f8f8f` | `#000000` |

`jean-michel-labadie-cardiff` and `rex-brown-london` carry the WCAG-corrected
text colours (`PLAN.md` §7), not their originally-supplied values.
