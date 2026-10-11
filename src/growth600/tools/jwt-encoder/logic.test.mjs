import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, webcrypto } from 'node:crypto';
import { JWT_ENCODER_ALGORITHMS, JWT_ENCODER_MAX_CLAIMS_BYTES, signJwt } from './logic.mjs';

test('HS256 JWT matches an independent HMAC implementation and preserves Unicode claims', async () => {
  const result = await signJwt({ claimsJson: '{"sub":"123","message":"こんにちは 🌐"}', secret: 'a local test secret', algorithm: 'HS256' }, webcrypto, 1_700_000_000_000);
  const [header, payload, signature] = result.token.split('.');
  const expected = createHmac('sha256', 'a local test secret').update(`${header}.${payload}`).digest('base64url');
  assert.equal(signature, expected);
  assert.deepEqual(result.payload, { sub: '123', message: 'こんにちは 🌐' });
  assert.deepEqual(JSON.parse(Buffer.from(header, 'base64url').toString()), { alg: 'HS256', typ: 'JWT' });
});

test('supports only HMAC SHA-256/384/512 and adds bounded issued-at/expiration claims', async () => {
  assert.deepEqual(JWT_ENCODER_ALGORITHMS, ['HS256', 'HS384', 'HS512']);
  for (const algorithm of JWT_ENCODER_ALGORITHMS) {
    const result = await signJwt({ claimsJson: '{"role":"reader"}', secret: 'secret', algorithm, expiresInMinutes: 15 }, webcrypto, 1_700_000_000_000);
    assert.equal(result.header.alg, algorithm);
    assert.equal(result.payload.iat, 1_700_000_000);
    assert.equal(result.payload.exp, 1_700_000_900);
    const hash = `sha${algorithm.slice(2)}`.toLowerCase();
    const [first, second, signature] = result.token.split('.');
    assert.equal(signature, createHmac(hash, 'secret').update(`${first}.${second}`).digest('base64url'));
  }
});

test('rejects unsupported algorithms, malformed/non-object/oversized JSON, missing secret and bad expiration', async () => {
  await assert.rejects(signJwt({ claimsJson: '{}', secret: 'secret', algorithm: 'none' }, webcrypto), /HS256/u);
  await assert.rejects(signJwt({ claimsJson: '[]', secret: 'secret' }, webcrypto), /JSON object/u);
  await assert.rejects(signJwt({ claimsJson: '{bad}', secret: 'secret' }, webcrypto), /valid JSON/u);
  await assert.rejects(signJwt({ claimsJson: ' '.repeat(JWT_ENCODER_MAX_CLAIMS_BYTES + 1), secret: 'secret' }, webcrypto), /supported size/u);
  await assert.rejects(signJwt({ claimsJson: '{}', secret: '' }, webcrypto), /signing secret/u);
  await assert.rejects(signJwt({ claimsJson: '{}', secret: 'secret', expiresInMinutes: 0 }, webcrypto), /Expiration/u);
  await assert.rejects(signJwt({ claimsJson: '{}', secret: 'secret', expiresInMinutes: 0.5 }, webcrypto), /whole number/u);
});
