"""Speed up immutable versioned policy hashes without trusting stale mutable data."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)

class PolicyCacheTest(unittest.TestCase):
 def test_frozen_policy_hash_is_computed_once_and_keeps_original_digest(self):
  policy='context-v22';value=pilot.freeze_policy(copy.deepcopy(pilot.POLICIES[policy]))
  with patch.dict(pilot.POLICIES,{policy:value}),patch.object(pilot,'digest',wraps=pilot.digest) as digest:
   hashes=[pilot.policy_digest(policy) for _ in range(5)]
   self.assertEqual(digest.call_count,1)
   self.assertEqual(len(set(hashes)),1)
   self.assertEqual(hashes[0],hashlib.sha256(pilot.canonical(value).encode()).hexdigest())
 def test_mutable_policy_is_never_cached_across_in_place_edits(self):
  policy='context-v22';value=json.loads(pilot.canonical(pilot.POLICIES[policy]))
  with patch.dict(pilot.POLICIES,{policy:value}):
   before=pilot.policy_digest(policy);value['reviewed_memory'][next(iter(value['reviewed_memory']))]['source']='tampered'
   self.assertNotEqual(before,pilot.policy_digest(policy))
 def test_nested_dict_and_list_mutations_are_rejected(self):
  value=pilot.freeze_policy({'items':[{'source':'one','translations':{'zh-CN':'一'}}]})
  for action in [lambda:value.update({'new':1}),lambda:value['items'].append('bad'),lambda:value['items'].__setitem__(0,'bad'),
   lambda:value['items'][0]['translations'].__setitem__('zh-CN','二'),lambda:value['items'].clear(),lambda:value['items'].__imul__(2),lambda:value.pop('items')]:
   with self.subTest(action=action),self.assertRaises(TypeError):action()
  self.assertEqual(value,{'items':[{'source':'one','translations':{'zh-CN':'一'}}]})
 def test_deepcopy_is_mutable_and_independent(self):
  value=pilot.freeze_policy({'items':[{'source':'one'}]});changed=copy.deepcopy(value)
  changed['items'][0]['source']='two';changed['items'].append('three')
  self.assertEqual(value['items'][0]['source'],'one');self.assertNotEqual(pilot.digest(value),pilot.digest(changed))
 def test_loaded_policy_bytes_and_historical_hashes_are_unchanged(self):
  proof=json.loads((pilot.ROOT/'docs/quality/translation-pilot/regression-v23-evidence.json').read_text())
  for name,wanted in proof['historical_policy_digests'].items():
   with self.subTest(policy=name):self.assertEqual(pilot.policy_digest(name),wanted)
 def test_changed_policy_still_invalidates_a_real_checkpoint(self):
  row=next(map(json.loads,(pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v22/madlad.jsonl').read_text().splitlines()))
  policy=row['inference_policy'];changed=copy.deepcopy(pilot.POLICIES[policy]);changed['description']+=' changed'
  with patch.dict(pilot.POLICIES,{policy:changed}),self.assertRaisesRegex(ValueError,'Changed inference policy'):
   pilot.validate_record(row)

if __name__=='__main__':unittest.main()
