"""Every current Indonesian v19 finding is source-bound and permanently covered, including old copy."""
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class IndonesianCurrentReviewTest(unittest.TestCase):
    def test_failed_references_cannot_dispatch_full_or_approve_a_language(self):
        decision=json.loads((DATA/'reference-v19-gate-decision.json').read_text())
        self.assertFalse(decision['full_dispatched'])
        self.assertEqual(decision['approved_locales'],[])
        self.assertFalse((DATA/'run-context-v19-full.json').exists())
        review=json.loads((DATA/'review-context-v19-references.json').read_text())
        self.assertFalse(review['reference_gate']['id']['passed'])
        self.assertEqual(decision['reference_gate'],review['reference_gate']['id'])
        keys={row['key'] for row in review['rows'] if min(row['scores'].values())<3}
        self.assertEqual(keys,set(decision['forward_defect_keys']))
        self.assertEqual(len(keys),7)

    def test_all_current_forward_and_back_findings_have_exact_fixtures(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v19/madlad.jsonl').read_text().splitlines())}
        self.assertEqual(len(records), 67)
        reviews = [json.loads(p.read_text()) for p in DATA.glob('review-context-v19*.json')]
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
                            self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], 'id'), 'Observed forward defect has no exact permanent fixture')
            for finding in review['back_findings']:
                row = records[finding['record_id']]
                self.assertEqual(finding['back_translation_hash'], hashlib.sha256(row['back_translation'].encode()).hexdigest())
                with self.subTest(key=row['key'], candidate=row['candidate'], direction='back'):
                    self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['back_translation'], 'id', 'back'), 'Observed back finding has no exact permanent fixture')
        self.assertEqual(seen, set(records), 'Every current raw result must be read before the lot is closed')


if __name__ == '__main__':
    unittest.main()
