import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { nineMensMorrisEnglish } from '../../src/markets-no-ch/nine-mens-morris-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-nine-mens-morris-translations.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(nineMensMorrisEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const marker = (index) => `UVMX${String(index).padStart(4, '0')}X`;

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (request.method === 'GET' && url.pathname === '/source') {
    const text = sources.map((source, index) => `${marker(index)}|${source}`).join('\n');
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(text);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/capture-form') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end('<!doctype html><meta charset="utf-8"><title>Local Morris translation capture</title><main><label>Translated text<textarea id="payload" rows="30" cols="110"></textarea></label><button id="save">Save translation locally</button><p id="status" role="status" aria-live="polite"></p><script>const q=new URLSearchParams(location.search);document.querySelector("#save").addEventListener("click",async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(q.get("locale")),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()})</script></main>');
    return;
  }
  if (request.method === 'GET' && url.pathname === '/status') {
    let packs = {};
    try { packs = JSON.parse(await readFile(checkpointPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }).end(JSON.stringify({ locales: Object.fromEntries(locales.map((locale) => [locale, Object.keys(packs[locale] ?? {}).length])), strings: sources.length }));
    return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      const locale = url.searchParams.get('locale');
      if (!locales.includes(locale)) throw new Error('Invalid locale.');
      let text = '';
      for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 30000) throw new Error('Translation response exceeds local capture limit.'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser/debug residue detected; translation was not saved.');
      const captured = {};
      for (let index = 0; index < sources.length; index += 1) {
        const current = `${marker(index)}|`;
        const position = text.indexOf(current);
        if (position < 0 || text.indexOf(current, position + current.length) >= 0) throw new Error(`Missing or duplicate row ${index}.`);
        const from = position + current.length;
        const next = index + 1 < sources.length ? text.indexOf(`${marker(index + 1)}|`, from) : text.length;
        if (next < 0) throw new Error(`Missing row ${index + 1}.`);
        const value = text.slice(from, next).replace(/\s+/gu, ' ').trim();
        if (!value || /UVMX\d{4}X/u.test(value)) throw new Error(`Empty or malformed translation at row ${index}.`);
        captured[`Q${String(index).padStart(4, '0')}`] = value;
      }
      let packs = {};
      try { packs = JSON.parse(await readFile(checkpointPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      packs[locale] = captured;
      await writeFile(checkpointPath, `${JSON.stringify(packs)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(`Saved ${locale}: ${Object.keys(captured).length}/${sources.length} strings.`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});

const port = Number(process.env.PORT ?? 4198);
server.listen(port, '127.0.0.1', () => console.log(`Nine Men's Morris local translation receiver at 127.0.0.1:${port}; ${locales.length} locales, ${sources.length} strings, ${sources.reduce((sum, text) => sum + text.length, 0)} source characters.`));
