import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { norwayUnemploymentBenefitEnglish } from '../../src/markets-no-ch/norway-unemployment-benefit-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { norwayUnemploymentBenefitTranslationsByLocale as currentTranslations } from '../../src/markets-no-ch/norway-unemployment-benefit-translations.mjs';

const output = new URL('../../src/markets-no-ch/norway-unemployment-benefit-translation-overrides.json', import.meta.url);
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const sources = [...new Set(flatten(norwayUnemploymentBenefitEnglish))];
const common = new Set(Object.keys(translationsByLocale.es));
const uniqueSources = sources.filter((source) => !common.has(source));
const targets = uniqueSources.flatMap((source, index) => currentTranslations.ja[source] === source ? [{ index, source }] : []);
const allowed = ['ja','ko','id','hi','ar','zh','bn','ru','ur','tr','vi','it','zh_tw','bg','ca','nl','el','ms','pl','sv','th','uk','sw','mr','te','ha','tl','ta','fa','am','gu','nb'];
const batches = [];
let current = [], currentLength = 0;
for (const item of targets) {
  const rowLength = item.source.length + 18;
  if (current.length && currentLength + rowLength > 820) { batches.push(current); current = []; currentLength = 0; }
  current.push({ ...item, marker: `UVNB${String(item.index).padStart(4, '0')}X` }); currentLength += rowLength;
}
if (current.length) batches.push(current);
const html = `<!doctype html><meta charset="utf-8"><title>NO007 final localization receiver</title><h1>NO007 final localization updates</h1><p>Translate only public interface copy in the free browser UI. Keep UVNB markers exactly.</p><select id="locale">${allowed.map((key) => `<option>${key}</option>`).join('')}</select><label>Batch<select id="batch">${batches.map((_, index) => `<option value="${index}">${index + 1}/${batches.length}</option>`).join('')}</select></label><textarea id="source" rows="14" style="width:48em"></textarea><textarea id="translated" rows="14" style="width:48em"></textarea><button id="save">Save translated batch</button><output id="status"></output><script>const batches=${JSON.stringify(batches)};const update=()=>{document.querySelector('#source').value=batches[+document.querySelector('#batch').value].map(x=>x.marker+'|'+x.source).join('\\n')};document.querySelector('#batch').onchange=update;update();document.querySelector('#save').onclick=async()=>{const locale=document.querySelector('#locale').value,batch=+document.querySelector('#batch').value,translated=document.querySelector('#translated').value;const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({locale,batch,translated})});document.querySelector('#status').textContent=await r.text()};</script>`;

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); response.end(html); return; }
  if (request.method !== 'POST' || request.url !== '/save') { response.writeHead(404); response.end('Not found'); return; }
  let body = ''; for await (const chunk of request) body += chunk;
  const { locale, batch, translated } = JSON.parse(body);
  if (!allowed.includes(locale) || !Number.isInteger(batch) || !batches[batch] || typeof translated !== 'string') { response.writeHead(400); response.end('Invalid batch'); return; }
  const parsed = [];
  for (const item of batches[batch]) {
    const match = translated.match(new RegExp(`${item.marker}\\|([\\s\\S]*?)(?=UVNB\\d{4}X\\||$)`, 'u'));
    if (!match || !match[1].trim() || /UVNB\d{4}X/u.test(match[1])) { response.writeHead(400); response.end(`Missing or invalid ${item.marker}`); return; }
    parsed.push(match[1].trim());
  }
  let captures = {}; try { captures = JSON.parse(await readFile(output, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  captures[locale] ??= {}; batches[batch].forEach((item, index) => { captures[locale][item.source] = parsed[index]; });
  await writeFile(output, `${JSON.stringify(captures, null, 2)}\n`);
  response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }); response.end(`Saved ${locale}, batch ${batch + 1}/${batches.length}: ${parsed.length} strings.`);
}).listen(4201, '127.0.0.1', () => console.log(`NO007 final receiver on 127.0.0.1:4201; ${targets.length} strings in ${batches.length} batches.`));
