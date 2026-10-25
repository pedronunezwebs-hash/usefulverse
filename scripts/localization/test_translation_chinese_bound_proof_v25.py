"""Source-bound proofs for observed v24 gaps, without a universal Han grammar."""
import copy,hashlib,importlib.util,json,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseBoundProofV25Test(unittest.TestCase):
 def test_all51_observed_quantities_are_proved_only_in_the_new_policy(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())}
  gaps=json.loads((DATA/'unproved-data-v24-full.json').read_text())['rows'];self.assertEqual(len(gaps),51)
  for gap in gaps:
   with self.subTest(key=gap['key'],candidate=gap['candidate']):
    row=records[gap['record_id']];before=copy.deepcopy(row)
    self.assertTrue(pilot.chinese_quantity_unproved_v24(row))
    policy='context-v25'if 'context-v25'in pilot.POLICIES else 'context-v24'
    self.assertTrue(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','zh-CN',policy)['quantities'])
    self.assertEqual(row,before)
 def test_the_two_correct_dimension_spellings_do_not_widen_unknown_Han(self):
  rows=[r for r in map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'and r['key']in ['dxf-viewer.description','dxf-viewer.privacy']]
  self.assertEqual(len(rows),2);policy='context-v25'if 'context-v25'in pilot.POLICIES else 'context-v24'
  for r in rows:
   with self.subTest(key=r['key']):
    self.assertFalse(pilot.policy_typed_data_checks(r['source'],r['translation'],'en','zh-CN','context-v24')['dimensions'])
    self.assertTrue(pilot.policy_typed_data_checks(r['source'],r['translation'],'en','zh-CN',policy)['dimensions'])
  for source,target in [('An unrelated notice.','为什么有些实体缺失?'),('Choose one unrelated panel.','使用一百个面板。'),('Keep 10 MB.','保留11 MB。'),('Keep {value}.','保留{intruder}。')]:
   self.assertFalse(all(pilot.policy_typed_data_checks(source,target,'en','zh-CN',policy).values()))
  for locale in ['zh-CN','id']:self.assertIsNone(pilot.numeric_data('1',locale))
if __name__=='__main__':unittest.main()
