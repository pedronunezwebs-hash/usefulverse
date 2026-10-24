"""Known lexical quantities are hash-bound proofs, never a permissive Han default."""
import copy
import hashlib
import importlib.util
import json
import shutil
import tempfile
from pathlib import Path
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def observed():
 records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v22/madlad.jsonl').read_text().splitlines())}
 return [records[e['record_id']] for e in json.loads((DATA/'unproved-data-v22-references.json').read_text())['rows']]
class ChineseLexicalV23Test(unittest.TestCase):
 def valid(self,source,target):return all(pilot.policy_typed_data_checks(source,target,'en','zh-CN','context-v23').values())
 def test_all16_known_quantity_contracts_are_proved_but_v22_stays_unchanged(self):
  rows=observed();self.assertEqual(len(rows),16)
  for r in rows:
   with self.subTest(key=r['key'],candidate=r['candidate']):
    self.assertTrue(pilot.policy_typed_data_checks(r['source'],r['translation'],'en','zh-CN','context-v23')['quantities'])
    self.assertFalse(pilot.policy_typed_data_checks(r['source'],r['translation'],'en','zh-CN','context-v22')['quantities'])
    if r['forward_segments']:
     self.assertTrue(pilot.complete_sentence_evidence_valid_v23(r['forward_segments'],r['model_input'],r['raw_translation'],'en','zh-CN'))
  self.assertIsNone(pilot.numeric_data('25 MB','zh-CN'))
 def test_known_source_numbers_and_lexical_roles_cannot_change(self):
  changes=[('voice-changer.fields.tooLarge','25','250'),('shikaku.example','6个','7个'),('shikaku.example','6','8'),
   ('shikaku.fields.selectStart','一个','两个'),('shikaku.fields.undo','一个','两个'),('dxf-viewer.fields.invalidCoordinates','四','三'),
   ('dxf-viewer.fields.binary','二进制','三进制')]
  rows=observed()
  for key,old,new in changes:
   row=next(r for r in rows if r['key']==key and r['candidate']=='model');self.assertIn(old,row['translation'])
   with self.subTest(key=key,change=new):self.assertFalse(self.valid(row['source'],row['translation'].replace(old,new)))
 def test_unknown_han_and_unbound_english_word_numbers_fail_closed(self):
  for source,target in [('A quantity of four.','数量为四。'),('A quantity of four.','数量为4。'),('No quantities.','数量二十五。'),('Value 25 MB.','数量二十五MB。')]:
   with self.subTest(target=target):self.assertFalse(self.valid(source,target))
  self.assertTrue(self.valid('Value 25 MB.','数值25 MB。'))
 def test_opaque_tokens_units_and_versions_remain_strict(self):
  for source,target in [('Limit 25 MB.','限制25 GB。'),('Duration: {duration} seconds.','时长：{持续时间} 秒。'),('Use dxf-parser 1.1.2.','使用dxf-parser 1.2.2。')]:
   with self.subTest(target=target):self.assertFalse(self.valid(source,target))
 def test_loaded_proofs_are_whitespace_only_and_source_hash_bound(self):
  directory=DATA/'numeric-sources/context-v23';manifest=json.loads((directory/'manifest.json').read_text());data=json.loads((directory/'lexical-contracts.json').read_text())
  self.assertEqual(hashlib.sha256((directory/'lexical-contracts.json').read_bytes()).hexdigest(),manifest['lexical_contracts_sha256'])
  self.assertEqual(hashlib.sha256((pilot.ROOT/manifest['cldr_manifest']).read_bytes()).hexdigest(),manifest['cldr_manifest_sha256'])
  self.assertEqual(len(data['entries']),56)
  for entry in data['entries']:
   self.assertEqual(hashlib.sha256(entry['text'].encode()).hexdigest(),entry['text_sha256']);self.assertFalse(entry['native_review']);self.assertTrue(entry['evidence'])
  row=next(r for r in observed() if r['key']=='voice-changer.fields.tooLarge')
  self.assertTrue(self.valid(row['source'],row['translation'].replace('25 MB','25  MB')))
 def test_warmed_contract_cache_does_not_hide_tampered_file(self):
  original=pilot.ROOT
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);base=root/'docs/quality/translation-pilot';(base/'numeric-sources').mkdir(parents=True)
   for version in ['context-v22','context-v23']:shutil.copytree(DATA/'numeric-sources'/version,base/'numeric-sources'/version)
   (base/'checkpoints/context-v22').mkdir(parents=True);shutil.copyfile(DATA/'checkpoints/context-v22/madlad.jsonl',base/'checkpoints/context-v22/madlad.jsonl')
   with patch.object(pilot,'ROOT',root):
    self.assertTrue(self.valid('Choose an audio file first.','首先选择一个音频文件。'))
    file=base/'numeric-sources/context-v23/lexical-contracts.json';data=json.loads(file.read_text());data['entries'][0]['quantities']=[{'value':'999','suffix':'','count':1}];file.write_text(json.dumps(data,ensure_ascii=False))
    with self.assertRaisesRegex(ValueError,'contract'):self.valid('Choose an audio file first.','首先选择一个音频文件。')
 def test_policy_profile_tampering_is_rejected(self):
  changed=copy.deepcopy(pilot.POLICIES['context-v23']);changed['numeric_profile']['manifest_sha256']='0'*64
  with patch.dict(pilot.POLICIES,{'context-v23':changed}),self.assertRaisesRegex(ValueError,'numeric profile'):
   self.valid('Choose an audio file first.','首先选择一个音频文件。')

if __name__=='__main__':unittest.main()
