import test from 'node:test';
import assert from 'node:assert/strict';
import { previousGraphemeBoundary } from './logic.mjs';

test('virtual keyboard backspace removes a whole final grapheme with Segmenter support', () => {
  const value = 'A👨‍👩‍👧‍👦';
  const old = Intl.Segmenter;
  try {
    Intl.Segmenter = class { segment(text) { return [...text].map((segment, index) => ({ segment, index: [...text].slice(0, index).join('').length })); } };
    // The runtime Segmenter is authoritative for grapheme boundaries; mock its family-cluster result.
    Intl.Segmenter = class { segment(text) { return text === value ? [{ segment: 'A', index: 0 }, { segment: '👨‍👩‍👧‍👦', index: 1 }] : [...text].map((segment, index) => ({ segment, index })); } };
    assert.equal(value.slice(0, previousGraphemeBoundary(value)), 'A');
  } finally { Intl.Segmenter = old; }
});

test('virtual keyboard backspace fallback preserves combining marks and ZWJ sequences', () => {
  const old = Intl.Segmenter;
  try {
    Intl.Segmenter = undefined;
    for (const value of ['a\u0301', '✈️', '👍🏽', '👨‍👩‍👧‍👦']) assert.equal(value.slice(0, previousGraphemeBoundary(value)), '');
    assert.equal(previousGraphemeBoundary('A🇪🇸'), 1);
  } finally { Intl.Segmenter = old; }
});
