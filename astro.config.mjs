// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // User site (thisismaca.github.io) — serves from the root, so no `base`.
  // See PLAN.md §6.1 and §6.2 for why, and what site: becomes once the
  // custom domain is live.
  site: 'https://thisismaca.github.io',
});
