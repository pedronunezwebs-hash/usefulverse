// Generate static Google Translate drafts once; the published site never calls this service.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import { torqueCalculatorEnglishCopy as source } from '../../src/growth600/locales/torque-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/torque-calculator.mjs', import.meta.url);
const separator = '@@@TORQUESEP@@@';
const localeCodes = { zh_tw: 'zh-TW', zh: 'zh-CN' };
const run = promisify(execFile);
const faqsOnly = process.argv.includes('--faqs-only');
const protectedPattern = /UsefulVerse|τ\s*=\s*r\s*×\s*F\s*×\s*sin\(θ\)|N·m|kN·m|lb·ft|lb·in|\b(?:lbf|kN|N|RPM)\b/gu;

function collect(value, path = [], rows = []) {
  if (typeof value === 'string') {
    if (!['copyLanguage'].includes(path.at(-1))) rows.push({ path, source: value });
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(item, [...path, String(index)], rows));
  else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) collect(child, [...path, key], rows);
  return rows;
}

function setAtPath(object, path, value) {
  let parent = object;
  for (const part of path.slice(0, -1)) parent = Array.isArray(parent) ? parent[Number(part)] : parent[part];
  if (Array.isArray(parent)) parent[Number(path.at(-1))] = value;
  else parent[path.at(-1)] = value;
}

function mask(text) {
  const replacements = [];
  const masked = text.replace(protectedPattern, (value) => {
    const token = `UVKEEP${String(replacements.length).padStart(4, '0')}X`;
    replacements.push([token, value]);
    return token;
  });
  return { masked, replacements };
}

function restore(text, replacements) {
  let result = text;
  for (const [token, value] of replacements) {
    if (result.split(token).length !== 2) throw new Error(`Google Translate changed protected marker ${token}.`);
    result = result.replace(token, value);
  }
  return result.trim();
}

async function request(locale, rows) {
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', localeCodes[locale] ?? locale.replace('_', '-')); url.searchParams.set('dt', 't');
  url.searchParams.set('q', rows.map((row) => row.text).join(`\n${separator}\n`));
  const { stdout } = await run('curl', ['-fsS', '--connect-timeout', '5', '--max-time', '30', '--retry', '3', '--retry-delay', '2', '--retry-all-errors', url.href], { maxBuffer: 2 * 1024 * 1024, timeout: 120_000 });
  const body = JSON.parse(stdout);
  return Array.isArray(body?.[0]) ? body[0].map((part) => part?.[0] ?? '').join('') : '';
}

async function translateBatch(locale, rows) {
  const translated = await request(locale, rows);
  const values = translated.split(`\n${separator}\n`);
  if (values.length === rows.length) return values.map((value, index) => restore(value, rows[index].replacements));
  if (rows.length === 1) return [rows[0].source];
  const middle = Math.ceil(rows.length / 2);
  return [...await translateBatch(locale, rows.slice(0, middle)), ...await translateBatch(locale, rows.slice(middle))];
}

function normalize(copy) {
  const suffix = ' | UsefulVerse';
  const maxPrefix = 60 - [...suffix].length;
  let prefix = [...String(copy.title).split('|', 1)[0].trim()].slice(0, maxPrefix).join('').trimEnd();
  if ([...String(copy.title).split('|', 1)[0].trim()].length > maxPrefix) prefix = prefix.slice(0, Math.max(0, prefix.lastIndexOf(' '))).trimEnd();
  copy.title = `${prefix}${suffix}`;
  if ([...copy.description].length > 160) copy.description = `${[...copy.description].slice(0, 157).join('').replace(/\s+\S*$/u, '')}...`;
  return copy;
}

