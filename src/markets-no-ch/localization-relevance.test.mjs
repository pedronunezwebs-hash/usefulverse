import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { marketTools } from './catalog.mjs';

const reportUrl = new URL('../../docs/markets-no-ch/LOCALIZATION-RELEVANCE-AUDIT-2026-10-16.md', import.meta.url);

test('every catalog tool has one scope classification and audience note in the semantic audit', async () => {
  const report = await readFile(reportUrl, 'utf8');
  const rows = report.split('\n').flatMap((line) => {
    const match = line.match(/^\| ([a-z0-9-]+) \| ([^|]+) \| (universal|regional|jurisdictional|mixed) \| ([^|]+) \|$/u);
    return match ? [{ id: match[1], label: match[2].trim(), scope: match[3], note: match[4].trim() }] : [];
  });
  const ids = rows.map(({ id }) => id);
  assert.equal(ids.length, marketTools.length, 'audit row count must equal catalog tool count');
  assert.equal(new Set(ids).size, ids.length, 'each tool must be audited exactly once');
  assert.deepEqual([...ids].sort(), marketTools.map(({ id }) => id).sort(), 'audit must include exactly the current catalog tools');
  const notes = rows.map(({ note }) => note);
  assert.equal(new Set(notes).size, notes.length, 'each tool needs a tool-specific audience/use-case analysis, not a repeated template');

  const counts = Object.fromEntries(['universal', 'regional', 'jurisdictional', 'mixed'].map((scope) => [scope, rows.filter((row) => row.scope === scope).length]));
  assert.deepEqual(counts, { universal: 30, regional: 11, jurisdictional: 6, mixed: 4 }, 'changing scope counts requires a deliberate audit update');
  for (const row of rows) assert.ok(row.note.length > 40, `${row.id} needs a meaningful audience/scope note`);
  for (const row of rows.filter(({ scope }) => scope === 'jurisdictional')) {
    assert.match(row.note, /norueg|suiz|cant[oó]n|UID|QR-bill/iu, `${row.id} must name the governing jurisdiction or local identifier`);
  }
  for (const row of rows.filter(({ scope }) => scope === 'regional')) {
    assert.match(row.note, /variante|modalidad|noruega|noruego|suizo|suiza|b[aá]var|austr[ií]ac|Krig|Yatzy|Rufspiel|Vri åtter|subasta|partida|juego|baza|descarte/iu, `${row.id} must explain the named game variant or its local rules`);
  }
});
