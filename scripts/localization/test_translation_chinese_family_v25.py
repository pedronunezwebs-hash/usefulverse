"""A duplicated FAQ must not silently keep the earlier inconsistent perfect grade."""
import importlib.util,json,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class ChineseFamilyV25Test(unittest.TestCase):
 def test_same_observed_comparison_is_corrected_and_historical_perfect_grade_explicitly_withdrawn(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())};r=next(r for r in records.values()if r['candidate']=='model'and r['key']=='voice-changer.fields.faq5a');other=next(x for x in records.values()if x['candidate']=='model'and x['key']=='voice-changer.faq.4.a')
  self.assertEqual(r['source'],other['source']);self.assertEqual(r['translation'],other['translation'])
  self.assertTrue(pilot.semantic_issues(r['key'],r['source_hash'],r['translation'],'zh-CN'))
  review=json.loads((DATA/'review-context-v24-full.json').read_text());old=next(x for x in review['rows']if r['record_id']in x['record_ids']);self.assertEqual(set(old['scores'].values()),{3});self.assertFalse(review['full_gate']['zh-CN']['passed'])
  withdrawals=pilot.historical_forward_withdrawals(review,records);item=next(x for x in withdrawals if x['record_id']==r['record_id']);self.assertEqual(item['scores'],{'meaning':3,'numbers_negations':3,'naturalness':2})
  new=pilot.reviewed_memory(r,'zh-CN','context-v25');self.assertEqual(new,pilot.reviewed_memory(other,'zh-CN','context-v25'));self.assertNotEqual(new,r['translation']);self.assertTrue(all(pilot.policy_typed_data_checks(r['source'],new,'en','zh-CN','context-v25').values()))
 def test_legacy_duplicate_has_the_same_explicit_historical_withdrawal(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines())};r=next(r for r in records.values()if r['candidate']=='legacy'and r['key']=='voice-changer.fields.faq5a');other=next(x for x in records.values()if x['candidate']=='legacy'and x['key']=='voice-changer.faq.4.a')
  self.assertEqual(r['source'],other['source']);self.assertEqual(r['translation'],other['translation']);self.assertTrue(pilot.semantic_issues(r['key'],r['source_hash'],r['translation'],'zh-CN'))
  review=json.loads((DATA/'review-context-v24-full-legacy.json').read_text());old=next(x for x in review['rows']if r['record_id']in x['record_ids']);self.assertEqual(set(old['scores'].values()),{3});self.assertFalse(review['full_gate']['zh-CN']['passed'])
  withdrawal=next(x for x in pilot.historical_legacy_forward_withdrawal_v25(review,records)if x['record_id']==r['record_id']);self.assertEqual(withdrawal['scores'],{'meaning':3,'numbers_negations':3,'naturalness':2})
if __name__=='__main__':unittest.main()
