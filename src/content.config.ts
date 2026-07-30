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

export const collections = { pieces };
