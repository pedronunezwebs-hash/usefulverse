import { readFile, writeFile } from 'node:fs/promises';

const directory = process.env.USEFULVERSE_TRANSLATION_DIR ?? '/tmp/usefulverse-local-translation-20261001';
const packs = JSON.parse(await readFile(`${directory}/guide-draft-final.json`, 'utf8'));
const fullGuidePacks = Object.fromEntries(Object.entries(packs).filter(([, pack]) => Array.isArray(pack.guides)));
await writeFile(new URL('../../src/locales/guide-packs.mjs', import.meta.url), `export const guidePacks = ${JSON.stringify(fullGuidePacks, null, 2)};\n`, 'utf8');
console.log(`Integrated ${Object.keys(fullGuidePacks).length} existing guide/UI locale packs in src/locales/guide-packs.mjs.`);
