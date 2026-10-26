"""Current back errors need exact forward binding without regrading old data."""
import copy,hashlib,importlib.util,json,unittest
from pathlib import Path
from test_translation_pilot import pilot
DATA=pilot.ROOT/'docs/quality/translation-pilot'
sp=importlib.util.spec_from_file_location('scoped_back_v29',Path(__file__).with_name('pilot-scoped-back-v29.py'));audit=importlib.util.module_from_spec(sp);sp.loader.exec_module(audit)
class ScopedBackV29Test(unittest.TestCase):
 def records(self):return {r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v29/madlad.jsonl').read_text().splitlines())}
 def test_every_direct_observed_back_defect_has_permanent_scoped_detection(self):
  findings=json.loads((DATA/'findings-v29-scoped-back.json').read_text());self.assertFalse(findings['native_review']);self.assertEqual(findings['approved_locales'],[]);self.assertEqual(hashlib.sha256((DATA/findings['source_checkpoint']).read_bytes()).hexdigest(),findings['source_checkpoint_sha256']);records=self.records()
  for case in findings['cases']:
   for identity in case['observed_record_ids']:
    row=records[identity]
    with self.subTest(key=row['key'],identity=identity):self.assertIn(case['issue'],audit.issues(row))
 def test_changed_forward_source_back_or_policy_cannot_inherit_a_back_defect(self):
  records=self.records()
  for case in json.loads((DATA/'findings-v29-scoped-back.json').read_text())['cases']:
   row=records[case['observed_record_ids'][0]]
   for field in ['translation','source_hash','key','locale','back_translation','inference_policy']:
    changed={**row,field:row[field]+' changed'}
    with self.subTest(key=row['key'],field=field):self.assertEqual(audit.issues(changed),[])
  # Old uncorrected microinch forward text must not inherit the new back error.
  current=next(r for r in records.values()if r['key']=='dxf-viewer.fields.units.8')
  old=next(r for r in map(json.loads,(DATA/'checkpoints/context-v28/madlad.jsonl').read_text().splitlines())if r['key']==current['key']and r['candidate']=='model')
  self.assertNotEqual(old['translation'],current['translation']);self.assertEqual(audit.issues({**current,'translation':old['translation']}),[])
 def test_scoped_audit_never_changes_frozen_runtime_or_generic_historical_flags(self):
  proof=json.loads((DATA/'regression-v29-preflight.json').read_text());records=self.records()
  for name,digest in {**proof['frozen_v28_runtime_sha256'],**proof['measured_runtime_v29_sha256']}.items():self.assertEqual(hashlib.sha256((pilot.ROOT/name).read_bytes()).hexdigest(),digest)
  identities={i for c in json.loads((DATA/'findings-v29-scoped-back.json').read_text())['cases']for i in c['observed_record_ids']}
  for identity in identities:
   row=records[identity];before=copy.deepcopy(row);flags=pilot.record_flags(row);audit.issues(row);self.assertEqual(row,before);self.assertEqual(pilot.record_flags(row),flags)
 def test_all_four_current_reviews_bind_every_warning_and_scoped_back_finding(self):
  records=self.records();seen=set()
  for name in ['references','legacy','full','full-legacy']:
   review=json.loads((DATA/f'review-context-v29-{name}.json').read_text());pilot.audit_review_warnings(review,records);self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[])
   findings={f['record_id']:f for f in review.get('scoped_back_findings',[])}
   for judgment in review['rows']:
    for identity in judgment['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);row=records[identity];found=audit.issues(row)
     if found:self.assertEqual(findings.pop(identity)['notes'],found)
   self.assertEqual(findings,{})
  self.assertEqual(seen,set(records))
if __name__=='__main__':unittest.main()
