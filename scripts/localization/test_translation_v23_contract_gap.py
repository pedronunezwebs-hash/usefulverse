"""Actual inference-source proof gap remains blocking; audit must not fabricate grades."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def actual():
 return next(r for r in map(json.loads,(DATA/'checkpoints/context-v23/madlad.jsonl').read_text().splitlines()) if r['candidate']=='model' and r['key']=='shikaku.fields.faq.1.a')
class V23ContractGapTest(unittest.TestCase):
 def test_observed_callback_is_retained_and_missing_whole_input_proof_blocks(self):
  row=actual();original=copy.deepcopy(row);traces=[]
  def replay(parts):
   self.assertEqual(parts,[p['input'] for p in row['forward_segments']]);return [(p['output'],p['truncated']) for p in row['forward_segments']]
  values=pilot.translate_complete_sentences_v23([row['model_input']],replay,'en','zh-CN',traces)
  self.assertEqual(values,[(None,row['raw_translation'],False)]);self.assertEqual(traces,[row['forward_segments']]);self.assertFalse(row['marker_restore_ok'])
  self.assertTrue(all(pilot.typed_record_evidence(row)['forward'].values()))
  self.assertFalse(pilot.policy_typed_data_checks(row['model_input'],row['raw_translation'],'en','zh-CN','context-v23')['quantities'])
  self.assertTrue(pilot.chinese_quantity_unproved_v23(row),'Whole controlled inference source lacks a proof; audit status must identify the gap without approving it')
  self.assertEqual(row,original)
 def test_gap_audit_cannot_approve_or_hide_damaged_known_data_or_trace(self):
  row=actual();h=lambda text:hashlib.sha256(text.encode()).hexdigest()
  judgment={**{k:row[k] for k in ['key','locale','source_hash']},'translation_hash':h(row['translation']),'record_ids':[row['record_id']],'scores':dict.fromkeys(['meaning','numbers_negations','naturalness'],3)}
  rev={'expected_rows':1,'rows':[judgment],'reference_gate':{'zh-CN':{'passed':False}},'warning_reconciliation':[{'record_id':row['record_id'],'translation_hash':h(row['translation']),'back_translation_hash':h(row['back_translation']),'warnings':{'marker_restore':{'disposition':'unproved-data','blocks_gate':True,'note':'Exact current inference-source proof gap, not a fabricated language error.'}}}]}
  self.assertEqual(pilot.audit_review_warnings(rev,{row['record_id']:row}),1)
  rev['reference_gate']['zh-CN']['passed']=True
  with self.assertRaises(ValueError):pilot.audit_review_warnings(rev,{row['record_id']:row})
  for mutation in ['trace','number','opaque','policy','cut']:
   changed=copy.deepcopy(row)
   if mutation=='trace':changed['forward_segments'][0]['input']='Unrelated input'
   elif mutation=='number':changed['translation']+=' 11';changed['raw_translation']=changed['translation']
   elif mutation=='opaque':changed['translation']+=' {other}';changed['raw_translation']=changed['translation']
   elif mutation=='policy':changed['inference_policy']='context-v22'
   else:changed['truncated']=True
   with self.subTest(mutation=mutation):self.assertFalse(pilot.chinese_quantity_unproved_v23(changed))
if __name__=='__main__':unittest.main()
