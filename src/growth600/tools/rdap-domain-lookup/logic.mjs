let rdapBootstrapCache;

export async function rdapDomainLookup({ domain }) {
  const raw = String(domain ?? '').trim();
  if (!raw || raw.length > 253 || /[\s/\\:@?#]/u.test(raw)) throw new RangeError('Enter a domain name, not a URL, IP address, port, or path.');
  let hostname;
  try { hostname = new URL(`https://${raw}`).hostname.toLowerCase(); } catch { throw new RangeError('Enter a valid domain name.'); }
  const labels = hostname.split('.');
  if (hostname.length > 253 || labels.length < 2 || labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(label))) throw new RangeError('Enter a valid domain name.');
  const requestOptions = { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(10000) };
  if (!rdapBootstrapCache) {
    rdapBootstrapCache = fetch('https://data.iana.org/rdap/dns.json', { ...requestOptions, headers: { Accept: 'application/json' }, cache: 'default' })
      .then(async (response) => {
        if (!response.ok) throw new TypeError('The IANA RDAP bootstrap list is unavailable.');
        const length = Number(response.headers.get('content-length') || 0);
        if (length > 1_000_000) throw new TypeError('The IANA RDAP bootstrap response exceeded the size limit.');
        const text = await response.text();
        if (text.length > 1_000_000) throw new TypeError('The IANA RDAP bootstrap response exceeded the size limit.');
        return JSON.parse(text);
      })
      .catch((error) => { rdapBootstrapCache = undefined; throw error; });
  }
  const bootstrap = await rdapBootstrapCache;
  if (!Array.isArray(bootstrap.services)) throw new TypeError('The IANA RDAP bootstrap list has an unsupported format.');
  const matches = [];
  for (const service of bootstrap.services) {
    if (!Array.isArray(service) || service.length < 2 || !Array.isArray(service[0]) || !Array.isArray(service[1])) continue;
    for (const suffix of service[0]) {
      if (typeof suffix !== 'string') continue;
      const parts = suffix.toLowerCase().split('.');
      if (parts.length <= labels.length && labels.slice(-parts.length).join('.') === parts.join('.')) matches.push({ length: parts.length, urls: service[1] });
    }
  }
  matches.sort((a, b) => b.length - a.length);
  const bases = matches[0]?.urls ?? [];
  const base = bases.map((candidate) => { try { return new URL(candidate); } catch { return null; } })
    .find((candidate) => candidate?.protocol === 'https:' && !candidate.username && !candidate.password && !candidate.search && !candidate.hash && candidate.pathname.endsWith('/'));
  if (!base) return Object.freeze({ domain: hostname, queryState: 'no-registry', registryHost: '' });
  const rdapUrl = new URL(`domain/${encodeURIComponent(hostname)}`, base);
  if (rdapUrl.origin !== base.origin || !rdapUrl.pathname.startsWith(base.pathname)) throw new TypeError('The IANA RDAP service URL failed validation.');
  let response;
  try { response = await fetch(rdapUrl, { ...requestOptions, headers: { Accept: 'application/rdap+json, application/json' }, redirect: 'error' }); }
  catch { return Object.freeze({ domain: hostname, queryState: 'unavailable', registryHost: base.host }); }
  if (response.status === 404) return Object.freeze({ domain: hostname, queryState: 'not-found', registryHost: base.host });
  if (response.status === 429) return Object.freeze({ domain: hostname, queryState: 'rate-limited', registryHost: base.host });
  if (!response.ok) return Object.freeze({ domain: hostname, queryState: 'unavailable', registryHost: base.host });
  const length = Number(response.headers.get('content-length') || 0);
  if (length > 1_000_000) return Object.freeze({ domain: hostname, queryState: 'response-too-large', registryHost: base.host });
  const text = await response.text();
  if (text.length > 1_000_000) return Object.freeze({ domain: hostname, queryState: 'response-too-large', registryHost: base.host });
  let payload;
  try { payload = JSON.parse(text); } catch { return Object.freeze({ domain: hostname, queryState: 'invalid-response', registryHost: base.host }); }
  if (payload.objectClassName !== 'domain') return Object.freeze({ domain: hostname, queryState: 'invalid-response', registryHost: base.host });
  const strings = (values, limit = 20) => Array.isArray(values) ? values.filter((value) => typeof value === 'string').slice(0, limit).map((value) => value.slice(0, 300)) : [];
  const events = Array.isArray(payload.events) ? payload.events.slice(0, 20).flatMap((event) => typeof event?.eventAction === 'string' && typeof event?.eventDate === 'string' ? [{ action: event.eventAction.slice(0, 120), date: event.eventDate.slice(0, 80) }] : []) : [];
  return Object.freeze({
    domain: hostname,
    queryState: 'ok',
    registryHost: base.host,
    handle: typeof payload.handle === 'string' ? payload.handle.slice(0, 300) : '',
    unicodeName: typeof payload.unicodeName === 'string' ? payload.unicodeName.slice(0, 253) : '',
    status: Object.freeze(strings(payload.status, 20)),
    nameservers: Object.freeze(Array.isArray(payload.nameservers) ? payload.nameservers.slice(0, 20).flatMap((entry) => typeof entry?.ldhName === 'string' ? [entry.ldhName.slice(0, 253)] : []) : []),
    events: Object.freeze(events),
    delegationSigned: typeof payload.secureDNS?.delegationSigned === 'boolean' ? payload.secureDNS.delegationSigned : null,
  });
}
