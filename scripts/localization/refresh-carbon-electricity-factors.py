#!/usr/bin/env python3
"""Refresh the static Swiss/Norwegian generation-intensity snapshot from Ember's open CSV."""
from __future__ import annotations
import csv
import io
import json
import urllib.request
from datetime import date
from pathlib import Path

URL = 'https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv'
OUT = Path(__file__).resolve().parents[2] / 'src/markets-no-ch/carbon-electricity-factors.mjs'
AREAS = {'Switzerland': 'CH', 'Norway': 'NO'}


def main() -> None:
    request = urllib.request.Request(URL, headers={'User-Agent': 'UsefulVerse local carbon-factor refresh'})
    with urllib.request.urlopen(request, timeout=45) as response:
        rows = csv.DictReader(io.StringIO(response.read().decode('utf-8-sig')))
        required = {'Area', 'Year', 'Electricity source', 'Is aggregated source', 'Emissions intensity (gCO2e/kWh)'}
        if not required.issubset(rows.fieldnames or []):
            raise SystemExit('Unexpected Ember CSV columns; output left untouched.')
        factors: dict[str, dict[str, float]] = {code: {} for code in AREAS.values()}
        for row in rows:
            code = AREAS.get(row.get('Area', ''))
            if code and row.get('Electricity source') == 'Total generation' and row.get('Is aggregated source') == 'True':
                try:
                    year = str(int(row['Year']))
                    value = float(row['Emissions intensity (gCO2e/kWh)'])
                except (TypeError, ValueError):
                    continue
                if value >= 0:
                    factors[code][year] = value
    if any(not years or max(map(int, years)) < 2025 for years in factors.values()):
        raise SystemExit('Ember data for both countries must include 2025 or later; output left untouched.')
    retrieved = date.today().isoformat()
    metadata = {
        'source': 'Ember · Yearly Electricity Data · Global CSV',
        'url': 'https://ember-energy.org/data/yearly-electricity-data/',
        'license': 'CC BY 4.0',
        'licenseUrl': 'https://ember-energy.org/creative-commons/',
        'datasetUrl': URL,
        'retrieved': retrieved,
        'sourceFileLastModified': '2026-09-15',
        'dataThrough': {code: max(map(int, years)) for code, years in factors.items()},
        'measure': 'Annual CO2e emissions intensity for total electricity generation (gCO2e/kWh); not a consumption-based grid factor and not lifecycle emissions.',
    }
    payload = json.dumps(factors, ensure_ascii=False, separators=(',', ':'))
    source = (
        '// Ember CC BY 4.0 yearly electricity generation emissions intensity; refreshed from the global CSV.\n'
        f'export const carbonElectricitySourceData = Object.freeze({json.dumps(metadata, ensure_ascii=False, separators=(",", ":"))});\n'
        f'export const carbonElectricityFactors = Object.freeze({payload});\n'
    )
    temp = OUT.with_suffix('.mjs.tmp')
    temp.write_text(source, encoding='utf-8')
    temp.replace(OUT)
    print(f"Wrote electricity factors through {metadata['dataThrough']} to {OUT}")


if __name__ == '__main__':
    main()
