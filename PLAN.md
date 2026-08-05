# Plan — thisismaca.com

**Status:** draft 9 · **Date:** 2026-08-04 · **Implements:** `SPEC.md` draft 8

This document describes *how* the spec gets built. Unlike `SPEC.md`, it is
disposable. If Astro turns out to be the wrong choice, this file is rewritten
and the spec is untouched.

**Rule for this document:** every decision below names the spec requirements it
serves. Anything here that serves no requirement is either scope creep, or a
sign that the spec has a hole.

**Changed since draft 8:** Milestone 10, sizing the About photo up another
30% and removing the body text's left padding, added — §7. Implements
`SPEC.md` draft 8 (S7.2 amended, S7.9 removed).

**Changed since draft 7:** Milestone 9, sizing the About photo up 20%,
added — §7. Implements `SPEC.md` draft 7 (S7.2 amended).

**Changed since draft 6:** Milestone 8, removing the About photo's forced
crop, added — §7. Implements `SPEC.md` draft 6 (S7.2 amended).

**Changed since draft 5:** Milestone 7, widening the narrow column from the
middle third (~33.3%) to 40%, added — §7. Implements `SPEC.md` draft 5
(S6.13/S7.8/S8.7 amended).

**Changed since draft 4:** Milestone 6, the visual redesign, added — §7.
Not part of the original build order; a deliberate second pass at the
site's identity requested after Milestones 0–5 shipped a verified launch
state. Implements `SPEC.md` draft 4 in full.

**Changed since draft 3:** Milestones 4 (About, then Contact) and 5
(verification) are closed — §7. §8's verification table expanded from 13
curated rows to one row per requirement, and actually run in full against
the live site rather than local dev — see its "Milestone 5 results." Two
stale cross-references fixed along the way: §8 referred to itself as "§10,"
and `SPEC.md`'s influences open question stayed listed after §7 had already
resolved it.

**Changed since draft 2:** Milestone 0 is closed and Milestone 1 (the shell)
is built and deployed — §7. Milestones 2 and 3 are merged into one feature,
because five of the ten launch pieces arrived finished at once rather than
one at a time — §7. The S12.4 contrast check turned out to be automatable,
not manual as assumed; §8 and §9 are corrected.

**Changed since draft 1:** hosting is decided — GitHub Pages, not Cloudflare
(§1.2), which closes the last open stack question. Per-branch preview URLs are
gone as a consequence, and §6 replaces them with the dev server on the LAN. The
repository is being renamed `thisismaca.github.io` so the site serves from the
root and `base:` is never needed (§6.1). GitHub Spec Kit has been adopted and
the repository structure in §2 reflects it. Milestone 0 is half complete (§7).
Versions in §1.1 are now measured on this machine rather than estimated.

**Version note.** Versions move fast. Anything not marked as confirmed on a
specific date should be verified against current docs before it is trusted.

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
violated. Draft 1 of this plan flagged the concentration risk of pairing Astro
with Cloudflare hosting; §1.2 has since settled on GitHub Pages, so the two
halves of the stack now answer to different companies and the concern is moot.
The mitigation was never the vendor choice anyway — it is the constitution's own
rule that the build output is plain static files, so the host stays swappable.

**Confirmed on this machine (2026-07-30):** Astro 7.1.6 on Node 24.18.0 LTS.
The scaffold builds to `output: "static"` and emits no `<script>` tags, so
S12.1 holds at baseline.

### 1.2 Hosting — GitHub Pages, decided 2026-07-30

**Serves:** Constitution §4.

**Decision: GitHub Pages**, deployed from GitHub Actions. The repo already lives
on GitHub, so this adds no account, no vendor and no CLI. It supports a custom
domain on `thisismaca.com` with free automatic TLS, which was the deciding
requirement.

What was weighed and rejected:

- **Cloudflare Workers with static assets** — where Cloudflare's investment is
  going, and it has the best preview URLs of the three (stable per-branch
  aliases). Rejected: its custom-domain support requires the DNS zone to sit on
  Cloudflare, which GitHub Pages does not.
- **Cloudflare Pages** — the earlier recommendation in draft 1 of this plan.
  Genuinely good, and unmetered bandwidth is a real advantage for an
  image-heavy site. Rejected as the extra vendor buys little that GitHub Pages
  does not already cover at this scale.

**What this costs.** GitHub Pages is one site per repository, so there are no
per-branch preview deployments — see §6, which changes as a result. Bandwidth is
softly limited (~100GB/month, worth confirming against current GitHub docs)
rather than unmetered. Neither binds at portfolio traffic.

**Reversal cost:** very low, and this is the point of Constitution §4. The build
output is plain static files. Moving to either Cloudflare product means pointing
DNS somewhere else and swapping one workflow file. Nothing in `SPEC.md` names a
host, and nothing should.

