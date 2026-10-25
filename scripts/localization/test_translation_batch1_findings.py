"""Every directly observed defect remains bound to the exact original evidence."""
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'

class Batch1FindingsTest(unittest.TestCase):
    def test_all_observed_forward_and_additional_back_defects_are_permanent(self):
        findings = json.loads((DATA / 'batch1-observed-findings.json').read_text())
        self.assertFalse(findings['native_review'])
        self.assertEqual(findings['approved_locales'], [])
        self.assertEqual(findings['read_records'], 402)
        records = {row['record_id']: row for engine in ['madlad', 'm2m100'] for row in map(json.loads, (DATA / f'checkpoints/{engine}.jsonl').read_text().splitlines())}
        for case in findings['cases']:
            for identity in case['observed_record_ids']:
                row = records[identity]
                with self.subTest(locale=row['locale'], key=row['key'], candidate=row['candidate'], engine=row['engine'], direction=case['direction']):
                    field = 'translation' if case['direction'] == 'forward' else 'back_translation'
                    self.assertEqual(case['translation'], row[field])
                    self.assertEqual(case['source_hash'], row['source_hash'])
                    self.assertEqual(case['locale'], row['locale'])
                    self.assertEqual(case['key'], row['key'])
                    self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row[field], row['locale'], case['direction']), 'Observed exact defect must be detected')

if __name__ == '__main__':
    unittest.main()
