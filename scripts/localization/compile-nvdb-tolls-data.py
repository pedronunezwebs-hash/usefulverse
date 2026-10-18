#!/usr/bin/env python3
"""Compile the openly licensed Statens vegvesen toll-station CSV for local use."""
import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / "src/markets-no-ch/data/nvdb-toll-stations-4326-2026-10-17.csv"
OUTPUT = ROOT / "src/markets-no-ch/norway-toll-stations-data.mjs"
AS_OF = date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else date(2026, 10, 17)


def value(row, prefix):
    return next((v for k, v in row.items() if k.startswith(prefix)), "")


def number(raw):
    raw = (raw or "").strip().replace(" ", "").replace(",", ".")
    return float(raw) if raw else None


def point(raw):
    match = re.fullmatch(r"POINT(?: Z)?\(\s*([-\d.]+)\s+([-\d.]+)(?:\s+[-\d.]+)?\s*\)", raw or "")
    if not match:
        return None
    # NVDB export emits latitude first in POINT Z when srid=4326 is requested.
    lat, lon = map(float, match.groups())
    if not (-180 <= lon <= 180 and -90 <= lat <= 90):
        return None
    return [round(lat, 7), round(lon, 7)]


with SOURCE.open(encoding="utf-8-sig", newline="") as file:
    rows = csv.DictReader(file, delimiter=";")
    stations = []
    for row in rows:
        if row.get("EGS.BOMSTASJONSTYPE.9390") != "AutoPASS bomstasjon":
            continue
        start = row.get("OBJ.STARTDATO", "")
        end = row.get("OBJ.SLUTTDATO", "")
        if start and date.fromisoformat(start[:10]) > AS_OF:
            continue
        if end and date.fromisoformat(end[:10]) < AS_OF:
            continue
        geo = point(value(row, "GEO.GEOMETRI"))
        base_small = number(value(row, "EGS.TAKST LITEN BIL (KR)."))
        base_large = number(value(row, "EGS.TAKST STOR BIL (KR)."))
        if not geo or (base_small is None and base_large is None):
            continue
        stations.append({
            "id": row.get("OBJ.VEGOBJEKT-ID", ""),
            "name": value(row, "EGS.NAVN BOMSTASJON."),
            "project": value(row, "EGS.NAVN BOMPENGEANLEGG."),
            "municipality": row.get("LOK.KOMMUNE", ""),
            "county": row.get("LOK.FYLKE", ""),
            "operator": value(row, "EGS.LENKE TIL BOMSTASJON."),
            "direction": value(row, "EGS.INNKREVNINGSRETNING."),
            "roadRef": row.get("VSR.VEGSYSTEMREFERANSE", ""),
            "location": geo,
            "baseSmallNok": base_small,
            "baseSmallElectricNok": number(value(row, "EGS.TAKST LITEN ELBIL (KR).")),
            "baseLargeNok": base_large,
            "rushSmallNok": number(value(row, "EGS.RUSHTIDSTAKST LITEN BIL (KR).")),
            "rushSmallElectricNok": number(value(row, "EGS.RUSHTIDSTAKST LITEN ELBIL (KR).")),
            "rushLargeNok": number(value(row, "EGS.RUSHTIDSTAKST STOR BIL (KR).")),
            "rushMorningFrom": value(row, "EGS.RUSHTID MORGEN, FRA."),
            "rushMorningTo": value(row, "EGS.RUSHTID MORGEN, TIL."),
            "rushEveningFrom": value(row, "EGS.RUSHTID ETTERMIDDAG, FRA."),
            "rushEveningTo": value(row, "EGS.RUSHTID ETTERMIDDAG, TIL."),
            "timeDifferentiated": value(row, "EGS.TIDSDIFFERENSIERT TAKST."),
            "hourRule": value(row, "EGS.TIMESREGEL."),
            "hourRuleMinutes": number(value(row, "EGS.TIMESREGEL, VARIGHET (MIN).")),
            "passageGroup": value(row, "EGS.TIMESREGEL, PASSERINGSGRUPPE."),
            "objectStartDate": start,
            "objectModifiedAt": row.get("OBJ.SIST MODIFISERT", ""),
        })

stations.sort(key=lambda station: (station["municipality"], station["project"], station["name"], station["id"]))
metadata = {
    "asOf": AS_OF.isoformat(),
    "source": f"Statens vegvesen, NVDB object type 45 (Bomstasjon), fetched from the official export endpoint with srid=4326 from {SOURCE.name}",
    "license": "Norwegian Licence for Open Government Data (NLOD)",
    "licenseUrl": "https://data.norge.no/nlod/no",
    "attribution": "Source: Statens vegvesen (NVDB). Data retrieved 2026-10-17; reused under NLOD.",
    "count": len(stations),
}
OUTPUT.write_text(
    "// Static derivative of an official openly licensed dataset; refresh with the compiler script.\n"
    + f"export const norwayTollDataMetadata = Object.freeze({json.dumps(metadata, ensure_ascii=False)});\n"
    + f"export const norwayTollStations = Object.freeze({json.dumps(stations, ensure_ascii=False, separators=(',', ':'))}.map((row) => Object.freeze(row)));\n",
    encoding="utf-8",
)
print(f"Wrote {len(stations)} stations to {OUTPUT.name}; data date {AS_OF}.")