**Still available if bandwidth ever bites:** Cloudflare's free plan can sit in
front of GitHub Pages as pure DNS/CDN, without moving the hosting. If that is
ever done, set SSL mode to **Full** — Flexible causes a redirect loop against
GitHub Pages.

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
├── CONSTITUTION.md              # pointer only — real text below
├── SPEC.md                      # whole-site contract
├── PLAN.md                      # this file
├── CLAUDE.md                    # agent guidance
├── .gitattributes               # LF everywhere; CRLF for .ps1
├── .specify/
│   ├── memory/constitution.md   # the actual constitution
│   ├── templates/               # Spec Kit spec/plan/tasks templates
│   └── scripts/powershell/      # Spec Kit helpers
├── .claude/skills/speckit-*/    # /speckit-* commands
├── specs/                       # one dir per milestone — see §7
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
    └── CNAME                    # custom domain — see §6
```

The governing documents live in the repo, in the same history as the code they
govern. That is the point of doing this spec-driven.

**Two things moved when GitHub Spec Kit was adopted (2026-07-30).** The
constitution now lives at `.specify/memory/constitution.md`, because that is
where the `/speckit-*` commands read it from; root `CONSTITUTION.md` is a
pointer so the two copies cannot drift. `SPEC.md` deliberately stays at root:
Spec Kit is feature-oriented and `SPEC.md` is a whole-site contract, not a
feature.

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

- `main` — production. A GitHub Actions workflow builds and deploys on push.
- `develop` — integration. Builds in CI to catch failures; deploys nowhere.
- Merge `develop` into `main` to release.

**Checking on a real phone.** Draft 1 assumed a per-branch preview URL. GitHub
Pages does not have them — it is one site per repository. The replacement is
the dev server bound to the local network:

```
npm run dev -- --host
```

That prints a LAN address to open on a phone on the same Wi-Fi. It is a better
loop than a deploy preview anyway, because it is live-reloading and needs no
push. The one thing it cannot verify is anything that differs between `astro
dev` and a production build — so the verification pass in §8 runs against
`npm run build && npm run preview -- --host`, not against the dev server.

**Prerequisites before the first deploy** — none of this is code, but all of it
blocks:

1. ✅ The repo must be **public**, or the account needs a paid plan. GitHub
   Pages on private repositories is not free. `thisismaca/thisismaca.com` is
   public — confirmed 2026-07-30.
2. Repo Settings → Pages → Source must be set to **GitHub Actions**, not
   "Deploy from a branch".
3. Node in the workflow should be pinned to the same major as local (24.x).
4. Only the initial commit is on `origin`. `develop` and everything since is
   local-only and needs pushing.
5. The repo is being renamed to `thisismaca.github.io` (§6.1). Afterwards,
   repoint the local remote — `git remote set-url origin` — rather than leaning
   on GitHub's redirect of the old URL.

### 6.1 User site, not project site — decided 2026-07-30

**Decision: the repository is renamed `thisismaca.github.io`.**

The repository was named `thisismaca.com`, which would have made it a *project*
site serving from a subpath — `https://thisismaca.github.io/thisismaca.com/`.
A subpath means `astro.config.mjs` needs `base: '/thisismaca.com'` alongside
`site:`, and every internal link and asset URL has to respect it. Worse, when
`thisismaca.com` is later attached as a custom domain the site moves to the
root and `base` must be **removed** again. Getting that transition wrong 404s
every asset at once.

Named `<user>.github.io`, it is a **user site**: it serves at the root
immediately, `base` is never configured, and attaching the custom domain later
changes nothing structural. One rename buys the removal of an entire class of
error.

**Consequences:**

- The repo name no longer matches the product name. Accepted — `package.json`,
  `README.md` and the eventual domain all still say `thisismaca.com`.
- The local remote must be repointed after the rename (§6, prerequisite 4).
  GitHub redirects the old URL, but relying on a redirect is not a plan.
- Only one user site exists per account, so this repo now claims
  `thisismaca.github.io` for good. No other project needs it.
- **Milestone 0 is unblocked.** The interim `https://thisismaca.github.io` URL
  is usable straight away, so the "prove the chain works" deploy no longer waits
  on domain registration. This was the main cost of the alternative and the
  reason it was rejected.

### 6.2 Custom domain

`thisismaca.com` is not owned yet. When it is registered:

- Apex (`thisismaca.com`) — four `A` records to GitHub's Pages IPs
  (`185.199.108–111.153`), plus the `AAAA` records; confirm the current set
  against GitHub's docs rather than copying them from here.
- `www` — a `CNAME` to `thisismaca.github.io`.
- Tick **Enforce HTTPS** once the certificate is issued. It can take up to 24
  hours to become available.

**The gotcha that will cost an afternoon:** setting the domain in repo settings
auto-commits a `CNAME` file to the *source branch root*, but an Actions
deploy publishes `dist/`, so that file never reaches the deployed output and
the domain silently unsets on the next deploy. The file must live at
**`public/CNAME`** so Astro copies it into `dist/`.

`site:` in `astro.config.mjs` must be set to the deployed origin. It takes two
values over the project's life:

| When | `site:` | `base:` |
|---|---|---|
| From the first deploy | `https://thisismaca.github.io` | never set |
| Once the domain is live | `https://thisismaca.com` | never set |

`base` is never configured at either point — that is what §6.1's rename bought.
Changing `site:` is a one-line edit with no structural consequence. Getting it
wrong produces broken absolute URLs rather than a visible error, so check it
after the domain moves.

---

## 7. Build order

