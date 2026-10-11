import { readFile, writeFile } from 'node:fs/promises';

const repairsByTool = {
  'retaining-wall-calculator': [
    ['it', 'actions', 'reset', 'Reimposta'],
    ['ca', 'actions', 'meters', 'Metres'],
    ['nl', 'actions', 'reset', 'Opnieuw instellen'],
  ],
  'battery-runtime-calculator': [
    ['it', 'actions', 'calculate', 'Calcola autonomia'],
    ['it', 'actions', 'reset', 'Reimposta'],
    ['nl', 'actions', 'reset', 'Opnieuw instellen'],
  ],
  'lumber-cut-calculator': [
    ['it', 'actions', 'reset', 'Reimposta'],
    ['nl', 'actions', 'reset', 'Opnieuw instellen'],
    ['nl', 'actions', 'millimeters', 'Millimeter (mm)'],
    ['nl', 'actions', 'centimeters', 'Centimeter (cm)'],
    ['nl', 'actions', 'meters', 'Meter (m)'],
  ],
  'plant-spacing-calculator': [
    ['it', 'actions', 'reset', 'Reimposta'],
    ['nl', 'actions', 'reset', 'Opnieuw instellen'],
    ['nl', 'actions', 'meters', 'Meter (m)'],
    ['nl', 'actions', 'centimeters', 'Centimeter (cm)'],
    ['nl', 'actions', 'millimeters', 'Millimeter (mm)'],
  ],
};

for (const [toolId, repairs] of Object.entries(repairsByTool)) {
  const path = new URL(`../../src/growth600/locales/${toolId}-final.mjs`, import.meta.url);
  const source = await readFile(path, 'utf8');
  const { default: copies } = await import(`${path.href}?repair=${Date.now()}`);
  for (const [locale, section, key, value] of repairs) {
    if (typeof copies[locale]?.[section]?.[key] !== 'string') {
      throw new Error(`Missing expected copy key: ${toolId} ${locale}.${section}.${key}`);
    }
    copies[locale][section][key] = value;
  }
  const comment = source.match(/^\/\/.*\n/u)?.[0] ?? '';
  await writeFile(path, `${comment}export default Object.freeze(${JSON.stringify(copies)});\n`);
}

console.log(`Applied machine-translation cleanup to ${Object.keys(repairsByTool).length} Growth600 locale modules.`);
