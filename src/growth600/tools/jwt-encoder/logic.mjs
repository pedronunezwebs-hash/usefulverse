const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
export const JWT_MAX_JSON_BYTES = 64 * 1024;
export const JWT_MAX_TOKEN_CHARS = 128 * 1024;

function requireCrypto(cryptoApi) {
  if (!cryptoApi?.subtle) throw new Error('Secure Web Crypto is unavailable. Use a supported browser over HTTPS.');
}

function secretBytes(secret) {
  const value = String(secret ?? '');
  const bytes = encoder.encode(value);
  if (bytes.length < 32) throw new RangeError('HS256 requires a secret of at least 32 UTF-8 bytes.');
  if (bytes.length > 1024) throw new RangeError('The secret is too long.');
  return bytes;
}

function plainObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${label} must be a JSON object.`);
  return value;
}

function parsePayload(payloadText) {
  if (typeof payloadText !== 'string' || encoder.encode(payloadText).length > JWT_MAX_JSON_BYTES) throw new RangeError('JWT JSON input exceeds the 64 KiB local limit.');
  let payload;
  try { payload = JSON.parse(payloadText); } catch { throw new TypeError('Payload must be valid JSON.'); }
  return plainObject(payload, 'Payload');
}

function base64UrlEncode(value) {
  let binary = '';
  for (let offset = 0; offset < value.length; offset += 0x8000) binary += String.fromCharCode(...value.subarray(offset, offset + 0x8000));
  return btoa(binary).replace(/=/gu, '').replace(/\+/gu, '-').replace(/\//gu, '_');
}

function base64UrlDecode(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/u.test(value) || value.length > JWT_MAX_TOKEN_CHARS) throw new TypeError('JWT has invalid base64url data.');
  const base64 = value.replace(/-/gu, '+').replace(/_/gu, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importHmacKey(secret, cryptoApi) {
  return cryptoApi.subtle.importKey('raw', secretBytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function createJwt({ payloadText, secret, expiresInSeconds = '', nowSeconds = Math.floor(Date.now() / 1000) } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const payload = { ...parsePayload(payloadText) };
  if (expiresInSeconds !== '' && expiresInSeconds !== null && expiresInSeconds !== undefined) {
    const duration = Number(expiresInSeconds);
    if (!Number.isSafeInteger(duration) || duration < 1 || duration > 31_536_000) throw new RangeError('Expiration must be from 1 second to 365 days.');
    if (Object.hasOwn(payload, 'exp')) throw new TypeError('Remove the existing exp claim or leave the expiration field empty.');
    payload.exp = Math.floor(Number(nowSeconds)) + duration;
  }
  const header = { alg: 'HS256', typ: 'JWT' };
  const unsigned = `${base64UrlEncode(encoder.encode(JSON.stringify(header)))}.${base64UrlEncode(encoder.encode(JSON.stringify(payload)))}`;
  const key = await importHmacKey(secret, cryptoApi);
  const signature = new Uint8Array(await cryptoApi.subtle.sign('HMAC', key, encoder.encode(unsigned)));
  return Object.freeze({ token: `${unsigned}.${base64UrlEncode(signature)}`, header, payload });
}

function timeStatus(payload, nowSeconds) {
  for (const claim of ['exp', 'nbf', 'iat']) {
    if (Object.hasOwn(payload, claim) && (typeof payload[claim] !== 'number' || !Number.isFinite(payload[claim]))) throw new TypeError(`${claim} must be a NumericDate number in seconds.`);
  }
  if (typeof payload.exp === 'number' && nowSeconds >= payload.exp) return 'expired';
  if (typeof payload.nbf === 'number' && nowSeconds < payload.nbf) return 'not-yet-valid';
  if (typeof payload.exp === 'number' || typeof payload.nbf === 'number') return 'within-time-window';
  return 'no-time-claims';
}

export async function verifyJwt(token, secret, { nowSeconds = Math.floor(Date.now() / 1000) } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const value = String(token ?? '');
  if (value.length > JWT_MAX_TOKEN_CHARS) throw new RangeError('JWT exceeds the 128 KiB local limit.');
  const parts = value.split('.');
  if (parts.length !== 3 || parts.some((part) => !part)) throw new TypeError('JWT must contain three non-empty segments.');
  let header;
  let payload;
  try {
    header = plainObject(JSON.parse(decoder.decode(base64UrlDecode(parts[0]))), 'Header');
    payload = plainObject(JSON.parse(decoder.decode(base64UrlDecode(parts[1]))), 'Payload');
  } catch (error) { throw new TypeError(`JWT JSON is invalid: ${error.message}`); }
  if (header.alg !== 'HS256' || (header.typ !== undefined && header.typ !== 'JWT') || Object.hasOwn(header, 'crit') || Object.hasOwn(header, 'b64')) throw new TypeError('Only standard HS256 JWT headers are supported.');
  const signature = base64UrlDecode(parts[2]);
  if (signature.length !== 32) throw new TypeError('HS256 signature must be 32 bytes.');
  const key = await importHmacKey(secret, cryptoApi);
  const valid = await cryptoApi.subtle.verify('HMAC', key, signature, encoder.encode(`${parts[0]}.${parts[1]}`));
  if (!valid) throw new Error('JWT signature is invalid for this secret.');
  return Object.freeze({ header, payload, signatureValid: true, timeStatus: timeStatus(payload, Math.floor(Number(nowSeconds))) });
}
