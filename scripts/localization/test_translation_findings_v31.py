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
     if record['candidate']=='model':self.assertEqual(set(item['scores'].values()),{3});self.assertFalse(item['data_contract_unproved']);self.assertEqual(record['translation_origin'],'reviewed-memory');self.assertTrue(all(pilot.typed_record_evidence(record)['forward'].values()))
  self.assertEqual(seen,set(raw))
