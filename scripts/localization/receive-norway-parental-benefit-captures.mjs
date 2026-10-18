import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { norwayParentalBenefitEnglish } from '../../src/markets-no-ch/norway-parental-benefit-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const output = new URL('../../src/markets-no-ch/norway-parental-benefit-translation-captures.json', import.meta.url);
const localeKeys = [...new Set([...Object.keys(translationsByLocale).filter((key) => key !== 'en'), 'nb'])];
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const sources = [...new Set(flatten(norwayParentalBenefitEnglish))].filter((source) => !Object.hasOwn(translationsByLocale.es, source));
const batches = [];
let current = [], size = 0;
for (const [index, source] of sources.entries()) {
  const length = source.length + 18;
  if (current.length && size + length > 900) { batches.push(current); current = []; size = 0; }
  current.push({ index, marker: `UVP${String(index).padStart(4, '0')}X`, source });
  size += length;
}
if (current.length) batches.push(current);
const html = `<!doctype html><meta charset="utf-8"><title>NO008 translation capture</title><h1>NO008 translations</h1><p>Copy the marked source text into Microsoft Translator, select the target language, then save the returned text. Markers must stay intact.</p><label>Locale <select id="locale">${localeKeys.map((locale) => `<option value="${locale}">${locale}</option>`).join('')}</select></label><label>Batch <select id="batch">${batches.map((_, index) => `<option value="${index}">${index + 1}/${batches.length}</option>`).join('')}</select></label><p>Source batch</p><textarea id="source" rows="13" cols="110" readonly></textarea><p>Translated batch</p><textarea id="translated" rows="13" cols="110"></textarea><button id="save">Save captured translation</button><output id="status"></output><script>const batches=${JSON.stringify(batches)};const update=()=>{document.querySelector('#source').value=batches[+document.querySelector('#batch').value].map(x=>x.marker+'|'+x.source).join('\\n')};document.querySelector('#batch').onchange=update;update();document.querySelector('#save').onclick=async()=>{const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locale:document.querySelector('#locale').value,batch:+document.querySelector('#batch').value,translated:document.querySelector('#translated').value})});document.querySelector('#status').textContent=await r.text()};</script>`;

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); response.end(html); return; }
  if (request.method !== 'POST' || request.url !== '/save') { response.writeHead(404); response.end('Not found'); return; }
  let body = ''; for await (const chunk of request) body += chunk;
  const { locale, batch, translated } = JSON.parse(body);
  if (!localeKeys.includes(locale) || !Number.isInteger(batch) || !batches[batch] || typeof translated !== 'string') { response.writeHead(400); response.end('Invalid batch'); return; }
  const parsed = [];
  for (const item of batches[batch]) {
    const match = translated.match(new RegExp(`${item.marker}\\|([\\s\\S]*?)(?=UVP\\d{4}X\\||$)`, 'u'));
    if (!match || !match[1].trim() || /UVP\d{4}X/u.test(match[1])) { response.writeHead(400); response.end(`Missing or invalid ${item.marker}`); return; }
    parsed.push(match[1].trim());
  }
  let captures = {}; try { captures = JSON.parse(await readFile(output, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  captures[locale] ??= {};
  batches[batch].forEach((item, index) => { captures[locale][item.source] = parsed[index]; });
  await writeFile(output, `${JSON.stringify(captures, null, 2)}\n`);
  response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }); response.end(`Saved ${locale}, batch ${batch + 1}/${batches.length}: ${parsed.length} strings.`);
}).listen(4199, '127.0.0.1', () => console.log(`NO008 capture on localhost:4199; ${sources.length} strings in ${batches.length} batches × ${localeKeys.length} locales.`));
