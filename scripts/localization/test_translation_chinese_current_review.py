"""Every current v22 finding is source-bound and permanently covered, including old copy."""
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class ChineseCurrentReviewTest(unittest.TestCase):
    def test_all_current_forward_and_back_findings_have_exact_fixtures(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v22/madlad.jsonl').read_text().splitlines())}
        full = DATA/'run-context-v22-full.json'
        expected = 333 if full.exists() and json.loads(full.read_text())['complete'] else 67
        self.assertEqual(len(records), expected)
        reviews = [json.loads(p.read_text()) for p in DATA.glob('review-context-v22*.json')]
        self.assertGreaterEqual(len(reviews), 2)
        seen = set()
        for review in reviews:
            self.assertEqual(review['expected_rows'], len(review['rows']))
            self.assertFalse(review['native_review'])
            self.assertEqual(review['approved_locales'], [])
            for judgment in review['rows']:
                for identity in judgment['record_ids']:
                    self.assertNotIn(identity, seen)
                    seen.add(identity)
                    row = records[identity]
                    self.assertEqual(judgment['source_hash'], row['source_hash'])
                    self.assertEqual(judgment['translation_hash'], hashlib.sha256(row['translation'].encode()).hexdigest())
                    if min(judgment['scores'].values()) < 3:
                        with self.subTest(key=row['key'], candidate=row['candidate'], direction='forward'):
                            self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], 'zh-CN'), 'Observed forward defect has no exact permanent fixture')
            for finding in review['back_findings']:
                row = records[finding['record_id']]
                self.assertEqual(finding['back_translation_hash'], hashlib.sha256(row['back_translation'].encode()).hexdigest())
                with self.subTest(key=row['key'], candidate=row['candidate'], direction='back'):
                    self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['back_translation'], 'zh-CN', 'back'), 'Observed back finding has no exact permanent fixture')
        self.assertEqual(seen, set(records), 'Every current raw result must be read before the lot is closed')

    def test_all_unproved_current_contracts_stay_hash_bound_and_gate_blocked(self):
        records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v22/madlad.jsonl').read_text().splitlines())}
        registry=json.loads((DATA/'unproved-data-v22-references.json').read_text())
        self.assertEqual(registry['approved_locales'],[]);self.assertTrue(registry['gate_blocked'])
        expected={identity for identity,row in records.items() if pilot.chinese_quantity_unproved_v22(row)}
        self.assertEqual(len(expected),16)
        self.assertEqual({entry['record_id'] for entry in registry['rows']},expected)
        for entry in registry['rows']:
            row=records[entry['record_id']]
            self.assertEqual(entry['source_hash'],row['source_hash'])
            self.assertEqual(entry['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
            self.assertFalse(all(pilot.typed_record_evidence(row)['forward'].values()))
        for path in DATA.glob('review-context-v22*.json'):
            review=json.loads(path.read_text());self.assertFalse(review['reference_gate']['zh-CN']['passed'])
            for entry in review['warning_reconciliation']:
                for decision in entry['warnings'].values():
                    if decision['disposition']=='unproved-data':
                        self.assertIn(entry['record_id'],expected);self.assertTrue(decision['blocks_gate'])


if __name__ == '__main__':
    unittest.main()
