import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const input = JSON.parse(await readFile(`${directory}/draft-input.json`, 'utf8'));
const guideDrafts = JSON.parse(await readFile(`${directory}/guide-draft-final.json`, 'utf8'));
const batchRows = (await readFile(`${directory}/madlad-input.jsonl`, 'utf8')).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const intermediate = JSON.parse(await readFile(`${directory}/madlad-intermediate.json`, 'utf8'));
let fallbackOutputs = [];
try {
  fallbackOutputs = (await readFile(`${directory}/madlad-fallback-output.jsonl`, 'utf8')).split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const fallbackById = new Map(fallbackOutputs.map((row) => [row.id, row]));
const fallbackTranslations = {};
for (const [id, plan] of Object.entries(intermediate.fallbackPlans)) {
  fallbackTranslations[id] = plan.map((part) => {
    if (part.type === 'literal') return part.value;
    const output = fallbackById.get(part.id);
    if (typeof output?.translation !== 'string' || !output.translation.trim()) throw new Error(`Missing fallback translation ${part.id}`);
    if (output.complete === false) throw new Error(`Incomplete fallback translation ${part.id}`);
    return output.translation;
  }).join('');
}

const unitTranslations = {};
for (const row of batchRows) {
  const translation = intermediate.mainTranslations[row.id] ?? fallbackTranslations[row.id];
  if (typeof translation !== 'string' || !translation.trim()) throw new Error(`No final translation for ${row.language}/${row.id}`);
  if (/<ph\d+>/iu.test(translation)) throw new Error(`Unresolved protection marker in ${row.language}/${row.id}`);
  for (const unitId of row.unitIds) unitTranslations[`${row.language}:${unitId}`] = translation;
}

const placeholderPattern = /\{[A-Za-z][A-Za-z0-9_]*\}/gu;
const countOccurrences = (value, pattern) => value.match(pattern)?.length ?? 0;
function resolveMarkers(value, language, replacements) {
  if (Array.isArray(value)) return value.map((item) => resolveMarkers(item, language, replacements));
  if (value && typeof value === 'object') {
    if (Object.hasOwn(value, '$translate')) {
      let text = replacements[`${language}:${value.$translate}`];
      if (typeof text !== 'string') throw new Error(`Missing translated unit ${language}/${value.$translate}`);
      const count = value.$count;
      if (count !== undefined && !/\d/u.test(text)) {
        const localized = new Intl.NumberFormat(input.targets[language].pack.meta.code, { useGrouping: false }).format(count);
        text = `${localized} ${text}`;
      }
      return Object.hasOwn(value, '$count') ? { $value: text, $count: count } : { $value: text };
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveMarkers(item, language, replacements)]));
  }
  return value;
}

const result = {};
for (const [language, target] of Object.entries(input.targets)) {
  const replacements = {};
  for (const [unitId, source] of Object.entries(target.units)) {
    const translated = unitTranslations[`${language}:${unitId}`];
    if (typeof translated !== 'string') throw new Error(`No output for ${language}/${unitId}`);
    if (countOccurrences(translated, placeholderPattern) !== countOccurrences(source, placeholderPattern)) {
      throw new Error(`Placeholder mismatch in ${language}/${unitId}: ${source} => ${translated}`);
    }
    replacements[`${language}:${unitId}`] = translated;
  }
  let pack = resolveMarkers(target.pack, language, replacements);
  const sourceLabels = guideDrafts[language]?.sourceLabels;
  if (sourceLabels) {
    if (sourceLabels.length !== pack.guides.length) throw new Error(`Guide source count mismatch for ${language}`);
    pack.guides = pack.guides.map((guide, guideIndex) => ({
      ...guide,
      sources: guide.sources?.map((source, sourceIndex) => ({ ...source, label: sourceLabels[guideIndex][sourceIndex] })),
    }));
  }
  if (language === 'zh_tw') {
    const converted = spawnSync(`${directory}/bin/python3`, ['-c', [
      'import json, sys',
      'from opencc import OpenCC',
      'cc = OpenCC("s2twp")',
      'def convert(value):',
      '    if isinstance(value, str): return cc.convert(value)',
      '    if isinstance(value, list): return [convert(item) for item in value]',
      '    if isinstance(value, dict): return {key: convert(item) for key, item in value.items()}',
      '    return value',
      'json.dump(convert(json.load(sys.stdin)), sys.stdout, ensure_ascii=False)',
    ].join('\n')], { input: JSON.stringify(pack), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    if (converted.status !== 0) throw new Error(`OpenCC conversion failed: ${converted.stderr}`);
    pack = JSON.parse(converted.stdout);
  }
  result[language] = pack;
  console.log(`${language}: ${Object.keys(pack.copy).length} tool copy entries, ${Object.keys(pack.seo).length} SEO entries, ${pack.guides.length} guides.`);
}

await writeFile(`${directory}/madlad-draft.json`, `${JSON.stringify(result)}\n`);
console.log(`Wrote ${Object.keys(result).length} locally translated locale packs to ${directory}/madlad-draft.json`);
