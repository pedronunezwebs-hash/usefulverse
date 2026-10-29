"""Warm caches cannot hide stale source, context, rejection or numeric proof files."""
import copy,hashlib,importlib.util,json,shutil,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class SourceBindingV24Test(unittest.TestCase):
 def copied_root(self,temp):
  root=Path(temp);base=root/'docs/quality/translation-pilot';(base/'numeric-sources').mkdir(parents=True)
  for version in ['context-v22','context-v23','context-v24']:shutil.copytree(DATA/'numeric-sources'/version,base/'numeric-sources'/version)
  for version in ['context-v22','context-v23']:
   out=base/'checkpoints'/version;out.mkdir(parents=True);shutil.copyfile(DATA/'checkpoints'/version/'madlad.jsonl',out/'madlad.jsonl')
  snapshot=json.loads((DATA/'numeric-sources/context-v24/source-snapshot.json').read_text())
  for name in snapshot['files']:
   out=root/name;out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(pilot.ROOT/name,out)
  return root
 def test_every_warm_source_proof_dependency_rejects_changed_bytes(self):
  files=['docs/quality/translation-pilot/numeric-sources/context-v24/english-contracts.json','docs/quality/translation-pilot/numeric-sources/context-v24/source-snapshot.json','docs/quality/translation-pilot/numeric-sources/context-v24/manifest.json','src/markets-no-ch/shikaku-copy-en.mjs','docs/quality/translation-pilot/numeric-sources/context-v23/DerivedNumericValues.txt','docs/quality/translation-pilot/checkpoints/context-v23/madlad.jsonl']
  for name in files:
   with self.subTest(file=name),tempfile.TemporaryDirectory() as temp:
    root=self.copied_root(temp)
    with patch.object(pilot,'ROOT',root):
     pilot.v24_quantity_contracts();p=root/name;p.write_bytes(p.read_bytes()+b'\n')
     with self.assertRaises(ValueError):pilot.v24_quantity_contracts()
 def test_rehashed_proof_still_cannot_bind_to_wrong_context_or_text(self):
  for field,value in [('context','unrelated'),('field','source.sentence.99')]:
   with self.subTest(field=field),tempfile.TemporaryDirectory() as temp:
    root=self.copied_root(temp);folder=root/'docs/quality/translation-pilot/numeric-sources/context-v24';data=json.loads((folder/'english-contracts.json').read_text());data['entries'][0]['evidence'][0][field]=value;(folder/'english-contracts.json').write_text(json.dumps(data,ensure_ascii=False))
    manifest=json.loads((folder/'manifest.json').read_text());manifest['english_contracts_sha256']=hashlib.sha256((folder/'english-contracts.json').read_bytes()).hexdigest();(folder/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False))
    policy=copy.deepcopy(pilot.POLICIES['context-v24']);policy['numeric_profile']['manifest_sha256']=hashlib.sha256((folder/'manifest.json').read_bytes()).hexdigest()
    with patch.object(pilot,'ROOT',root),patch.dict(pilot.POLICIES,{'context-v24':policy}),self.assertRaises((ValueError,IndexError)):pilot.v24_quantity_contracts()
 def test_declared_cardinals_pronouns_and_unknown_words_are_distinct(self):
  c=pilot.v24_quantity_contracts();proof=json.loads((DATA/'numeric-sources/context-v24/english-contracts.json').read_text());self.assertEqual(len(proof['entries']),13)
  for entry in proof['entries']:
   key=entry['evidence'][0]['key'];value=pilot.numeric_data_zh_v24(entry['text'],'en',c);self.assertIsNotNone(value)
   expected=[] if key=='shikaku.fields.statusInvalid' else ['2'] if key in {'shikaku.fields.dragHelp','shikaku.fields.faq.1.q','dxf-viewer.fields.measureHelp'} else ['1']
   self.assertEqual(sorted(str(number) for (number,suffix),count in value[0].items() for _ in range(count)),expected)
  for text in ['Keep eleven files.','Keep half a file.','Keep one unreviewed file.']:
   with self.subTest(text=text):self.assertIsNone(pilot.numeric_data_zh_v24(text,'en',c))
  self.assertIsNone(pilot.numeric_data_zh_v24('选择两个未知方格。','zh-CN',c))
if __name__=='__main__':unittest.main()
