// One-time static Google Translate drafts; no translation service runs on the published site.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { kineticEnergyCalculatorEnglishCopy as source } from '../../src/growth600/locales/kinetic-energy-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/kinetic-energy-calculator.mjs', import.meta.url);
const paths = [];
function collect(value, path = []) {
  if (typeof value === 'string') { if (path.at(-1) !== 'copyLanguage') paths.push(path); }
  else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)]));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key]);
}
function setAtPath(targetObject, path, value) {
  let parent = targetObject;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}
function targetCode(locale) { return locale === 'zh_tw' ? 'zh-TW' : locale === 'pt' ? 'pt' : locale; }
function normalize(copy, locale) {
  const suffix = ' | UsefulVerse';
  if (locale !== 'en') copy.title = `${copy.name.slice(0, 60 - suffix.length)}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
  return copy;
}
collect(source);

async function translate(locale, phrases, start) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCode(locale)); url.searchParams.set('dt', 't');
  const formulas = ['KE = ½mv²', 'PE = mgh', 'v = √(2KE/m)', '9.80665 m/s²'];
  const rows = phrases.map((phrase, index) => {
    let text = phrase;
    const restore = [];
    for (const [formulaIndex, formula] of formulas.entries()) {
      const token = `UVFORM${formulaIndex}X`;
      if (text.includes(formula)) { text = text.replaceAll(formula, token); restore.push([token, formula]); }
    }
    return { marker: `987654${String(start + index).padStart(4, '0')}456789`, text, restore };
  });
  url.searchParams.set('q', rows.map(({ marker, text }) => `${marker} ${text}`).join('\n'));
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Translation request failed: ${locale}, HTTP ${response.status}`);
      const translated = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
      return rows.map(({ marker, restore }, index) => {
        const position = translated.indexOf(marker);
        const begin = position < 0 ? -1 : position + marker.length;
        const next = rows.slice(index + 1).map(({ marker: nextMarker }) => translated.indexOf(nextMarker, Math.max(begin, 0))).find((candidate) => candidate >= 0) ?? translated.length;
        let value = begin < 0 ? '' : translated.slice(begin, next).trim();
        for (const [token, formula] of restore) value = value.replaceAll(token, formula);
        if (!value) { console.warn(`Google Translate omitted one segment; keeping the clear source sentence (${locale}/${start + index}).`); value = phrases[index]; }
        if (!value) throw new Error(`Missing translation ${locale}/${start + index}`);
        return value;
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

let result = {};
try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
async function checkpoint() { await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`); }
for (const locale of Object.keys(locales)) {
  if (result[locale]) continue;
  const draft = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 8) translated.push(...await translate(locale, phrases.slice(start, start + 8), start));
    paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
    draft.localizationStatus = 'machine-accepted';
    draft.localizationAcceptedBy = 'site-owner';
    draft.localizationAcceptedAt = '2026-10-08';
  } else draft.localizationStatus = 'approved';
  draft.copyLanguage = locale;
  result[locale] = normalize(draft, locale);
  await checkpoint();
  console.log(`${locale}: ${paths.length} strings`);
}
if (result.mr) {
  result.mr.fields.velocityMps = 'गती (m/s)';
  result.mr.fields.kineticEnergyJ = 'गतिज ऊर्जा (J)';
}
await checkpoint();
console.log(`Wrote ${Object.keys(result).length} locale drafts (${paths.length} strings each).`);
