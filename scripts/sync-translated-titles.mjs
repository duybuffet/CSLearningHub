#!/usr/bin/env node
// Copies each overlay's chapter title into src/content/<lang>/curriculum-titles.json
// (the contents page needs every title up front, without loading every chapter).
// Phase and week titles in that file are maintained by hand and left untouched.
// Usage: node scripts/sync-translated-titles.mjs [lang=vi]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
const lang = process.argv[2] ?? 'vi';
const titlesPath = path.join(ROOT, lang, 'curriculum-titles.json');
const titles = fs.existsSync(titlesPath) ? JSON.parse(fs.readFileSync(titlesPath, 'utf8')) : { phases: {}, topics: {} };
const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'curriculum.json'), 'utf8'));

const topics = {};
for (const phase of curriculum.phases) {
  for (const week of phase.weeks) {
    for (const t of week.topics) {
      const overlayPath = t.file && path.join(ROOT, lang, t.file);
      if (overlayPath && fs.existsSync(overlayPath)) topics[t.file] = JSON.parse(fs.readFileSync(overlayPath, 'utf8')).title;
    }
  }
}
titles.topics = topics;
fs.writeFileSync(titlesPath, JSON.stringify(titles, null, 2) + '\n');
console.log(`${lang}: ${Object.keys(topics).length} chapter titles synced`);
