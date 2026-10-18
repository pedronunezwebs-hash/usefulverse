import test from 'node:test';
import assert from 'node:assert/strict';
import { detectorFormats, expandUpcE, formatsAvailable, mergeDetections, normalizeBarcodeDetection, validEan } from './barcode-reader.mjs';

test('recognizes the formats the browser can actually decode and maps UPC-A through EAN-13', () => {
  assert.deepEqual(formatsAvailable(['qr_code', 'ean_13', 'code_128', 'upc_e']), ['code_128', 'ean_13', 'upc_a', 'upc_e']);
  assert.deepEqual(detectorFormats(['qr_code', 'ean_13', 'code_128', 'upc_e']), ['code_128', 'ean_13', 'upc_e']);
  assert.deepEqual(formatsAvailable(null), []);
});

test('validates EAN-13, EAN-8 and UPC-A check digits without inventing product data', () => {
  assert.equal(validEan('4006381333931'), true);
  assert.equal(validEan('4006381333932'), false);
  assert.equal(validEan('96385074'), true);
  assert.deepEqual(normalizeBarcodeDetection({ format: 'ean_13', rawValue: '0036000291452' }), { format: 'UPC-A', value: '036000291452', checksum: 'valid' });
  assert.equal(normalizeBarcodeDetection({ format: 'ean_8', rawValue: '96385075' }).checksum, 'invalid');
});

test('expands UPC-E variants to the equivalent UPC-A digits before validating the check digit', () => {
  assert.equal(expandUpcE('04252614'), '042100005264');
  assert.deepEqual(normalizeBarcodeDetection({ format: 'upc_e', rawValue: '04252614' }), { format: 'UPC-E', value: '04252614', checksum: 'valid' });
  assert.equal(normalizeBarcodeDetection({ format: 'upc_e', rawValue: '04252615' }).checksum, 'invalid');
});

test('deduplicates repeated live frames, preserves multiple distinct values and caps output', () => {
  const first = mergeDetections([], [{ format: 'code_128', rawValue: 'ABC123' }, { format: 'code_128', rawValue: 'ABC123' }, { format: 'ean_13', rawValue: '4006381333931' }]);
  assert.equal(first.length, 2);
  assert.equal(mergeDetections(first, [{ format: 'code_128', rawValue: 'ABC123' }]).length, 2);
  assert.equal(mergeDetections([], Array.from({ length: 8 }, (_, i) => ({ format: 'code_128', rawValue: `C${i}` })), 3).length, 3);
  assert.equal(normalizeBarcodeDetection({ format: 'ean_13', rawValue: '' }), null);
});
