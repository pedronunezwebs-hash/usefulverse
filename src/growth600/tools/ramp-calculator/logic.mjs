export const RAMP_LENGTH_TO_METERS = Object.freeze({ mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 });
const MAX_MEASURE = 1_000_000;
const MAX_LANDINGS = 100;

function bounded(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside its allowed range.`);
  return value;
}

export function calculateRamp({ rise, slopeRatioDenominator = 12, landingCount = 0, landingDepth = 0, unit = 'm' } = {}) {
  const factor = RAMP_LENGTH_TO_METERS[unit];
  if (!factor) throw new TypeError('Choose a supported length unit.');
  const riseM = bounded('Rise', rise, 0.001, MAX_MEASURE) * factor;
  const ratio = bounded('Slope ratio denominator', slopeRatioDenominator, 1, 1000);
  if (!Number.isInteger(ratio)) throw new RangeError('Slope ratio denominator must be a whole number.');
  if (!Number.isInteger(landingCount) || landingCount < 0 || landingCount > MAX_LANDINGS) throw new RangeError(`Landing count must be a whole number from 0 to ${MAX_LANDINGS}.`);
  const landingDepthValue = landingCount > 0 ? bounded('Landing depth', landingDepth, 0.001, MAX_MEASURE) : 0;
  const horizontalRunM = riseM * ratio;
  const rampSurfaceM = Math.hypot(riseM, horizontalRunM);
  const landingRunM = landingCount * landingDepthValue * factor;
  const totalHorizontalM = horizontalRunM + landingRunM;
  return Object.freeze({ unit, rise, slopeRatioDenominator: ratio, landingCount, landingDepth: landingCount > 0 ? landingDepthValue : null, horizontalRun: horizontalRunM / factor, rampSurface: rampSurfaceM / factor, landingRun: landingRunM / factor, totalHorizontalLength: totalHorizontalM / factor, slopePercent: 100 / ratio, slopeAngleDegrees: Math.atan(1 / ratio) * 180 / Math.PI });
}
