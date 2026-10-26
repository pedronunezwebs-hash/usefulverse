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
 def test_current_reviews_cover_every_read_record_and_all_generic_and_scoped_warnings(self):
  records=self.records();seen=set()
  for path in DATA.glob('review-context-v30-*.json'):
   review=json.loads(path.read_text());self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[]);pilot.audit_review_warnings(review,records);scoped={r['record_id']:r for r in review.get('scoped_back_findings',[])}
   for judgment in review['rows']:
    for identity in judgment['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);row=records[identity];self.assertEqual(judgment['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
     if audit.issues(row):self.assertEqual(scoped.pop(identity)['notes'],audit.issues(row))
     if judgment['candidate']!='legacy'and min(judgment['scores'].values())==3 and not judgment['data_contract_unproved']:self.assertTrue(all(pilot.typed_record_evidence(row)['forward'].values()))
   self.assertEqual(scoped,{})
  self.assertEqual(seen,set(records))
if __name__=='__main__':unittest.main()
