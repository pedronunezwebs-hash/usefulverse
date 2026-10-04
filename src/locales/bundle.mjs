import { access, readFile } from 'node:fs/promises';
import { locales, packs, pdfOnlyLocales, pdfOnlyPacks, runtimeMessages, runtimeTemplates, ui } from '../locales.mjs';

// Source of /assets/locale-<language>.js: the JSON bundle read by app.js, plus the pack's optional
// runtime.js hook (e.g. numberToWords) appended after it.
export async function localeBundleSource(language) {
  const pack = packs[language] ?? pdfOnlyPacks[language];
  // Runtime translations take precedence over UI translations. Merge once so
  // every page downloads each localized string only once, while keeping the
  // empty runtime object for older tool modules that still read this shape.
  const bundle = {
    code: (locales[language] ?? pdfOnlyLocales[language]).code,
    messages: { ...(ui[language] ?? {}), ...(runtimeMessages[language] ?? {}) },
    runtime: {},
    templates: runtimeTemplates[language] ?? {},
  };
  if (pack) Object.assign(bundle, { tag: pack.meta.tag, config: pack.meta.runtime ?? {} });
  let source = `window.usefulverseLocale = ${JSON.stringify(bundle)};\n`;
  const hook = new URL(`./${language}/runtime.js`, import.meta.url);
  if (pack && await access(hook).then(() => true, () => false)) source += await readFile(hook, 'utf8');
  return source;
}
