"""Bind every current source/forward/back judgment and damaged data to raw v26 evidence."""
import hashlib,importlib.util,json,unittest
from pathlib import Path
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseCurrentReviewV26Test(unittest.TestCase):
 def test_all_current_forward_and_back_findings_have_exact_fixtures(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v26/madlad.jsonl').read_text().splitlines())};full=DATA/'run-context-v26-full.json';expected=333 if full.exists()and json.loads(full.read_text())['complete']else 67;self.assertEqual(len(records),expected);seen=set()
  for file in sorted(DATA.glob('review-context-v26*.json')):
   review=json.loads(file.read_text());self.assertEqual(review['expected_rows'],len(review['rows']));self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[])
   for judgment in review['rows']:
    for identity in judgment['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);row=records[identity];self.assertEqual(judgment['source_hash'],row['source_hash']);self.assertEqual(judgment['translation_hash'],hashlib.sha256(row['translation'].encode()).hexdigest())
     if min(judgment['scores'].values())<3:
      with self.subTest(key=row['key'],candidate=row['candidate'],direction='forward'):self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'))
   for finding in review['back_findings']:
    row=records[finding['record_id']];self.assertEqual(finding['back_translation_hash'],hashlib.sha256(row['back_translation'].encode()).hexdigest())
    with self.subTest(key=row['key'],candidate=row['candidate'],direction='back'):self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['back_translation'],'zh-CN','back'))
  self.assertEqual(seen,set(records));self.assertTrue(seen)
 def test_every_current_typed_failure_is_explicit_and_blocking(self):
  records=list(map(json.loads,(DATA/'checkpoints/context-v26/madlad.jsonl').read_text().splitlines()))
  for row in records:
   with self.subTest(key=row['key'],candidate=row['candidate']):
    evidence=pilot.typed_record_evidence(row);self.assertTrue(all(evidence['input'].values()))
    if not all(evidence['forward'].values()):
     self.assertEqual((row['candidate'],row['key']),('model','shikaku.example'));self.assertTrue(pilot.chinese_quantity_unproved_v26(row));self.assertFalse(row['marker_restore_ok']);self.assertEqual(row['translation'],row['raw_translation'])
if __name__=='__main__':unittest.main()
