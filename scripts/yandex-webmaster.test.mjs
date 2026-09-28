import assert from 'node:assert/strict';
import test from 'node:test';
import { createApiClient, parseEnvFile, runCommand, validatePublicUrl } from './yandex-webmaster.mjs';

test('parsea la configuración local sin ejecutar contenido', () => {
  assert.deepEqual(
    parseEnvFile('# local only\nYANDEX_WEBMASTER_ACCESS_TOKEN=abc123==\n'),
    { YANDEX_WEBMASTER_ACCESS_TOKEN: 'abc123==' },
  );
});

test('rechaza claves duplicadas y líneas no compatibles', () => {
  assert.throws(
    () => parseEnvFile('YANDEX_WEBMASTER_ACCESS_TOKEN=one\nYANDEX_WEBMASTER_ACCESS_TOKEN=two'),
    /duplicada/u,
  );
  assert.throws(() => parseEnvFile('TOKEN=anything'), /línea 1/u);
});

test('solo permite URLs HTTPS del dominio UsefulVerse', () => {
  assert.equal(
    validatePublicUrl('https://usefulverse.com/tools/percentage-calculator/'),
    'https://usefulverse.com/tools/percentage-calculator/',
  );
  for (const value of [
    'http://usefulverse.com/',
    'https://www.usefulverse.com/',
    'https://usefulverse.com.evil.test/',
    'https://user@usefulverse.com/',
    'https://usefulverse.com/#section',
  ]) {
    assert.throws(() => validatePublicUrl(value), /HTTPS de usefulverse\.com/u);
  }
  assert.throws(() => validatePublicUrl('not a URL'), /URL no válida/u);
});

test('envía el token solo como encabezado OAuth y devuelve JSON', async () => {
  let captured;
  const api = createApiClient({
    token: 'sensitive-token',
    fetchImpl: async (url, init) => {
      captured = { url: String(url), init };
      return new Response('{"user_id":123}', { status: 200 });
    },
  });

  assert.deepEqual(await api.request('user'), { user_id: 123 });
  assert.equal(captured.url, 'https://api.webmaster.yandex.net/v4/user');
  assert.equal(captured.init.headers.Authorization, 'OAuth sensitive-token');
  assert.equal(captured.init.headers.Accept, 'application/json');
});

test('los errores de API no revelan el token ni mensajes devueltos por Yandex', async () => {
  const token = 'sensitive-token';
  const api = createApiClient({
    token,
    fetchImpl: async () => new Response(JSON.stringify({
      error_code: 'INVALID_TOKEN',
      error_message: `debug ${token}`,
    }), { status: 401 }),
  });

  await assert.rejects(api.request('user'), (error) => {
    assert.equal(error.status, 401);
    assert.equal(error.code, 'INVALID_TOKEN');
    assert.equal(error.message.includes(token), false);
    assert.equal(error.message.includes('debug'), false);
    return true;
  });
});

test('no permite que una ruta API desvíe el token a otro origen', async () => {
  const api = createApiClient({ token: 'sensitive-token', fetchImpl: async () => { throw new Error('No debe llamarse'); } });
  await assert.rejects(api.request('https://example.org/collect'), /Ruta interna de API no válida/u);
  await assert.rejects(api.request('//example.org/collect'), /Ruta interna de API no válida/u);
});

test('añade solo el sitemap fijo de UsefulVerse tras verificar la propiedad', async () => {
  const calls = [];
  const api = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith('/v4/user')) return Response.json({ user_id: 123 });
    if (String(url).endsWith('/v4/user/123/hosts')) {
      return Response.json({ hosts: [{ host_id: 'https:usefulverse.com:443' }] });
    }
    if (String(url).endsWith('/verification')) return Response.json({ verification_state: 'VERIFIED' });
    if (String(url).endsWith('/user-added-sitemaps')) return Response.json({ sitemap_id: 'sitemap-1' }, { status: 201 });
    throw new Error(`Unexpected test URL: ${url}`);
  };
  const originalLog = console.log;
  console.log = () => {};
  try {
    await runCommand(['add-sitemap'], { token: 'test-token', fetchImpl: api });
  } finally {
    console.log = originalLog;
  }

  const write = calls.find(({ init }) => init.method === 'POST');
  assert.ok(write);
  assert.equal(write.init.headers.Authorization, 'OAuth test-token');
  assert.deepEqual(JSON.parse(write.init.body), { url: 'https://usefulverse.com/sitemap.xml' });
});

test('no solicita rastrear otra web aunque se invoque recrawl', async () => {
  const methods = [];
  const fetchImpl = async (_url, init) => {
    methods.push(init.method);
    return Response.json({ user_id: 123 });
  };
  await assert.rejects(
    runCommand(['recrawl', 'https://example.org/'], { token: 'test-token', fetchImpl }),
    /HTTPS de usefulverse\.com/u,
  );
  assert.deepEqual(methods, []);
});

test('no envía recrawl cuando Yandex informa que la cuota diaria está agotada', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    const href = String(url);
    calls.push({ href, method: init.method });
    if (href.endsWith('/v4/user')) return Response.json({ user_id: 123 });
    if (href.endsWith('/v4/user/123/hosts')) {
      return Response.json({ hosts: [{ host_id: 'https:usefulverse.com:443' }] });
    }
    if (href.endsWith('/verification')) return Response.json({ verification_state: 'VERIFIED' });
    if (href.endsWith('/recrawl/quota')) return Response.json({ daily_quota: 1, quota_remainder: 0 });
    throw new Error(`Unexpected test URL: ${href}`);
  };

  await assert.rejects(
    runCommand(['recrawl', 'https://usefulverse.com/tools/percentage-calculator/'], { token: 'test-token', fetchImpl }),
    /cuota diaria disponible/u,
  );
  assert.equal(calls.some(({ method }) => method === 'POST'), false);
});
