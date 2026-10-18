import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { natalChartEnglish } from '../../src/markets-no-ch/natal-chart-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const checkpointPath = '/private/tmp/usefulverse-natal-chart-translation-checkpoint.json';
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(natalChartEnglish).filter((text) => !genericEnglish.has(text)))];
const locales = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
const batchSize = 35;
const marker = (index) => `UVNCX${String(index).padStart(4, '0')}X`;
const captureForm = '<!doctype html><meta charset="utf-8"><title>Local capture</title><main><label>Translated batch<textarea id="payload" rows="20" cols="100"></textarea></label><button id="save">Save locally</button><p id="status" role="status" aria-live="polite"></p><script>const q=new URLSearchParams(location.search);document.querySelector("#save").addEventListener("click",async()=>{const r=await fetch("/capture?locale="+encodeURIComponent(q.get("locale"))+"&batch="+encodeURIComponent(q.get("batch")),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await r.text()})</script></main>';

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://127.0.0.1');
  if (request.method === 'GET' && url.pathname === '/capture-form') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(captureForm);
    return;
  }
  if (request.method === 'GET' && url.pathname === '/source') {
    const batch = Number(url.searchParams.get('batch'));
    const start = batch * batchSize;
    if (!Number.isInteger(batch) || batch < 0 || start >= sources.length) {
      response.writeHead(400).end('Invalid batch'); return;
    }
    const lines = sources.slice(start, start + batchSize).map((source, index) => `${marker(start + index)}|${source}`);
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(lines.join('\n'));
    return;
  }
  if (request.method === 'POST' && url.pathname === '/capture') {
    try {
      const locale = url.searchParams.get('locale');
      const batch = Number(url.searchParams.get('batch'));
      if (!locales.includes(locale) || !Number.isInteger(batch) || batch < 0) throw new Error('Invalid locale or batch.');
      const start = batch * batchSize;
      const count = Math.min(batchSize, sources.length - start);
      if (start >= sources.length) throw new Error('Batch is outside the source text.');
      let text = '';
      for await (const chunk of request) {
        text += chunk.toString('utf8');
        if (text.length > 30000) throw new Error('Translation batch exceeds the local capture size limit.');
      }
      const captured = {};
      for (let index = 0; index < count; index += 1) {
        const id = start + index;
        const current = `${marker(id)}|`;
        const position = text.indexOf(current);
        if (position < 0 || text.indexOf(current, position + current.length) >= 0) throw new Error(`Missing or duplicate row ${id}.`);
        const from = position + current.length;
        const nextMarker = index + 1 < count ? text.indexOf(`${marker(id + 1)}|`, from) : text.length;
        if (nextMarker < 0) throw new Error(`Missing row ${id + 1}.`);
        const value = text.slice(from, nextMarker).replace(/\s+/gu, ' ').trim();
        if (!value || /UVNCX\d{4}X/u.test(value)) throw new Error(`Empty or malformed translation at row ${id}.`);
        captured[`Q${String(id).padStart(4, '0')}`] = value;
      }
      let packs = {};
      try { packs = JSON.parse(await readFile(checkpointPath, 'utf8')); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      packs[locale] ??= {};
      Object.assign(packs[locale], captured);
      await writeFile(checkpointPath, `${JSON.stringify(packs)}\n`);
      const completed = Object.keys(packs[locale]).length;
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(`Saved ${locale}, batch ${batch + 1}: ${completed}/${sources.length} strings.`);
    } catch (error) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message);
    }
    return;
  }
  response.writeHead(404).end('Not found');
});
const port = Number(process.env.PORT ?? 4189);
server.listen(port, '127.0.0.1', () => console.log(`Local natal-chart capture receiver on 127.0.0.1:${port}; ${locales.length} locales, ${sources.length} strings.`));