Sequenced so something is deployed and visible early, and so the riskiest
unknowns surface first rather than last.

**Milestone 0 — deploy nothing, successfully.** *(partly done, 2026-07-30)*
Scaffold, commit the governing documents, connect the host, deploy a near-empty
page. This proves the whole chain works before any real work is at stake. If
hosting is going to be annoying, it is much better to discover that now.

- ✅ Toolchain — Node 24.18.0 LTS, Astro 7.1.6, Spec Kit 0.14.4.
- ✅ Scaffold builds to static output with no JavaScript.
- ✅ Governing documents committed.
- ✅ Repo renamed to `thisismaca.github.io` (§6.1), remote repointed, `develop`
  pushed.
- ✅ `.github/workflows/deploy.yml` (build + deploy on push to `main`) and
  `ci.yml` (build-only on `develop`/PRs), `site:` set to
  `https://thisismaca.github.io`.
- ✅ Settings → Pages → Source set to **GitHub Actions**.
- ✅ First deploy — confirmed 2026-07-30. `https://thisismaca.github.io` serves
  the scaffold's placeholder page, zero `<script>` tags in production. The
  whole chain works.

**Milestone 0 is closed.** Next up: Milestone 1, the shell (§7 below) — base
layout, header, footer, three routes, palette, both fonts, no images yet.

**Milestone 1 — the shell.** *(closed 2026-07-30)*
Base layout, header, footer, three routes, the palette, both fonts. No images.
Verify S4 and S5 completely at 320px and at 1440px. This is where S4.4 gets
measured for real. Built as Spec Kit feature `001-shell`
(`specs/001-shell/`) — spec, plan, and 22 tasks, all executed and verified
against the actual production build (`npm run build && npm run preview`),
not just the dev server.

- ✅ `Base`/`Header`/`Footer` built, three routes wired up, all with zero
  JavaScript in the built output (confirmed by grepping `dist/`).
- ✅ S4.4 measured for real at 320px through 1440px with the real fonts
  loaded — one line, no wrap, `clamp()` values confirmed continuous by
  sampling computed styles at several widths rather than only at the
  breakpoint.
- ✅ Header shadow toggle (S4.11), page backgrounds (S10, and the S6.2 gap
  this pass found and fixed — Home's own `#444444` background, not just the
  white surfaces), typography boundary exact at 767px/768px (S9.1, S11.1).
- ✅ Footer two-half layout, Instagram link/glyph, plain-text email (S5).
- **Real bug found and fixed during implementation**: Astro's `fonts:`
  config alone does not emit any usable CSS — a font must additionally be
  rendered via the `Font` component from `astro:assets` in `<head>`, or
  `var(--font-menu)` silently resolves to nothing and the browser falls
  back to its default serif. Documented in `specs/001-shell/research.md`
  so it isn't rediscovered later.

**Milestones 2 and 3 — merged, closed 2026-07-30.**
Originally two milestones: prove the pipeline with one piece, *then* build
the stack's own behaviour (gaps, lazy loading, priority) once ten pieces
exist. That assumed content would arrive one file at a time. Instead five of
the ten pieces arrived together, fully finished — image, title, description,
alt-worthy detail, and hand-picked caption colours all at once. Building the
schema for one piece and then immediately rebuilding the stack around it for
four more, in two separate Spec Kit cycles, would be process for its own
sake. The two milestones are built as a single feature instead
(`specs/002-*/`). Sequencing risk isn't lost — the task breakdown for that
feature still proves the schema and pipeline against one piece before wiring
the rest, per the same reasoning either way.

Content collection, schema, the five real pieces, the caption block with
each one's own colours, the 20px gaps, lazy loading, priority on the first
image. Verify S12.3 by checking that several image sizes were actually
generated, and that nothing shifts as images load. Ten pieces at launch
(S2.3) still holds — five more arrive later as plain file additions (S2.1),
not a code change.

**Caption contrast, checked before writing any code (S12.4).** All five
hand-picked pairs were run through the WCAG contrast formula. Three passed
outright. Two didn't:

| Piece | Background | Original text | Ratio | Fixed text | Ratio |
|---|---|---|---|---|---|
| Jean-Michel Labadie | `#494949` | `#f08e79` | 3.79:1 (fail) | `#f3a797` | 4.63:1 |
| Rex Brown | `#38543d` | `#e4a652` | 3.94:1 (fail) | `#eab875` | 4.64:1 |

Both fixes are the same hue, lightened until AA passed — same mood, not a
different colour choice. Confirmed with Maca before touching any file; the
palette is hers to own. The other three (Kirk Hammett, Mario Duplantier,
Phil Anselmo) passed as specified, 6.5:1 to 10.6:1.

Worth noting for next time: 14px bold (the caption title, S9.2) is still
below WCAG's 18.66px bold threshold for "large text," so it needs the same
4.5:1 as body copy — it doesn't get the friendlier 3:1 bar. Check title and
description against the same threshold, not just description.

- ✅ `src/content.config.ts` — `pieces` collection, `glob()` loader,
  `image()` schema field, `alt` required non-empty, hex colours validated,
  no orientation field.
- ✅ Five real pieces committed as content files: Kirk Hammett, Mario
  Duplantier, Jean-Michel Labadie, Rex Brown, Phil Anselmo.
