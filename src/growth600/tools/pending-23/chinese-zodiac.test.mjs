import test from 'node:test';
import assert from 'node:assert/strict';
import { chineseZodiac } from './logic.mjs';

test('Chinese zodiac changes at the lunar new year instead of Gregorian January 1', () => {
  const before = chineseZodiac({ date: '2024-02-09', locale: 'en' });
  const after = chineseZodiac({ date: '2024-02-10', locale: 'en' });
  assert.equal(before.supported, true);
  assert.equal(after.supported, true);
  assert.equal(before.animalKey, 'animalRabbit');
  assert.equal(after.animalKey, 'animalDragon');
  assert.notEqual(before.relatedYear, after.relatedYear);
});

test('Chinese zodiac validates dates and returns localized lunar date text', () => {
  assert.throws(() => chineseZodiac({ date: '2023-02-29' }), RangeError);
  assert.throws(() => chineseZodiac({ date: '2024-13-01' }), RangeError);
  const spanish = chineseZodiac({ date: '2024-02-10', locale: 'es' });
  const english = chineseZodiac({ date: '2024-02-10', locale: 'en' });
  assert.equal(spanish.animalKey, english.animalKey);
  assert.notEqual(spanish.lunarDate, english.lunarDate);
});
