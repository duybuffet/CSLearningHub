#!/usr/bin/env node
// Writes a translation overlay skeleton (English text in place, ready to translate).
// Usage: node scripts/extract-translation-skeleton.mjs <lang> <phase/slug.json> [--force]
//   e.g. node scripts/extract-translation-skeleton.mjs vi phase3/tries.json
import fs from 'node:fs';
import path from 'node:path';
import { overlaySkeleton } from './translation-overlay-helpers.mjs';

const [lang, rel, flag] = process.argv.slice(2);
if (!lang || !rel) {
  console.error('usage: extract-translation-skeleton.mjs <lang> <phase/slug.json> [--force]');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
const src = path.join(root, rel);
const out = path.join(root, lang, rel);
if (fs.existsSync(out) && flag !== '--force') {
  console.error(`${out} exists (pass --force to overwrite)`);
  process.exit(1);
}
const topic = JSON.parse(fs.readFileSync(src, 'utf8'));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(overlaySkeleton(topic), null, 2) + '\n');
console.log(`wrote ${path.relative(process.cwd(), out)}`);
