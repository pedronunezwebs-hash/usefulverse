import { inflateSync, zipSync } from 'fflate';

export const OFFICE_PACKAGE_LIMITS = Object.freeze({
  inputBytes: 100 * 1024 * 1024,
  expandedBytes: 200 * 1024 * 1024,
  entries: 5_000,
});

const EXPECTED_PARTS = Object.freeze({
  docx: 'word/document.xml',
  xlsx: 'xl/workbook.xml',
  pptx: 'ppt/presentation.xml',
});

const SIGNED_OR_MACRO_CONTENT = /(?:_xmlsignatures\/|vbaProject\.bin|macroEnabled|digital-signature\/)/iu;
const ALREADY_COMPRESSED = /\.(?:avif|gif|heic|jpe?g|m4a|mp[34]|pdf|png|webp|woff2|zip|gz)$/iu;
const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function fail(message) { throw new TypeError(message); }

function getView(input) {
  if (!(input instanceof Uint8Array) || input.byteLength < 22) fail('The file is not a supported Office package.');
  if (input.byteLength > OFFICE_PACKAGE_LIMITS.inputBytes) fail('This file is larger than the 100 MB local processing limit.');
  return new DataView(input.buffer, input.byteOffset, input.byteLength);
}

function findEndOfCentralDirectory(bytes, view) {
  const floor = Math.max(0, bytes.length - 65_557);
  for (let offset = bytes.length - 22; offset >= floor; offset -= 1) {
    if (view.getUint32(offset, true) !== 0x06054b50) continue;
    const commentLength = view.getUint16(offset + 20, true);
    if (offset + 22 + commentLength === bytes.length) return offset;
  }
  fail('The ZIP package is incomplete or damaged.');
}

function decodePath(bytes, start, length) {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes.subarray(start, start + length)); }
  catch { fail('The Office package contains an invalid file name.'); }
}

function validPackagePath(path) {
  if (!path || path.startsWith('/') || path.includes('\\') || path.includes('\0') || /^[a-z]:/iu.test(path)) return false;
  return path.split('/').every((segment, index, segments) => segment !== '..' && segment !== '.' && (segment !== '' || index === segments.length - 1));
}

/**
 * Preflight ZIP central and local headers before fflate allocates expanded data.
 * This is a conservative OOXML-only guard, not a general ZIP-file validator.
 */
