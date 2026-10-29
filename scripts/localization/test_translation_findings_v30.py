"""Direct Russian judgments and new back defects stay bound to actual source/forward."""
import importlib.util,json,hashlib,unittest
from pathlib import Path
from test_translation_pilot import pilot
DATA=pilot.ROOT/'docs/quality/translation-pilot';HERE=Path(__file__).parent
sp=importlib.util.spec_from_file_location('scope30',HERE/'pilot-scoped-back-v30.py');audit=importlib.util.module_from_spec(sp);sp.loader.exec_module(audit)
class FindingsV30Test(unittest.TestCase):
 def records(self):return {r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v30/madlad.jsonl').read_text().splitlines())}
 def test_all_new_observed_back_errors_have_exact_forward_bound_regressions(self):
  records=self.records();cases=json.loads((DATA/'findings-v30.json').read_text())['cases']
  for case in cases:
   for identity in case['observed_record_ids']:
    row=records[identity]
    with self.subTest(key=row['key'],identity=identity):self.assertIn(case['issue'],audit.issues(row))
    for field in ['translation','back_translation','source_hash','inference_policy','key','locale']:
     with self.subTest(field=field):self.assertEqual(audit.issues({**row,field:row[field]+' changed'}),[])
 def test_full_forward_errors_are_permanent_and_exactly_bound(self):
  path=HERE/'pilot-scoped-forward-v30.py';self.assertTrue(path.exists(),'Missing permanent forward detector')
  spec=importlib.util.spec_from_file_location('forward30',path);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
  records=self.records()
  for case in json.loads((DATA/'findings-v30.json').read_text())['forward_cases']:
   for identity in case['observed_record_ids']:
    row=records[identity]
    with self.subTest(identity=identity):self.assertIn(case['issue'],mod.issues(row))
    for field in ['translation','source_hash','inference_policy','key','locale']:
     self.assertEqual(mod.issues({**row,field:row[field]+' changed'}),[])
 def test_common_review_detector_preserves_inference_and_finds_exact_new_errors(self):
  base=vars(pilot)['semantic_issues'];flags=vars(pilot)['record_flags'];run=vars(pilot)['run'];typed=vars(pilot)['policy_typed_data_checks']
  for case in json.loads((DATA/'findings-v30.json').read_text())['forward_cases']:
   with self.subTest(key=case['key']):self.assertIn(case['issue'],pilot.semantic_issues(case['key'],case['source_hash'],case['translation'],case['locale']))
   for field in ['key','source_hash','translation','locale']:
    changed=dict(case);changed[field]+=' changed';self.assertNotIn(case['issue'],pilot.semantic_issues(changed['key'],changed['source_hash'],changed['translation'],changed['locale']))
   self.assertNotIn(case['issue'],pilot.semantic_issues(case['key'],case['source_hash'],case['translation'],case['locale'],'back'))
  self.assertIs(vars(pilot)['semantic_issues'],base);self.assertIs(pilot.record_flags,flags);self.assertIs(pilot.run,run);self.assertIs(pilot.policy_typed_data_checks,typed)
  from unittest.mock import patch
  original=pilot.ROOT
  with patch.object(pilot,'ROOT',original/'unused-test-root'):self.assertEqual(vars(pilot)['ROOT'],original/'unused-test-root')
  self.assertEqual(pilot.ROOT,original)
 def test_current_reviews_cover_every_read_record_and_all_generic_and_scoped_warnings(self):
  records=self.records();seen=set()
  for path in DATA.glob('review-context-v30-*.json'):
   review=json.loads(path.read_text());self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[]);pilot.audit_review_warnings(review,records);scoped={r['record_id']:r for r in review.get('scoped_back_findings',[])};forward_scoped={r['record_id']:r for r in review.get('scoped_forward_findings',[])}
   for judgment in review['rows']:
    for identity in judgment['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);row=records[identity];self.assertEqual(judgment['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
     if audit.issues(row):self.assertEqual(scoped.pop(identity)['notes'],audit.issues(row))
     if min(judgment['scores'].values())<3:
      generic=pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'ru','forward')
      if review['scope']=='full':
       fs=importlib.util.spec_from_file_location('forward30',HERE/'pilot-scoped-forward-v30.py');fm=importlib.util.module_from_spec(fs);fs.loader.exec_module(fm);found=fm.issues(row);self.assertTrue(generic or found);self.assertEqual(forward_scoped.pop(identity)['notes'],found)
     if judgment['candidate']!='legacy'and min(judgment['scores'].values())==3 and not judgment['data_contract_unproved']:self.assertTrue(all(pilot.typed_record_evidence(row)['forward'].values()))
   self.assertEqual(scoped,{});self.assertEqual(forward_scoped,{})
  self.assertEqual(seen,set(records))
if __name__=='__main__':unittest.main()
