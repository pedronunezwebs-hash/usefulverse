const COPPER_MIL_PER_OZ = 1.378;
const MIL_TO_MM = 0.0254;
const IPC2221_K = Object.freeze({ external: 0.048, internal: 0.024 });

function positive(value, name, max = 1e9) {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > max) throw new RangeError(`${name} must be positive and within the supported range.`);
  return number;
}

function validateConductor(value) {
  if (!Object.hasOwn(IPC2221_K, value)) throw new TypeError('Choose an external or internal conductor.');
  return value;
}

export function calculatePcbTraceWidth({ mode = 'required-width', conductor = 'external', currentA = 2, copperWeightOz = 1, temperatureRiseC = 10, width = 1, widthUnit = 'mm' } = {}) {
  const k = IPC2221_K[validateConductor(conductor)];
  const deltaTC = positive(temperatureRiseC, 'Temperature rise', 500);
  const copperOz = positive(copperWeightOz, 'Copper weight', 20);
  const thicknessMil = copperOz * COPPER_MIL_PER_OZ;
  if (mode === 'required-width') {
    const amps = positive(currentA, 'Current', 1e6);
    const areaMil2 = (amps / (k * deltaTC ** 0.44)) ** (1 / 0.725);
    const widthMil = areaMil2 / thicknessMil;
    if (![areaMil2, widthMil].every((value) => Number.isFinite(value) && value > 0 && value <= 1e12)) throw new RangeError('The estimated trace width is outside the supported range.');
    return Object.freeze({ mode, conductor, currentA: amps, copperWeightOz: copperOz, temperatureRiseC: deltaTC, copperThicknessMil: thicknessMil, areaMil2, widthMil, widthMm: widthMil * MIL_TO_MM, modelK: k });
  }
  if (mode === 'current-capacity') {
    const rawWidth = positive(width, 'Trace width', 1e9);
    if (!['mil', 'mm'].includes(widthUnit)) throw new TypeError('Choose a supported trace-width unit.');
    const widthMil = widthUnit === 'mm' ? rawWidth / MIL_TO_MM : rawWidth;
    const areaMil2 = widthMil * thicknessMil;
    const amps = k * deltaTC ** 0.44 * areaMil2 ** 0.725;
    if (![widthMil, areaMil2, amps].every((value) => Number.isFinite(value) && value > 0 && value <= 1e18)) throw new RangeError('The estimated current is outside the supported range.');
    return Object.freeze({ mode, conductor, currentA: amps, copperWeightOz: copperOz, temperatureRiseC: deltaTC, copperThicknessMil: thicknessMil, areaMil2, widthMil, widthMm: widthMil * MIL_TO_MM, modelK: k });
  }
  throw new TypeError('Choose a supported calculation mode.');
}

export const PCB_TRACE_WIDTH_MODEL = 'I = k × ΔT^0.44 × A^0.725';
