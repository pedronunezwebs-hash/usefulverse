const MAX_TEXT = 200_000;
const STOP = new Set(('a an and are as at be by for from had has have in into is it its of on or that the their this to was were will with your aber als am an auf aus bei das dem den der des die ein eine einer für im in ist mit oder sich sie und von von zu the a an and are as at be by for from has have in is it of on or that the their to was with job role position experience skills required responsibilities team work').split(/\s+/u));
const SECTION_ALIASES = Object.freeze({
  summary: ['summary', 'profile', 'about me', 'profil', 'kurzprofil', 'über mich', 'uber mich', 'samenvatting', 'profilo', 'resumen', 'perfil', 'résumé', 'resumo', '概要', '简介'],
  experience: ['experience', 'work experience', 'employment', 'berufserfahrung', 'erfahrung', 'werkervaring', 'esperienza', 'experiencia', 'expérience', 'ervaring', '職務経歴', '工作经验'],
  education: ['education', 'educational', 'ausbildung', 'bildung', 'education and training', 'ausbildung und weiterbildung', 'opleiding', 'formazione', 'educación', 'educacao', 'éducation', '学歴', '教育经历'],
  skills: ['skills', 'competencies', 'kenntnisse', 'fähigkeiten', 'faehigkeiten', 'kompetenzen', 'vaardigheden', 'competenze', 'habilidades', 'compétences', 'competências', 'スキル', '技能'],
  contact: ['contact', 'contact details', 'kontakt', 'kontaktdaten', 'contactgegevens', 'contacto', 'coordonnées', 'contatti', '連絡先', '联系方式'],
});

function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/gu, '').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function decodeXml(value) {
  return String(value).replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/giu, (entity, token) => {
    const key = token.toLowerCase();
    if (key === 'amp') return '&'; if (key === 'lt') return '<'; if (key === 'gt') return '>'; if (key === 'quot') return '"'; if (key === 'apos') return "'";
    const code = key.startsWith('#x') ? Number.parseInt(key.slice(2), 16) : Number(key.slice(1));
    return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : entity;
  });
}

function xmlText(xml) {
  return [...xml.matchAll(/<(?:[\w.-]+:)?(?:t|instrText)\b[^>]*>([\s\S]*?)<\/(?:[\w.-]+:)?(?:t|instrText)\s*>/gu)].map((match) => decodeXml(match[1])).join('');
}

