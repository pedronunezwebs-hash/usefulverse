import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { english } from '../../src/markets-no-ch/copy-en.mjs';

const output = resolve(new URL('../../norway-wealth-tax-translation-captures.json', import.meta.url).pathname);
const sources = [];
function flatten(value) {
  if (typeof value === 'string') sources.push(value);
  else if (Array.isArray(value)) value.forEach(flatten);
  else if (value && typeof value === 'object') Object.values(value).forEach(flatten);
}
flatten(english.norwayWealthTax);
const payload = sources.map((value, index) => `UVROW${String(index + 1).padStart(3, '0')}X|${value}|UVEND${String(index + 1).padStart(3, '0')}X`).join('\n');
const html = `<!doctype html><meta charset="utf-8"><title>Local wealth-tax translation capture</title><label for="payload">Paste locale translation JSON</label><textarea id="payload" rows="30" cols="100"></textarea><button id="save">Save locally</button><pre id="status"></pre><script>document.querySelector('#save').addEventListener('click',async()=>{const r=await fetch('/save',{method:'POST',headers:{'content-type':'application/json'},body:document.querySelector('#payload').value});document.querySelector('#status').textContent=await r.text()})</script>`;

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
    return;
  }
  if (request.method === 'GET' && request.url === '/payload') {
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(payload);
    return;
  }
  if (request.method === 'POST' && request.url === '/save') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const parsed = JSON.parse(body);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('Expected a locale map.');
    let existing = {};
    try { existing = JSON.parse(await readFile(output, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    const merged = { ...existing, ...parsed };
    await writeFile(output, `${JSON.stringify(merged, null, 2)}\n`);
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(`Saved ${Object.keys(parsed).length} locales; ${Object.keys(merged).length} total.`);
    return;
  }
  response.writeHead(404);
  response.end('Not found');
}).listen(4181, '127.0.0.1', () => console.log('Wealth-tax translation capture listening on 127.0.0.1:4181'));
