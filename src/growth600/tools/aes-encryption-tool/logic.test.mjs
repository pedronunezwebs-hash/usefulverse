import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { AES_TOOL_FORMAT, AES_TOOL_ITERATIONS, AES_TOOL_MAX_FILE_BYTES, AES_TOOL_MAX_TEXT_BYTES, decryptAesPayload, encryptAesPayload } from './logic.mjs';

test('AES-GCM encrypts text in a versioned container and decrypts it only with the correct passphrase', async () => {
  const encrypted = await encryptAesPayload({ kind: 'text', text: 'UsefulVerse 🌱 — secret' }, 'correct horse battery staple 42', 310_000, webcrypto);
  const container = JSON.parse(encrypted);
  assert.equal(container.format, AES_TOOL_FORMAT);
  assert.equal(container.cipher, 'AES-256-GCM');
  assert.equal(container.iterations, 310_000);
  assert.deepEqual(await decryptAesPayload(encrypted, 'correct horse battery staple 42', webcrypto), { kind: 'text', text: 'UsefulVerse 🌱 — secret', name: '', mimeType: 'text/plain;charset=utf-8' });
  await assert.rejects(decryptAesPayload(encrypted, 'wrong passphrase here', webcrypto));
});

test('file payload bytes, filename and MIME round-trip; encrypted metadata is authenticated', async () => {
  const bytes = Uint8Array.from([0, 1, 2, 127, 128, 255]);
  const encrypted = await encryptAesPayload({ kind: 'file', bytes, name: 'private.bin', mimeType: 'application/octet-stream' }, 'local-only passphrase 123', 310_000, webcrypto);
  const result = await decryptAesPayload(encrypted, 'local-only passphrase 123', webcrypto);
  assert.deepEqual([...result.bytes], [...bytes]);
  assert.equal(result.name, 'private.bin');
  const parsed = JSON.parse(encrypted);
  await assert.rejects(decryptAesPayload(JSON.stringify({ ...parsed, name: 'changed.bin' }), 'local-only passphrase 123', webcrypto));
});

test('ciphertext tampering and a wrong password never return plaintext', async () => {
  const encrypted = await encryptAesPayload({ kind: 'text', text: 'do not leak' }, 'a long enough local password', 310_000, webcrypto);
  const parsed = JSON.parse(encrypted);
  parsed.ciphertext = `${parsed.ciphertext.slice(0, -4)}AAAA`;
  await assert.rejects(decryptAesPayload(JSON.stringify(parsed), 'a long enough local password', webcrypto));
});

test('iteration, passphrase, input and container limits are enforced', async () => {
  assert.deepEqual(AES_TOOL_ITERATIONS, [310_000, 600_000, 1_000_000]);
  await assert.rejects(encryptAesPayload({ kind: 'text', text: 'ok' }, 'short', 310_000, webcrypto), /12 and 256/u);
  await assert.rejects(encryptAesPayload({ kind: 'text', text: 'x'.repeat(AES_TOOL_MAX_TEXT_BYTES + 1) }, 'a long enough local password', 310_000, webcrypto), /1 MiB/u);
  await assert.rejects(encryptAesPayload({ kind: 'text', text: 'ok' }, 'a long enough local password', 1, webcrypto), /work factor/u);
  await assert.rejects(encryptAesPayload({ kind: 'file', bytes: new Uint8Array(AES_TOOL_MAX_FILE_BYTES + 1), name: 'x.bin' }, 'a long enough local password', 310_000, webcrypto), /8 MiB/u);
  await assert.rejects(decryptAesPayload('not json', 'a long enough local password', webcrypto), /valid UsefulVerse AES/u);
});
