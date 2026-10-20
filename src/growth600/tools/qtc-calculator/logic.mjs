export function calculateQTc({ qtMs, mode = 'rr', rrMs, heartRateBpm } = {}) {
  const qt = Number(qtMs);
  if (!Number.isFinite(qt) || qt < 100 || qt > 1000) throw Object.assign(new RangeError('Invalid QT measurement.'), { code: 'invalid-qt' });
  let rr;
  if (mode === 'rr') { rr = Number(rrMs); if (!Number.isFinite(rr) || rr < 200 || rr > 3000) throw Object.assign(new RangeError('Invalid RR measurement.'), { code: 'invalid-rr' }); }
  else if (mode === 'heart-rate') { const rate = Number(heartRateBpm); if (!Number.isFinite(rate) || rate < 20 || rate > 250) throw Object.assign(new RangeError('Invalid heart rate.'), { code: 'invalid-heart-rate' }); rr = 60000 / rate; }
  else throw Object.assign(new RangeError('Choose RR or heart-rate input.'), { code: 'invalid-mode' });
  const rrSeconds = rr / 1000, heartRate = 60000 / rr;
  return Object.freeze({ qtMs: qt, rrMs: rr, heartRateBpm: heartRate, bazett: qt / Math.sqrt(rrSeconds), fridericia: qt / Math.cbrt(rrSeconds), framingham: qt + 154 * (1 - rrSeconds), hodges: qt + 1.75 * (heartRate - 60) });
}
