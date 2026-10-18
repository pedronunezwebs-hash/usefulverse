import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { swissVehicleTaxEnglish } from '../../src/markets-no-ch/switzerland-vehicle-tax-copy-en.mjs';

const port = 4230;
const checkpoint = '/private/tmp/usefulverse-swiss-vehicle-tax-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key);
const languageCode = (locale) => ({ pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' })[locale] ?? locale;
const flatten = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out));
  return out;
};
const sources = [...new Set(flatten(swissVehicleTaxEnglish))];
const marker = (index) => `UVTV${String(index).padStart(4, '0')}X:`;
const load = async () => {
  try { return JSON.parse(await readFile(checkpoint, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return {}; }
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const locale = url.searchParams.get('locale');
  if (request.method === 'GET' && url.pathname === '/translate') {
    if (!locales.includes(locale)) { response.writeHead(400).end('Unknown locale'); return; }
    const payload = sources.map((source, index) => `${marker(index)} ${source}`).join('\n');
    const target = languageCode(locale);
    response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${target}&text=${encodeURIComponent(payload)}&op=translate`, 'cache-control': 'no-store' }).end();
    return;
  }
  if (request.method === 'GET' && url.pathname === '/capture-form') {
    if (!locales.includes(locale)) { response.writeHead(400).end('Unknown locale'); return; }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(`<!doctype html><meta charset="utf-8"><title>Local translation capture</title><form><label for="text">Google Translate output for ${locale}</label><textarea id="text" rows="18" cols="100" required></textarea><button>Save local translation</button><output aria-live="polite"></output></form><script>document.querySelector('form').addEventListener('submit', async event => { event.preventDefault(); const output = document.querySelector('output'); output.textContent = 'Saving…'; const response = await fetch('/capture?locale=${locale}', { method: 'POST', headers: { 'content-type': 'text/plain;charset=UTF-8' }, body: document.querySelector('#text').value }); output.textContent = await response.text(); if (!response.ok) output.dataset.error = 'true'; });</script>`);
    return;
  }
  if (['GET', 'POST'].includes(request.method) && url.pathname === '/capture') {
    try {
      if (!locales.includes(locale)) throw new Error('Unknown locale');
      let text = url.searchParams.get('text') ?? '';
      if (request.method === 'POST') {
        text = '';
        for await (const chunk of request) {
          text += chunk.toString('utf8');
          if (text.length > 20000) throw new Error('Capture body exceeds the size limit.');
        }
      }
      if (text.length > 20000 || /AXWebArea|127\.0\.0\.1|Focused UI element|Translation results available/iu.test(text)) throw new Error('Invalid capture payload.');
      const rows = [...text.matchAll(/UVTV(\d{4})X\s*[:：፡]/gu)];
      if (rows.length !== sources.length || new Set(rows.map((row) => row[1])).size !== sources.length) throw new Error(`Expected ${sources.length} unique markers; received ${rows.length}.`);
      const pack = {};
      rows.forEach((row, position) => {
        const index = Number(row[1]);
        const start = row.index + row[0].length;
        const end = rows[position + 1]?.index ?? text.length;
        const value = text.slice(start, end).replace(/\s+/gu, ' ').trim();
        if (!value || index >= sources.length || /UVTV\d{4}X/iu.test(value)) throw new Error(`Invalid translation row ${index}.`);
        pack[`Q${String(index).padStart(4, '0')}`] = value;
      });
      const captures = await load();
      captures[locale] = pack;
      await writeFile(checkpoint, `${JSON.stringify(captures)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(`Saved ${locale} ${Object.keys(pack).length}/${sources.length}`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  if (request.method === 'GET' && url.pathname === '/status') {
    const captures = await load();
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify({ strings: sources.length, completed: Object.keys(captures).length, locales: Object.keys(captures) }));
    return;
  }
  response.writeHead(404).end('Not found');
}).listen(port, '127.0.0.1', () => console.log(`Local Google Translate UI receiver on 127.0.0.1:${port}; ${locales.length} locales × ${sources.length} strings.`));
