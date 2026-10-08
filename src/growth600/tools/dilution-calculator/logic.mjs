function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateDilution({ mode = 'direct', stockConcentration, targetConcentration, finalVolume, volumeUnit = 'mL', steps = 1 } = {}) {
  if (!['direct', 'serial'].includes(mode)) throw new TypeError('Choose direct or serial dilution.');
  if (!['L', 'mL'].includes(volumeUnit)) throw new TypeError('Choose liters or milliliters.');
  const stock = bounded('Stock concentration', stockConcentration, Number.MIN_VALUE, 1_000_000_000);
  const target = bounded('Target concentration', targetConcentration, Number.MIN_VALUE, 1_000_000_000);
  const volume = bounded('Final volume', finalVolume, Number.MIN_VALUE, 1_000_000_000);
  if (target > stock) throw new RangeError('Target concentration cannot exceed stock concentration for a dilution.');

  if (mode === 'direct') {
    const stockVolume = target * volume / stock;
    return Object.freeze({ mode, stockConcentration: stock, targetConcentration: target, finalVolume: volume, stockVolume, diluentVolume: volume - stockVolume, dilutionFactor: stock / target, volumeUnit });
  }

  const count = bounded('Serial steps', steps, 1, 20);
  if (!Number.isInteger(count)) throw new RangeError('Serial step count must be a whole number from 1 to 20.');
  const perStepFactor = (stock / target) ** (1 / count);
  const transferVolume = volume / perStepFactor;
  const diluentVolume = volume - transferVolume;
  return Object.freeze({ mode, stockConcentration: stock, targetConcentration: target, finalVolume: volume, steps: count, totalDilutionFactor: stock / target, perStepFactor, transferVolume, diluentVolume, volumeUnit });
}
