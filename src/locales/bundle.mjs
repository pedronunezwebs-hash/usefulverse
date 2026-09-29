import { access, readFile } from 'node:fs/promises';
import { locales, packs, runtimeMessages, runtimeTemplates, ui } from '../locales.mjs';

// Source of /assets/locale-<language>.js: the JSON bundle read by app.js, plus the pack's optional
// runtime.js hook (e.g. numberToWords) appended after it.
export async function localeBundleSource(language) {
  const pack = packs[language];
  const bundle = { code: locales[language].code, messages: ui[language], runtime: runtimeMessages[language], templates: runtimeTemplates[language] ?? {} };
  if (pack) Object.assign(bundle, { tag: pack.meta.tag, config: pack.meta.runtime ?? {} });
  let source = `window.usefulverseLocale = ${JSON.stringify(bundle)};\n`;
  const hook = new URL(`./${language}/runtime.js`, import.meta.url);
  if (pack && await access(hook).then(() => true, () => false)) source += await readFile(hook, 'utf8');
  return source;
}
