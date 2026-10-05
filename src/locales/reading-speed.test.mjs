import test from 'node:test';
import assert from 'node:assert/strict';
import { readingSpeedContent, readingSpeedRuntimeKeys } from './reading-speed-content.mjs';
import { locales } from '../locales.mjs';

test('reading speed has a usable interface, sample passage and copy for all 36 locales', () => {
  assert.equal(Object.keys(locales).length, 36);
  for (const language of Object.keys(locales)) {
    const pack = readingSpeedContent(language);
    for (const key of readingSpeedRuntimeKeys) assert.ok(pack.ui[key]?.trim(), `${language}: missing ${key}`);
    assert.ok(pack.sample.trim().length > 60, `${language}: missing sample text`);
    assert.equal(pack.copy.length, 6, `${language}: missing SEO copy`);
    assert.ok(pack.copy.every((value) => value.trim()), `${language}: empty SEO copy`);
    assert.ok(pack.ui['Words: {count}'].includes('{count}'), `${language}: count token was changed`);
  }
});
