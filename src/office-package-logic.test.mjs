import assert from 'node:assert/strict';
import test from 'node:test';
import { unzipSync, zipSync } from 'fflate';
import { OFFICE_PACKAGE_LIMITS, inspectOfficePackage, recompressOfficePackage } from './office-package-logic.mjs';

const mainPart = {
  docx: 'word/document.xml',
  xlsx: 'xl/workbook.xml',
  pptx: 'ppt/presentation.xml',
};

function fixture(extension, level = 0) {
  const parts = {
    '[Content_Types].xml': new TextEncoder().encode('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>'),
    '_rels/.rels': new TextEncoder().encode('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>'),
    [mainPart[extension]]: new TextEncoder().encode(`<document>${'sample text that can be compressed '.repeat(8_000)}</document>`),
  };
  return { parts, bytes: zipSync(Object.fromEntries(Object.entries(parts).map(([name, value]) => [name, [value, { level }]]))) };
}

test('Office package recompression supports DOCX, XLSX and PPTX and preserves every part byte-for-byte', () => {
  for (const extension of Object.keys(mainPart)) {
    const original = fixture(extension);
    const result = recompressOfficePackage(original.bytes, `sample.${extension}`);
    assert.equal(result.smaller, true, `${extension} should shrink its uncompressed XML fixture`);
    assert.ok(result.outputBytes < result.inputBytes);
    const decoded = unzipSync(result.bytes);
    assert.deepEqual(Object.keys(decoded).sort(), Object.keys(original.parts).sort());
    for (const [path, contents] of Object.entries(original.parts)) assert.deepEqual(decoded[path], contents, `${extension}:${path}`);
  }
});

test('only a correctly typed modern OOXML package is accepted', () => {
  const word = fixture('docx');
  assert.equal(inspectOfficePackage(word.bytes, 'docx').extension, 'docx');
  assert.throws(() => inspectOfficePackage(word.bytes, 'doc'), /modern DOCX/u);
  assert.throws(() => inspectOfficePackage(new TextEncoder().encode('not a ZIP'), 'docx'), /supported Office package|incomplete/u);
  const mismatched = zipSync({ '[Content_Types].xml': new Uint8Array([1]), 'word/document.xml': new Uint8Array([2]) });
  assert.throws(() => inspectOfficePackage(mismatched, 'xlsx'), /valid modern Office document/u);
});

test('encrypted, signed and macro-enabled Office packages are rejected', () => {
  const encrypted = fixture('docx').bytes.slice();
  const view = new DataView(encrypted.buffer, encrypted.byteOffset, encrypted.byteLength);
  const localHeader = encrypted.findIndex((_, index) => index < encrypted.length - 4 && view.getUint32(index, true) === 0x04034b50);
  const centralHeader = encrypted.findIndex((_, index) => index < encrypted.length - 4 && view.getUint32(index, true) === 0x02014b50);
  view.setUint16(localHeader + 6, view.getUint16(localHeader + 6, true) | 1, true);
  view.setUint16(centralHeader + 8, view.getUint16(centralHeader + 8, true) | 1, true);
  assert.throws(() => inspectOfficePackage(encrypted, 'docx'), /Encrypted/u);

  const signed = fixture('docx');
  const signedParts = { ...signed.parts, '_xmlsignatures/sig1.xml': new TextEncoder().encode('<Signature/>') };
  assert.throws(() => inspectOfficePackage(zipSync(signedParts), 'docx'), /Signed or macro-enabled/u);
  const macroTypes = new TextEncoder().encode('<Types>macroEnabled</Types>');
  const macro = zipSync({ ...signed.parts, '[Content_Types].xml': macroTypes });
  assert.throws(() => recompressOfficePackage(macro, 'sample.docx'), /Signed or macro-enabled/u);
});

test('declared ZIP expansion above the safe local budget is rejected before extraction', () => {
  const bytes = fixture('docx').bytes.slice();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const centralHeader = bytes.findIndex((_, index) => index < bytes.length - 4 && view.getUint32(index, true) === 0x02014b50);
  view.setUint32(centralHeader + 24, OFFICE_PACKAGE_LIMITS.expandedBytes + 1, true);
  assert.throws(() => inspectOfficePackage(bytes, 'docx'), /200 MB local processing limit/u);
});

test('a package that cannot become smaller never produces an output payload', () => {
  const randomLike = new Uint8Array(48_000);
  let state = 0x12345678;
  for (let index = 0; index < randomLike.length; index += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    randomLike[index] = state >>> 24;
  }
  const base = fixture('docx').parts;
  const compressedParts = Object.fromEntries(Object.entries(base).map(([name, content]) => [name, [content, { level: 9 }]]));
  compressedParts['word/media/photo.jpg'] = [randomLike, { level: 0 }];
  const bytes = zipSync(compressedParts, { level: 9 });
  const result = recompressOfficePackage(bytes, 'sample.docx');
  assert.equal(result.smaller, false);
  assert.equal('bytes' in result, false);
});
