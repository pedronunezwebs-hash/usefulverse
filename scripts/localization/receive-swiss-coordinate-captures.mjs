import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';
import { swissCoordinateEnglish } from '../../src/markets-no-ch/swiss-coordinate-copy-en.mjs';
import { translationsByLocale } from '../../src/markets-no-ch/translations.mjs';

const outputPath = '/private/tmp/usefulverse-swiss-coordinate-captures.json';
function flatten(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
}
const genericEnglish = new Set(Object.keys(translationsByLocale.es));
const sourceStrings = [...new Set(flatten(swissCoordinateEnglish).filter((value) => !genericEnglish.has(value)))];
const lines = sourceStrings.map((text, index) => `Q${String(index).padStart(3, '0')}\t${text}`).join('\n');
const expected = [...new Set([...Object.keys(translationsByLocale).filter((key) => key !== 'en'), 'nb'])].sort();
const html = `<!doctype html><meta charset="utf-8"><title>Swiss coordinate translations · local</title><main><h1>Local translation capture</h1><p>Expected ${expected.length} locale packs · ${sourceStrings.length} strings. No cloud write.</p><label>JSON capture<textarea id="data" rows="16" cols="100"></textarea></label><button id="save">Save temporary capture</button><p id="status" role="status"></p><script>document.querySelector('#save').addEventListener('click',async()=>{const response=await fetch('/capture',{method:'POST',headers:{'content-type':'application/json'},body:document.querySelector('#data').value});document.querySelector('#status').textContent=await response.text()})</script></main>`;
const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/source') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify({ lines, expected, sourceStrings }));
    return;
  }
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
    return;
  }
  if (request.method === 'POST' && request.url === '/capture') {
    try {
      let body = '';
      for await (const chunk of request) body += chunk;
      const parsed = JSON.parse(body);
      const locales = Object.keys(parsed).sort();
      if (JSON.stringify(locales) !== JSON.stringify(expected)) throw new Error(`Expected ${expected.length} locale packs; got ${locales.length}.`);
      for (const locale of expected) {
        const ids = Object.keys(parsed[locale] ?? {}).sort();
        if (ids.length !== sourceStrings.length || ids.some((id, index) => id !== `Q${String(index).padStart(3, '0')}`)) throw new Error(`Invalid keys for ${locale}.`);
      }
      await writeFile(outputPath, JSON.stringify(parsed), 'utf8');
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${locales.length} packs × ${sourceStrings.length} strings to a temporary local file.`);
    } catch (error) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message);
    }
    return;
  }
  response.writeHead(404).end('Not found');
});
server.listen(4180, '127.0.0.1', () => process.stdout.write('Swiss coordinate local capture listening on 127.0.0.1:4180\n'));
