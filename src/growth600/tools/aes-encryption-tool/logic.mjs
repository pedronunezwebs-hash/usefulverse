export const AES_PBKDF2_ITERATIONS = 600_000;
export const AES_MAX_INPUT_BYTES = 16 * 1024 * 1024;
export const AES_MAX_TEXT_BYTES = 1024 * 1024;
export const AES_MAX_TEXT_ENVELOPE_CHARS = Math.ceil((AES_MAX_TEXT_BYTES + 16) / 3) * 4 + 512;
const MAGIC = new Uint8Array([0x55, 0x56, 0x41, 0x31]); // UVA1
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

function textAad(envelope) {
  return encoder.encode(JSON.stringify({
    format: envelope.format, version: envelope.version, cipher: envelope.cipher,
    kdf: envelope.kdf, iterations: envelope.iterations, salt: envelope.salt, iv: envelope.iv,
  }));
}

function fileAad(header) {
  return encoder.encode(JSON.stringify({
    format: header.format, version: header.version, cipher: header.cipher,
    kdf: header.kdf, iterations: header.iterations, salt: header.salt,
    iv: header.iv, fileName: header.fileName, mimeType: header.mimeType,
  }));
}

function requireCrypto(cryptoApi) {
  if (!cryptoApi?.subtle || typeof cryptoApi.getRandomValues !== 'function') throw new Error('Secure Web Crypto is unavailable. Use a supported browser over HTTPS.');
}

function validatePassword(password) {
  const text = String(password ?? '');
  if ([...text].length < 12) throw new RangeError('Use a passphrase with at least 12 characters.');
  if (encoder.encode(text).byteLength > 1024) throw new RangeError('The passphrase is too long.');
  return text;
}

function bytes(value, label = 'Data') {
  if (!(value instanceof Uint8Array)) throw new TypeError(`${label} must be bytes.`);
  if (value.byteLength > AES_MAX_INPUT_BYTES) throw new RangeError('Input exceeds the local 16 MiB limit.');
  return value;
}

function randomBytes(cryptoApi, length) {
  return cryptoApi.getRandomValues(new Uint8Array(length));
}

async function deriveAesKey(password, salt, cryptoApi) {
  const material = await cryptoApi.subtle.importKey('raw', encoder.encode(validatePassword(password)), 'PBKDF2', false, ['deriveKey']);
  return cryptoApi.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: AES_PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function base64Encode(value) {
  let output = '';
  for (let offset = 0; offset < value.length; offset += 0x8000) output += String.fromCharCode(...value.subarray(offset, offset + 0x8000));
  return btoa(output);
}

function base64Decode(value, maximumBytes = AES_MAX_INPUT_BYTES + 32) {
  if (typeof value !== 'string' || value.length > Math.ceil(maximumBytes / 3) * 4 + 4
    || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) throw new TypeError('Encrypted text is not a supported envelope.');
  const binary = atob(value);
  if (binary.length > maximumBytes) throw new RangeError('Encrypted text exceeds the local size limit.');
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function parseEnvelope(value, expectedType) {
  if (typeof value !== 'string' || value.length > AES_MAX_TEXT_ENVELOPE_CHARS) throw new RangeError('Encrypted text exceeds the local size limit.');
  let envelope;
  try { envelope = JSON.parse(value); } catch { throw new TypeError('Encrypted text is not a supported envelope.'); }
  if (!envelope || envelope.format !== 'usefulverse-aes-gcm-text' || envelope.version !== 1
    || envelope.kdf !== 'PBKDF2-SHA-256' || envelope.cipher !== 'AES-256-GCM'
    || envelope.iterations !== AES_PBKDF2_ITERATIONS || expectedType !== 'text') {
    throw new TypeError('Encrypted text uses an unsupported format or parameters.');
  }
  const salt = base64Decode(envelope.salt, 16);
  const iv = base64Decode(envelope.iv, 12);
  const ciphertext = base64Decode(envelope.ciphertext, AES_MAX_TEXT_BYTES + 16);
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 16) throw new TypeError('Encrypted text envelope is incomplete.');
  return {
    salt, iv, ciphertext,
    aad: textAad({
      format: envelope.format, version: envelope.version, cipher: envelope.cipher,
      kdf: envelope.kdf, iterations: envelope.iterations, salt: envelope.salt, iv: envelope.iv,
    }),
  };
}

function safeFileName(value) {
  const name = String(value ?? 'encrypted-file').replace(/[\\/\0\r\n]/gu, '_').slice(0, 240).trim();
  return name || 'encrypted-file';
}

export async function encryptText(plaintext, password, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const content = encoder.encode(String(plaintext ?? ''));
  if (content.byteLength > AES_MAX_TEXT_BYTES) throw new RangeError('Text exceeds the local 1 MiB limit.');
  const salt = randomBytes(cryptoApi, 16);
  const iv = randomBytes(cryptoApi, 12);
  const key = await deriveAesKey(password, salt, cryptoApi);
  const envelope = {
    format: 'usefulverse-aes-gcm-text', version: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-SHA-256',
    iterations: AES_PBKDF2_ITERATIONS, salt: base64Encode(salt), iv: base64Encode(iv), ciphertext: '',
  };
  const ciphertext = new Uint8Array(await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: textAad(envelope), tagLength: 128 }, key, content));
  envelope.ciphertext = base64Encode(ciphertext);
  return JSON.stringify(envelope);
}

