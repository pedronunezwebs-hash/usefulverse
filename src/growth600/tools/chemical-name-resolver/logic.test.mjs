import test from 'node:test';
import assert from 'node:assert/strict';
import { createPubChemNameUrl, parsePubChemNameResults } from './logic.mjs';

test('builds a fixed-host PubChem property request and safely encodes the name', () => {
  const url = createPubChemNameUrl('aspirin / acetylsalicylic acid');
  assert.match(url, /^https:\/\/pubchem\.ncbi\.nlm\.nih\.gov\/rest\/pug\/compound\/name\//u);
  assert.ok(url.includes('aspirin%20%2F%20acetylsalicylic%20acid'));
  assert.ok(url.endsWith('/JSON'));
});

test('rejects empty, control-character and overlong queries', () => {
  for (const value of ['', '   ', 'water\nethanol', 'x'.repeat(121)]) {
    assert.throws(() => createPubChemNameUrl(value), { code: 'invalid-query' });
  }
});

test('parses only bounded PubChem identifiers and properties', () => {
  const rows = parsePubChemNameResults({ PropertyTable: { Properties: [
    { CID: 2244, Title: 'Aspirin', IUPACName: '2-acetoxybenzoic acid', MolecularFormula: 'C9H8O4', MolecularWeight: 180.16, InChIKey: 'BSYNRYMUTXBXSQ-UHFFFAOYSA-N', CanonicalSMILES: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
    { CID: 'invalid', Title: 'not a record' },
  ] } });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].cid, 2244);
  assert.equal(rows[0].molecularWeight, 180.16);
  assert.equal(rows[0].canonicalSmiles, 'CC(=O)OC1=CC=CC=C1C(=O)O');
  assert.ok(Object.isFrozen(rows) && Object.isFrozen(rows[0]));
});

test('rejects malformed result envelopes and bounds record count', () => {
  assert.throws(() => parsePubChemNameResults({}), { code: 'invalid-response' });
  const rows = Array.from({ length: 12 }, (_, index) => ({ CID: index + 1 }));
  assert.equal(parsePubChemNameResults({ PropertyTable: { Properties: rows } }).length, 8);
});
