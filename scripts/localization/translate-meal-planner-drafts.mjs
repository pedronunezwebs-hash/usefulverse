// One-time free machine-translation drafts. This script is not part of the site or build.
import { writeFile } from 'node:fs/promises';
import { packs } from '../../src/locales.mjs';
import { mealPlannerEnglishCopy, mealPlannerEnglishSources, mealPlannerUiKeys } from '../../src/locales/meal-planner-source.mjs';

const targets = Object.fromEntries(Object.entries(packs).map(([key, pack]) => [key, pack.meta.code]));
Object.assign(targets, { es: 'es', fr: 'fr', pt: 'pt-BR', de: 'de' });
const data = {};

for (const [language, locale] of Object.entries(targets)) {
  const q = mealPlannerEnglishSources.map((source, index) => `UVROW${String(index + 1).padStart(3, '0')}X|${source}`).join('\n');
  const query = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q });
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`);
  if (!response.ok) throw new Error(`Translation failed for ${language}: HTTP ${response.status}`);
  const payload = await response.json();
  const output = new Map();
  for (const segments of payload[0] ?? []) {
    const text = segments?.[0] ?? '';
    for (const match of text.matchAll(/UVROW(\d{3})X\s*\|?\s*([\s\S]*?)(?=UVROW\d{3}X|$)/gu)) {
      const index = Number(match[1]) - 1;
      if (!output.has(index)) output.set(index, match[2].trim());
    }
  }
  const translated = mealPlannerEnglishSources.map((source, index) => output.get(index) || source);
  const ui = Object.fromEntries(mealPlannerUiKeys.map((key, index) => [key, translated[index]]));
  const copyStart = mealPlannerUiKeys.length;
  data[language] = { ui, copy: translated.slice(copyStart, copyStart + mealPlannerEnglishCopy.length) };
  console.log(`${language}: ${translated.length}/${mealPlannerEnglishSources.length} strings`);
}

await writeFile(new URL('../../src/locales/meal-planner.mjs', import.meta.url), `// Static machine-translation drafts; the live site never calls a translation service.\nexport const mealPlannerLocaleData = ${JSON.stringify(data)};\n`);
