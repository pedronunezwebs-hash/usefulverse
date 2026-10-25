"""Finite witnesses and imported memories reject forged source/context/provenance even when warm."""
import copy,hashlib,importlib.util,json,shutil,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
from test_translation_chinese_variants_v26 import skeleton as previous_skeleton
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def skeleton(root):
 previous_skeleton(root)
 for folder in ['numeric-sources/context-v27','checkpoints/context-v26']:
  target=root/'docs/quality/translation-pilot'/folder;target.parent.mkdir(parents=True,exist_ok=True);shutil.copytree(DATA/folder,target)
 names=['reviewed-memory-v27-import.json',*json.loads((DATA/'numeric-sources/context-v27/manifest.json').read_text())['review_sha256']]
 for name in names:shutil.copyfile(DATA/name,root/'docs/quality/translation-pilot'/name)
class FiniteV27Test(unittest.TestCase):
 def test_bound_numeric_texts_do_not_expand_Han_English_articles_or_global_locales(self):
  contracts=pilot.v27_quantity_contracts();self.assertEqual(len(contracts['english_quantities']),2)
  for text,locale in [('需要一百个方格。','zh-CN'),('A rectangle with unrelated data.','en'),('Use eleven panels.','en')]:self.assertEqual(pilot.numeric_data_zh_v27(text,locale,contracts),pilot.numeric_data_zh_v26(text,locale,contracts['base']))
  self.assertIsNone(pilot.numeric_data('1','zh-CN'));self.assertIsNone(pilot.numeric_data('1','id'))
 def test_warm_cache_revalidates_every_pinned_current_source_review_import_and_base(self):
  manifest=json.loads((DATA/'numeric-sources/context-v27/manifest.json').read_text())
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);skeleton(root)
   with patch.object(pilot,'ROOT',root):
    pilot.v27_quantity_contracts()
    paths=list(manifest['paths'].values())+['docs/quality/translation-pilot/numeric-sources/context-v27/'+x for x in ['manifest.json','bound-contracts.json']]+['docs/quality/translation-pilot/'+x for x in manifest['review_sha256']]
    for path in paths:
     file=root/path;before=file.read_bytes();file.write_bytes(before+b' ')
     with self.subTest(path=path),self.assertRaises(ValueError):pilot.v27_quantity_contracts()
     file.write_bytes(before);pilot.v27_quantity_contracts()
 def test_rehashed_target_as_source_and_rewritten_memory_provenance_remain_rejected(self):
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);skeleton(root)
   with patch.object(pilot,'ROOT',root):
    pilot.v27_quantity_contracts();folder=root/'docs/quality/translation-pilot/numeric-sources/context-v27';file=folder/'bound-contracts.json';data=json.loads(file.read_text());data['entries'][0]['source_text']=data['entries'][0]['text'];data['entries'][0]['source_text_sha256']=data['entries'][0]['text_sha256'];file.write_text(json.dumps(data,ensure_ascii=False));manifest=json.loads((folder/'manifest.json').read_text());manifest['contracts_sha256']=hashlib.sha256(file.read_bytes()).hexdigest();(folder/'manifest.json').write_text(json.dumps(manifest));policy=copy.deepcopy(pilot.POLICIES['context-v27']);policy['numeric_profile']['manifest_sha256']=hashlib.sha256((folder/'manifest.json').read_bytes()).hexdigest()
    with patch.dict(pilot.POLICIES,{'context-v27':pilot.freeze_policy(policy)}),self.assertRaises(ValueError):pilot.v27_quantity_contracts()
  policy=copy.deepcopy(pilot.POLICIES['context-v27']);item=next(x for x in policy['reviewed_memory'].values()if 'selected_record_id'in x.get('target_review_provenance',{}).get('zh-CN',{}));item['target_review_provenance']['zh-CN']['selected_record_id']='forged'
  with patch.dict(pilot.POLICIES,{'context-v27':pilot.freeze_policy(policy)}),self.assertRaises(ValueError):pilot.v27_quantity_contracts()
 def test_corrupted_numbers_placeholders_and_truncation_stay_raw_rejected_and_proofs_immutable(self):
  row=next(r for r in map(json.loads,(DATA/'checkpoints/context-v26/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'and r['key']=='shikaku.example')
  for raw,cut in [(row['translation'].replace('6','11'),False),(row['translation']+' {intruder}',False),(row['translation'],True)]:
   with self.subTest(raw=raw,cut=cut):
    value=pilot.translate_complete_sentences_v27([row['model_input']],lambda texts:[(raw,cut)],'en','zh-CN')[0];self.assertIsNone(value[0]);self.assertEqual(value[1],raw);self.assertEqual(value[2],cut)
  contracts=pilot.v27_quantity_contracts()
  with self.assertRaises(TypeError):contracts['quantities']['forged']=()
  with self.assertRaises(TypeError):contracts['english_quantities']['forged']=()
  with self.assertRaises(TypeError):contracts['base']['quantities']['forged']=()
if __name__=='__main__':unittest.main()
