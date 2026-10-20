import csv
import hashlib
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from contextlib import closing
from pathlib import Path


SCRIPT = Path(__file__).with_name("translation-queue.py")
EXPORTER = Path(__file__).with_name("export-approved-tool-copy.mjs")
LOCALES = ["es", "fr", "pt-BR", "de", "ja", "ko", "id", "hi", "ar", "zh-CN", "bn", "ru", "ur", "tr", "vi", "it", "zh-TW", "bg", "ca", "nl", "el", "ms", "pl", "sv", "th", "uk", "sw", "mr", "ha", "fil", "ta", "fa", "am", "gu", "nb-NO", "te"]


class ReviewProvenanceTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.db_path = self.root / "queue.sqlite3"
        self.env = {**os.environ, "USEFULVERSE_TRANSLATION_DB": str(self.db_path)}
        self.source_path = self.root / "units.json"
        self.source_path.write_text(json.dumps({"toolId": "demo", "units": [{
            "key": "demo.title", "source": "Coloring studio", "context": "Page title"
        }]}), encoding="utf-8")
        self.run_cli("extract", str(self.source_path))
        with closing(sqlite3.connect(self.db_path)) as db, db:
            db.execute("UPDATE strings SET translation='Atelier de coloriage',status='translated' WHERE locale='fr' AND key='demo.title'")

    def tearDown(self):
        self.temp.cleanup()

    def run_cli(self, *args):
        return subprocess.run([sys.executable, str(SCRIPT), *args], env=self.env, check=True, capture_output=True, text=True)

    def review_csv(self, reviewer="", reviewed_at="", review_note=""):
        export_path = self.root / "review.csv"
        self.run_cli("review-export", str(export_path))
        with export_path.open(encoding="utf-8-sig", newline="") as handle:
            reader = csv.DictReader(handle)
            rows = list(reader)
            fields = reader.fieldnames
        row = next(item for item in rows if item["locale"] == "fr" and item["key"] == "demo.title")
        row.update(status="approved", reviewer=reviewer, reviewed_at=reviewed_at, review_note=review_note)
        with export_path.open("w", encoding="utf-8-sig", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=fields)
            writer.writeheader()
            writer.writerow(row)
        return export_path

    def draft_jsonl(self, records):
        path = self.root / "drafts.jsonl"
        path.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in records), encoding="utf-8")
        return path

    def test_importing_existing_locale_copy_keeps_it_as_a_draft_and_checks_markers(self):
        path = self.draft_jsonl([
            {"locale": "es", "key": "demo.title", "source": "Coloring studio", "translation": "Estudio de pintura"},
            {"locale": "de", "key": "demo.title", "source": "Coloring studio", "translation": "Studio {name}"},
            {"locale": "fr", "key": "missing.key", "source": "Coloring studio", "translation": "Atelier"},
        ])
        result = json.loads(self.run_cli("import-drafts", str(path)).stdout)
        self.assertEqual(result["drafts_imported"], 1)
        self.assertEqual(result["marker_or_empty_issues"], 1)
        self.assertEqual(result["missing_queue_keys"], 1)
        self.assertEqual(result["approved_by_import"], 0)
        with closing(sqlite3.connect(self.db_path)) as db:
            rows = dict(db.execute("SELECT locale,status FROM strings WHERE key='demo.title' AND locale IN ('es','de')"))
        self.assertEqual(rows, {"es": "translated", "de": "needs-review"})

    def test_importing_a_draft_never_overwrites_an_approved_translation(self):
        with closing(sqlite3.connect(self.db_path)) as db, db:
            db.execute("UPDATE strings SET status='approved',translation='Atelier de coloriage' WHERE locale='fr' AND key='demo.title'")
        path = self.draft_jsonl([{
            "locale": "fr", "key": "demo.title", "source": "Coloring studio", "translation": "Atelier de coloriage",
        }])
        result = json.loads(self.run_cli("import-drafts", str(path)).stdout)
        self.assertEqual(result["human_approved_rows_preserved"], 1)
        self.assertEqual(result["approved_by_import"], 0)
        with closing(sqlite3.connect(self.db_path)) as db:
            status = db.execute("SELECT status FROM strings WHERE locale='fr' AND key='demo.title'").fetchone()[0]
        self.assertEqual(status, "approved")

    def test_approval_requires_reviewer_and_valid_date_and_retains_provenance(self):
        missing_path = self.review_csv()
        missing = json.loads(self.run_cli("review-import", str(missing_path)).stdout)
        self.assertEqual(missing["approved_imported"], 0)
        self.assertEqual(missing["missing_review_provenance_skipped"], 1)

        invalid_date_path = self.review_csv("reviewer-1", "2026-2-3", "Checked meaning and tone")
        invalid_date = json.loads(self.run_cli("review-import", str(invalid_date_path)).stdout)
        self.assertEqual(invalid_date["approved_imported"], 0)
        self.assertEqual(invalid_date["missing_review_provenance_skipped"], 1)

        valid_path = self.review_csv("reviewer-1", "2026-10-19", "Checked meaning and tone")
        valid = json.loads(self.run_cli("review-import", str(valid_path)).stdout)
        self.assertEqual(valid["approved_imported"], 1)
        with closing(sqlite3.connect(self.db_path)) as db, db:
            status = db.execute("SELECT status FROM strings WHERE locale='fr' AND key='demo.title'").fetchone()[0]
            provenance = db.execute("SELECT reviewer,reviewed_at,review_note FROM review_events WHERE locale='fr' AND key='demo.title'").fetchone()
        self.assertEqual(status, "approved")
        self.assertEqual(provenance, ("reviewer-1", "2026-10-19", "Checked meaning and tone"))

    def test_export_preserves_reviewers_without_claiming_site_owner_approval(self):
        source = "Coloring studio"
        source_hash = hashlib.sha256(source.encode("utf-8")).hexdigest()
        with closing(sqlite3.connect(self.db_path)) as db, db:
            for locale in LOCALES:
                db.execute("UPDATE strings SET status='approved',translation=?,engine='human-reviewed' WHERE locale=? AND key='demo.title'", (f"{locale} title",locale))
                db.execute("INSERT INTO review_events(locale,key,source_hash,reviewer,reviewed_at,review_note) VALUES(?,?,?,?,?,?)", (locale,"demo.title",source_hash,"reviewer-1","2026-10-19","Checked meaning and tone"))
        source_path = self.root / "source-copy.json"
        source_path.write_text(json.dumps({"sourceCopy":{"title":"Demo","description":"Description"},"units":[{"key":"demo.title","source":source}]}), encoding="utf-8")
        output_path = self.root / "locale-copy.mjs"
        subprocess.run(["node", str(EXPORTER), str(source_path), "demo", str(output_path)], env=self.env, check=True, capture_output=True, text=True)
        module_source = output_path.read_text(encoding="utf-8")
        payload = json.loads(module_source.removeprefix("// Exported from the approved local translation queue. Source and placeholder hashes were checked at export.\nexport default Object.freeze(").removesuffix(");\n"))
        self.assertEqual(len(payload), 37)
        self.assertEqual(payload["fr"]["localizationStatus"], "human-reviewed")
        self.assertEqual(payload["fr"]["localizationReviewers"], ["reviewer-1"])
        self.assertEqual(payload["fr"]["localizationLastReviewedAt"], "2026-10-19")
        self.assertNotIn("localizationAcceptedBy", payload["fr"])


if __name__ == "__main__":
    unittest.main()
