// QA only, bound to loopback. Does not emulate Cloudflare routing/headers.
import { createServer } from 'node:http';
import { openPackedBuild } from './packed-build.mjs';
const source = await openPackedBuild(process.argv[2]);
const types = { html: 'text/html', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', svg: 'image/svg+xml', wasm: 'application/wasm', txt: 'text/plain', xml: 'application/xml', png: 'image/png' };
const server = createServer(async (request, response) => {
  try {
    let path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname).slice(1);
    if (!path || path.endsWith('/')) path += 'index.html';
    const file = source.files.get(path);
    if (!file) { response.writeHead(404); response.end('Not found'); return; }
    const bytes = await file.read();
    response.writeHead(200, { 'Content-Type': types[path.split('.').at(-1)] ?? 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': bytes.length });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch { response.writeHead(400); response.end('Invalid request'); }
});
server.listen(0, '127.0.0.1', () => console.log(JSON.stringify({ scope: 'local-packed-build-qa', port: server.address().port, pid: process.pid })));
process.once('SIGINT', () => { server.close(async () => { await source.close(); process.exit(0); }); server.closeAllConnections(); });
