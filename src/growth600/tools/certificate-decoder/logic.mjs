export const CERTIFICATE_LIMITS = Object.freeze({ maxBytes: 1024 * 1024, maxNameValues: 128, maxAlternativeNames: 256 });

const OID_LABELS = Object.freeze({
  '2.5.4.3': 'commonName',
  '2.5.4.6': 'countryName',
  '2.5.4.7': 'localityName',
  '2.5.4.8': 'stateOrProvinceName',
  '2.5.4.9': 'streetAddress',
  '2.5.4.10': 'organizationName',
  '2.5.4.11': 'organizationalUnitName',
  '2.5.4.5': 'serialNumber',
  '1.2.840.113549.1.9.1': 'emailAddress',
});

function fail(code = 'invalid-certificate') { throw new Error(code); }

function readTlv(bytes, offset, boundary = bytes.length) {
  if (!(bytes instanceof Uint8Array) || offset < 0 || offset >= boundary) fail();
  const tag = bytes[offset++];
  if ((tag & 0x1f) === 0x1f || offset >= boundary) fail();
  let length = bytes[offset++];
  if (length & 0x80) {
    const count = length & 0x7f;
    if (count === 0 || count > 4 || offset + count > boundary) fail();
    length = 0;
    for (let i = 0; i < count; i += 1) length = length * 256 + bytes[offset++];
    if (length < 128) fail();
  }
  const start = offset;
  const end = start + length;
  if (!Number.isSafeInteger(end) || end > boundary) fail();
  return { tag, start, end, next: end, value: bytes.subarray(start, end) };
}

function children(bytes, parent, expectedTag) {
  if (expectedTag !== undefined && parent.tag !== expectedTag) fail();
  const result = [];
  let offset = parent.start;
  while (offset < parent.end) {
    const node = readTlv(bytes, offset, parent.end);
    result.push(node);
    if (result.length > 4096) fail();
    offset = node.next;
  }
  if (offset !== parent.end) fail();
  return result;
}

function decodeOid(bytes) {
  if (!bytes.length) fail();
  const subidentifiers = [];
  let value = 0;
  let open = false;
  for (const octet of bytes) {
    value = value * 128 + (octet & 0x7f);
    if (!Number.isSafeInteger(value)) fail();
    open = Boolean(octet & 0x80);
    if (!open) { subidentifiers.push(value); value = 0; }
  }
  if (open || !subidentifiers.length) fail();
  const first = subidentifiers.shift();
  const arcs = [first < 40 ? 0 : first < 80 ? 1 : 2, first < 80 ? first % 40 : first - 80, ...subidentifiers];
  return arcs.join('.');
}

function decodeAsnString(node) {
  const bytes = node.value;
  if (node.tag === 0x0c) return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if ([0x12, 0x13, 0x14, 0x16].includes(node.tag)) return new TextDecoder('windows-1252').decode(bytes);
  if (node.tag === 0x1e) {
    if (bytes.length % 2) fail();
    let text = '';
    for (let i = 0; i < bytes.length; i += 2) text += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
    return text;
  }
  return `[${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(' ')}]`;
}

function readName(bytes, node) {
  const values = [];
  for (const set of children(bytes, node, 0x30)) {
    for (const pair of children(bytes, set, 0x31)) {
      const parts = children(bytes, pair, 0x30);
      if (parts.length !== 2 || parts[0].tag !== 0x06) fail();
      const oid = decodeOid(parts[0].value);
      values.push({ key: OID_LABELS[oid] ?? oid, value: decodeAsnString(parts[1]) });
      if (values.length > CERTIFICATE_LIMITS.maxNameValues) fail();
    }
  }
  return values;
}

function parseCertTime(node) {
  const raw = new TextDecoder('ascii', { fatal: true }).decode(node.value);
  let match;
  if (node.tag === 0x17) {
    match = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/u.exec(raw);
    if (!match) fail();
    const year = Number(match[1]) + (Number(match[1]) >= 50 ? 1900 : 2000);
    return toIsoUtc(year, match.slice(2).map(Number));
  }
  if (node.tag === 0x18) {
    match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/u.exec(raw);
    if (!match) fail();
    return toIsoUtc(Number(match[1]), match.slice(2).map(Number));
  }
  fail();
}

function toIsoUtc(year, parts) {
  const [month, day, hour, minute, second] = parts;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day
    || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute || date.getUTCSeconds() !== second) fail();
  return date.toISOString();
}

function decodeIp(bytes) {
  if (bytes.length === 4) return Array.from(bytes).join('.');
  if (bytes.length !== 16) fail();
  const groups = [];
  for (let i = 0; i < 16; i += 2) groups.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
  return groups.join(':');
}

