# Constitution — thisismaca.com

These are the rules that outrank everything else. When a later decision conflicts
with one of these, the later decision is wrong. If one of these turns out to be
wrong, it gets changed here first, deliberately, before any code moves.

## 1. The work wins

Nothing on the page competes with an image. Chrome, captions, navigation and
future ornament exist to hold the work, never to be looked at. If a decision
makes the site more interesting and the work less visible, it is the wrong
decision.

## 2. One gallery, not several

The work is a single body with one visual language. Medium is a quiet caption,
never a category, never a filter, never a section. There is no "illustration"
page and no "photography" page.

## 3. Content is files in Git

Every piece is a file in the repository. No database, no CMS, no admin panel, no
runtime content fetching. Adding a piece is adding a file and nothing else.

## 4. Static output, portable host

The build produces static files that could be served by any host without
modification. No feature depends on a specific vendor's runtime. Moving hosts is
a DNS change, not a rewrite.

## 5. JavaScript must earn its place

Ships zero JavaScript by default. Any script must be load-bearing — the feature
genuinely cannot exist without it — and must be justified in the spec before it
is written. Convenience is not justification.

## 6. Portfolio, not shop

Nothing is sold on this site. No cart, no prices, no checkout. Prints are linked
out to an existing print house, never handled here.

## 7. No image without a text alternative

Every image carries alt text. The build fails if one is missing. This is not
negotiable for accessibility, and it is also how the work gets found.

## 8. Spec before code

Behaviour is decided in the spec and only then implemented. If something is
being built that the spec does not describe, stop and write the spec entry
first. The spec describes *what must be true*; it never names a framework.
