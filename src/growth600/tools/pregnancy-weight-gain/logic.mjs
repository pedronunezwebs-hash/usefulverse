const LB_PER_KG = 2.2046226218;
const GUIDANCE = Object.freeze({
  singleton: Object.freeze([
    { max: 18.5, category: 'underweight', minLb: 28, maxLb: 40 },
    { max: 25, category: 'normal', minLb: 25, maxLb: 35 },
    { max: 30, category: 'overweight', minLb: 15, maxLb: 25 },
    { max: 40, category: 'obesity', minLb: 11, maxLb: 20 },
  ]),
  twins: Object.freeze([
    { max: 18.5, category: 'underweight', minLb: 50, maxLb: 62 },
    { max: 25, category: 'normal', minLb: 37, maxLb: 54 },
    { max: 30, category: 'overweight', minLb: 31, maxLb: 50 },
    { max: 40, category: 'obesity', minLb: 25, maxLb: 42 },
  ]),
});

export function getPregnancyWeightGainGuide(prepregnancyBmi, pregnancyType = 'singleton') {
  const bmi = Number(prepregnancyBmi);
  if (!Number.isFinite(bmi) || bmi < 10 || bmi > 60) throw Object.assign(new Error('invalid-bmi'), { code: 'invalid-bmi' });
  if (!['singleton', 'twins', 'three-or-more'].includes(pregnancyType)) throw Object.assign(new Error('invalid-pregnancy-type'), { code: 'invalid-pregnancy-type' });
  if (pregnancyType === 'three-or-more') return Object.freeze({ supported: false, reason: 'provider-guidance-needed', bmi });
  const band = GUIDANCE[pregnancyType].find(({ max }) => bmi < max);
  if (!band) return Object.freeze({ supported: false, reason: 'bmi-outside-published-bands', bmi });
  return Object.freeze({
    supported: true, pregnancyType, bmi, category: band.category,
    minLb: band.minLb, maxLb: band.maxLb,
    minKg: band.minLb / LB_PER_KG, maxKg: band.maxLb / LB_PER_KG,
    sourceDate: '2024-05-15',
  });
}
