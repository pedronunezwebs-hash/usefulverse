"""An unsupported grammar blocks publication without inventing a translation defect."""
import copy
import hashlib
import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)

class ChineseContractReviewTest(unittest.TestCase):
 def sample(self,source='Use one rectangle.',target='使用一个矩形。',policy='context-v22'):
  sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
  row={'record_id':'independent.contract','source':source,'source_hash':sha(source),'translation':target,'raw_translation':target,'model_input':source,
   'locale':'zh-CN','key':'independent.contract','back_translation':source,'inference_policy':policy,'candidate':'legacy',
   'marker_restore_ok':True,'back_marker_restore_ok':True,'truncated':False,
   'back_segments':[{'kind':'prose','input':target,'output':source,'truncated':False,'leading_space':'','trailing_space':''}]}
  warnings={flag:{'disposition':'unproved-data' if flag in {'forward_typed_data','marker_restore','forward_sentence_evidence'} else 'reviewed-signal',
   'blocks_gate':flag in {'forward_typed_data','marker_restore','forward_sentence_evidence'},
   'note':'Direct reading: one/一个 agree; decimal-only policy cannot prove Han spellout, so the gate stays blocked.'}
   for flag,bad in pilot.record_flags(row).items() if bad}
  review={'expected_rows':1,'inference_policy':policy,'rows':[{'record_ids':[row['record_id']],'source_hash':row['source_hash'],'key':row['key'],'locale':row['locale'],'translation_hash':sha(target),
   'scores':{'meaning':3,'numbers_negations':3,'naturalness':3}}],
   'warning_reconciliation':[{'record_id':row['record_id'],'translation_hash':sha(target),'back_translation_hash':sha(source),'warnings':warnings}],
   'reference_gate':{'zh-CN':{'passed':False}}}
  return row,review
 def test_correct_spellout_can_remain_unproved_only_with_blocked_gate(self):
  row,review=self.sample();self.assertEqual(pilot.audit_review_warnings(review,{row['record_id']:row}),1)
  self.assertFalse(review['reference_gate']['zh-CN']['passed'])
  self.assertEqual(min(review['rows'][0]['scores'].values()),3)
 def test_unproved_data_cannot_pass_or_apply_to_old_policy(self):
  row,review=self.sample();review['reference_gate']['zh-CN']['passed']=True
  with self.assertRaises(ValueError):pilot.audit_review_warnings(review,{row['record_id']:row})
  row,review=self.sample(policy='context-v21')
  next(iter(review['warning_reconciliation'][0]['warnings'].values())).update(disposition='unproved-data',blocks_gate=True)
  with self.assertRaises(ValueError):pilot.audit_review_warnings(review,{row['record_id']:row})
 def test_wrong_known_quantity_and_damaged_tokens_cannot_use_unproved(self):
  for source,target in [('Limit 25 MB.','限制250 MB。'),('Use one rectangle and ASCII DXF.','使用一个矩形和ASCII DWG。')]:
   with self.subTest(target=target):
    row,review=self.sample(source,target)
    with self.assertRaises(ValueError):pilot.audit_review_warnings(review,{row['record_id']:row})

 def test_unproved_model_trace_still_requires_coverage_and_known_values(self):
  source='Use one rectangle. Keep 10 cells.';outputs=['使用一个矩形。','保留10个方格。'];traces=[]
  values=pilot.translate_complete_sentences_v22([source],lambda parts:[(s,False) for s in outputs],'en','zh-CN',traces)
  self.assertIsNone(values[0][0]);raw=values[0][1]
  row,_=self.sample(source,raw);row.update(candidate='model',marker_restore_ok=False,forward_segments=traces[0])
  self.assertTrue(pilot.chinese_quantity_unproved_v22(row))
  damaged=copy.deepcopy(row);damaged['forward_segments'][0]['input']='Unrelated source'
  self.assertFalse(pilot.chinese_quantity_unproved_v22(damaged))
  damaged=copy.deepcopy(row);damaged['translation']=raw.replace('10','11');damaged['raw_translation']=damaged['translation'];damaged['forward_segments'][1]['output']=outputs[1].replace('10','11')
  self.assertFalse(pilot.chinese_quantity_unproved_v22(damaged))

 def test_spelled_source_quantity_remains_unproved_and_invented_values_block(self):
  source='A clue marked 6 belongs inside one rectangle that covers exactly six squares.'
  target='标记为6的线索属于一个正好包含6个方格的矩形。'
  row,_=self.sample(source,target)
  self.assertTrue(pilot.chinese_quantity_unproved_v22(row))
  self.assertFalse(all(pilot.typed_record_evidence(row)['forward'].values()))
  row['translation']=target.replace('6个','7个')
  self.assertFalse(pilot.chinese_quantity_unproved_v22(row))

if __name__=='__main__':unittest.main()
