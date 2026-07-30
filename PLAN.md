# Plan — thisismaca.com

**Status:** draft 2 · **Date:** 2026-07-30 · **Implements:** `SPEC.md` draft 2

This document describes *how* the spec gets built. Unlike `SPEC.md`, it is
disposable. If Astro turns out to be the wrong choice, this file is rewritten
and the spec is untouched.

**Rule for this document:** every decision below names the spec requirements it
serves. Anything here that serves no requirement is either scope creep, or a
sign that the spec has a hole.

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
- ⬜ Rename the repo to `thisismaca.github.io` (§6.1), repoint the remote, push
  `develop`.
- ⬜ GitHub Actions workflow, Pages source set to Actions, `site:` set to
  `https://thisismaca.github.io`.
- ⬜ First deploy — the half that actually proves the chain. Not blocked on
  domain registration; the `github.io` URL serves from the root, so the chain
  can be proven now and the domain attached later as a one-line `site:` change.

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

- ~~Pages vs Workers (§1.2), at Milestone 0.~~ **Closed 2026-07-30 — GitHub
  Pages. See §1.2.**
- Image export format and how many responsive widths (spec open question 3).
- Page titles, meta descriptions, favicon, 404 (spec open question 5).
- Whether `year`, `medium` and `band/venue` return to the schema (spec open
  question 1). Cheap to add now, more disruptive once ten files exist.
