"""Replay all nine actual v25 failures before correcting the independent next policy."""
import importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseMemoryV26Test(unittest.TestCase):
 def test_nine_real_callbacks_restore_expected_text_and_data(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())};plan=json.loads((DATA/'correction-v26-plan.json').read_text());self.assertEqual(len(plan['entries']),9)
  policy='context-v26'if'context-v26'in pilot.POLICIES else'context-v25'
  for item in plan['entries']:
   row=records[item['old_record_id']]
   with self.subTest(key=row['key']):
    self.assertEqual(pilot.translation_input(row,policy),row['model_input'])
    def translate(texts,source_locale,target_locale,traces):
     self.assertEqual(texts,[row['model_input']]);parts=row['forward_segments']
     def callback(sentences):self.assertEqual(sentences,[part['input']for part in parts]);return [(part['output'],part['truncated'])for part in parts]
     fn=getattr(pilot,'translate_complete_sentences_v26',pilot.translate_complete_sentences_v25)
     return fn(texts,callback,source_locale,target_locale,traces)
    values,traces,memory=pilot.forward_with_memory([row],'zh-CN',policy,translate)
    self.assertIsNotNone(values[0][0],'Observed raw must pass every data contract, not silently become accepted')
    self.assertEqual(values[0][0],item['translation'])
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],values[0][0],'en','zh-CN',policy).values()))
 def test_previous325_targets_and_source_inputs_are_preserved(self):
  self.assertIn('context-v26',pilot.POLICIES)
  old=pilot.POLICIES['context-v25'];new=pilot.POLICIES['context-v26'];self.assertEqual(old['entries'],new['entries'])
  self.assertEqual(sum(len(e['translations'])for e in old['reviewed_memory'].values()),325)
  self.assertEqual(sum(len(e['translations'])for e in new['reviewed_memory'].values()),334)
  for key,item in old['reviewed_memory'].items():
   self.assertEqual(item,new['reviewed_memory'][key])
if __name__=='__main__':unittest.main()
