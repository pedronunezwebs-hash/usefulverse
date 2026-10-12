import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { decryptRsaMessage, encryptRsaMessage, generateRsaKeyPair, rsaMessageLimitBytes } from './logic.mjs';

test('RSA key generator returns interoperable PEM formats and a SHA-256 public-key fingerprint', async () => {
  const keys = await generateRsaKeyPair(2048, webcrypto);
  assert.match(keys.publicPem, /^-----BEGIN PUBLIC KEY-----[\s\S]+-----END PUBLIC KEY-----$/u);
  assert.match(keys.privatePem, /^-----BEGIN PRIVATE KEY-----[\s\S]+-----END PRIVATE KEY-----$/u);
  assert.match(keys.fingerprint, /^SHA-256:(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/u);
  assert.equal(keys.modulusLength, 2048);
  assert.equal(keys.maxMessageBytes, 190);
  const publicDer = await webcrypto.subtle.exportKey('spki', keys.publicKey);
  const publicDigest = new Uint8Array(await webcrypto.subtle.digest('SHA-256', publicDer));
  assert.equal(keys.fingerprint, `SHA-256:${Array.from(publicDigest, (byte) => byte.toString(16).padStart(2, '0').toUpperCase()).join(':')}`);
  const publicKey = await webcrypto.subtle.importKey('spki', pemBytes(keys.publicPem, 'PUBLIC KEY'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const privateKey = await webcrypto.subtle.importKey('pkcs8', pemBytes(keys.privatePem, 'PRIVATE KEY'), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
  assert.equal(await decryptRsaMessage(await encryptRsaMessage('UsefulVerse RSA 🔐', publicKey, webcrypto, 2048), privateKey, webcrypto), 'UsefulVerse RSA 🔐');
});

test('RSA-OAEP message limits use UTF-8 bytes and reject oversized plaintext', async () => {
  assert.equal(rsaMessageLimitBytes(2048), 190);
  assert.equal(rsaMessageLimitBytes(3072), 318);
  assert.equal(rsaMessageLimitBytes(4096), 446);
  const keys = await generateRsaKeyPair(2048, webcrypto);
  assert.equal((await encryptRsaMessage('ñ'.repeat(95), keys.publicKey, webcrypto, 2048)).length > 0, true);
  await assert.rejects(encryptRsaMessage('ñ'.repeat(96), keys.publicKey, webcrypto, 2048), /190-byte limit/u);
  assert.throws(() => rsaMessageLimitBytes(1024), /supported RSA key size/u);
  await assert.rejects(generateRsaKeyPair(1024, webcrypto), /supported RSA key size/u);
});

test('RSA decryption rejects malformed or mismatched ciphertext without leaking plaintext', async () => {
  const first = await generateRsaKeyPair(2048, webcrypto);
  const other = await generateRsaKeyPair(2048, webcrypto);
  const cipher = await encryptRsaMessage('local secret', first.publicKey, webcrypto, 2048);
  await assert.rejects(decryptRsaMessage('not-base64!', first.privateKey, webcrypto), /valid base64/u);
  await assert.rejects(decryptRsaMessage(cipher, other.privateKey, webcrypto), /different key/u);
});

function pemBytes(value, label) {
  const body = value.replace(`-----BEGIN ${label}-----`, '').replace(`-----END ${label}-----`, '').replace(/\s+/gu, '');
  return Uint8Array.from(atob(body), (character) => character.charCodeAt(0));
}