export function inspectOfficePackage(input, extension) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const view = getView(bytes);
  const ext = String(extension).replace(/^\./u, '').toLowerCase();
  if (!Object.hasOwn(EXPECTED_PARTS, ext)) fail('Choose a modern DOCX, XLSX or PPTX file.');

  const eocd = findEndOfCentralDirectory(bytes, view);
  const disk = view.getUint16(eocd + 4, true);
  const centralDisk = view.getUint16(eocd + 6, true);
  const diskEntries = view.getUint16(eocd + 8, true);
  const entryCount = view.getUint16(eocd + 10, true);
  const centralSize = view.getUint32(eocd + 12, true);
  const centralOffset = view.getUint32(eocd + 16, true);
  if (disk || centralDisk || diskEntries !== entryCount || entryCount === 0xffff || entryCount > OFFICE_PACKAGE_LIMITS.entries || centralSize === 0xffffffff || centralOffset === 0xffffffff) {
    fail('This multi-disk, ZIP64 or unusually large package is not supported.');
  }
  if (centralOffset + centralSize !== eocd) fail('The ZIP package has an unsupported or damaged directory.');

  const entries = [];
  const names = new Set();
  const ranges = [];
  let cursor = centralOffset;
  let expandedSize = 0;
  for (let index = 0; index < entryCount; index += 1) {
    if (cursor + 46 > eocd || view.getUint32(cursor, true) !== 0x02014b50) fail('The Office package directory is damaged.');
    const madeBy = view.getUint16(cursor + 4, true) >>> 8;
    const flags = view.getUint16(cursor + 8, true);
    const method = view.getUint16(cursor + 10, true);
    const checksum = view.getUint32(cursor + 16, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const originalSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const startDisk = view.getUint16(cursor + 34, true);
    const externalAttributes = view.getUint32(cursor + 38, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const recordEnd = cursor + 46 + nameLength + extraLength + commentLength;
    if (recordEnd > eocd || startDisk !== 0 || compressedSize === 0xffffffff || originalSize === 0xffffffff || localOffset === 0xffffffff) fail('This ZIP64 or split package is not supported.');
    if (flags & 0x41) fail('Encrypted Office packages are not supported.');
    if (method !== 0 && method !== 8) fail('This Office package uses an unsupported compression method.');
    const name = decodePath(bytes, cursor + 46, nameLength);
    if (!validPackagePath(name)) fail('The Office package contains an unsafe file path.');
    const key = name.toLowerCase();
    if (names.has(key)) fail('The Office package contains duplicate file paths and cannot be safely repacked.');
    names.add(key);

    const extraStart = cursor + 46 + nameLength;
    for (let extra = extraStart; extra + 4 <= extraStart + extraLength;) {
      const id = view.getUint16(extra, true);
      const size = view.getUint16(extra + 2, true);
      if (extra + 4 + size > extraStart + extraLength) fail('The Office package has a damaged ZIP extension.');
      if (id === 0x0001) fail('ZIP64 Office packages are not supported.');
      extra += 4 + size;
    }

    if (madeBy === 3 && ((externalAttributes >>> 16) & 0xf000) === 0xa000) fail('Symbolic links inside Office packages are not supported.');
    const local = localOffset;
    if (local + 30 > centralOffset || view.getUint32(local, true) !== 0x04034b50) fail('The Office package contains an invalid file record.');
    const localFlags = view.getUint16(local + 6, true);
    const localMethod = view.getUint16(local + 8, true);
    const localNameLength = view.getUint16(local + 26, true);
    const localExtraLength = view.getUint16(local + 28, true);
    const localName = decodePath(bytes, local + 30, localNameLength);
    if (localName !== name || localFlags !== flags || localMethod !== method) fail('The Office package file records do not match.');
    const dataStart = local + 30 + localNameLength + localExtraLength;
    const dataEnd = dataStart + compressedSize;
    if (dataEnd > centralOffset || dataEnd < dataStart) fail('The Office package contains an invalid compressed-data range.');
    ranges.push([local, dataEnd]);
    expandedSize += originalSize;
    if (expandedSize > OFFICE_PACKAGE_LIMITS.expandedBytes) fail('The expanded package exceeds the 200 MB local processing limit.');
    entries.push({ name, method, checksum, originalSize, compressedSize, dataStart, dataEnd, directory: name.endsWith('/') });
    cursor = recordEnd;
  }
  if (cursor !== eocd) fail('The Office package directory has trailing data.');
  ranges.sort((left, right) => left[0] - right[0]);
  for (let index = 1; index < ranges.length; index += 1) if (ranges[index][0] < ranges[index - 1][1]) fail('The Office package has overlapping file records.');

  const required = ['[Content_Types].xml', EXPECTED_PARTS[ext]];
  if (required.some((name) => !names.has(name.toLowerCase()))) fail('The selected file is not a valid modern Office document of that type.');
  if ([...names].some((name) => SIGNED_OR_MACRO_CONTENT.test(name))) fail('Signed or macro-enabled Office files are not supported, to avoid invalidating signatures or macros.');
  const contentTypesEntry = entries.find((entry) => entry.name.toLowerCase() === '[content_types].xml');
  if (!contentTypesEntry || contentTypesEntry.originalSize > 2 * 1024 * 1024) fail('The Office package content-types record is invalid.');

  return { extension: ext, entries, expandedSize, contentTypesName: contentTypesEntry.name };
}

export function recompressOfficePackage(input, fileName) {
  const extension = String(fileName).split('.').pop()?.toLowerCase() ?? '';
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const inspection = inspectOfficePackage(bytes, extension);
  const parts = Object.create(null);
  for (const entry of inspection.entries) {
    if (entry.directory) continue;
    const compressed = bytes.subarray(entry.dataStart, entry.dataEnd);
    let data;
    try {
      if (entry.method === 0) {
        if (compressed.byteLength !== entry.originalSize) fail('An Office package part did not pass its size check.');
        data = compressed.slice();
      } else {
        data = inflateSync(compressed, { out: new Uint8Array(entry.originalSize) });
      }
    } catch (error) {
      if (error?.message === 'An Office package part did not pass its size check.') throw error;
      fail('The Office package could not be safely opened.');
    }
    if (data.byteLength !== entry.originalSize || crc32(data) !== entry.checksum) fail('An Office package part did not pass its size check.');
    parts[entry.name] = data;
  }
  const contentTypes = new TextDecoder().decode(parts[inspection.contentTypesName]);
  if (SIGNED_OR_MACRO_CONTENT.test(contentTypes)) fail('Signed or macro-enabled Office files are not supported, to avoid invalidating signatures or macros.');

  const archive = Object.create(null);
  for (const [name, data] of Object.entries(parts)) {
    archive[name] = [data, { level: ALREADY_COMPRESSED.test(name) ? 0 : 9 }];
  }
  const output = zipSync(archive, { level: 9 });
  if (output.byteLength >= bytes.byteLength) return { smaller: false, inputBytes: bytes.byteLength, outputBytes: output.byteLength };
  return { smaller: true, extension, inputBytes: bytes.byteLength, outputBytes: output.byteLength, bytes: output };
}
