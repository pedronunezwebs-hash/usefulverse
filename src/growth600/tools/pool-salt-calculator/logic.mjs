export const POOL_SALT_VOLUME_TO_L = Object.freeze({ l: 1, 'us-gal': 3.785411784, 'imp-gal': 4.54609 });
export const POOL_SALT_WEIGHT_TO_KG = Object.freeze({ kg: 1, lb: 0.45359237 });

function bounded(name, value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  return value;
}

export function calculatePoolSalt({
  volume,
  volumeUnit = 'us-gal',
  currentSalinityPpm,
  targetSalinityPpm,
  saltPurityPercent = 100,
  bagSize = null,
  bagUnit = 'lb',
} = {}) {
  const volumeFactor = POOL_SALT_VOLUME_TO_L[volumeUnit];
  const bagFactor = POOL_SALT_WEIGHT_TO_KG[bagUnit];
  if (!volumeFactor || !bagFactor) throw new RangeError('Choose supported volume and bag units.');
  const poolVolumeL = bounded('Pool volume', volume, Number.EPSILON, 100_000_000) * volumeFactor;
  const currentPpm = bounded('Current salinity', currentSalinityPpm, 0, 10_000);
  const targetPpm = bounded('Target salinity', targetSalinityPpm, 0, 10_000);
  const purity = bounded('Salt purity', saltPurityPercent, 1, 100) / 100;
  const increasePpm = Math.max(0, targetPpm - currentPpm);
  const pureSaltKg = poolVolumeL * increasePpm / 1_000_000;
  const saltToAddKg = pureSaltKg / purity;
  const bagSizeKg = bagSize === null || bagSize === undefined || bagSize === ''
    ? null
    : bounded('Bag size', bagSize, Number.EPSILON, 10_000) * bagFactor;
  const bagsToBuy = bagSizeKg === null ? null : Math.ceil(saltToAddKg / bagSizeKg);

  return Object.freeze({
    poolVolumeL,
    currentSalinityPpm: currentPpm,
    targetSalinityPpm: targetPpm,
    increasePpm,
    pureSaltKg,
    saltToAddKg,
    saltToAddLb: saltToAddKg / POOL_SALT_WEIGHT_TO_KG.lb,
    saltPurityPercent,
    bagsToBuy,
    noSaltNeeded: increasePpm === 0,
  });
}
