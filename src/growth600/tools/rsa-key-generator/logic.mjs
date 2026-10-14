const encoder = new TextEncoder();
export const RSA_MAX_TEXT_BYTES = Object.freeze({ 2048: 190, 3072: 318 });
const PUBLIC_PEM_HEADER = '-----BEGIN PUBLIC KEY-----';
const PRIVATE_PEM_HEADER = '-----BEGIN PRIVATE KEY-----';

function requireCrypto(cryptoApi) {
  if (!cryptoApi?.subtle || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('Web Crypto is unavailable. Use a current browser over HTTPS.');
  }
}

function base64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function decodeBase64(value, maxBytes = 16 * 1024) {
  const text = String(value ?? '').replace(/-----[^-]+-----/gu, '').replace(/\s/gu, '');
  if (!text || text.length > Math.ceil(maxBytes / 3) * 4 + 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(text)) {
    throw new TypeError('The key is not valid supported PEM or Base64.');
  }
  const decoded = atob(text);
  if (decoded.length > maxBytes) throw new RangeError('The key is larger than the supported limit.');
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

function pem(label, bytes) {
  const body = base64(new Uint8Array(bytes)).match(/.{1,64}/gu).join('\n');
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
}

function keyBytes(pemText, label) {
  const text = String(pemText ?? '').trim();
  const header = label === 'PUBLIC KEY' ? PUBLIC_PEM_HEADER : PRIVATE_PEM_HEADER;
  const footer = `-----END ${label}-----`;
  if (text.startsWith('-----BEGIN RSA ') || text.includes('CERTIFICATE')) throw new TypeError('Use SPKI PUBLIC KEY or PKCS8 PRIVATE KEY PEM, not PKCS#1 or a certificate.');
  if (!text.startsWith(header) || !text.endsWith(footer)) throw new TypeError(`Expected ${label} PEM (SPKI/PKCS8).`);
  return decodeBase64(text.slice(header.length, -footer.length));
}

function maxBytesFor(bits) {
  const maximum = RSA_MAX_TEXT_BYTES[bits];
  if (!maximum) throw new RangeError('Choose an RSA key size of 2048 or 3072 bits.');
  return maximum;
}

export async function generateRsaKeyPair({ modulusLength = 2048 } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const bits = Number(modulusLength);
  maxBytesFor(bits);
  const pair = await cryptoApi.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: bits, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['encrypt', 'decrypt']);
  const publicDer = new Uint8Array(await cryptoApi.subtle.exportKey('spki', pair.publicKey));
  const privateDer = new Uint8Array(await cryptoApi.subtle.exportKey('pkcs8', pair.privateKey));
  const fingerprint = base64(new Uint8Array(await cryptoApi.subtle.digest('SHA-256', publicDer)));
  return Object.freeze({
    modulusLength: bits,
    publicKeyPem: pem('PUBLIC KEY', publicDer),
    privateKeyPem: pem('PRIVATE KEY', privateDer),
    fingerprint: `SHA-256:${fingerprint}`,
    maxPlaintextBytes: maxBytesFor(bits),
  });
}

export async function encryptRsaText({ publicKeyPem, text, modulusLength = 2048 } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const bits = Number(modulusLength);
  const plain = encoder.encode(String(text ?? ''));
  const maximum = maxBytesFor(bits);
  if (!plain.length) throw new TypeError('Enter text to encrypt.');
  if (plain.length > maximum) throw new RangeError(`RSA-${bits} with OAEP/SHA-256 can encrypt at most ${maximum} UTF-8 bytes at once.`);
  const key = await cryptoApi.subtle.importKey('spki', keyBytes(publicKeyPem, 'PUBLIC KEY'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  return base64(new Uint8Array(await cryptoApi.subtle.encrypt({ name: 'RSA-OAEP' }, key, plain)));
}

export async function decryptRsaText({ privateKeyPem, ciphertextBase64 } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const ciphertext = decodeBase64(ciphertextBase64, 2048);
  const key = await cryptoApi.subtle.importKey('pkcs8', keyBytes(privateKeyPem, 'PRIVATE KEY'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
  const plain = await cryptoApi.subtle.decrypt({ name: 'RSA-OAEP' }, key, ciphertext);
  return new TextDecoder('utf-8', { fatal: true }).decode(plain);
}
