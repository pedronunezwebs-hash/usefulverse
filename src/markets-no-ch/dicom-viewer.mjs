const TRANSFER_SYNTAX = Object.freeze({
  '1.2.840.10008.1.2': 'Implicit VR Little Endian',
  '1.2.840.10008.1.2.1': 'Explicit VR Little Endian',
});

const MAX_FILE_BYTES = 16 * 1024 * 1024;
const MAX_DIMENSION = 2048;
const MAX_PIXELS = 4_000_000;
const cleanText = (bytes) => new TextDecoder('ascii').decode(bytes).replace(/[\0\s]+$/u, '').trim();

function fail(message) { throw new Error(message); }

function tagKey(group, element) { return `${group.toString(16).padStart(4, '0')},${element.toString(16).padStart(4, '0')}`; }

function parseHeader(view, bytes) {
  if (bytes.byteLength < 144 || cleanText(bytes.subarray(128, 132)) !== 'DICM') fail('notPart10');
  let offset = 132;
  let transferSyntax = '';
  while (offset + 8 <= bytes.length) {
    const group = view.getUint16(offset, true);
    if (group !== 0x0002) break;
    const element = view.getUint16(offset + 2, true);
    const vr = String.fromCharCode(bytes[offset + 4], bytes[offset + 5]);
    const longVr = ['OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'UC', 'UR', 'UT', 'UN'].includes(vr);
    const lengthOffset = offset + (longVr ? 8 : 6);
    if (lengthOffset + (longVr ? 4 : 2) > bytes.length) fail('malformed');
    const length = longVr ? view.getUint32(offset + 8, true) : view.getUint16(offset + 6, true);
    const valueOffset = lengthOffset + (longVr ? 4 : 2);
    if (length === 0xffffffff || valueOffset + length > bytes.length) fail('malformed');
    if (element === 0x0010) transferSyntax = cleanText(bytes.subarray(valueOffset, valueOffset + length));
    offset = valueOffset + length + (length % 2);
  }
  if (!TRANSFER_SYNTAX[transferSyntax]) fail('unsupportedTransfer');
  return { offset, transferSyntax, explicit: transferSyntax === '1.2.840.10008.1.2.1' };
}

function parseNumberList(value) {
  return String(value ?? '').split('\\').map((part) => Number(part.trim())).filter(Number.isFinite);
}

function skipUndefinedValue(view, bytes, start, explicit, depth = 0, stopElement = 0xe0dd) {
  if (depth > 32) fail('malformed');
  let offset = start;
  while (offset + 8 <= bytes.length) {
    const group = view.getUint16(offset, true);
    const element = view.getUint16(offset + 2, true);
    const key = tagKey(group, element);
    const length = view.getUint32(offset + 4, true);
    if (group === 0xfffe && (element === 0xe00d || element === 0xe0dd)) {
      if (element !== stopElement) fail('malformed');
      return offset + 8;
    }
    if (group === 0xfffe && element === 0xe000) {
      const itemStart = offset + 8;
      if (length === 0xffffffff) offset = skipUndefinedValue(view, bytes, itemStart, explicit, depth + 1, 0xe00d);
      else {
        if (itemStart + length > bytes.length) fail('malformed');
        offset = itemStart + length;
      }
      continue;
    }
    const vr = explicit ? String.fromCharCode(bytes[offset + 4], bytes[offset + 5]) : '';
    const longVr = ['OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'UC', 'UR', 'UT', 'UN'].includes(vr);
    const valueOffset = offset + (explicit ? (longVr ? 12 : 8) : 8);
    const valueLength = explicit ? (longVr ? view.getUint32(offset + 8, true) : view.getUint16(offset + 6, true)) : length;
    if (valueOffset > bytes.length) fail('malformed');
    if (valueLength === 0xffffffff) offset = skipUndefinedValue(view, bytes, valueOffset, explicit, depth + 1, 0xe0dd);
    else {
      if (valueOffset + valueLength > bytes.length) fail('malformed');
      offset = valueOffset + valueLength + (valueLength % 2);
    }
    if (key === '7fe0,0010') fail('malformed');
  }
  fail('malformed');
}

function parseDataSet(bytes, view, header) {
  const metadata = {};
  let pixelOffset = -1;
  let pixelLength = 0;
  let offset = header.offset;
  while (offset + 8 <= bytes.length) {
    const group = view.getUint16(offset, true);
    const element = view.getUint16(offset + 2, true);
    const key = tagKey(group, element);
    const vr = header.explicit ? String.fromCharCode(bytes[offset + 4], bytes[offset + 5]) : '';
    const longVr = ['OB', 'OD', 'OF', 'OL', 'OV', 'OW', 'SQ', 'UC', 'UR', 'UT', 'UN'].includes(vr);
    const valueOffset = offset + (header.explicit ? (longVr ? 12 : 8) : 8);
    if (valueOffset > bytes.length) fail('malformed');
    const length = header.explicit
      ? (longVr ? view.getUint32(offset + 8, true) : view.getUint16(offset + 6, true))
      : view.getUint32(offset + 4, true);
    if (length === 0xffffffff) {
      if (key === '0028,3000') metadata.unsupportedModalityLut = true;
      offset = skipUndefinedValue(view, bytes, valueOffset, header.explicit);
      continue;
    }
    const end = valueOffset + length;
    if (end > bytes.length) fail('malformed');
    if (key === '0028,3000') metadata.unsupportedModalityLut = true;
    if (key === '7fe0,0010') { pixelOffset = valueOffset; pixelLength = length; break; }
    if (['0008,0060','0018,0050','0020,000e','0020,0013','0020,0032','0020,0037','0028,0002','0028,0004','0028,0008','0028,0010','0028,0011','0028,0030','0028,0100','0028,0101','0028,0102','0028,0103','0028,1050','0028,1051','0028,1052','0028,1053'].includes(key)) {
      const numericVr = ['0028,0002','0028,0010','0028,0011','0028,0100','0028,0101','0028,0102','0028,0103'].includes(key);
      metadata[key] = numericVr && length >= 2 ? String(view.getUint16(valueOffset, true)) : cleanText(bytes.subarray(valueOffset, end));
    }
    offset = end + (length % 2);
  }
  if (pixelOffset < 0) fail('noPixelData');
  return { metadata, pixelOffset, pixelLength };
}

export function parseDicomFile(input, { name = 'image.dcm' } = {}) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  if (bytes.byteLength > MAX_FILE_BYTES) fail('fileTooLarge');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const header = parseHeader(view, bytes);
  const { metadata: m, pixelOffset, pixelLength } = parseDataSet(bytes, view, header);
  if (m.unsupportedModalityLut) fail('unsupportedModalityLut');
  const number = (key, fallback = NaN) => Number(m[key] ?? fallback);
  const rows = number('0028,0010');
  const columns = number('0028,0011');
  const samples = number('0028,0002', 1);
  const bitsAllocated = number('0028,0100');
  const bitsStored = number('0028,0101', bitsAllocated);
  const highBit = number('0028,0102', bitsStored - 1);
  const pixelRepresentation = number('0028,0103', 0);
  const photometric = m['0028,0004'];
  const frameCount = number('0028,0008', 1);
  if (!Number.isInteger(rows) || !Number.isInteger(columns) || rows < 1 || columns < 1 || rows > MAX_DIMENSION || columns > MAX_DIMENSION || rows * columns > MAX_PIXELS) fail('dimensions');
  if (samples !== 1 || !['MONOCHROME1', 'MONOCHROME2'].includes(photometric)) fail('unsupportedPhotometric');
  if (![8, 16].includes(bitsAllocated) || !Number.isInteger(bitsStored) || bitsStored < 1 || bitsStored > bitsAllocated || highBit < bitsStored - 1 || highBit >= bitsAllocated || ![0, 1].includes(pixelRepresentation)) fail('unsupportedPixelFormat');
  if (frameCount !== 1) fail('multiFrame');
  if (pixelLength < rows * columns * (bitsAllocated / 8)) fail('malformed');
  const pixels = new Float32Array(rows * columns);
  const shift = highBit + 1 - bitsStored;
  const mask = bitsStored === 16 ? 0xffff : (2 ** bitsStored) - 1;
  const slope = number('0028,1053', 1);
  const intercept = number('0028,1052', 0);
  if (!Number.isFinite(slope) || slope === 0 || !Number.isFinite(intercept)) fail('invalidRescale');
  let min = Infinity; let max = -Infinity;
  for (let i = 0; i < pixels.length; i += 1) {
    const raw = bitsAllocated === 8 ? bytes[pixelOffset + i] : view.getUint16(pixelOffset + i * 2, true);
    let sample = (raw >>> shift) & mask;
    if (pixelRepresentation && (sample & (2 ** (bitsStored - 1)))) sample -= 2 ** bitsStored;
    const value = sample * slope + intercept;
    pixels[i] = value;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const windowCenter = parseNumberList(m['0028,1050'])[0];
  const windowWidth = parseNumberList(m['0028,1051'])[0];
  const position = parseNumberList(m['0020,0032']);
  const orientation = parseNumberList(m['0020,0037']);
  let sortPosition = NaN;
  if (position.length === 3 && orientation.length === 6) {
    const normal = [
      orientation[1] * orientation[5] - orientation[2] * orientation[4],
      orientation[2] * orientation[3] - orientation[0] * orientation[5],
      orientation[0] * orientation[4] - orientation[1] * orientation[3],
    ];
    sortPosition = normal.reduce((sum, value, index) => sum + value * position[index], 0);
  }
  return {
    name: String(name).slice(0, 120), rows, columns, bitsAllocated, bitsStored,
    photometric, modality: m['0008,0060'] || '', transferSyntax: header.transferSyntax,
    seriesInstanceUid: m['0020,000e'] || '',
    transferSyntaxName: TRANSFER_SYNTAX[header.transferSyntax],
    pixelSpacing: parseNumberList(m['0028,0030']),
    sliceThickness: Number(m['0018,0050']) || null,
    imagePosition: position.length === 3 ? position : [],
    imageOrientation: orientation.length === 6 ? orientation : [],
    sortPosition,
    instanceNumber: Number(m['0020,0013']) || null,
    windowCenter: Number.isFinite(windowCenter) ? windowCenter * slope + intercept : (min + max) / 2,
    windowWidth: Number.isFinite(windowWidth) && windowWidth > 1 ? windowWidth * Math.abs(slope) : Math.max(1, max - min),
    min, max, pixels,
  };
}

export function windowDicomPixels(image, center = image.windowCenter, width = image.windowWidth) {
  const c = Number(center); const w = Number(width);
  if (!Number.isFinite(c) || !Number.isFinite(w) || w < 1) fail('invalidWindow');
  const output = new Uint8ClampedArray(image.pixels.length);
  const low = c - 0.5 - (w - 1) / 2;
  const high = c - 0.5 + (w - 1) / 2;
  for (let index = 0; index < output.length; index += 1) {
    const value = image.pixels[index];
    let gray = w <= 1 ? (value <= low ? 0 : 255) : (value <= low ? 0 : value > high ? 255 : ((value - (c - 0.5)) / (w - 1) + 0.5) * 255);
    if (image.photometric === 'MONOCHROME1') gray = 255 - gray;
    output[index] = gray;
  }
  return output;
}

export function orderDicomSeries(images) {
  const hasCompletePosition = images.length > 0 && images.every((image) => Number.isFinite(image.sortPosition));
  return [...images].sort((a, b) => {
    if (hasCompletePosition && a.sortPosition !== b.sortPosition) return a.sortPosition - b.sortPosition;
    if (a.instanceNumber != null && b.instanceNumber != null && a.instanceNumber !== b.instanceNumber) return a.instanceNumber - b.instanceNumber;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
}
