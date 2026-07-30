#!/usr/bin/env node
// Checks caption colour pairs against WCAG AA (4.5:1 for normal text).
// SPEC.md S12.4: nothing else validates these hand-picked colours.
//
// Usage:
//   node scripts/check-contrast.mjs
//     Checks every piece under src/content/pieces/*.md by reading its
//     captionBackground/captionText frontmatter directly.
//
//   node scripts/check-contrast.mjs "#bgHex" "#textHex"
//     Checks one ad-hoc pair — run this before adding a new piece file,
//     not after (PLAN.md §8).

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIECES_DIR = join(__dirname, '..', 'src', 'content', 'pieces');
const AA_NORMAL_TEXT = 4.5;

function srgbToLinear(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(hexA, hexB) {
  const lA = relativeLuminance(hexA);
  const lB = relativeLuminance(hexB);
  const lighter = Math.max(lA, lB);
  const darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}

function extractFrontmatterField(source, field) {
  const match = source.match(new RegExp(`^${field}:\\s*["']?(#[0-9a-fA-F]{6})["']?\\s*$`, 'm'));
  return match ? match[1] : null;
}

function checkPair(label, bg, text) {
  const ratio = contrastRatio(bg, text);
  const pass = ratio >= AA_NORMAL_TEXT;
  const status = pass ? 'PASS' : 'FAIL';
  console.log(
    `${status}  ${label.padEnd(28)} bg=${bg} text=${text}  ${ratio.toFixed(2)}:1 (need ${AA_NORMAL_TEXT}:1)`,
  );
  return pass;
}

const args = process.argv.slice(2);

if (args.length === 2) {
  const [bg, text] = args;
  const ok = checkPair('ad-hoc pair', bg, text);
  process.exit(ok ? 0 : 1);
}

if (args.length !== 0) {
  console.error('Usage: node scripts/check-contrast.mjs [bgHex textHex]');
  process.exit(1);
}

const files = readdirSync(PIECES_DIR).filter((f) => f.endsWith('.md'));
let allPass = true;

for (const file of files) {
  const source = readFileSync(join(PIECES_DIR, file), 'utf-8');
  const bg = extractFrontmatterField(source, 'captionBackground');
  const text = extractFrontmatterField(source, 'captionText');
  if (!bg || !text) {
    console.log(`SKIP  ${file} — captionBackground/captionText not found`);
    continue;
  }
  const ok = checkPair(file, bg, text);
  allPass = allPass && ok;
}

process.exit(allPass ? 0 : 1);
