import { writeFile } from 'node:fs/promises';

const files = {
  bmi: 'https://www.cdc.gov/growthcharts/data/zscore/bmiagerev.csv',
  bmiExtended: 'https://www.cdc.gov/growthcharts/data/extended-bmi/bmi-age-2022.csv',
  stature: 'https://www.cdc.gov/growthcharts/data/zscore/statage.csv',
  weight: 'https://www.cdc.gov/growthcharts/data/zscore/wtage.csv',
};
const headers = ['sex', 'agemos', 'L', 'M', 'S'];
const tables = {};
for (const [name, url] of Object.entries(files)) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${name}: CDC download failed (${response.status}).`);
  const lines = (await response.text()).trim().split(/\r?\n/u);
  const columns = lines.shift().split(',');
  const normalizedColumns = columns.map((column) => column.toLowerCase());
  const hasRequiredPercentile = columns.some((column) => column.toLowerCase() === 'p3')
    && columns.some((column) => column.toLowerCase() === (name === 'bmiExtended' ? 'p95' : 'p97'));
  if (headers.some((header) => !normalizedColumns.includes(header.toLowerCase())) || !hasRequiredPercentile
    || (name === 'bmiExtended' && !columns.includes('sigma'))) throw new Error(`${name}: unexpected CDC table format; data not replaced.`);
  tables[name] = lines.filter((line) => line.split(',')[0].trim().toLowerCase() !== columns[0].trim().toLowerCase()).map((line) => {
    const cells = line.split(',');
    return columns.map((column) => Number(cells[columns.indexOf(column)]));
  });
  if (!tables[name].length || tables[name].some((row) => row.some((value) => !Number.isFinite(value)))) throw new Error(`${name}: invalid numeric data; data not replaced.`);
}
const stamp = new Date().toISOString().slice(0, 10);
const out = `// CDC 2000 US Growth Charts and CDC 2022 Extended BMI data, official CSV rows; retrieved ${stamp}. See cdc-growth-sources.mjs.\nexport const cdcGrowthData = Object.freeze({\n${Object.entries(tables).map(([name, rows]) => `  ${name}: Object.freeze([\n${rows.map((row) => `    [${row.join(',')}],`).join('\n')}\n  ]),`).join('\n')}\n});\n`;
await writeFile(new URL('../../src/markets-no-ch/cdc-growth-data.mjs', import.meta.url), out);
const sourceFile = `export const childGrowthSource = Object.freeze({\n  referenceName: '2000 CDC Growth Charts for the United States',\n  retrievedAt: '${stamp}',\n  sources: Object.freeze([\n${[
  ['BMI-for-age LMS data (CDC)', files.bmi], ['Extended BMI-for-age data (CDC, 2022)', files.bmiExtended], ['Stature-for-age LMS data (CDC)', files.stature], ['Weight-for-age LMS data (CDC)', files.weight],
  ['CDC Growth Charts Data Files and method', 'https://www.cdc.gov/growthcharts/cdc-data-files.htm'], ['CDC material reuse terms', 'https://www.cdc.gov/other/agencymaterials.html'],
  ['CDC Growth Chart recommendations', 'https://www.cdc.gov/growth-chart-training/hcp/using-growth-charts/recommendations-and-rationale.html'],
].map(([name, url]) => `    Object.freeze({ name: '${name}', url: '${url}' }),`).join('\n')}\n  ]),\n});\n`;
await writeFile(new URL('../../src/markets-no-ch/cdc-growth-sources.mjs', import.meta.url), sourceFile);
console.log(`Refreshed ${Object.values(tables).reduce((count, rows) => count + rows.length, 0)} rows from official CDC files (${stamp}).`);
