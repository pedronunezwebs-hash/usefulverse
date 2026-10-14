import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { decryptRsaText, encryptRsaText, generateRsaKeyPair, RSA_MAX_TEXT_BYTES } from './logic.mjs';

test('generates SPKI/PKCS8 PEM and a SHA-256 fingerprint, then encrypts and decrypts locally', async () => {
  const pair = await generateRsaKeyPair({ modulusLength: 2048 }, webcrypto);
  assert.match(pair.publicKeyPem, /^-----BEGIN PUBLIC KEY-----/u);
  assert.match(pair.privateKeyPem, /^-----BEGIN PRIVATE KEY-----/u);
  assert.match(pair.fingerprint, /^SHA-256:[A-Za-z0-9+/]{43}=$/u);
  assert.equal(pair.maxPlaintextBytes, 190);
  const ciphertextBase64 = await encryptRsaText({ publicKeyPem: pair.publicKeyPem, text: 'Local RSA test ✓', modulusLength: 2048 }, webcrypto);
  assert.equal(await decryptRsaText({ privateKeyPem: pair.privateKeyPem, ciphertextBase64 }, webcrypto), 'Local RSA test ✓');
});

test('enforces exact OAEP/SHA-256 byte bounds including multibyte UTF-8', async () => {
  const pair = await generateRsaKeyPair({ modulusLength: 2048 }, webcrypto);
  const allowed = 'a'.repeat(RSA_MAX_TEXT_BYTES[2048]);
  assert.ok(await encryptRsaText({ publicKeyPem: pair.publicKeyPem, text: allowed }, webcrypto));
  await assert.rejects(encryptRsaText({ publicKeyPem: pair.publicKeyPem, text: `${allowed}a` }, webcrypto), /190 UTF-8 bytes/u);
  await assert.rejects(encryptRsaText({ publicKeyPem: pair.publicKeyPem, text: 'é'.repeat(96) }, webcrypto), /190 UTF-8 bytes/u);
});

test('rejects wrong key, tampered ciphertext, unsupported PEM and unavailable crypto', async () => {
  const first = await generateRsaKeyPair({}, webcrypto);
  const second = await generateRsaKeyPair({}, webcrypto);
  const ciphertextBase64 = await encryptRsaText({ publicKeyPem: first.publicKeyPem, text: 'secret' }, webcrypto);
  await assert.rejects(decryptRsaText({ privateKeyPem: second.privateKeyPem, ciphertextBase64 }, webcrypto));
  const damaged = Uint8Array.from(Buffer.from(ciphertextBase64, 'base64')); damaged[0] ^= 1;
  await assert.rejects(decryptRsaText({ privateKeyPem: first.privateKeyPem, ciphertextBase64: Buffer.from(damaged).toString('base64') }, webcrypto));
  await assert.rejects(encryptRsaText({ publicKeyPem: first.privateKeyPem, text: 'x' }, webcrypto), /Expected PUBLIC KEY/u);
  await assert.rejects(generateRsaKeyPair({}, {}), /Web Crypto is unavailable/u);
});

test('supports 3072-bit keys with their larger OAEP plaintext ceiling', async () => {
  const pair = await generateRsaKeyPair({ modulusLength: 3072 }, webcrypto);
  assert.equal(pair.maxPlaintextBytes, 318);
  const encrypted = await encryptRsaText({ publicKeyPem: pair.publicKeyPem, text: 'b'.repeat(318), modulusLength: 3072 }, webcrypto);
  assert.equal((await decryptRsaText({ privateKeyPem: pair.privateKeyPem, ciphertextBase64: encrypted }, webcrypto)).length, 318);
});
