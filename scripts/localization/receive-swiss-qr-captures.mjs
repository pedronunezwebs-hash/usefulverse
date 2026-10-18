import { createServer } from 'node:http';
import { writeFile } from 'node:fs/promises';

const outputPath = '/private/tmp/usefulverse-swiss-qr-captures.json';
const html = `<!doctype html><meta charset="utf-8"><title>Local translation capture</title><main><label>Translation JSON<textarea id="data" rows="12" cols="80"></textarea></label><button id="save">Save locally</button><p id="status" role="status"></p><script>document.querySelector('#save').addEventListener('click',async()=>{const response=await fetch('/capture',{method:'POST',headers:{'content-type':'application/json'},body:document.querySelector('#data').value});document.querySelector('#status').textContent=await response.text()})</script></main>`;
const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html);
    return;
  }
  if (request.method === 'POST' && request.url === '/capture') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const parsed = JSON.parse(body);
    await writeFile(outputPath, JSON.stringify(parsed), 'utf8');
    response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }).end(`Saved ${Object.keys(parsed).length} locale packs locally.`);
    return;
  }
  response.writeHead(404).end('Not found');
});
server.listen(4179, '127.0.0.1', () => process.stdout.write('Local capture listening on 127.0.0.1:4179\n'));