function readRelationships(xml) {
  const links = new Map();
  for (const match of xml.matchAll(/<Relationship\b([^>]*)\/?\s*>/gu)) {
    const attrs = Object.fromEntries([...match[1].matchAll(/([\w:.-]+)\s*=\s*(["'])(.*?)\2/gu)].map((item) => [item[1], decodeXml(item[3])]));
    if (attrs.Id && /\/hyperlink$/u.test(attrs.Type ?? '')) links.set(attrs.Id, attrs.Target ?? '');
  }
  return links;
}

/** Parse only the text/structure parts of a DOCX. The caller must preflight and unzip the OOXML package safely. */
export function parseDocxStructure(documentXml, relationshipsXml = '') {
  const root = typeof documentXml === 'string' ? documentXml.match(/<((?:\w+:)?document)\b/u)?.[1] : null;
  const body = typeof documentXml === 'string' ? documentXml.match(/<((?:\w+:)?body)\b/u)?.[1] : null;
  if (typeof documentXml !== 'string' || documentXml.length > 8 * 1024 * 1024 || !root || !body || !new RegExp(`</${root}\\s*>`, 'u').test(documentXml) || !new RegExp(`</${body}\\s*>`, 'u').test(documentXml)) {
    throw new TypeError('The DOCX main document is missing, malformed or too large.');
  }
  const rels = readRelationships(relationshipsXml);
  const blocks = [];
  for (const match of documentXml.matchAll(/<(?:\w+:)?p\b[^>]*>([\s\S]*?)<\/(?:\w+:)?p\s*>/gu)) {
    const body = match[1]; const text = xmlText(body).replace(/\s+/gu, ' ').trim();
    if (!text) continue;
    const style = body.match(/<(?:\w+:)?pStyle\b[^>]*\b(?:\w+:)?val\s*=\s*(["'])(.*?)\1/iu)?.[2] ?? '';
    const outline = body.match(/<(?:\w+:)?outlineLvl\b[^>]*\b(?:\w+:)?val\s*=\s*(["'])(\d+)\1/iu)?.[2];
    const heading = /^title$/iu.test(style) ? 1 : /^heading\s*([1-9])$/iu.exec(style)?.[1] ? Number(/^heading\s*([1-9])$/iu.exec(style)[1]) : outline !== undefined ? Number(outline) + 1 : null;
    const bullet = /<(?:\w+:)?numPr\b/iu.test(body) || /<(?:\w+:)?ilvl\b/iu.test(body);
    const ids = [...body.matchAll(/<(?:\w+:)?hyperlink\b[^>]*\b(?:\w+:)?id\s*=\s*(["'])(.*?)\1/giu)].map((item) => item[2]);
    blocks.push({ text, heading, bullet, links: ids.map((id) => rels.get(id)).filter(Boolean) });
    if (blocks.reduce((total, block) => total + block.text.length, 0) > MAX_TEXT) throw new RangeError('The extracted text is over the 200,000-character local limit.');
  }
  return { blocks, links: [...new Set(blocks.flatMap((block) => block.links))], source: 'docx' };
}

/** Convert PDF.js text items into approximate lines. PDF text order can differ from visual column order. */
export function pdfItemsToStructure(pages) {
  if (!Array.isArray(pages) || !pages.length) throw new TypeError('The PDF contains no pages with selectable text.');
  const blocks = [];
  for (const items of pages) {
    const lines = [];
    for (const item of items) {
      const text = String(item.str ?? '').replace(/\s+/gu, ' ').trim();
      if (!text) continue;
      const y = Number(item.transform?.[5] ?? 0); const size = Math.max(1, Number(item.height ?? item.transform?.[3] ?? 10));
      let line = lines.find((candidate) => Math.abs(candidate.y - y) <= Math.max(1.5, size * 0.2));
      if (!line) { line = { y, size, pieces: [] }; lines.push(line); }
      line.size = Math.max(line.size, size); line.pieces.push({ x: Number(item.transform?.[4] ?? 0), text });
    }
    lines.sort((a, b) => b.y - a.y);
    const sizes = [...lines.map((line) => line.size)].sort((a, b) => a - b);
    const median = sizes.length ? (sizes[Math.floor((sizes.length - 1) / 2)] + sizes[Math.ceil((sizes.length - 1) / 2)]) / 2 : 10;
    for (const line of lines) {
      const text = line.pieces.sort((a, b) => a.x - b.x).map((piece) => piece.text).join(' ').replace(/\s+/gu, ' ').trim();
      if (text) blocks.push({ text, heading: line.size >= median * 1.25 ? 2 : null, bullet: /^[•▪◦*-]\s*/u.test(text), links: [] });
    }
  }
  return { blocks, links: [], source: 'pdf' };
}

function tokens(value) {
  return normalize(value).split(/\s+/u).filter((word) => [...word].length >= 3 && !STOP.has(word) && !/^\d+$/u.test(word));
}

function detectedSections(headings) {
  const normalized = headings.map((heading) => normalize(heading));
  return Object.entries(SECTION_ALIASES).map(([key, aliases]) => ({ key, found: normalized.some((heading) => aliases.some((alias) => heading === normalize(alias) || heading.includes(normalize(alias)))) }));
}

export function analyzeResume({ blocks, links = [], jobText = '', source = 'text' }) {
  if (!Array.isArray(blocks) || blocks.length > 10_000) throw new TypeError('The extracted document structure is invalid or too large.');
  const safeBlocks = blocks.map((block) => ({ text: String(block.text ?? '').slice(0, MAX_TEXT), heading: Number.isInteger(block.heading) ? block.heading : null, bullet: Boolean(block.bullet) }));
  const text = safeBlocks.map((block) => block.text).join('\n').slice(0, MAX_TEXT);
  if (!text.trim()) throw new TypeError('No selectable resume text was found. Scanned-only PDFs need OCR before this checker can read them.');
  const headings = safeBlocks.filter((block) => block.heading !== null).map((block) => block.text).slice(0, 100);
  const sections = detectedSections(headings);
  const cvTokens = tokens(text);
  const countWords = (words) => { const counts = new Map(); for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1); return counts; };
  const cvCounts = countWords(cvTokens);
  const jobCounts = countWords(jobText ? tokens(String(jobText).slice(0, 30_000)) : []);
  const terms = [...jobCounts].map(([term, inJob]) => ({ term, inJob, inResume: cvCounts.get(term) ?? 0 })).sort((a, b) => b.inJob - a.inJob || a.term.localeCompare(b.term)).slice(0, 24);
  return {
    source, characters: text.length, words: cvTokens.length, headings, sections,
    bullets: safeBlocks.filter((block) => block.bullet).length,
    links: [...new Set(links)].length,
    emailPresent: /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/u.test(text),
    phonePresent: /(?:\+?\d[\d .()/-]{7,}\d)/u.test(text),
    jobTerms: terms,
  };
}
