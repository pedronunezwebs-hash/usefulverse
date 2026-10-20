import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import test from 'node:test';
import { inspectPdfSignatures, verifyPdfCmsSignature } from './logic.mjs';

function lengthBytes(length) {
  if (length < 128) return Uint8Array.of(length);
  const parts = [];
  for (let value = length; value; value = Math.floor(value / 256)) parts.unshift(value & 255);
  return Uint8Array.of(0x80 | parts.length, ...parts);
}
function tlv(tag, value) { return Uint8Array.of(tag, ...lengthBytes(value.length), ...value); }
function join(...parts) { return Uint8Array.from(parts.flatMap((part) => [...part])); }
const seq = (...parts) => tlv(0x30, join(...parts));
const set = (...parts) => tlv(0x31, join(...parts));
const oid = (bytes) => tlv(0x06, Uint8Array.from(bytes));
const integer = (value) => tlv(0x02, Uint8Array.of(value));
const nullValue = () => Uint8Array.of(0x05, 0x00);
const algorithm = (identifier) => seq(oid(identifier), nullValue());

async function signedPdfFixture() {
  const keyPair = await webcrypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: Uint8Array.of(1, 0, 1), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const spki = new Uint8Array(await webcrypto.subtle.exportKey('spki', keyPair.publicKey));
  const commonName = seq(oid([0x55, 0x04, 0x03]), tlv(0x0c, new TextEncoder().encode('Local test signer')));
  const name = seq(set(commonName));
  const validity = seq(tlv(0x17, new TextEncoder().encode('260101000000Z')), tlv(0x17, new TextEncoder().encode('300101000000Z')));
  const tbsCertificate = seq(tlv(0xa0, integer(2)), integer(7), algorithm([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b]), name, validity, name, spki);
  const certificate = seq(tbsCertificate, algorithm([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b]), tlv(0x03, Uint8Array.of(0, 1)));
  const pdfPrefix = '%PDF-1.7\n1 0 obj << /Type /Sig /ByteRange [0 0000000000 0000000000 0000000000] /Contents <';
  const pdfSuffix = '> >> endobj\n%%EOF\n';
  const pdfText = `${pdfPrefix}${'0'.repeat(4096)}${pdfSuffix}`;
  const open = pdfText.indexOf('<', pdfText.indexOf('/Contents'));
  const close = pdfText.indexOf('>', open);
  const after = close + 1;
  const pdf = new TextEncoder().encode(pdfText.replace('0000000000 0000000000 0000000000', `0000000000 0000000000 0000000000`));
  const byteRange = `0 ${String(open).padStart(10, '0')} ${String(after).padStart(10, '0')} ${String(pdf.length - after).padStart(10, '0')}`;
  const rangedPdf = new TextEncoder().encode(pdfText.replace('0 0000000000 0000000000 0000000000', byteRange));
  const signedBytes = join(rangedPdf.subarray(0, open), rangedPdf.subarray(after));
  const contentDigest = new Uint8Array(await webcrypto.subtle.digest('SHA-256', signedBytes));
  const digestAttribute = seq(oid([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x09, 0x04]), set(tlv(0x04, contentDigest)));
  const signedAttributes = set(digestAttribute);
  const signature = new Uint8Array(await webcrypto.subtle.sign('RSASSA-PKCS1-v1_5', keyPair.privateKey, signedAttributes));
  const signerInfo = seq(integer(1), seq(name, integer(7)), algorithm([0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01]), tlv(0xa0, signedAttributes.subarray(2)), algorithm([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x0b]), tlv(0x04, signature));
  const signedData = seq(integer(1), set(algorithm([0x60, 0x86, 0x48, 0x01, 0x65, 0x03, 0x04, 0x02, 0x01])), seq(oid([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x01])), tlv(0xa0, certificate), set(signerInfo));
  const cms = seq(oid([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x07, 0x02]), tlv(0xa0, signedData));
  assert.ok(cms.length < 2048, 'fixture CMS fits the PDF Contents reservation');
  const cmsHex = [...cms].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const paddedPdfText = rangedPdf.length ? new TextDecoder().decode(rangedPdf).replace('0'.repeat(4096), `${cmsHex}${'0'.repeat(4096 - cmsHex.length)}`) : '';
  return { pdf: new TextEncoder().encode(paddedPdfText), cryptoImpl: webcrypto, signatureLength: signature.length };
}

test('PDF signature inspector rejects non-PDF and oversized inputs', async () => {
  await assert.rejects(() => inspectPdfSignatures(new TextEncoder().encode('not a PDF')));
  await assert.rejects(() => inspectPdfSignatures(new Uint8Array(25 * 1024 * 1024 + 1).fill(0)));
});

test('PDF signature inspector does not claim a signature when none is directly readable', async () => {
  const report = await inspectPdfSignatures(new TextEncoder().encode('%PDF-1.7\n1 0 obj << /Type /Catalog >> endobj'));
  assert.equal(report.signatureCount, 0);
  assert.deepEqual(report.signatures, []);
});

test('malformed ByteRange is reported as invalid rather than verified', async () => {
  const source = new TextEncoder().encode('%PDF-1.7\n/ByteRange [0 25 4 100]');
  const report = await inspectPdfSignatures(source);
  assert.equal(report.signatureCount, 1);
  assert.equal(report.signatures[0].byteRangeValid, false);
  assert.equal(report.signatures[0].cryptographicallyVerified, false);
});

test('malformed CMS is fail-closed and exposes no identity or trust claim', async () => {
  const result = await verifyPdfCmsSignature(new Uint8Array([1, 2, 3]), new Uint8Array([0x30, 0]));
  assert.equal(result.verified, false);
  assert.equal(result.signer, null);
});

test('verifies a locally generated detached CMS signature with legal PDF zero padding', async () => {
  const { pdf, cryptoImpl } = await signedPdfFixture();
  const report = await inspectPdfSignatures(pdf, { cryptoImpl });
  assert.equal(report.signatureCount, 1);
  assert.equal(report.signatures[0].byteRangeValid, true);
  assert.equal(report.signatures[0].cryptographicallyVerified, true, report.signatures[0].reason);
  assert.equal(report.signatures[0].coversCurrentFile, true);
  assert.equal(report.signatures[0].trust, 'unknown');
  assert.equal(report.signatures[0].revocation, 'not checked');
  assert.equal(report.signatures[0].timestamp, 'not independently validated');
  const tampered = pdf.slice();
  tampered[15] ^= 1;
  const tamperedReport = await inspectPdfSignatures(tampered, { cryptoImpl });
  assert.equal(tamperedReport.signatures[0].cryptographicallyVerified, false);
});
