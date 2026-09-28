import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Cliente local, manual y de solo demanda para Yandex Webmaster.
 * No se carga desde la web ni programa tareas. Los comandos que escriben
 * solo se ejecutan cuando el usuario los invoca expresamente.
 */
export const SITE_ORIGIN = 'https://usefulverse.com';
export const HOST_ID = 'https:usefulverse.com:443';
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const API_BASE = 'https://api.webmaster.yandex.net/v4/';
const root = fileURLToPath(new URL('..', import.meta.url));
const configPath = resolve(root, '.env.yandex');

export function parseEnvFile(contents) {
  const values = {};
  const expectedName = 'YANDEX_WEBMASTER_ACCESS_TOKEN';

  for (const [index, rawLine] of contents.split(/\r?\n/u).entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/u);
    if (!match || match[1] !== expectedName) {
      throw new Error(`Configuración Yandex no válida en la línea ${index + 1}; solo se admite ${expectedName}.`);
    }
    if (Object.hasOwn(values, match[1])) {
      throw new Error(`Configuración Yandex duplicada en la línea ${index + 1}.`);
    }

    let value = match[2].trim();
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }

  return values;
}

export function validatePublicUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('URL no válida.');
  }
  if (
    url.protocol !== 'https:'
    || url.origin !== SITE_ORIGIN
    || url.username
    || url.password
    || url.hash
  ) {
    throw new Error(`Solo se admiten URLs HTTPS de usefulverse.com, sin credenciales ni fragmentos.`);
  }
  return url.href;
}

export class YandexApiError extends Error {
  constructor(status, code = '') {
    const safeCode = /^[A-Z0-9_]{1,80}$/u.test(code) ? code : '';
    const statusHint = status === 401
      ? 'El token local es inválido o ha caducado.'
      : status === 403
        ? 'La cuenta o la aplicación no tiene permiso para esta operación.'
        : status === 404
          ? 'Yandex no encuentra el sitio o su verificación.'
          : status === 409
            ? 'Yandex indica que el recurso ya existe.'
            : 'Revisa el acceso API y el estado del sitio en Yandex Webmaster.';
    super(`Yandex Webmaster respondió HTTP ${status}${safeCode ? ` (${safeCode})` : ''}. ${statusHint}`);
    this.name = 'YandexApiError';
    this.status = status;
    this.code = safeCode;
  }
}

export function createApiClient({ token, fetchImpl = fetch }) {
  if (typeof token !== 'string' || !token || token.trim() !== token || /\s/u.test(token)) {
    throw new Error('Falta YANDEX_WEBMASTER_ACCESS_TOKEN o contiene espacios.');
  }

  return {
    async request(path, { method = 'GET', body } = {}) {
      if (
        typeof path !== 'string'
        || path.startsWith('/')
        || path.startsWith('//')
        || /^[a-z][a-z\d+.-]*:/iu.test(path)
        || path.split('/').includes('..')
      ) {
        throw new Error('Ruta interna de API no válida.');
      }
      const headers = {
        Accept: 'application/json',
        Authorization: `OAuth ${token}`,
      };
      const init = { method, headers };
      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
      }

      init.signal = AbortSignal.timeout(20_000);
      const url = new URL(path, API_BASE);
      if (url.origin !== 'https://api.webmaster.yandex.net' || !url.pathname.startsWith('/v4/')) {
        throw new Error('La petición se ha bloqueado porque sale de la API de Yandex Webmaster.');
      }
      const response = await fetchImpl(url, init);
      const text = await response.text();
      let payload = {};
      if (text) {
        try {
          payload = JSON.parse(text);
        } catch {
          payload = {};
        }
      }
      if (!response.ok) throw new YandexApiError(response.status, payload.error_code);
      return payload;
    },
  };
}

async function loadToken() {
  let info;
  try {
    info = await stat(configPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Falta .env.yandex. Guárdalo localmente y protégelo con chmod 600 .env.yandex.');
    }
    throw error;
  }
  if (process.platform !== 'win32' && (info.mode & 0o077) !== 0) {
    throw new Error('Los permisos de .env.yandex son demasiado abiertos; ejecuta chmod 600 .env.yandex.');
  }

  const values = parseEnvFile(await readFile(configPath, 'utf8'));
  const token = values.YANDEX_WEBMASTER_ACCESS_TOKEN;
  if (!token) throw new Error('Añade YANDEX_WEBMASTER_ACCESS_TOKEN a .env.yandex.');
  return token;
}

async function getSiteContext(api) {
  const user = await api.request('user');
  const userId = String(user.user_id ?? '');
  if (!/^\d+$/u.test(userId)) throw new Error('La respuesta de Yandex no contiene un user_id válido.');

  const hostList = await api.request(`user/${userId}/hosts`);
  const host = hostList.hosts?.find((item) => item.host_id === HOST_ID);
  if (!host) throw new Error(`La cuenta autorizada no tiene el sitio esperado (${HOST_ID}).`);
  const base = `user/${userId}/hosts/${encodeURIComponent(HOST_ID)}`;
  return { userId, host, base };
}

