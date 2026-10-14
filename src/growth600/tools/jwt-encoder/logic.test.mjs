import assert from 'node:assert/strict';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import { createJwt, JWT_MAX_JSON_BYTES, verifyJwt } from './logic.mjs';

const secret = 'correct horse battery staple plus';

test('creates and verifies a standard HS256 token with UTF-8 claims', async () => {
  const result = await createJwt({ payloadText: '{"sub":"123","name":"José 🔒"}', secret, nowSeconds: 1_700_000_000 }, webcrypto);
  const [header, payload, signature] = result.token.split('.');
  assert.equal(result.header.alg, 'HS256');
  assert.ok(header && payload && signature);
  assert.match(signature, /^[A-Za-z0-9_-]+$/u);
  assert.deepEqual((await verifyJwt(result.token, secret, { nowSeconds: 1_700_000_000 }, webcrypto)).payload, { sub: '123', name: 'José 🔒' });
});

test('optional expiry uses NumericDate seconds and reports the time window separately from signature validity', async () => {
  const { token } = await createJwt({ payloadText: '{"sub":"user"}', secret, expiresInSeconds: 60, nowSeconds: 1_000 }, webcrypto);
  assert.equal((await verifyJwt(token, secret, { nowSeconds: 1_059 }, webcrypto)).timeStatus, 'within-time-window');
  assert.equal((await verifyJwt(token, secret, { nowSeconds: 1_060 }, webcrypto)).timeStatus, 'expired');
});

test('rejects changed header/payload/signature and wrong secrets without exposing verified status', async () => {
  const { token } = await createJwt({ payloadText: '{"role":"reader"}', secret }, webcrypto);
  const [header, payload, signature] = token.split('.');
  const wrongSecret = assert.rejects(verifyJwt(token, 'different safe phrase long enough to sign JWTs', {}, webcrypto), /signature is invalid/u);
  const changedPayload = `${header}.${Buffer.from('{"role":"admin"}').toString('base64url')}.${signature}`;
  const changedHeader = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url')}.${payload}.${signature}`;
  await Promise.all([
    wrongSecret,
    assert.rejects(verifyJwt(changedPayload, secret, {}, webcrypto), /signature is invalid/u),
    assert.rejects(verifyJwt(changedHeader, secret, {}, webcrypto), /Only standard HS256/u),
  ]);
});

test('input and algorithm boundaries are explicit', async () => {
  await assert.rejects(createJwt({ payloadText: '[]', secret }, webcrypto), /JSON object/u);
  await assert.rejects(createJwt({ payloadText: '{bad', secret }, webcrypto), /valid JSON/u);
  await assert.rejects(createJwt({ payloadText: '{}', secret: 'short' }, webcrypto), /at least 32 UTF-8 bytes/u);
  await assert.rejects(createJwt({ payloadText: '{"exp":10}', secret, expiresInSeconds: 60 }, webcrypto), /existing exp/u);
  await assert.rejects(createJwt({ payloadText: '{}', secret, expiresInSeconds: 0 }, webcrypto), /1 second/u);
  await assert.rejects(createJwt({ payloadText: `{"x":"${'x'.repeat(JWT_MAX_JSON_BYTES)}"}`, secret }, webcrypto), /64 KiB/u);
  await assert.rejects(verifyJwt('one.two', secret, {}, webcrypto), /three non-empty/u);
  const invalidDate = await createJwt({ payloadText: '{"exp":"tomorrow"}', secret }, webcrypto);
  await assert.rejects(verifyJwt(invalidDate.token, secret, {}, webcrypto), /NumericDate/u);
});
