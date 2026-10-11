const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  return crc >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

async function crc32Yielding(bytes, shouldCancel) {
  let crc = 0xffffffff;
  const chunkBytes = 1024 * 1024;
  for (let start = 0; start < bytes.length; start += chunkBytes) {
    if (shouldCancel?.()) throw new Error('Cancelled');
    const end = Math.min(start + chunkBytes, bytes.length);
    for (let index = start; index < end; index += 1) crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    if (end < bytes.length) await new Promise((resolve) => setTimeout(resolve, 0));
  }
  if (shouldCancel?.()) throw new Error('Cancelled');
  return (crc ^ 0xffffffff) >>> 0;
}

function header(size, filename, central, checksum, offset = 0) {
  const bytes = new Uint8Array((central ? 46 : 30) + filename.length);
  const view = new DataView(bytes.buffer);
  if (central) {
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true); view.setUint16(6, 20, true);
    view.setUint16(8, 0x0800, true); view.setUint16(10, 0, true);
    view.setUint16(12, 0, true); view.setUint16(14, 0x21, true);
    view.setUint32(16, checksum, true); view.setUint32(20, size, true); view.setUint32(24, size, true);
    view.setUint16(28, filename.length, true); view.setUint32(42, offset, true);
    bytes.set(filename, 46);
  } else {
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true); view.setUint16(8, 0, true);
    view.setUint16(10, 0, true); view.setUint16(12, 0x21, true);
    view.setUint32(14, checksum, true); view.setUint32(18, size, true); view.setUint32(22, size, true);
    view.setUint16(26, filename.length, true); bytes.set(filename, 30);
  }
  return bytes;
}

/** Make a ZIP of already-compressed browser outputs without spending CPU on compression. */
export async function createStoredZip(entries, { shouldCancel } = {}) {
  if (!Array.isArray(entries) || entries.length < 1 || entries.length > 65535) throw new RangeError('Invalid ZIP entry count.');
  const encoder = new TextEncoder();
  const body = [];
  const directory = [];
  let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(String(entry?.name ?? ''));
    const data = entry?.data;
    if (!name.length || name.length > 65535 || !(data instanceof Uint8Array) || data.byteLength > 0xffffffff) throw new RangeError('Invalid ZIP entry.');
    const checksum = await crc32Yielding(data, shouldCancel);
    const local = header(data.byteLength, name, false, checksum);
    body.push(local, data);
    directory.push(header(data.byteLength, name, true, checksum, offset));
    offset += local.byteLength + data.byteLength;
    if (offset > 0xffffffff) throw new RangeError('ZIP exceeds the supported 4 GiB format limit.');
  }
  const directoryOffset = offset;
  let directorySize = 0;
  for (const part of directory) directorySize += part.byteLength;
  if (directorySize > 0xffffffff || directoryOffset + directorySize > 0xffffffff) throw new RangeError('ZIP exceeds the supported 4 GiB format limit.');
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, entries.length, true); view.setUint16(10, entries.length, true);
  view.setUint32(12, directorySize, true); view.setUint32(16, directoryOffset, true);
  return new Blob([...body, ...directory, end], { type: 'application/zip' });
}

export function crc32ForZip(bytes) { return crc32(bytes); }
