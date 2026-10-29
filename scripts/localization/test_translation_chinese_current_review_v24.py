"""Every current v24 finding is source-bound and permanently covered, including old copy."""
import hashlib
import copy
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class ChineseCurrentReviewV24Test(unittest.TestCase):
    def test_all_current_forward_and_back_findings_have_exact_fixtures(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())}
        full = DATA/'run-context-v24-full.json'
        expected = 333 if full.exists() and json.loads(full.read_text())['complete'] else 67
        self.assertEqual(len(records), expected)
        reviews = [json.loads(p.read_text()) for p in DATA.glob('review-context-v24*.json')]
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

    def test_current_unproved_quantities_stay_hash_bound_and_cannot_approve(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())}
        registry = json.loads((DATA/'unproved-data-v24-full.json').read_text())
        actual = {identity for identity, row in records.items() if pilot.chinese_quantity_unproved_v24(row)}
        declared = {item['record_id'] for item in registry['rows']}
        self.assertEqual(len(declared), 51)
        self.assertEqual(declared, actual)
        for item in registry['rows']:
            row = records[item['record_id']]
            self.assertEqual(item['source_hash'], row['source_hash'])
            self.assertEqual(item['context'], row['context'])
            self.assertEqual(item['translation_hash'], hashlib.sha256(row['translation'].encode()).hexdigest())
            self.assertEqual(item['forward_trace_digest'], pilot.digest(row['forward_segments']))
            self.assertEqual(item['typed_evidence_digest'], pilot.digest(row['typed_data_evidence']))
        review = json.loads((DATA/'review-context-v24-full.json').read_text())
        pilot.audit_review_warnings(review, records)
        # 为什么 contains Numeric_Value on 什. The strict proof may reject it;
        # that is not permission to invent a bad linguistic score for Why.
        judgment = next(r for r in review['rows'] if r['key'] == 'dxf-viewer.faq.1.q')
        self.assertEqual(set(judgment['scores'].values()), {3})
        self.assertTrue(judgment['data_contract_unproved'])
        changed = copy.deepcopy(review)
        changed['full_gate']['zh-CN']['passed'] = True
        with self.assertRaises(ValueError):
            pilot.audit_review_warnings(changed, records)
        for suffix in [' 11', ' {intruder}']:
            row = copy.deepcopy(records[judgment['record_ids'][0]])
            row['translation'] += suffix
            row['raw_translation'] = row['translation']
            self.assertFalse(pilot.chinese_quantity_unproved_v24(row))



if __name__ == "__main__":
    unittest.main()
