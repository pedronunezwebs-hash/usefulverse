import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';

const [, , sourcePath, toolId, outputPath] = process.argv;
if (!sourcePath || !toolId || !outputPath || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(toolId)) {
  throw new Error('Usage: node export-approved-tool-copy.mjs SOURCE_COPY.json TOOL_ID OUTPUT_MODULE.mjs');
}
const databasePath = resolve(process.env.USEFULVERSE_TRANSLATION_DB ?? '.translation-data/translation-memory.sqlite3');
const sourceDocument = JSON.parse(await readFile(sourcePath, 'utf8'));
const sourceCopy = sourceDocument.sourceCopy;
const units = sourceDocument.units;
if (!sourceCopy || !Array.isArray(units) || !units.length) throw new Error('Source JSON must include sourceCopy and stable-key units.');
const db = new DatabaseSync(databasePath, { readOnly: true });

const aliases = {
  'pt-BR': 'pt', 'zh-CN': 'zh', 'zh-TW': 'zh_tw', fil: 'tl', 'nb-NO': 'nb',
};
const localeList = ['en', 'es', 'fr', 'pt-BR', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh-CN', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh-TW', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'ha', 'fil', 'ta', 'fa', 'am', 'gu', 'nb-NO', 'te'];
const values = units.map((unit) => {
  const prefix = `${toolId}.`;
  if (typeof unit.key !== 'string' || !unit.key.startsWith(prefix) || typeof unit.source !== 'string') {
    throw new Error(`Invalid stable translation unit: ${JSON.stringify(unit)}`);
  }
  return { path: unit.key.slice(prefix.length), source: unit.source };
});
const sourceHash = (text) => createHash('sha256').update(text, 'utf8').digest('hex');
const placeholderSignature = (text) => {
  const counts = new Map();
  for (const token of text.match(/\{[A-Za-z][A-Za-z0-9_]*\}|https?:\/\/[^\s<>]+|`[^`]*`|<\/?[A-Za-z][^>]*>|UsefulVerse|Unicode|(?<!\w)\d+(?:[.,]\d+)*(?:%|°)?/giu) ?? []) counts.set(token, (counts.get(token) ?? 0) + 1);
  return JSON.stringify(Object.fromEntries([...counts].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)));
};
const translations = new Map();
const missing = [];
for (const locale of localeList.filter((value) => value !== 'en')) {
  for (const unit of values) {
    const key = `${toolId}.${unit.path}`;
    const row = db.prepare('SELECT source, source_hash, signature, status, translation FROM strings WHERE locale=? AND key=?').get(locale, key);
    const review = row && db.prepare(`SELECT reviewer,reviewed_at,review_note,source_hash FROM review_events WHERE locale=? AND key=? ORDER BY id DESC LIMIT 1`).get(locale, key);
    if (!row || row.status !== 'approved' || row.source !== unit.source
      || row.source_hash !== sourceHash(unit.source) || row.signature !== placeholderSignature(unit.source)
      || !row.translation?.trim() || placeholderSignature(row.translation) !== row.signature
      || !review || review.source_hash !== row.source_hash || !review.reviewer?.trim() || !/^\d{4}-\d{2}-\d{2}$/u.test(review.reviewed_at)) {
      missing.push(`${locale}/${key}${row ? ` (${row.status})` : ' (missing)'}`);
      continue;
    }
    translations.set(`${locale}/${unit.path}`, { text: row.translation, reviewer: review.reviewer, reviewedAt: review.reviewed_at });
  }
}
db.close();
if (missing.length) throw new Error(`Cannot export ${toolId}: ${missing.length} rows are not current, approved, and placeholder-safe. First rows: ${missing.slice(0, 12).join(', ')}`);

function assignPath(target, path, value) {
  const parts = path.split('.');
  let node = target;
  for (const part of parts.slice(0, -1)) node = Array.isArray(node) ? node[Number(part)] : node[part];
  const last = parts.at(-1);
  if (Array.isArray(node)) node[Number(last)] = value;
  else node[last] = value;
}
const packs = {};
for (const locale of localeList) {
  const routeKey = aliases[locale] ?? locale;
  const pack = structuredClone(sourceCopy);
  if (locale !== 'en') {
    for (const unit of values) assignPath(pack, unit.path, translations.get(`${locale}/${unit.path}`).text);
    const reviewers = new Set(values.map((unit) => translations.get(`${locale}/${unit.path}`).reviewer));
    const reviewDates = new Set(values.map((unit) => translations.get(`${locale}/${unit.path}`).reviewedAt));
    pack.localizationStatus = 'human-reviewed';
    pack.localizationReviewers = [...reviewers].sort();
    pack.localizationLastReviewedAt = [...reviewDates].sort().at(-1);
  } else {
    pack.localizationStatus = 'source-english';
  }
  pack.copyLanguage = routeKey;
  if (Array.from(String(pack.title ?? '')).length > 60) throw new Error(`${toolId}/${locale}: title exceeds 60 characters; shorten it in the reviewed translation source.`);
  if (Array.from(String(pack.description ?? '')).length > 160) throw new Error(`${toolId}/${locale}: description exceeds 160 characters; shorten it in the reviewed translation source.`);
  packs[routeKey] = pack;
}
const output = `// Exported from the approved local translation queue. Source and placeholder hashes were checked at export.\nexport default Object.freeze(${JSON.stringify(packs)});\n`;
await writeFile(outputPath, output, 'utf8');
console.log(`Exported ${Object.keys(packs).length} approved locale copies for ${toolId} to ${outputPath}`);
