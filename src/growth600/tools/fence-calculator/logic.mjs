export const FENCE_LENGTH_TO_M = Object.freeze({ m: 1, cm: 0.01, mm: 0.001, ft: 0.3048, in: 0.0254 });

function positive(name, value, { minimum = Number.EPSILON, maximum = 1_000_000 } = {}) {
  if (!Number.isFinite(value) || value < minimum || value > maximum) throw new RangeError(`${name} must be from ${minimum} to ${maximum}.`);
  return value;
}

function countUp(value) {
  const nearest = Math.round(value);
  return Math.abs(value - nearest) <= Math.max(1, Math.abs(value)) * 1e-10 ? nearest : Math.ceil(value);
}

function optionalPrice(name, value) {
  if (value === null || value === undefined || value === '') return null;
  return positive(name, value, { minimum: 0, maximum: 1_000_000 });
}

function optionCost({ postCount, gateCount, itemCount, pricePerPost, pricePerGate, pricePerItem }) {
  if (pricePerPost === null || pricePerItem === null || (gateCount > 0 && pricePerGate === null)) return null;
  return postCount * pricePerPost + itemCount * pricePerItem + gateCount * (pricePerGate ?? 0);
}

export function calculateFence({
  length,
  unit = 'ft',
  gateCount = 0,
  gateWidth = 4,
  materialUnit = 'in',
  postSpacing = 96,
  panelWidth = 96,
  picketWidth = 5.5,
  maxPicketGap = 2,
  picketHeight = 72,
  wastePercent = 10,
  pricePerPost = null,
  pricePerGate = null,
  pricePerPanel = null,
  pricePerPicket = null,
} = {}) {
  const lengthFactor = FENCE_LENGTH_TO_M[unit];
  const materialFactor = FENCE_LENGTH_TO_M[materialUnit];
  if (!lengthFactor || !materialFactor) throw new RangeError('Choose a supported length unit.');

  const totalLengthM = positive('Fence length', length) * lengthFactor;
  if (!Number.isInteger(gateCount) || gateCount < 0 || gateCount > 20) throw new RangeError('Gate count must be a whole number from 0 to 20.');
  const gateWidthM = positive('Gate opening width', gateWidth) * materialFactor;
  const postSpacingM = positive('Maximum post spacing', postSpacing) * materialFactor;
  const panelWidthM = positive('Panel width', panelWidth) * materialFactor;
  const picketWidthM = positive('Picket width', picketWidth) * materialFactor;
  const maxPicketGapM = positive('Maximum picket gap', maxPicketGap, { minimum: 0, maximum: 1_000 }) * materialFactor;
  if (maxPicketGapM > 1) throw new RangeError('Maximum picket gap must not exceed 1 meter.');
  const picketHeightM = positive('Picket height', picketHeight) * materialFactor;
  if (!Number.isFinite(wastePercent) || wastePercent < 0 || wastePercent > 30) throw new RangeError('Extra material must be from 0% to 30%.');

  const gateOpeningM = gateCount * gateWidthM;
  const fenceLengthM = totalLengthM - gateOpeningM;
  if (fenceLengthM <= 0) throw new RangeError('Gate openings must be shorter than the full fence run.');

  // With no gate positions supplied, distribute the remaining straight fence evenly
  // among the sections between the two ends and each gate opening.
  const sectionCount = gateCount + 1;
  const averageSectionLengthM = fenceLengthM / sectionCount;
  if (picketWidthM > averageSectionLengthM) throw new RangeError('Picket width must fit within each assumed fence section.');
  const postSpansPerSection = countUp(averageSectionLengthM / postSpacingM);
  const postsPerSection = postSpansPerSection + 1;
  const postCount = sectionCount * postsPerSection;
  const panelsPerSection = countUp(averageSectionLengthM / panelWidthM);
  const panelCount = sectionCount * panelsPerSection;

  const picketsPerSection = Math.max(1, Math.min(
    Math.floor(averageSectionLengthM / picketWidthM + 1e-10),
    countUp((averageSectionLengthM + maxPicketGapM) / (picketWidthM + maxPicketGapM)),
  ));
  const picketCount = sectionCount * picketsPerSection;
  const actualPicketGapM = picketsPerSection > 1
    ? Math.max(0, (averageSectionLengthM - picketsPerSection * picketWidthM) / (picketsPerSection - 1))
    : null;
  const orderedPanels = countUp(panelCount * (1 + wastePercent / 100));
  const orderedPickets = countUp(picketCount * (1 + wastePercent / 100));
  const orderedPicketLengthM = orderedPickets * picketHeightM;

  const prices = {
    post: optionalPrice('Price per post', pricePerPost),
    gate: optionalPrice('Price per gate', pricePerGate),
    panel: optionalPrice('Price per panel', pricePerPanel),
    picket: optionalPrice('Price per picket', pricePerPicket),
  };

  return Object.freeze({
    totalLengthM,
    gateOpeningM,
    fenceLengthM,
    sectionCount,
    averageSectionLengthM,
    postSpansPerSection,
    postsPerSection,
    postCount,
    panelsPerSection,
    panelCount,
    orderedPanels,
    picketsPerSection,
    picketCount,
    orderedPickets,
    actualPicketGapM,
    orderedPicketLengthM,
    estimatedPanelOptionCost: optionCost({ postCount, gateCount, itemCount: orderedPanels, pricePerPost: prices.post, pricePerGate: prices.gate, pricePerItem: prices.panel }),
    estimatedPicketOptionCost: optionCost({ postCount, gateCount, itemCount: orderedPickets, pricePerPost: prices.post, pricePerGate: prices.gate, pricePerItem: prices.picket }),
  });
}
