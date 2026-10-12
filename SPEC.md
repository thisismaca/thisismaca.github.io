# Spec — thisismaca.com

**Status:** draft 13 · **Date:** 2026-10-12

This document describes *what must be true* of the finished site. It names no
framework, host or library on purpose — those belong in `PLAN.md`, which can be
thrown away and rewritten without touching this file.

Every statement below should be checkable by looking at the built site. Anything
that cannot be checked is a note, not a requirement, and is marked as such.

**Changed since draft 12 — a fourth page, and a collapsing menu.** A new
`/links` page (§15): a column of cards, each opening another site in a new
tab — the site owner's own link-in-bio page. The header gains a fourth item,
Links, between Home and About (S4.3). Two earlier decisions are deliberately
reversed at the site owner's request: S3.1's "exactly three pages" becomes
four, and the hamburger menu leaves §13's non-goals — below 768px the header
now collapses to a single menu icon (S4.4, S4.12–S4.15). Neither reversal
touches the constitution: the collapsed menu opens without JavaScript
(S4.14, so S12.1 is unchanged), and each link is a content file, as each
piece is (S15.1). At 768px and up the menu's span widens from the middle
third to 40% (S4.3) — measured, not assumed: the four words at 28px total
~259px, against ~241px usable inside a middle third at 768px.

**Changed since draft 11.** Three mobile fixes for About (S7.7, S7.10):
the source-repo link now reads "GitHub" instead of the raw URL, fixing a
horizontal-overflow bug (S11.3) that also explains a previously-unexplained
gap in the mobile header nav — both were the same root cause, confirmed by
testing after the fix. Body text is now centre-aligned below 768px,
matching the photo.

**Changed since draft 10.** S12.6 widened: Home's meta description now
also pulls a short excerpt of each piece's `description`, not just its
`title` — so a piece's actual subject (e.g. a coral-reef illustration's
environmental theme) is represented, not only who/where/when. S12.7's
`<h1>` deliberately stays titles-only, for screen-reader users who'd
otherwise hear a wall of excerpt text before any real content.

**Changed since draft 9.** New S12.6–S12.8: Home gets a piece-derived meta
description and a visually-hidden `<h1>`; About and Contact get
`noindex`. The goal, per the site owner: findable for the specific
artist/city names already in the piece stack, not for generic art-portfolio
terms. Partially resolves open question 5 (meta descriptions, favicon) —
per-page `<title>` and the 404 page remain open.

**Changed since draft 8.** Home's per-piece caption padding (S6.14) widens
from 10px to 30px below each caption's text — still the only separation
between one piece and the next, now just more of it.

**Changed since draft 7.** About's photo (S7.2) grows another 30%, 96px →
125px wide (~222px tall), compounding on top of draft 7's increase rather
than measuring from the original 80px. S7.9 is removed: the body text's
20px left padding is gone, so only S7.2's photo margin and the page's own
container padding separate text from photo and edge.

**Changed since draft 6.** About's photo (S7.2) grows 20%, 80px → 96px wide
(height following the same aspect ratio, ~171px). Straightforward sizing
request, no other change.

**Changed since draft 5.** About's photo (S7.2) is no longer force-cropped
to a fixed 80×200px box. It now renders at 80px wide with height following
its own aspect ratio, uncropped, with margin changed from a uniform 5px to
5px top/left and 30px right/bottom. Reported as a bug after seeing it
live — the original fixed-crop box was a deliberate draft-4 choice
(`PLAN.md` Milestone 4), but read as an error once rendered, so this
reverses it rather than amending the reasoning behind it.

**Changed since draft 4.** Home, About and Contact's narrow column (S6.13,
S7.8, S8.7) widens from the middle third of the viewport (~33.3%) to 40%,
still centred. A follow-up to the draft 4 redesign, requested after seeing
it live — the header nav's own middle-third span (S4.3, S4.8) is unrelated
and unchanged.

**Changed since draft 3 — the visual redesign.** A deliberate second pass at
the site's identity after seeing it live, not a bug fix. The headline
reversal: Home's full-bleed dark stack is gone. Every page now centres its
content in a narrower column on large screens, on white throughout. Detail:

- **Header** (§4): the nav no longer just centres — it spans a specific
  width (the middle third of the viewport), menu text is larger, and the
  under-shadow that was Home's one exception is now on all three pages.
