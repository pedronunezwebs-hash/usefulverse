export function estimateBrazilFgtsDeposit(remunerationBase, workerCategory) {
  const base = Number(remunerationBase);
  if (!Number.isFinite(base) || base < 0 || base > 100_000_000 || !['standard', 'apprentice'].includes(workerCategory)) {
    throw Object.assign(new Error('invalid-input'), { code: 'invalid-input' });
  }
  const rate = workerCategory === 'apprentice' ? 0.02 : 0.08;
  return Object.freeze({ remunerationBase: base, rate, employerDeposit: Math.round((base * rate + Number.EPSILON) * 100) / 100, employerPaid: true });
}
