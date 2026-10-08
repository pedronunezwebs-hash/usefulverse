import assert from 'node:assert/strict';
import test from 'node:test';
import { webcrypto } from 'node:crypto';
import { createJournalEntry, decryptJournalBackup, encryptJournalBackup, MAX_JOURNAL_BACKUP_BYTES, removeJournalEntry, restoreJournalLog, searchJournalEntries, serializeJournalBackup, upsertJournalEntry } from './logic.mjs';

const entry = (id, date, title, body, tags = []) => createJournalEntry({ id, date, title, body, tags });

test('entries require supported dates and bounded, nonempty text', () => {
  assert.throws(() => entry('a', '2026-02-29', 'Title', 'Body'));
  assert.throws(() => entry('a', '1899-12-31', 'Title', 'Body'));
  assert.throws(() => entry('a', '2026-10-08', '', 'Body'));
  assert.throws(() => entry('a', '2026-10-08', 'Title', '  '));
  assert.throws(() => entry('a', '2026-10-08', 'x'.repeat(161), 'Body'));
  assert.throws(() => entry('a', '2026-10-08', 'Title', 'x'.repeat(8001)));
  assert.throws(() => entry('a', '2026-10-08', 'Title', 'Body', Array.from({ length: 13 }, (_, index) => `tag${index}`)));
});

test('upsert edits by stable ID, permits multiple entries per date and sorts newest first', () => {
  let entries = upsertJournalEntry([], entry('one', '2026-10-08', 'First', 'Text'));
  entries = upsertJournalEntry(entries, entry('two', '2026-10-08', 'Second', 'Other text'));
  entries = upsertJournalEntry(entries, entry('one', '2026-10-07', 'Edited', 'Updated text'));
  assert.equal(entries.length, 2);
  assert.deepEqual(entries.map(({ title }) => title), ['Second', 'Edited']);
  assert.deepEqual(removeJournalEntry(entries, 'two').map(({ id }) => id), ['one']);
});

test('search covers title, body, and tags with Unicode normalization and date bounds', () => {
  const entries = [entry('1', '2026-10-08', 'Café plans', 'Call Ana', ['work']), entry('2', '2026-10-06', 'Weekend', 'Walk by the sea', ['rest'])];
  assert.deepEqual(searchJournalEntries(entries, { query: 'cafe\u0301' }).map(({ id }) => id), ['1']);
  assert.deepEqual(searchJournalEntries(entries, { query: 'sea', dateFrom: '2026-10-06', dateTo: '2026-10-07' }).map(({ id }) => id), ['2']);
  assert.throws(() => searchJournalEntries(entries, { dateFrom: '2026-10-08', dateTo: '2026-10-07' }));
});

test('JSON backup validation rejects unsupported schema and duplicate IDs', () => {
  const entries = [entry('one', '2026-10-08', 'A day', 'A note', ['home'])];
  assert.deepEqual(restoreJournalLog({ schemaVersion: 1, entries }), { schemaVersion: 1, entries });
  assert.throws(() => restoreJournalLog({ schemaVersion: 2, entries }));
  assert.throws(() => restoreJournalLog({ schemaVersion: 1, entries: [...entries, ...entries] }), /duplicate/u);
});

test('plain backup serialization enforces the same 10 MB ceiling that import accepts', () => {
  const valid = { schemaVersion: 1, entries: [entry('one', '2026-10-08', 'Entry', 'Text')] };
  assert.deepEqual(JSON.parse(serializeJournalBackup(valid)), restoreJournalLog(valid));
  const large = { schemaVersion: 1, entries: Array.from({ length: 1_000 }, (_, index) => entry(`e${index}`, '2026-10-08', `Entry ${index}`, '\u0001'.repeat(2_000))) };
  assert.ok(new TextEncoder().encode(JSON.stringify(large)).byteLength > MAX_JOURNAL_BACKUP_BYTES);
  assert.throws(() => serializeJournalBackup(large), /too large/u);
});

test('encrypted backups round-trip with AES-GCM and reject wrong passwords or tampering', async () => {
  const expected = restoreJournalLog({ schemaVersion: 1, entries: [entry('one', '2026-10-08', 'Private thought', 'Sensitive note', ['personal'])] });
  const encrypted = await encryptJournalBackup(expected, 'a long passphrase 123', webcrypto);
  assert.equal(encrypted.cipher, 'AES-256-GCM');
  assert.deepEqual(await decryptJournalBackup(encrypted, 'a long passphrase 123', webcrypto), expected);
  await assert.rejects(decryptJournalBackup(encrypted, 'a different password', webcrypto));
  await assert.rejects(decryptJournalBackup({ ...encrypted, iterations: 1 }, 'a long passphrase 123', webcrypto));
  const tamperedCiphertext = `${encrypted.ciphertext[0] === 'A' ? 'B' : 'A'}${encrypted.ciphertext.slice(1)}`;
  await assert.rejects(decryptJournalBackup({ ...encrypted, ciphertext: tamperedCiphertext }, 'a long passphrase 123', webcrypto));
  await assert.rejects(encryptJournalBackup(expected, 'short', webcrypto), /12 and 256/u);
});
