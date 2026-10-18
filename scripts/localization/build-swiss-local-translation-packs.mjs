import { readdir, readFile, writeFile } from 'node:fs/promises';
import { pipeline, env } from '@huggingface/transformers';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { swissPillar3aEnglish } from '../../src/markets-no-ch/swiss-pillar-3a-copy-en.mjs';
import { swissBvgPensionEnglish } from '../../src/markets-no-ch/swiss-bvg-pension-copy-en.mjs';
import { swissPensionWithdrawalEnglish } from '../../src/markets-no-ch/swiss-pension-withdrawal-copy-en.mjs';
import { swissHealthDeductibleEnglish } from '../../src/markets-no-ch/swiss-health-deductible-copy-en.mjs';
import { swissRentAdjustmentEnglish } from '../../src/markets-no-ch/swiss-rent-adjustment-copy-en.mjs';
import { swissWheelOffsetEnglish } from '../../src/markets-no-ch/swiss-wheel-offset-copy-en.mjs';
import { petAgeEnglish } from '../../src/markets-no-ch/pet-age-copy-en.mjs';

const modelId = 'Kutalia/madlad400-3b-mt-onnx';
const cacheDir = '/private/tmp/usefulverse-madlad-cache';
const progressPath = '/private/tmp/usefulverse-swiss-local-translation-progress.json';
const fallbackPath = '/private/tmp/usefulverse-swiss-local-translation-fallbacks.json';
const localeTargets = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en');
const modelLanguage = (key) => ({ zh_tw: 'zh_Hant', tl: 'fil', nb: 'no' })[key] ?? key;
const shortAnswers = {
  no: { es: 'No.', fr: 'Non.', pt: 'Não.', de: 'Nein.', ja: 'いいえ。', ko: '아니요.', id: 'Tidak.', hi: 'नहीं।', ar: 'لا.', zh: '不。', bn: 'না।', ru: 'Нет.', ur: 'نہیں۔', tr: 'Hayır.', vi: 'Không.', it: 'No.', zh_tw: '不。', bg: 'Не.', ca: 'No.', nl: 'Nee.', el: 'Όχι.', ms: 'Tidak.', pl: 'Nie.', sv: 'Nej.', th: 'ไม่ใช่', uk: 'Ні.', sw: 'Hapana.', mr: 'नाही.', te: 'కాదు.', ha: 'A’a.', tl: 'Hindi.', ta: 'இல்லை.', fa: 'نه.', am: 'አይደለም።', gu: 'ના।', nb: 'Nei.' },
  yes: { es: 'Sí.', fr: 'Oui.', pt: 'Sim.', de: 'Ja.', ja: 'はい。', ko: '예.', id: 'Ya.', hi: 'हाँ।', ar: 'نعم.', zh: '是。', bn: 'হ্যাঁ।', ru: 'Да.', ur: 'ہاں۔', tr: 'Evet.', vi: 'Có.', it: 'Sì.', zh_tw: '是。', bg: 'Да.', ca: 'Sí.', nl: 'Ja.', el: 'Ναι.', ms: 'Ya.', pl: 'Tak.', sv: 'Ja.', th: 'ใช่', uk: 'Так.', sw: 'Ndiyo.', mr: 'होय.', te: 'అవును.', ha: 'Eh.', tl: 'Oo.', ta: 'ஆம்.', fa: 'بله.', am: 'አዎ።', gu: 'હા।', nb: 'Ja.' },
};
const noSpacingLocales = new Set(['ja', 'zh', 'zh_tw', 'th']);
const normalizePackCopy = (source, translated, locale) => {
  let value = translated;
  const answer = /^(No|Yes)\.(?=\s)/u.exec(source)?.[1]?.toLowerCase();
  if (answer) {
    const boundary = /[.!?。！？](?:\s|$)/u.exec(value);
    if (boundary) {
      const rest = value.slice(boundary.index + boundary[0].length).trimStart();
      value = rest ? `${shortAnswers[answer][locale]} ${rest}` : shortAnswers[answer][locale];
    }
  }
  if (!noSpacingLocales.has(locale)) value = value.replace(/([.!?;:,،؛])(?=[\p{L}])/gu, '$1 ');
  return value;
};
const collect = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => collect(entry, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((entry) => collect(entry, output));
  return output;
};
const tools = [
  ['swiss-pillar-3a', swissPillar3aEnglish, 'swissPillar3aTranslationsByLocale'],
  ['swiss-bvg-pension', swissBvgPensionEnglish, 'swissBvgPensionTranslationsByLocale'],
  ['swiss-pension-withdrawal', swissPensionWithdrawalEnglish, 'swissPensionWithdrawalTranslationsByLocale'],
  ['swiss-health-deductible', swissHealthDeductibleEnglish, 'swissHealthDeductibleTranslationsByLocale'],
  ['swiss-rent-adjustment', swissRentAdjustmentEnglish, 'swissRentAdjustmentTranslationsByLocale'],
  ['swiss-wheel-offset', swissWheelOffsetEnglish, 'swissWheelOffsetTranslationsByLocale'],
  ['pet-age', petAgeEnglish, 'petAgeTranslationsByLocale'],
];
const progress = {};
const fallbacks = [];
try { fallbacks.push(...JSON.parse(await readFile(fallbackPath, 'utf8'))); } catch {}
try { Object.assign(progress, JSON.parse(await readFile(progressPath, 'utf8'))); } catch {}

