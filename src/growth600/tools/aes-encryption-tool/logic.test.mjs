import assert from 'node:assert/strict';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import { AES_MAX_INPUT_BYTES, AES_MAX_TEXT_ENVELOPE_CHARS, AES_PBKDF2_ITERATIONS, decryptFile, decryptText, encryptFile, encryptText } from './logic.mjs';

const password = 'correct horse battery staple';

test('text envelope round-trips Unicode with versioned authenticated AES-GCM parameters', async () => {
  const plaintext = 'UsefulVerse 🔐\npi = π';
  const envelope = JSON.parse(await encryptText(plaintext, password, webcrypto));
  assert.equal(envelope.format, 'usefulverse-aes-gcm-text');
  assert.equal(envelope.cipher, 'AES-256-GCM');
  assert.equal(envelope.kdf, 'PBKDF2-SHA-256');
  assert.equal(envelope.iterations, AES_PBKDF2_ITERATIONS);
  assert.equal(await decryptText(JSON.stringify(envelope), password, webcrypto), plaintext);
});

test('wrong passphrase and modified ciphertext fail authentication without returning plaintext', async () => {
  const envelope = JSON.parse(await encryptText('private note', password, webcrypto));
  await assert.rejects(decryptText(JSON.stringify(envelope), 'another long passphrase', webcrypto), /wrong or the encrypted data was changed/u);
  const bytes = Buffer.from(envelope.ciphertext, 'base64');
  bytes[0] ^= 1;
  envelope.ciphertext = bytes.toString('base64');
  await assert.rejects(decryptText(JSON.stringify(envelope), password, webcrypto), /wrong or the encrypted data was changed/u);
});

test('binary file container round-trips bytes and sanitized filename and MIME metadata', async () => {
  const input = Uint8Array.from([0, 255, 1, 2, 128, 42]);
  const encrypted = await encryptFile(input, { password, fileName: '../notes.txt', mimeType: 'text/plain' }, webcrypto);
  const result = await decryptFile(encrypted, password, webcrypto);
  assert.deepEqual(result.bytes, input);
  assert.equal(result.fileName, '.._notes.txt');
  assert.equal(result.mimeType, 'text/plain');
});

test('wrong passphrase or a tampered file container never returns data', async () => {
  const encrypted = await encryptFile(Uint8Array.of(4, 5, 6), { password, fileName: 'data.bin' }, webcrypto);
  await assert.rejects(decryptFile(encrypted, 'wrong but long passphrase', webcrypto), /wrong or the encrypted data was changed/u);
  const tampered = encrypted.slice();
  tampered[tampered.length - 1] ^= 0x80;
  await assert.rejects(decryptFile(tampered, password, webcrypto), /wrong or the encrypted data was changed/u);
});

test('file name and MIME metadata are authenticated with the ciphertext', async () => {
  const encrypted = await encryptFile(Uint8Array.of(7, 8, 9), { password, fileName: 'report.txt', mimeType: 'text/plain' }, webcrypto);
  const headerStart = 6;
  const headerLength = new DataView(encrypted.buffer, encrypted.byteOffset, encrypted.byteLength).getUint16(4, false);
  const header = JSON.parse(new TextDecoder().decode(encrypted.subarray(headerStart, headerStart + headerLength)));
  header.fileName = 'other.txt';
  const changedHeader = new TextEncoder().encode(JSON.stringify(header));
  const tampered = new Uint8Array(headerStart + changedHeader.length + encrypted.length - (headerStart + headerLength));
  tampered.set(encrypted.subarray(0, headerStart));
  new DataView(tampered.buffer).setUint16(4, changedHeader.length, false);
  tampered.set(changedHeader, headerStart);
  tampered.set(encrypted.subarray(headerStart + headerLength), headerStart + changedHeader.length);
  await assert.rejects(decryptFile(tampered, password, webcrypto), /wrong or the encrypted data was changed/u);
});

test('rejects weak passwords, malformed containers, unsupported parameters and oversized data', async () => {
  await assert.rejects(encryptText('x', 'too short', webcrypto), /at least 12/u);
  await assert.rejects(decryptText('{"format":"wrong"}', password, webcrypto), /unsupported format/u);
  const envelope = JSON.parse(await encryptText('x', password, webcrypto));
  envelope.iterations = 1;
  await assert.rejects(decryptText(JSON.stringify(envelope), password, webcrypto), /unsupported format/u);
  await assert.rejects(decryptFile(Uint8Array.of(1, 2, 3, 4), password, webcrypto), /not a supported/u);
  await assert.rejects(encryptFile(new Uint8Array(AES_MAX_INPUT_BYTES + 1), { password }, webcrypto), /16 MiB/u);
  await assert.rejects(decryptText(' '.repeat(AES_MAX_TEXT_ENVELOPE_CHARS + 1), password, webcrypto), /size limit/u);
});
