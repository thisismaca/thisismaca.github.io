# Spec — thisismaca.com

**Status:** draft 3 · **Date:** 2026-07-30

This document describes *what must be true* of the finished site. It names no
framework, host or library on purpose — those belong in `PLAN.md`, which can be
thrown away and rewritten without touching this file.

Every statement below should be checkable by looking at the built site. Anything
that cannot be checked is a note, not a requirement, and is marked as such.

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
> to the browser. Source files are around 2400px wide so they hold up
> full-bleed on a desktop.
>
> **Visual design is baked into the pixels; text is not.** Titles and
> descriptions stay as real HTML (§6), never lettering inside an image. A 2400px
> composition renders at roughly 16% on a phone, which is where most visitors
> are.

---

## 3. Routes

**S3.1** Exactly three pages exist: `/` (home), `/about`, `/contact`.
**S3.2** Individual pieces have no URLs of their own. *(Deliberate — see
Non-goals. This is the decision most likely to be revisited.)*

---

## 4. Header

Present on all three pages, identical in structure.

**S4.1** A white block flush with the top of the viewport. No gray appears above
it at any width.
**S4.2** It spans the full viewport width, edge to edge.
**S4.3** It contains exactly three items — Home, About, Contact — as a single
horizontal row, centred.
**S4.4** The three items remain on one line at every viewport width down to
320px. No hamburger, no wrapping, no overflow.
**S4.5** Padding above the items: `clamp(15px, 3vw, 30px)`.
**S4.6** Padding below the items: `clamp(5px, 1vw, 8px)`.
**S4.7** Horizontal padding: 5px minimum.
**S4.8** Gap between adjacent items: `clamp(8px, 4vw, 30px)`.
**S4.9** Header height is a consequence of padding plus line box. It is never
set directly.
**S4.10** Each item navigates to its corresponding page.
**S4.11** A shadow along the header's lower edge is visible on `/about` and
`/contact`, and absent on `/`.

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

---

## 6. Home

**S6.1** The ten pieces are stacked vertically in a single column, in `order`,
beginning below the header.
**S6.2** The background behind and between pieces is `#444444`.
**S6.3** A piece unit is its image with its caption block flush beneath it, no
gap between the two.
**S6.4** The caption block contains the title in bold with the description
below it.
**S6.5** The caption block's background and text colours come from that piece's
own fields, so they differ from piece to piece.
**S6.6** Each image spans the full viewport width. Its height is its own
intrinsic height at that width. Nothing is cropped and no height is imposed.
**S6.7** At least 20px separates one piece unit from the next — that is,
between a caption block and the image below it. The page background shows
through.
**S6.8** The same 20px minimum separates the header from the first image, and
the last caption block from the footer.
**S6.9** There is no carousel, no arrows, no dots, no snapping and no
pagination. The page is scrolled.
**S6.10** Images below the fold are deferred until needed.
**S6.11** The first image is not deferred and begins loading immediately.
**S6.12** The page does not shift as images load. Space is reserved from each
image's known dimensions before it arrives.

---

## 7. About

**S7.1** The page background is white throughout.
**S7.2** A photograph of Maca appears at the top left, approximately 100px tall
by 80px wide, with 5px of margin on every side.
**S7.3** At 768px and above, body text flows around the photograph.
**S7.4** Below 768px, the photograph is centred and all text sits beneath it.
**S7.5** Body text is black.
**S7.6** The header shadow is visible (S4.11).

**S7.7** The page includes a link to the site's own source repository.

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
**S8.5** This copyright line appears on `/contact` only.
**S8.6** The header shadow is visible (S4.11).

---

## 9. Typography

**S9.1** Menu items use Grenze Gotisch, weight 500, at 20px from 768px up and
16px below.
**S9.2** All other text uses Zalando Sans SemiExpanded, regular, 14px — except
the copyright line at 10px (S8.4).
**S9.3** Both faces are self-hosted or loaded such that no text is invisible
while fonts load.

> Grenze Gotisch is a blackletter display face, not a sans. This is intentional;
> it does the work of a gallery label. The 20px/16px sizes are provisional and
> should be checked against the rendered face rather than assumed.

---

## 10. Colour

| Role | Value |
|---|---|
| Home background, and gaps between pieces | `#444444` |
| Header, footer, About, Contact | `#FFFFFF` |
| Menu lettering | `#333333` |
| Body text on white | Black |
| Instagram glyph | Grey |
| Caption background and text | Per piece (§2) |

---

## 11. Responsive behaviour

**S11.1** One breakpoint, at 768px, governing menu type size (S9.1) and the
About layout (S7.3, S7.4).
**S11.2** Header padding and item spacing are fluid and cross no breakpoint
(S4.5, S4.6, S4.8).
**S11.3** Nothing scrolls horizontally at any width from 320px up.
**S11.4** The stack is one column at every width. It never becomes a grid.

---

## 12. Performance and accessibility

**S12.1** No JavaScript ships. Nothing on the site requires it.
**S12.2** Every image has alt text (S2.2).
**S12.3** Images are served at sizes appropriate to the viewport, not one large
file scaled down.
**S12.4** Text meets WCAG AA contrast against its background — including each
hand-picked caption pair, which must be checked per piece.
**S12.5** The whole site is operable and readable without a pointing device.

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
- A hamburger menu
- Splitting the gallery by medium or by orientation
- Any admin interface

---

## 14. Open questions

1. Whether `year`, `medium` and `band/venue` return as content fields — they
   were in the original brief and are absent here.
2. Influences on the About page (§7).
3. Image export format, and how many responsive widths per piece.
4. How the composition reads on a very wide monitor, where each piece becomes
   large. Worth mocking one screen at 1440px and one at 2560px before export.
5. Page titles, meta descriptions, favicon, and what a 404 does.
6. Where the print house link lives, if anywhere, given §13.
