# Quickstart: Validating The Contact Page

Prerequisites: Node 24.x, `npm install` already run.

## Setup

```bash
npm run build
npm run preview -- --host
```

## Scenario 1 — Reach out without hunting (US1, SC-001, SC-002)

1. Load `/contact`.
2. **Expect**: the invitation text renders exactly as written, black,
   centred, with visible margin above and below.
3. **Expect**: below it, `thisismaca@gmail.com` appears as plain text (not
   a link), and `@thisismaca` with a grey Instagram glyph appears next to
   it.
4. Activate the Instagram element. **Expect**: it opens Instagram in a new
   tab (unchanged behaviour from `001-shell`).
5. **Expect**: page background white, header shadow visible.

## Scenario 2 — Minimal footer here (US2, SC-003)

1. On `/contact`, scroll to the footer.
2. **Expect**: it contains only `© Maca Sepúlveda 2026`, small (10px).
3. **Expect**: the email/Instagram blocks do **not** also appear in this
   footer — they already rendered above, as page content.

## Scenario 3 — Everywhere else is unchanged (US3, SC-004)

1. Load `/`.
2. **Expect**: the footer shows the email and Instagram blocks exactly as
   before this feature — same content, same layout, no copyright line.
3. Load `/about`.
4. **Expect**: the same — footer unchanged, no copyright line.
5. Compare against the pre-feature commit if anything looks different —
   this scenario exists specifically to catch a regression from the
   shared-component refactor.

## Scenario 4 — Production parity (SC-005, SC-006)

```bash
grep -ril "<script" dist/
```

**Expect**: no output. Then resize `/contact`, `/`, and `/about`
continuously from 320px to 2560px. **Expect**: no horizontal scrollbar on
any of the three at any width.

## Done when

Every "Expect" above holds. This closes `PLAN.md` §7 Milestone 4.
