"""Every current v25 finding is source-bound and permanently covered, including old copy."""
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


class ChineseCurrentReviewV25Test(unittest.TestCase):
    def test_all_current_forward_and_back_findings_have_exact_fixtures(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())}
        full = DATA/'run-context-v25-full.json'
        expected = 333 if full.exists() and json.loads(full.read_text())['complete'] else 67
        self.assertEqual(len(records), expected)
        reviews = [json.loads(p.read_text()) for p in DATA.glob('review-context-v25*.json')]
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

    def test_every_current_typed_failure_is_explicit_and_blocking(self):
        records=list(map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines()))
        registry=json.loads((DATA/'unproved-data-v25-full.json').read_text());unknown=set()
        for row in records:
            with self.subTest(key=row['key'],candidate=row['candidate']):
                evidence=pilot.typed_record_evidence(row)
                self.assertTrue(all(evidence['input'].values()))
                if all(evidence['forward'].values()):continue
                if pilot.chinese_quantity_unproved_v25(row):
                    unknown.add(row['record_id']);self.assertFalse(evidence['forward']['quantities']);self.assertTrue(all(v for k,v in evidence['forward'].items()if k!='quantities'))
                else:
                    self.assertEqual((row['candidate'],row['key']),('legacy','voice-changer.details'));self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'))
        self.assertEqual(unknown,{r['record_id']for r in registry['rows']});self.assertEqual(len(unknown),7)

    def test_frozen_unknown_rows_cannot_approve_or_survive_tampering(self):
        records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())}
        full=json.loads((DATA/'review-context-v25-full.json').read_text());ids={r['record_id']for r in json.loads((DATA/'unproved-data-v25-full.json').read_text())['rows']}
        for identity in ids:
            row=records[identity];self.assertTrue(pilot.chinese_quantity_unproved_v25(row))
            for field in ['record_id','source','source_hash','context','translation','raw_translation','back_translation','model_input','inference_policy']:
                changed=copy.deepcopy(row);changed[field]+=' 11';self.assertFalse(pilot.chinese_quantity_unproved_v25(changed),field)
            changed=copy.deepcopy(row);changed['truncated']=True;self.assertFalse(pilot.chinese_quantity_unproved_v25(changed))
            review=copy.deepcopy(full);review['rows']=[j for j in review['rows']if identity in j['record_ids']];review['expected_rows']=1;review['warning_reconciliation']=[j for j in review['warning_reconciliation']if j['record_id']==identity];review['requires_complete_model_warning_coverage']=False
            pilot.audit_review_warnings(review,records);review['full_gate']['zh-CN']['passed']=True
            with self.assertRaises(ValueError):pilot.audit_review_warnings(review,records)
        import tempfile
        from unittest.mock import patch
        with tempfile.TemporaryDirectory()as root:
            path=Path(root)/'docs/quality/translation-pilot';path.mkdir(parents=True);(path/'unproved-data-v25-full.json').write_text((DATA/'unproved-data-v25-full.json').read_text()+' ')
            with patch.object(pilot,'ROOT',Path(root)):
                with self.assertRaisesRegex(ValueError,'Changed frozen'):pilot.chinese_quantity_unproved_v25(records[next(iter(ids))])

if __name__=='__main__':unittest.main()
