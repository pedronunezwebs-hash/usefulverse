"""A post-inference audit may retain blocked data; it cannot accept that data."""
import copy,hashlib,importlib.util,json,unittest
from pathlib import Path
from test_translation_pilot import pilot
HERE=Path(__file__).parent;DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ReviewAuditV30Test(unittest.TestCase):
 def test_actual_localized_symbols_remain_blocked_without_false_language_errors(self):
  path=HERE/'pilot-review-audit-v30.py';self.assertTrue(path.exists(),'Missing blocked-only post-inference audit')
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v30/madlad.jsonl').read_text().splitlines())}
  observed=[r for r in records.values()if not pilot.typed_record_evidence(r)['forward']['unit_symbols']]
  self.assertEqual(len(observed),5)
  for row in observed:
   judgment=dict(key=row['key'],locale=row['locale'],source_hash=row['source_hash'],record_ids=[row['record_id']],translation_hash=hashlib.sha256(row['translation'].encode()).hexdigest(),scores=dict(meaning=3,numbers_negations=3,naturalness=3),data_contract_unproved=True)
   flags={f:v for f,v in pilot.record_flags(row).items()if v};decisions={f:dict(disposition='reviewed-signal'if f.startswith('back_')or f in {'wrong_script','length_ratio'}else'unproved-data',blocks_gate=not(f.startswith('back_')or f in {'wrong_script','length_ratio'}),note='Actual observed localized label;unproved data remains blocked.')for f in flags}
   review=dict(inference_policy='context-v30',native_review=False,approved_locales=[],expected_rows=1,rows=[judgment],full_gate={'ru':{'passed':False}},warning_reconciliation=[dict(record_id=row['record_id'],translation_hash=judgment['translation_hash'],back_translation_hash=hashlib.sha256(row['back_translation'].encode()).hexdigest(),warnings=decisions)])
   with self.assertRaises(ValueError):pilot.RUSSIAN_V30.audit(review,records)
   self.assertEqual(pilot.audit_review_warnings(review,records),1)
   for mutation in ['passed','unblocked','no-unproved','stale-text','stale-source','native','approved']:
    changed=copy.deepcopy(review);actual=copy.deepcopy(records)
    if mutation=='passed':changed['full_gate']['ru']['passed']=True
    elif mutation=='unblocked':changed['warning_reconciliation'][0]['warnings']['unit_symbols']['blocks_gate']=False
    elif mutation=='no-unproved':changed['rows'][0]['data_contract_unproved']=False
    elif mutation=='stale-text':actual[row['record_id']]['translation']+=' changed'
    elif mutation=='stale-source':actual[row['record_id']]['source_hash']='stale'
    elif mutation=='native':changed['native_review']=True
    else:changed['approved_locales']=['ru']
    with self.subTest(mutation=mutation),self.assertRaises(ValueError):pilot.audit_review_warnings(changed,actual)
 def test_install_changes_only_the_report_audit_and_preserves_inference_bytes(self):
  path=HERE/'pilot-review-audit-v30.py';self.assertTrue(path.exists())
  spec=importlib.util.spec_from_file_location('post30',path);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
  ns=vars(pilot);before=dict(ns);mod.install(ns)
  self.assertEqual({k for k in before if before[k]is not ns[k]},{'audit_review_warnings'})
  proof=json.loads((DATA/'regression-v30-preflight.json').read_text())
  for name,digest in {**proof['historical_runtime_sha256'],**proof['measured_runtime_sha256']}.items():self.assertEqual(hashlib.sha256((pilot.ROOT/name).read_bytes()).hexdigest(),digest)
if __name__=='__main__':unittest.main()
