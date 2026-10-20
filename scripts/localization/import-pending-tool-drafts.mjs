import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { resolve } from 'node:path';
import pendingCopies from '../../src/growth600/locales/pending-tools-final.mjs';
import { pendingToolEnglishCopy } from '../../src/growth600/locales/pending-tools.en.mjs';

const root = resolve(import.meta.dirname, '../..');
const progressPath = resolve(root, 'docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json');
const outputPath = process.argv[2];
if (!outputPath) throw new Error('Usage: node import-pending-tool-drafts.mjs OUTPUT.jsonl');
const sourceDirectory = resolve(root, process.argv[3] ?? '.translation-data/current-candidate-sources');
await mkdir(sourceDirectory, { recursive: true });
const { tools } = JSON.parse(await readFile(progressPath, 'utf8'));
const candidateIds = tools
  .filter(({ status }) => ['implementation-in-progress', 'implemented'].includes(status))
  .map(({ slug }) => slug);
const localeMap = { pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil' };
const excludedKeys = new Set([
  'copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt',
  'localizationReviewers', 'localizationLastReviewedAt', 'officialNoticeUrl', 'officialFgtsUrl',
]);
const targetLocales = ['es', 'fr', 'pt-BR', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh-CN', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh-TW', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'ha', 'fil', 'ta', 'fa', 'am', 'gu', 'nb-NO', 'te'];
const sharedContextPath = (path) => ['copy.intro', 'copy.howQuestion', 'copy.privacyQuestion', 'copy.privacyAnswer'].includes(path)
  || path.startsWith('copy.actions.') || path.startsWith('copy.messages.');
const locales = Object.keys(pendingCopies).filter((locale) => locale !== 'en');

function collect(value, path, output) {
  if (typeof value === 'string' && value.trim()) {
    output.push({ key: `${path}`, source: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, `${path}.${index}`, output));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (!excludedKeys.has(key)) collect(child, `${path}.${key}`, output);
    }
  }
}

function resolvePath(value, path) {
  return path.split('.').slice(1).reduce((current, part) => {
    if (current === undefined || current === null) return undefined;
    return Array.isArray(current) ? current[Number(part)] : current[part];
  }, value);
}

const stream = createWriteStream(resolve(root, outputPath), { encoding: 'utf8' });
let records = 0;
for (const toolId of candidateIds) {
  const englishCopy = pendingToolEnglishCopy[toolId];
  if (!englishCopy) throw new Error(`${toolId}: canonical English copy is missing`);
  const units = [];
  collect(englishCopy, 'copy', units);
  const sourceUnits = units.map((unit) => ({
    key: `${toolId}.${unit.key}`,
    source: unit.source,
    context: `${sharedContextPath(unit.key) ? 'Shared' : toolId} UI ${unit.key}`,
    locales: targetLocales,
  }));
  await writeFile(resolve(sourceDirectory, `${toolId}.json`), `${JSON.stringify({ toolId, units: sourceUnits }, null, 2)}\n`, 'utf8');
  for (const routeLocale of locales) {
    const copy = pendingCopies[routeLocale]?.[toolId];
    if (!copy) throw new Error(`${toolId}/${routeLocale}: localized draft is missing`);
    const locale = localeMap[routeLocale] ?? routeLocale;
    for (const unit of units) {
      const translation = resolvePath(copy, unit.key);
      if (typeof translation !== 'string' || !translation.trim()) {
        throw new Error(`${toolId}/${routeLocale}/${unit.key}: localized draft string is missing`);
      }
      if (!stream.write(`${JSON.stringify({ locale, key: `${toolId}.${unit.key}`, source: unit.source, translation })}\n`)) {
        await once(stream, 'drain');
      }
      records += 1;
    }
  }
}
stream.end();
await once(stream, 'finish');
console.log(JSON.stringify({ candidateTools: candidateIds.length, localizedRoutes: locales.length, records, outputPath }));
