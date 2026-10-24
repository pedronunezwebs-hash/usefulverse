import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const locales = ['es', 'fr', 'pt-BR', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh-CN', 'bn', 'ru', 'ur', 'tr', 'vi', 'it', 'zh-TW', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'ha', 'fil', 'ta', 'fa', 'am', 'gu', 'nb-NO', 'te'];
const nonTranslatableKeys = new Set([
  'copyLanguage', 'localizationStatus', 'localizationAcceptedBy', 'localizationAcceptedAt',
  'localizationReviewers', 'localizationLastReviewedAt', 'officialNoticeUrl', 'officialFgtsUrl',
  'relatedTools', 'outputName',
]);
const sharedContextPath = (path) => ['copy.intro', 'copy.howQuestion', 'copy.privacyQuestion', 'copy.privacyAnswer'].includes(path)
  || path.startsWith('copy.actions.') || path.startsWith('copy.messages.');
export function extractToolCopyUnits(sourceCopy, toolId) {
  if (!sourceCopy || typeof sourceCopy !== 'object' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(toolId)) throw new Error('Invalid source copy or tool ID');
  const units = [];
  function visit(value, path = 'copy') {
    if (typeof value === 'string' && value.trim()) {
      units.push({ key: `${toolId}.${path}`, source: value, context: `${sharedContextPath(path) ? 'Shared' : toolId} UI ${path}`, locales });
    } else if (Array.isArray(value)) value.forEach((item, index) => visit(item, `${path}.${index}`));
    else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) {
      if (!nonTranslatableKeys.has(key)) visit(item, `${path}.${key}`);
    }
  }
  visit(sourceCopy);
  if (!units.length) throw new Error(`No strings were extracted for ${toolId}`);
  return { toolId, sourceCopy, units };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const [, , modulePath, exportName, toolId, outputPath] = process.argv;
  if (!modulePath || !exportName || !toolId || !outputPath) throw new Error('Usage: node extract-tool-copy-units.mjs SOURCE_MODULE EXPORT_NAME TOOL_ID OUTPUT.json');
  const module = await import(pathToFileURL(resolve(modulePath)).href);
  const document = extractToolCopyUnits(module[exportName]?.[toolId], toolId);
  await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
  console.log(`Extracted ${document.units.length} stable strings for ${toolId} across ${locales.length + 1} product locales.`);
}
