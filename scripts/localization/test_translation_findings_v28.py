"""Direct current findings cannot disappear from exact permanent regressions."""
import importlib.util
import json
from pathlib import Path
import unittest

sp = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(sp); sp.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class FindingsV28Test(unittest.TestCase):
    def test_all_direct_findings_bind_actual_original_records_and_permanent_cases(self):
        findings = json.loads((DATA / 'findings-v28.json').read_text())
        self.assertFalse(findings['native_review'])
        self.assertEqual(findings['approved_locales'], [])
        records = {r['record_id']: r for file in (DATA / 'checkpoints').rglob('*.jsonl') for r in map(json.loads, file.read_text().splitlines())}
        for case in findings['cases']:
            for identity in case['observed_record_ids']:
                row = records[identity]
                with self.subTest(key=row['key'], direction=case['direction'], identity=identity):
                    field = 'translation' if case['direction'] == 'forward' else 'back_translation'
                    self.assertEqual(case['translation'], row[field])
                    for field in ['key', 'source_hash', 'locale']: self.assertEqual(case[field], row[field])
                    self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], case['translation'], row['locale'], case['direction']))

    def test_current_reviews_have_complete_warning_coverage_and_no_release_approval(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v28/madlad.jsonl').read_text().splitlines())}
        for name in ['references', 'legacy']:
            review = json.loads((DATA / f'review-context-v28-{name}.json').read_text())
            self.assertFalse(review['native_review']); self.assertEqual(review['approved_locales'], [])
            pilot.audit_review_warnings(review, records)
            for row in review['rows']:
                if min(row['scores'].values()) < 3:
                    raw = records[row['record_ids'][0]]
                    self.assertTrue(pilot.semantic_issues(raw['key'], raw['source_hash'], raw['translation'], 'bn'))


if __name__ == '__main__': unittest.main()
