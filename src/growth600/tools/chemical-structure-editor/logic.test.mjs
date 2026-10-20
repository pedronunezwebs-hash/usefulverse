import test from 'node:test';
import assert from 'node:assert/strict';
import OCL from '../../../../public/growth600-vendor/openchemlib-9.25.1/openchemlib.mjs';
import { assertChemicalStructure, createChemicalMolecule, parseChemicalStructure, summarizeChemicalStructure } from './logic.mjs';

OCL.Resources.registerFromNodejs();

test('creates a valid editable carbon scaffold and exports structure formats', () => {
  const molecule = createChemicalMolecule(OCL);
  molecule.addAtom(8); molecule.addBond(0, 1); molecule.validate();
  const result = summarizeChemicalStructure(molecule);
  assert.equal(result.formula, 'CH4O');
  assert.equal(result.smiles, 'CO');
  assert.match(result.molfile, /V2000/u);
});

test('imports and validates SMILES and Molfile structures with correct formulae', () => {
  for (const [format, source, expected] of [
    ['smiles', 'CCO', 'C2H6O'],
    ['smiles', 'c1ccccc1', 'C6H6'],
  ]) assert.equal(summarizeChemicalStructure(parseChemicalStructure(OCL, source, format)).formula, expected);
  const mol = parseChemicalStructure(OCL, 'CCO').toMolfile();
  assert.equal(summarizeChemicalStructure(parseChemicalStructure(OCL, mol, 'molfile')).formula, 'C2H6O');
});

test('rejects malformed, over-valent and oversized structures', () => {
  assert.throws(() => parseChemicalStructure(OCL, 'C(=O)(=O)(=O)O'), /valence/u);
  assert.throws(() => parseChemicalStructure(OCL, 'C'.repeat(121)), /atoms/u);
  assert.throws(() => parseChemicalStructure(OCL, 'not a molecule'), /./u);
  assert.throws(() => assertChemicalStructure({ getAllAtoms: () => 121, getAllBonds: () => 0 }), /atoms/u);
});