- **Footer** (§5): a fixed height on large screens, unchanged on small ones.
- **Home** (§6): white background (was `#444444`), content narrowed to the
  middle third on large screens, the 20px inter-piece gap replaced by 10px
  of padding under each caption.
- **About & Contact** (§7, §8): both narrowed *and* vertically centred on
  large screens — About's photo grows to 200px tall, its body text gains
  left padding.
- **Typography** (§9): a new default face (Vazirmatn) replaces Zalando Sans
  SemiExpanded everywhere except the header menu, which keeps Grenze
  Gotisch at larger sizes. Piece captions gain their own distinct title
  treatment, replacing the bold weight with a dedicated face/size.

Two decisions were made explicitly, not assumed, because the alternative
readings would have produced a genuinely different site: About and
Contact get vertical centring as well as horizontal narrowing since their
content is short enough to fit a viewport; Home does not, since its stack
is always taller than one screen. And Grenze Gotisch survives on the menu
specifically — the new default face replaces everything *else*.

**Changed since draft 2:** §7's open influences question is closed — text,
woven into the bio, not images or a separate list (S7.7 also added: a link
to the site's own source repo). Real content for both, and for five of the
ten launch pieces (§2), landed during implementation rather than being
decided speculatively up front.

**Changed since draft 1:** the carousel is gone, replaced by a vertical stack.
Orientation has left the content model. The carousel height question is closed.
JavaScript is now zero rather than "minimal".

---

## 1. Purpose

A credibility layer for Maca Sepúlveda's visual work, aimed at people in the
music industry — bands, art directors, gig poster commissioners. Instagram is
the main discovery channel; this site is where someone goes to take the work
seriously.

**Success looks like:** a commissioner arriving from an Instagram bio link sees
the work within one screen, and can find a way to make contact without hunting.

---

## 2. Content model

Each piece is one file. Fields:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown bold in the caption |
| `description` | yes | Shown below the title in the caption |
| `image` | yes | Reference to the image asset |
| `alt` | yes | Text alternative; build fails if absent |
| `captionBackground` | yes | Hex, chosen by hand per piece |
| `captionText` | yes | Hex, chosen by hand per piece |
| `order` | yes | Position in the stack |

**S2.1** Adding a piece requires creating one file and changing no code.
**S2.2** A missing `alt` fails the build rather than shipping.
**S2.3** Ten pieces at launch.
**S2.4** The site holds no concept of orientation. A piece is an image of
whatever proportions it has.

> **Note — where the images come from.** The stack is composed as a whole in
> Photoshop and exported as one file per piece. A landscape work is placed on a
> portrait canvas there, with its surround chosen deliberately rather than left
> to the browser. Source files are around 2400px wide, which was originally
> sized to hold up full-bleed on a desktop. *(Amended, redesign: Home's
> content column is now capped at 40% of the viewport, S6.13 — a
> 2400px source still comfortably covers even 40% of a 2560px-wide
> screen, so the size held up even though the reason it was chosen didn't.)*
>
> **Visual design is baked into the pixels; text is not.** Titles and
> descriptions stay as real HTML (§6), never lettering inside an image.

---

## 3. Routes

**S3.1** *(Amended, draft 13)* Exactly four pages exist: `/` (home),
`/links`, `/about`, `/contact`. *(Originally three — `/links` was added
in draft 13, §15.)*
**S3.2** Individual pieces have no URLs of their own. *(Deliberate — see
Non-goals. This is the decision most likely to be revisited.)*

---

## 4. Header

Present on all four pages, identical in structure.

**S4.1** A white block flush with the top of the viewport. No gray appears above
it at any width.
**S4.2** It spans the full viewport width, edge to edge.
**S4.3** *(Amended, draft 13)* It contains exactly four items — Home,
Links, About, Contact, in that order. At 768px and above they form a single
horizontal row whose group spans the horizontal middle 40% of the viewport
— its left edge at 30% of the viewport width, its right edge at 70% —
never the full width. Below 768px they are collapsed behind a menu icon
(S4.12). *(Originally three items spanning the middle third, a span that
was itself confirmed by measurement in the redesign: ~203px of text against
256px at 768px. Draft 13's fourth item doesn't fit that: the four words
total ~259px at 768px against ~241px usable inside a middle third after
S4.7's padding, versus ~297px inside 40%. 40% is the width the content
column already uses at 768px and up — S6.13, S7.8, S8.7 — so the menu now
lines up with the content beneath it rather than introducing a new
proportion.)*
**S4.4** *(Amended, draft 13)* At 768px and above, the four items stay on
one line — no wrapping, no overflow. *(Originally: three items on one line
at every width down to 320px, "no hamburger". Below 768px the row is now
replaced by the collapsed menu, S4.12–S4.15, at the site owner's request —
not because four items couldn't fit: at 320px they would, ~222px of text at
24px.)*
**S4.5** Padding above the items: `clamp(15px, 3vw, 30px)`.
**S4.6** Padding below the items: `clamp(5px, 1vw, 8px)`.
**S4.7** *(Amended, draft 13)* Horizontal padding: 5px minimum. At 768px
and up, inside the 40% span defined by S4.3; below 768px, between the
viewport's left edge and the menu icon (S4.12).
**S4.8** *(Amended, draft 13)* At 768px and above, the four items
distribute evenly (space-between) across the 40% span defined in S4.3,
rather than sitting a fixed gap apart. Below 768px, the original fluid gap
— `clamp(8px, 4vw, 30px)` — now separates the items vertically in the
open list (S4.14) instead of horizontally in a row.
**S4.9** Header height is a consequence of padding plus line box. It is never
set directly.
**S4.10** Each item navigates to its corresponding page.
**S4.11** *(Amended, redesign)* A shadow along the header's lower edge is
visible on every page, including `/`. *(Previously absent on `/` —
that exception is gone; the header now looks identical on every page.)*
**S4.12** *(New, draft 13)* Below 768px, the header shows a single menu
icon in place of the four items, at the header's left edge (inside S4.7's
padding). The icon is the site owner's own glyph, not a generic three-line
symbol, and carries the text alternative "Menu" (S12.2).
**S4.13** *(New, draft 13)* The icon fits within the height the row of
items occupied: the header is exactly as tall with the icon as it was with
the items — S4.5, S4.6 and S4.9 govern it unchanged.
**S4.14** *(New, draft 13)* Activating the icon — click, tap or keyboard —
opens a list of the four items, one per line, left-aligned, appearing from
the left edge directly below the header and over the page content rather
than pushing it down. Activating the icon again closes it. This works with
no JavaScript at all (S12.1).
**S4.15** *(New, draft 13)* Items in the open list use the same face,
weight, size and colour as the row (S9.1, §10), on a white panel carrying
the header's own shadow (S4.11). Each still navigates to its page (S4.10).

---

## 5. Footer

**S5.1** A white block containing two halves.
**S5.2** Left half, centred within itself: `thisismaca@gmail.com` as plain
text. Not a link.
**S5.3** Right half, centred within itself: `@thisismaca` followed by an
Instagram glyph in grey.
**S5.4** Activating the right half opens Instagram in a new browser tab.
**S5.5** Both halves stay side by side at every width, shrinking rather than
stacking.
**S5.6** The footer carries no shadow. On the white pages it merges into the
page, which is intended.
**S5.7** On `/contact` the footer's contents are replaced — see §8.
**S5.8** *(New, redesign)* At 768px and above, the footer has a fixed height
of 80px, with its contents vertically centred inside. Below 768px, height
remains a consequence of padding and content — unchanged from before this
requirement existed. *(This is a deliberate, footer-specific exception. It
does not amend S4.9, which governs the header only.)*

---

## 6. Home

**S6.1** The ten pieces are stacked vertically in a single column, in `order`,
beginning below the header.
**S6.2** *(Amended, redesign)* The page background is white (`#FFFFFF`),
replacing the original `#444444`. Nothing on Home is dark any longer.
**S6.3** A piece unit is its image with its caption block flush beneath it, no
gap between the two.
**S6.4** *(Amended, redesign)* The caption block contains the title with the
description below it. The title is no longer bold — it is distinguished by
its own typeface, weight, and size instead (S9.4).
**S6.5** The caption block's background and text colours come from that piece's
own fields, so they differ from piece to piece.
**S6.6** *(Amended, redesign)* Each image spans the full width of the content
column defined in S6.13 — the full viewport below 768px, 40% of
the viewport at 768px and up. Its height is its own intrinsic height at that
width. Nothing is cropped and no height is imposed.
**S6.7** *(Superseded, redesign — see S6.14)*
**S6.8** *(Superseded, redesign — see S6.14)*
**S6.9** There is no carousel, no arrows, no dots, no snapping and no
pagination. The page is scrolled.
**S6.10** Images below the fold are deferred until needed.
**S6.11** The first image is not deferred and begins loading immediately.
**S6.12** The page does not shift as images load. Space is reserved from each
image's known dimensions before it arrives.
**S6.13** *(Amended, draft 5)* At 768px and above, the stack is horizontally
centred and constrained to 40% of the viewport width (each side margin is
approximately 30% of the viewport). Below 768px, the stack returns to full
width — the margin is not visible there. Home is not vertically centred at
any width; its content is expected to exceed one screen's height.
*(Originally the middle third, ~33.3% — widened to 40% in draft 5.)*
**S6.14** *(Amended, draft 9)* There is no gap between one piece unit and
the next; images and captions run flush end to end. Instead, each caption
carries 30px of padding below its own content, which is the only
separation between a caption and the next piece's image. *(Originally
10px — widened in draft 9.)*

