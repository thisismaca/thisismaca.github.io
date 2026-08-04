# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # dev server
npm run dev -- --host    # dev server on the LAN, for checking on a phone
npm run build            # static build to dist/
npm run preview          # serve dist/ locally
```

When starting the dev server from an agent session, prefer `npx astro dev --background`,
then manage it with `astro dev stop` / `status` / `logs` rather than holding a
foreground process.

There is no test runner and no linter. Verification on this project is the
checklist in `PLAN.md` §8, which is checked against the *built output* — see
Verification below.

## Project state

Scaffolded and building; no real content yet. Node 24.18.0, Astro 7.1.6
(engine floor `>=22.12.0`). `npm run build` emits `dist/` with zero JavaScript.

**Hosting: GitHub Pages**, decided 2026-07-30, deployed via GitHub Actions
(`PLAN.md` §1.2). Nothing is wired up yet — no workflow, no `site:` in
`astro.config.mjs`, no `public/CNAME`. That is deliberate, not an oversight;
the user asked for docs first.

Blocking the first deploy, none of it code: the repo is being renamed to
`thisismaca.github.io` (see below) and the local remote needs repointing
afterwards; only the initial commit is on `origin`, so `develop` needs pushing;
Settings → Pages → Source must be **GitHub Actions** rather than "Deploy from a
branch"; and the workflow's Node should be pinned to 24.x to match local. The
repo is already public, so the free-tier requirement is satisfied.

Two traps recorded in `PLAN.md` §6, both silent rather than loud:

- The `CNAME` file must live at **`public/CNAME`**, not the repo root. Setting
  the domain in repo settings writes it to the root, where an Actions deploy
  publishing `dist/` never sees it — so the custom domain unsets on the next
  deploy.
- `site:` in `astro.config.mjs` must match the deployed origin. Wrong value
  produces broken absolute URLs, not an error.
- **Never set `base:` in `astro.config.mjs`.** The repo is being renamed to
  `thisismaca.github.io`, which makes this a *user* site serving from the root
  (`PLAN.md` §6.1). `base` exists only for project sites on a subpath; setting
  it here would break every asset URL. If a future session sees a subpath URL
  and reaches for `base`, the rename has not happened yet — fix that instead.

`site:` takes exactly two values over the project's life:
`https://thisismaca.github.io` from the first deploy, then
`https://thisismaca.com` once the domain is live. Nothing else changes with it.

**There are no per-branch preview URLs** — GitHub Pages is one site per repo.
To check on a phone, run `npm run dev -- --host` and open the LAN address. For
anything that could differ between dev and production, use
`npm run build && npm run preview -- --host` instead.

## Governing documents

Three documents govern this project, in strict order of authority. They are not
interchangeable:

1. **`.specify/memory/constitution.md`** — the rules that outrank everything.
   Root `CONSTITUTION.md` is a pointer to it, kept so the two cannot drift.
2. **`SPEC.md`** (root) — *what must be true* of the finished site, as numbered
   requirements (`S4.11`, `S6.7`). Names no framework, host or library. Checkable
   against the built site.
3. **`PLAN.md`** (root) — *how* it gets built. Disposable; rewritable without
   touching `SPEC.md`. Every decision must cite the requirement it serves.

`DRAFT.md` is the original brief and is **gitignored** — absent from a fresh
clone. Historical context, never authority.

**Numbered requirement IDs are the shared vocabulary.** Reference them in code
comments, commits and feature specs.

## Spec Kit workflow

This repo uses [GitHub Spec Kit](https://github.com/github/spec-kit) (0.14.4,
PowerShell scripts, Claude integration). Skills live in `.claude/skills/`:

`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`,
plus optional `/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`.

**Do not run `/speckit-constitution` casually** — the constitution is
hand-written and the command's template output is markedly worse. Amend by hand.

Spec Kit is feature-oriented: each `/speckit-specify` creates a numbered
`specs/###-*/` directory. The mapping for this project is **one Spec Kit
feature per `PLAN.md` §7 milestone**, with exceptions driven by when real
content or requests actually arrived rather than the milestone boundaries as
originally drawn: Milestones 2 and 3 (one piece, then the stack) merged into
a single feature `002-*` when five of the ten launch pieces arrived finished
at once; Milestone 4 (About and Contact) split into `003-about` and
`004-contact` because their content arrived separately. Milestone 6 (the
visual redesign) is one feature despite touching nearly every page, because
— unlike the splits/merges above — every part of it arrived in a single
request as one coherent design decision, not staggered content. See
`PLAN.md` §7 for all of this. `SPEC.md` stays at root as the whole-site
contract; each feature spec cites its requirement IDs rather than restating
them.