- ✅ Home page renders the stack — verified in-browser against the actual
  production build, not the dev server: correct order, correct per-piece
  caption colours (including the two WCAG-corrected ones), 20px gaps
  between every piece and at both ends (header→first, last→footer),
  measured at ~20.00px each.
- ✅ S12.3 — 9 responsive width variants generated for a single piece,
  confirmed by listing `dist/_astro/`, not just by trusting the config.
- ✅ S6.10/S6.11 — first piece's `<img>` carries `loading="eager"` and
  `fetchpriority="high"`; every other piece carries `loading="lazy"` with
  no `fetchpriority`, confirmed by reading the actual DOM attributes.
- ✅ S6.6 — found and closed a latent gap: Astro's default `objectFit` is
  `"cover"`, currently inert only because the container's aspect ratio
  always matches the image's own under `layout: 'full-width'`. Pinned to
  `contain` explicitly in `Piece.astro` so cropping can't silently
  reappear if that configuration ever changes.
- ✅ S2.1 — proved for real: added a sixth piece file, rebuilt, it
  appeared at position 6 with no other file touched; removed it, rebuilt,
  back to five.
- ✅ S2.2 — proved for real: removed one piece's `alt`, the build failed
  with a schema error naming the exact file and field; restored it, clean
  build. (Aside: on this Windows machine, the failed build also throws a
  `UV_HANDLE_CLOSING` assertion from Node's libuv after printing the
  correct error — a platform-level crash in Astro's error-path cleanup,
  not something this feature caused or can fix. The exit code is still
  non-zero either way, which is all CI actually checks.)
- ✅ `scripts/check-contrast.mjs` — the script `PLAN.md` §8 promises now
  exists for real, reads pieces' actual frontmatter (not a hardcoded
  list), and confirms all five pairs pass at 4.5:1+.
- ✅ Zero `<script>` tags in the build output, unchanged from Milestone 1.

**Milestone 4 — About and Contact.** *(split, 2026-07-30; closed in full
same day)*
The photo wrap, the shadow on both, the Contact footer swap. Originally one
milestone; split into two Spec Kit features because About's real content
(bio copy, influences, the site's own source-repo link, and Maca's photo)
arrived while Contact's (the invitation text) had not — the mirror image of
why Milestones 2/3 merged. `specs/003-about/` covers the About half only;
Contact remains unscoped until its content exists, at which point it
becomes its own feature rather than blocking on it now.

