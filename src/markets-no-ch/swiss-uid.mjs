const weights = Object.freeze([5, 4, 3, 2, 7, 6, 5, 4]);

export function swissUidCheckDigit(firstEight) {
  const digits = String(firstEight).replace(/\D/gu, '');
  if (!/^\d{8}$/u.test(digits)) throw new RangeError('UID needs exactly eight body digits.');
  const sum = [...digits].reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
  const remainder = sum % 11;
  const check = remainder === 0 ? 0 : 11 - remainder;
  return check === 10 ? null : check;
}

export function validateSwissUid(input) {
  const original = String(input ?? '').trim();
  if (!original) return { original, normalized: '', status: 'empty' };
  // Supplements HR/RC and MWST/TVA/IVA are mutable metadata, not part of the
  // identifier; they do not prove current commercial-register or VAT status.
  const base = original.replace(/\s+(?:HR|RC|MWST|TVA|IVA)(?:\/(?:HR|RC|MWST|TVA|IVA))*\s*$/iu, '').trim();
  const match = base.match(/^(?:CHE\s*-?\s*)?(\d{3})[.\s-]?(\d{3})[.\s-]?(\d{3})$/iu);
  if (!match) return { original, normalized: '', status: 'format' };
  const digits = match.slice(1).join('');
  const expected = swissUidCheckDigit(digits.slice(0, 8));
  const normalized = `CHE-${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  if (expected === null) return { original, normalized, status: 'unassigned-check-digit' };
  return { original, normalized, status: Number(digits[8]) === expected ? 'checksum-ok' : 'checksum-error', expectedCheckDigit: expected };
}

export function validateSwissUidBatch(input, maximum = 100) {
  const rows = String(input ?? '').split(/\r?\n/u).map((value) => value.trim()).filter(Boolean);
  if (rows.length > maximum) throw new RangeError(`Enter no more than ${maximum} UID numbers.`);
  return rows.map(validateSwissUid);
}
