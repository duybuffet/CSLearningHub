// Shared helpers for translation overlays (src/content/<lang>/<phase>/<slug>.json).
// An overlay holds only reader-facing text; code, diagrams and quiz answers come
// from the English source. `sourceHash` fingerprints the English text it was made
// from, so stale translations can be detected after the English changes.
import crypto from 'node:crypto';

/** Fields a translator should translate, per section type. */
const SECTION_TEXT_FIELDS = ['title', 'content', 'explanation', 'caption', 'label', 'items'];

/** Build an overlay skeleton (English text in place) from an English topic. */
export function overlaySkeleton(topic) {
  const sections = topic.sections.map((s) => {
    const out = { type: s.type };
    for (const k of SECTION_TEXT_FIELDS) if (s[k] !== undefined && s[k] !== '') out[k] = s[k];
    return out;
  });
  const overlay = {
    sourceHash: sourceHash(topic),
    title: topic.title,
    tagline: topic.tagline,
    sections,
    quiz: topic.quiz.map((q) => ({ id: q.id, question: q.question, options: q.options, explanation: q.explanation })),
  };
  if (topic.visualizer?.caption) overlay.visualizerCaption = topic.visualizer.caption;
  return overlay;
}

/** Stable fingerprint of the English reader-facing text. */
export function sourceHash(topic) {
  const skeleton = {
    title: topic.title,
    tagline: topic.tagline,
    sections: topic.sections.map((s) => {
      const out = { type: s.type };
      for (const k of SECTION_TEXT_FIELDS) if (s[k] !== undefined && s[k] !== '') out[k] = s[k];
      return out;
    }),
    quiz: topic.quiz.map((q) => [q.question, q.options, q.explanation]),
    visualizerCaption: topic.visualizer?.caption ?? '',
  };
  return crypto.createHash('sha1').update(JSON.stringify(skeleton)).digest('hex').slice(0, 12);
}

/** Fenced code blocks and inline `code` spans — these must survive translation verbatim. */
export function codeFragments(text = '') {
  const fences = [...text.matchAll(/```[\s\S]*?```/g)].map((m) => m[0]);
  const withoutFences = text.replace(/```[\s\S]*?```/g, '');
  // CommonMark code spans: a run of N backticks closed by a run of exactly N (handles `` a `b` ``)
  const inline = [...withoutFences.matchAll(/(?<!`)(`+)(?!`)([^\n]*?[^`\n])\1(?!`)/g)].map((m) => m[0]);
  return { fences, inline };
}

/** Structural problems between an English topic and its overlay (empty array = aligned). */
export function overlayMismatches(topic, overlay) {
  const problems = [];
  if (!overlay.title?.trim()) problems.push('missing title');
  if (!overlay.tagline?.trim()) problems.push('missing tagline');
  if (!Array.isArray(overlay.sections) || overlay.sections.length !== topic.sections.length) {
    problems.push(`section count ${overlay.sections?.length} ≠ ${topic.sections.length}`);
    return problems;
  }
  topic.sections.forEach((s, i) => {
    const o = overlay.sections[i];
    if (o.type !== s.type) problems.push(`#${i} type ${o.type} ≠ ${s.type}`);
    for (const k of SECTION_TEXT_FIELDS) {
      const has = s[k] !== undefined && s[k] !== '';
      if (has && (o[k] === undefined || o[k] === '')) problems.push(`#${i} missing ${k}`);
    }
    if (s.items && (!Array.isArray(o.items) || o.items.length !== s.items.length)) problems.push(`#${i} items count differs`);
    for (const k of ['content', 'explanation']) {
      if (!s[k]) continue;
      const en = codeFragments(s[k]);
      const tr = codeFragments(o[k] ?? '');
      if (en.fences.join('\n') !== tr.fences.join('\n')) problems.push(`#${i} ${k}: fenced code changed`);
      const missingInline = en.inline.filter((c) => !tr.inline.includes(c));
      if (missingInline.length) problems.push(`#${i} ${k}: inline code dropped/changed ${missingInline.slice(0, 3).join(' ')}`);
    }
  });
  if (!Array.isArray(overlay.quiz) || overlay.quiz.length !== topic.quiz.length) {
    problems.push(`quiz count ${overlay.quiz?.length} ≠ ${topic.quiz.length}`);
  } else {
    topic.quiz.forEach((q, i) => {
      const o = overlay.quiz[i];
      if (o.id !== q.id) problems.push(`quiz ${i} id ${o.id} ≠ ${q.id}`);
      if (!o.question?.trim() || !o.explanation?.trim()) problems.push(`quiz ${i} missing text`);
      if (!Array.isArray(o.options) || o.options.length !== q.options.length) problems.push(`quiz ${i} option count differs`);
      else if (new Set(o.options).size !== o.options.length) problems.push(`quiz ${i} duplicate options`);
    });
  }
  return problems;
}
