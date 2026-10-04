import { readFile, writeFile } from 'node:fs/promises';
import { opportunityTools } from '../../src/opportunity-tools.mjs';
import { opportunityLocaleData as existingOpportunityLocaleData } from '../../src/locales/opportunity-tools.mjs';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR;
if (!directory) throw new Error('Set USEFULVERSE_TRANSLATION_DIR to the isolated temporary translation directory.');
const input = JSON.parse(await readFile(directory + '/draft-input.json', 'utf8'));
const rows = (await readFile(directory + '/google-translate-output.jsonl', 'utf8')).trim().split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
const result = {};
const leakedRow = /(?:UVR|УВР|یو\s*وی\s*آر|\d{8})/u;
for (const [language, target] of Object.entries(input.targets)) {
  const translated = new Map(rows.filter((row) => row.language === language).map((row) => [row.unitId, row.translation]));
  const expected = Object.keys(target.units);
  const missing = expected.filter((key) => !translated.has(key));
  if (missing.length) throw new Error(language + ' is missing ' + missing.length + ' translations: ' + missing.slice(0, 8).join(', '));
  const ui = {};
  const copy = {};
  for (const [unitId, source] of Object.entries(target.units)) {
    const rawValue = translated.get(unitId)
      .replace(/\s+Enviar comentarios Paneles laterales Historial Guardadas Resultados de traducción disponibles[\s\S]*$/u, '')
      .trim();
    // The free Google Translate UI sometimes appends the next row's marker and
    // translation to an RTL result. Keep only the current row, never publish a
    // sentinel or another field's copy as part of this translation.
    const value = rawValue.split(/\r?\n/u).filter((line) => !leakedRow.test(line)).join(' ').trim() || source;
    if (unitId.startsWith('ui.')) ui[source] = value;
    else {
      const [, id, property] = unitId.split('.');
      (copy[id] ??= {})[property] = value;
    }
  }
  const selectedIds = process.env.USEFULVERSE_TRANSLATION_TOOL_IDS?.split(',').filter(Boolean);
  const selectedTools = selectedIds ? opportunityTools.filter((tool) => selectedIds.includes(tool.id)) : opportunityTools;
  for (const tool of selectedTools) {
    const values = copy[tool.id];
    const fields = ['title', 'shortTitle', 'description', 'keywords', 'intro', 'body'];
    if (!values || fields.some((key) => !values[key])) throw new Error('Incomplete translated copy: ' + language + '/' + tool.id);
    copy[tool.id] = fields.map((key) => values[key]);
  }
  for (const id of Object.keys(copy)) if (!selectedTools.some((tool) => tool.id === id)) delete copy[id];
  result[language] = selectedIds
    ? { ui: { ...(existingOpportunityLocaleData[language]?.ui ?? {}), ...ui }, copy: { ...(existingOpportunityLocaleData[language]?.copy ?? {}), ...copy } }
    : { ui, copy };
}
const output = 'export const opportunityLocaleData = ' + JSON.stringify(result) + ';\n';
await writeFile(new URL('../../src/locales/opportunity-tools.mjs', import.meta.url), output);
console.log('Compiled ' + Object.keys(result).length + ' language packs for ' + opportunityTools.length + ' tools.');
