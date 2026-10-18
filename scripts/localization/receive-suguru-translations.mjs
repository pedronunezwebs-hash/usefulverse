import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { suguruEnglish } from '../../src/markets-no-ch/suguru-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-suguru-translations.json';
const generic = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(suguruEnglish).filter((value) => !generic.has(value)))];
const locales = Object.keys(translationsByLocale).sort();
const marker = (index) => `UVTAG${String(index).padStart(4, '0')}QVU:`;
const googleLocale = { zh: 'zh-CN', zh_tw: 'zh-TW', nb: 'no' };
const readPacks = async () => { try { return JSON.parse(await readFile(checkpointPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; return {}; } };
let queue = Promise.resolve();
const savePack = (locale, pack) => { const job = queue.then(async () => { const packs = await readPacks(); packs[locale] = pack; await writeFile(checkpointPath, `${JSON.stringify(packs)}\n`); }); queue = job.catch(() => {}); return job; };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1'); const locale = url.searchParams.get('locale');
  if (request.method === 'GET' && ['/translate', '/source', '/status', '/capture-form'].includes(url.pathname)) {
    if (locale && !locales.includes(locale)) { response.writeHead(400).end('Invalid locale.'); return; }
    if (url.pathname === '/translate') {
      const text = sources.map((source, index) => `${marker(index)}${source}`).join('\n');
      const target = googleLocale[locale] ?? locale;
      response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${target}&text=${encodeURIComponent(text)}&op=translate`, 'cache-control': 'no-store' }).end(); return;
    }
    if (url.pathname === '/source') { response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(sources.map((source, index) => `${marker(index)}${source}`).join('\n')); return; }
    if (url.pathname === '/capture-form') { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end('<!doctype html><meta charset="utf-8"><title>Suguru translation capture</title><label>Google Translate result<textarea id="payload" rows="36" cols="110"></textarea></label><button id="save">Save locally</button><p id="status" role="status"></p><script>const q=new URLSearchParams(location.search);document.querySelector("#save").onclick=async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(q.get("locale")),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()}</script>'); return; }
    const packs = await readPacks(); response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ locales: Object.fromEntries(locales.map((key) => [key, Object.keys(packs[key] ?? {}).length])), strings: sources.length, sourceCharacters: sources.reduce((sum, value) => sum + value.length, 0) })); return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      if (!locales.includes(locale)) throw new Error('Invalid locale.');
      let text = ''; for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 50000) throw new Error('Capture too large.'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser/debug residue found; not saved.');
      text = text.replace(/(UVTAG\d{4}QVU)\s*[：:]/gu, '$1:');
      const re = /UVTAG(\d{4})QVU:/gu;
      const rows = [...text.matchAll(re)];
      if (rows.length !== sources.length) throw new Error(`Expected ${sources.length} markers; got ${rows.length}.`);
      const indices = rows.map((row) => Number(row[1]));
      if (new Set(indices).size !== sources.length || indices.some((index) => index >= sources.length)) throw new Error('Markers are duplicated or out of range.');
      const captured = {};
      rows.forEach((row, position) => {
        const index = Number(row[1]);
        const value = text.slice(row.index + row[0].length, rows[position + 1]?.index ?? text.length).replace(/\s+/gu, ' ').trim();
        if (!value || /UVTAG\d{4}QVU:/u.test(value)) throw new Error(`Empty or malformed row ${index}.`);
        captured[`Q${String(index).padStart(4, '0')}`] = value;
      });
      await savePack(locale, captured); response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${rows.length}/${sources.length}.`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});
const port = Number(process.env.PORT ?? 4215);
server.listen(port, '127.0.0.1', () => console.log(`Local Suguru translation receiver: ${locales.length} locales, ${sources.length} strings, ${sources.reduce((sum, value) => sum + value.length, 0)} source characters.`));
