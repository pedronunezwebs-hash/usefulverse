#!/usr/bin/env python3
"""Export one review CSV per destination locale from the local translation queue.

Every exported row keeps its stable key, source hash, placeholder signature inputs,
and current status. Machine output is never approved by this exporter.
"""

from __future__ import annotations

import argparse
import csv
import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB_PATH = ROOT / ".translation-data/translation-memory.sqlite3"
EXPECTED_LOCALES = {
    "am", "ar", "bg", "bn", "ca", "de", "el", "es", "fa", "fil", "fr", "gu",
    "ha", "hi", "id", "it", "ja", "ko", "mr", "ms", "nb-NO", "nl", "pl",
    "pt-BR", "ru", "sv", "sw", "ta", "te", "th", "tr", "uk", "ur", "vi",
    "zh-CN", "zh-TW",
}
REQUIRED_AUXILIARY_PACKS = {"growth-tool-chrome"}
FIELDS = [
    "locale", "key", "context", "source_en", "translation", "status",
    "source_hash", "engine", "reviewer", "reviewed_at", "review_note",
]
REVIEW_QUERY = """WITH latest_review AS (
                    SELECT locale,key,source_hash,max(id) AS id
                    FROM review_events GROUP BY locale,key,source_hash
                  )
                  SELECT s.locale,s.key,s.context,s.source,s.translation,s.status,s.source_hash,s.engine,
                         coalesce(r.reviewer,''),coalesce(r.reviewed_at,''),coalesce(r.review_note,'')
                  FROM strings s
                  LEFT JOIN latest_review latest
                    ON latest.locale=s.locale AND latest.key=s.key AND latest.source_hash=s.source_hash
                  LEFT JOIN review_events r ON r.id=latest.id"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--database", type=Path, default=DB_PATH)
    parser.add_argument("--output", type=Path, default=ROOT / ".translation-data/review-packets-by-tool")
    parser.add_argument("--group-by", choices=("tool", "locale"), default="tool")
    args = parser.parse_args()
    if not args.database.is_file():
        raise SystemExit(f"Translation database not found: {args.database}")

    args.output.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(f"file:{args.database.resolve()}?mode=ro", uri=True)
    actual = {row[0] for row in db.execute("SELECT DISTINCT locale FROM strings")}
    if actual != EXPECTED_LOCALES:
        raise SystemExit(
            f"Locale set mismatch; expected {len(EXPECTED_LOCALES)}, found "
            f"{len(actual)}. Missing={sorted(EXPECTED_LOCALES - actual)} "
            f"Unexpected={sorted(actual - EXPECTED_LOCALES)}"
        )
    db.execute("BEGIN")
    snapshot_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    queue_status_counts = {
        status: count for status, count in db.execute(
            "SELECT status,count(*) FROM strings GROUP BY status ORDER BY status"
        )
    }

    manifest = {
        "groupBy": args.group_by,
        "snapshotAtUtc": snapshot_at,
        "productLocaleCount": 37,
        "sourceLocale": "en",
        "reviewLocaleCount": len(actual),
        "locales": sorted(actual),
        "queueRows": sum(queue_status_counts.values()),
        "queueStatusCounts": queue_status_counts,
        "sourceStringsIncludingExcludedQueuePrefixes": db.execute(
            "SELECT count(DISTINCT key) FROM strings"
        ).fetchone()[0],
        "norwegianQueueStatusCounts": {
            status: count for status, count in db.execute(
                "SELECT status,count(*) FROM strings WHERE locale='nb-NO' GROUP BY status ORDER BY status"
            )
        },
        "teluguQueueStatusCounts": {
            status: count for status, count in db.execute(
                "SELECT status,count(*) FROM strings WHERE locale='te' GROUP BY status ORDER BY status"
            )
        },
        "packages": {},
    }
    with (ROOT / "docs/planning/usefulverse-1000-2026-10-19/300-candidatas.tsv").open(encoding="utf-8", newline="") as handle:
        candidate_rows = list(csv.DictReader(handle, delimiter="\t"))
    candidate_slugs = {row["slug"] for row in candidate_rows}
    queued_slugs = {
        row[0] for row in db.execute(
            "SELECT DISTINCT substr(key,1,instr(key,'.')-1) FROM strings WHERE instr(key,'.')>0"
        )
    }
    available = candidate_slugs & queued_slugs
    available_auxiliary = REQUIRED_AUXILIARY_PACKS & queued_slugs
    review_slugs = available | available_auxiliary
    manifest["candidateTools"] = len(candidate_slugs)
    manifest["availableCandidatePackets"] = len(available)
    manifest["missingCandidateSourcePackets"] = sorted(candidate_slugs - queued_slugs)
    manifest["requiredAuxiliaryPacks"] = sorted(REQUIRED_AUXILIARY_PACKS)
    manifest["availableAuxiliaryPackets"] = sorted(available_auxiliary)
    manifest["missingAuxiliarySourcePackets"] = sorted(REQUIRED_AUXILIARY_PACKS - queued_slugs)
    manifest["targetReviewPacketsAfterAllCandidates"] = len(candidate_slugs) + len(REQUIRED_AUXILIARY_PACKS)
    manifest["nonCandidateQueuePrefixesExcluded"] = sorted(queued_slugs - candidate_slugs - REQUIRED_AUXILIARY_PACKS)
    manifest["excludedQueueRows"] = sum(
        db.execute("SELECT count(*) FROM strings WHERE key LIKE ?", (f"{slug}.%",)).fetchone()[0]
        for slug in queued_slugs - candidate_slugs - REQUIRED_AUXILIARY_PACKS
    )
    manifest["availableReviewPackets"] = len(review_slugs)
    if args.group_by == "tool":
        groups = [(slug, (f"{slug}.%",)) for slug in sorted(available | available_auxiliary)]
    else:
        groups = [(locale, (locale,)) for locale in sorted(actual)]

    if args.group_by == "tool":
        writers = {}
        handles = []
        for slug, _ in groups:
            path = args.output / f"{slug}.csv"
            handle = path.open("w", encoding="utf-8-sig", newline="")
            handles.append(handle)
            writer = csv.writer(handle)
            writer.writerow(FIELDS)
            writers[slug] = {"writer": writer, "path": path, "rows": 0, "statusCounts": {}}
        try:
            # Scan by locale once, then route each stable-key row to its tool packet.
            # This avoids 291 full-table scans of the 557k-row queue.
            for locale in sorted(actual):
                for row in db.execute(f"{REVIEW_QUERY} WHERE s.locale=? ORDER BY s.key", (locale,)):
                    slug = row[1].partition(".")[0]
                    target = writers.get(slug)
                    if target is None:
                        continue
                    target["writer"].writerow(row)
                    target["rows"] += 1
                    target["statusCounts"][row[5]] = target["statusCounts"].get(row[5], 0) + 1
        finally:
            for handle in handles:
                handle.close()
        for slug, target in writers.items():
            manifest["packages"][slug] = {
                "file": target["path"].name,
                "rows": target["rows"],
                "statusCounts": target["statusCounts"],
            }
    else:
        for locale in sorted(actual):
            path = args.output / f"{locale}.csv"
            rows = db.execute(f"{REVIEW_QUERY} WHERE s.locale=? ORDER BY s.key", (locale,))
            counts: dict[str, int] = {}
            row_count = 0
            with path.open("w", encoding="utf-8-sig", newline="") as handle:
                writer = csv.writer(handle)
                writer.writerow(FIELDS)
                for row in rows:
                    if row[1].partition(".")[0] not in review_slugs:
                        continue
                    writer.writerow(row)
                    row_count += 1
                    counts[row[5]] = counts.get(row[5], 0) + 1
            manifest["packages"][locale] = {"file": path.name, "rows": row_count, "statusCounts": counts}

    db.close()
    (args.output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    grouping = (
        "un candidato por archivo; cada paquete incluye sus 36 idiomas destino"
        if args.group_by == "tool" else "un idioma de destino por archivo; cada CSV incluye todos los candidatos disponibles"
    )
    readme = (
        "# Paquetes de revisión de traducción\n\n"
        f"Este directorio contiene {grouping}. El inglés es la fuente canónica; "
        "cada fila contiene `source_en` y el idioma destino de `locale`. `manifest.json` "
        "registra las candidatas y los paquetes auxiliares sin fuente de copia.\n\n"
        "## Revisión\n\n"
        "1. Filtra `key` por el prefijo de la herramienta y revisa el inglés junto al borrador.\n"
        "2. Corrige la traducción completa. Si `translation` está vacía, traduce esa fila.\n"
        "3. Solo tras revisar de verdad, cambia `status` a `approved`, indica `reviewer` y "
        "`reviewed_at` con fecha ISO `AAAA-MM-DD`; añade una nota si ayuda.\n"
        "4. Conserva `locale`, `key`, `source_hash` y las demás columnas.\n"
        "5. Importa un CSV revisado con `python3 scripts/localization/translation-queue.py "
        "review-import RUTA.csv`, o toda la carpeta después de revisar varios paquetes. "
        "El importador procesa solo filas con `status=approved`; las filas caducadas, "
        "con marcadores rotos o sin procedencia se rechazan.\n\n"
        "Las filas Telugu (`te`) que sigan vacías o pendientes están bloqueadas: revisa "
        "primero por una persona la muestra de 16 filas en "
        "`.translation-data/review-telugu-pilot.csv`. No generes el resto de Telugu antes "
        "de completar esa revisión piloto.\n\n"
        "El exportador nunca aprueba traducciones. Los borradores automáticos no son "
        "traducciones aprobadas; el gate de publicación seguirá cerrado hasta que se "
        "revise cada fila exigida en los 36 idiomas y se integren los paquetes. "
        "La identidad de quien revisa se autodeclara en el CSV y el importador no la autentica.\n"
    )
    (args.output / "REVIEW-README.md").write_text(readme, encoding="utf-8")
    print(json.dumps({"output": str(args.output), "groupBy": args.group_by, "packages": len(groups), "rows": sum(v["rows"] for v in manifest["packages"].values()), "missingCandidateSourcePackets": manifest.get("missingCandidateSourcePackets", [])}, ensure_ascii=False))


if __name__ == "__main__":
    main()
