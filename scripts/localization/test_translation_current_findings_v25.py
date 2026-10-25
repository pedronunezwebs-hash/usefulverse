"""Exact permanent regressions for directly read v25 findings."""
import importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class CurrentFindingsV25Test(unittest.TestCase):
 def test_all_current_findings_are_exact_and_permanent(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())};items=json.loads((DATA/'observed-findings-v25.json').read_text())['findings'];self.assertEqual(len(items),25)
  for f in items:
   r=records[f['record_id']]
   with self.subTest(key=r['key'],candidate=r['candidate'],direction=f['direction']):
    self.assertEqual(f['translation'],r['translation'if f['direction']=='forward'else'back_translation']);self.assertTrue(pilot.semantic_issues(r['key'],r['source_hash'],f['translation'],'zh-CN',f['direction']))
if __name__=='__main__':unittest.main()
