"""A reviewed target cannot become its own purported English source proof."""
import copy,hashlib,importlib.util,json,shutil,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def skeleton(root):
 for d in ['numeric-sources/context-v22','numeric-sources/context-v23','numeric-sources/context-v24','numeric-sources/context-v25','checkpoints/context-v22','checkpoints/context-v23','checkpoints/context-v24']:
  dst=root/'docs/quality/translation-pilot'/d;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copytree(DATA/d,dst)
 for path in ['docs/quality/translation-pilot/correction-v25-plan.json','scripts/localization/pilot-corpus.mjs','src/markets-no-ch/voice-changer-copy-en.mjs','src/markets-no-ch/shikaku-copy-en.mjs','src/markets-no-ch/dxf-viewer-copy-en.mjs']:
  dst=root/path;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(pilot.ROOT/path,dst)
def rehash(root):
 folder=root/'docs/quality/translation-pilot/numeric-sources/context-v25';manifest=json.loads((folder/'manifest.json').read_text());manifest['contracts_sha256']=hashlib.sha256((folder/'bound-contracts.json').read_bytes()).hexdigest();(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False));policy=copy.deepcopy(pilot.POLICIES['context-v25']);policy['numeric_profile']['manifest_sha256']=hashlib.sha256((folder/'manifest.json').read_bytes()).hexdigest();return pilot.freeze_policy(policy)
class ChineseProofTamperV25Test(unittest.TestCase):
 def test_rehashed_target_cannot_impersonate_a_source_field(self):
  base=pilot.v24_quantity_contracts()
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);skeleton(root);file=root/'docs/quality/translation-pilot/numeric-sources/context-v25/bound-contracts.json';data=json.loads(file.read_text());entry=next(e for e in data['entries']if e['evidence']['kind']=='observed'and e['evidence']['source_field'].startswith('forward_segments.')and not e['quantities']and pilot.numeric_data_zh_v24(e['text'],'en',base)is not None)
   entry['source_text']=entry['text'];entry['source_text_sha256']=entry['text_sha256'];entry['evidence']['source_field']=entry['evidence']['target_field'];file.write_text(json.dumps(data,ensure_ascii=False));policy=rehash(root)
   with patch.object(pilot,'ROOT',root),patch.dict(pilot.POLICIES,{'context-v25':policy}),self.assertRaises(ValueError):pilot.v25_quantity_contracts()
 def test_warm_cache_revalidates_every_pinned_dependency(self):
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);skeleton(root)
   paths=['numeric-sources/context-v25/manifest.json','numeric-sources/context-v25/bound-contracts.json','correction-v25-plan.json','checkpoints/context-v24/madlad.jsonl','numeric-sources/context-v24/source-snapshot.json','numeric-sources/context-v23/DerivedNumericValues.txt']
   with patch.object(pilot,'ROOT',root):
    pilot.v25_quantity_contracts()
    for path in paths:
     file=root/'docs/quality/translation-pilot'/path;original=file.read_bytes();file.write_bytes(original+b' ')
     with self.subTest(path=path),self.assertRaises(ValueError):pilot.v25_quantity_contracts()
     file.write_bytes(original);pilot.v25_quantity_contracts()
    file=root/'src/markets-no-ch/shikaku-copy-en.mjs';original=file.read_bytes();file.write_bytes(original+b' ')
    with self.assertRaises(ValueError):pilot.v25_quantity_contracts()
 def test_rehashed_context_text_quantity_and_sentence_pairing_are_still_bound(self):
  for mutation in ['context','text','quantity','pair']:
   with self.subTest(mutation=mutation),tempfile.TemporaryDirectory()as tmp:
    root=Path(tmp);skeleton(root);file=root/'docs/quality/translation-pilot/numeric-sources/context-v25/bound-contracts.json';data=json.loads(file.read_text());entry=next(e for e in data['entries']if e['evidence']['kind']=='observed'and e['evidence']['source_field'].startswith('forward_segments.'))
    if mutation=='context':entry['evidence']['context']='unrelated.context'
    elif mutation=='text':entry['text']+=' 11';entry['text_sha256']=hashlib.sha256(entry['text'].encode()).hexdigest()
    elif mutation=='quantity':entry['quantities']=[{'value':'11','suffix':'','count':1}]
    else:entry['evidence']['target_field']='forward_segments.1.output'
    file.write_text(json.dumps(data,ensure_ascii=False));policy=rehash(root)
    with patch.object(pilot,'ROOT',root),patch.dict(pilot.POLICIES,{'context-v25':policy}),self.assertRaises(ValueError):pilot.v25_quantity_contracts()
 def test_raw_changed_numbers_tokens_and_truncation_remain_rejected(self):
  records=list(map(json.loads,(DATA/'checkpoints/context-v24/madlad.jsonl').read_text().splitlines()));row=next(r for r in records if r['candidate']=='model'and r['key']=='dxf-viewer.faq.1.q')
  for raw,cut in [(row['translation']+' 11',False),(row['translation']+' {intruder}',False),(row['translation'],True)]:
   with self.subTest(raw=raw,cut=cut):
    result=pilot.translate_complete_sentences_v25([row['model_input']],lambda parts:[(raw,cut)],'en','zh-CN')[0]
    self.assertIsNone(result[0]);self.assertEqual(result[1],raw);self.assertEqual(result[2],cut)
  contracts=pilot.v25_quantity_contracts()
  for text in ['使用一百块方格。','Use eleven unrelated panels.']:
   self.assertIsNone(pilot.numeric_data_zh_v25(text,'zh-CN'if text.startswith('使用')else'en',contracts))
 def test_returned_cached_proofs_are_deeply_immutable(self):
  contracts=pilot.v25_quantity_contracts();self.addCleanup(pilot._V25_QUANTITY_CACHE.clear)
  with self.assertRaises(TypeError):contracts['quantities']['forged unproved text']=()
  with self.assertRaises(TypeError):contracts['pairs']=frozenset({('unbound source','forged unproved text')})
  with self.assertRaises(TypeError):contracts['base']['quantities'][('zh-CN','forged unproved text')]=()
if __name__=='__main__':unittest.main()
