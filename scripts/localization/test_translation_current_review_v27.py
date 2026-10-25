"""Every actual v27 judgment and negative finding stays bound to raw source/target hashes."""
import hashlib,importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class CurrentReviewV27Test(unittest.TestCase):
 def test_all_actual_forward_and_back_judgments_have_exact_permanent_evidence(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v27/madlad.jsonl').read_text().splitlines())};full=DATA/'run-context-v27-full.json';expected=333 if full.exists()and json.loads(full.read_text())['complete']else 67;self.assertEqual(len(records),expected);seen=set()
  for f in DATA.glob('review-context-v27*.json'):
   review=json.loads(f.read_text());self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[]);self.assertEqual(review['expected_rows'],len(review['rows']))
   for judgment in review['rows']:
    for identity in judgment['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);row=records[identity];self.assertEqual(judgment['source_hash'],row['source_hash']);self.assertEqual(judgment['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
     if min(judgment['scores'].values())<3:
      with self.subTest(key=row['key'],candidate=row['candidate'],direction='forward'):self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'))
   for finding in review['back_findings']:
    row=records[finding['record_id']];self.assertEqual(finding['back_translation_hash'],hashlib.sha256(row['back_translation'].encode()).hexdigest())
    with self.subTest(key=row['key'],candidate=row['candidate'],direction='back'):self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['back_translation'],'zh-CN','back'))
  self.assertEqual(seen,set(records))
 def test_all_model_outputs_are_known_memory_and_every_forward_data_failure_blocks(self):
  records=list(map(json.loads,(DATA/'checkpoints/context-v27/madlad.jsonl').read_text().splitlines()))
  for row in records:
   with self.subTest(key=row['key'],candidate=row['candidate']):
    checks=pilot.typed_record_evidence(row);self.assertTrue(all(checks['input'].values()))
    if row['candidate']=='model':
     self.assertEqual(row['translation_origin'],'reviewed-memory');self.assertIsNone(row['forward_segments']);self.assertEqual(row['raw_translation'],row['translation']);self.assertEqual(row['translation'],pilot.reviewed_memory(row,'zh-CN','context-v27'));self.assertTrue(all(checks['forward'].values()));self.assertEqual(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'),[])
    elif not all(checks['forward'].values()):self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'))
if __name__=='__main__':unittest.main()
