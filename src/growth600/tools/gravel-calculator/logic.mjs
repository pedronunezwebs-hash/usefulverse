const finitePositive = (value, label) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new RangeError(`${label} must be greater than zero.`);
  return number;
};

export function calculateGravel({ areaM2, depthM, densityKgM3, wastePercent = 0, bagKg = 0 }) {
  const area = finitePositive(areaM2, 'Area');
  const depth = finitePositive(depthM, 'Depth');
  const waste = Number(wastePercent);
  if (!Number.isFinite(waste) || waste < 0 || waste > 100) throw new RangeError('Waste must be between 0 and 100 percent.');

  const volumeM3 = area * depth;
  const orderVolumeM3 = volumeM3 * (1 + waste / 100);
  const density = densityKgM3 === '' || densityKgM3 == null ? null : finitePositive(densityKgM3, 'Density');
  const bagSize = bagKg === '' || bagKg == null || Number(bagKg) === 0 ? null : finitePositive(bagKg, 'Bag size');
  const weightKg = density == null ? null : orderVolumeM3 * density;
  return {
    volumeM3,
    orderVolumeM3,
    weightKg,
    bags: weightKg == null || bagSize == null ? null : Math.ceil(weightKg / bagSize),
  };
}

export function calculateRectangularArea(lengthM, widthM) {
  return finitePositive(lengthM, 'Length') * finitePositive(widthM, 'Width');
}

export function calculateCircularArea(diameterM) {
  const radius = finitePositive(diameterM, 'Diameter') / 2;
  return Math.PI * radius ** 2;
}

export function calculateTriangularArea(baseM, heightM) {
  return finitePositive(baseM, 'Base') * finitePositive(heightM, 'Height') / 2;
}
