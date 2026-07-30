# Plan — thisismaca.com

**Status:** draft 1 · **Date:** 2026-07-29 · **Implements:** `SPEC.md` draft 2

This document describes *how* the spec gets built. Unlike `SPEC.md`, it is
disposable. If Astro turns out to be the wrong choice, this file is rewritten
and the spec is untouched.

**Rule for this document:** every decision below names the spec requirements it
serves. Anything here that serves no requirement is either scope creep, or a
sign that the spec has a hole.

**Version note.** Version numbers below were checked on 2026-07-29 and move
fast. Verify against current docs before installing rather than trusting this
file.

---

## 1. Stack decisions

Each decision records what it costs to reverse, because that is the number that
matters when choosing.

### 1.1 Astro — confirmed

**Serves:** S12.1 (no JavaScript), S12.3 (responsive images), S2.1 (one file per
piece), Constitution §3, §4, §5.

Astro 7 is current as of June 2026; Astro 6 shipped March 2026. Both require
Node 22.12 or higher — check this first, since it is the most likely cause of a
confusing first failure.

Astro ships zero JavaScript unless a component asks for it, which makes S12.1
the default rather than a discipline. Content collections give one-file-per-piece
with schema validation at build time, which is how S2.2 becomes a build failure
rather than a code review.

**Reversal cost:** moderate. Templates and the content schema are Astro-shaped;
the content files themselves are portable Markdown with frontmatter.

**One thing to know:** Cloudflare acquired the Astro company in January 2026.
The framework remains MIT-licensed and open source, so Constitution §4 is not
violated — but combining Astro with Cloudflare hosting means both halves of the
stack now answer to the same company. That is a concentration worth noticing,
not a reason to change course. The mitigation is the constitution's own rule:
the build output is plain static files, so the host stays swappable.

### 1.2 Hosting — decide at milestone 1, not now

**Serves:** Constitution §4.

The landscape shifted. Cloudflare now points new projects at **Workers with
static assets** rather than Pages; Pages remains fully supported with no
migration deadline, but new platform features ship to Workers first. Static
asset requests are free on both.

- **Pages** — connect the repo, push, done. Preview deployment per branch. This
  is the whole workflow and it fits a static portfolio exactly.
- **Workers with static assets** — where the investment is going, but it means
  a `wrangler` config and a deploy step for a site that has no server-side
  anything.

**Recommendation:** start on Pages. The site is pure static with no dynamic
requirement anywhere in the spec, git-push deployment is the entire need, and
migration later is a config change, not a rewrite. Revisit if a contact form
ever arrives.

**Fallback:** GitHub Pages. Keep this genuinely viable — it is the proof that
Constitution §4 holds.

### 1.3 Styling — plain CSS, no framework

**Serves:** S4.5–S4.8 (clamp values), S10 (fixed palette), S11 (one breakpoint).

The spec's entire visual surface is three pages, one breakpoint, six colours and
a handful of clamps. A utility framework would be more configuration than CSS.
Custom properties for the palette, a single stylesheet, scoped styles in
components where they belong.

### 1.4 Fonts — Astro's built-in Fonts API

**Serves:** S9.1, S9.2, S9.3.

Astro 6 introduced a built-in Fonts API that handles self-hosting, subsetting
and preloading. This is the direct answer to S9.3 — no third-party request to
Google on every page load, and no flash of invisible text.

Verify both faces are available through it before committing; Grenze Gotisch and
Zalando Sans SemiExpanded are both Google fonts, so they should be, but "should
be" is not "is".

---

## 2. Repository structure

```
/
├── CONSTITUTION.md
├── SPEC.md
├── PLAN.md
├── astro.config.mjs
├── src/
│   ├── content.config.ts        # collection schema
│   ├── content/
│   │   └── pieces/              # one file per piece — S2.1
│   ├── assets/
│   │   └── pieces/              # source images, ~2400px wide
│   ├── layouts/
│   │   └── Base.astro           # header + footer + shadow flag
│   ├── components/
│   │   ├── Header.astro         # S4
│   │   ├── Footer.astro         # S5
│   │   └── Piece.astro          # image + caption unit — S6.3
│   ├── pages/
│   │   ├── index.astro          # S6
│   │   ├── about.astro          # S7
│   │   └── contact.astro        # S8
│   └── styles/
│       └── global.css           # palette, type, resets
└── public/
```

The three markdown documents live in the repo root, in the same history as the
code they govern. That is the point of doing this spec-driven.

---

## 3. Content schema

**Serves:** §2 of the spec.

Astro 6 removed legacy collections; everything uses the Content Layer API with a
`glob()` loader. Note that `z` is now imported from `astro/zod`, not from
`astro:content` — that changed in 6 and is an easy thing to get wrong from
older tutorials.

Fields, mapped straight from spec §2: `title`, `description`, `image`, `alt`,
`captionBackground`, `captionText`, `order`. All required.

Two schema-level notes:

- `alt` must be required **and** non-empty. A required field satisfied by an
  empty string does not satisfy S2.2.
- `captionBackground` and `captionText` should be validated as hex strings, so
  a typo fails the build instead of rendering an invisible caption.

**Deliberately absent:** any orientation field. S2.4 says the site has no
concept of orientation, and the schema is where that gets enforced.

---

## 4. Image pipeline

**Serves:** S12.3, S6.6, S6.10, S6.11, S6.12.

