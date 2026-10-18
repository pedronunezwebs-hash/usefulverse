import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { barcodeReaderEnglish } from '../../src/markets-no-ch/barcode-reader-copy-en.mjs';

const port = 4226;
const checkpoint = '/private/tmp/usefulverse-barcode-reader-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const googleLocale = { pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' };
const flatten = (value, out = []) => { if (typeof value === 'string') out.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, out)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, out)); return out; };
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(barcodeReaderEnglish).filter((value) => !generic.has(value)))];
const marker = (index) => `UVBR${String(index).padStart(4, '0')}X:`;
const load = async () => { try { return JSON.parse(await readFile(checkpoint, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; return {}; } };

createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`); const locale = url.searchParams.get('locale');
  if (request.method === 'GET' && ['/translate', '/capture-form', '/status', '/source'].includes(url.pathname)) {
    if (locale && !locales.includes(locale)) { response.writeHead(400).end('Unknown locale'); return; }
    if (url.pathname === '/translate') {
      const payload = sources.map((source, index) => `${marker(index)}${source}`).join('\n');
      response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${googleLocale[locale] ?? locale}&text=${encodeURIComponent(payload)}&op=translate`, 'cache-control': 'no-store' }).end(); return;
    }
    if (url.pathname === '/source') { response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(sources.map((source, index) => `${marker(index)}${source}`).join('\n')); return; }
    if (url.pathname === '/capture-form') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(`<!doctype html><meta charset="utf-8"><title>Barcode reader translation capture</title><main><h1>Google Translate result · ${locale}</h1><textarea id="payload" rows="34" cols="110"></textarea><button id="save">Save locally</button><p id="status" role="status" aria-live="polite"></p><script>const locale=new URLSearchParams(location.search).get("locale");document.querySelector("#save").onclick=async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(locale),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()}</script></main>`); return;
    }
    const data = await load(); response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ strings: sources.length, locales: Object.fromEntries(locales.map((key) => [key, Object.keys(data[key] ?? {}).length])) })); return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      if (!locales.includes(locale)) throw new Error('Unknown locale');
      let text = '';
      for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 50000) throw new Error('Capture exceeds size limit'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|Translation results available/iu.test(text)) throw new Error('Browser debug text is not accepted');
      const rows = [...text.matchAll(/UVBR(\d{4})X\s*[:：፡]/gu)];
      if (rows.length !== sources.length || new Set(rows.map((row) => row[1])).size !== sources.length) throw new Error(`Expected ${sources.length} unique markers; received ${rows.length}`);
      const pack = {};
      rows.forEach((row, position) => {
        const index = Number(row[1]); const begin = row.index + row[0].length; const finish = rows[position + 1]?.index ?? text.length;
        const value = text.slice(begin, finish).replace(/\s+/gu, ' ').trim();
        if (!value || index >= sources.length || /UVBR\d{4}X/iu.test(value)) throw new Error(`Bad translation row ${index}`);
        pack[`Q${String(index).padStart(4, '0')}`] = value;
      });
      const data = await load(); data[locale] = pack; await writeFile(checkpoint, `${JSON.stringify(data)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${Object.keys(pack).length}/${sources.length}`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
}).listen(port, '127.0.0.1', () => console.log(`Local barcode-reader translation capture on 127.0.0.1:${port}; ${locales.length} locales × ${sources.length} unique strings.`));
