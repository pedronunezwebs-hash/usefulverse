import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { EXAMPLE_CERTIFICATE_PEM } from './example.mjs';
import { CERTIFICATE_LIMITS, decodeCertificateDer, decodeCertificateInput, sha256Fingerprint } from './logic.mjs';

test('decodes the synthetic PEM fixture subject, issuer, serial, UTC dates and SAN values', () => {
  const { bytes, certificate } = decodeCertificateInput(EXAMPLE_CERTIFICATE_PEM);
  assert.ok(bytes instanceof Uint8Array);
  assert.equal(certificate.subject.find((field) => field.key === 'commonName')?.value, 'fixture.example.invalid');
  assert.equal(certificate.subject.find((field) => field.key === 'organizationName')?.value, 'UsefulVerse Test');
  assert.deepEqual(certificate.issuer, certificate.subject);
  assert.match(certificate.serialNumber, /^[0-9A-F]+$/u);
  assert.equal(certificate.notBefore, '2026-10-09T06:08:21.000Z');
  assert.equal(certificate.notAfter, '2027-10-09T06:08:21.000Z');
  assert.deepEqual(certificate.alternativeNames, [
    { type: 'DNS', value: 'fixture.example.invalid' },
    { type: 'DNS', value: 'www.fixture.example.invalid' },
    { type: 'IP', value: '192.0.2.1' },
  ]);
});

test('accepts whitespace-wrapped PEM and base64 DER input without changing the decoded fields', () => {
  const compact = EXAMPLE_CERTIFICATE_PEM.replace(/-----[^-]+-----/gu, '').replace(/\s/gu, '');
  const a = decodeCertificateInput(EXAMPLE_CERTIFICATE_PEM);
  const b = decodeCertificateInput(`\n${compact.slice(0, 80)}\n${compact.slice(80)}\n`);
  assert.equal(b.certificate.serialNumber, a.certificate.serialNumber);
  assert.equal(b.bytes.length, a.bytes.length);
});

test('fingerprint matches SHA-256 of the exact DER bytes', async () => {
  const { bytes } = decodeCertificateInput(EXAMPLE_CERTIFICATE_PEM);
  const subtle = { digest: async (_algorithm, input) => createHash('sha256').update(Buffer.from(input)).digest() };
  const expected = createHash('sha256').update(bytes).digest('hex').toUpperCase().match(/.{2}/gu).join(':');
  assert.equal(await sha256Fingerprint(bytes, subtle), expected);
});

test('rejects malformed PEM, concatenated certificates, malformed DER and invalid dates', () => {
  assert.throws(() => decodeCertificateInput(''), /empty-input/u);
  assert.throws(() => decodeCertificateInput('-----BEGIN CERTIFICATE-----bad-----END CERTIFICATE-----'), /invalid-pem/u);
  assert.throws(() => decodeCertificateInput(`${EXAMPLE_CERTIFICATE_PEM}\n${EXAMPLE_CERTIFICATE_PEM}`), /invalid-pem/u);
  assert.throws(() => decodeCertificateDer(Uint8Array.of(0x30, 0x82, 0xff, 0xff)), /invalid-certificate/u);
  assert.throws(() => decodeCertificateDer(Uint8Array.of(0x30, 0x80, 0, 0)), /invalid-certificate/u);
});

test('enforces the file-size boundary before parsing the certificate body', () => {
  assert.throws(() => decodeCertificateDer(new Uint8Array(CERTIFICATE_LIMITS.maxBytes + 1)), /certificate-too-large/u);
});
