"""Replay every current known forward before spending Actions model compute."""
import importlib.util,json,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChinesePreflightV25Test(unittest.TestCase):
 def test_all214_Chinese_units_are_proved_and325_memory_contracts_preserved(self):
  rows=[r for r in map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'];self.assertEqual(len(rows),214);contracts=pilot.v25_quantity_contracts();checked=0
  for row in rows:
   with self.subTest(key=row['key']):
    for whole in [row['source'],pilot.translation_input(row,'context-v25')]:
     for text in [whole,*[part[1]for part in pilot.complete_sentence_parts(whole)]]:
      checked+=1;self.assertIsNotNone(pilot.numeric_data_zh_v25(text,'en',contracts))
    def translate(texts,source_locale,target_locale,traces):
     self.assertEqual(texts,[row['model_input']]);trace=row['forward_segments']
     def callback(parts):self.assertEqual(parts,[x['input']for x in trace]);return [(x['output'],x['truncated'])for x in trace]
     return pilot.translate_complete_sentences_v25(texts,callback,source_locale,target_locale,traces)
    values,traces,memory=pilot.forward_with_memory([row],'zh-CN','context-v25',translate)
    self.assertIsNotNone(values[0][0],row['key']);self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],values[0][0],'en','zh-CN','context-v25').values()))
  self.assertEqual(checked,1004)
  memories=pilot.POLICIES['context-v25']['reviewed_memory'];self.assertEqual(sum(len(e['translations'])for e in memories.values()),325)
  for key,item in memories.items():
   for locale,text in item['translations'].items():
    with self.subTest(key=key,locale=locale):
     current=pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v25')
     if locale=='zh-CN':self.assertTrue(all(current.values()))
     else:self.assertEqual(current,pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v24'))
     if locale=='id':self.assertTrue(all(pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v21').values()))
if __name__=='__main__':unittest.main()
