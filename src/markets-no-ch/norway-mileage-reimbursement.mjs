/** Norwegian 2026 private-car work mileage reimbursement scenario. */
export const norwayMileageRules2026 = Object.freeze({
  year: 2026,
  checkedAt: '2026-10-17',
  governmentRateNokPerKm: 5.3,
  taxFreeRateNokPerKm: 3.5,
  passengerAdditionNokPerKm: 1,
  forestRoadAdditionNokPerKm: 1,
  equipmentAdditionNokPerKm: 1,
  sourceSkatteetaten: 'https://www.skatteetaten.no/en/Rates/Car-allowance-distance-based-allowance/',
  sourceGovernment: 'https://www.regjeringen.no/no/dokumenter/saravtale-om-dekning-av-utgifter-til-reise-og-kost-innenlands/id3083006/',
});

function finite(value, name, min = 0, max = 1e9) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function roundNok(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }

/** Summarizes up to 100 logged trips; all amounts are NOK and trips must be from 2026. */
export function estimateNorwayMileageReimbursement({ trips, taxEffectRatePct = 0 } = {}) {
  if (!Array.isArray(trips) || trips.length < 1 || trips.length > 100) throw new RangeError('Enter between 1 and 100 work trips.');
  const taxEffectRate = finite(taxEffectRatePct, 'Tax effect rate', 0, 100);
  const rows = trips.map((trip, index) => {
    if (!trip || typeof trip !== 'object') throw new TypeError(`Trip ${index + 1} is invalid.`);
    const date = String(trip.date ?? '');
    if (!/^2026-\d{2}-\d{2}$/u.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new RangeError(`Trip ${index + 1} needs a valid date in 2026.`);
    const km = finite(trip.km, `Trip ${index + 1} distance`, 0.01, 100000);
    const reimbursement = finite(trip.reimbursementNok, `Trip ${index + 1} reimbursement`, 0, 1e9);
    const passengers = finite(trip.passengerCount ?? 0, `Trip ${index + 1} passengers`, 0, 20);
    const forestRoadKm = finite(trip.forestOrConstructionRoadKm ?? 0, `Trip ${index + 1} forest-road kilometres`, 0, km);
    const equipmentKm = finite(trip.specialEquipmentKm ?? 0, `Trip ${index + 1} equipment kilometres`, 0, km);
    if (!Number.isInteger(passengers)) throw new RangeError(`Trip ${index + 1} passenger count must be a whole number.`);
    const passengerSupplementNok = km * passengers * norwayMileageRules2026.passengerAdditionNokPerKm;
    const forestSupplementNok = forestRoadKm * norwayMileageRules2026.forestRoadAdditionNokPerKm;
    const equipmentSupplementNok = equipmentKm * norwayMileageRules2026.equipmentAdditionNokPerKm;
    const exemptCapNok = km * norwayMileageRules2026.taxFreeRateNokPerKm + passengerSupplementNok + forestSupplementNok + equipmentSupplementNok;
    const taxFreeNok = Math.min(reimbursement, exemptCapNok);
    const taxableExcessNok = Math.max(0, reimbursement - taxFreeNok);
    return Object.freeze({ date, km, reimbursementNok: roundNok(reimbursement), exemptCapNok: roundNok(exemptCapNok), taxFreeNok: roundNok(taxFreeNok), taxableExcessNok: roundNok(taxableExcessNok), effectivePaidRateNokPerKm: roundNok(reimbursement / km), passengerSupplementNok: roundNok(passengerSupplementNok), forestSupplementNok: roundNok(forestSupplementNok), equipmentSupplementNok: roundNok(equipmentSupplementNok) });
  });
  const sum = (key) => roundNok(rows.reduce((total, row) => total + row[key], 0));
  const reimbursedNok = sum('reimbursementNok');
  const taxFreeNok = sum('taxFreeNok');
  const taxableExcessNok = sum('taxableExcessNok');
  return Object.freeze({
    rulesYear: norwayMileageRules2026.year,
    checkedAt: norwayMileageRules2026.checkedAt,
    governmentRateNokPerKm: norwayMileageRules2026.governmentRateNokPerKm,
    taxFreeRateNokPerKm: norwayMileageRules2026.taxFreeRateNokPerKm,
    tripCount: rows.length,
    totalKm: roundNok(rows.reduce((total, row) => total + row.km, 0)),
    reimbursedNok,
    taxFreeCapNok: sum('exemptCapNok'),
    taxFreeNok,
    taxableExcessNok,
    taxEffectRatePct: taxEffectRate,
    estimatedTaxOnExcessNok: roundNok(taxableExcessNok * taxEffectRate / 100),
    trips: Object.freeze(rows),
  });
}
