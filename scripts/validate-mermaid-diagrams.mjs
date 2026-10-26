#!/usr/bin/env node
// Parses every Mermaid diagram in the topic JSON with the app's own mermaid version.
// DOMPurify is stubbed (parsing needs no DOM). Usage: node scripts/validate-mermaid-diagrams.mjs [substr...]
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DOMPurify = (await import(path.join(root, 'node_modules/dompurify/dist/purify.es.mjs'))).default;
Object.assign(DOMPurify, { addHook() {}, removeHook() {}, removeHooks() {}, removeAllHooks() {}, sanitize: (x) => x, isSupported: true });
const mermaid = (await import('mermaid')).default;

const filters = process.argv.slice(2);
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    // English phase folders only — overlays carry no diagrams
    if (fs.statSync(p).isDirectory()) { if (!dir.endsWith('src/content') || f.startsWith('phase')) walk(p); }
    else if (f.endsWith('.json') && f !== 'curriculum.json') files.push(p);
  }
})(path.join(root, 'src/content'));

let total = 0;
const failures = [];
for (const f of files.sort()) {
  const rel = path.relative(path.join(root, 'src/content'), f);
  if (filters.length && !filters.some((s) => rel.includes(s))) continue;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const [i, s] of d.sections.entries()) {
    if (!s.mermaid) continue;
    total++;
    try {
      await mermaid.parse(s.mermaid);
    } catch (e) {
      failures.push(`${rel}#${i}: ${String(e.message || e).split('\n').slice(0, 3).join(' ')}`);
    }
  }
}
for (const f of failures) console.error(`error ${f}`);
console.log(`${total} diagrams parsed — ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
