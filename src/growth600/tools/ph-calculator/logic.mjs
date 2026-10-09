const KW_25C = 1e-14;
const PH_LIMITS = Object.freeze({ minConcentration: 1e-14, maxConcentration: 10, minConstant: 1e-14, maxConstant: 1 });

function bounded(value, name, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function solveWeakIon(concentration, constant, base) {
  const lowStart = Math.sqrt(KW_25C);
  const highStart = (concentration + Math.sqrt(concentration ** 2 + 4 * KW_25C)) / 2;
  const residual = (ion) => {
    const conjugate = ion - KW_25C / ion;
    return ion * conjugate - constant * (concentration - conjugate);
  };
  let low = lowStart;
  let high = highStart;
  for (let iteration = 0; iteration < 96; iteration += 1) {
    const middle = (low + high) / 2;
    if (residual(middle) > 0) high = middle;
    else low = middle;
  }
  const ion = (low + high) / 2;
  const conjugate = Math.max(0, ion - KW_25C / ion);
  return { ion, conjugate, pH: base ? 14 + Math.log10(ion) : -Math.log10(ion) };
}

export function calculatePh({ mode, concentration, equilibriumConstant } = {}) {
  if (!['strong-acid', 'strong-base', 'weak-acid', 'weak-base'].includes(mode)) throw new TypeError('Choose a supported acid/base model.');
  const c = bounded(concentration, 'Concentration', PH_LIMITS.minConcentration, PH_LIMITS.maxConcentration);
  let hydrogen;
  let hydroxide;
  let percentIonized;
  let method;
  if (mode === 'strong-acid') {
    hydrogen = c;
    hydroxide = KW_25C / hydrogen;
    method = 'strong-acid';
  } else if (mode === 'strong-base') {
    hydroxide = c;
    hydrogen = KW_25C / hydroxide;
    method = 'strong-base';
  } else {
    const k = bounded(equilibriumConstant, mode === 'weak-acid' ? 'Ka' : 'Kb', PH_LIMITS.minConstant, PH_LIMITS.maxConstant);
    const solved = solveWeakIon(c, k, mode === 'weak-base');
    if (mode === 'weak-acid') {
      hydrogen = solved.ion;
      hydroxide = KW_25C / hydrogen;
      percentIonized = (solved.conjugate / c) * 100;
    } else {
      hydroxide = solved.ion;
      hydrogen = KW_25C / hydroxide;
      percentIonized = (solved.conjugate / c) * 100;
    }
    method = mode;
  }
  const pH = -Math.log10(hydrogen);
  const pOH = -Math.log10(hydroxide);
  if (![hydrogen, hydroxide, pH, pOH, percentIonized ?? 0].every(Number.isFinite)) throw new RangeError('The result is outside the supported numeric range.');
  const classification = pH < 7 ? 'acidic' : pH > 7 ? 'basic' : 'neutral';
  return Object.freeze({ mode, concentration: c, hydrogen, hydroxide, pH, pOH, percentIonized, classification, method, temperatureC: 25 });
}

export const phModelLimits = PH_LIMITS;
