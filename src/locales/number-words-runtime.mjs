import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { numberWordsLocaleCodes } from '../locales.mjs';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const runtimeCache = new Map();

export function numberWordsRuntimeSource(language) {
  const localeCode = numberWordsLocaleCodes[language];
  if (!localeCode) return Promise.resolve('');
  if (!runtimeCache.has(language)) {
    const source = `import { toWords } from 'to-words/${localeCode}';\nwindow.usefulverseLocale.numberToWords = (value) => toWords(value);`;
    runtimeCache.set(language, build({
      stdin: { contents: source, resolveDir: repositoryRoot, sourcefile: `number-words-${language}.js` },
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2022'],
      minify: true,
      write: false,
      logLevel: 'silent',
    }).then((result) => result.outputFiles[0].text));
  }
  return runtimeCache.get(language);
}
