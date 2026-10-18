import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePetAge, comparePetAges, felineVmaAgeChart } from './pet-age.mjs';

test('cat age uses published FelineVMA anchor points and interpolates between them', () => {
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 12 }).humanEquivalentYears, 15);
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 24 }).humanEquivalentYears, 24);
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 36 }).humanEquivalentYears, 28);
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 30 }).humanEquivalentYears, 26);
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 7 }).lifeStage, 'kitten');
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 83 }).lifeStage, 'youngAdult');
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 84 }).lifeStage, 'matureAdult');
  assert.equal(calculatePetAge({ species: 'cat', ageMonths: 121 }).lifeStage, 'senior');
  assert.equal(felineVmaAgeChart.at(-1)[1], 116);
});

test('dog output avoids an unsupported human-year formula and estimates broad life stages', () => {
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 8, expectedLifespanYears: 12 }).lifeStage, 'puppy');
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 36, expectedLifespanYears: 12 }).lifeStage, 'youngAdult');
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 90, expectedLifespanYears: 12 }).lifeStage, 'matureAdult');
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 110, expectedLifespanYears: 12 }).lifeStage, 'senior');
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 144, expectedLifespanYears: 12 }).lifeStage, 'geriatric');
  assert.equal(calculatePetAge({ species: 'dog', ageMonths: 90 }).humanEquivalentYears, null);
});

test('age input and comparison count are bounded, and names are trimmed', () => {
  assert.throws(() => calculatePetAge({ species: 'cat', ageMonths: 301 }), /0 to 300/u);
  assert.throws(() => calculatePetAge({ species: 'dog', ageMonths: -1 }), /0 to 300/u);
  assert.throws(() => calculatePetAge({ species: 'dog', ageMonths: 20, expectedLifespanYears: 5 }), /6 and 25/u);
  assert.throws(() => comparePetAges([]), /one and five/u);
  assert.throws(() => comparePetAges(Array(6).fill({ species: 'cat', ageMonths: 12 })), /one and five/u);
  const [pet] = comparePetAges([{ name: '  Miso  ', species: 'cat', ageMonths: 12 }]);
  assert.equal(pet.name, 'Miso');
});
