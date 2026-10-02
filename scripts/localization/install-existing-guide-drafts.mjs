import { readFile, writeFile } from 'node:fs/promises';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const parseLines = async (path) => (await readFile(path, 'utf8')).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const input = JSON.parse(await readFile(`${directory}/guide-draft-input.json`, 'utf8'));
const rows = await parseLines(`${directory}/guide-madlad-input.jsonl`);
const output = await parseLines(`${directory}/guide-madlad-output.jsonl`);
const intermediate = JSON.parse(await readFile(`${directory}/guide-madlad-intermediate.json`, 'utf8'));
let fallbackRows = [];
try {
  fallbackRows = await parseLines(`${directory}/guide-madlad-fallback-output.jsonl`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const fallbackById = new Map(fallbackRows.map((row) => [row.id, row]));
const fallbackTranslations = {};
for (const [id, parts] of Object.entries(intermediate.fallbackPlans)) {
  fallbackTranslations[id] = parts.map((part) => {
    if (part.type === 'literal') return part.value;
    const output = fallbackById.get(part.id);
    if (typeof output?.translation !== 'string' || !output.translation.trim() || output.complete === false) {
      throw new Error(`Missing or incomplete marker-safe guide fragment ${part.id}`);
    }
    return output.translation;
  }).join('');
}

const finalById = new Map();
for (const row of rows) {
  const translated = intermediate.mainTranslations[row.id] ?? fallbackTranslations[row.id];
  if (typeof translated !== 'string' || !translated.trim()) throw new Error(`No final translation for ${row.language}/${row.id}`);
  if (/<ph\d+>/iu.test(translated)) throw new Error(`Unresolved marker in ${row.language}/${row.id}`);
  for (const [marker, original] of row.protected) {
    if (translated.split(original).length - 1 !== row.source.split(original).length - 1) {
      throw new Error(`Protected token count changed in ${row.language}/${row.id}: ${original}`);
    }
  }
  finalById.set(`${row.language}:${row.source}`, translated);
}

function materialize(value, language) {
  if (Array.isArray(value)) return value.map((item) => materialize(item, language));
  if (value && typeof value === 'object') {
    if (Object.hasOwn(value, '$translate')) {
      const translated = finalById.get(`${language}:${value.$translate}`);
      if (typeof translated !== 'string') throw new Error(`Missing guide/UI translation for ${language}: ${value.$translate}`);
      return translated;
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, materialize(item, language)]));
  }
  return value;
}

const packs = Object.fromEntries(Object.entries(input.targets).map(([language, target]) => [language, materialize(target, language)]));
await writeFile(`${directory}/guide-draft-final.json`, `${JSON.stringify(packs)}\n`);
console.log(`Created ${Object.keys(packs).length} existing-locale guide drafts with ${rows.length} source rows. Review before integration.`);
