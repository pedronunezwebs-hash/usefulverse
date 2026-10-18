const qrCharacterSet = /^[\u0020-\u007e\u00a0-\u017f\u0218\u0219\u021a\u021b\u20ac]*$/u;
const recursiveTable = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];

function fail(code, field) {
  const error = new Error(code);
  error.code = code;
  error.field = field;
  throw error;
}

function required(value, field, max, { pattern, code = 'invalidField' } = {}) {
  const normalized = String(value ?? '').trim();
  if (!normalized || [...normalized].length > max || (pattern && !pattern.test(normalized)) || !qrCharacterSet.test(normalized)) fail(code, field);
  return normalized;
}

function optional(value, field, max, { pattern } = {}) {
  const normalized = String(value ?? '').trim();
  if ([...normalized].length > max || (pattern && normalized && !pattern.test(normalized)) || !qrCharacterSet.test(normalized)) fail('invalidField', field);
  return normalized;
}

function ibanRemainder(iban) {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let remainder = 0;
  for (const character of rearranged) {
    const digits = /[A-Z]/u.test(character) ? String(character.charCodeAt(0) - 55) : character;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

export function classifySwissIban(value) {
  const iban = String(value ?? '').replace(/[\s.]/gu, '').toUpperCase();
  if (!/^(CH|LI)\d{19}$/u.test(iban) || ibanRemainder(iban) !== 1) return { valid: false, kind: 'invalid' };
  const iid = Number(iban.slice(4, 9));
  return { valid: true, kind: iid >= 30000 && iid <= 31999 ? 'qr-iban' : 'iban', iban, iid };
}

export function qrReferenceCheckDigit(first26) {
  const value = String(first26 ?? '');
  if (!/^\d{26}$/u.test(value)) fail('invalidReference', 'reference');
  let carry = 0;
  for (const character of value) carry = recursiveTable[(carry + Number(character)) % 10];
  return String((10 - carry) % 10);
}

export function makeQrReference(first26) {
  const value = String(first26 ?? '');
  return `${value}${qrReferenceCheckDigit(value)}`;
}

export function validateQrReference(value) {
  const normalized = String(value ?? '').replaceAll(' ', '').trim();
  return /^\d{27}$/u.test(normalized) && qrReferenceCheckDigit(normalized.slice(0, 26)) === normalized[26];
}

function creditorReferenceRemainder(reference) {
  const expanded = `${reference.slice(4)}${reference.slice(0, 4)}`.toUpperCase();
  let remainder = 0;
  for (const character of expanded) {
    const digits = /[A-Z]/u.test(character) ? String(character.charCodeAt(0) - 55) : character;
    for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return remainder;
}

export function validateCreditorReference(value) {
  const reference = String(value ?? '').replaceAll(' ', '').toUpperCase();
  return /^RF\d{2}[A-Z0-9]{1,21}$/u.test(reference) && reference.length >= 5 && reference.length <= 25 && creditorReferenceRemainder(reference) === 1;
}

function addressLines(address, prefix) {
  const fields = address ?? {};
  const name = required(fields.name, `${prefix}.name`, 70);
  const street = optional(fields.street, `${prefix}.street`, 70);
  const building = optional(fields.building, `${prefix}.building`, 16);
  const postalCode = required(fields.postalCode, `${prefix}.postalCode`, 16);
  const city = required(fields.city, `${prefix}.city`, 35);
  const country = required(String(fields.country ?? '').toUpperCase(), `${prefix}.country`, 2, { pattern: /^[A-Z]{2}$/u });
  return ['S', name, street, building, postalCode, city, country];
}

export function buildSwissQrPayload(input) {
  const account = classifySwissIban(input?.iban);
  if (!account.valid) fail('invalidIban', 'iban');
  const referenceType = String(input.referenceType ?? 'NON').toUpperCase();
  if (!['QRR', 'SCOR', 'NON'].includes(referenceType)) fail('invalidReferenceType', 'referenceType');
  if (account.kind === 'qr-iban' && referenceType !== 'QRR') fail('qrIbanNeedsQrr', 'referenceType');
  if (account.kind === 'iban' && referenceType === 'QRR') fail('qrrNeedsQrIban', 'iban');

  const currency = String(input.currency ?? 'CHF').toUpperCase();
  if (!['CHF', 'EUR'].includes(currency)) fail('invalidCurrency', 'currency');
  if (referenceType === 'QRR' && currency !== 'CHF') fail('qrrChfOnly', 'currency');
  if (currency === 'EUR' && !(account.kind === 'iban' && ['SCOR', 'NON'].includes(referenceType))) fail('eurCombinationOnly', 'referenceType');

  const amountInput = String(input.amount ?? '').trim().replace(',', '.');
  let amount = '';
  if (amountInput) {
    if (!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/u.test(amountInput)) fail('invalidAmount', 'amount');
    const numeric = Number(amountInput);
    if (numeric < 0.01 || numeric > 999999999.99) fail('invalidAmount', 'amount');
    amount = numeric.toFixed(2);
  }

  let reference = '';
  if (referenceType === 'QRR') {
    reference = String(input.reference ?? '').replaceAll(' ', '').trim();
    if (!validateQrReference(reference)) fail('invalidReference', 'reference');
  } else if (referenceType === 'SCOR') {
    reference = String(input.reference ?? '').replaceAll(' ', '').toUpperCase().trim();
    if (!validateCreditorReference(reference)) fail('invalidReference', 'reference');
  }

  const message = optional(input.message, 'message', 140);
  const billing = optional(input.billingInformation, 'billingInformation', 140);
  if ([...message].length + [...billing].length > 140) fail('additionalInfoTooLong', 'message');
  const creditor = input.creditor ?? {};
  const debtorPresent = Object.values(input.debtor ?? {}).some((part) => String(part ?? '').trim());
  let debtor = Array(7).fill('');
  if (debtorPresent) debtor = addressLines(input.debtor, 'debtor');

  const fields = [
    'SPC', '0200', '1', account.iban,
    ...addressLines(creditor, 'creditor'),
    ...Array(7).fill(''), // Ultimate creditor is reserved and must remain empty.
    amount, currency,
    ...debtor,
    referenceType, reference, message, 'EPD',
  ];
  if (billing) fields.push(billing);
  const payload = fields.join('\n');
  if (fields.some((line) => !qrCharacterSet.test(line))) fail('invalidCharacter', 'payload');
  return { accountKind: account.kind, currency, payload, reference, referenceType };
}

export function parseSwissQrPayload(value) {
  const source = String(value ?? '').replaceAll('\r\n', '\n').replaceAll('\r', '\n').trimEnd();
  const fields = source.split('\n');
  if (fields.length < 31 || fields[0] !== 'SPC' || fields[1] !== '0200' || fields[2] !== '1') fail('invalidSwissQr', 'payload');
  const [type, version, coding, iban, creditorAddressType, creditorName, creditorStreet, creditorBuilding, creditorPostalCode, creditorCity, creditorCountry] = fields;
  if (type !== 'SPC' || version !== '0200' || coding !== '1') fail('invalidSwissQr', 'payload');
  const parsed = {
    iban,
    creditor: { addressType: creditorAddressType, name: creditorName, street: creditorStreet, building: creditorBuilding, postalCode: creditorPostalCode, city: creditorCity, country: creditorCountry },
    amount: fields[18], currency: fields[19],
    debtor: { addressType: fields[20], name: fields[21], street: fields[22], building: fields[23], postalCode: fields[24], city: fields[25], country: fields[26] },
    referenceType: fields[27], reference: fields[28], message: fields[29], billingInformation: fields[31] ?? '',
  };
  if (fields.slice(11, 18).some(Boolean) || fields[30] !== 'EPD' || fields.length > 32) fail('invalidSwissQr', 'payload');
  const regenerated = buildSwissQrPayload(parsed);
  if (regenerated.payload !== source) fail('invalidSwissQr', 'payload');
  return { ...parsed, valid: true, accountKind: regenerated.accountKind };
}
