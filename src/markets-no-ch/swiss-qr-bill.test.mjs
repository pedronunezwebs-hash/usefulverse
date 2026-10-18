import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSwissQrPayload,
  classifySwissIban,
  makeQrReference,
  parseSwissQrPayload,
  validateCreditorReference,
  validateQrReference,
} from './swiss-qr-bill.mjs';

const creditor = { name: 'Max Muster & Söhne', street: 'Musterstrasse', building: '123', postalCode: '8000', city: 'Seldwyla', country: 'ch' };
const debtor = { name: 'Simon Muster', street: 'Musterstrasse', building: '1', postalCode: '8000', city: 'Seldwyla', country: 'CH' };

test('classifies valid Swiss IBAN and QR-IBAN from check digits and QR-IID', () => {
  assert.deepEqual(classifySwissIban('CH64 3196 1000 0044 2155 7').kind, 'qr-iban');
  assert.equal(classifySwissIban('CH52 0483 5012 3456 7100 0').kind, 'iban');
  assert.equal(classifySwissIban('CH00 3196 1000 0044 2155 7').valid, false);
  assert.equal(classifySwissIban('DE89 3704 0044 0532 0130 00').valid, false);
});

test('matches SIX QR reference example and generates its check digit', () => {
  const reference = '000008207791225857421286694';
  assert.equal(validateQrReference(reference), true);
  assert.equal(makeQrReference(reference.slice(0, 26)), reference);
  assert.equal(validateQrReference(`${reference.slice(0, 26)}0`), false);
});

test('validates ISO 11649 creditor reference using modulo 97-10', () => {
  assert.equal(validateCreditorReference('RF18539007547034'), true);
  assert.equal(validateCreditorReference('RF18539007547035'), false);
});

test('builds and round-trips the SIX structured-address QRR fixture', () => {
  const result = buildSwissQrPayload({
    iban: 'CH64 3196 1000 0044 2155 7', creditor, debtor, amount: '50', currency: 'CHF',
    referenceType: 'QRR', reference: '000008207791225857421286694', message: 'Payment of travel',
  });
  assert.equal(result.accountKind, 'qr-iban');
  assert.deepEqual(result.payload.split('\n').slice(0, 4), ['SPC', '0200', '1', 'CH6431961000004421557']);
  assert.equal(result.payload.split('\n')[30], 'EPD');
  const parsed = parseSwissQrPayload(result.payload);
  assert.equal(parsed.valid, true);
  assert.equal(parsed.amount, '50.00');
  assert.equal(parsed.message, 'Payment of travel');
  assert.equal(parsed.creditor.country, 'CH');
});

test('builds a normal-IBAN SCOR bill without a payment reference', () => {
  const result = buildSwissQrPayload({ iban: 'CH52 0483 5012 3456 7100 0', creditor, referenceType: 'SCOR', reference: 'RF18539007547034', currency: 'EUR' });
  assert.equal(result.accountKind, 'iban');
  assert.equal(parseSwissQrPayload(result.payload).referenceType, 'SCOR');
});

test('rejects incompatible QR-IBAN references, malformed data, invalid characters and checksums', () => {
  const base = { iban: 'CH64 3196 1000 0044 2155 7', creditor };
  assert.throws(() => buildSwissQrPayload({ ...base, referenceType: 'NON' }), { code: 'qrIbanNeedsQrr' });
  assert.throws(() => buildSwissQrPayload({ ...base, referenceType: 'QRR', reference: '000008207791225857421286694', currency: 'EUR' }), { code: 'qrrChfOnly' });
  assert.throws(() => buildSwissQrPayload({ ...base, referenceType: 'QRR', reference: '000008207791225857421286690' }), { code: 'invalidReference' });
  assert.throws(() => buildSwissQrPayload({ ...base, referenceType: 'QRR', reference: '000008207791225857421286694', creditor: { ...creditor, name: '漢字' } }), { code: 'invalidField' });
  assert.throws(() => buildSwissQrPayload({ ...base, referenceType: 'QRR', reference: '000008207791225857421286694', message: 'x'.repeat(140), billingInformation: 'y' }), { code: 'additionalInfoTooLong' });
  assert.throws(() => parseSwissQrPayload('SPC\n0200\n1\nwrong'), { code: 'invalidSwissQr' });
});
