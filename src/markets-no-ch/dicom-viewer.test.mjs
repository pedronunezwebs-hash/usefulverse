import test from 'node:test';
import assert from 'node:assert/strict';
import { orderDicomSeries, parseDicomFile, windowDicomPixels } from './dicom-viewer.mjs';

function fixture({ pixels = [0, 100, 200, 300], rows = 2, columns = 2, photo = 'MONOCHROME2', syntax = '1.2.840.10008.1.2.1', position = '0\\0\\0', instance = '1', window = ['150', '300'], bits = 16, storedBits = bits, signed = false, frames = 1, sequence = false } = {}) {
  const chunks = [];
  const bytes = (...values) => chunks.push(Uint8Array.from(values));
  const value = (text) => new TextEncoder().encode(text + (text.length % 2 ? '\0' : ''));
  const explicitElement = (group, element, vr, data) => {
    const short = !['OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'UC', 'UR', 'UT', 'UN'].includes(vr);
    bytes(group & 255, group >> 8, element & 255, element >> 8, ...new TextEncoder().encode(vr));
    if (short) bytes(data.length & 255, data.length >> 8);
    else bytes(0, 0, data.length & 255, (data.length >> 8) & 255, (data.length >> 16) & 255, data.length >> 24);
    chunks.push(data);
  };
  const implicitElement = (group, element, data) => {
    bytes(group & 255, group >> 8, element & 255, element >> 8, data.length & 255, (data.length >> 8) & 255, (data.length >> 16) & 255, data.length >> 24);
    chunks.push(data);
  };
  const isExplicit = syntax === '1.2.840.10008.1.2.1';
  bytes(...new Array(128).fill(0), 68, 73, 67, 77);
  explicitElement(0x0002, 0x0010, 'UI', value(syntax));
  const element = (g, e, vr, text) => {
    const data = vr === 'US' ? Uint8Array.from([Number(text) & 255, Number(text) >> 8]) : value(text);
    if (isExplicit) explicitElement(g, e, vr, data);
    else implicitElement(g, e, data);
  };
  element(0x0008, 0x0060, 'CS', 'MR');
  element(0x0020, 0x0013, 'IS', instance);
  element(0x0020, 0x0032, 'DS', position);
  element(0x0020, 0x0037, 'DS', '1\\0\\0\\0\\1\\0');
  element(0x0028, 0x0002, 'US', '1');
  element(0x0028, 0x0004, 'CS', photo);
  if (frames !== 1) element(0x0028, 0x0008, 'IS', String(frames));
  element(0x0028, 0x0010, 'US', String(rows));
  element(0x0028, 0x0011, 'US', String(columns));
  element(0x0028, 0x0100, 'US', String(bits));
  element(0x0028, 0x0101, 'US', String(storedBits));
  element(0x0028, 0x0102, 'US', String(storedBits - 1));
  element(0x0028, 0x0103, 'US', signed ? '1' : '0');
  element(0x0028, 0x1050, 'DS', window[0]);
  element(0x0028, 0x1051, 'DS', window[1]);
  if (sequence) {
    bytes(0x08,0x00,0x11,0x11,0x53,0x51,0,0,0xff,0xff,0xff,0xff);
    bytes(0xfe,0xff,0x00,0xe0,0xff,0xff,0xff,0xff);
    const nested = value('1.2.3');
    bytes(0x08,0x00,0x50,0x11,0x55,0x49,nested.length,0); chunks.push(nested);
    bytes(0xfe,0xff,0x0d,0xe0,0,0,0,0,0xfe,0xff,0xdd,0xe0,0,0,0,0);
  }
  const pixelBytes = new Uint8Array(pixels.length * (bits / 8));
  const pixelView = new DataView(pixelBytes.buffer);
  pixels.forEach((pixel, index) => {
    const encoded = pixel & (storedBits === 16 ? 0xffff : (2 ** storedBits) - 1);
    if (bits === 8) pixelBytes[index] = encoded;
    else pixelView.setUint16(index * 2, encoded, true);
  });
  if (isExplicit) explicitElement(0x7fe0, 0x0010, 'OW', pixelBytes);
  else implicitElement(0x7fe0, 0x0010, pixelBytes);
  return chunks.reduce((out, chunk) => { const joined = new Uint8Array(out.length + chunk.length); joined.set(out); joined.set(chunk, out.length); return joined; }, new Uint8Array());
}

test('parses Explicit VR Little Endian and keeps private identity fields out of metadata', () => {
  const result = parseDicomFile(fixture(), { name: 'scan-01.dcm' });
  assert.equal(result.transferSyntaxName, 'Explicit VR Little Endian');
  assert.equal(result.rows, 2);
  assert.equal(result.columns, 2);
  assert.equal(result.modality, 'MR');
  assert.deepEqual([...result.pixels], [0, 100, 200, 300]);
  assert.equal('PatientName' in result, false);
});

test('parses the mandatory default Implicit VR Little Endian encoding', () => {
  const result = parseDicomFile(fixture({ syntax: '1.2.840.10008.1.2' }));
  assert.equal(result.transferSyntaxName, 'Implicit VR Little Endian');
  assert.deepEqual([...result.pixels], [0, 100, 200, 300]);
});

test('reads 8-bit and signed stored samples without changing their values', () => {
  const eightBit = parseDicomFile(fixture({ bits: 8, pixels: [0, 85, 170, 255], window: ['128', '256'] }));
  assert.deepEqual([...eightBit.pixels], [0, 85, 170, 255]);
  const signed = parseDicomFile(fixture({ bits: 16, storedBits: 12, signed: true, pixels: [-100, 0, 100, 200], window: ['50', '351'] }));
  assert.deepEqual([...signed.pixels], [-100, 0, 100, 200]);
});

test('skips nested undefined-length metadata sequences safely before pixel data', () => {
  const result = parseDicomFile(fixture({ sequence: true }));
  assert.deepEqual([...result.pixels], [0, 100, 200, 300]);
});

test('inverts MONOCHROME1 and applies a selected window to pixel values', () => {
  const mono1 = parseDicomFile(fixture({ photo: 'MONOCHROME1', window: ['150', '301'] }));
  assert.deepEqual([...windowDicomPixels(mono1)], [255, 170, 85, 0]);
  const mono2 = parseDicomFile(fixture({ window: ['150', '301'] }));
  assert.deepEqual([...windowDicomPixels(mono2)], [0, 85, 170, 255]);
  assert.deepEqual([...windowDicomPixels(mono2, 150, 1)], [0, 0, 255, 255]);
});

test('orders slices by position projected onto the image-plane normal', () => {
  const top = parseDicomFile(fixture({ position: '0\\0\\10', instance: '1' }), { name: 'slice-1.dcm' });
  const bottom = parseDicomFile(fixture({ position: '0\\0\\-2', instance: '9' }), { name: 'slice-9.dcm' });
  assert.deepEqual(orderDicomSeries([top, bottom]).map(({ sortPosition }) => sortPosition), [-2, 10]);
});

test('rejects compressed transfer syntaxes instead of returning a blank image', () => {
  assert.throws(() => parseDicomFile(fixture({ syntax: '1.2.840.10008.1.2.4.50' })), /unsupportedTransfer/u);
});

test('rejects multi-frame files and unsupported photometric/pixel formats', () => {
  const color = fixture({ photo: 'RGB', pixels: [0, 0, 0, 0] });
  assert.throws(() => parseDicomFile(color), /unsupportedPhotometric/u);
  const multi = fixture();
  assert.throws(() => parseDicomFile(fixture({ frames: 2 })), /multiFrame/u);
});

test('rejects non-Part-10 and out-of-range display parameters', () => {
  assert.throws(() => parseDicomFile(new Uint8Array(256)), /notPart10/u);
  const image = parseDicomFile(fixture());
  assert.throws(() => windowDicomPixels(image, 10, 0), /invalidWindow/u);
});