- ✅ `/about` fills the empty shell `001-shell` left it in: the site
  owner's real bio (both paragraphs, unedited), her influences woven into
  it as running text (closing `SPEC.md` §7's former open question), and a
  working link to the site's own source repo.
- ✅ The photo — deliberately cropped, unlike the piece stack's uncropped
  images — renders at exactly 80×100px via `layout="fixed"`, confirmed by
  checking the actual generated files: exactly two tiny variants (1x/2x),
  not the piece stack's full responsive set. `specs/003-about/research.md`
  explains why the global `image.layout: 'full-width'` from
  `002-content-stack` had to be overridden per-instance here, not changed
  globally.
- ✅ S7.3/S7.4 verified precisely, not just eyeballed: at 1024px, the first
  line of body text sits at the same vertical position as the photo and
  starts just past its right edge (a real wrap, checked via `Range` on the
  actual text node — a plain bounding-box check on the paragraph element
  would have falsely failed this, since the box itself still spans full
  width under a CSS float). Below 768px, the photo's centred position
  matches the padding math exactly, and all text falls below it.
- ✅ Header shadow (S7.6) confirmed still intact — this feature touches no
  shared component.
- ✅ Zero `<script>` tags, unchanged.

`specs/004-contact/` closes the Contact half, and with it, the whole
milestone:

- ✅ `/contact` shows the finalized invitation text and the email/Instagram
  blocks as page content — no hunting, per `SPEC.md` §1's own definition
  of success.
- ✅ The email/Instagram markup was extracted into `ContactInfo.astro`,
  exactly as `PLAN.md` §5 anticipated before either consuming feature
  existed: one component, rendered by `Footer.astro` in its default state
  and directly by `contact.astro` as page content. Its flex layout had to
  move onto its own wrapper rather than depending on `<footer>` to supply
  it — the thing that makes it actually portable between the two contexts.
- ✅ `Footer.astro` gained a `copyright` boolean prop (the same pattern as
  `Header.astro`'s `shadow` prop from `001-shell`): `/contact`'s footer
  shows only `© Maca Sepúlveda 2026` at 10px; every other page is
  unaffected.
- ✅ The regression this refactor risked was checked directly, not
  assumed: `/` and `/about` footers confirmed identical after the change —
  same content, same email, same Instagram link, no copyright line
  leaking onto pages that shouldn't have it.
- ✅ Zero `<script>` tags and no horizontal overflow at 320px, confirmed
  across all three pages, not just `/contact`.

**Milestone 5 — verification pass.** *(closed 2026-07-30)*
Walk §8 below end to end. Fix. Merge to `main`. *(Originally read "§10" —
a stale cross-reference to this document's own section numbering; §10 is
"Open — decide during build," not verification. Fixed while closing this
milestone.)*

Every row in §8's now-complete table run against the live production site.
Zero failures — see §8's "Milestone 5 results" for what was actually
checked and what it found, not just a pass count. Already on `main` as of
this milestone, via the same push-and-merge pattern as every prior one.

**Milestone 6 — the visual redesign.** *(added 2026-07-30)*
Not part of the original build order — Milestones 0–5 took the site from
nothing to a fully verified launch state, and this is a deliberate second
pass at its identity after seeing that state live, requested by the site
owner rather than surfaced by testing. Implements `SPEC.md` draft 4's
amendments in full: §4 (header nav spans the middle third of the viewport,
larger menu text, shadow now on all three pages), §5 (footer gets a fixed
80px height at 768px+), §6 (Home goes white, narrows to the middle third
at 768px+, the 20px inter-piece gap becomes 10px of caption padding), §7/§8
(About and Contact narrow and vertically centre at 768px+, About's photo
grows to 200px tall with new left text padding, Contact's footer sticks to
the viewport bottom), §9 (Vazirmatn replaces Zalando Sans SemiExpanded
everywhere except the menu, piece captions get a distinct title treatment).

Built as one Spec Kit feature, not split across several — unlike the
Milestone 2/3 merge or the Milestone 4 split, which were driven by content
arriving at different times, every part of this redesign arrived in the
same request as one coherent design decision. Splitting it into several
near-identical specify/plan/tasks cycles would be process for its own
sake, the same reasoning `001-shell`'s tasks.md and others have used
throughout this project.

Constitution constraints hold unchanged throughout: zero JavaScript (the
new width/centring/sticky-footer behaviour is CSS only), one breakpoint
(no second breakpoint is introduced anywhere — `SPEC.md` S11.1 is explicit
about this), and the work still wins (a narrower column is still a
deliberate framing choice for the work, not chrome competing with it).

*(closed 2026-07-30, built as `specs/005-visual-redesign/`)*

- ✅ A real conflict caught during planning, not implementation: S4.3/S4.8's
  "middle third" nav span, applied literally at every width, would have
  broken S4.4 (one line at 320px) — confirmed with actual rendered text,
  not assumed: three words at the new 24px size total ~174px against
  ~107px available in a literal third of 320px, and the infeasible range
  extends to roughly 500px. Fixed in `SPEC.md` itself before writing the
  plan: the nav's middle-third span applies only at 768px and up, reusing
  the site's one existing breakpoint rather than inventing a crossover
  value.
- ✅ All measurements confirmed on the actual rendered site, not assumed
  from the CSS: at 1024px, Home's column and the header nav both measure
  ~336px against an expected third of ~341px (the ~5px gap is the
  scrollbar); the header nav's three items distribute with matching
  ~62px gaps on both sides; all six inter-piece gaps read as flush (0px)
  with each caption's own 10px bottom padding confirmed directly; the
  footer measures exactly 80px at 768px+ and reverts to its auto height
  below it.
- ✅ Contact's sticky footer works precisely as intended — footer bottom
  measured exactly equal to viewport bottom on its naturally short
  content.
- **Real finding, not a defect**: About's vertical centring (S7.8) has
  little practical effect. The 200px photo plus the bio text wrapping
  into a ~336px column produces roughly 1240px of content — taller than
  almost any real viewport — so there's essentially no vertical slack
  left to centre within on a typical screen. The CSS is exactly correct
  (`justify-content: center` is present and does nothing when content
  already exceeds the container, exactly as flexbox is supposed to
  behave); the emergent result of combining "narrow the column" with
  "also centre it vertically" just doesn't read the way it might have
  sounded when specified. Not fixed unilaterally — flagged for the site
  owner to decide whether About's column should be wider than Home's, or
  whether this is fine as is.
- ✅ Font-display:swap confirmed present on all 6 `@font-face` rules
  (Grenze Gotisch, Vazirmatn ×2 weights, both with fallbacks) — the
  typeface swap didn't quietly drop S9.3's guarantee.
- ✅ Keyboard focus order unaffected by wrapping page content in `<main>`.
- ✅ Zero `<script>` tags and full WCAG contrast pass, unchanged from
  every prior feature — this redesign touches no per-piece colour.

**Milestone 7 — narrow column widened to 40%.** *(closed 2026-08-04)*
Requested after seeing Milestone 6 live: the middle-third column (~33.3%)
read as too narrow. Implements `SPEC.md` draft 5 (S6.13, S7.8, S8.7
amended). One value changed in one place — `Base.astro`'s `main.narrow`
rule — since all three pages share it. The header nav's own middle-third
span (S4.3, S4.8) is a separate rule in `Header.astro` and was deliberately
left alone; nothing in the request touched it.

- ✅ Measured directly on the dev server at 1280px: Home's column is
  39.5–40% of the viewport (the 0.5px gap from exactly 40% is the
  scrollbar eating into `innerWidth`); About and Contact both measure
  exactly 40%, centred with matching 30%/30% margins.
- ✅ Home's images still span the full content column exactly (no gap,
  no overflow) — confirmed by comparing the first image's rendered width
  to `main`'s width directly rather than assuming the existing
  `layout="full-width"` config would track a container it wasn't measured
  against before.
- ✅ Header nav span (S4.3) confirmed unchanged at ~33% — this feature
  touches no shared component the header depends on.
- ✅ No horizontal scroll introduced at any width; full-width (unnarrowed)
  behaviour below 768px confirmed unchanged at 375px.
- **Real finding, not requested but worth recording**: this closes the
  Milestone 6 finding above about About's vertical centring being
  "real but rarely visible." A wider column means shorter wrapped lines,
  so About's total content height at 1280×800 dropped from ~1240px to
  640px — now shorter than a typical viewport, so S7.8's centring is
  visibly active: measured top/bottom gaps of 80px/80px, exactly
  symmetric. Not something this change set out to fix; a side effect of
  widening the column for an unrelated reason.
- ✅ Zero `<script>` tags, unchanged.

**Milestone 8 — About photo, crop removed.** *(closed 2026-08-04)*
Reported live as a bug: the photo's fixed 80×200px box (S7.2, set
deliberately in Milestone 4 and carried through Milestone 6's redesign)
crops the 1066×1895 source image — `fit=cover` centre-crops roughly 29%
off the left/right edges to force that box, since the source's aspect
ratio (0.563) doesn't match the box's (0.4). Implements `SPEC.md` draft 6
(S7.2 amended) — a reversal of the earlier deliberate choice, not an
amendment to its reasoning.

- ✅ `about.astro`'s `<Image>` now specifies only `width={80}`, letting
  Astro infer height from the source's own aspect ratio rather than
  forcing both dimensions. Confirmed by fetching the actual generated
  file: 80×142px, ratio 0.5634 against the source's 0.5626 — the ~0.001
  difference is integer rounding on the inferred height, not a crop.
- ✅ Margin changed from a uniform 5px to 5px top/left, 30px right/bottom
  (`margin-right`/`margin-bottom` split out from the old `margin`
  shorthand) — confirmed via computed style at 768px+.
- ✅ Below 768px, `margin-inline: auto` still centres the image correctly
  (symmetric ~132px left/right at 375px viewport) and the 30px bottom
  margin carries through to the stacked mobile layout too, unchanged from
  before this fix.
- ✅ Zero `<script>` tags, unchanged.

**Milestone 9 — About photo sized up 20%.** *(closed 2026-08-04)*
Plain sizing request following Milestone 8. `width={80}` → `width={96}` in
`about.astro`'s `<Image>`; height is still inferred from the source's
aspect ratio (no second value to keep in sync). Implements `SPEC.md` draft
7 (S7.2 amended).

- ✅ Generated file confirmed 96×171px, ratio 0.5614 against the source's
  0.5626 — consistent with the same integer-rounding gap Milestone 8
  measured, not a new crop.
- ✅ At 768px+, text still wraps beside the larger photo — checked via a
  `Range` on the first paragraph's actual text node (a bounding-box check
  on the paragraph would false-fail here too, same caveat Milestone 4's
  log recorded for the original float).
