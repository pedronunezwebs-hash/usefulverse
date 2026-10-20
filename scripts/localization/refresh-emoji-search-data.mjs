import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const revision = '91c267402229a59e3ef2774544f001bf959e8809';
const productLocales = 'am ar bg bn ca de el es fa fr gu ha hi id it ja ko mr ms nl pl pt ru sv sw ta te th tl tr uk ur vi zh zh-Hant'.split(' ');
const output = resolve('src/growth600/tools/emoji-search/data');
const emoji = /\p{Extended_Pictographic}/u;
const flag = /\p{Regional_Indicator}{2}/u;
await mkdir(output, { recursive: true });

async function fetchJson(path) {
  const response = await fetch(`https://raw.githubusercontent.com/unicode-org/cldr-json/${revision}/${path}`, { headers: { 'user-agent': 'UsefulVerse-CLDR-data-refresh' } });
  if (!response.ok) throw new Error(`Unicode CLDR download failed (${response.status}) for ${path}`);
  return response.json();
}

for (const locale of ['en', ...productLocales]) {
  const cldrLocale = locale === 'tl' ? 'fil' : locale;
  const path = `cldr-json/cldr-annotations-full/annotations/${cldrLocale}/annotations.json`;
  const source = await fetchJson(path);
  const annotations = source?.annotations?.annotations;
  if (!annotations || typeof annotations !== 'object') throw new Error(`Unexpected Unicode CLDR format for ${locale}`);
  const entries = [];
  for (const [symbol, item] of Object.entries(annotations)) {
    if (!emoji.test(symbol) && !flag.test(symbol) && !symbol.includes('\u20e3')) continue;
    const name = item.tts?.[0] ?? item.default?.[0];
    if (typeof name !== 'string' || !name) continue;
    const keywords = [...new Set([...(item.default ?? []), ...(item.tts ?? [])].filter(Boolean))].slice(0, 16);
    entries.push([symbol, name, keywords]);
  }
  if (entries.length < 1400 || entries.length > 2000) throw new Error(`Unexpected emoji annotation count for ${locale}: ${entries.length}`);
  await writeFile(resolve(output, `${locale}.json`), JSON.stringify({ locale, source: 'Unicode CLDR', revision, entries }));
  console.log(`${locale}: ${entries.length} emoji entries`);
}

const license = await fetch(`https://raw.githubusercontent.com/unicode-org/cldr-json/${revision}/cldr-json/cldr-core/LICENSE`);
if (!license.ok) throw new Error(`Unicode CLDR license download failed (${license.status}).`);
await writeFile(resolve(output, 'UNICODE-LICENSE.txt'), Buffer.from(await license.arrayBuffer()));
await writeFile(resolve(output, 'metadata.json'), `${JSON.stringify({ source: `https://github.com/unicode-org/cldr-json/tree/${revision}/cldr-json/cldr-annotations-full/annotations`, revision, license: 'Unicode-3.0', generatedAt: new Date().toISOString().slice(0, 10), locales: ['en', ...productLocales] }, null, 2)}\n`);
