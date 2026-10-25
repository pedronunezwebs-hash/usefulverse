"""Keep the newly observed raw variant rejected; negative audit cannot accept or publish it."""
import ast,copy,hashlib,importlib.util,json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseUnprovedV26Test(unittest.TestCase):
 def sample(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v26/madlad.jsonl').read_text().splitlines())};registry=json.loads((DATA/'unproved-data-v26-references.json').read_text());return records,records[registry['rows'][0]['record_id']]
 def predicate(self,row):return getattr(pilot,'chinese_quantity_unproved_v26',lambda _:False)(row)
 def test_actual_callback_is_still_rejected_and_not_a_linguistic_number_error(self):
  records,row=self.sample();self.assertFalse(row['marker_restore_ok']);self.assertEqual(row['translation'],row['raw_translation']);self.assertFalse(pilot.typed_record_evidence(row)['forward']['quantities']);self.assertEqual(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'),[])
  parts=row['forward_segments'];value=pilot.translate_complete_sentences_v26([row['model_input']],lambda texts:[(part['output'],part['truncated'])for part in parts],'en','zh-CN')[0];self.assertIsNone(value[0]);self.assertEqual(value[1],row['raw_translation']);self.assertTrue(self.predicate(row),'Frozen negative audit has not classified the real rejected output')
  self.assertEqual({r['key']for r in records.values()if not all(pilot.typed_record_evidence(r)['back'].values())},{'shikaku.example','shikaku.fields.faq.1.a'})
 def test_changed_context_raw_registry_numbers_and_truncation_cannot_classify(self):
  records,row=self.sample();self.assertTrue(self.predicate(row))
  for field in ['record_id','source','source_hash','context','translation','raw_translation','back_translation','model_input','inference_policy','source_commit','actions_run_id']:
   damaged=copy.deepcopy(row);damaged[field]+=' 11'
   with self.subTest(field=field):self.assertFalse(self.predicate(damaged))
  for field,value in [('candidate','legacy'),('locale','zh-TW'),('truncated',True)]:
   damaged=copy.deepcopy(row);damaged[field]=value;self.assertFalse(self.predicate(damaged))
  with tempfile.TemporaryDirectory()as root:
   folder=Path(root)/'docs/quality/translation-pilot';folder.mkdir(parents=True);(folder/'unproved-data-v26-references.json').write_text((DATA/'unproved-data-v26-references.json').read_text()+' ')
   with patch.object(pilot,'ROOT',Path(root)),self.assertRaisesRegex(ValueError,'Changed frozen v26'):self.predicate(row)
 def test_blocked_review_is_auditable_but_passed_gate_is_never_allowed(self):
  records,row=self.sample();review=json.loads((DATA/'review-context-v26-references.json').read_text());pilot.audit_review_warnings(review,records);self.assertFalse(review['reference_gate']['zh-CN']['passed']);self.assertFalse(pilot.typed_record_evidence(row)['forward']['quantities'])
  changed=copy.deepcopy(review);changed['reference_gate']['zh-CN']['passed']=True
  with self.assertRaises(ValueError):pilot.audit_review_warnings(changed,records)
if __name__=='__main__':unittest.main()
