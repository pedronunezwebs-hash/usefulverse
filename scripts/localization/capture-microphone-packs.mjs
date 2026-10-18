import { createServer } from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const outputPath = resolve(repoRoot, 'src/markets-no-ch/microphone-translations.mjs');
const requiredLocales = ['en', 'es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi', 'ar', 'it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'te', 'ha', 'tl', 'ta', 'fa', 'am', 'gu', 'nb'];

const server = createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><meta charset="utf-8"><title>Local pack capture</title><textarea id="p" style="width:95vw;height:75vh"></textarea><button id="s">Save local pack</button><pre id="r"></pre><script>s.onclick=async()=>{const q=await fetch("/save",{method:"POST",headers:{"content-type":"application/json"},body:p.value});r.textContent=await q.text()}</script>');
    return;
  }
  if (request.method !== 'POST' || request.url !== '/save') {
    response.writeHead(404).end('Not found');
    return;
  }
  let body = '';
  request.setEncoding('utf8');
  request.on('data', (chunk) => { body += chunk; });
  request.on('end', () => {
    try {
      const packs = JSON.parse(body);
      const missing = requiredLocales.filter((locale) => !packs[locale] || Object.keys(packs[locale]).length !== 39);
      if (missing.length) throw new Error(`Invalid pack coverage: ${missing.join(', ')}`);
      if (existsSync(outputPath)) throw new Error('Refusing to overwrite an existing translation module');
      writeFileSync(outputPath, `export const microphoneTranslationsByLocale = Object.freeze(${JSON.stringify(packs)});\n`, { flag: 'wx' });
      response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${requiredLocales.length} locales × 39 strings.`);
      server.close();
    } catch (error) {
      response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end(error.message);
    }
  });
});

server.listen(4175, '127.0.0.1', () => console.log('Local capture server ready on 127.0.0.1:4175'));
