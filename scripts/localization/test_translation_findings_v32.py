"""Current review coverage and exact inherited defect bindings."""
import copy
import hashlib
import json
import unittest
from test_translation_pilot import pilot

DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class FindingsV32Test(unittest.TestCase):
    def records(self):
        return {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v32/madlad.jsonl').read_text().splitlines())}

    def test_all_current_records_and_every_warning_have_current_reviews(self):
        records = self.records()
        seen = set()
        for file in DATA.glob('review-context-v32-*.json'):
            review = json.loads(file.read_text())
            pilot.audit_review_warnings(review, records)
            for judgment in review['rows']:
                for identity in judgment['record_ids']:
                    self.assertNotIn(identity, seen)
                    seen.add(identity)
        self.assertEqual(len(seen), 333)
        self.assertEqual(seen, set(records))

    def test_current_back_bindings_reuse_only_exact_observed_source_forward_back(self):
        records = self.records()
        prior_records = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v31/madlad.jsonl').read_text().splitlines())}
        prior = json.loads((DATA / 'scoped-back-regressions-v31.json').read_text())['cases']
        current = json.loads((DATA / 'scoped-back-regressions-v32.json').read_text())
        self.assertFalse(current['native_review'])
        self.assertEqual(current['approved_locales'], [])
        for case in current['cases']:
            if case['source_case_policy'] == 'context-v32':
                self.assertEqual(case['key'], 'dxf-viewer.example')
                prior_row = records[case['observed_record_ids'][0]]
                self.assertIn('signed as drawing units', prior_row['back_translation'])
            else:
                old = next(c for c in prior if (c['key'], c['forward_digest'], c['back_translation_hash']) == (case['key'], case['forward_digest'], case['back_translation_hash']))
                prior_row = prior_records[old['observed_record_ids'][0]]
                self.assertEqual(case['source_case_policy'], 'context-v31')
            self.assertFalse(case['blocks_gate'])
            self.assertEqual(case['direction'], 'back')
            self.assertEqual(hashlib.sha256(case['back_translation'].encode()).hexdigest(), case['back_translation_hash'])
            for identity in case['observed_record_ids']:
                row = records[identity]
                self.assertEqual(row['inference_policy'], 'context-v32')
                for field in ['key', 'locale', 'source_hash', 'source', 'translation', 'back_translation']:
                    self.assertEqual(row[field], prior_row[field])

    def test_known_current_forward_defects_cannot_be_regraded_as_passed(self):
        records = self.records()
        full = json.loads((DATA / 'review-context-v32-full-legacy.json').read_text())
        for key in ['voice-changer.example', 'voice-changer.limitsHeading']:
            review = copy.deepcopy(full)
            review['rows'] = [j for j in review['rows'] if j['key'] == key]
            self.assertEqual(len(review['rows']), 1)
            ids = set(review['rows'][0]['record_ids'])
            review['warning_reconciliation'] = [w for w in review['warning_reconciliation'] if w['record_id'] in ids]
            review['expected_rows'] = 1
            review['requires_complete_model_warning_coverage'] = False
            pilot.audit_review_warnings(review, records, check_coverage=False)
            review['rows'][0]['scores'] = dict(meaning=3, numbers_negations=3, naturalness=3)
            review['full_gate']['ru']['passed'] = True
            with self.subTest(key=key), self.assertRaises(ValueError):
                pilot.audit_review_warnings(review, records, check_coverage=False)