// Salvage completed batches from the previous free-service checkpoints, then
// reuse exact-match static phrases from the existing translation corpus.
for (const [slug] of tools) {
  const legacyPath = `/private/tmp/usefulverse-${slug}-translations-progress.json`;
  try { Object.assign(progress[slug] ??= {}, JSON.parse(await readFile(legacyPath, 'utf8'))); } catch {}
}
const shared = Object.fromEntries(localeTargets.map(({ key }) => [key, { ...(translationsByLocale[key] ?? {}) }]));
for (const file of (await readdir(new URL('../../src/markets-no-ch/', import.meta.url))).filter((name) => name.endsWith('-translations.mjs'))) {
  try {
    const module = await import(new URL(`../../src/markets-no-ch/${file}`, import.meta.url));
    for (const value of Object.values(module)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      for (const [locale, dictionary] of Object.entries(value)) {
        if (!shared[locale] || !dictionary || typeof dictionary !== 'object' || Array.isArray(dictionary)) continue;
        for (const [source, translated] of Object.entries(dictionary)) {
          if (typeof translated === 'string' && translated.trim() && source !== translated) shared[locale][source] ??= translated;
        }
      }
    }
  } catch {}
}

env.cacheDir = cacheDir;
let translator;
const getTranslator = async () => {
  if (!translator) translator = await pipeline('translation', modelId, { device: 'cpu', dtype: 'q8' });
  return translator;
};
const protectedPattern = /(?<![\p{L}\p{N}])(?:CHF|\d+(?:[.,'’]\d+)*(?:%|a)?)(?![\p{L}\p{N}])/giu;
const protectedTokens = (text) => text.match(protectedPattern) ?? [];
const allNumericTokens = (text) => text.match(/CHF|\d+(?:[.,'’]\d+)*(?:%|a)?/giu) ?? [];
const sortedTokens = (tokens) => [...tokens].sort().join('|');
const numberWordValues = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10' };
const protectedValuesMatch = (source, translated, expected) => {
  // Some scripts (notably Japanese) attach letters directly to numerals.
  const actual = allNumericTokens(translated);
  const extras = [...actual];
  for (const value of expected) {
    const index = extras.indexOf(value);
    if (index >= 0) extras.splice(index, 1);
  }
  const allowed = Object.entries(numberWordValues)
    .flatMap(([word, value]) => Array.from(source.matchAll(new RegExp(`\\b${word}\\b`, 'giu'))).map(() => value));
  for (const value of allowed) {
    const index = extras.indexOf(value);
    if (index >= 0) extras.splice(index, 1);
  }
  return extras.length === 0 && expected.every((value) => actual.includes(value));
};
const translationQualityIssue = (source, translated, locale = '') => {
  if (source === translated) return null;
  if (/([\p{L}]{1,3})\1{5,}/u.test(translated)) return 'The local model emitted repeated letter fragments.';
  if (/[!?.,،؛:！？。…]{6,}/u.test(translated)) return 'The local model emitted a punctuation loop.';
  if (/(?:[\p{L}\p{M}]{1,4}[.!?。！？]\s*){6,}/u.test(translated)) return 'The local model emitted a loop of short punctuated fragments.';
  if (/(?:^|[^\p{L}\p{N}])(\p{L}{2,})(?:[^\p{L}\p{N}]+\1){3,}/iu.test(translated)) return 'The local model repeated a word several times.';
  const words = translated.match(/[\p{L}\p{N}]+/gu) ?? [];
  const shortWords = words.filter((word) => Array.from(word).length <= 2).length;
  if (words.length >= 18 && shortWords / words.length > 0.45) return 'The local model emitted an implausible run of tiny words.';
  if (/[^\s\p{P}\p{N}]{32,}/u.test(translated) && !noSpacingLocales.has(locale)) return 'The local model emitted an implausibly long unspaced word.';
  if (/\b[A-Za-z]{28,}\b/u.test(translated)) return 'The local model emitted an implausibly long Latin token.';
  if (translated.length > Math.max(180, source.length * 2.5)) return 'The local model output was implausibly longer than the source.';
  return null;
};
const progressCount = (dict, sources) => sources.filter((source) => typeof dict[source] === 'string' && dict[source].trim()).length;
const splitTranslationSegments = (source) => {
  const sentences = source.match(/[^.!?]+[.!?]+(?:[”’"')\]]*)|[^.!?]+$/gu) ?? [source];
  const clauses = sentences.flatMap((sentence) => {
    const pieces = sentence.split(/([,;])(?=\s)/u);
    const clauses = [];
    for (let index = 0; index < pieces.length; index += 2) clauses.push(`${pieces[index]}${pieces[index + 1] ?? ''}`);
    return clauses;
  });
  return clauses.flatMap((clause) => {
    const chunks = [];
    let remaining = clause.trim();
    while (remaining.length > 160) {
      let boundary = remaining.lastIndexOf(' ', 160);
      if (boundary < 80) boundary = 160;
      chunks.push(remaining.slice(0, boundary).trim());
      remaining = remaining.slice(boundary).trim();
    }
    if (remaining) chunks.push(remaining);
    return chunks;
  });
};
const translateSegmentsBatch = async (segments, slug, key, contextSource) => {
  const activeTranslator = await getTranslator();
  const prepared = segments.map((segment) => {
    const tokens = protectedTokens(segment);
    let tokenIndex = 0;
    const protectedSource = segment.replace(protectedPattern, () => `<x${tokenIndex++}>`);
    return { segment, tokens, protectedSource };
  });
  const output = await activeTranslator(prepared.map(({ protectedSource }) => `<2${modelLanguage(key)}> ${protectedSource}`), {
    // Short source phrases must not leave the decoder dozens of spare tokens:
    // the 3B model otherwise sometimes appends unrelated text after a good
    // translation. Chunks are capped at 160 source characters above.
    max_new_tokens: Math.min(160, Math.max(32, ...segments.map((segment) => Math.ceil(segment.length * 0.9 + 8)))),
    num_beams: 1,
    do_sample: false,
    no_repeat_ngram_size: 3,
    repetition_penalty: 1.2,
  });
  if (!Array.isArray(output) || output.length !== prepared.length) throw new Error(`${slug}/${key}: translation batch returned an unexpected number of results.`);
  const fallbackCount = fallbacks.length;
  const results = await Promise.all(prepared.map(async ({ segment, tokens, protectedSource }, resultIndex) => {
    let translated = output[resultIndex]?.translation_text?.trim();
    if (!translated) throw new Error(`${slug}/${key}: missing translation output: ${contextSource}`);
    const recordFallback = async (reason, warning) => {
      fallbacks.push({ tool: slug, locale: key, source: segment, reason });
      console.warn(`${slug}/${key}: keeping this source-language clause ${warning}.`);
      return segment;
    };
    if (!tokens.length && translated === protectedSource) return recordFallback('The local model returned this clause unchanged.', 'unchanged and recording it for review');
    for (let index = 0; index < tokens.length; index += 1) {
      const fullWidthIndex = String(index).replace(/[0-9]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) + 0xFEE0));
      const marker = new RegExp(`[<＜][xｘ](?:${index}|${fullWidthIndex})[>＞]`, 'iu');
      if (!marker.test(translated)) {
        if (tokens[index].toLowerCase() === '3a' || tokens[index] === 'CHF') translated += ` (${tokens[index]})`;
        else return recordFallback(`The local model dropped the protected value ${tokens[index]}.`, `verbatim because the model dropped ${tokens[index]}`);
      } else translated = translated.replace(marker, tokens[index]);
    }
    if (!protectedValuesMatch(segment, translated, tokens)) return recordFallback(`The local model changed protected values (${JSON.stringify(tokens)} → ${JSON.stringify(allNumericTokens(translated))}).`, 'verbatim because the model altered a protected value');
    const qualityIssue = translationQualityIssue(segment, translated, key);
    if (qualityIssue) return recordFallback(qualityIssue, 'verbatim because the translation-quality check failed');
    return translated;
  }));
  if (fallbacks.length > fallbackCount) await writeFile(fallbackPath, JSON.stringify(fallbacks, null, 2));
  return results;
};

for (const [slug, english, exportName] of tools) {
  const sources = [...new Set(collect(english))];
  const packs = progress[slug] ??= {};
  for (const { key } of localeTargets) {
    const dictionary = packs[key] ?? {};
    const pending = [];
    for (const source of sources) {
      if (typeof dictionary[source] === 'string' && dictionary[source].trim()) {
        if (!translationQualityIssue(source, dictionary[source], key)) continue;
        delete dictionary[source];
      }
      const reusable = slug === 'swiss-health-deductible' || slug === 'swiss-rent-adjustment' ? undefined : shared[key]?.[source];
      if (reusable) { dictionary[source] = reusable; continue; }
      pending.push({ source, segments: splitTranslationSegments(source), translated: [] });
    }
    const pendingSegments = pending.flatMap((entry, sourceIndex) => entry.segments.map((segment, segmentIndex) => ({ sourceIndex, segmentIndex, segment, source: entry.source })));
    for (let index = 0; index < pendingSegments.length; index += 4) {
      const batch = pendingSegments.slice(index, index + 4);
      const outputs = await translateSegmentsBatch(batch.map(({ segment }) => segment), slug, key, batch[0].source);
      batch.forEach(({ sourceIndex, segmentIndex }, outputIndex) => { pending[sourceIndex].translated[segmentIndex] = outputs[outputIndex]; });
      for (const entry of pending) if (entry.translated.length === entry.segments.length && !Object.hasOwn(dictionary, entry.source)) dictionary[entry.source] = entry.translated.join(noSpacingLocales.has(key) ? '' : ' ');
      packs[key] = dictionary;
      if (progressCount(dictionary, sources) % 4 === 0) await writeFile(progressPath, JSON.stringify(progress));
    }
    packs[key] = dictionary;
    await writeFile(progressPath, JSON.stringify(progress));
    console.log(`${slug}: ${key} ${progressCount(dictionary, sources)}/${sources.length}`);
  }
  for (const { key } of localeTargets) {
    const dictionary = packs[key];
    const missing = sources.filter((source) => typeof dictionary?.[source] !== 'string' || !dictionary[source].trim());
    if (missing.length) throw new Error(`${slug}/${key}: ${missing.length} strings remain untranslated.`);
    for (const source of sources) {
      const qualityIssue = translationQualityIssue(source, dictionary[source], key);
      if (qualityIssue) {
        fallbacks.push({ tool: slug, locale: key, source, reason: qualityIssue });
        console.warn(`${slug}/${key}: keeping a source-language clause because it failed the translation-quality check.`);
        dictionary[source] = source;
      }
      dictionary[source] = normalizePackCopy(source, dictionary[source], key);
    }
    await writeFile(progressPath, JSON.stringify(progress));
  }
  const ordered = Object.fromEntries(localeTargets.map(({ key }) => [key, packs[key]]));
  const exportSource = `// Static draft translations generated locally with Apache-2.0 MADLAD-400; no service runs for visitors. Native review remains required before publication.\nexport const ${exportName} = Object.freeze(${JSON.stringify(ordered)});\n`;
  await writeFile(new URL(`../../src/markets-no-ch/${slug}-translations.mjs`, import.meta.url), exportSource);
  console.log(`${slug}: complete ${sources.length} strings × ${localeTargets.length} locales + English.`);
}
await writeFile(progressPath, JSON.stringify(progress));
const uniqueFallbacks = [...new Map(fallbacks.map((item) => [JSON.stringify(item), item])).values()];
await writeFile(fallbackPath, JSON.stringify(uniqueFallbacks, null, 2));
console.log(`All configured local translation packs cover ${localeTargets.length} non-English locales.`);
