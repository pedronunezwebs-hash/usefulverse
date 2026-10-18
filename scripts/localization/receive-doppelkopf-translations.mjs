import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { doppelkopfEnglish } from '../../src/markets-no-ch/doppelkopf-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-doppelkopf-translations.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(doppelkopfEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).sort();
// Keep each UI translation comfortably below Google's 5,000-character limit;
// 23 rows make four short batches and reduce the chance that it merges IDs.
const rowsPerBatch = 23;
const batchCount = Math.ceil(sources.length / rowsPerBatch);
const marker = (index, locale) => locale === 'ur'
  ? `UVTAG${index.toString().padStart(4, '0')}QVU:`
  : `D${index.toString().padStart(4, '0')}`;
const googleLocale = { zh: 'zh-CN', zh_tw: 'zh-TW', nb: 'no' };
const readPacks = async () => {
  try { return JSON.parse(await readFile(checkpointPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; return {}; }
};
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (request.method === 'GET' && ['/translate', '/source', '/capture-form', '/status'].includes(url.pathname)) {
    const locale = url.searchParams.get('locale');
    if (locale && !locales.includes(locale)) { response.writeHead(400).end('Invalid locale.'); return; }
    const batch = Number(url.searchParams.get('batch') ?? 0);
    if (!Number.isInteger(batch) || batch < 0 || batch >= batchCount) { response.writeHead(400).end('Invalid batch.'); return; }
    if (url.pathname === '/translate' || url.pathname === '/source') {
      const text = sources.slice(batch * rowsPerBatch, (batch + 1) * rowsPerBatch)
        .map((source, offset) => `${marker(batch * rowsPerBatch + offset, locale)}|${source}`).join('\n');
      if (url.pathname === '/translate') {
        const target = googleLocale[locale] ?? locale;
        response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${target}&text=${encodeURIComponent(text)}&op=translate`, 'cache-control': 'no-store' }).end();
      } else response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(text);
      return;
    }
    if (url.pathname === '/capture-form') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end('<!doctype html><meta charset="utf-8"><title>Local Doppelkopf translation capture</title><main><label>Translated text<textarea id="payload" rows="20" cols="100"></textarea></label><button id="save">Save translation locally</button><p id="status" role="status" aria-live="polite"></p><script>const q=new URLSearchParams(location.search);document.querySelector("#save").addEventListener("click",async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(q.get("locale"))+"&batch="+encodeURIComponent(q.get("batch")),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()})</script></main>');
      return;
    }
    const packs = await readPacks();
    const filled = Object.fromEntries(locales.map((key) => [key, Object.keys(packs[key] ?? {}).length]));
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      .end(JSON.stringify({ locales: filled, strings: sources.length, batches: batchCount, sourceCharacters: sources.reduce((sum, text) => sum + text.length, 0) }));
    return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      const locale = url.searchParams.get('locale');
      const batch = Number(url.searchParams.get('batch'));
      if (!locales.includes(locale) || !Number.isInteger(batch) || batch < 0 || batch >= batchCount) throw new Error('Invalid locale or batch.');
      let text = '';
      for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 20000) throw new Error('Translation batch exceeds local capture limit.'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|focused UI element|The focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser/debug residue detected; translation was not saved.');
      const captured = {};
      const rowPattern = locale === 'ur' ? /UVTAG(\d{4})QVU:\|/gu : /D(\d{4})\|/gu;
      const start = batch * rowsPerBatch;
      const end = Math.min(sources.length, start + rowsPerBatch);
      const expected = new Set(Array.from({ length: end - start }, (_, offset) => start + offset));
      let rows = [...text.matchAll(rowPattern)];
      if (rows.length === expected.size + 1) {
        const segments = rows.map((row, index) => ({
          row, id: Number(row[1]),
          value: text.slice(row.index + row[0].length, rows[index + 1]?.index ?? text.length).replace(/\s+/gu, ' ').trim(),
        }));
        const duplicate = segments.find((segment, index) => segments.some((other, otherIndex) =>
          otherIndex !== index && other.id === segment.id && other.value && other.value === segment.value));
        if (duplicate) {
          const rowIndex = rows.indexOf(duplicate.row);
          const next = rows[rowIndex + 1]?.index ?? text.length;
          text = `${text.slice(0, duplicate.row.index)}${text.slice(next)}`;
          rows = [...text.matchAll(rowPattern)];
        }
      }
      if (rows.length !== expected.size) throw new Error(`Expected ${expected.size} unique rows; found ${rows.length}.`);
      // Google occasionally changes one numeric marker but preserves row order.
      // Reassign by position only when the full batch is present; missing rows
      // are rejected rather than silently filled or misattributed.
      const replacements = rows.flatMap((row, rowIndex) => {
        const id = start + rowIndex;
        return Number(row[1]) === id ? [] : [[row.index, `${marker(id, locale)}|`]];
      });
      for (const [position, replacement] of replacements.sort((a, b) => b[0] - a[0])) {
        text = `${text.slice(0, position)}${replacement}${text.slice(position + 6)}`;
      }
      rows = [...text.matchAll(rowPattern)];
      if (rows.some((row, rowIndex) => Number(row[1]) !== start + rowIndex)) throw new Error('Rows are not in source order.');
      rows.forEach((row, rowIndex) => {
        const index = Number(row[1]);
        if (!expected.has(index) || captured[`Q${String(index).padStart(4, '0')}`]) throw new Error(`Unexpected or duplicate row ${index}.`);
        const from = row.index + row[0].length;
        const next = rows[rowIndex + 1]?.index ?? text.length;
        const value = text.slice(from, next).replace(/\s+/gu, ' ').trim();
        if (!value || rowPattern.test(value)) throw new Error(`Empty or malformed translation at row ${index}.`);
        captured[`Q${String(index).padStart(4, '0')}`] = value;
      });
      for (const index of expected) {
        if (!captured[`Q${String(index).padStart(4, '0')}`]) throw new Error(`Missing row ${index}.`);
      }
      const packs = await readPacks();
      packs[locale] = { ...(packs[locale] ?? {}), ...captured };
      await writeFile(checkpointPath, `${JSON.stringify(packs)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(`Saved ${locale}, batch ${batch + 1}/${batchCount}: ${Object.keys(captured).length} strings.`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});

const port = Number(process.env.PORT ?? 4213);
server.listen(port, '127.0.0.1', () => console.log(`Doppelkopf local translation receiver at 127.0.0.1:${port}; ${locales.length} locales, ${sources.length} strings in ${batchCount} small batches.`));
