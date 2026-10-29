"""Preflight the latest actual outputs, not only callbacks from the previous repair."""
import importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChinesePreflightV26Test(unittest.TestCase):
 def test_all214_actual_sources_inputs_fragments_outputs_and334_memories(self):
  rows=[r for r in map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'];self.assertEqual(len(rows),214);contracts=pilot.v26_quantity_contracts();checked=0
  for row in rows:
   with self.subTest(key=row['key']):
    for whole in [row['source'],pilot.translation_input(row,'context-v26')]:
     for text in [whole,*[part[1]for part in pilot.complete_sentence_parts(whole)]]:
      checked+=1;self.assertIsNotNone(pilot.numeric_data_zh_v26(text,'en',contracts))
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','zh-CN','context-v26').values()))
    if row['forward_segments']:
     self.assertTrue(pilot.complete_sentence_evidence_valid_v26(row['forward_segments'],row['model_input'],row['raw_translation'],'en','zh-CN'))
    def translate(texts,source_locale,target_locale,traces):
     self.assertEqual(texts,[row['model_input']]);trace=row['forward_segments']
     def callback(parts):self.assertEqual(parts,[p['input']for p in trace]);return [(p['output'],p['truncated'])for p in trace]
     return pilot.translate_complete_sentences_v26(texts,callback,source_locale,target_locale,traces)
    values,traces,memory=pilot.forward_with_memory([row],'zh-CN','context-v26',translate)
    self.assertIsNotNone(values[0][0],row['key']);self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],values[0][0],'en','zh-CN','context-v26').values()))
  self.assertEqual(checked,1004);memories=pilot.POLICIES['context-v26']['reviewed_memory'];self.assertEqual(sum(len(e['translations'])for e in memories.values()),334)
  for key,item in memories.items():
   for locale,text in item['translations'].items():
    with self.subTest(key=key,locale=locale):
     current=pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v26')
     if locale=='zh-CN':self.assertTrue(all(current.values()))
     else:self.assertEqual(current,pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v25'))
     if locale=='id':self.assertTrue(all(pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v21').values()))
if __name__=='__main__':unittest.main()
