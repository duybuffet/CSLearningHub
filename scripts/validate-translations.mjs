#!/usr/bin/env node
// Validates translation overlays in src/content/<lang>/ against their English source.
// Usage: node scripts/validate-translations.mjs [lang=vi] [file-substring ...]   (exit 1 on errors)
import fs from 'node:fs';
import path from 'node:path';
import { overlayMismatches, sourceHash } from './translation-overlay-helpers.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
const [lang = 'vi', ...filters] = process.argv.slice(2);
const LANG_ROOT = path.join(ROOT, lang);

const errors = [];
const warnings = [];
let checked = 0;
let total = 0;

// A long English string copied unchanged means the translator skipped it.
const looksUntranslated = (en, tr) => typeof en === 'string' && en.length > 60 && en === tr;

const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'curriculum.json'), 'utf8'));
const titlesPath = path.join(LANG_ROOT, 'curriculum-titles.json');
const titles = fs.existsSync(titlesPath) ? JSON.parse(fs.readFileSync(titlesPath, 'utf8')) : null;
if (!titles) warnings.push(`${lang}/curriculum-titles.json missing — contents will show English titles`);

for (const phase of curriculum.phases) {
  if (titles && !titles.phases?.[phase.id]?.title) warnings.push(`${lang}: no title for ${phase.id}`);
  for (const week of phase.weeks) {
    for (const t of week.topics) {
      if (!t.file) continue;
      total++;
      if (filters.length && !filters.some((f) => t.file.includes(f))) continue;
      const overlayPath = path.join(LANG_ROOT, t.file);
      if (!fs.existsSync(overlayPath)) continue; // untranslated topics fall back to English
      checked++;
      const topic = JSON.parse(fs.readFileSync(path.join(ROOT, t.file), 'utf8'));
      let overlay;
      try {
        overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));
      } catch (e) {
        errors.push(`${lang}/${t.file}: invalid JSON — ${e.message}`);
        continue;
      }
      for (const p of overlayMismatches(topic, overlay)) errors.push(`${lang}/${t.file}: ${p}`);
      if (overlay.sourceHash !== sourceHash(topic)) warnings.push(`${lang}/${t.file}: English changed since translation (re-check)`);
      if (looksUntranslated(topic.tagline, overlay.tagline)) errors.push(`${lang}/${t.file}: tagline untranslated`);
      overlay.sections?.forEach((o, i) => {
        const s = topic.sections[i] ?? {};
        for (const k of ['content', 'explanation']) {
          if (looksUntranslated(s[k], o[k])) errors.push(`${lang}/${t.file}: #${i} ${k} untranslated`);
        }
      });
      overlay.quiz?.forEach((o, i) => {
        if (looksUntranslated(topic.quiz[i]?.explanation, o.explanation)) errors.push(`${lang}/${t.file}: quiz ${i} untranslated`);
      });
      if (titles && titles.topics?.[t.file] !== overlay.title) {
        warnings.push(`${lang}/${t.file}: curriculum-titles out of sync (run sync-translated-titles)`);
      }
    }
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${lang}: ${checked}/${total} topics translated — ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
