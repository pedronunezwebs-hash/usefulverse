// One-time static drafts; translation is never requested by the published tool.
import { access, writeFile } from 'node:fs/promises';
import { locales } from '../../src/locales.mjs';
import { imageUpscalerEnglishCopy as source } from '../../src/growth600/locales/image-upscaler.en.mjs';

const target = new URL('../../src/growth600/locales/image-upscaler-final.mjs', import.meta.url);
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
function normalize(value) {
  if (typeof value === 'string') return value.replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalize(child)]));
  return value;
}
function boundMetadata(copy) {
  const suffix = ' | UsefulVerse';
  const titlePrefix = copy.title.split('|')[0].trim();
  copy.title = `${titlePrefix.length <= 60 - suffix.length ? titlePrefix : titlePrefix.slice(0, 60 - suffix.length).replace(/\s+\S*$/u, '').trim()}${suffix}`;
  if (copy.description.length > 160) copy.description = `${copy.description.slice(0, 157).replace(/\s+\S*$/u, '')}…`;
}
async function translate(locale, phrases) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); url.searchParams.set('dt', 't');
  const markers = phrases.map((_, index) => `UVZX${String(index).padStart(4, '0')}QXZ`);
  url.searchParams.set('q', phrases.map((phrase, index) => `${phrase} ${markers[index]}`).join('\n'));
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
    const translatedText = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('\n');
    let previousEnd = 0;
    const translated = markers.map((marker) => {
      const markerPosition = translatedText.indexOf(marker, previousEnd);
      if (markerPosition < 0) return '';
      const result = translatedText.slice(previousEnd, markerPosition).replace(/UVZX\d{4}QXZ/gu, '').trim();
      previousEnd = markerPosition + marker.length;
      return result;
    });
    if (!translated.some((value) => !value)) return translated;
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }
  if (phrases.length === 1) {
    const single = new URL('https://translate.googleapis.com/translate_a/single');
    single.searchParams.set('client', 'gtx'); single.searchParams.set('sl', 'en'); single.searchParams.set('tl', locale === 'zh_tw' ? 'zh-TW' : locale); single.searchParams.set('dt', 't'); single.searchParams.set('q', phrases[0]);
    const response = await fetch(single, { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Translation failed for ${locale}: HTTP ${response.status}`);
    const value = ((await response.json())?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
    if (!value) throw new Error(`Empty translation for ${locale}.`);
    return [value];
  }
  const individual = [];
  for (const phrase of phrases) individual.push(...await translate(locale, [phrase]));
  return individual;
}

collect(source);
const phrases = paths.map((path) => path.reduce((parent, key) => parent[key], source));
let result = {};
try { await access(target); result = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; } catch (error) { if (error.code !== 'ENOENT') throw error; }
for (const locale of Object.keys(locales)) {
  if (result[locale]) continue;
  const draft = structuredClone(source);
  if (locale !== 'en') {
    const translated = [];
    for (let start = 0; start < phrases.length; start += 5) translated.push(...await translate(locale, phrases.slice(start, start + 5)));
    paths.forEach((path, index) => setAtPath(draft, path, translated[index]));
  }
  draft.copyLanguage = locale;
  result[locale] = normalize(draft);
  boundMetadata(result[locale]);
  await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
  console.log(`${locale}: ${phrases.length} strings`);
}
result.en = structuredClone(source);
function updateStrings(value) {
  if (typeof value === 'string') return value.replace(/\b19(?=\s*(?:MB|Mo|МБ|МиБ|ميغابايت))/giu, '20');
  if (Array.isArray(value)) return value.map(updateStrings);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, updateStrings(child)]));
  return value;
}
result = updateStrings(result);
Object.assign(result.fr, {
  name: 'Agrandisseur d’image IA',
  title: 'Agrandisseur d’image IA gratuit, 2× | UsefulVerse',
  description: 'Agrandissez gratuitement une image 2× dans votre navigateur, sans compte. Traitement local; limite de 1 MP et vitesse selon l’appareil.',
  intro: 'Créez une nouvelle image deux fois plus grande avec un petit modèle de super-résolution exécuté sur votre appareil. Les détails ajoutés sont estimés.',
  howQuestion: 'Comment agrandir une image en 2× ?',
  howAnswer: 'Choisissez une image PNG, JPEG, WebP, AVIF ou BMP de 1 mégapixel maximum, puis lancez le modèle local. Il traite des tuiles qui se chevauchent, affiche la progression et crée un nouveau PNG en 2×. Au premier lancement, environ 20 Mo de fichiers du modèle et du moteur sont téléchargés dans le cache du navigateur.',
  fields: { ...result.fr.fields, accuracyNote: 'Gratuit, sans frais d’utilisation ni compte. Le modèle utilise le processeur et la mémoire; il peut être lent, surtout sur téléphone. Un ordinateur est recommandé. Le premier téléchargement fait environ 20 Mo. Les zones transparentes deviennent blanches; le PNG est conseillé.' },
});
result.es.title = 'Ampliar imagen con IA gratis, 2× | UsefulVerse';
for (const copy of Object.values(result)) {
  copy.title = copy.title.split('|')[0].trim().length <= 46
    ? `${copy.title.split('|')[0].trim()} | UsefulVerse`
    : `${copy.title.split('|')[0].trim().slice(0, 46).replace(/\s+\S*$/u, '').trim()} | UsefulVerse`;
}
await writeFile(target, `// Static machine-translated drafts. No translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(result)});\n`);