function readSubjectAlternativeNames(bytes, extension) {
  const fields = children(bytes, extension, 0x30);
  if (![2, 3].includes(fields.length) || fields[0].tag !== 0x06 || decodeOid(fields[0].value) !== '2.5.29.17' || fields.at(-1).tag !== 0x04) return [];
  const der = fields.at(-1).value;
  const sequence = readTlv(der, 0);
  if (sequence.tag !== 0x30 || sequence.next !== der.length) fail();
  return children(der, sequence).map((entry) => {
    if (entry.tag === 0x81) return { type: 'email', value: new TextDecoder('ascii', { fatal: true }).decode(entry.value) };
    if (entry.tag === 0x82) return { type: 'DNS', value: new TextDecoder('ascii', { fatal: true }).decode(entry.value) };
    if (entry.tag === 0x86) return { type: 'URI', value: new TextDecoder('ascii', { fatal: true }).decode(entry.value) };
    if (entry.tag === 0x87) return { type: 'IP', value: decodeIp(entry.value) };
    return null;
  }).filter(Boolean).slice(0, CERTIFICATE_LIMITS.maxAlternativeNames);
}

function findSans(bytes, tbsFields) {
  const extensionWrapper = tbsFields.find((field) => field.tag === 0xa3);
  if (!extensionWrapper) return [];
  const explicit = children(bytes, extensionWrapper);
  if (explicit.length !== 1) fail();
  const extensions = children(bytes, explicit[0], 0x30);
  const sans = [];
  for (const extension of extensions) {
    const fields = children(bytes, extension, 0x30);
    if (fields[0]?.tag !== 0x06 || decodeOid(fields[0].value) !== '2.5.29.17') continue;
    sans.push(...readSubjectAlternativeNames(bytes, extension));
  }
  return sans.slice(0, CERTIFICATE_LIMITS.maxAlternativeNames);
}

export function decodeCertificateDer(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (!bytes.length) fail();
  if (bytes.length > CERTIFICATE_LIMITS.maxBytes) fail('certificate-too-large');
  const certificate = readTlv(bytes, 0);
  if (certificate.tag !== 0x30 || certificate.next !== bytes.length) fail();
  const top = children(bytes, certificate, 0x30);
  if (top.length !== 3 || top[0].tag !== 0x30 || top[1].tag !== 0x30 || top[2].tag !== 0x03) fail();
  const tbs = children(bytes, top[0], 0x30);
  let index = tbs[0]?.tag === 0xa0 ? 1 : 0;
  if (tbs.length < index + 6 || tbs[index].tag !== 0x02) fail();
  const serial = Array.from(tbs[index++].value, (byte) => byte.toString(16).padStart(2, '0')).join('').replace(/^00(?=[0-9a-f]{2})/u, '').toUpperCase();
  index += 1;
  const issuerNode = tbs[index++];
  const validityNode = tbs[index++];
  const subjectNode = tbs[index++];
  if (issuerNode?.tag !== 0x30 || validityNode?.tag !== 0x30 || subjectNode?.tag !== 0x30) fail();
  const validity = children(bytes, validityNode, 0x30);
  if (validity.length !== 2) fail();
  const validityDates = validity.map(parseCertTime);
  const subject = readName(bytes, subjectNode);
  const issuer = readName(bytes, issuerNode);
  const san = findSans(bytes, tbs);
  return Object.freeze({ serialNumber: serial || '00', subject, issuer, notBefore: validityDates[0], notAfter: validityDates[1], alternativeNames: Object.freeze(san) });
}

export function decodeCertificateInput(text) {
  if (typeof text !== 'string' || !text.trim()) fail('empty-input');
  if (text.length > Math.ceil(CERTIFICATE_LIMITS.maxBytes * 1.5) + 1024) fail('certificate-too-large');
  const trimmed = text.trim();
  let base64 = trimmed;
  if (trimmed.includes('-----BEGIN')) {
    const match = /^\s*-----BEGIN CERTIFICATE-----([\s\S]+?)-----END CERTIFICATE-----\s*$/u.exec(trimmed);
    if (!match) fail('invalid-pem');
    base64 = match[1];
  }
  base64 = base64.replace(/\s+/gu, '');
  if (!base64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) fail('invalid-pem');
  const binary = atob(base64);
  if (binary.length > CERTIFICATE_LIMITS.maxBytes) fail('certificate-too-large');
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return { bytes, certificate: decodeCertificateDer(bytes) };
}

export async function sha256Fingerprint(bytes, subtle = globalThis.crypto?.subtle) {
  if (!subtle?.digest) fail('fingerprint-unavailable');
  const digest = new Uint8Array(await subtle.digest('SHA-256', bytes));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, '0').toUpperCase()).join(':');
}
