import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { localeEntries } from '../../src/locales.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';
import { audioToMidiEnglish } from '../../src/markets-no-ch/audio-to-midi-copy-en.mjs';

const port = 4220;
const checkpoint = '/private/tmp/usefulverse-audio-midi-translations.json';
const locales = [...localeEntries, { key: 'nb' }].filter(({ key }) => key !== 'en').map(({ key }) => key).sort();
const googleLocale = { pt: 'pt-BR', zh: 'zh-CN', zh_tw: 'zh-TW', tl: 'fil', nb: 'no' };
const flatten = (value, result = []) => {
  if (typeof value === 'string') result.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, result));
  return result;
};
const generic = new Set(Object.keys(translationsByLocale.es));
const sources = [...new Set(flatten(audioToMidiEnglish).filter((value) => !generic.has(value)))];
const extraSourceIndexes = [18, 19, 20, 53, 54];
const extraSources = extraSourceIndexes.map((index) => sources[index]);
const marker = (index) => `UVMIDI${String(index).padStart(4, '0')}X:`;
const load = async () => { try { return JSON.parse(await readFile(checkpoint, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; return {}; } };

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  const locale = url.searchParams.get('locale');
  if (request.method === 'GET' && ['/translate', '/translate-extra', '/source', '/capture-form', '/status'].includes(url.pathname)) {
    if (locale && !locales.includes(locale)) { response.writeHead(400).end('Unknown locale'); return; }
    if (url.pathname === '/translate' || url.pathname === '/translate-extra') {
      const selected = url.pathname === '/translate-extra' ? extraSources.map((source, index) => [source, 60 + index]) : sources.map((source, index) => [source, index]);
      const payload = selected.map(([source, index]) => `${marker(index)}${source}`).join('\n');
      response.writeHead(302, { location: `https://translate.google.com/?sl=en&tl=${googleLocale[locale] ?? locale}&text=${encodeURIComponent(payload)}&op=translate`, 'cache-control': 'no-store' }).end(); return;
    }
    if (url.pathname === '/source') { response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }).end(sources.map((source, index) => `${marker(index)}${source}`).join('\n')); return; }
    if (url.pathname === '/capture-form') {
      response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }).end(`<!doctype html><meta charset="utf-8"><title>Local audio-to-MIDI translation capture</title><main><h1>Google Translate result · ${locale}</h1><label>Paste translated text with UVMIDI markers<textarea id="payload" rows="36" cols="110"></textarea></label><button id="save">Save locally</button><p id="status" role="status" aria-live="polite"></p><script>const locale=new URLSearchParams(location.search).get("locale");document.querySelector("#save").onclick=async()=>{const response=await fetch("/capture?locale="+encodeURIComponent(locale),{method:"POST",headers:{"content-type":"text/plain;charset=utf-8"},body:document.querySelector("#payload").value});document.querySelector("#status").textContent=await response.text()}</script></main>`); return;
    }
    const data = await load();
    response.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ strings: sources.length, locales: Object.fromEntries(locales.map((key) => [key, Object.keys(data[key] ?? {}).length])) })); return;
  }
  if (request.method === 'POST' && (url.pathname === '/capture' || url.pathname === '/capture-extra')) {
    try {
      if (!locales.includes(locale)) throw new Error('Unknown locale');
      let text = '';
      for await (const chunk of request) { text += chunk.toString('utf8'); if (text.length > 40000) throw new Error('Capture exceeds size limit'); }
      if (/AXWebArea|127\.0\.0\.1|Focused UI element|Resultados de traducción disponibles/iu.test(text)) throw new Error('Browser debug text is not accepted');
      const isExtra = url.pathname === '/capture-extra';
      const expected = isExtra ? extraSources.length : sources.length;
      const offset = isExtra ? 60 : 0;
      const rows = [...text.matchAll(/UVMIDI(\d{4})X\s*[:：፡]/gu)];
      if (rows.length !== expected || new Set(rows.map((row) => row[1])).size !== expected) throw new Error(`Expected ${expected} unique markers; received ${rows.length}`);
      const pack = {};
      rows.forEach((row, position) => {
        const absoluteIndex = Number(row[1]); const index = absoluteIndex - offset; const start = row.index + row[0].length; const end = rows[position + 1]?.index ?? text.length;
        const value = text.slice(start, end).replace(/\s+/gu, ' ').trim();
        const selectedSources = isExtra ? extraSources : sources;
        if (!value || index < 0 || index >= selectedSources.length || /UVMIDI\d{4}X/iu.test(value)) throw new Error(`Bad translation row ${absoluteIndex}`);
        const tokens = selectedSources[index].match(/\{[^}]+\}/gu) ?? [];
        for (const token of tokens) if ((value.match(new RegExp(token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'gu')) ?? []).length !== 1) throw new Error(`Placeholder ${token} is missing or duplicated in row ${absoluteIndex}`);
        pack[`Q${String(absoluteIndex).padStart(4, '0')}`] = value;
      });
      const data = await load(); data[locale] = { ...(data[locale] ?? {}), ...pack };
      await writeFile(checkpoint, `${JSON.stringify(data)}\n`);
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${Object.keys(data[locale]).length}/${sources.length}`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});
server.listen(port, '127.0.0.1', () => console.log(`Local audio-to-MIDI translation capture on 127.0.0.1:${port}; ${locales.length} locales × ${sources.length} strings.`));
