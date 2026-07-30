# Phase 0 Research: Content Pieces and the Stack

Most technical decisions were already made at the whole-repo level in root
`PLAN.md` §3–4 and are inherited here: Content Layer API with a `glob()`
loader, `z` imported from `astro/zod`, images imported from `src/assets/`
(never `public/`). This file covers only what was genuinely unresolved going
into this feature — checked against the installed package
(`node_modules/astro`, 7.1.6), not assumed from memory, per the lesson from
`001-shell`'s font bug.

## Image field in the content schema

**Decision**: the `image()` helper, injected into the schema function by
Astro's Content Layer API, not a plain `z.string()`:

```ts
defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pieces' }),
  schema: ({ image }) => z.object({
    image: image(),
    alt: z.string().min(1),
    // ...
  }),
});
```

**Rationale**: `image()` is what makes a frontmatter path resolve to an
*imported* asset (going through the build pipeline, carrying known
dimensions) rather than a bare string the browser would request directly.
Confirmed against Astro's own images guide. This is the mechanism `PLAN.md`
§4 already named ("images must be imported rather than referenced as bare
paths") — this is what performs that import, from inside the schema.

## Responsive widths and layout-shift prevention

**Unknown going in**: whether Astro's image pipeline generates multiple
widths (S12.3) and reserves layout space (S6.12) by configuration alone, or
needs something rendered/invoked the way Fonts did in `001-shell`.

**Decision**: set `image.layout: 'full-width'` and `image.responsiveStyles:
true` globally in `astro.config.mjs`, and pass a `priority` boolean prop to
the `<Image>` component only for the first piece.

**Rationale**, read directly from `node_modules/astro/dist/assets/internal.js`
(the actual resolved-options logic, not documentation prose):

- **Width/height inference is automatic and unconditional.** If neither
  `width` nor `height` is passed, Astro reads them from the imported
  image's own metadata and uses those as-is. This is what satisfies S6.12 —
  it needs no configuration at all, only that the image came through
  `image()` in the first place.
- **Responsive width generation is *not* automatic — it is gated on
  `layout`.** The default layout is literally `"none"`, and the code only
  computes multiple `widths` when `layout !== "none"`. Skipping the
  `image.layout` config (the same way `001-shell` skipped rendering
  `<Font>`) would silently ship a single image size and fail S12.3 without
  any error — checked directly to avoid repeating that mistake.
- **`layout: 'full-width'`** is the documented match for S6.6 ("full
  viewport width, own intrinsic height, nothing cropped, no height
  imposed"): Astro's own description is "the image will scale to fit the
  container, maintaining its aspect ratio" — no cropping behaviour, unlike
  `constrained` or `fixed`.
- **`responsiveStyles: true`** auto-generates the CSS that makes
  `full-width` actually behave that way (`width: 100%; height: auto`, in
  effect). Astro's docs say to enable this "unless you are styling the
  images yourself" — this feature isn't, so it's on.
- **This whole feature (`image.layout` et al.) is stable in Astro 7, not
  experimental** — confirmed by reading `config.d.ts` directly rather than
  trusting a version-general summary: introduced 5.10.0, and the file
  explicitly separates it from the `experimental` config block used
  elsewhere in the same file for genuinely unstable features.

## First-image priority (S6.10/S6.11)

**Decision**: a single `priority` boolean prop on `<Image>`, set `true` only
for the piece with `order === 1` (or more simply, the first item after
sorting).

**Rationale**: found directly in `internal.js` — `priority` is a real,
documented-in-source prop that expands to exactly the three attributes
S6.10/S6.11 ask for, together, correctly paired:

| `priority` | `loading` | `decoding` | `fetchpriority` |
|---|---|---|---|
| `true` | `eager` | `sync` | `high` |
| unset (default) | `lazy` | `async` | unset |

No need to set `loading`/`fetchpriority` by hand — doing so risks pairing
them inconsistently (e.g. `eager` without `fetchpriority`), which `priority`
avoids by construction.

## Image formats

Not a requirement here — S12.3 asks for "sizes appropriate to the
viewport," not a specific output format. Astro's default local image
service output format is left at its default rather than configured
further; nothing in `SPEC.md` mandates AVIF/WebP specifically, and adding
that configuration now would be solving a problem the spec doesn't pose.
