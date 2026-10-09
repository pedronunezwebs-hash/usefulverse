export const TEXT_BINARY_LIMITS = Object.freeze({ textCharacters: 20_000, binaryBits: 160_000, binaryCharacters: 200_000 });

export function encodeTextToBinary(text, { groupBytes = true } = {}) {
  if (typeof text !== 'string' || text.length === 0) throw new Error('empty-input');
  if (text.length > TEXT_BINARY_LIMITS.textCharacters) throw new Error('text-too-long');
  const bytes = new TextEncoder().encode(text);
  const groups = Array.from(bytes, (byte) => byte.toString(2).padStart(8, '0'));
  return groupBytes ? groups.join(' ') : groups.join('');
}

export function decodeBinaryToText(binary) {
  if (typeof binary !== 'string' || binary.length === 0) throw new Error('empty-input');
  if (binary.length > TEXT_BINARY_LIMITS.binaryCharacters) throw new Error('binary-too-long');
  const compact = binary.replace(/\s/gu, '');
  if (!compact) throw new Error('empty-input');
  if (compact.length > TEXT_BINARY_LIMITS.binaryBits) throw new Error('binary-too-long');
  if (!/^[01]+$/u.test(compact)) throw new Error('binary-invalid');
  if (compact.length % 8 !== 0) throw new Error('binary-incomplete');
  const bytes = new Uint8Array(compact.length / 8);
  for (let offset = 0; offset < compact.length; offset += 8) bytes[offset / 8] = Number.parseInt(compact.slice(offset, offset + 8), 2);
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    throw new Error('utf8-invalid');
  }
}
