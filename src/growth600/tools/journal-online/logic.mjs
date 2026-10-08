export const MAX_JOURNAL_ENTRIES = 1_000;
export const MAX_JOURNAL_TITLE_LENGTH = 160;
export const MAX_JOURNAL_BODY_LENGTH = 8_000;
export const MAX_JOURNAL_TAGS = 12;
export const MAX_JOURNAL_BACKUP_BYTES = 10 * 1024 * 1024;
export const MAX_JOURNAL_ENCRYPTED_BACKUP_BYTES = 14 * 1024 * 1024;
export const JOURNAL_BACKUP_KDF_ITERATIONS = 600_000;
const BACKUP_FORMAT = 'usefulverse-journal-encrypted-backup';
const encoder = new TextEncoder();

function parseDate(value) {
  const text = String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) throw new RangeError('Enter a valid calendar date.');
  const date = new Date(`${text}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== text || Number(text.slice(0, 4)) < 1900 || Number(text.slice(0, 4)) > 2100) throw new RangeError('Enter a supported calendar date.');
  return text;
}

function cleanEntry(value) {
  const id = String(value?.id ?? '').trim();
  const date = parseDate(value?.date);
  const title = String(value?.title ?? '').trim();
  const body = String(value?.body ?? '').trim();
  const tags = [...new Set((Array.isArray(value?.tags) ? value.tags : []).map((tag) => String(tag).trim()).filter(Boolean))];
  if (!id || id.length > 64) throw new RangeError('Each entry needs a short ID.');
  if (!title || title.length > MAX_JOURNAL_TITLE_LENGTH) throw new RangeError(`A title is required and must be at most ${MAX_JOURNAL_TITLE_LENGTH} characters.`);
  if (!body || body.length > MAX_JOURNAL_BODY_LENGTH) throw new RangeError(`An entry is required and must be at most ${MAX_JOURNAL_BODY_LENGTH} characters.`);
  if (tags.length > MAX_JOURNAL_TAGS || tags.some((tag) => tag.length > 32)) throw new RangeError('Use at most 12 tags, each up to 32 characters.');
  return Object.freeze({ id, date, title, body, tags: Object.freeze(tags) });
}

export function createJournalEntry(value) {
  return cleanEntry(value);
}

export function upsertJournalEntry(entries, value) {
  if (!Array.isArray(entries)) throw new TypeError('A journal-entry list is required.');
  const clean = entries.map(cleanEntry);
  const entry = cleanEntry(value);
  const index = clean.findIndex(({ id }) => id === entry.id);
  if (index >= 0) clean[index] = entry;
  else clean.push(entry);
  if (clean.length > MAX_JOURNAL_ENTRIES) throw new RangeError(`A journal can contain at most ${MAX_JOURNAL_ENTRIES} entries in one backup.`);
  return Object.freeze(clean.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)));
}

export function removeJournalEntry(entries, id) {
  if (!Array.isArray(entries)) throw new TypeError('A journal-entry list is required.');
  return Object.freeze(entries.map(cleanEntry).filter((entry) => entry.id !== String(id)).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)));
}

export function restoreJournalLog(value) {
  if (!value || value.schemaVersion !== 1 || !Array.isArray(value.entries) || value.entries.length > MAX_JOURNAL_ENTRIES) throw new TypeError('This is not a supported journal backup.');
  const entries = value.entries.map(cleanEntry);
  if (new Set(entries.map(({ id }) => id)).size !== entries.length) throw new TypeError('A backup cannot contain duplicate entry IDs.');
  return Object.freeze({ schemaVersion: 1, entries: Object.freeze(entries.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))) });
}

export function serializeJournalBackup(value) {
  const serialized = JSON.stringify(restoreJournalLog(value), null, 2);
  if (encoder.encode(serialized).byteLength > MAX_JOURNAL_BACKUP_BYTES) throw new RangeError('Journal backup is too large.');
  return serialized;
}

function fold(value, locale) {
  return String(value).normalize('NFKC').toLocaleLowerCase(locale);
}

export function searchJournalEntries(entries, { query = '', dateFrom = '', dateTo = '', locale = 'en' } = {}) {
  const from = dateFrom ? parseDate(dateFrom) : '';
  const to = dateTo ? parseDate(dateTo) : '';
  if (from && to && from > to) throw new RangeError('The start date must not be after the end date.');
  const needle = fold(query.trim(), locale);
  return Object.freeze(entries.map(cleanEntry).filter((entry) => {
    if (from && entry.date < from) return false;
    if (to && entry.date > to) return false;
    if (!needle) return true;
    return fold([entry.title, entry.body, ...entry.tags].join('\n'), locale).includes(needle);
  }).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title)));
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  if (typeof value !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) throw new TypeError('Invalid encrypted backup data.');
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function assertCrypto(cryptoApi) {
  if (!cryptoApi?.subtle || !cryptoApi?.getRandomValues) throw new Error('Secure browser encryption is unavailable. Open this page over HTTPS or use an unencrypted backup.');
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 256) throw new RangeError('Use a backup password between 12 and 256 characters.');
}

async function deriveBackupKey(password, salt, cryptoApi) {
  const material = await cryptoApi.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
  return cryptoApi.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: JOURNAL_BACKUP_KDF_ITERATIONS, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export async function encryptJournalBackup(value, password, cryptoApi = globalThis.crypto) {
  validatePassword(password);
  assertCrypto(cryptoApi);
  const clean = restoreJournalLog(value);
  const plain = encoder.encode(JSON.stringify(clean));
  if (plain.byteLength > MAX_JOURNAL_BACKUP_BYTES) throw new RangeError('Journal backup is too large.');
  const salt = cryptoApi.getRandomValues(new Uint8Array(16));
  const iv = cryptoApi.getRandomValues(new Uint8Array(12));
  const key = await deriveBackupKey(password, salt, cryptoApi);
  const ciphertext = await cryptoApi.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(BACKUP_FORMAT), tagLength: 128 }, key, plain);
  return Object.freeze({ format: BACKUP_FORMAT, version: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-HMAC-SHA-256', iterations: JOURNAL_BACKUP_KDF_ITERATIONS, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)) });
}

export async function decryptJournalBackup(value, password, cryptoApi = globalThis.crypto) {
  validatePassword(password);
  assertCrypto(cryptoApi);
  if (!value || value.format !== BACKUP_FORMAT || value.version !== 1 || value.cipher !== 'AES-256-GCM' || value.kdf !== 'PBKDF2-HMAC-SHA-256' || value.iterations !== JOURNAL_BACKUP_KDF_ITERATIONS) throw new TypeError('This is not a supported encrypted journal backup.');
  const salt = base64ToBytes(value.salt);
  const iv = base64ToBytes(value.iv);
  const ciphertext = base64ToBytes(value.ciphertext);
  if (salt.length !== 16 || iv.length !== 12 || ciphertext.length < 16 || ciphertext.length > MAX_JOURNAL_BACKUP_BYTES + 16) throw new TypeError('Invalid encrypted backup data.');
  const key = await deriveBackupKey(password, salt, cryptoApi);
  const plaintext = await cryptoApi.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(BACKUP_FORMAT), tagLength: 128 }, key, ciphertext);
  if (plaintext.byteLength > MAX_JOURNAL_BACKUP_BYTES) throw new RangeError('Journal backup is too large.');
  return restoreJournalLog(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(plaintext)));
}
