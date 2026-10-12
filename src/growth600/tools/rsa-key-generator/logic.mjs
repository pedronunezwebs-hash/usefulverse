export const RSA_GENERATOR_MODULUS_LENGTHS = Object.freeze([2048, 3072, 4096]);
export const RSA_GENERATOR_MAX_CIPHERTEXT_BYTES = 1024;
const encoder = new TextEncoder();

function assertCrypto(cryptoApi) {
  if (!cryptoApi?.subtle) throw new Error('Web Crypto is unavailable. Use a current browser over HTTPS.');
}

function assertModulusLength(value) {
  const length = Number(value);
  if (!RSA_GENERATOR_MODULUS_LENGTHS.includes(length)) throw new RangeError('Choose a supported RSA key size.');
  return length;
}

function base64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return btoa(binary);
}

function decodeBase64(value) {
  if (typeof value !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) throw new TypeError('Ciphertext must be valid base64.');
  const decoded = atob(value);
  if (!decoded.length || decoded.length > RSA_GENERATOR_MAX_CIPHERTEXT_BYTES) throw new RangeError('Ciphertext size is invalid.');
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function pem(label, bytes) {
  const encoded = base64(bytes);
  const lines = encoded.match(/.{1,64}/gu) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

function fingerprint(bytes) {
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0').toUpperCase());
  return `SHA-256:${hex.join(':')}`;
}

export function rsaMessageLimitBytes(modulusLength) {
  const length = assertModulusLength(modulusLength);
  // RSA-OAEP with SHA-256 can encrypt at most k - 2*hLen - 2 bytes.
  return Math.floor(length / 8) - 2 * 32 - 2;
}

export async function generateRsaKeyPair(modulusLength = 2048, cryptoApi = globalThis.crypto) {
  assertCrypto(cryptoApi);
  const bits = assertModulusLength(modulusLength);
  const pair = await cryptoApi.subtle.generateKey({
    name: 'RSA-OAEP', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256',
  }, true, ['encrypt', 'decrypt']);
  const [publicDer, privateDer] = await Promise.all([
    cryptoApi.subtle.exportKey('spki', pair.publicKey),
    cryptoApi.subtle.exportKey('pkcs8', pair.privateKey),
  ]);
  const fingerprintBytes = await cryptoApi.subtle.digest('SHA-256', publicDer);
  const hashBytes = new Uint8Array(fingerprintBytes);
  return Object.freeze({
    publicKey: pair.publicKey,
    privateKey: pair.privateKey,
    modulusLength: bits,
    maxMessageBytes: rsaMessageLimitBytes(bits),
    publicPem: pem('PUBLIC KEY', new Uint8Array(publicDer)),
    privatePem: pem('PRIVATE KEY', new Uint8Array(privateDer)),
    fingerprint: fingerprint(hashBytes),
  });
}

export async function encryptRsaMessage(message, publicKey, cryptoApi = globalThis.crypto, modulusLength = 2048) {
  assertCrypto(cryptoApi);
  if (!publicKey || publicKey.type !== 'public' || publicKey.algorithm?.name !== 'RSA-OAEP') throw new TypeError('Generate an RSA-OAEP key pair first.');
  if (typeof message !== 'string') throw new TypeError('Enter a text message.');
  const bytes = encoder.encode(message);
  const maxBytes = rsaMessageLimitBytes(modulusLength);
  if (bytes.byteLength > maxBytes) throw new RangeError(`Message exceeds the ${maxBytes}-byte limit for this key and SHA-256.`);
  const ciphertext = new Uint8Array(await cryptoApi.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, bytes));
  if (ciphertext.byteLength > RSA_GENERATOR_MAX_CIPHERTEXT_BYTES) throw new RangeError('Encrypted output exceeds the supported size.');
  return base64(ciphertext);
}

export async function decryptRsaMessage(encodedCiphertext, privateKey, cryptoApi = globalThis.crypto) {
  assertCrypto(cryptoApi);
  if (!privateKey || privateKey.type !== 'private' || privateKey.algorithm?.name !== 'RSA-OAEP') throw new TypeError('Generate an RSA-OAEP key pair first.');
  const ciphertext = decodeBase64(encodedCiphertext);
  try {
    const plaintext = await cryptoApi.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, ciphertext);
    return new TextDecoder('utf-8', { fatal: true }).decode(plaintext);
  } catch {
    throw new TypeError('Could not decrypt. The ciphertext may be damaged or belong to a different key.');
  }
}
