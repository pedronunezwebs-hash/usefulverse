import test from 'node:test';
import assert from 'node:assert/strict';
import { attribute, inspectHTML } from './compose-sites-metadata.mjs';

test('valid multiline description attributes survive metadata inspection', () => {
  const html = '<html lang="am-ET"><head><meta name="description" content="First sentence.\nSecond sentence &amp; more."><link rel="canonical" href="https://tools.usefulverse.com/am/tools/acceleration-calculator/"></head><h1>Acceleration</h1></html>';
  const info = inspectHTML(html);
  assert.equal(info.description, 'First sentence.\nSecond sentence & more.');
  assert.equal(info.canonical, 'https://usefulverse.com/am/tools/acceleration-calculator/');
});
test('multiline parsing still rejects duplicate attributes', () => {
  assert.throws(() => attribute('<meta content="first\nline" content="second">', 'content'), /Duplicate/u);
});
