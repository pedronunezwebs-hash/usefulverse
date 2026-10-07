// Standard atomic weights for common formula elements. Values follow abridged
// conventional weights; elements outside this explicit set are rejected.
export const ATOMIC_MASSES = Object.freeze({
  H: 1.008, He: 4.002602, Li: 6.94, Be: 9.0121831, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998403163, Ne: 20.1797, Na: 22.98976928, Mg: 24.305, Al: 26.9815385, Si: 28.085, P: 30.973761998,
  S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.0983, Ca: 40.078, Cr: 51.9961, Mn: 54.938044, Fe: 55.845,
  Co: 58.933194, Ni: 58.6934, Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.8682, I: 126.90447,
  Ba: 137.327, Pt: 195.084, Au: 196.966569, Hg: 200.592, Pb: 207.2,
});

const ISOTOPE_MASSES = Object.freeze({ '1H': 1.007825, '2H': 2.014102, '13C': 13.003355, '14C': 14.003242, '15N': 15.000109, '18O': 17.99916 });

function parseInteger(source, position) {
  const match = source.slice(position).match(/^\d+/u);
  if (!match) return { value: 1, end: position };
  const value = Number(match[0]);
  if (!Number.isSafeInteger(value) || value < 1 || value > 1_000_000) throw new RangeError('Formula counts must be whole numbers from 1 to 1,000,000.');
  return { value, end: position + match[0].length };
}

export function parseChemicalFormula(formula) {
  if (typeof formula !== 'string' || !formula.trim() || formula.length > 160) throw new TypeError('Enter a formula with 1 to 160 characters.');
  const source = formula.replaceAll(' ', '');
  const counts = Object.create(null);
  let index = 0;

  function parseGroup(closing = '') {
    const group = Object.create(null);
    let terms = 0;
    while (index < source.length && source[index] !== closing && source[index] !== '.' && source[index] !== '·') {
      if (source[index] === '(' || source[index] === '[') {
        const open = source[index++];
        const close = open === '(' ? ')' : ']';
        const nested = parseGroup(close);
        if (source[index] !== close) throw new SyntaxError(`Missing ${close} in formula.`);
        index += 1;
        const multiplier = parseInteger(source, index);
        index = multiplier.end;
        for (const [key, amount] of Object.entries(nested)) group[key] = (group[key] ?? 0) + amount * multiplier.value;
        terms += 1;
        continue;
      }

      if (source[index] === ')' || source[index] === ']') throw new SyntaxError(`Unexpected ${source[index]} in formula.`);
      let element;
  let mass;
      if (source[index] === '{') {
        const isotope = source.slice(index).match(/^\{(\d+)([A-Z][a-z]?)\}/u);
        if (!isotope) throw new SyntaxError('Use isotope notation such as {13C}.');
        [, mass, element] = isotope;
        index += isotope[0].length;
        const isotopeKey = `${mass}${element}`;
        if (!(isotopeKey in ISOTOPE_MASSES)) throw new RangeError(`Isotope ${isotopeKey} is not in the supported list.`);
        element = isotopeKey;
      } else {
        const atom = source.slice(index).match(/^[A-Z][a-z]?/u);
        if (!atom) throw new SyntaxError(`Unexpected character at position ${index + 1}.`);
        element = atom[0];
        index += element.length;
        if (!(element in ATOMIC_MASSES)) throw new RangeError(`Element ${element} is not in the supported list.`);
      }
      const multiplier = parseInteger(source, index);
      index = multiplier.end;
      group[element] = (group[element] ?? 0) + multiplier.value;
      terms += 1;
    }
    if (terms === 0) throw new SyntaxError('A group cannot be empty.');
    return group;
  }

  let componentIndex = 0;
  while (index < source.length) {
    const leading = parseInteger(source, index);
    index = leading.end;
    if (componentIndex === 0 && leading.value !== 1) throw new SyntaxError('Leading coefficients are not supported; enter the formula for one molecule.');
    const component = parseGroup();
    for (const [element, amount] of Object.entries(component)) counts[element] = (counts[element] ?? 0) + amount * leading.value;
    if (index < source.length && (source[index] === '.' || source[index] === '·')) index += 1;
    componentIndex += 1;
  }
  if (Object.keys(counts).length === 0) throw new SyntaxError('Enter a chemical formula.');
  return { ...counts };
}

export function calculateMolarMass(formula) {
  const counts = parseChemicalFormula(formula);
  const mass = Object.entries(counts).reduce((sum, [element, amount]) => sum + (ISOTOPE_MASSES[element] ?? ATOMIC_MASSES[element]) * amount, 0);
  return { formula: formula.trim(), counts, molarMass: mass, unit: 'g/mol' };
}
