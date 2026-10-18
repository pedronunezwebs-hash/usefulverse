export const BARCODE_FORMATS = Object.freeze(['code_128', 'ean_13', 'ean_8', 'upc_a', 'upc_e']);

export function detectorFormats(formats) {
  if (!Array.isArray(formats)) return [];
  const available = new Set(formats);
  return BARCODE_FORMATS.filter((format) => available.has(format));
}

export function formatsAvailable(formats) {
  if (!Array.isArray(formats)) return [];
  const available = new Set(formats);
  return BARCODE_FORMATS.filter((format) => available.has(format) || (format === 'upc_a' && available.has('ean_13')));
}

export function validEan(value) {
  if (!/^\d{8}$|^\d{12,13}$/u.test(value)) return false;
  const digits = [...value].map(Number);
  const check = digits.pop();
  let sum = 0;
  for (let i = digits.length - 1, weight = 3; i >= 0; i -= 1, weight = weight === 3 ? 1 : 3) sum += digits[i] * weight;
  return (10 - (sum % 10)) % 10 === check;
}

export function expandUpcE(value) {
  if (!/^\d{8}$/u.test(value) || !['0', '1'].includes(value[0])) return null;
  const [system, a, b, c, d, e, f, check] = value;
  let body;
  if (f === '0' || f === '1' || f === '2') body = `${system}${a}${b}${f}0000${c}${d}${e}`;
  else if (f === '3') body = `${system}${a}${b}${c}00000${d}${e}`;
  else if (f === '4') body = `${system}${a}${b}${c}${d}00000${e}`;
  else body = `${system}${a}${b}${c}${d}${e}0000${f}`;
  return `${body}${check}`;
}

export function normalizeBarcodeDetection(detection) {
  const rawValue = String(detection?.rawValue ?? '').trim();
  const format = String(detection?.format ?? '').toLowerCase();
  if (!rawValue) return null;
  if (format === 'ean_13' || format === 'upc_a') {
    if (!validEan(rawValue)) return { format: format === 'upc_a' ? 'UPC-A' : 'EAN-13', value: rawValue, checksum: 'invalid' };
    if (format === 'ean_13' && rawValue.length === 13 && rawValue.startsWith('0')) return { format: 'UPC-A', value: rawValue.slice(1), checksum: 'valid' };
    return { format: format === 'upc_a' ? 'UPC-A' : 'EAN-13', value: rawValue, checksum: 'valid' };
  }
  if (format === 'ean_8') return { format: 'EAN-8', value: rawValue, checksum: validEan(rawValue) ? 'valid' : 'invalid' };
  if (format === 'upc_e') {
    const expanded = expandUpcE(rawValue);
    return { format: 'UPC-E', value: rawValue, checksum: expanded && validEan(expanded) ? 'valid' : 'invalid' };
  }
  if (format === 'code_128') return { format: 'Code 128', value: rawValue, checksum: 'decoder' };
  return { format: format.replaceAll('_', '-').toUpperCase() || 'Unknown', value: rawValue, checksum: 'decoder' };
}

export function mergeDetections(current, incoming, maximum = 100) {
  const seen = new Set(current.map(({ format, value }) => `${format}\u0000${value}`));
  const next = [...current];
  for (const detection of incoming) {
    const normalized = normalizeBarcodeDetection(detection);
    if (!normalized) continue;
    const key = `${normalized.format}\u0000${normalized.value}`;
    if (seen.has(key)) continue;
    seen.add(key); next.push(normalized);
    if (next.length >= maximum) break;
  }
  return next;
}