## Constitution constraints

Non-negotiable; they should shape every implementation choice:

- **Zero JavaScript by default.** Any script must be load-bearing and justified
  in the spec *before* it is written. Convenience is not justification.
- **Content is files in Git.** No database, CMS, admin panel, or runtime fetching.
  Adding a piece = adding one file, changing no code.
- **Static output, portable host.** No feature may depend on a vendor runtime.
- **No image without alt text.** Enforced by schema so the build *fails* —
  not by convention.
- **One gallery.** Medium is a caption, never a category, filter, or route.
- **Portfolio, not shop.** No cart, prices, or checkout.
- **Spec before code.** Building something the spec doesn't describe means
  stopping and writing the spec entry first.

## Architecture

Built and live at `https://thisismaca.github.io`. Per `PLAN.md`'s milestones:

- **Content:** one file per piece in `src/content/pieces/`, schema in
  `src/content.config.ts`. Fields `title`, `description`, `image`, `alt`,
  `captionBackground`, `captionText`, `order` — all required, `alt` non-empty,
  hex colours validated. **No orientation field** (`S2.4` excludes it by design).
  Astro 7 imports `z` from `astro/zod`, not `astro:content`. Five of ten launch
  pieces exist; adding the rest is a file addition, no code change.
- **Images:** sources go in **`src/assets/`, never `public/`**. Files in
  `public/` are copied untouched, which defeats `S12.3` (responsive sizes) and
  `S6.12` (no layout shift, which relies on build-time intrinsic dimensions).
  This is the single easiest thing to get wrong here.
- **Routes:** exactly three — `/`, `/about`, `/contact`. No per-piece URLs.
- **Styling:** plain CSS, no framework. One breakpoint (768px). Content on
  every page narrows to a centred column at 768px+ (`Base.astro`'s
  `narrowContent` prop); About and Contact additionally centre vertically
  within the viewport (`centerContent`) — Home doesn't, since its stack is
  always taller than one screen.
- **Header shadow:** unconditional on every page — no prop, no per-page
  toggle. (It used to be on for About/Contact, off for Home; the 2026-07-30
  redesign made it universal.)
- **Sticky footer:** `Base.astro` makes `body` a flex column with
  `min-height: 100vh` and `<main>` `flex: 1 0 auto`, so `Footer` is always
  the last flex child — this is what pins it to the viewport bottom on short
  pages (Contact) without needing a per-page special case; Home's longer
  content is unaffected by the same mechanism.
- **Typography:** Grenze Gotisch on the header menu only; Vazirmatn
  everywhere else (body text at weight 300/18px, piece caption titles at
  weight 400/20px sharing the same `--font-body` font registration —
  Astro's Fonts API resolves the right `@font-face` from `font-weight`
  alone, no second config entry needed per weight).

## Verification

`PLAN.md` §8 has one row per `SPEC.md` requirement, not just a curated
subset — it's been run end to end against the live production site once
(Milestone 5) and again after the redesign (Milestone 6). The ones most
likely to catch a real regression:

- **S2.2** — delete an `alt` value; the build must fail.
- **S12.1** — grep built HTML in `dist/` for `<script`; must find none.
- **S12.4** — run `node scripts/check-contrast.mjs`. It reads every piece's
  actual frontmatter, so it automatically covers pieces added later — no
  manual eyeballing, and no hardcoded list to fall out of sync.
- **S4.4** — three menu items on one line at 320px, with the real blackletter
  font loaded, below the header nav's middle-third span (which only applies
  at 768px+ — confirmed by measuring rendered text that a literal reading at
  every width would break this).
- **S7.8** — About's vertical centring was real but often invisible at the
  original 33.3% column width (`PLAN.md`'s Milestone 6 note); widening to
  40% (Milestone 7, draft 5) shortened the wrapped bio text enough that
  it's now visibly centred on typical viewports (measured 80px/80px
  top/bottom at 1280×800) — check for symmetric gaps, not just the CSS.
