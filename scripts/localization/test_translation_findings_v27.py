"""Every newly read v27 back defect has an exact permanent fixture; forward quality is separate."""
import hashlib,importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class FindingsV27Test(unittest.TestCase):
 def test_five_new_back_variants_cover_seven_actual_records_without_silent_forward_change(self):
  data=json.loads((DATA/'observed-findings-v27.json').read_text());self.assertEqual(data['approved_locales'],[]);self.assertFalse(data['native_review']);self.assertEqual(len(data['findings']),5);records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v27/madlad.jsonl').read_text().splitlines())};count=0
  for finding in data['findings']:
   self.assertEqual(finding['direction'],'back')
   for identity in finding['record_ids']:
    row=records[identity];count+=1
    with self.subTest(key=row['key'],candidate=row['candidate']):
     self.assertEqual(row['key'],finding['key']);self.assertEqual(row['source_hash'],finding['source_hash']);self.assertEqual(row['back_translation'],finding['translation']);self.assertEqual(bool(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN')),finding.get('forward_known_defect',False));self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['back_translation'],'zh-CN','back'),'New exact observed back defect must not disappear from the auditor')
  self.assertEqual(count,7)
if __name__=='__main__':unittest.main()
