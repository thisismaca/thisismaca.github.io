# Phase 0 Research: The Contact Page

No genuine unknown this time — unlike `001-shell`'s Fonts API surprise or
`002`/`003`'s image-pipeline findings, this feature is a refactor using a
pattern the codebase already established, not new territory.

## Component extraction and the footer's two states

**Decision**: extract the email/Instagram markup out of `Footer.astro`
into a new `ContactInfo.astro`, rendered by `Footer.astro` in its default
state and directly by `contact.astro` as page content. Give `Footer.astro`
a `copyright` boolean prop (default `false`) that swaps its rendered
content between `<ContactInfo />` and the copyright line.

**Rationale**: this is exactly the shape `001-shell`'s `Header.astro`
already uses for its `shadow` boolean prop — one component, one prop,
two visual states, no second component to keep in sync. `PLAN.md` §5
named this exact plan before either feature existed ("Build them as one
component used in two places, not two components that must be kept in
agreement"); this feature is just the point at which it's actually
needed, since `/contact` was empty until now.

**The layout styles must move with the content, not stay on `<footer>`.**
`Footer.astro`'s current `<style>` block puts the two-half flex layout
(`.half`, `.glyph`) on selectors scoped to whatever wraps them. If
`ContactInfo.astro` is going to render both inside `<footer>` (other
pages) and inside a plain content wrapper (`/contact`), its own flex
layout must live on its own root element, not depend on `<footer>`
supplying `display: flex`. Checked by reading the current component
(`src/components/Footer.astro`) directly rather than assuming: today,
`footer` itself is the flex container. That has to move onto
`ContactInfo`'s own wrapper for it to work standalone.

**Alternatives considered**: a second, separately-hand-written copy of
the email/Instagram markup directly in `contact.astro`. Rejected — this
is precisely the "two components that must be kept in agreement" `PLAN.md`
§5 already ruled out, and the risk isn't hypothetical: any future change
to the Instagram glyph, the email text, or the link attributes would need
to be made twice and could silently drift.