function improve(copy, locale) {
  if (locale === 'es') Object.assign(copy, {
    name: 'Calculadora de torque', title: 'Calculadora de torque gratis | UsefulVerse',
    description: 'Calcula el torque con fuerza, brazo y ángulo, o despeja la fuerza o distancia. Gratis, sin límites y en tu navegador.',
    intro: 'Calcula el efecto de giro de una fuerza en una palanca. Usa la fuerza, la distancia y el ángulo, o despeja el dato que falta.',
    howQuestion: '¿Cómo se calcula el torque?',
    howAnswer: 'Multiplica la fuerza por el brazo de momento perpendicular al pivote. Si la fuerza está inclinada, usa τ = r × F × sin(θ).',
    fields: { ...copy.fields,
      torque: 'Torque', torqueUnit: 'Unidad de torque', solveTorque: 'Calcular torque con fuerza y brazo', solveForce: 'Despejar fuerza con torque y brazo', solveArm: 'Despejar brazo con torque y fuerza',
      arm: 'Distancia del pivote al punto donde se aplica la fuerza', clockwise: 'En sentido horario', counterclockwise: 'En sentido antihorario',
      accuracyNote: 'Modelo: τ = r × F × sin(θ), donde r es la distancia del pivote al punto donde se aplica la fuerza. El ángulo va de 0° a 180°. Es un cálculo ideal; no sirve para diseñar estructuras, elevación, vehículos ni tomar decisiones de seguridad.',
    },
    actions: { ...copy.actions, calculate: 'Calcular torque', result: 'Resultado' },
    messages: { ...copy.messages, torque: 'Torque', direction: 'Sentido de giro', force: 'Fuerza', arm: 'Brazo de momento', perpendicularForce: 'Componente perpendicular de la fuerza', momentArm: 'Brazo de momento perpendicular' },
    additionalFaqs: [
      { question: '¿Qué es el brazo de momento?', answer: 'Es la distancia perpendicular desde el pivote hasta la línea de fuerza. Se obtiene como r × sin(θ).' },
      { question: '¿Qué ángulo produce más torque?', answer: '90° produce el máximo para la misma fuerza y brazo. A 0° o 180°, el torque es cero en este modelo.' },
      { question: '¿Puedo calcular la fuerza o el brazo?', answer: 'Sí. Elige qué valor quieres calcular, introduce el torque y el otro valor conocido, y deja vacío el campo que quieres despejar.' },
    ],
  });
  return copy;
}

const sourceRows = collect(source);
const copies = { en: normalize({ ...structuredClone(source), localizationStatus: 'approved' }) };
let existingCopies = {};
if (faqsOnly) {
  try { existingCopies = { ...(await import(`${target.href}?resume=${Date.now()}`)).default }; }
  catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
}
for (const locale of Object.keys(locales)) {
  if (locale === 'en') continue;
  const copy = structuredClone(existingCopies[locale] ?? source);
  const rowsToTranslate = faqsOnly ? sourceRows.filter((row) => row.path[0] === 'additionalFaqs') : sourceRows;
  const groups = [];
  let group = []; let length = 0;
  for (const row of rowsToTranslate) {
    const masked = mask(row.source);
    const item = { ...row, text: masked.masked, replacements: masked.replacements };
    const size = [...item.text].length + [...separator].length + 2;
    if (group.length && length + size > 2_700) { groups.push(group); group = []; length = 0; }
    group.push(item); length += size;
  }
  if (group.length) groups.push(group);
  for (const rows of groups) {
    const results = await translateBatch(locale, rows);
    rows.forEach((row, index) => setAtPath(copy, row.path, results[index] || row.source));
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
  copy.copyLanguage = locale;
  copy.localizationStatus = 'machine-accepted';
  copy.localizationAcceptedBy = 'site-owner';
  copy.localizationAcceptedAt = '2026-10-09';
  copies[locale] = normalize(improve(copy, locale));
  console.log(`${locale}: ${rowsToTranslate.length} strings translated`);
}

for (const locale of Object.keys(locales)) {
  const copy = copies[locale];
  if (!copy || copy.copyLanguage !== locale || !copy.additionalFaqs?.length || [...copy.title].length > 60 || [...copy.description].length > 160) {
    throw new Error(`Incomplete localized copy for ${locale}.`);
  }
}

await writeFile(target, `// Static machine-translated drafts; no translation service is called on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
console.log(`Wrote ${Object.keys(copies).length} static locale copies to ${target.pathname}`);
