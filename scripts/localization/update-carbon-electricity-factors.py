#!/usr/bin/env python3
"""Refresh the small CH/NO subset from Ember's free CC BY 4.0 global CSV."""

import csv
import io
import json
import re
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "src/markets-no-ch/carbon-electricity-factors.mjs"
SOURCE_PAGE = "https://ember-energy.org/data/yearly-electricity-data/"
CSV_URL = "https://files.ember-energy.org/public-downloads/generation/outputs/release_generation_yearly_global.csv"
COUNTRIES = {"Switzerland": "CH", "Norway": "NO"}
REQUIRED_HEADERS = {
    "Area", "Year", "Electricity source", "Is aggregated source",
    "Emissions intensity (gCO2e/kWh)",
}


def main():
    request = urllib.request.Request(CSV_URL, headers={"User-Agent": "UsefulVerse local data refresh/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        if response.status != 200:
            raise RuntimeError(f"Ember CSV returned HTTP {response.status}.")
        body = response.read()
        last_modified = response.headers.get("Last-Modified")

    content = body.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))
    missing = REQUIRED_HEADERS - set(reader.fieldnames or [])
    if missing:
        raise RuntimeError(f"Ember CSV schema changed; missing required columns: {', '.join(sorted(missing))}.")

    values = {code: {} for code in COUNTRIES.values()}
    for row in reader:
        code = COUNTRIES.get(row.get("Area", ""))
        if not code or row.get("Electricity source") != "Total generation" or row.get("Is aggregated source", "").lower() != "true":
            continue
        try:
            year = int(row["Year"])
            factor = float(row["Emissions intensity (gCO2e/kWh)"])
        except (TypeError, ValueError):
            continue
        if year >= 2000 and factor >= 0:
            values[code][str(year)] = round(factor, 3)

    for code, years in values.items():
        if len(years) < 20 or max(map(int, years)) < 2025:
            raise RuntimeError(f"Ember returned incomplete {code} data; preserving the existing factor file.")
        numeric_years = sorted(map(int, years))
        if numeric_years[0] > 2000 or numeric_years != list(range(numeric_years[0], numeric_years[-1] + 1)):
            raise RuntimeError(f"Ember returned a discontinuous year series for {code}; preserving the existing factor file.")
    if sorted(values["CH"]) != sorted(values["NO"]):
        raise RuntimeError("Ember returned mismatched CH/NO year coverage; preserving the existing factor file.")

    if not last_modified:
        raise RuntimeError("Ember CSV did not send Last-Modified; preserving the existing factor file.")
    source_modified = parsedate_to_datetime(last_modified).astimezone(timezone.utc).date().isoformat()
    existing = OUTPUT.read_text(encoding="utf-8") if OUTPUT.exists() else ""
    previous_date = re.search(r"Source file Last-Modified: (\d{4}-\d{2}-\d{2})", existing)
    if previous_date and source_modified < previous_date.group(1):
        raise RuntimeError(f"Ember served an older CSV ({source_modified}) than the local factors ({previous_date.group(1)}); preserving the existing file.")
    retrieved = datetime.now(timezone.utc).date().isoformat()
    metadata = {
        "csvUrl": CSV_URL,
        "sourcePage": SOURCE_PAGE,
        "license": "CC BY 4.0",
        "licenseUrl": "https://ember-energy.org/creative-commons/",
        "metric": "Emissions intensity (gCO2e/kWh), Total generation, aggregated source",
        "sourceFileLastModified": source_modified,
        "retrieved": retrieved,
        "dataThrough": {code: max(map(int, years)) for code, years in values.items()},
    }
    output = (
        "// Ember Yearly Electricity Data (global CSV), filtered to Switzerland and Norway. "
        "Emissions intensity (gCO2e/kWh) on aggregated Total generation rows; CC BY 4.0. "
        f"Source file Last-Modified: {source_modified}; retrieved: {retrieved}. "
        f"{SOURCE_PAGE} | {metadata['licenseUrl']}\n"
        f"export const carbonElectricityFactors = Object.freeze({json.dumps(values, separators=(',', ':'))});\n"
        f"export const carbonElectricitySourceData = Object.freeze({json.dumps(metadata, separators=(',', ':'))});\n"
    )
    OUTPUT.write_text(output, encoding="utf-8")
    print(f"Updated CH/NO Ember factors from the free CSV; file date {source_modified}, retrieved {retrieved}; years through CH {metadata['dataThrough']['CH']} / NO {metadata['dataThrough']['NO']}.")


if __name__ == "__main__":
    main()
