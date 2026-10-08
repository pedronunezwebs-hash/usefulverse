const MAX_STAGES = 6;
const MAX_TEETH = 100_000;
const MAX_RATIO = 1_000_000_000;

function positive(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0 || number > maximum) throw new RangeError(`${label} must be greater than zero and at most ${maximum}.`);
  return number;
}

function parseStages(source) {
  if (typeof source !== 'string' || !source.trim()) throw new TypeError('Enter at least one driver:driven tooth pair.');
  const lines = source.trim().split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length > MAX_STAGES) throw new RangeError(`Enter no more than ${MAX_STAGES} transmission stages.`);
  return lines.map((line, index) => {
    const match = line.match(/^(\d+)\s*[:/]\s*(\d+)$/u);
    if (!match) throw new SyntaxError(`Stage ${index + 1} must use driver:driven teeth, such as 20:40.`);
    const driverTeeth = Number(match[1]);
    const drivenTeeth = Number(match[2]);
    if (!Number.isSafeInteger(driverTeeth) || driverTeeth < 1 || driverTeeth > MAX_TEETH || !Number.isSafeInteger(drivenTeeth) || drivenTeeth < 1 || drivenTeeth > MAX_TEETH) {
      throw new RangeError(`Stage ${index + 1} tooth counts must be whole numbers from 1 to ${MAX_TEETH}.`);
    }
    return Object.freeze({ driverTeeth, drivenTeeth, ratio: drivenTeeth / driverTeeth });
  });
}

export function calculateGearRatio({ stages: stageInput, inputRpm, inputTorque = '', driveType = 'gears', efficiencyPercent = '' }) {
  const stages = Array.isArray(stageInput)
    ? stageInput.map(({ driverTeeth, drivenTeeth }) => `${driverTeeth}:${drivenTeeth}`).join('\n')
    : stageInput;
  const parsedStages = parseStages(stages);
  if (!['gears', 'chain'].includes(driveType)) throw new RangeError('Choose external gears or a chain drive.');
  const rpm = positive(inputRpm, 'Input RPM', 1_000_000_000);
  const torque = inputTorque === '' || inputTorque === null || inputTorque === undefined ? null : positive(inputTorque, 'Input torque', 1_000_000_000);
  const efficiency = efficiencyPercent === '' || efficiencyPercent === null || efficiencyPercent === undefined
    ? null
    : Number(efficiencyPercent);
  if (efficiency !== null && (!Number.isFinite(efficiency) || efficiency <= 0 || efficiency > 100)) throw new RangeError('Per-stage efficiency must be greater than 0 and at most 100 percent.');

  const ratio = parsedStages.reduce((product, stage) => product * stage.ratio, 1);
  if (!Number.isFinite(ratio) || ratio < 1 / MAX_RATIO || ratio > MAX_RATIO) throw new RangeError('Overall ratio must be between 1:1,000,000,000 and 1,000,000,000:1.');
  const outputRpm = rpm / ratio;
  const efficiencyFactor = efficiency === null ? 1 : (efficiency / 100) ** parsedStages.length;
  const idealOutputTorque = torque === null ? null : torque * ratio;
  const estimatedOutputTorque = idealOutputTorque === null ? null : idealOutputTorque * efficiencyFactor;
  if (![outputRpm, idealOutputTorque, estimatedOutputTorque].filter((value) => value !== null).every(Number.isFinite)) throw new RangeError('The result is too large to represent safely.');

  return Object.freeze({
    stages: Object.freeze(parsedStages),
    stageCount: parsedStages.length,
    driveType,
    ratio,
    inputRpm: rpm,
    outputRpm,
    inputTorque: torque,
    idealOutputTorque,
    efficiencyPercent: efficiency,
    efficiencyFactor,
    estimatedOutputTorque,
    outputDirection: driveType === 'chain' || parsedStages.length % 2 === 0 ? 'same' : 'reversed',
  });
}