async function assertVerified(api, context) {
  const verification = await api.request(`${context.base}/verification`);
  if (verification.verification_state !== 'VERIFIED') {
    throw new Error(`Yandex no confirma la propiedad; estado actual: ${verification.verification_state ?? 'desconocido'}.`);
  }
  return verification;
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

function sitemapSummary(sitemap) {
  return {
    url: sitemap.sitemap_url,
    source: sitemap.sources,
    lastAccess: sitemap.last_access_date,
    urls: sitemap.urls_count,
    errors: sitemap.errors_count,
    type: sitemap.sitemap_type,
  };
}

export async function runCommand(args, { token, fetchImpl = fetch } = {}) {
  const [command, ...parameters] = args;
  if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log([
      'Comandos manuales de Yandex Webmaster (no se ejecutan en segundo plano):',
      '  status                   verifica acceso, propiedad y sitemap detectado',
      '  sitemaps                 muestra los sitemaps que Yandex conoce',
      '  add-sitemap              registra https://usefulverse.com/sitemap.xml',
      '  quota                    consulta la cuota diaria de rastreo',
      '  queue                    muestra solicitudes de nuevo rastreo',
      '  recrawl <URL>            solicita rastreo de una URL del sitio',
      '  task <UUID>              consulta una solicitud concreta',
    ].join('\n'));
    return;
  }

  const supportedCommands = new Set(['status', 'sitemaps', 'add-sitemap', 'quota', 'queue', 'recrawl', 'task']);
  if (!supportedCommands.has(command)) throw new Error(`Comando no reconocido: ${command}. Usa --help.`);

  let requestedUrl;
  if (command === 'recrawl') {
    if (parameters.length !== 1) throw new Error('Uso: recrawl <URL de UsefulVerse>.');
    requestedUrl = validatePublicUrl(parameters[0]);
  }
  if (command === 'task' && (
    parameters.length !== 1
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(parameters[0])
  )) {
    throw new Error('Uso: task <UUID de la solicitud>.');
  }

  const api = createApiClient({ token: token ?? await loadToken(), fetchImpl });
  const context = await getSiteContext(api);

  if (command === 'status') {
    const verification = await assertVerified(api, context);
    const data = await api.request(`${context.base}/sitemaps?limit=100`);
    console.log(`Sitio: ${HOST_ID}`);
    console.log(`Propiedad verificada: ${verification.verification_state}`);
    console.log(`Sitemaps detectados por Yandex: ${data.sitemaps?.length ?? 0}`);
    printJson((data.sitemaps ?? []).map(sitemapSummary));
    return;
  }

  if (command === 'sitemaps') {
    await assertVerified(api, context);
    const data = await api.request(`${context.base}/sitemaps?limit=100`);
    printJson((data.sitemaps ?? []).map(sitemapSummary));
    return;
  }

  if (command === 'add-sitemap') {
    await assertVerified(api, context);
    try {
      const result = await api.request(`${context.base}/user-added-sitemaps`, {
        method: 'POST',
        body: { url: SITEMAP_URL },
      });
      console.log(`Sitemap añadido a Yandex. ID: ${result.sitemap_id ?? 'recibido'}. Esto no confirma que ya se haya procesado o indexado.`);
    } catch (error) {
      if (error instanceof YandexApiError && error.status === 409 && error.code === 'SITEMAP_ALREADY_ADDED') {
        console.log('Ese sitemap ya estaba añadido en Yandex Webmaster.');
        return;
      }
      throw error;
    }
    return;
  }

  if (command === 'quota') {
    await assertVerified(api, context);
    printJson(await api.request(`${context.base}/recrawl/quota`));
    return;
  }

  if (command === 'queue') {
    await assertVerified(api, context);
    printJson(await api.request(`${context.base}/recrawl/queue?limit=50`));
    return;
  }

  if (command === 'recrawl') {
    await assertVerified(api, context);
    const quota = await api.request(`${context.base}/recrawl/quota`);
    if (!Number.isInteger(quota.quota_remainder) || quota.quota_remainder < 1) {
      throw new Error('Yandex no muestra cuota diaria disponible; no se ha enviado la solicitud.');
    }
    const task = await api.request(`${context.base}/recrawl/queue`, {
      method: 'POST',
      body: { url: requestedUrl },
    });
    console.log(`Solicitud enviada para ${requestedUrl}.`);
    printJson(task);
    console.log('Yandex aún puede tardar en rastrear la página; solicitarlo no garantiza su indexación.');
    return;
  }

  if (command === 'task') {
    await assertVerified(api, context);
    printJson(await api.request(`${context.base}/recrawl/queue/${encodeURIComponent(parameters[0])}`));
    return;
  }

}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  try {
    await runCommand(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
