import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { norwayEmployerCostEnglish } from '../../src/markets-no-ch/norway-employer-cost-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const output = resolve('src/markets-no-ch/norway-employer-cost-translation-captures.json');
const flatten = (value, list = []) => {
  if (typeof value === 'string') list.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, list));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, list));
  return list;
};
const sources = [...new Set(flatten(norwayEmployerCostEnglish))];
const extraSources = sources.slice(68);
const html = `<!doctype html><meta charset="utf-8"><title>NO005 translation capture</title><h1>NO005 additional static translation capture</h1><label>New English source strings<textarea id="sources" rows="8" cols="100" readonly>${JSON.stringify(extraSources).replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</textarea></label><label>Locale capture JSON<textarea id="payload" rows="20" cols="100"></textarea></label><button id="save">Save translation capture</button><output id="status"></output><script>document.querySelector('#save').addEventListener('click',async()=>{const response=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:document.querySelector('#payload').value});document.querySelector('#status').textContent=await response.text()})</script>`;

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
    return;
  }
  if (request.method === 'POST' && request.url === '/save') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const incoming = JSON.parse(body);
    const allowed = Object.keys(translationsByLocale).filter((locale) => locale !== 'en');
    if (!incoming || Array.isArray(incoming) || typeof incoming !== 'object' || Object.keys(incoming).some((locale) => !allowed.includes(locale))) throw new Error('Unexpected locale in translation capture.');
    for (const [locale, row] of Object.entries(incoming)) if (!Array.isArray(row) || row.length !== extraSources.length || row.some((value) => typeof value !== 'string' || !value.trim())) throw new Error(`Invalid capture for ${locale}.`);
    let existing = {};
    try { existing = JSON.parse(await readFile(output, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const merged = { ...existing };
    for (const [locale, row] of Object.entries(incoming)) {
      const prior = merged[locale] ?? [];
      if (prior.length !== sources.length) throw new Error(`Expected the existing ${sources.length}-string pack for ${locale}.`);
      merged[locale] = [...prior.slice(0, 68), ...row];
    }
    await writeFile(output, `${JSON.stringify(merged, null, 2)}\n`);
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(`Saved ${Object.keys(incoming).length} locale packs; ${Object.keys(merged).length} total.`);
    return;
  }
  response.writeHead(404); response.end('Not found');
}).listen(4192, '127.0.0.1', () => console.log(`NO005 translation capture receiver on 127.0.0.1:4192 (${extraSources.length} replacement strings).`));
