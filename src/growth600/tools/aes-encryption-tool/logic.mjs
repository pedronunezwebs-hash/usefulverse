export const AES_TOOL_MAX_TEXT_BYTES = 1 * 1024 * 1024;
export const AES_TOOL_MAX_FILE_BYTES = 8 * 1024 * 1024;
export const AES_TOOL_MAX_CONTAINER_BYTES = 12 * 1024 * 1024;
export const AES_TOOL_ITERATIONS = Object.freeze([310_000, 600_000, 1_000_000]);
export const AES_TOOL_FORMAT = 'usefulverse-aes-gcm';
const encoder = new TextEncoder();

function toBase64(bytes) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(binary);
}

function fromBase64(value) {
  if (typeof value !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) throw new TypeError('The encrypted container is invalid.');
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function assertCrypto(cryptoApi) {
  if (!cryptoApi?.subtle || !cryptoApi?.getRandomValues) throw new Error('Web Crypto is unavailable. Use a current browser over HTTPS.');
}

function assertPassphrase(value) {
  if (typeof value !== 'string' || Array.from(value).length < 12 || Array.from(value).length > 256) throw new RangeError('Use a passphrase between 12 and 256 characters.');
}

function canonicalMetadata(container) {
  return JSON.stringify({
    format: container.format, version: container.version, cipher: container.cipher, kdf: container.kdf,
    iterations: container.iterations, salt: container.salt, iv: container.iv,
    kind: container.kind, name: container.name, mimeType: container.mimeType,
  });
}

async function deriveKey(passphrase, salt, iterations, cryptoApi) {
  const material = await cryptoApi.subtle.importKey('raw', encoder.encode(passphrase.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return cryptoApi.subtle.deriveKey({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

function validatePayload(payload) {
  if (payload?.kind === 'text') {
    if (typeof payload.text !== 'string') throw new TypeError('Enter text to encrypt.');
    const bytes = encoder.encode(payload.text);
    if (!bytes.byteLength || bytes.byteLength > AES_TOOL_MAX_TEXT_BYTES) throw new RangeError('Text must contain 1 byte to 1 MiB.');
    return { kind: 'text', bytes, name: '', mimeType: 'text/plain;charset=utf-8' };
  }
  if (payload?.kind === 'file') {
    if (!(payload.bytes instanceof Uint8Array) || !payload.bytes.byteLength || payload.bytes.byteLength > AES_TOOL_MAX_FILE_BYTES) throw new RangeError('Choose a file from 1 byte to 8 MiB.');
    const name = String(payload.name ?? 'file').trim();
    if (!name || name.length > 180 || /[/\\\u0000-\u001f]/u.test(name)) throw new RangeError('The file name is invalid.');
    const mimeType = String(payload.mimeType ?? 'application/octet-stream').slice(0, 120);
    return { kind: 'file', bytes: new Uint8Array(payload.bytes), name, mimeType };
  }
  throw new TypeError('Choose text or one local file.');
}

export async function encryptAesPayload(payload, passphrase, iterations = 600_000, cryptoApi = globalThis.crypto) {
  assertPassphrase(passphrase);
  assertCrypto(cryptoApi);
  if (!AES_TOOL_ITERATIONS.includes(iterations)) throw new RangeError('Choose one of the supported PBKDF2 work factors.');
  const clean = validatePayload(payload);
  const salt = cryptoApi.getRandomValues(new Uint8Array(16));
  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const container = {
    format: AES_TOOL_FORMAT, version: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-HMAC-SHA-256',
    iterations, salt: toBase64(salt), iv: toBase64(iv), kind: clean.kind, name: clean.name, mimeType: clean.mimeType, ciphertext: '',
  };
  const key = await deriveKey(passphrase, salt, iterations, cryptoApi);
  const ciphertext = await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(canonicalMetadata(container)), tagLength: 128 }, key, clean.bytes);
  container.ciphertext = toBase64(new Uint8Array(ciphertext));
  const serialized = JSON.stringify(container, null, 2);
  if (encoder.encode(serialized).byteLength > AES_TOOL_MAX_CONTAINER_BYTES) throw new RangeError('Encrypted container exceeds the 12 MiB limit.');
  return serialized;
}

export async function decryptAesPayload(serialized, passphrase, cryptoApi = globalThis.crypto) {
  assertPassphrase(passphrase);
  assertCrypto(cryptoApi);
  if (typeof serialized !== 'string' || encoder.encode(serialized).byteLength > AES_TOOL_MAX_CONTAINER_BYTES) throw new RangeError('Encrypted container must be 12 MiB or smaller.');
  let container;
  try { container = JSON.parse(serialized); } catch { throw new TypeError('This is not valid UsefulVerse AES JSON.'); }
  if (!container || container.format !== AES_TOOL_FORMAT || container.version !== 1 || container.cipher !== 'AES-256-GCM' || container.kdf !== 'PBKDF2-HMAC-SHA-256' || !AES_TOOL_ITERATIONS.includes(container.iterations) || !['text', 'file'].includes(container.kind)) throw new TypeError('This encrypted container format is not supported.');
  if (container.kind === 'text' && (container.name !== '' || container.mimeType !== 'text/plain;charset=utf-8')) throw new TypeError('Encrypted text metadata is invalid.');
  if (container.kind === 'file' && (typeof container.name !== 'string' || !container.name || container.name.length > 180 || /[/\\\u0000-\u001f]/u.test(container.name) || typeof container.mimeType !== 'string' || container.mimeType.length > 120)) throw new TypeError('Encrypted file metadata is invalid.');
  const salt = fromBase64(container.salt);
  const iv = fromBase64(container.iv);
  const ciphertext = fromBase64(container.ciphertext);
  const maxBytes = container.kind === 'text' ? AES_TOOL_MAX_TEXT_BYTES : AES_TOOL_MAX_FILE_BYTES;
  if (salt.byteLength !== 16 || iv.byteLength !== 12 || ciphertext.byteLength < 16 || ciphertext.byteLength > maxBytes + 16) throw new TypeError('Encrypted container data is invalid or too large.');
  const key = await deriveKey(passphrase, salt, container.iterations, cryptoApi);
  const plaintext = new Uint8Array(await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(canonicalMetadata(container)), tagLength: 128 }, key, ciphertext));
  if (plaintext.byteLength > maxBytes) throw new RangeError('Decrypted content exceeds the supported size.');
  if (container.kind === 'text') return Object.freeze({ kind: 'text', text: new TextDecoder('utf-8', { fatal: true }).decode(plaintext), name: '', mimeType: container.mimeType });
  return Object.freeze({ kind: 'file', bytes: plaintext, name: container.name, mimeType: container.mimeType });
}
