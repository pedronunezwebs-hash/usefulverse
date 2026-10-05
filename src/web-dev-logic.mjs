const MAX_URL_LENGTH = 4096;
const MAX_HEADER_COUNT = 40;
const MAX_HEADER_VALUE = 2048;
const MAX_BODY_LENGTH = 100_000;

function safeTarget(value) {
  const text = String(value ?? '').trim();
  if (!text || text.length > MAX_URL_LENGTH) throw new TypeError('Enter a URL up to 4,096 characters.');
  let url;
  try { url = new URL(text); } catch { throw new TypeError('Enter a complete HTTP or HTTPS URL.'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new TypeError('Use an HTTP or HTTPS URL without embedded credentials.');
  return url.href;
}

function normalizeHeaders(value) {
  let parsed;
  try { parsed = JSON.parse(String(value || '{}')); } catch { throw new TypeError('Headers must be a valid JSON object.'); }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new TypeError('Headers must be a JSON object of names and values.');
  const entries = Object.entries(parsed);
  if (entries.length > MAX_HEADER_COUNT) throw new RangeError(`Use no more than ${MAX_HEADER_COUNT} headers.`);
  return entries.map(([name, raw]) => {
    const value = String(raw);
    if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/u.test(name)) throw new TypeError(`Invalid header name: ${name}`);
    if (value.length > MAX_HEADER_VALUE || /[\r\n]/u.test(value)) throw new TypeError(`Invalid value for header: ${name}`);
    return [name, value];
  });
}

const shellQuote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;

export function buildApiRequest({ url, method = 'GET', headers = '{}', body = '', output = 'curl' } = {}) {
  const target = safeTarget(url);
  const verb = String(method).toUpperCase();
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(verb)) throw new TypeError('Choose a supported HTTP method.');
  const headerEntries = normalizeHeaders(headers);
  const payload = String(body ?? '');
  if (payload.length > MAX_BODY_LENGTH) throw new RangeError(`Request body is limited to ${MAX_BODY_LENGTH.toLocaleString('en-US')} characters.`);
  if (['GET', 'HEAD'].includes(verb) && payload.trim()) throw new TypeError(`${verb} requests cannot include a request body here.`);
  if (!['curl', 'fetch'].includes(output)) throw new TypeError('Choose cURL or Fetch output.');
  if (output === 'curl') {
    const parts = ['curl', '--request', verb];
    for (const [name, value] of headerEntries) parts.push('--header', shellQuote(`${name}: ${value}`));
    if (payload) parts.push('--data-raw', shellQuote(payload));
    parts.push(shellQuote(target));
    return parts.join(' ');
  }
  const options = { method: verb };
  if (headerEntries.length) options.headers = Object.fromEntries(headerEntries);
  if (payload) options.body = payload;
  return `fetch(${JSON.stringify(target)}, ${JSON.stringify(options, null, 2)});`;
}

const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function createHtmlTable({ data, headers = true, caption = '' } = {}) {
  const source = String(data ?? '');
  if (!source.trim()) throw new TypeError('Paste tab-separated rows to create a table.');
  if (source.length > 20_000) throw new RangeError('Table input is limited to 20,000 characters.');
  const rows = source.replace(/\r\n?/gu, '\n').split('\n').filter((line) => line.length > 0).map((line) => line.split('\t'));
  if (!rows.length || rows.length > 100) throw new RangeError('Use between 1 and 100 table rows.');
  const columns = rows[0].length;
  if (!columns || columns > 20 || rows.some((row) => row.length !== columns)) throw new RangeError('Use the same 1–20 tab-separated columns in every row.');
  if (rows.some((row) => row.some((cell) => cell.length > 2_000))) throw new RangeError('Each cell is limited to 2,000 characters.');
  const title = String(caption ?? '').trim();
  if (title.length > 160) throw new RangeError('Caption is limited to 160 characters.');
  const head = headers ? `<thead>\n<tr>${rows[0].map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join('')}</tr>\n</thead>\n` : '';
  const bodyRows = (headers ? rows.slice(1) : rows).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`);
  if (!bodyRows.length) throw new TypeError('Add at least one data row after the heading row.');
  const captionMarkup = title ? `<caption>${escapeHtml(title)}</caption>\n` : '';
  return `<table>\n${captionMarkup}${head}<tbody>\n${bodyRows.join('\n')}\n</tbody>\n</table>`;
}

const validColor = (value, field) => {
  const text = String(value ?? '').trim();
  if (!/^#[\da-f]{6}$/iu.test(text)) throw new TypeError(`${field} must be a six-digit hexadecimal color, such as #ffffff.`);
  return text.toLowerCase();
};

export function createPwaManifest({ name, shortName, description = '', startUrl = '/', display = 'standalone', themeColor = '#ffffff', backgroundColor = '#ffffff' } = {}) {
  const cleanName = String(name ?? '').trim();
  const cleanShort = String(shortName ?? '').trim();
  const cleanDescription = String(description ?? '').trim();
  if (!cleanName || cleanName.length > 80) throw new TypeError('App name is required and must be 80 characters or fewer.');
  if (!cleanShort || cleanShort.length > 30) throw new TypeError('Short name is required and must be 30 characters or fewer.');
  if (cleanDescription.length > 200) throw new RangeError('Description is limited to 200 characters.');
  const start = String(startUrl ?? '').trim();
  if (!start.startsWith('/') || start.startsWith('//') || start.split(/[?#]/u)[0].split('/').includes('..') || /[\u0000-\u001f]/u.test(start)) throw new TypeError('Start URL must be a same-site path beginning with / and cannot contain .. segments.');
  if (!['standalone', 'minimal-ui', 'fullscreen', 'browser'].includes(display)) throw new TypeError('Choose a supported display mode.');
  return JSON.stringify({
    name: cleanName,
    short_name: cleanShort,
    ...(cleanDescription ? { description: cleanDescription } : {}),
    start_url: start,
    display,
    theme_color: validColor(themeColor, 'Theme color'),
    background_color: validColor(backgroundColor, 'Background color'),
  }, null, 2);
}
