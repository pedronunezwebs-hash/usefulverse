const LENGTH_TO_M = Object.freeze({ mm: 1e-3, cm: 1e-2, m: 1, in: 0.0254, ft: 0.3048 });
const FORCE_TO_N = Object.freeze({ N: 1, kN: 1e3, lbf: 4.4482216152605 });
const MODULUS_TO_PA = Object.freeze({ Pa: 1, MPa: 1e6, GPa: 1e9, psi: 6894.757293168, ksi: 6894757.293168 });
const INERTIA_TO_M4 = Object.freeze({ 'mm⁴': 1e-12, 'cm⁴': 1e-8, 'm⁴': 1, 'in⁴': 0.0254 ** 4, 'ft⁴': 0.3048 ** 4 });
const CASES = new Set(['simple-point', 'simple-uniform', 'cantilever-point', 'cantilever-uniform']);

function finitePositive(value, name, { zero = false, max = 1e100 } = {}) {
  if (value === '' || value === null || value === undefined) throw new RangeError(`${name} is required.`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < (zero ? 0 : Number.MIN_VALUE) || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

export function calculateBeamDeflection({ support = 'simply-supported', loadCase = 'point', span, spanUnit = 'm', load, forceUnit = 'N', modulus, modulusUnit = 'GPa', inertia, inertiaUnit = 'm⁴' } = {}) {
  const key = `${support === 'cantilever' ? 'cantilever' : support === 'simply-supported' ? 'simple' : 'invalid'}-${loadCase === 'uniform' ? 'uniform' : loadCase === 'point' ? 'point' : 'invalid'}`;
  if (!CASES.has(key)) throw new TypeError('Choose a supported beam and load case.');
  if (!(spanUnit in LENGTH_TO_M) || !(forceUnit in FORCE_TO_N) || !(modulusUnit in MODULUS_TO_PA) || !(inertiaUnit in INERTIA_TO_M4)) throw new TypeError('Choose supported units.');

  const lengthM = finitePositive(span, 'Span', { max: 1e6 }) * LENGTH_TO_M[spanUnit];
  const loadValue = finitePositive(load, 'Load', { zero: true, max: 1e12 });
  const forceN = loadValue * FORCE_TO_N[forceUnit];
  const intensityNm = forceN / LENGTH_TO_M[spanUnit];
  const modulusPa = finitePositive(modulus, 'Elastic modulus', { max: 1e14 }) * MODULUS_TO_PA[modulusUnit];
  const inertiaM4 = finitePositive(inertia, 'Second moment of area', { max: 1e6 }) * INERTIA_TO_M4[inertiaUnit];
  const flexuralRigidity = modulusPa * inertiaM4;
  if (![lengthM, forceN, intensityNm, modulusPa, inertiaM4, flexuralRigidity].every(Number.isFinite) || lengthM <= 0 || flexuralRigidity <= 0) throw new RangeError('Inputs exceed the supported calculation range.');

  const cantilever = key.startsWith('cantilever');
  const uniform = key.endsWith('uniform');
  const equivalentLoad = uniform ? intensityNm : forceN;
  const maxDeflectionM = uniform
    ? (cantilever ? intensityNm * lengthM ** 4 / (8 * flexuralRigidity) : 5 * intensityNm * lengthM ** 4 / (384 * flexuralRigidity))
    : (cantilever ? forceN * lengthM ** 3 / (3 * flexuralRigidity) : forceN * lengthM ** 3 / (48 * flexuralRigidity));
  const maxMomentNm = uniform
    ? (cantilever ? intensityNm * lengthM ** 2 / 2 : intensityNm * lengthM ** 2 / 8)
    : (cantilever ? forceN * lengthM : forceN * lengthM / 4);
  if (![maxDeflectionM, maxMomentNm].every(Number.isFinite)) throw new RangeError('Result exceeds the supported calculation range.');

  const profile = Array.from({ length: 33 }, (_, index) => {
    const x = lengthM * index / 32;
    let deflectionM;
    if (cantilever && uniform) deflectionM = intensityNm * x ** 2 * (6 * lengthM ** 2 - 4 * lengthM * x + x ** 2) / (24 * flexuralRigidity);
    else if (cantilever) deflectionM = forceN * x ** 2 * (3 * lengthM - x) / (6 * flexuralRigidity);
    else if (uniform) deflectionM = intensityNm * x * (lengthM ** 3 - 2 * lengthM * x ** 2 + x ** 3) / (24 * flexuralRigidity);
    else {
      const a = Math.min(x, lengthM - x);
      deflectionM = forceN * a * (3 * lengthM ** 2 - 4 * a ** 2) / (48 * flexuralRigidity);
    }
    return Object.freeze({ x: x / LENGTH_TO_M[spanUnit], deflection: deflectionM / LENGTH_TO_M[spanUnit] });
  });
  const deflectionUnit = spanUnit;
  return Object.freeze({ support, loadCase, span: lengthM / LENGTH_TO_M[spanUnit], spanUnit, force: forceN / FORCE_TO_N[forceUnit], forceUnit, intensity: intensityNm * LENGTH_TO_M[spanUnit] / FORCE_TO_N[forceUnit], modulus: modulusPa / MODULUS_TO_PA[modulusUnit], modulusUnit, inertia: inertiaM4 / INERTIA_TO_M4[inertiaUnit], inertiaUnit, flexuralRigidity, deflectionUnit, maxDeflection: maxDeflectionM / LENGTH_TO_M[spanUnit], maxMomentNm, maxLocation: cantilever ? lengthM / LENGTH_TO_M[spanUnit] : lengthM / (2 * LENGTH_TO_M[spanUnit]), profile });
}
