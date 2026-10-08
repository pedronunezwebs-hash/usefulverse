const MAX_INPUT = 1e12;
const MAX_RESULT = 1e24;
const KG_PER_CUBIC_METER_TO_LB_PER_CUBIC_FOOT = 0.0624279605761;

function positive(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > MAX_INPUT) {
    throw new RangeError(`${label} must be greater than zero and at most ${MAX_INPUT}.`);
  }
  return number;
}

function checkedResult(value, label) {
  if (!Number.isFinite(value) || value <= 0 || value > MAX_RESULT) {
    throw new RangeError(`${label} is outside the supported range.`);
  }
  return value;
}

function formatDensity(densityKgM3) {
  return Object.freeze({
    densityKgM3,
    densityGcm3: densityKgM3 / 1000,
    densityLbFt3: densityKgM3 * KG_PER_CUBIC_METER_TO_LB_PER_CUBIC_FOOT,
  });
}

export function parseDensityComponents(source) {
  if (typeof source !== 'string' || !source.trim()) throw new TypeError('Enter at least one mass,volume component.');
  const lines = source.trim().split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 12) throw new RangeError('Enter no more than 12 components.');
  return Object.freeze(lines.map((line, index) => {
    const parts = line.split(/[;,]/u).map((part) => part.trim());
    if (parts.length !== 2 || parts.some((part) => !part)) {
      throw new SyntaxError(`Component ${index + 1} must use mass,volume in kg and m³.`);
    }
    return Object.freeze({
      massKg: positive(parts[0], `Component ${index + 1} mass`),
      volumeM3: positive(parts[1], `Component ${index + 1} volume`),
    });
  }));
}

export function calculateDensity({ mode = 'solve', massKg = '', volumeM3 = '', densityKgM3 = '', components = '' } = {}) {
  if (mode === 'mix') {
    const parsed = parseDensityComponents(components);
    const totalMassKg = checkedResult(parsed.reduce((sum, item) => sum + item.massKg, 0), 'Total mass');
    const totalVolumeM3 = checkedResult(parsed.reduce((sum, item) => sum + item.volumeM3, 0), 'Total volume');
    return Object.freeze({
      mode,
      componentCount: parsed.length,
      massKg: totalMassKg,
      volumeM3: totalVolumeM3,
      ...formatDensity(totalMassKg / totalVolumeM3),
    });
  }
  if (mode !== 'solve') throw new TypeError('Choose solve or mix mode.');

  const raw = { massKg, volumeM3, densityKgM3 };
  const provided = Object.keys(raw).filter((key) => raw[key] !== '' && raw[key] !== null && raw[key] !== undefined);
  if (provided.length !== 2) throw new TypeError('Enter exactly two of mass, volume and density.');
  const values = Object.fromEntries(provided.map((key) => [key, positive(raw[key], key)]));
  let mass = values.massKg;
  let volume = values.volumeM3;
  let density = values.densityKgM3;

  if (mass !== undefined && volume !== undefined) density = mass / volume;
  else if (mass !== undefined && density !== undefined) volume = mass / density;
  else mass = volume * density;

  mass = checkedResult(mass, 'Mass');
  volume = checkedResult(volume, 'Volume');
  density = checkedResult(density, 'Density');
  return Object.freeze({ mode, componentCount: 1, massKg: mass, volumeM3: volume, ...formatDensity(density) });
}
