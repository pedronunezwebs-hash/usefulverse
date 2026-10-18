const CAT_AGE_CHART = Object.freeze([
  [0, 0], [1, 1], [3, 4], [6, 10], [12, 15], [24, 24], [36, 28], [48, 32],
  [60, 36], [72, 40], [84, 44], [96, 48], [108, 52], [120, 56], [132, 60],
  [144, 64], [156, 68], [168, 72], [180, 76], [192, 80], [204, 84], [216, 88],
  [228, 92], [240, 96], [252, 100], [264, 104], [276, 108], [288, 112],
  [300, 116],
]);

const CAT_STAGES = Object.freeze([
  { throughMonths: 11, stage: 'kitten' },
  { throughMonths: 83, stage: 'youngAdult' },
  { throughMonths: 120, stage: 'matureAdult' },
  { throughMonths: Infinity, stage: 'senior' },
]);

function finiteNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${field} must be a finite number.`);
  return number;
}

function interpolateCatHumanAge(ageMonths) {
  const nextIndex = CAT_AGE_CHART.findIndex(([months]) => months >= ageMonths);
  if (nextIndex <= 0) return CAT_AGE_CHART[0][1];
  const [rightMonths, rightHumanYears] = CAT_AGE_CHART[nextIndex];
  const [leftMonths, leftHumanYears] = CAT_AGE_CHART[nextIndex - 1];
  const fraction = (ageMonths - leftMonths) / (rightMonths - leftMonths);
  return leftHumanYears + fraction * (rightHumanYears - leftHumanYears);
}

export function calculatePetAge({ species, ageMonths, expectedLifespanYears = 15 }) {
  const months = finiteNumber(ageMonths, 'ageMonths');
  if (!['dog', 'cat'].includes(species) || !Number.isInteger(months) || months < 0 || months > 300) {
    throw new RangeError('Choose a dog or cat and enter an age from 0 to 300 whole months.');
  }
  const ageYears = months / 12;
  if (species === 'cat') {
    const lifeStage = CAT_STAGES.find(({ throughMonths }) => months <= throughMonths).stage;
    return Object.freeze({ species, ageMonths: months, ageYears, lifeStage, humanEquivalentYears: interpolateCatHumanAge(months), method: 'felinevma-2025-chart' });
  }

  const lifespan = finiteNumber(expectedLifespanYears, 'expectedLifespanYears');
  if (lifespan < 6 || lifespan > 25) throw new RangeError('Expected lifespan must be between 6 and 25 years.');
  const lifeStage = months < 9 ? 'puppy'
    : months < 48 ? 'youngAdult'
      : ageYears >= lifespan ? 'geriatric'
        : ageYears >= lifespan * 0.75 ? 'senior' : 'matureAdult';
  return Object.freeze({ species, ageMonths: months, ageYears, lifeStage, expectedLifespanYears: lifespan, seniorThresholdYears: lifespan * 0.75, humanEquivalentYears: null, method: 'aaha-life-stage-estimate' });
}

export function comparePetAges(pets) {
  if (!Array.isArray(pets) || pets.length < 1 || pets.length > 5) throw new RangeError('Compare between one and five pets.');
  return Object.freeze(pets.map((pet, index) => {
    const name = String(pet.name ?? '').trim().slice(0, 32) || `Pet ${index + 1}`;
    return Object.freeze({ name, ...calculatePetAge(pet) });
  }));
}

export const felineVmaAgeChart = CAT_AGE_CHART;
