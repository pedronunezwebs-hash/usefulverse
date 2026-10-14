const lengthMeters = Object.freeze({ mm: 1e-3, cm: 1e-2, m: 1, in: 0.0254 });
const inductanceHenries = Object.freeze({ H: 1, mH: 1e-3, uH: 1e-6, nH: 1e-9 });

function positive(value, name, maximum = 1e12) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > maximum) {
    throw new RangeError(`Enter a positive ${name} within the supported range.`);
  }
  return number;
}

function turnsValue(value) {
  const turns = Number(value);
  if (!Number.isInteger(turns) || turns < 1 || turns > 100000) {
    throw new RangeError('Enter a whole number of turns from 1 to 100,000.');
  }
  return turns;
}

function toHenries(value, unit, name) {
  if (!(unit in inductanceHenries)) throw new RangeError(`Choose a supported ${name} unit.`);
  return positive(value, name, 1e12) * inductanceHenries[unit];
}

export function calculateInductor(input) {
  const mode = String(input.mode ?? 'airCore');
  if (!['airCore', 'toroid'].includes(mode)) throw new RangeError('Choose an air-core coil or toroidal core.');
  const turns = turnsValue(input.turns);
  let henriesPerTurnSquared;
  let method;
  let withinWheelerRange = true;

  if (mode === 'airCore') {
    const unit = String(input.dimensionUnit ?? 'mm');
    if (!(unit in lengthMeters)) throw new RangeError('Choose a supported dimension unit.');
    const diameterM = positive(input.coilDiameter, 'coil diameter', 1000) * lengthMeters[unit];
    const lengthM = positive(input.coilLength, 'winding length', 1000) * lengthMeters[unit];
    const radiusInches = diameterM / 2 / 0.0254;
    const lengthInches = lengthM / 0.0254;
    const microhenriesPerTurnSquared = (radiusInches ** 2) / (9 * radiusInches + 10 * lengthInches);
    henriesPerTurnSquared = microhenriesPerTurnSquared * 1e-6;
    withinWheelerRange = diameterM / lengthM < 3;
    method = 'wheeler-single-layer-air-core';
  } else {
    const al = positive(input.alValue, 'AL value', 1e15);
    henriesPerTurnSquared = al * 1e-9;
    method = 'manufacturer-core-al';
  }

  const inductanceH = henriesPerTurnSquared * turns ** 2;
  if (!Number.isFinite(inductanceH) || inductanceH <= 0) throw new RangeError('These values exceed the supported numeric range.');
  const targetRaw = String(input.targetInductance ?? '').trim();
  let targetTurns = null;
  let targetH = null;
  if (targetRaw) {
    targetH = toHenries(targetRaw, String(input.targetUnit ?? 'uH'), 'target inductance');
    const needed = Math.sqrt(targetH / henriesPerTurnSquared);
    if (!Number.isFinite(needed) || needed > 100000) throw new RangeError('The target requires more than 100,000 turns.');
    targetTurns = Math.max(1, Math.ceil(needed));
  }
  return { mode, method, turns, inductanceH, henriesPerTurnSquared, targetH, targetTurns, withinWheelerRange };
}
