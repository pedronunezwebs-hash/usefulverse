import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { swissWheelOffsetEnglish } from '../../src/markets-no-ch/swiss-wheel-offset-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const outputPath = '/private/tmp/usefulverse-swiss-wheel-offset-captures.json';
const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(swissWheelOffsetEnglish).filter((value) => !genericEnglish.has(value)))];
const locales = [...new Set([...Object.keys(translationsByLocale).filter((key) => key !== 'en'), 'nb'])].sort();
const options = locales.map((key) => `<option value="${key}">${key}</option>`).join('');
const html = `<!doctype html><meta charset="utf-8"><title>Wheel offset locale capture</title><main><h1>Static translation capture · local</h1><p>${locales.length} locales · ${sourceStrings.length} source strings. Paste the complete copied translation for one locale; this local page saves the draft on this computer.</p><label>Locale <select id="locale">${options}</select></label><label>Copied translation<textarea id="text" rows="24" cols="100" autocomplete="off"></textarea></label><button id="save">Validate and save this locale</button><p id="status" role="status" aria-live="polite"></p><script>document.querySelector('#save').addEventListener('click',async()=>{const locale=document.querySelector('#locale').value;const response=await fetch('/capture-locale?locale='+encodeURIComponent(locale),{method:'POST',headers:{'content-type':'text/plain;charset=utf-8'},body:document.querySelector('#text').value});document.querySelector('#status').textContent=await response.text()})</script></main>`;

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
    return;
  }
  if (request.method === 'GET' && request.url === '/source') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify({ sourceStrings, locales }));
    return;
  }
  if (request.method === 'POST' && request.url.startsWith('/capture-locale?')) {
    try {
      const locale = new URL(request.url, 'http://127.0.0.1').searchParams.get('locale');
      if (!locales.includes(locale)) throw new Error('Unknown locale.');
      let body = '';
      for await (const chunk of request) body += chunk;
      const pack = {};
      let currentId = null;
      for (const line of body.split(/\r?\n/u)) {
        const row = line.match(/^Q(\d{3})[\t ]*(.*)$/u);
        if (row) currentId = `Q${row[1]}`;
        if (!currentId) continue;
        const index = Number(currentId.slice(1));
        if (index >= sourceStrings.length) continue;
        const translated = (row ? row[2] : line).trim();
        if (translated) pack[currentId] = [pack[currentId], translated].filter(Boolean).join('\n');
      }
      const missing = sourceStrings.map((_, index) => `Q${String(index).padStart(3, '0')}`).filter((id) => !pack[id]);
      if (missing.length) throw new Error(`Capture incomplete (${sourceStrings.length - missing.length}/${sourceStrings.length}); first missing: ${missing.slice(0, 8).join(', ')}.`);
      let captures = {};
      try { captures = JSON.parse(await readFile(outputPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      captures[locale] = pack;
      await writeFile(outputPath, JSON.stringify(captures), 'utf8');
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locale}: ${Object.keys(pack).length}/${sourceStrings.length} strings. ${Object.keys(captures).length}/${locales.length} locales captured.`);
    } catch (error) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message);
    }
    return;
  }
  response.writeHead(404).end('Not found');
});
server.listen(4184, '127.0.0.1', () => process.stdout.write(`Swiss wheel-offset capture listening on 127.0.0.1:4184 (${locales.length} locales × ${sourceStrings.length} strings)\n`));
