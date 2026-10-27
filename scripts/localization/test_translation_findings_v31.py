"""Current Russian findings/provenance and direct reviews are exact and complete."""
import json,hashlib,unittest,importlib.util
from pathlib import Path
from test_translation_pilot import pilot
DATA=pilot.ROOT/'docs/quality/translation-pilot';HERE=Path(__file__).parent
class FindingsV31Test(unittest.TestCase):
 def test_observed_back_errors_have_permanent_forward_bound_cases(self):
  path=DATA/'scoped-back-regressions-v31.json';self.assertTrue(path.exists(),'Missing scoped back detector registry')
  registry=json.loads(path.read_text());records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v31/madlad.jsonl').read_text().splitlines())}
  for c in json.loads((DATA/'findings-v31.json').read_text())['cases']:
   self.assertIn(c,registry['cases']);self.assertFalse(c['blocks_gate'])
   for identity in c['observed_record_ids']:
    row=records[identity];self.assertEqual(c['forward_digest'],pilot.digest(row['translation']));self.assertEqual(c['back_translation'],row['back_translation']);self.assertEqual(c['source_hash'],row['source_hash']);self.assertEqual(c['inference_policy'],row['inference_policy'])
 def test_all214_imports_bind_the_actual_original_key_locale_source_and_context(self):
  raw={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v30/madlad.jsonl').read_text().splitlines())};data=json.loads((DATA/'reviewed-memory-v31-import.json').read_text());self.assertEqual(len(data['entries']),214)
  for item in data['entries']:
   record=raw[item['source_record_id']]
   for field in ['key','source','source_hash','context']:self.assertEqual(item[field],record[field],(item['key'],field))
   self.assertEqual(record['locale'],'ru');self.assertEqual(pilot.digest(record),item['source_record_sha256'])
 def test_current_reviews_cover_every_current_raw_and_all_warnings(self):
  raw={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v31/madlad.jsonl').read_text().splitlines())};seen=set()
  for file in DATA.glob('review-context-v31-*.json'):
   review=json.loads(file.read_text());pilot.audit_review_warnings(review,raw);self.assertFalse(review['native_review']);self.assertEqual(review['approved_locales'],[])
   for item in review['rows']:
    for identity in item['record_ids']:
     self.assertNotIn(identity,seen);seen.add(identity);record=raw[identity];self.assertEqual(item['translation_hash'],hashlib.sha256(record['translation'].encode()).hexdigest())
     if record['candidate']=='model':
      cases=json.loads((DATA/'findings-v31.json').read_text()).get('forward_cases',[]);observed=next((c for c in cases if identity in c['observed_record_ids']),None)
      if observed:self.assertEqual(item['scores'],observed['scores']);self.assertFalse(review['full_gate']['ru']['passed'])
      else:self.assertEqual(set(item['scores'].values()),{3})
      self.assertFalse(item['data_contract_unproved']);self.assertEqual(record['translation_origin'],'reviewed-memory');self.assertTrue(all(pilot.typed_record_evidence(record)['forward'].values()))
  self.assertEqual(seen,set(raw))

 def test_all_current_forward_defects_are_exposed_by_common_review_api(self):
  for case in json.loads((DATA/'findings-v31.json').read_text())['forward_cases']:
   with self.subTest(key=case['key']):self.assertIn(case['issue'],pilot.semantic_issues(case['key'],case['source_hash'],case['translation'],'ru'))

 def test_current_negative_forward_cases_cannot_be_regraded_as_passed(self):
  import copy
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v31/madlad.jsonl').read_text().splitlines())};review=json.loads((DATA/'review-context-v31-full.json').read_text());pilot.audit_review_warnings(review,records)
  for case in json.loads((DATA/'findings-v31.json').read_text())['forward_cases']:
   identity=next(i for i in case['observed_record_ids']if records[i]['candidate']=='model')
   for mutation in ['perfect','passed']:
    changed=copy.deepcopy(review)
    if mutation=='perfect':next(j for j in changed['rows']if identity in j['record_ids'])['scores']=dict(meaning=3,numbers_negations=3,naturalness=3)
    else:changed['full_gate']['ru']['passed']=True
    with self.subTest(key=case['key'],mutation=mutation),self.assertRaises(ValueError):pilot.audit_review_warnings(changed,records)
 def test_explicit_four_retirements_preserve_old_positive_judgments_and_are_not_imported(self):
  data=json.loads((DATA/'next-v32-ru-plan.json').read_text());self.assertEqual(data['exact_current_positive_targets'],210);self.assertEqual(data['retired_targets'],4);self.assertFalse(data['imported']);self.assertEqual(data['approved_locales'],[])
  for item in data['required_repairs']:
   self.assertTrue(item['withdrawn_for_future_reuse']);self.assertEqual(set(item['prior_positive_source_import']['source_judgment']['scores'].values()),{3});self.assertLess(min(item['negative_current_scores'].values()),3);self.assertFalse(item['draft_imported']);self.assertTrue(all(item['draft_typed_forward_checks'].values()))
