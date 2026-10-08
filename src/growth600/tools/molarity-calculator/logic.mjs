function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

const VOLUME_TO_LITERS = Object.freeze({ L: 1, mL: 0.001 });

export function calculateMolarity({ mode = 'concentration', moles, molarity, volume, volumeUnit = 'L', molarMass } = {}) {
  if (!(volumeUnit in VOLUME_TO_LITERS)) throw new TypeError('Choose liters or milliliters.');
  if (!['concentration', 'moles', 'volume', 'solute-mass', 'prepare-solution'].includes(mode)) throw new TypeError('Choose a supported calculation.');
  const volumeLiters = Number.isFinite(volume) ? volume * VOLUME_TO_LITERS[volumeUnit] : undefined;
  let value;
  let resultUnit;
  let resultKey;

  if (mode === 'concentration') {
    const amount = bounded('Moles', moles, 0, 1_000_000_000);
    const solutionVolume = bounded('Solution volume', volumeLiters, Number.MIN_VALUE, 1_000_000_000);
    value = amount / solutionVolume;
    resultUnit = 'mol/L'; resultKey = 'concentrationResult';
  } else if (mode === 'moles') {
    const concentration = bounded('Molarity', molarity, 0, 1_000_000_000);
    const solutionVolume = bounded('Solution volume', volumeLiters, 0, 1_000_000_000);
    value = concentration * solutionVolume;
    resultUnit = 'mol'; resultKey = 'molesResult';
  } else if (mode === 'volume') {
    const amount = bounded('Moles', moles, 0, 1_000_000_000);
    const concentration = bounded('Molarity', molarity, Number.MIN_VALUE, 1_000_000_000);
    value = amount / concentration;
    resultUnit = 'L'; resultKey = 'volumeResult';
  } else {
    const concentration = bounded('Molarity', molarity, 0, 1_000_000_000);
    const solutionVolume = bounded('Solution volume', volumeLiters, 0, 1_000_000_000);
    const massPerMole = bounded('Molar mass', molarMass, Number.MIN_VALUE, 1_000_000_000);
    const amount = concentration * solutionVolume;
    value = amount * massPerMole;
    resultUnit = 'g'; resultKey = mode === 'prepare-solution' ? 'soluteForSolutionResult' : 'soluteMassResult';
  }

  if (!Number.isFinite(value)) throw new RangeError('The calculated result is outside the supported range.');
  return Object.freeze({ mode, value, unit: resultUnit, resultKey, volumeLiters: Number.isFinite(volumeLiters) ? volumeLiters : undefined });
}
