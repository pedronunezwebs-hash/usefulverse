function fail(code) {
  throw Object.assign(new Error(code), { code });
}

function isIpLiteral(host) {
  return host.startsWith('[') && host.endsWith(']')
    || /^\d{1,3}(?:\.\d{1,3}){3}$/u.test(host);
}

function isLocalHostname(host) {
  const name = host.toLowerCase().replace(/\.$/u, '');
  return name === 'localhost'
    || name.endsWith('.localhost')
    || name.endsWith('.local')
    || name.endsWith('.internal')
    || name === 'home.arpa'
    || name.endsWith('.home.arpa')
    || name.endsWith('.test')
    || name.endsWith('.invalid');
}

export function validateCheckUrl(value) {
  const input = String(value ?? '').trim();
  if (!input || input.length > 2048) fail('invalid-url');

  let url;
  try {
    url = new URL(input);
  } catch {
    fail('invalid-url');
  }

  if (url.protocol !== 'https:' || url.username || url.password || !url.hostname) fail('https-only');
  if (isIpLiteral(url.hostname) || isLocalHostname(url.hostname)) fail('private-host');

  url.hash = '';
  return url;
}

export async function checkHttpHead(value, { fetchImpl = globalThis.fetch, timeoutMs = 8000 } = {}) {
  const url = validateCheckUrl(value);
  if (typeof fetchImpl !== 'function') fail('unavailable');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();

  try {
    const response = await fetchImpl(url.href, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'manual',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    const headers = {};
    for (const key of ['content-type', 'content-length', 'cache-control', 'date', 'allow', 'server']) {
      const value = response.headers.get(key);
      if (value) headers[key] = value;
    }

    return Object.freeze({
      host: url.host,
      path: url.pathname,
      status: response.status,
      responseType: response.type,
      ok: response.ok,
      redirect: response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400),
      elapsedMs: Math.round(performance.now() - started),
      headers: Object.freeze(headers),
    });
  } catch (error) {
    if (error?.name === 'AbortError') fail('timeout');
    fail('unreadable-response');
  } finally {
    clearTimeout(timer);
  }
}
