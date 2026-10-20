export const CHEMICAL_EDITOR_LIMITS = Object.freeze({ atoms: 120, bonds: 200, sourceCharacters: 12000 });

export function createChemicalMolecule(OCL) {
  const molecule = new OCL.Molecule(CHEMICAL_EDITOR_LIMITS.atoms, CHEMICAL_EDITOR_LIMITS.bonds);
  molecule.addAtom(6);
  molecule.validate();
  return molecule;
}

export function parseChemicalStructure(OCL, source, format = 'smiles') {
  const raw = String(source ?? '').replace(/^\uFEFF/u, '');
  const text = format === 'molfile' ? raw.trimEnd() : raw.trim();
  if (!text || text.length > CHEMICAL_EDITOR_LIMITS.sourceCharacters) throw new RangeError('Enter a structure within the supported input limit.');
  let molecule;
  if (format === 'smiles') molecule = OCL.Molecule.fromSmiles(text);
  else if (format === 'molfile') molecule = OCL.Molecule.fromMolfile(text);
  else throw new RangeError('Choose SMILES or Molfile input.');
  assertChemicalStructure(molecule);
  molecule.validate();
  molecule.inventCoordinates();
  return molecule;
}

export function assertChemicalStructure(molecule) {
  const atoms = molecule?.getAllAtoms?.();
  const bonds = molecule?.getAllBonds?.();
  if (!Number.isInteger(atoms) || atoms < 1 || atoms > CHEMICAL_EDITOR_LIMITS.atoms) throw new RangeError('A structure must contain 1 to 120 atoms.');
  if (!Number.isInteger(bonds) || bonds > CHEMICAL_EDITOR_LIMITS.bonds) throw new RangeError('A structure may contain at most 200 bonds.');
  return { atoms, bonds };
}

export function summarizeChemicalStructure(molecule) {
  assertChemicalStructure(molecule);
  molecule.validate();
  return Object.freeze({
    smiles: molecule.toIsomericSmiles(),
    molfile: molecule.toMolfile(),
    formula: molecule.getMolecularFormula().formula,
    atoms: molecule.getAllAtoms(),
    bonds: molecule.getAllBonds(),
  });
}
