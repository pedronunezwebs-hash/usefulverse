import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { skatCardGameEnglish } from '../../src/markets-no-ch/skat-card-game-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-skat-translations.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(skatCardGameEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).sort();
const marker = (index) => `C${index.toString(36).padStart(2, '0')}`;
const googleLocale = { zh: 'zh-CN', zh_tw: 'zh-TW', nb: 'no' };

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (request.method === 'GET' && url.pathname === '/translate') {
    const locale = url.searchParams.get('locale');
    if (!locales.includes(locale)) { response.writeHead(400).end('Invalid locale.'); return; }
    const text = sources.map((source, index) => `${marker(index)}|${source}`).join('\n');
    const target = googleLocale[locale] ?? locale;
    response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${target}&text=${encodeURIComponent(text)}&op=translate`, 'cache-control': 'no-store' }).end();
    return;
  }
  if (request.method === 'GET' && url.pathname === '/source') {
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
      .end(sources.map((source, index) => `${marker(index)}|${source}`).join('\n'));
    return;
  }
  if (request.method === 'GET' && url.pathname === '/capture-form') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' })
      .end('<!doctype html><meta charset="utf-8"><title>Local Skat translation capture</title><main><label>Translated text<textarea id="payload" rows="35" cols="110"></textarea></label><button id="save">Save translation locally</button><p id="status" role="status" aria-live="polite"></p><script>const q=new URLSearchParams(location.search);document.querySelector("#save").addEventListener("click",async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(q.get("locale")),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()})</script></main>');
    return;
  }
  if (request.method === 'GET' && url.pathname === '/status') {
    let packs = {};
    try { packs = JSON.parse(await readFile(checkpointPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      .end(JSON.stringify({ locales: Object.fromEntries(locales.map((locale) => [locale, Object.keys(packs[locale] ?? {}).length])), strings: sources.length, sourceCharacters: sources.reduce((sum, text) => sum + text.length, 0) }));
    return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      const locale = url.searchParams.get('locale');
      if (!locales.includes(locale)) throw new Error('Invalid locale.');
      let text = '';
      for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 50000) throw new Error('Translation response exceeds local capture limit.'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser/debug residue detected; translation was not saved.');
      const markerMatches = [...text.matchAll(/C[0-9a-z]{2}\|/gu)];
      const counts = new Map();
      for (const match of markerMatches) counts.set(match[0], (counts.get(match[0]) ?? 0) + 1);
      const duplicates = [];
      const seen = new Set();
      markerMatches.forEach((match, sequenceIndex) => {
        if (seen.has(match[0])) duplicates.push({ start: match.index, end: match.index + match[0].length, sequenceIndex });
        seen.add(match[0]);
      });
      const missing = sources.map((_, index) => index).filter((index) => !counts.has(`${marker(index)}|`));
      if (missing.length && missing.length === duplicates.length) {
        const unused = new Set(missing);
        for (const duplicate of duplicates) {
          const target = [...unused].sort((a, b) => Math.abs(a - duplicate.sequenceIndex) - Math.abs(b - duplicate.sequenceIndex))[0];
          duplicate.replacement = `${marker(target)}|`;
          unused.delete(target);
        }
        for (const duplicate of duplicates.sort((a, b) => b.start - a.start)) text = `${text.slice(0, duplicate.start)}${duplicate.replacement}${text.slice(duplicate.end)}`;
      }
      const captured = {};
      for (let index = 0; index < sources.length; index += 1) {
        const current = `${marker(index)}|`;
        const position = text.indexOf(current);
        if (position < 0 || text.indexOf(current, position + current.length) >= 0) throw new Error(`Missing or duplicate row ${index}.`);
        const from = position + current.length;
        const next = index + 1 < sources.length ? text.indexOf(`${marker(index + 1)}|`, from) : text.length;
        if (next < 0) throw new Error(`Missing row ${index + 1}.`);
        const value = text.slice(from, next).replace(/\s+/gu, ' ').trim();
        if (!value || /C[0-9a-z]{2}\|/u.test(value)) throw new Error(`Empty or malformed translation at row ${index}.`);
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

const port = Number(process.env.PORT ?? 4212);
server.listen(port, '127.0.0.1', () => console.log(`Skat local translation receiver at 127.0.0.1:${port}; ${locales.length} locales, ${sources.length} strings, ${sources.reduce((sum, text) => sum + text.length, 0)} source characters.`));
