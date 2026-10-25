"""Reproduce both actual v26 rejected traces before adding any v27 finite witness."""
import importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ShikakuV27Test(unittest.TestCase):
 def row(self,key):return next(r for r in map(json.loads,(DATA/'checkpoints/context-v26/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'and r['key']==key)
 def replay(self,key,direction):
  row=self.row(key);trace=row['forward_segments'if direction=='forward'else'back_segments'];source=row['model_input'if direction=='forward'else'translation'];raw=row['raw_translation'if direction=='forward'else'back_translation'];old=pilot.translate_complete_sentences_v26([source],lambda texts:[(t['output'],t['truncated'])for t in trace],'en'if direction=='forward'else'zh-CN','zh-CN'if direction=='forward'else'en')[0];self.assertIsNone(old[0]);self.assertEqual(old[1],raw)
  translate=getattr(pilot,'translate_complete_sentences_v27',pilot.translate_complete_sentences_v26)
  def callback(texts):self.assertEqual(texts,[t['input']for t in trace]);return [(t['output'],t['truncated'])for t in trace]
  value=translate([source],callback,'en'if direction=='forward'else'zh-CN','zh-CN'if direction=='forward'else'en')[0];self.assertIsNotNone(value[0]);self.assertEqual(value[0],raw);self.assertFalse(value[2])
 def test_current_example_actual_forward_callback(self):self.replay('shikaku.example','forward')
 def test_current_example_actual_back_callback(self):self.replay('shikaku.example','back')
 def test_current_faq_actual_back_callback_without_invented_forward_defect(self):self.replay('shikaku.fields.faq.1.a','back')
 def test_all214_known_Chinese_sources_have_exact_memory_with334_previous_targets(self):
  policy=pilot.POLICIES.get('context-v27',pilot.POLICIES['context-v26']);self.assertEqual(sum(len(item['translations'])for item in policy['reviewed_memory'].values()),477);self.assertEqual(sum('zh-CN'in item['translations']for item in policy['reviewed_memory'].values()),214)
if __name__=='__main__':unittest.main()
