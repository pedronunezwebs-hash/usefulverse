const BOOTSTRAP_URLS = Object.freeze([
  'https://data.iana.org/rdap/ipv4.json',
  'https://data.iana.org/rdap/ipv6.json',
]);
const timeout = () => AbortSignal.timeout(10000);
let bootstrapPromise;

function parseIPv4(value) {
  const parts = value.split('.');
  if (parts.length !== 4 || parts.some((part) => !/^(?:0|[1-9]\d{0,2})$/u.test(part))) return null;
  const octets = parts.map(Number);
  if (octets.some((part) => part > 255)) return null;
  return { family: 4, bits: 32, value: octets.reduce((result, part) => (result << 8n) | BigInt(part), 0n), canonical: octets.join('.') };
}

function parseIPv6(value) {
  let input = value.toLowerCase();
  if (input.startsWith('[') && input.endsWith(']')) input = input.slice(1, -1);
  if (!input || input.includes('%') || !/^[0-9a-f:.]+$/u.test(input)) return null;
  if (input.includes('.')) {
    const splitAt = input.lastIndexOf(':');
    if (splitAt < 0) return null;
    const ipv4 = parseIPv4(input.slice(splitAt + 1));
    if (!ipv4) return null;
    const hi = Number((ipv4.value >> 16n) & 0xffffn).toString(16);
    const lo = Number(ipv4.value & 0xffffn).toString(16);
    input = `${input.slice(0, splitAt)}:${hi}:${lo}`;
  }
  const halves = input.split('::');
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  if ([...left, ...right].some((part) => !/^[0-9a-f]{1,4}$/u.test(part))) return null;
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) return null;
  const groups = [...left, ...Array(missing).fill('0'), ...right];
  if (groups.length !== 8) return null;
  const number = groups.reduce((result, part) => (result << 16n) | BigInt(`0x${part}`), 0n);
  return { family: 6, bits: 128, value: number, canonical: groups.map((part) => Number.parseInt(part, 16).toString(16)).join(':') };
}

export function parseIpAddress(input) {
  const raw = String(input ?? '').trim();
  if (!raw || raw.length > 45 || /[\s/\\?#@]/u.test(raw)) throw new RangeError('Enter one IPv4 or IPv6 address without a URL or network prefix.');
  const ipv4 = parseIPv4(raw);
  const address = ipv4 ?? parseIPv6(raw);
  if (!address) throw new RangeError('Enter a valid IPv4 or IPv6 address.');
  return Object.freeze(address);
}

function cidrRange(value, family) {
  if (typeof value !== 'string') return null;
  const [addressText, prefixText, extra] = value.split('/');
  if (extra !== undefined) return null;
  const address = family === 4 ? parseIPv4(addressText) : parseIPv6(addressText);
  const prefix = prefixText === undefined ? address?.bits : Number(prefixText);
  if (!address || address.family !== family || !Number.isInteger(prefix) || prefix < 0 || prefix > address.bits) return null;
  return { value: address.value, prefix, bits: address.bits };
}

async function loadBootstrap() {
  if (!bootstrapPromise) {
    bootstrapPromise = Promise.all(BOOTSTRAP_URLS.map(async (url) => {
      const response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', cache: 'default', headers: { Accept: 'application/json' }, signal: timeout() });
      if (!response.ok) throw new TypeError('The IANA RDAP address registry is unavailable.');
      if (Number(response.headers.get('content-length') || 0) > 100_000) throw new TypeError('The IANA registry response exceeded the size limit.');
      const body = await response.text();
      if (body.length > 100_000) throw new TypeError('The IANA registry response exceeded the size limit.');
      const data = JSON.parse(body);
      if (!Array.isArray(data.services)) throw new TypeError('The IANA registry has an unsupported format.');
      return data.services;
    })).then((lists) => lists.flat()).catch((error) => { bootstrapPromise = undefined; throw error; });
  }
  return bootstrapPromise;
}

function findRdapBase(services, address) {
  const candidates = [];
  for (const service of services) {
    if (!Array.isArray(service) || !Array.isArray(service[0]) || !Array.isArray(service[1])) continue;
    for (const network of service[0]) {
      const range = cidrRange(network, address.family);
      if (!range) continue;
      const shift = BigInt(range.bits - range.prefix);
      if ((address.value >> shift) === (range.value >> shift)) candidates.push({ prefix: range.prefix, urls: service[1] });
    }
  }
  candidates.sort((a, b) => b.prefix - a.prefix);
  for (const candidate of candidates) {
    for (const raw of candidate.urls) {
      if (typeof raw !== 'string') continue;
      try {
        const url = new URL(raw);
        if (url.protocol === 'https:' && !url.username && !url.password && !url.search && !url.hash && url.pathname.endsWith('/')) return url;
      } catch { /* Ignore malformed URLs from the registry. */ }
    }
  }
  return null;
}

function boundedText(value, max = 300) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }

export async function lookupIpRegistration(input) {
  const address = parseIpAddress(input);
  const services = await loadBootstrap();
  const base = findRdapBase(services, address);
  if (!base) return Object.freeze({ address: address.canonical, queryState: 'no-registry', registryHost: '' });
  const url = new URL(`ip/${address.canonical}`, base);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || url.protocol !== 'https:') throw new TypeError('The selected IANA RDAP service failed URL validation.');
  let response;
  try { response = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', headers: { Accept: 'application/rdap+json, application/json' }, signal: timeout() }); }
  catch { return Object.freeze({ address: address.canonical, queryState: 'unavailable', registryHost: base.host }); }
  if (response.status === 404) return Object.freeze({ address: address.canonical, queryState: 'not-found', registryHost: base.host });
  if (response.status === 429) return Object.freeze({ address: address.canonical, queryState: 'rate-limited', registryHost: base.host });
  if (!response.ok) return Object.freeze({ address: address.canonical, queryState: 'unavailable', registryHost: base.host });
  if (Number(response.headers.get('content-length') || 0) > 1_000_000) return Object.freeze({ address: address.canonical, queryState: 'response-too-large', registryHost: base.host });
  const text = await response.text();
  if (text.length > 1_000_000) return Object.freeze({ address: address.canonical, queryState: 'response-too-large', registryHost: base.host });
  let data;
  try { data = JSON.parse(text); } catch { return Object.freeze({ address: address.canonical, queryState: 'invalid-response', registryHost: base.host }); }
  if (data.objectClassName !== 'ip network') return Object.freeze({ address: address.canonical, queryState: 'invalid-response', registryHost: base.host });
  return Object.freeze({
    address: address.canonical,
    queryState: 'ok',
    registryHost: base.host,
    networkName: boundedText(data.name),
    handle: boundedText(data.handle),
    startAddress: boundedText(data.startAddress, 45),
    endAddress: boundedText(data.endAddress, 45),
    country: boundedText(data.country, 2).toUpperCase(),
    networkType: boundedText(data.type),
    status: Object.freeze(Array.isArray(data.status) ? data.status.filter((item) => typeof item === 'string').slice(0, 20).map((item) => item.slice(0, 120)) : []),
  });
}
