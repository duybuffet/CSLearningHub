#!/usr/bin/env node
// Validates curriculum + topic JSON against the content schema and renderer limits.
// Usage: node scripts/validate-content.mjs [file-substring ...]   (exit 1 on errors)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
const filters = process.argv.slice(2);

// Must match the renderer: section types, shiki languages, precached mermaid types.
const SECTION_TYPES = new Set(['intro', 'analogy', 'explanation', 'diagram', 'code_example', 'code_concept', 'callout', 'key_takeaways']);
const CODE_LANGS = new Set(['javascript', 'js', 'typescript', 'ts', 'json', 'bash', 'sh', 'shell', 'sql', 'yaml', 'yml', 'proto', 'protobuf', 'dockerfile', 'hcl', 'html', 'markdown', 'python', 'text']);
const MERMAID_TYPES = new Set(['flowchart', 'graph', 'sequenceDiagram', 'stateDiagram-v2', 'stateDiagram', 'classDiagram']);
const CALLOUT_VARIANTS = new Set(['tip', 'warning', 'info']);

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

function lintMermaid(f, i, src) {
  const lines = src.split('\n');
  const kind = lines[0].trim().split(/\s/)[0];
  if (!MERMAID_TYPES.has(kind)) err(f, `#${i} mermaid type "${kind}" not supported offline (use flowchart/sequenceDiagram/stateDiagram-v2/classDiagram)`);
  lines.forEach((line, n) => {
    const t = line.trim();
    if (kind === 'sequenceDiagram' && /->>|-->>|->|-x|-\)/.test(t) && t.includes(';')) err(f, `#${i} mermaid line ${n + 1}: ";" ends a sequence statement — reword`);
    if (/^note (left|right) of|^note over/i.test(t) && t.includes(':') && t.split(':').slice(1).join(':').trim().startsWith('"') && !t.trim().endsWith('"')) err(f, `#${i} mermaid line ${n + 1}: single-line note spans lines — use note ... end note`);
    if (/^(flowchart|graph)/.test(kind) && /\[[^\]"]*[()][^\]"]*\]/.test(t)) err(f, `#${i} mermaid line ${n + 1}: parentheses inside [label] — quote it: A["label (x)"]`);
  });
}

function validateTopic(file, entry, phaseId) {
  const full = path.join(ROOT, file);
  let d;
  try {
    d = JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    return err(file, `invalid JSON — ${e.message}`);
  }
  for (const k of ['id', 'title', 'phase', 'week', 'icon', 'tagline', 'readTime', 'sections', 'visualizer', 'quiz']) {
    if (d[k] === undefined) err(file, `missing "${k}"`);
  }
  if (`phase${d.phase}` !== phaseId) err(file, `phase ${d.phase} does not match curriculum ${phaseId}`);
  if (!Array.isArray(d.sections) || !Array.isArray(d.quiz)) return;

  d.sections.forEach((s, i) => {
    if (!SECTION_TYPES.has(s.type)) return err(file, `#${i} unknown section type "${s.type}"`);
    if (['intro', 'explanation', 'analogy', 'callout'].includes(s.type) && !s.content?.trim()) err(file, `#${i} ${s.type} has no content`);
    if (s.type === 'callout' && s.variant && !CALLOUT_VARIANTS.has(s.variant)) err(file, `#${i} bad callout variant "${s.variant}"`);
    if (s.type === 'diagram') (s.mermaid ? lintMermaid(file, i, s.mermaid) : err(file, `#${i} diagram without mermaid`));
    if (s.type.startsWith('code_')) {
      if (!s.code?.trim()) err(file, `#${i} code section without code`);
      if (s.language && !CODE_LANGS.has(s.language)) err(file, `#${i} language "${s.language}" not highlighted — add it to syntax-highlighted-code-block.tsx`);
    }
    if (s.type === 'key_takeaways' && !(s.items?.length > 0)) err(file, `#${i} key_takeaways without items`);
    const prose = [s.content, s.explanation, ...(s.items ?? [])].filter(Boolean).join('\n');
    if ((prose.match(/```/g) ?? []).length % 2) err(file, `#${i} unbalanced \`\`\` fence`);
    for (const m of prose.matchAll(/```(\w+)/g)) if (!CODE_LANGS.has(m[1])) warn(file, `#${i} fenced language "${m[1]}" not highlighted`);
  });
  for (const t of ['intro', 'key_takeaways']) if (!d.sections.some((s) => s.type === t)) err(file, `no ${t} section`);

  if (d.quiz.length < 5) warn(file, `only ${d.quiz.length} quiz questions`);
  const ids = new Set();
  d.quiz.forEach((q, i) => {
    if (ids.has(q.id)) err(file, `quiz ${i} duplicate id ${q.id}`);
    ids.add(q.id);
    if (q.type !== 'mcq') err(file, `quiz ${i} type must be "mcq"`);
    if (!Array.isArray(q.options) || q.options.length < 2) return err(file, `quiz ${i} needs options`);
    if (!(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length)) err(file, `quiz ${i} correct index out of range`);
    if (new Set(q.options).size !== q.options.length) err(file, `quiz ${i} duplicate options`);
    if (!q.explanation?.trim()) err(file, `quiz ${i} missing explanation`);
    if (q.options.some((o) => /^(all|none) of the above$/i.test(o.trim()))) warn(file, `quiz ${i} uses "all/none of the above"`);
  });
  const positions = new Set(d.quiz.map((q) => q.correct));
  if (d.quiz.length > 3 && positions.size === 1) err(file, `every quiz answer is option ${'ABCD'[[...positions][0]]}`);
}

const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, 'curriculum.json'), 'utf8'));
const referenced = new Set();
let checked = 0;
for (const phase of curriculum.phases) {
  for (const week of phase.weeks) {
    for (const t of week.topics) {
      if (!t.file) continue;
      referenced.add(t.file);
      if (filters.length && !filters.some((f) => t.file.includes(f))) continue;
      if (!fs.existsSync(path.join(ROOT, t.file))) { err(t.file, 'listed in curriculum but file missing'); continue; }
      validateTopic(t.file, t, phase.id);
      checked++;
    }
  }
}
if (!filters.length) {
  (function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      // Only English phase folders; translation overlays (vi/…) are checked by validate-translations
      if (fs.statSync(p).isDirectory()) { if (dir !== ROOT || f.startsWith('phase')) walk(p); }
      else if (f.endsWith('.json') && f !== 'curriculum.json') {
        const rel = path.relative(ROOT, p);
        if (!referenced.has(rel)) err(rel, 'file not referenced from curriculum.json');
      }
    }
  })(ROOT);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${checked} topics checked — ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
