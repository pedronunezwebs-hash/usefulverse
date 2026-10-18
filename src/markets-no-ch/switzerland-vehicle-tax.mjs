export const swissVehicleTaxSource = Object.freeze({
  title: 'TCS 2026 comparison · published February 2026',
  url: 'https://www.tcs.ch/de/testberichte-ratgeber/ratgeber/umwelt-mobilitaet/motorfahrzeugsteuer.php',
  pdf: 'https://www.tcs.ch/mam/Digital-Media/PDF/Booklets/steuern-und-subventionen-fuer-motorfahrzeuge-in-der-schweiz-2026.pdf',
});

export const swissVehicleTaxVehicles = Object.freeze([
  { id: 'tayron-phev', name: 'VW Tayron R-Line United · plug-in hybrid', fuel: 'Plug-in hybrid', displacement: 1498, powerKw: 200, totalWeightKg: 2500, co2Wltp: 11, efficiency: 'C' },
  { id: 'model-y', name: 'Tesla Model Y Performance AWD · electric', fuel: 'Electric', displacement: 0, powerKw: 338, totalWeightKg: 2543, co2Wltp: 0, efficiency: 'B' },
  { id: 'tiguan-diesel', name: 'VW Tiguan 2.0 TDI SCR Life DSG · diesel', fuel: 'Diesel', displacement: 1968, powerKw: 110, totalWeightKg: 2160, co2Wltp: 139, efficiency: 'E' },
  { id: 'yaris-hybrid', name: 'Toyota Yaris Cross 1.5 Hybrid 116 Comfort CVT · hybrid', fuel: 'Hybrid', displacement: 1490, powerKw: 85, totalWeightKg: 1690, co2Wltp: 101, efficiency: 'C' },
  { id: 'spring-electric', name: 'Dacia Spring Electric 65 Extreme · electric', fuel: 'Electric', displacement: 0, powerKw: 48, totalWeightKg: 1315, co2Wltp: 0, efficiency: 'A' },
  { id: 'octavia-petrol', name: 'Škoda Octavia Combi 2.0 TSI DSG 4×4 · petrol', fuel: 'Petrol', displacement: 1984, powerKw: 150, totalWeightKg: 2060, co2Wltp: 155, efficiency: 'F' },
]);

const cantonRows = [
  ['AG', 'Aargau', [303, 411, 295, 213, 180, 326]], ['AI', 'Appenzell Innerrhoden', [650, 665, 548, 407, 296, 518]],
  ['AR', 'Appenzell Ausserrhoden', [762, 779, 648, 491, 376, 615]], ['BE', 'Bern', [535, 109, 475, 382, 61, 457]],
  ['BL', 'Basel-Landschaft', [422, 434, 473, 188, 80, 595]], ['BS', 'Basel-Stadt', [274, 131, 432, 309, 65, 442]],
  ['FR', 'Fribourg', [511, 921, 532, 337, 131, 601]], ['GE', 'Geneva', [123, 720, 294, 145, 120, 314]],
  ['GL', 'Glarus', [322, 0, 407, 322, 0, 488]], ['GR', 'Graubünden', [95, 108, 570, 475, 90, 570]],
  ['JU', 'Jura', [492, 456, 463, 281, 102, 472]], ['LU', 'Lucerne', [475, 130, 404, 290, 35, 438]],
  ['NE', 'Neuchâtel', [250, 250, 461, 309, 250, 525]], ['NW', 'Nidwalden', [133, 98, 340, 133, 0, 340]],
  ['OW', 'Obwalden', [149, 125, 368, 149, 125, 368]], ['SG', 'St. Gallen', [620, 669, 533, 394, 150, 636]],
  ['SH', 'Schaffhausen', [204, 306, 264, 204, 132, 264]], ['SO', 'Solothurn', [276, 0, 351, 276, 0, 351]],
  ['SZ', 'Schwyz', [385, 909, 334, 219, 162, 442]], ['TG', 'Thurgau', [240, 72, 288, 240, 48, 432]],
  ['TI', 'Ticino', [388, 278, 444, 213, 115, 515]], ['UR', 'Uri', [550, 374, 475, 338, 158, 453]],
  ['VD', 'Vaud', [66, 140, 210, 36, 22, 669]], ['VS', 'Valais', [212, 135, 269, 212, 120, 269]],
  ['ZG', 'Zug', [272, 252, 326, 271, 131, 328]], ['ZH', 'Zurich', [538, 0, 338, 238, 0, 338]],
];

export const swissVehicleTaxCantons = Object.freeze(cantonRows.map(([code, name, taxes]) => Object.freeze({
  code, name, annualChf: Object.freeze(Object.fromEntries(swissVehicleTaxVehicles.map((vehicle, index) => [vehicle.id, taxes[index]]))),
})));

export function compareSwissVehicleTax({ vehicleId, comparisonVehicleId = '', canton = 'ALL', order = 'asc' } = {}) {
  const vehicle = swissVehicleTaxVehicles.find(({ id }) => id === vehicleId);
  if (!vehicle) throw new RangeError('Choose a reference vehicle from the 2026 comparison.');
  const comparison = comparisonVehicleId ? swissVehicleTaxVehicles.find(({ id }) => id === comparisonVehicleId) : null;
  if (comparisonVehicleId && (!comparison || comparison.id === vehicle.id)) throw new RangeError('Choose a different second reference vehicle.');
  if (canton !== 'ALL' && !swissVehicleTaxCantons.some(({ code }) => code === canton)) throw new RangeError('Choose a Swiss canton or all cantons.');
  if (!['asc', 'desc'].includes(order)) throw new RangeError('Unsupported tax sort order.');
  const rows = swissVehicleTaxCantons.filter((row) => canton === 'ALL' || row.code === canton)
    .map((row) => ({ code: row.code, name: row.name, tax: row.annualChf[vehicle.id], comparisonTax: comparison ? row.annualChf[comparison.id] : null,
      difference: comparison ? row.annualChf[vehicle.id] - row.annualChf[comparison.id] : null }))
    .sort((a, b) => order === 'asc' ? a.tax - b.tax || a.code.localeCompare(b.code) : b.tax - a.tax || a.code.localeCompare(b.code));
  const taxes = rows.map(({ tax }) => tax);
  const summary = { count: rows.length, minimum: Math.min(...taxes), maximum: Math.max(...taxes), mean: taxes.reduce((sum, value) => sum + value, 0) / taxes.length };
  return { vehicle, comparison, rows, summary, canton, order, source: swissVehicleTaxSource };
}

export function swissVehicleTaxCsv(result) {
  if (!result?.rows?.length) throw new TypeError('Calculate a vehicle comparison before exporting.');
  const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const header = ['Canton code', 'Canton', `${result.vehicle.name} · annual CHF`, ...(result.comparison ? [`${result.comparison.name} · annual CHF`, 'Difference CHF (first minus second)'] : [])];
  return [header, ...result.rows.map((row) => [row.code, row.name, row.tax, ...(result.comparison ? [row.comparisonTax, row.difference] : [])])].map((row) => row.map(quote).join(',')).join('\r\n');
}
