// One-time static Google Translate draft completion for method labels.
import { writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { locales } from '../../src/locales.mjs';
import copiesDefault from '../../src/growth600/locales/wilcoxon-signed-rank-test-calculator.mjs';
import { wilcoxonSignedRankEnglishCopy as source } from '../../src/growth600/locales/wilcoxon-signed-rank-test-calculator.en.mjs';

const target = new URL('../../src/growth600/locales/wilcoxon-signed-rank-test-calculator.mjs', import.meta.url);
const run = promisify(execFile);
const targetCodes = { zh_tw: 'zh-TW', pt_br: 'pt', zh: 'zh-CN' };
const phrases = [source.fields.methodExact, source.fields.methodApproximation, source.fields.methodNotAvailable];
const copies = { ...copiesDefault, en: source };
for (const key of Object.keys(locales)) {
  if (key === 'en') continue;
  const url = new URL('https://translate.google.com/translate_a/single');
  url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', targetCodes[key] ?? key.replace('_', '-')); url.searchParams.set('dt', 't'); url.searchParams.set('q', phrases.join('\n###METHOD###\n'));
  const { stdout } = await run('curl', ['-fsS', url.href], { maxBuffer: 1024 * 1024 });
  const body = JSON.parse(stdout);
  let translated = (body?.[0] ?? []).map((part) => part?.[0] ?? '').join('').split('\n###METHOD###\n');
  if (translated.length !== phrases.length || translated.some((text) => !text.trim())) {
    translated = [];
    for (const phrase of phrases) {
      const singleUrl = new URL(url);
      singleUrl.searchParams.set('q', phrase);
      const { stdout: single } = await run('curl', ['-fsS', singleUrl.href], { maxBuffer: 1024 * 1024 });
      const singleBody = JSON.parse(single);
      const value = (singleBody?.[0] ?? []).map((part) => part?.[0] ?? '').join('').trim();
      if (!value) throw new Error(`Could not translate a method label for ${key}.`);
      translated.push(value);
    }
  }
  copies[key] = { ...copies[key], fields: { ...copies[key].fields, methodExact: translated[0].trim(), methodApproximation: translated[1].trim(), methodNotAvailable: translated[2].trim() } };
  if (key === 'ar') copies[key] = { ...copies[key], fields: { ...copies[key].fields, methodExact: 'توزيع دقيق ثنائي الطرف لقلب الإشارة باستخدام متوسط الرتب', methodApproximation: 'تقريب طبيعي ثنائي الطرف مع تصحيح الاستمرارية', methodNotAvailable: 'لا توجد فروق غير صفرية بين القياسات' } };
  console.log(`${key}: method labels`);
}
await writeFile(target, `// Static machine-translated drafts; no translation service runs on the published site.\nexport default Object.freeze(${JSON.stringify(copies)});\n`);
