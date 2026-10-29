"""Finite source-bound variants cannot widen Han, data or cache acceptance."""
import copy,hashlib,importlib.util,json,shutil,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from test_translation_chinese_proof_tamper_v25 import skeleton as old_skeleton
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def skeleton(root):
 old_skeleton(root)
 for directory in ['numeric-sources/context-v26','checkpoints/context-v25']:
  dst=root/'docs/quality/translation-pilot'/directory;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copytree(DATA/directory,dst)
 shutil.copyfile(DATA/'correction-v26-plan.json',root/'docs/quality/translation-pilot/correction-v26-plan.json')
class ChineseVariantsV26Test(unittest.TestCase):
 def test_seven_bound_current_variants_pass_only_the_new_policy(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines())};registry=json.loads((DATA/'unproved-data-v25-full.json').read_text());self.assertEqual(len(registry['rows']),7)
  for item in registry['rows']:
   row=records[item['record_id']]
   with self.subTest(key=row['key']):
    self.assertFalse(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','zh-CN','context-v25')['quantities'])
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','zh-CN','context-v26').values()))
    self.assertTrue(pilot.chinese_quantity_unproved_v25(row))
  contracts=pilot.v26_quantity_contracts()
  for text,locale in [('使用一百块方格。','zh-CN'),('Use eleven unrelated panels.','en')]:self.assertIsNone(pilot.numeric_data_zh_v26(text,locale,contracts))
  self.assertIsNone(pilot.numeric_data('1','zh-CN'));self.assertIsNone(pilot.numeric_data('1','id'))
 def test_warm_cache_and_rehashed_proofs_reject_changed_sources_and_data(self):
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);skeleton(root)
   with patch.object(pilot,'ROOT',root):
    pilot.v26_quantity_contracts()
    for relative in ['docs/quality/translation-pilot/numeric-sources/context-v26/manifest.json','docs/quality/translation-pilot/numeric-sources/context-v26/bound-contracts.json','docs/quality/translation-pilot/correction-v26-plan.json','docs/quality/translation-pilot/checkpoints/context-v25/madlad.jsonl','docs/quality/translation-pilot/numeric-sources/context-v25/manifest.json','src/markets-no-ch/shikaku-copy-en.mjs']:
     file=root/relative;old=file.read_bytes();file.write_bytes(old+b' ')
     with self.subTest(path=relative),self.assertRaises(ValueError):pilot.v26_quantity_contracts()
     file.write_bytes(old);pilot.v26_quantity_contracts()
    folder=root/'docs/quality/translation-pilot/numeric-sources/context-v26';file=folder/'bound-contracts.json';data=json.loads(file.read_text());entry=next(e for e in data['entries']if e['evidence']['kind']=='observed');entry['source_text']=entry['text'];entry['source_text_sha256']=entry['text_sha256'];entry['evidence']['source_field']=entry['evidence']['target_field'];file.write_text(json.dumps(data,ensure_ascii=False));manifest=json.loads((folder/'manifest.json').read_text());manifest['contracts_sha256']=hashlib.sha256(file.read_bytes()).hexdigest();(folder/'manifest.json').write_text(json.dumps(manifest));policy=copy.deepcopy(pilot.POLICIES['context-v26']);policy['numeric_profile']['manifest_sha256']=hashlib.sha256((folder/'manifest.json').read_bytes()).hexdigest()
    with patch.dict(pilot.POLICIES,{'context-v26':pilot.freeze_policy(policy)}),self.assertRaises(ValueError):pilot.v26_quantity_contracts()
 def test_changed_numbers_coordinates_opaque_tokens_and_truncation_stay_raw_and_rejected(self):
  records=list(map(json.loads,(DATA/'checkpoints/context-v25/madlad.jsonl').read_text().splitlines()));row=next(r for r in records if r['candidate']=='model'and r['key']=='dxf-viewer.fields.firstY')
  for raw,cut in [(row['translation']+' 11',False),(row['translation']+' {intruder}',False),(row['translation'],True)]:
   with self.subTest(raw=raw,cut=cut):
    value=pilot.translate_complete_sentences_v26([row['model_input']],lambda texts:[(raw,cut)],'en','zh-CN')[0]
    self.assertIsNone(value[0]);self.assertEqual(value[1],raw);self.assertEqual(value[2],cut)
  row=next(r for r in records if r['candidate']=='model'and r['key']=='dxf-viewer.example');parts=row['forward_segments'];outputs=[(p['output'].replace('(10, 0)','(11, 0)'),False)for p in parts]
  value=pilot.translate_complete_sentences_v26([row['model_input']],lambda texts:outputs,'en','zh-CN')[0];self.assertIsNone(value[0]);self.assertIn('(11, 0)',value[1])
 def test_cached_proofs_and_old_targets_are_immutable(self):
  contracts=pilot.v26_quantity_contracts()
  with self.assertRaises(TypeError):contracts['quantities']['forged']=()
  with self.assertRaises(TypeError):contracts['pairs']=frozenset()
  with self.assertRaises(TypeError):contracts['base']['quantities']['forged']=()
  policy=copy.deepcopy(pilot.POLICIES['context-v26']);key=next(iter(policy['reviewed_memory']));locale=next(iter(policy['reviewed_memory'][key]['translations']));policy['reviewed_memory'][key]['translations'][locale]+=' changed'
  with patch.dict(pilot.POLICIES,{'context-v26':policy}),self.assertRaises(ValueError):pilot.v26_quantity_contracts()
if __name__=='__main__':unittest.main()
