const MAX_PLAYLIST_BYTES = 256 * 1024;
const MAX_STATIONS = 500;
const RESULT_LIMIT = 30;

function safeStreamUrl(value) {
  try {
    const url = new URL(String(value).trim());
    const host = url.hostname.toLowerCase();
    const ipLiteral = host.includes(':') || /^\d{1,3}(?:\.\d{1,3}){3}$/u.test(host);
    if (url.protocol !== 'https:' || (url.port && url.port !== '443') || url.username || url.password || !host.includes('.') || ipLiteral
      || host.endsWith('.local') || host.endsWith('.localhost')) return '';
    return url.href;
  } catch { return ''; }
}

function parseAttributes(value) {
  const attributes = {};
  for (const match of value.matchAll(/([\w-]+)="([^"]*)"/gu)) attributes[match[1].toLowerCase()] = match[2];
  return attributes;
}

export function parseRadioPlaylist(source) {
  const text = String(source ?? '');
  if (new TextEncoder().encode(text).byteLength > MAX_PLAYLIST_BYTES) throw new RangeError('playlist-too-large');
  const lines = text.replace(/^\uFEFF/u, '').split(/\r?\n/u).map((line) => line.trim());
  if (!lines[0]?.toUpperCase().startsWith('#EXTM3U')) throw new TypeError('invalid-playlist');
  const stations = [];
  let pending = null;
  for (const line of lines.slice(1)) {
    if (!line) continue;
    if (line.toUpperCase().startsWith('#EXTINF:')) {
      let quoted = false;
      let comma = -1;
      for (let index = 8; index < line.length; index += 1) {
        if (line[index] === '"') quoted = !quoted;
        else if (line[index] === ',' && !quoted) { comma = index; break; }
      }
      const metadata = comma >= 0 ? line.slice(8, comma) : line.slice(8);
      const attributes = parseAttributes(metadata);
      const name = (comma >= 0 ? line.slice(comma + 1) : attributes['tvg-name'] ?? '').trim();
      pending = { name: name.slice(0, 160), country: (attributes['tvg-country'] ?? attributes['tvg-country-code'] ?? '').trim().slice(0, 80), language: (attributes['tvg-language'] ?? '').trim().slice(0, 80), tags: (attributes['group-title'] ?? '').trim().slice(0, 120) };
      continue;
    }
    if (line.startsWith('#')) continue;
    if (!pending) continue;
    const url = safeStreamUrl(line);
    if (url && pending.name) stations.push(Object.freeze({ ...pending, url }));
    pending = null;
    if (stations.length > MAX_STATIONS) throw new RangeError('too-many-stations');
  }
  if (!stations.length) throw new TypeError('no-valid-stations');
  return Object.freeze(stations);
}

export function filterRadioStations(stations, filters = {}) {
  const query = String(filters.station ?? '').trim().toLocaleLowerCase();
  const country = String(filters.country ?? '').trim().toUpperCase();
  const language = String(filters.language ?? '').trim().toLocaleLowerCase();
  const tag = String(filters.tag ?? '').trim().toLocaleLowerCase();
  if (!query && !country && !language && !tag) throw new TypeError('empty-filter');
  if (country && !/^[A-Z]{2}$/u.test(country)) throw new TypeError('invalid-country');
  return Object.freeze(stations.filter((station) => (!query || station.name.toLocaleLowerCase().includes(query))
    && (!country || station.country.toUpperCase().split(/[;,\s]+/u).includes(country))
    && (!language || station.language.toLocaleLowerCase().includes(language))
    && (!tag || station.tags.toLocaleLowerCase().includes(tag))).slice(0, RESULT_LIMIT));
}

export const radioPlaylistLimits = Object.freeze({ maxBytes: MAX_PLAYLIST_BYTES, maxStations: MAX_STATIONS, resultLimit: RESULT_LIMIT });