export async function decryptText(envelopeText, password, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const { salt, iv, ciphertext, aad } = parseEnvelope(String(envelopeText ?? ''), 'text');
  const key = await deriveAesKey(password, salt, cryptoApi);
  try {
    const plaintext = await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 }, key, ciphertext);
    return decoder.decode(plaintext);
  } catch { throw new Error('Decryption failed: the passphrase is wrong or the encrypted data was changed.'); }
}

export async function encryptFile(fileBytes, { password, fileName = 'encrypted-file', mimeType = 'application/octet-stream' } = {}, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  const content = bytes(fileBytes);
  const salt = randomBytes(cryptoApi, 16);
  const iv = randomBytes(cryptoApi, 12);
  const key = await deriveAesKey(password, salt, cryptoApi);
  const metadata = {
    format: 'usefulverse-aes-gcm-file', version: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-SHA-256',
    iterations: AES_PBKDF2_ITERATIONS, salt: base64Encode(salt), iv: base64Encode(iv),
    fileName: safeFileName(fileName), mimeType: String(mimeType ?? '').slice(0, 128) || 'application/octet-stream',
  };
  const ciphertext = new Uint8Array(await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: fileAad(metadata), tagLength: 128 }, key, content));
  const header = encoder.encode(JSON.stringify(metadata));
  if (header.length > 4096) throw new RangeError('Encrypted file metadata is too large.');
  const output = new Uint8Array(MAGIC.length + 2 + header.length + ciphertext.length);
  output.set(MAGIC, 0);
  new DataView(output.buffer).setUint16(MAGIC.length, header.length, false);
  output.set(header, MAGIC.length + 2);
  output.set(ciphertext, MAGIC.length + 2 + header.length);
  return output;
}

export async function decryptFile(containerBytes, password, cryptoApi = globalThis.crypto) {
  requireCrypto(cryptoApi);
  if (!(containerBytes instanceof Uint8Array) || containerBytes.length > AES_MAX_INPUT_BYTES + 8192) throw new RangeError('Encrypted file is outside the supported size range.');
  if (containerBytes.length < MAGIC.length + 2 + 16 || !MAGIC.every((value, index) => containerBytes[index] === value)) throw new TypeError('This file is not a supported UsefulVerse encrypted container.');
  const headerLength = new DataView(containerBytes.buffer, containerBytes.byteOffset, containerBytes.byteLength).getUint16(MAGIC.length, false);
  const headerStart = MAGIC.length + 2;
  const ciphertextStart = headerStart + headerLength;
  if (!headerLength || headerLength > 4096 || ciphertextStart + 16 > containerBytes.length) throw new TypeError('Encrypted file header is incomplete.');
  let header;
  try { header = JSON.parse(decoder.decode(containerBytes.subarray(headerStart, ciphertextStart))); } catch { throw new TypeError('Encrypted file header is invalid.'); }
  if (header.format !== 'usefulverse-aes-gcm-file' || header.version !== 1 || header.cipher !== 'AES-256-GCM'
    || header.kdf !== 'PBKDF2-SHA-256' || header.iterations !== AES_PBKDF2_ITERATIONS) throw new TypeError('Encrypted file uses an unsupported format or parameters.');
  const salt = base64Decode(header.salt, 16);
  const iv = base64Decode(header.iv, 12);
  if (salt.length !== 16 || iv.length !== 12) throw new TypeError('Encrypted file parameters are incomplete.');
  if (typeof header.fileName !== 'string' || typeof header.mimeType !== 'string'
    || header.fileName.length > 240 || header.mimeType.length > 128) throw new TypeError('Encrypted file metadata is invalid.');
  const key = await deriveAesKey(password, salt, cryptoApi);
  try {
    const plaintext = await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: fileAad(header), tagLength: 128 }, key, containerBytes.subarray(ciphertextStart));
    return Object.freeze({ bytes: new Uint8Array(plaintext), fileName: safeFileName(header.fileName), mimeType: String(header.mimeType ?? '').slice(0, 128) || 'application/octet-stream' });
  } catch { throw new Error('Decryption failed: the passphrase is wrong or the encrypted data was changed.'); }
}
