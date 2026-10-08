const AREA_TO_M2 = Object.freeze({ m2: 1, ft2: 0.09290304 });
const DEPTH_TO_M = Object.freeze({ cm: 0.01, in: 0.0254, mm: 0.001 });
const BAG_TO_M3 = Object.freeze({ L: 0.001, ft3: 0.028316846592 });

function bounded(name, value, { minimum, maximum }) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  }
  return value;
}

function whole(value) {
  return Math.ceil(value - Math.max(1, Math.abs(value)) * 1e-12);
}

export function calculateMulch({
  shape = 'rectangle',
  length,
  width,
  diameter,
  bedCount = 1,
  areaUnit = 'm2',
  depth,
  depthUnit = 'cm',
  bagVolume,
  bagUnit = 'L',
  wastePercent = 0,
  pricePerBag = null,
  currency = 'USD',
} = {}) {
  const areaFactor = AREA_TO_M2[areaUnit];
  const depthFactor = DEPTH_TO_M[depthUnit];
  const bagFactor = BAG_TO_M3[bagUnit];
  if (!areaFactor || !depthFactor || !bagFactor) throw new RangeError('Choose supported measurement units.');
  bounded('Bed count', bedCount, { minimum: 1, maximum: 1000 });
  if (!Number.isInteger(bedCount)) throw new RangeError('Bed count must be a whole number.');
  bounded('Mulch depth', depth, { minimum: 0.1, maximum: 100 });
  bounded('Extra material', wastePercent, { minimum: 0, maximum: 50 });
  const price = pricePerBag === null ? null : bounded('Price per bag', pricePerBag, { minimum: 0, maximum: 1_000_000 });
  if (price !== null && !/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Currency must be a 3-letter code.');

  let areaEachM2;
  if (shape === 'rectangle') {
    areaEachM2 = bounded('Bed length', length, { minimum: 0.01, maximum: 100_000 })
      * bounded('Bed width', width, { minimum: 0.01, maximum: 100_000 }) * areaFactor;
  } else if (shape === 'circle') {
    const radiusM = bounded('Bed diameter', diameter, { minimum: 0.01, maximum: 100_000 }) * Math.sqrt(areaFactor) / 2;
    areaEachM2 = Math.PI * radiusM ** 2;
  } else {
    throw new RangeError('Choose a rectangular or circular bed.');
  }
  const areaM2 = areaEachM2 * bedCount;
  bounded('Total bed area', areaM2, { minimum: 0.0001, maximum: 10_000_000 });
  const depthM = depth * depthFactor;
  const volumeM3 = areaM2 * depthM;
  const orderVolumeM3 = volumeM3 * (1 + wastePercent / 100);
  const bagVolumeM3 = bounded('Bag volume', bagVolume, { minimum: 0.1, maximum: 1_000_000 }) * bagFactor;
  const bags = whole(orderVolumeM3 / bagVolumeM3);
  const estimatedCost = price === null ? null : bags * price;
  if (estimatedCost !== null && (!Number.isFinite(estimatedCost) || estimatedCost > Number.MAX_SAFE_INTEGER)) {
    throw new RangeError('The estimated total is too large to represent accurately.');
  }

  return Object.freeze({
    areaM2,
    depthM,
    volumeM3,
    orderVolumeM3,
    orderVolumeYd3: orderVolumeM3 / 0.764554857984,
    bagVolumeM3,
    bags,
    pricePerBag: price,
    currency: price === null ? null : currency,
    estimatedCost,
    wastePercent,
  });
}
