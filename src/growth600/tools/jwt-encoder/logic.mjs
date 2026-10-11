export const JWT_ENCODER_ALGORITHMS = Object.freeze(['HS256', 'HS384', 'HS512']);
export const JWT_ENCODER_MAX_HEADER_BYTES = 16_384;
export const JWT_ENCODER_MAX_CLAIMS_BYTES = 196_608;
export const JWT_ENCODER_MAX_SECRET_BYTES = 4_096;
const encoder = new TextEncoder();

function base64Url(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function parseObject(value, label, maxBytes) {
  if (typeof value !== 'string') throw new TypeError(`${label} must be JSON text.`);
  if (encoder.encode(value).byteLength > maxBytes) throw new RangeError(`${label} exceeds the supported size.`);
  let object;
  try { object = JSON.parse(value); } catch { throw new TypeError(`${label} is not valid JSON.`); }
  if (!object || typeof object !== 'object' || Array.isArray(object)) throw new TypeError(`${label} must be a JSON object.`);
  return object;
}

function assertCrypto(cryptoApi) {
  if (!cryptoApi?.subtle) throw new Error('Web Crypto is unavailable. Use a current browser over HTTPS.');
}

export async function signJwt({ claimsJson, secret, algorithm = 'HS256', expiresInMinutes = null }, cryptoApi = globalThis.crypto, now = Date.now()) {
  assertCrypto(cryptoApi);
  if (!JWT_ENCODER_ALGORITHMS.includes(algorithm)) throw new RangeError('Choose HS256, HS384 or HS512.');
  if (typeof secret !== 'string' || !secret.length || encoder.encode(secret).byteLength > JWT_ENCODER_MAX_SECRET_BYTES) throw new RangeError('Enter a signing secret up to 4 KiB.');
  if (!Number.isFinite(now) || now < 0) throw new RangeError('The current time is invalid.');
  const claims = parseObject(claimsJson, 'Claims', JWT_ENCODER_MAX_CLAIMS_BYTES);
  const payload = { ...claims };
  if (expiresInMinutes !== null && expiresInMinutes !== '') {
    const minutes = Number(expiresInMinutes);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 5_256_000) throw new RangeError('Expiration must be a whole number of minutes from 1 to 10 years.');
    const issuedAt = Math.floor(now / 1000);
    payload.iat = issuedAt;
    payload.exp = issuedAt + Math.ceil(minutes * 60);
  }
  const header = { alg: algorithm, typ: 'JWT' };
  const headerBytes = encoder.encode(JSON.stringify(header));
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  if (headerBytes.byteLength > JWT_ENCODER_MAX_HEADER_BYTES || payloadBytes.byteLength > JWT_ENCODER_MAX_CLAIMS_BYTES) throw new RangeError('The token data is too large.');
  const signingInput = `${base64Url(headerBytes)}.${base64Url(payloadBytes)}`;
  const hash = `SHA-${algorithm.slice(2)}`;
  const key = await cryptoApi.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash }, false, ['sign']);
  const signature = new Uint8Array(await cryptoApi.subtle.sign('HMAC', key, encoder.encode(signingInput)));
  return Object.freeze({ header: Object.freeze(header), payload: Object.freeze(payload), token: `${signingInput}.${base64Url(signature)}` });
}
