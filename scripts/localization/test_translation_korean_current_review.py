"""Every independently observed current Korean error, including existing copy, stays tested."""
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'

class KoreanCurrentReviewTest(unittest.TestCase):
    def test_all_current_forward_and_back_findings_include_legacy_and_keep_exact_fixtures(self):
        records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v17/madlad.jsonl').read_text().splitlines())}
        reviews=[json.loads(p.read_text()) for p in DATA.glob('review-context-v17*.json')]
        self.assertGreaterEqual(len(reviews),2);seen=set()
        for review in reviews:
            self.assertEqual(review['expected_rows'],len(review['rows']));self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[])
            for j in review['rows']:
                for identity in j['record_ids']:
                    self.assertNotIn(identity,seen);seen.add(identity);r=records[identity]
                    self.assertEqual(j['source_hash'],r['source_hash']);self.assertEqual(j['translation_hash'],hashlib.sha256(r['translation'].encode()).hexdigest())
                    if min(j['scores'].values())<3:
                        with self.subTest(key=r['key'],candidate=r['candidate'],direction='forward'):
                            self.assertTrue(pilot.semantic_issues(r['key'],r['source_hash'],r['translation'],'ko'),'Observed forward defect has no permanent fixture')
            for b in review['back_findings']:
                r=records[b['record_id']];self.assertEqual(b['back_translation_hash'],hashlib.sha256(r['back_translation'].encode()).hexdigest())
                with self.subTest(key=r['key'],candidate=r['candidate'],direction='back'):
                    self.assertTrue(pilot.semantic_issues(r['key'],r['source_hash'],r['back_translation'],'ko','back'),'Observed backward defect has no permanent fixture')
        self.assertEqual(seen,set(records),'All current raw outputs must be reviewed before closing the lot')

if __name__=='__main__':unittest.main()