---

## 7. About

**S7.1** The page background is white throughout.
**S7.2** *(Amended, draft 8)* A photograph of Maca appears at the top left,
125px wide with height following the source image's own aspect ratio
uncropped (~222px at the current source). Margin: 5px top and left, 30px
right and bottom. *(Previously a fixed 80×200px box, deliberately cropped
via `fit=cover` — see `PLAN.md` Milestone 4. Draft 6 reversed the crop.
Draft 7 sized the now-uncropped photo up 20%, 80px → 96px. Draft 8 sized it
up again, 30% from that draft-7 value, 96px → 125px — the two increases
compound rather than both measuring from the original 80px.)*
**S7.3** At 768px and above, body text flows around the photograph.
**S7.4** Below 768px, the photograph is centred and all text sits beneath it.
**S7.5** Body text is black.
**S7.6** The header shadow is visible (S4.11) — now identical to `/`, since
S4.11 no longer carves out an exception for Home.

**S7.7** *(Amended, draft 12)* The page includes a link to the site's own
source repository, with link text reading "GitHub" rather than the raw
URL. *(Originally the literal URL as visible text — at narrow viewports
this is one long unbroken string with no wrap opportunity, overflowing the
page horizontally, S11.3. "GitHub" fixes the overflow at its source rather
than wrapping the long string; the `href` is unchanged.)*

