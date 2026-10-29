"""Independent Korean current review includes legacy errors in permanent regressions."""
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)

class KoreanReviewTest(unittest.TestCase):
    def test_every_observed_korean_forward_and_back_defect_keeps_a_fixture(self):
        directory=pilot.ROOT/'docs/quality/translation-pilot'
        reviews=[json.loads((directory/name).read_text()) for name in ['review-context-v16-references.json','review-context-v16-legacy.json']]
        review={'rows':[j for r in reviews for j in r['rows']],'back_findings':[j for r in reviews for j in r['back_findings']]}
        records={r['record_id']:r for r in map(json.loads,(directory/'checkpoints/context-v16/madlad.jsonl').read_text().splitlines())}
        self.assertEqual(len(records),67);self.assertEqual(sum(r['expected_rows'] for r in reviews),67)
        self.assertEqual(sum(r['candidate']=='model' for r in records.values()),40)
        self.assertEqual(sum(r['candidate']=='legacy' for r in records.values()),27)
        for r in reviews:
            self.assertEqual(r['approved_locales'],[]);self.assertFalse(r['native_review'])
        for judgment in review['rows']:
            row=records[judgment['record_ids'][0]]
            self.assertEqual(judgment['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
            if min(judgment['scores'].values())==3:continue
            with self.subTest(candidate=row['candidate'],key=row['key']):
                self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],row['locale']),
                    'Independently observed legacy/model defect missing permanent fixture')
        for finding in review['back_findings']:
            row=records[finding['record_id']]
            self.assertEqual(finding['back_translation_hash'],hashlib.sha256(row['back_translation'].encode()).hexdigest())
            with self.subTest(candidate=row['candidate'],key=row['key'],direction='back'):
                self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['back_translation'],row['locale'],'back'))

if __name__=='__main__':unittest.main()
