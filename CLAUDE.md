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

Three things block the first deploy, none of them code: the repo must be
**public** (Pages on private repos is not free), Settings → Pages → Source must
be **GitHub Actions** rather than "Deploy from a branch", and the workflow's
Node should be pinned to 24.x to match local.

Two traps recorded in `PLAN.md` §6, both silent rather than loud:

- The `CNAME` file must live at **`public/CNAME`**, not the repo root. Setting
  the domain in repo settings writes it to the root, where an Actions deploy
  publishing `dist/` never sees it — so the custom domain unsets on the next
  deploy.
- `site:` in `astro.config.mjs` must match the deployed origin. Wrong value
  produces broken absolute URLs, not an error.
- The repo is `thisismaca/thisismaca.com`, **not** `thisismaca.github.io`, so
  it is a *project* site serving from `/thisismaca.com/`. That would need
  `base:` set — and then unset again when the custom domain lands. `PLAN.md`
  §6.1 recommends avoiding `base` entirely by not deploying until the domain
  is registered. Do not add `base:` without re-reading that section.

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
`specs/###-*/` directory. The mapping for this project is **one Spec Kit feature
per `PLAN.md` §7 milestone** (`001-shell`, `002-one-piece`, `003-the-stack`,
`004-about-contact`). `SPEC.md` stays at root as the whole-site contract; each
feature spec cites its requirement IDs rather than restating them.

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

Per `PLAN.md`, mostly not yet built:

- **Content:** one file per piece in `src/content/pieces/`, schema in
  `src/content.config.ts`. Fields `title`, `description`, `image`, `alt`,
  `captionBackground`, `captionText`, `order` — all required, `alt` non-empty,
  hex colours validated. **No orientation field** (`S2.4` excludes it by design).
  Astro 7 imports `z` from `astro/zod`, not `astro:content`.
- **Images:** sources go in **`src/assets/`, never `public/`**. Files in
  `public/` are copied untouched, which defeats `S12.3` (responsive sizes) and
  `S6.12` (no layout shift, which relies on build-time intrinsic dimensions).
  This is the single easiest thing to get wrong here.
- **Routes:** exactly three — `/`, `/about`, `/contact`. No per-piece URLs.
- **Styling:** plain CSS, no framework. One breakpoint (768px), six colours,
  a handful of `clamp()` values.
- **Header shadow:** one boolean prop on the base layout (on for About/Contact,
  off for Home), not three header copies.

## Verification

`PLAN.md` §8 maps each requirement to a check. The ones that actually catch
problems:

- **S2.2** — delete an `alt` value; the build must fail.
- **S12.1** — grep built HTML in `dist/` for `<script`; must find none.
- **S12.4** — contrast-check every hand-picked caption colour pair. Twenty
  hand-chosen colours with nothing automated to validate them; this is the
  requirement most likely to be silently violated.
- **S4.4** — three menu items on one line at 320px, with the real blackletter
  font loaded. Previously estimated by arithmetic, never measured.
