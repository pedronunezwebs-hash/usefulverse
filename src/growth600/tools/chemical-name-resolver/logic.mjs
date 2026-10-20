export const PUBCHEM_PROPERTY_URL = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name';

export function createPubChemNameUrl(value) {
  const query = String(value ?? '').trim();
  if (!query || query.length > 120 || /[\u0000-\u001f\u007f]/u.test(query)) {
    const error = new RangeError('Enter a chemical name up to 120 characters.');
    error.code = 'invalid-query';
    throw error;
  }
  const encoded = encodeURIComponent(query);
  return `${PUBCHEM_PROPERTY_URL}/${encoded}/property/Title,IUPACName,MolecularFormula,MolecularWeight,InChIKey,CanonicalSMILES/JSON`;
}

export function parsePubChemNameResults(payload) {
  const rows = payload?.PropertyTable?.Properties;
  if (!Array.isArray(rows)) {
    const error = new TypeError('The chemical database returned an unsupported response.');
    error.code = 'invalid-response';
    throw error;
  }
  return Object.freeze(rows.slice(0, 8).flatMap((row) => {
    const cid = Number(row?.CID);
    if (!Number.isSafeInteger(cid) || cid < 1) return [];
    return [Object.freeze({
      cid,
      title: bounded(row.Title, 200),
      iupacName: bounded(row.IUPACName, 500),
      molecularFormula: bounded(row.MolecularFormula, 120),
      molecularWeight: finiteWeight(row.MolecularWeight),
      inchiKey: bounded(row.InChIKey, 100),
      canonicalSmiles: bounded(row.CanonicalSMILES, 1000),
    })];
  }));
}

function bounded(value, max) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function finiteWeight(value) {
  const weight = Number(value);
  return Number.isFinite(weight) && weight > 0 && weight < 1_000_000 ? weight : null;
}
