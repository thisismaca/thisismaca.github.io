import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a 6-digit hex colour');

// SPEC.md §2 / PLAN.md §3. No orientation field — S2.4 says the site has
// no concept of one, so the schema is where that gets enforced, not left
// as a convention someone could violate.
const pieces = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pieces' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      image: image(),
      // S2.2 — required AND non-empty. z.string() alone would let an
      // empty string satisfy "required" without satisfying the spec.
      alt: z.string().min(1),
      captionBackground: hexColor,
      captionText: hexColor,
      order: z.number().int(),
    }),
});

// SPEC.md S15.1 (draft 13) — one file per link, same as pieces: adding a
// link is adding a file. url is validated as http(s), so a typo or a
// missing scheme fails the build instead of shipping a dead card.
const links = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/links' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    url: z.url({ protocol: /^https?$/ }),
    order: z.number().int(),
  }),
});

export const collections = { pieces, links };