Source images live in `src/assets/`, not `public/`, so they pass through Astro's
build-time optimisation. Files in `public/` are copied untouched and would defeat
S12.3 entirely — this is the single most common way to get this wrong.

- Responsive widths generated at build; modern formats with fallbacks.
- **S6.12** falls out of this for free: Astro knows each image's intrinsic
  dimensions at build time and emits width and height, so the browser reserves
  the space before the image arrives. This is why the images must be imported
  rather than referenced as bare paths.
- **S6.10** — lazy loading on everything below the first piece.
- **S6.11** — the first piece opts out of lazy loading and is marked high
  priority. It is the only image that matters for how fast the site feels.

---

## 5. Layout implementation notes

Mapped to the requirements they satisfy.

- **S4.11 / S7.6 / S8.6** — the header shadow is on for About and Contact, off
  for Home. One boolean prop on the base layout, defaulting to off. Not three
  copies of a header.
- **S4.4** — three items on one line at all widths. Verify at 320px with the
  real font loaded; the estimate that this fits was arithmetic, not measurement.
- **S5.4** — the Instagram link opens in a new tab, and needs
  `rel="noopener noreferrer"` alongside `target="_blank"`.
- **S5.5** — two halves side by side at every width, shrinking not stacking.
- **S6.7 / S6.8** — a 20px minimum gap between piece units, and the same
  between header and first image, and last caption and footer. Implement as a
  gap on the stack container rather than margins on each piece, so it cannot
  drift out of sync.
- **S6.3** — image and its own caption are flush. The gap is *between* units,
  never inside one.
- **S8.3** — the email and Instagram blocks appear as page content on Contact
  and as footer elsewhere. Build them as one component used in two places, not
  two components that must be kept in agreement.

---

## 6. Branching and deployment

The repo is already on a `develop` branch, so:

- `main` — production. Deploys to the live site.
- `develop` — integration. Deploys to a preview URL.
- Merge `develop` into `main` to release.

Both Pages and Workers give a per-branch preview URL, which is how the site gets
checked on a real phone rather than in a desktop simulator.

No custom domain yet, per the brief — the provided subdomain is fine until
`thisismaca.com` is pointed at it.

---

## 7. Build order

Sequenced so something is deployed and visible early, and so the riskiest
unknowns surface first rather than last.

**Milestone 0 — deploy nothing, successfully.**
Scaffold, commit the three markdown documents, connect the host, deploy a
near-empty page. This proves the whole chain works before any real work is at
stake. If hosting is going to be annoying, it is much better to discover that
now.

**Milestone 1 — the shell.**
Base layout, header, footer, three routes, the palette, both fonts. No images.
Verify S4 and S5 completely at 320px and at 1440px. This is where S4.4 gets
measured for real.

**Milestone 2 — one piece.**
Content collection, schema, a single piece file, one image through the pipeline,
the caption block with its per-piece colours. Verify S12.3 by checking that
several image sizes were actually generated.

**Milestone 3 — the stack.**
Ten pieces, the 20px gaps, lazy loading, priority on the first image. Verify
nothing shifts as images load.

**Milestone 4 — About and Contact.**
The photo wrap, the shadow on both, the Contact footer swap.

**Milestone 5 — verification pass.**
Walk §10 below end to end. Fix. Merge to `main`.

The images can arrive at any point from Milestone 2 onward — everything before
that runs on placeholders, and the Photoshop work proceeds in parallel rather
than blocking.

---

## 8. Verification

How each part of the spec gets checked. This is what makes the requirements
testable rather than decorative.

| Requirement | Check |
|---|---|
| S2.1 | Add a piece file, rebuild, confirm no code changed |
| S2.2 | Delete an `alt` value, confirm the build fails |
| S4.4 | 320px viewport, real font, three items on one line |
| S4.5–S4.8 | Resize continuously, confirm no snapping |
| S4.11 | Shadow present on `/about` and `/contact`, absent on `/` |
| S5.4 | Instagram opens in a new tab |
| S6.7 | Measure the gap between two piece units |
| S6.10–S6.12 | Throttle the network, confirm nothing shifts as images land |
| S11.3 | No horizontal scroll from 320px up |
| S12.1 | View source on the built output, confirm no script tags |
| S12.3 | Confirm multiple widths generated per image |
| S12.4 | Contrast-check every caption colour pair against its background |
| S12.5 | Tab through all three pages |

S12.4 is the one that will actually find problems, because the caption colours
are hand-picked per piece and nothing validates them but a person.

---

## 9. Risks

1. **Grenze Gotisch at 16px.** A blackletter face at small sizes on a phone may
   be hard to read. Checked at Milestone 1; if it fails, the fix is a size
   change in S9.1, not a font change.
2. **Wide monitors.** Spec open question 4. Each piece becomes very large above
   ~1920px. May need a maximum width on the stack — which would amend S6.6.
3. **Caption contrast.** Twenty hand-picked colours, ten pairs, no automation.
4. **Photoshop and CSS disagreeing.** The composition is designed at one width
   and rendered at many. Check one exported piece in the browser early rather
   than exporting all ten first.

---

## 10. Open — decide during build

- Pages vs Workers (§1.2), at Milestone 0.
- Image export format and how many responsive widths (spec open question 3).
- Page titles, meta descriptions, favicon, 404 (spec open question 5).
- Whether `year`, `medium` and `band/venue` return to the schema (spec open
  question 1). Cheap to add now, more disruptive once ten files exist.
