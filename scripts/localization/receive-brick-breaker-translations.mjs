import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { brickBreakerEnglish } from '../../src/markets-no-ch/brick-breaker-copy-en.mjs';

const checkpoint = '/private/tmp/usefulverse-brick-breaker-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const common = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, result = []) => { if (typeof value === 'string') result.push(value); else if (Array.isArray(value)) value.forEach((item) => flatten(item, result)); else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result)); return result; };
const sources = [...new Set(flatten(brickBreakerEnglish).filter((text) => !common.has(text)))];
const marker = (index) => `UVBRK${String(index).padStart(4, '0')}X:`;
const googleLocale = { zh: 'zh-CN', zh_tw: 'zh-TW', nb: 'no', pt: 'pt-BR', tl: 'fil' };
const load = async () => { try { return JSON.parse(await readFile(checkpoint, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; return {}; } };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1:4217'); const locale = url.searchParams.get('locale');
  if (request.method === 'GET' && ['/translate', '/capture-form', '/status'].includes(url.pathname)) {
    if (locale && !locales.includes(locale)) { response.writeHead(400).end('Invalid locale'); return; }
    if (url.pathname === '/translate') {
      const text = sources.map((value, index) => `${marker(index)}${value}`).join('\n');
      response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${googleLocale[locale] ?? locale}&text=${encodeURIComponent(text)}&op=translate`, 'cache-control': 'no-store' }).end(); return;
    }
    if (url.pathname === '/capture-form') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end('<!doctype html><meta charset="utf-8"><title>Local translation capture</title><main><label>Google Translate result<textarea id="payload" rows="34" cols="105"></textarea></label><button id="save">Save locally</button><p id="status" role="status" aria-live="polite"></p><script>const locale=new URLSearchParams(location.search).get("locale");document.querySelector("#save").onclick=async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(locale),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()}</script></main>'); return;
    }
    const data = await load(); response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ strings: sources.length, locales: Object.fromEntries(locales.map((key) => [key, Object.keys(data[key] ?? {}).length])) })); return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      const locale = url.searchParams.get('locale'); if (!locales.includes(locale)) throw new Error('Invalid locale');
      let text = ''; for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 50000) throw new Error('Capture too large'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser or debug text in capture');
      const rows = [...text.matchAll(/UVBRK(\d{4})X\s*[:：፡]/gu)];
      if (rows.length !== sources.length || new Set(rows.map((row) => row[1])).size !== sources.length) throw new Error(`Expected ${sources.length} unique markers; received ${rows.length}`);
      const pack = {};
      rows.forEach((row, position) => {
        const index = Number(row[1]); const from = row.index + row[0].length; const to = rows[position + 1]?.index ?? text.length;
        const translated = text.slice(from, to).replace(/\s+/gu, ' ').trim();
        if (!translated || index >= sources.length || /UVBRK\d{4}X/iu.test(translated)) throw new Error(`Invalid row ${index}`);
        pack[`Q${String(index).padStart(4, '0')}`] = translated;
      });
      const data = await load(); data[locale] = pack; await writeFile(checkpoint, `${JSON.stringify(data)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${Object.keys(pack).length}/${sources.length}`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});
server.listen(4217, '127.0.0.1', () => console.log(`Local translation receiver on 127.0.0.1:4217, ${locales.length} locales × ${sources.length} strings.`));
