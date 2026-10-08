const LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });

function finiteRange(value, label, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
  return number;
}

export function calculateRoofPitch({ rise, run, overhang = 0, unit = 'm' }) {
  const factor = LENGTH_TO_M[unit];
  if (!factor) throw new TypeError('Choose a supported unit.');
  const riseM = finiteRange(rise, 'Rise', 0.001, 100_000) * factor;
  const runM = finiteRange(run, 'Run', 0.001, 100_000) * factor;
  const overhangM = finiteRange(overhang, 'Overhang', 0, 100_000) * factor;
  const angleRadians = Math.atan2(riseM, runM);
  const angleDegrees = angleRadians * 180 / Math.PI;
  return Object.freeze({
    riseM, runM, overhangM, slopePercent: riseM / runM * 100,
    pitchRisePer12: riseM / runM * 12, angleRadians, angleDegrees,
    rafterLengthM: Math.hypot(riseM, runM + overhangM),
  });
}
