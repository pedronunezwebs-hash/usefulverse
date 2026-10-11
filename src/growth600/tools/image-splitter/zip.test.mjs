import test from 'node:test';
import assert from 'node:assert/strict';
import { createStoredZip, crc32ForZip } from './zip.mjs';

const utf8 = new TextDecoder();

test('writes a valid stored ZIP with CRCs, UTF-8 filenames, and exact bytes', async () => {
  const entries = [
    { name: 'tiles/r01-c01.png', data: new Uint8Array([0, 1, 2, 255]) },
    { name: '東京/manifest.json', data: new TextEncoder().encode('{"ok":true}') },
  ];
  const zip = await createStoredZip(entries);
  assert.equal(zip.type, 'application/zip');
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(bytes.length - 12, true), 2);

  let offset = 0;
  for (const expected of entries) {
    assert.equal(view.getUint32(offset, true), 0x04034b50);
    assert.equal(view.getUint16(offset + 6, true), 0x0800);
    assert.equal(view.getUint16(offset + 8, true), 0);
    const nameLength = view.getUint16(offset + 26, true);
    const dataLength = view.getUint32(offset + 18, true);
    const name = utf8.decode(bytes.subarray(offset + 30, offset + 30 + nameLength));
    const data = bytes.subarray(offset + 30 + nameLength, offset + 30 + nameLength + dataLength);
    assert.equal(name, expected.name);
    assert.deepEqual(data, expected.data);
    offset += 30 + nameLength + dataLength;
  }
  assert.equal(view.getUint32(offset, true), 0x02014b50);
});

test('CRC-32 matches the ZIP/PKZIP standard test vector', () => {
  assert.equal(crc32ForZip(new TextEncoder().encode('123456789')), 0xcbf43926);
});

test('rejects invalid ZIP entries and an empty archive', async () => {
  await assert.rejects(createStoredZip([]), RangeError);
  await assert.rejects(createStoredZip([{ name: '', data: new Uint8Array() }]), RangeError);
  await assert.rejects(createStoredZip([{ name: 'x', data: new ArrayBuffer(1) }]), RangeError);
});

test('checks cancellation while preparing a large ZIP entry', async () => {
  const data = new Uint8Array(2 * 1024 * 1024);
  await assert.rejects(createStoredZip([{ name: 'large.png', data }], { shouldCancel: () => true }), /Cancelled/u);
});
