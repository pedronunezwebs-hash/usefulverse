const TORQUE_TO_NM = Object.freeze({ Nm: 1, 'lb·ft': 1.3558179483314 });
const POWER_FROM_W = Object.freeze({ W: 1, kW: 1000, hp: 745.6998715822702, PS: 735.49875 });
const INPUT_LIMIT = 1e12;
const RESULT_LIMIT = 1e18;

function finite(name, raw, { min = -INPUT_LIMIT, max = INPUT_LIMIT } = {}) {
  if (raw === '' || raw === null || raw === undefined) throw new TypeError(`${name} is required.`);
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`${name} is outside the supported range.`);
  return value;
}

function checked(value) {
  if (!Number.isFinite(value) || Math.abs(value) > RESULT_LIMIT) throw new RangeError('The result is outside the supported range.');
  return Object.is(value, -0) ? 0 : value;
}

function powerWatts(torqueNm, rpm) {
  return checked(torqueNm * (2 * Math.PI * rpm / 60));
}

export function calculateHorsepower({ mode = 'solve-power', torque = '', torqueUnit = 'Nm', rpm = '', power = '', powerUnit = 'hp' } = {}) {
  if (!Object.hasOwn(TORQUE_TO_NM, torqueUnit) || !Object.hasOwn(POWER_FROM_W, powerUnit)) throw new RangeError('Choose supported units.');
  if (!['solve-power', 'solve-torque', 'solve-rpm'].includes(mode)) throw new RangeError('Choose a supported calculation.');

  let torqueNm;
  let rotationsPerMinute;
  let watts;
  if (mode === 'solve-power') {
    torqueNm = finite('Torque', torque) * TORQUE_TO_NM[torqueUnit];
    rotationsPerMinute = finite('RPM', rpm, { min: 0 });
    watts = powerWatts(torqueNm, rotationsPerMinute);
  } else if (mode === 'solve-torque') {
    rotationsPerMinute = finite('RPM', rpm, { min: Number.MIN_VALUE });
    watts = finite('Power', power) * POWER_FROM_W[powerUnit];
    torqueNm = checked(watts / (2 * Math.PI * rotationsPerMinute / 60));
  } else {
    torqueNm = finite('Torque', torque) * TORQUE_TO_NM[torqueUnit];
    if (torqueNm === 0) throw new RangeError('Torque must not be zero when solving RPM.');
    watts = finite('Power', power) * POWER_FROM_W[powerUnit];
    rotationsPerMinute = checked(watts * 60 / (2 * Math.PI * torqueNm));
    if (rotationsPerMinute < 0) throw new RangeError('Power and torque must have matching signs for a non-negative RPM result.');
  }

  const powerValues = Object.fromEntries(Object.entries(POWER_FROM_W).map(([unit, factor]) => [unit, checked(watts / factor)]));
  return Object.freeze({
    mode,
    torqueNm: checked(torqueNm),
    torque: checked(torqueNm / TORQUE_TO_NM[torqueUnit]),
    torqueUnit,
    rpm: checked(rotationsPerMinute),
    watts: checked(watts),
    power: powerValues[powerUnit],
    powerUnit,
    powerValues,
  });
}
