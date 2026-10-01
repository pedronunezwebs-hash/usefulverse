import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PDF_REDACT_BYTES,
  MAX_PDF_REDACT_PIXELS,
  normalizeRedactionRect,
  redactionPixelPlan,
  validateRedactionInput,
} from './pdf-redact-logic.mjs';
import { pdfRedactLocales } from './locales/pdf-redact.mjs';

test('redaction UI and SEO copy cover every currently supported locale without English fallback', () => {
  const supported = ['en', 'es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi'];
  assert.deepEqual(Object.keys(pdfRedactLocales).sort(), [...supported].sort());
  const englishKeys = Object.keys(pdfRedactLocales.en.ui).sort();
  for (const language of supported) {
    const localized = pdfRedactLocales[language];
    assert.deepEqual(Object.keys(localized.ui).sort(), englishKeys, `${language} UI keys`);
    assert.equal(localized.copy['pdf-redact'].length, 6, `${language} SEO copy fields`);
    for (const [index, value] of localized.copy['pdf-redact'].entries()) {
      assert.ok(value.trim(), `${language} copy field ${index} is empty`);
      if (language !== 'en') assert.notEqual(value, pdfRedactLocales.en.copy['pdf-redact'][index], `${language} copy field ${index} fell back to English`);
    }
    if (language !== 'en') for (const key of englishKeys) assert.notEqual(localized.ui[key], pdfRedactLocales.en.ui[key], `${language} UI string ${key} fell back to English`);
  }
});

test('redaction coordinates normalize drag direction and clamp to page edges', () => {
  assert.deepEqual(normalizeRedactionRect(0.8, 0.7, 0.2, 0.1), { x: 0.2, y: 0.1, width: 0.6000000000000001, height: 0.6 });
  assert.deepEqual(normalizeRedactionRect(-0.2, 0.2, 0.4, 1.2), { x: 0, y: 0.2, width: 0.4, height: 0.8 });
});

test('redaction rejects tiny, non-numeric and out-of-budget selections', () => {
  assert.throws(() => normalizeRedactionRect(0.2, 0.2, 0.201, 0.8), /larger/u);
  assert.throws(() => normalizeRedactionRect(0, 0, Number.NaN, 1), /numbers/u);
  assert.throws(() => redactionPixelPlan([{ width: 612, height: 792 }], 125), /resolution/u);
  assert.throws(() => redactionPixelPlan(Array.from({ length: 101 }, () => ({ width: 612, height: 792 })), 150), /100 pages/u);
  assert.throws(() => redactionPixelPlan(Array.from({ length: 100 }, () => ({ width: 612, height: 792 })), 300), /too much memory/u);
  assert.throws(() => redactionPixelPlan([{ width: 100_000, height: 100_000 }], 100), /page is too large/u);
});

test('redaction calculates bounded raster dimensions and validates the selected PDF', () => {
  const plan = redactionPixelPlan([{ width: 612, height: 792 }, { width: 595.28, height: 841.89 }], 150);
  assert.equal(plan.pages.length, 2);
  assert.ok(plan.totalPixels < MAX_PDF_REDACT_PIXELS);
  const bytes = new Uint8Array(12);
  bytes.set(new TextEncoder().encode('%PDF-1.7'));
  assert.doesNotThrow(() => validateRedactionInput(bytes));
  assert.throws(() => validateRedactionInput(new Uint8Array(12)), /valid PDF/u);
  assert.throws(() => validateRedactionInput(new Uint8Array(MAX_PDF_REDACT_BYTES + 1)), /50 MB/u);
});