**S7.8** *(Amended, draft 5)* At 768px and above, the About content area is
horizontally constrained to 40% of the viewport (as Home's stack is, S6.13)
*and* vertically centred within the viewport height. Below 768px, neither
constraint applies. *(Unlike Home, About's content is short enough to fit a
screen, which is why it gets vertical centring and Home does not. Originally
the middle third, ~33.3% — widened to 40% in draft 5, alongside S6.13/S8.7.)*
**S7.9** *(Superseded, draft 8)* ~~The body text carried an additional 20px
of padding on its left side, independent of the photograph's own margin.~~
Removed in draft 8 — the body text now carries no padding of its own; only
the photograph's S7.2 margin and the `.about` container's own padding
separate it from the page edge and the photo.
**S7.10** *(New, draft 12)* Below 768px, body text is centre-aligned,
matching the photograph's own centring (S7.4). At 768px and above, text
stays left-aligned/`start` — it wraps beside the floated photo (S7.3),
where centring would read as ragged rather than intentional.

> **Decided 2026-07-30 — influences.** Text, not images, resolving the open
> question above: influences (Virgil Finlay, Richey Beckett, Peeter Baltens,
> the 2013 Tumblr aesthetic, nature) are named inline within the bio copy
> itself, not as a separate labelled list or as thumbnail images. Final
> copy supplied by the site owner — see `specs/003-about/` once written.

---

## 8. Contact

**S8.1** The page background is white.
**S8.2** A short invitation to make contact, in black, centred, with 20px margin
above and below.
**S8.3** The email and Instagram blocks described in §5 appear here as page
content rather than as footer.
**S8.4** The footer on this page contains only `© Maca Sepúlveda 2026`, at 10px.
Its height still follows S5.8 (fixed at 768px and up) like every other page's
footer.
**S8.5** This copyright line appears on `/contact` only.
**S8.6** The header shadow is visible (S4.11) — now identical to `/`, since
S4.11 no longer carves out an exception for Home.

**S8.7** *(Amended, draft 5)* At 768px and above, the Contact content area is
horizontally constrained to 40% of the viewport *and*
vertically centred within the viewport height — the same treatment as
About (S7.8), for the same reason: its content is short enough to fit a
screen. *(Originally the middle third, ~33.3% — widened to 40% in draft 5,
alongside S6.13/S7.8.)*
**S8.8** *(New, redesign)* The footer stays pinned to the bottom of the
viewport when the page's content is shorter than the screen, rather than
floating partway up the page. It behaves normally (follows the content) once
content grows taller than the viewport.

---

## 9. Typography

**S9.1** *(Amended, redesign)* Menu items use Grenze Gotisch, weight 500, at
28px from 768px up and 24px below. *(Increased from 20px/16px — "two sizes
larger," where one size is the 4px gap the original two values already
established.)*
**S9.2** *(Amended, redesign)* All other text uses Vazirmatn, weight 300
(Light), 18px — replacing Zalando Sans SemiExpanded entirely — except the
copyright line, which stays at 10px (S8.4), each piece caption's title
(S9.4), and the Links page's card text (S15.5, draft 13).
**S9.3** Both faces are self-hosted or loaded such that no text is invisible
while fonts load. *(Now Grenze Gotisch and Vazirmatn; Zalando Sans
SemiExpanded is retired and no longer loaded at all.)*
**S9.4** *(New, redesign)* Each piece's caption title uses Vazirmatn, weight
400 (Regular), 20px — distinct from the description beneath it, which uses
the default S9.2 treatment. This replaces the bold weight the title
previously used (S6.4): the title is now set apart by its own face, weight,
and size, not by boldness.

> Grenze Gotisch is a blackletter display face, not a sans. This is intentional;
> it does the work of a gallery label. The 28px/24px sizes are the redesign's
> best estimate at "two sizes larger" and should be checked against the
> rendered face rather than assumed correct.

---

## 10. Colour

| Role | Value |
|---|---|
| Every page background — Home, header, footer, Links, About, Contact | `#FFFFFF` |
| Link card background (S15.4) | `#FFFFFF` |
| Link card shadow (S15.4) | The header's shadow, 10% lighter |
| Menu lettering | `#333333` |
| Body text on white | Black |
| Instagram glyph | Grey |
| Caption background and text | Per piece (§2) |

*(Amended, redesign: `#444444` is retired. Home no longer has a distinct
background — every page is now white, per S6.2.)*

---

## 11. Responsive behaviour

**S11.1** *(Amended, redesign)* One breakpoint, still at 768px, now governing:
menu type size (S9.1); the header nav's middle-third span (S4.3, S4.8); the
About and Contact wrap/stack and narrow/vertically-centred layouts (S7.3,
S7.4, S7.8, S8.7); Home's narrow-column width (S6.13); and the footer's
fixed height (S5.8). No second breakpoint was introduced for any of this —
every large/small distinction in this redesign uses the same 768px line.
*(Draft 13 adds, on the same line: the header's collapse to a menu icon,
S4.12, and its 40% span, S4.3; and the Links page's card width and outer
margin, S15.3/S15.6. Still no second breakpoint.)*
**S11.2** Header padding is fluid and crosses no breakpoint (S4.5, S4.6). The
item-distribution mechanism (S4.8) is not a fluid value — it's a fixed
one-third-of-viewport span (S4.3) with even spacing inside it, which holds
at every width above 320px without needing to change at 768px.
**S11.3** Nothing scrolls horizontally at any width from 320px up.
**S11.4** The stack is one column at every width. It never becomes a grid.
Narrowing its width at 768px+ (S6.13) doesn't change this — it's still one
column, just a narrower one.

---

## 12. Performance and accessibility

**S12.1** No JavaScript ships. Nothing on the site requires it.
**S12.2** Every image has alt text (S2.2).
**S12.3** Images are served at sizes appropriate to the viewport, not one large
file scaled down.
**S12.4** Text meets WCAG AA contrast against its background — including each
hand-picked caption pair, which must be checked per piece.
**S12.5** The whole site is operable and readable without a pointing device.
**S12.6** *(Amended, draft 11)* Home carries a `<meta name="description">`
built from each piece's own `title` (artist, city, date) plus a short
word-boundary-truncated excerpt of its `description` — not generic
site-wide marketing copy. Both fields are already required, real text per
S6.4. It updates automatically as pieces are added (S2.1), never needing
to be kept in sync by hand. *(Originally titles only; draft 11 added the
description excerpt so a piece's actual subject matter — not just
who/where/when — is represented, e.g. a coral-reef illustration's
environmental theme, not only its title.)*
**S12.7** *(New, draft 10)* Home carries a visually-hidden `<h1>` listing
the piece titles only — a real heading for search engines and assistive
technology, where the visual design deliberately has none. *(Deliberately
narrower than S12.6: a screen reader announces this before any visible
content, so it stays to short titles rather than the fuller per-piece
excerpts S12.6 carries — those live only in the meta description, which is
never rendered or announced on the page itself.)*
**S12.8** *(New, draft 10; amended draft 13)* About, Contact and Links carry
`<meta name="robots" content="noindex">`; Home does not. The goal is
narrow: findable for the specific names/places in the piece stack, not for
generic terms — About's bio and Contact's invitation text aren't that, so
they're excluded from the index rather than competing for unrelated
searches. *(Decided with the site owner 2026-08-05: no explicit
`venue`/`country` content fields were added — S2's schema is unchanged: see
open question 1 — those stay whatever's already woven into each piece's
free-text description, at the owner's discretion. Links was added to the
noindex set in draft 13 for the same reason: its content is other sites'
addresses, not the piece stack.)*

---

## 13. Non-goals

Not in this version, and not to be quietly added:

- A carousel of any kind
- One long composite image for the whole page
- Slicing a single work across several stack entries
- Per-piece detail pages and URLs
- Hand-drawn frames and the ornament kit
- A contact form
- Selling anything, including prints
- ~~A hamburger menu~~ *(Removed draft 13 at the site owner's request —
  see S4.12–S4.15.)*
- Splitting the gallery by medium or by orientation
- Any admin interface

---

## 14. Open questions

1. Whether `year`, `medium` and `band/venue` return as content fields — they
   were in the original brief and are absent here.
2. ~~Influences on the About page (§7).~~ Closed — see §7's decided note.
3. Image export format, and how many responsive widths per piece — partly
   answered in practice: source files arrive as finished JPEGs at
   whatever width the photograph was shot/edited at (1365–2794px across
   the first five), not a fixed 2400px, and Astro's build pipeline
   generates the responsive widths regardless of source size (§12).
   Still open: whether a minimum source width should be enforced.
4. How the composition reads on a very wide monitor, where each piece becomes
   large. *(Amended, redesign: substantially defused, not fully closed —
   Home's content is now capped at 40% of the viewport width, S6.13, so
   pieces no longer grow toward the full screen width on large monitors the
   way they used to. Still worth a look at 2560px once real content is in
   place, but the risk is much smaller than it was.)*
5. Page titles and what a 404 does. *(Narrowed, draft 10: meta descriptions
   and search indexing are resolved — S12.6–S12.8. Favicon already exists,
   `public/favicon.ico`/`.svg`. The per-page `<title>` question is still
   open: every page still shares the one fixed `thisismaca.com` title.)*
6. Where the print house link lives, if anywhere, given §13.

---

## 15. Links

*(New, draft 13. Numbered after the existing sections so that no existing
requirement ID moves.)*

A page of outbound links — the site owner's own link-in-bio page — reached
from the header (S4.3).

**S15.1** Each link is one content file with required, non-empty `title`,
`description` and `url` fields, plus `order`, its position in the list.
Adding a link requires creating one file and changing no code, as S2.1 does
for pieces. A missing or malformed `url` fails the build.
**S15.2** Links appear as cards stacked vertically in a single column, in
`order`, 10px apart.
**S15.3** At 768px and above, each card is one third of the viewport wide,
horizontally centred. Below 768px, each card spans the full viewport width.
**S15.4** Each card has a white background and a shadow matching the
header's (S4.11), 10% lighter — the header shadow's opacity reduced by a
tenth, same offset and blur.
**S15.5** Each card has 3px of padding and contains two lines of black
text, stacked 4px apart, both right-aligned: the link's `title` in
Vazirmatn weight 700 (Bold), 18px; then its `description` in Vazirmatn
weight 400 (Regular), 14px.
**S15.6** The column of cards has 20px of margin above and below it at
768px and above; 10px below 768px.
**S15.7** The whole card is the link: activating anywhere on it opens its
`url` in a new browser tab.
**S15.8** The page background is white, the header shadow is visible
(S4.11), and the footer is the same as About's — the email and Instagram
halves of §5, not Contact's copyright line (S8.4).
**S15.9** Card text never forces horizontal scrolling (S11.3): a long
unbroken description, such as a raw URL, wraps inside its card.
**S15.10** At launch the page holds one link — title "Sea Shepherd",
description "https://seashepherd.org/donate/", url
"https://seashepherd.org/donate/".
