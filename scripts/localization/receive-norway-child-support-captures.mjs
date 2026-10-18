import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { norwayChildSupportEnglish } from '../../src/markets-no-ch/norway-child-support-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const output = new URL('../../src/markets-no-ch/norway-child-support-translation-captures.json', import.meta.url);
const localeKeys = [...new Set([...Object.keys(translationsByLocale).filter((key) => key !== 'en'), 'nb'])];
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const sources = [...new Set(flatten(norwayChildSupportEnglish))].filter((source) => !Object.hasOwn(translationsByLocale.es, source));
const batches = [];
let current = [], size = 0;
for (const [index, source] of sources.entries()) {
  const length = source.length + 18;
  if (current.length && size + length > 760) { batches.push(current); current = []; size = 0; }
  current.push({ index, marker: `UVS${String(index).padStart(4, '0')}X`, source });
  size += length;
}
if (current.length) batches.push(current);
const html = `<!doctype html><meta charset="utf-8"><title>NO009 translation capture</title><h1>NO009 translations</h1><p>Translate the marked copy as public product text. Preserve every UVS marker, then save the translated batch.</p><label>Locale <select id="locale">${localeKeys.map((locale) => `<option value="${locale}">${locale}</option>`).join('')}</select></label><label>Batch <select id="batch">${batches.map((_, index) => `<option value="${index}">${index + 1}/${batches.length}</option>`).join('')}</select></label><p>Source batch</p><textarea id="source" rows="14" cols="118" readonly></textarea><p>Translated batch</p><textarea id="translated" rows="14" cols="118"></textarea><button id="save">Save translated batch</button><output id="status"></output><script>const batches=${JSON.stringify(batches)};const update=()=>{document.querySelector('#source').value=batches[+document.querySelector('#batch').value].map(x=>x.marker+'|'+x.source).join('\\n')};document.querySelector('#batch').onchange=update;update();document.querySelector('#save').onclick=async()=>{const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locale:document.querySelector('#locale').value,batch:+document.querySelector('#batch').value,translated:document.querySelector('#translated').value})});document.querySelector('#status').textContent=await r.text()};</script>`;
let saveQueue = Promise.resolve();

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); response.end(html); return; }
  if (request.method !== 'POST' || request.url !== '/save') { response.writeHead(404); response.end('Not found'); return; }
  let body = ''; for await (const chunk of request) body += chunk;
  const { locale, batch, translated } = JSON.parse(body);
  if (!localeKeys.includes(locale) || !Number.isInteger(batch) || !batches[batch] || typeof translated !== 'string') { response.writeHead(400); response.end('Invalid batch'); return; }
  const parsed = [];
  for (const item of batches[batch]) {
    const match = translated.match(new RegExp(`${item.marker}\\s*[|｜]([\\s\\S]*?)(?=UVS\\d{4}X\\s*[|｜]|$)`, 'u'));
    if (!match || !match[1].trim() || /UVS\\d{4}X/u.test(match[1])) { response.writeHead(400); response.end(`Missing or invalid ${item.marker}`); return; }
    parsed.push(match[1].trim());
  }
  const save = async () => {
    let captures = {}; try { captures = JSON.parse(await readFile(output, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    captures[locale] ??= {};
    batches[batch].forEach((item, index) => { captures[locale][item.source] = parsed[index]; });
    await writeFile(output, `${JSON.stringify(captures, null, 2)}\n`);
  };
  saveQueue = saveQueue.then(save, save);
  await saveQueue;
  response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }); response.end(`Saved ${locale}, batch ${batch + 1}/${batches.length}: ${parsed.length} strings.`);
}).listen(4200, '127.0.0.1', () => console.log(`NO009 capture on localhost:4200; ${sources.length} strings in ${batches.length} batches × ${localeKeys.length} locales.`));
