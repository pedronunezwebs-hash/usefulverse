import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { scaleDrawingEnglish } from '../../src/markets-no-ch/scale-drawing-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const outputPath = '/private/tmp/usefulverse-scale-drawing-captures.json';
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(scaleDrawingEnglish).filter((value) => !genericEnglish.has(value)))];
const locales = Object.keys(translationsByLocale).filter((key) => key !== 'en').sort();
const html = `<!doctype html><meta charset="utf-8"><title>Scale drawing locale capture</title><main><h1>Local translation capture</h1><label>Locale <select id="locale">${locales.map((key) => `<option value="${key}">${key}</option>`).join('')}</select></label><label>Translation text<textarea id="text" rows="25" cols="100"></textarea></label><button id="save">Validate and save locale</button><p id="status" role="status" aria-live="polite"></p><script>const params=new URLSearchParams(location.search);if(params.has('locale'))document.querySelector('#locale').value=params.get('locale');document.querySelector('#save').addEventListener('click',async()=>{const locale=document.querySelector('#locale').value;const response=await fetch('/capture?locale='+encodeURIComponent(locale),{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:document.querySelector('#text').value});document.querySelector('#status').textContent=await response.text()})</script></main>`;

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html); return;
  }
  if (request.method === 'GET' && request.url === '/source') {
    const marked = sourceStrings.map((value, index) => `⟦Q${String(index).padStart(3, '0')}⟧ ${value}`);
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify({ sourceStrings, marked, locales })); return;
  }
  if (request.method === 'POST' && request.url.startsWith('/capture?')) {
    try {
      const locale = new URL(request.url, 'http://127.0.0.1').searchParams.get('locale');
      if (!locales.includes(locale)) throw new Error('Unknown locale.');
      let body = '';
      for await (const chunk of request) { body += chunk; if (body.length > 30000) throw new Error('Capture exceeds the local size guard.'); }
      const pack = {};
      const marker = /⟦Q(\d{3})⟧\s*([\s\S]*?)(?=⟦Q\d{3}⟧|$)/gu;
      for (const match of body.matchAll(marker)) {
        const index = Number(match[1]);
        if (index < sourceStrings.length) pack[`Q${match[1]}`] = match[2].trim();
      }
      const ids = sourceStrings.map((_, index) => `Q${String(index).padStart(3, '0')}`);
      const missing = ids.filter((id) => !pack[id]);
      if (missing.length) throw new Error(`Incomplete: ${ids.length - missing.length}/${ids.length}; first missing ${missing.slice(0, 5).join(', ')}.`);
      let captures = {};
      try { captures = JSON.parse(await readFile(outputPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      captures[locale] = pack;
      await writeFile(outputPath, JSON.stringify(captures), 'utf8');
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${ids.length}/${ids.length}; ${Object.keys(captures).length}/${locales.length} locales.`);
    } catch (error) { response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message); }
    return;
  }
  response.writeHead(404).end('Not found');
});
const port = Number(process.env.PORT ?? 4185);
server.listen(port, '127.0.0.1', () => process.stdout.write(`Scale drawing capture on 127.0.0.1:${port} (${locales.length} locales × ${sourceStrings.length} strings)\n`));
