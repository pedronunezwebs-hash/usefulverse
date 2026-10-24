"""Reproduce the actual v23 whole-input rejection before the independent v24 fix."""
import copy,hashlib,importlib.util,json,unittest,subprocess,tempfile
from pathlib import Path
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def actual():return next(r for r in map(json.loads,(DATA/'checkpoints/context-v23/madlad.jsonl').read_text().splitlines()) if r['candidate']=='model' and r['key']=='shikaku.fields.faq.1.a')
class ChineseSourceProofV24Test(unittest.TestCase):
 def test_actual_callback_v23_rejected_v24_accepts_exact_raw_without_repair(self):
  row=actual();before=copy.deepcopy(row)
  def replay(parts):
   self.assertEqual(parts,[s['input'] for s in row['forward_segments']]);return [(s['output'],s['truncated']) for s in row['forward_segments']]
  traces=[];self.assertEqual(pilot.translate_complete_sentences_v23([row['model_input']],replay,'en','zh-CN',traces),[(None,row['raw_translation'],False)])
  candidate=getattr(pilot,'translate_complete_sentences_v24',pilot.translate_complete_sentences_v23);traces=[]
  self.assertEqual(candidate([row['model_input']],replay,'en','zh-CN',traces),[(row['raw_translation'],row['raw_translation'],False)])
  self.assertEqual(traces,[row['forward_segments']]);self.assertEqual(row,before);self.assertFalse(row['marker_restore_ok'])
 def test_all214_sources_complete_inputs_and_sentences_have_quantity_proof(self):
  snap=json.loads((DATA/'numeric-sources/context-v24/source-snapshot.json').read_text());self.assertEqual(len(snap['units']),214)
  contracts=getattr(pilot,'v24_quantity_contracts',pilot.v23_quantity_contracts)();count=0;gaps=[]
  for unit in snap['units']:
   self.assertTrue(all(pilot.policy_typed_data_checks(unit['source'],pilot.translation_input(unit,'context-v24'),'en','en','context-v24').values()),unit['key'])
   for whole in [unit['source'],pilot.translation_input(unit,'context-v23')]:
    for text in [whole,*[part[1] for part in pilot.complete_sentence_parts(whole)]]:
     count+=1
     if pilot.numeric_data_zh_v23(text,'en',contracts) is None:gaps.append((unit['key'],text))
  self.assertEqual(count,1004);self.assertEqual(gaps,[])
 def test_snapshot_matches_fresh_real_extractor(self):
  snapshot=json.loads((DATA/'numeric-sources/context-v24/source-snapshot.json').read_text())
  with tempfile.TemporaryDirectory() as temp:
   out=Path(temp)/'corpus.json'
   subprocess.run(['node',str(pilot.ROOT/'scripts/localization/pilot-corpus.mjs'),str(out)],check=True,capture_output=True,cwd=pilot.ROOT)
   current=json.loads(out.read_text());self.assertEqual(snapshot['corpus_digest'],current['sourceDigest'])
   self.assertEqual(snapshot['units'],[{k:u[k] for k in ['key','tool','context','source','source_hash']} for u in current['units']])
 def test_memory_controlled_inputs_and_numeric_global_routes_remain_unchanged(self):
  self.assertIn('context-v24',pilot.POLICIES);old,new=pilot.POLICIES['context-v23'],pilot.POLICIES['context-v24']
  self.assertEqual(new['reviewed_memory'],old['reviewed_memory']);self.assertEqual(new['entries'],old['entries']);self.assertEqual(sum(len(v['translations']) for v in new['reviewed_memory'].values()),274)
  for locale in ['zh-CN','id']:self.assertIsNone(pilot.numeric_data('1',locale))
 def test_unknown_or_altered_numbers_are_blocked_and_raw_output_stays_visible(self):
  translate=getattr(pilot,'translate_complete_sentences_v24',pilot.translate_complete_sentences_v23);r=actual()
  for raw in [r['raw_translation'].replace('一个','两个'),'使用两块方格。','使用一百块方格。','Use eleven squares.']:
   with self.subTest(raw=raw):
    values=translate([r['model_input']],lambda parts:[(raw,False) for _ in parts],'en','zh-CN')
    self.assertIsNone(values[0][0]);self.assertIn(raw,values[0][1])
if __name__=='__main__':unittest.main()
