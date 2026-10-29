"""Replay the measured v24 failures before accepting the independent v25 correction."""
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseMemoryV25Test(unittest.TestCase):
 def test_all50_real_v24_callbacks_are_reproduced_and_corrected_by_bound_memory(self):
  plan=json.loads((DATA/'correction-v25-plan.json').read_text());records={r['record_id']:r for r in map(json.loads,(DATA/plan['source_checkpoint']).read_text().splitlines())}
  self.assertEqual(len(plan['entries']),50)
  for item in plan['entries']:
   with self.subTest(key=item['key']):
    r=records[item['old_record_id']];trace=r['forward_segments'];self.assertTrue(trace)
    def callback(parts):
     self.assertEqual(parts,[x['input']for x in trace]);return [(x['output'],x['truncated'])for x in trace]
    measured=pilot.translate_complete_sentences_v24([r['model_input']],callback,'en','zh-CN')[0]
    self.assertEqual(measured[1],r['raw_translation']);self.assertEqual(measured[0] is not None,r['marker_restore_ok'])
    policy='context-v25' if 'context-v25'in pilot.POLICIES else 'context-v24'
    value=pilot.reviewed_memory(item,'zh-CN',policy)
    self.assertEqual(value,item['translation'],'The measured bad output needs a source/context-bound correction')
    self.assertNotEqual(value,r['translation'])
    self.assertTrue(all(pilot.policy_typed_data_checks(item['source'],value,'en','zh-CN',policy).values()))
 def test_existing274_memory_targets_and_all_controlled_inputs_are_preserved(self):
  self.assertIn('context-v25',pilot.POLICIES)
  old=pilot.POLICIES['context-v24'];new=pilot.POLICIES['context-v25'];self.assertEqual(old['entries'],new['entries'])
  for key,entry in old['reviewed_memory'].items():
   for locale,target in entry['translations'].items():self.assertEqual(new['reviewed_memory'][key]['translations'][locale],target)
  self.assertEqual(sum(len(e['translations'])for e in old['reviewed_memory'].values()),274)
if __name__=='__main__':unittest.main()
