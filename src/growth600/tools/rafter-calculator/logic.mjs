const TO_METERS = Object.freeze({ m: 1, ft: 0.3048, cm: 0.01, in: 0.0254 });

function bounded(name, value, minimum, maximum) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  return value;
}

export function calculateRafter({ span, rise, pitch = null, ridgeThickness = 0, ridgeUnit = 'in', overhang = 0, unit = 'ft', mode = 'rise' } = {}) {
  const factor = TO_METERS[unit];
  const ridgeFactor = TO_METERS[ridgeUnit];
  if (!factor || !ridgeFactor || !['rise', 'pitch'].includes(mode)) throw new RangeError('Choose supported units and roof input mode.');
  const spanM = bounded('Span', span, 0.01, 100_000) * factor;
  const ridgeM = bounded('Ridge thickness', ridgeThickness, 0, 10_000) * ridgeFactor;
  const overhangM = bounded('Overhang', overhang, 0, 100_000) * factor;
  const effectiveRunM = (spanM - ridgeM) / 2;
  if (!(effectiveRunM > 0)) throw new RangeError('Ridge thickness must be smaller than the span.');
  const riseM = mode === 'rise'
    ? bounded('Rise', rise, 0.01, 100_000) * factor
    : effectiveRunM * bounded('Pitch', pitch, 0.01, 100) / 12;
  const slopeRatio = riseM / effectiveRunM;
  const totalRunM = effectiveRunM + overhangM;
  const totalRiseM = totalRunM * slopeRatio;
  const rafterLengthM = Math.hypot(totalRunM, totalRiseM);
  const angleDegrees = Math.atan(slopeRatio) * 180 / Math.PI;
  const result = {
    unit,
    span: spanM / factor,
    rise: riseM / factor,
    pitchPer12: slopeRatio * 12,
    ridgeThickness: ridgeM / ridgeFactor,
    ridgeUnit,
    horizontalRun: effectiveRunM / factor,
    overhang: overhangM / factor,
    totalHorizontalRun: totalRunM / factor,
    totalRise: totalRiseM / factor,
    rafterLength: rafterLengthM / factor,
    roofAngleDegrees: angleDegrees,
    plumbCutDegrees: 90 - angleDegrees,
  };
  if (!Object.entries(result).filter(([key]) => !['unit', 'ridgeUnit'].includes(key)).every(([, value]) => Number.isFinite(value))) throw new RangeError('The requested roof is too large to calculate safely.');
  return Object.freeze(result);
}