- ✅ No horizontal scroll introduced at 1280px; margins (5px top/left,
  30px right/bottom) unchanged and unaffected by the size increase.
- **Found in passing, not fixed here**: at 375px, the About page already
  scrolls horizontally — the source-repo link (S7.7) renders its raw URL
  as unbroken text with no `overflow-wrap`, so it overflows the viewport
  regardless of photo size (confirmed independent of this change: below
  768px the photo is `float: none` and doesn't affect paragraph width at
  all). This is a pre-existing S11.3 violation, not something Milestone 8
  or 9 introduced. Flagged for a separate fix rather than folded into this
  milestone's scope.
- ✅ Zero `<script>` tags, unchanged.

**Milestone 10 — About photo sized up another 30%; text padding removed.**
*(closed 2026-08-04)* Two independent requests in one message. `width={96}`
→ `width={125}` in `about.astro`'s `<Image>` — 30% from the draft-7 value,
not from the original 80px, matching how the draft-7 request itself was
phrased ("than what it is now"). Separately, `.about p`'s `padding-left:
20px` (S7.9) is deleted outright rather than zeroed, since the requirement
was to remove it, not to keep a now-inert declaration around. Implements
`SPEC.md` draft 8 (S7.2 amended, S7.9 removed).

- ✅ Generated file confirmed 125×222px, ratio 0.5631 against the source's
  0.5626 — same negligible rounding gap as Milestones 8 and 9, not a crop.
- ✅ Paragraph computed `padding` confirmed `0px` on all sides post-change.
- ✅ At 768px+, text still wraps beside the now-larger photo (checked via
  `Range` on the actual text node, same method as Milestone 9) and no
  horizontal scroll appears at 1280px.
- ✅ Below 768px, the photo remains centred at its new 125px width
  (`margin-inline: auto` unaffected by the size change).
- **Ambiguity flagged, not resolved by asking**: "30% larger" doesn't say
  larger than what. Read as compounding on the live 96px value rather than
  the original 80px, consistent with the draft-7 request's own explicit
  "than what it is now" framing. Stated as an assumption rather than
  blocking on a question, since correcting it is a one-line width change
  either way. If wrong, the intended value is 80 × 1.3 = 104px, not 125px.
- ✅ Zero `<script>` tags, unchanged.

---

## 8. Verification

How each part of the spec gets checked. This is what makes the requirements
testable rather than decorative.

**Expanded 2026-07-30.** This table originally listed 13 rows — "the ones
that actually catch problems" — not the full 55-odd requirements in
`SPEC.md`. That was fine while each feature verified its own slice as it
was built (every `specs/*/quickstart.md` covers its feature completely).
It stopped being fine at Milestone 5, whose entire job is a full pass
against the finished site as a whole — a curated subset can't do that.
Expanded to one row per requirement, grouped by `SPEC.md` section.

| Requirement | Check |
|---|---|
| **Content model (§2)** | |
| S2.1 | Add a piece file, rebuild, confirm no code changed |
| S2.2 | Delete an `alt` value, confirm the build fails |
| S2.3 | Count pieces on `/` — launch target is ten; a lower count is a launch-readiness gap, not a bug |
| S2.4 | Confirm `content.config.ts` has no orientation/medium/category field |
| **Routes (§3)** | |
| S3.1 | Confirm exactly `/`, `/about`, `/contact` exist and nothing else does |
| S3.2 | Confirm no per-piece URL resolves (by design) |
| **Header (§4)** | |
| S4.1 | Confirm header is white, flush to viewport top, no grey above it at any width |
| S4.2 | Confirm header spans full viewport width edge to edge |
| S4.3 | Confirm exactly Home/About/Contact, one row, centred |
| S4.4 | 320px viewport, real font, three items on one line |
| S4.5–S4.8 | Resize continuously, confirm no snapping |
| S4.9 | Confirm header CSS sets no fixed height — inspect computed style |
| S4.10 | Activate each item, confirm it navigates to the right page |
| S4.11 | Shadow present on `/about` and `/contact`, absent on `/` |
| **Footer (§5)** | |
| S5.1 | Confirm footer is white with two halves |
| S5.2 | Confirm email is plain text, not a link |
| S5.3 | Confirm `@thisismaca` + grey glyph |
| S5.4 | Instagram opens in a new tab |
| S5.5 | Narrow the viewport, confirm halves shrink rather than stack |
| S5.6 | Confirm no shadow/border on the footer |
| S5.7 | Confirm `/contact`'s footer differs from `/` and `/about`'s (see S8.4/S8.5) |
| **Home (§6)** | |
| S6.1 | Confirm pieces stack in ascending `order`, below the header |
| S6.2 | Confirm `#444444` behind and between pieces |
| S6.3 | Confirm each caption is flush against its own image, no gap |
| S6.4 | Confirm bold title above description in each caption |
| S6.5 | Confirm caption colours differ per piece and match each piece's own fields |
| S6.6 | Confirm images are full width, uncropped, no imposed height |
| S6.7 | Measure the gap between two piece units |
| S6.8 | Measure header→first-image and last-caption→footer gaps |
| S6.9 | Confirm no carousel/arrows/dots/pagination exists |
| S6.10–S6.12 | Throttle the network, confirm nothing shifts as images land |
| S6.13 | At 768px+, measure the stack's width against the viewport (40%) and confirm centred margins |
| **About (§7)** | |
| S7.1 | Confirm white background throughout |
| S7.2 | Confirm the photo is 125px wide, uncropped (rendered aspect ratio matches source), 5px top/left margin and 30px right/bottom margin |
| S7.3 | At 768px+, confirm text wraps beside the photo |
| S7.4 | Below 768px, confirm the photo is centred with text below it |
| S7.5 | Confirm body text is black |
| S7.6 | Shadow present (S4.11) |
| S7.7 | Confirm the source-repo link is present and correctly targeted |
| S7.8 | At 768px+, measure width (40% of viewport) and confirm vertical centring (equal top/bottom gaps) |
| **Contact (§8)** | |
| S8.1 | Confirm white background |
| S8.2 | Confirm exact invitation text, black, centred, 20px margin above/below |
| S8.3 | Confirm email/Instagram render as page content, not footer |
| S8.4 | Confirm the footer contains only the copyright line, at 10px |
| S8.5 | Confirm the copyright line appears nowhere but `/contact` |
| S8.6 | Shadow present (S4.11) |
| S8.7 | At 768px+, measure width (40% of viewport) and confirm vertical centring (equal top/bottom gaps) |
| **Typography (§9)** | |
| S9.1 | Confirm Grenze Gotisch weight 500, 20px≥768px / 16px<768px |
| S9.2 | Confirm Zalando Sans SemiExpanded regular 14px elsewhere, 10px on the copyright line |
| S9.3 | Throttle fonts, confirm no invisible/unstyled text at any point |
| **Colour (§10)** | Covered by the section-specific rows above — no separate check |
| **Responsive (§11)** | |
| S11.1 | Confirm 768px is the only breakpoint anywhere in the CSS |
| S11.2 | Confirm header padding/spacing never jumps at a fixed width |
| S11.3 | No horizontal scroll from 320px up |
| S11.4 | Confirm the stack never becomes multi-column at any width |
| **Performance & accessibility (§12)** | |
| S12.1 | View source on the built output, confirm no script tags |
| S12.2 | Covered by S2.2 |
| S12.3 | Confirm multiple widths generated per image |
| S12.4 | Run every caption colour pair through the WCAG contrast formula |
| S12.5 | Tab through all three pages |

**S12.4 update, 2026-07-30**: this turned out to be automatable — a ~30-line
script computing WCAG relative luminance catches it exactly, no manual
eyeballing needed. Run it against every pair as pieces are added; it already
caught 2 of the first 5 (§7, Milestones 2/3). The remaining manual judgment
is only what to do about a failure — nudge the same hue, pick a different
colour, or knowingly accept it — which stays a person's call.

### Milestone 5 results — 2026-07-30

Every row above run against `https://thisismaca.github.io` — the live
deployed site, not local dev or the build directory — with two exceptions
noted below where the live artifact and the local build are provably
identical. **Zero failures.**

Findings worth recording, not just a pass/fail tally:

- **S11.1, checked properly for the first time.** Scanned `document.
  styleSheets` for every `@media` rule actually shipped, across every
  page, rather than trusting that no stray breakpoint had crept in.
  Result: exactly two rules exist site-wide — `(width >= 768px)` on every
  page (the header's font-size switch) and `(width <= 767px)` on `/about`
  only (the photo's stacked layout). Same threshold, both sides, no third
  value anywhere. This is the kind of thing that's cheap to get subtly
  wrong (a stray `767px` vs `768px`, or a second breakpoint introduced by
  a later feature without noticing) and expensive to notice by eye.
- **S9.3, checked as a mechanism, not an observation.** Rather than
  throttle the network and eyeball whether text ever went invisible,
  read every shipped `@font-face` rule directly: all six (both faces,
  including their metric-matched fallbacks) carry `font-display: swap`.
  That's a standards-guaranteed behaviour, not a network-luck outcome —
  confirming the property is set is strictly stronger evidence than one
  throttled observation would have been.
- **S4.5–S4.8, re-measured at the exact 767/768 boundary on production**,
  not just re-trusting `001-shell`'s original numbers: `16px`→`20px` font,
  padding tracking the `clamp()` formula continuously on both sides, no
  snap.
- **S6.7/S6.8, all six gaps on the live site measure ~20.00px** —
  header→first piece, all four inter-piece gaps, last caption→footer.
  One `gap`/`padding-block` property on the stack container, holding
  everywhere it needs to.
- **S12.3/S6.10/S6.11, confirmed via actual network requests**, not just
  the `loading`/`fetchpriority` attributes: multiple distinct `.webp`
  files for the same source image were genuinely requested over the
  wire; the first piece alone carries `eager`/`high`, every other piece
  `lazy` with no `fetchpriority`.
- **S12.1, confirmed two ways**: zero `<script>` elements in the live DOM
  (`document.querySelectorAll('script').length === 0`) and zero
  `<script` substrings in the local `dist/` output — the two exceptions
  where local and live were both checked, since they're provably the same
  artifact and each method has a different failure mode it would catch.
- **S2.3 remains a known, accepted gap**: five of ten launch pieces. Not
  a defect — `PLAN.md` §7 always treated this as incremental, and nothing
  about the site's behaviour depends on the count being ten.

No code changed as a result of this milestone. That itself is a form of
evidence: four features, each verified in isolation as it was built, still
compose correctly as a whole site with nothing missed in between.

---

## 9. Risks

1. **Grenze Gotisch at 16px.** A blackletter face at small sizes on a phone may
   be hard to read. Checked at Milestone 1; if it fails, the fix is a size
   change in S9.1, not a font change.
2. **Wide monitors.** Spec open question 4. Each piece becomes very large above
   ~1920px. May need a maximum width on the stack — which would amend S6.6.
3. **Caption contrast.** ~~Twenty hand-picked colours, ten pairs, no
   automation.~~ Wrong on both counts — see §8's S12.4 update. 2 of the
   first 5 pairs failed and were nudged; 5 pairs remain for the pieces still
   to come.
4. **Photoshop and CSS disagreeing.** ~~The composition is designed at one
   width and rendered at many. Check one exported piece in the browser early
   rather than exporting all ten first.~~ Moot as written — the assumed
   Photoshop-compositing workflow didn't happen. All five real pieces are
   direct camera exports (1365–2794px, whatever the shot's native
   resolution), not canvases composed at a fixed width, and the site never
   needed them to be (S2.4 holds regardless of source dimensions). No CSS
   disagreement risk remains once that assumption is gone.

---

## 10. Open — decide during build

- ~~Pages vs Workers (§1.2), at Milestone 0.~~ **Closed 2026-07-30 — GitHub
  Pages. See §1.2.**
- ~~Image export format and how many responsive widths (spec open question
  3).~~ **Answered in practice, 2026-07-30** — see `SPEC.md` §14. Source
  format is whatever the camera/editing software exports (JPEG); Astro's
  pipeline generates responsive widths at build time regardless of source
  size, so "how many" was never a decision to make by hand.
- Page titles, meta descriptions, favicon, 404 (spec open question 5).
- Whether `year`, `medium` and `band/venue` return to the schema (spec open
  question 1). Five piece files already exist, so this is no longer
  hypothetically disruptive — adding a field now means touching all five
  existing pieces, not zero.
