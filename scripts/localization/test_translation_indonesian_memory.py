"""Reproduce actual v19 callbacks, then use exact source-bound Indonesian memory."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
PITCH='Tidak. Kontrol pitch sederhana ini mengubah kecepatan pemutaran. Pitch yang lebih rendah membuat audio diputar lebih lambat. Pitch yang lebih tinggi membuat audio diputar lebih cepat.'
EXPECTED={
 'voice-changer.fields.loaded':'Audio didekode secara lokal. Durasi: {duration} detik.',
 'dxf-viewer.faq.2.a':'Hanya jika DXF menyatakan satuannya dalam milimeter. Jika tidak, penampil memakai satuan yang dinyatakan atau menandai hasil pengukuran sebagai satuan gambar.',
 'dxf-viewer.fields.resetView':'Sesuaikan tampilan agar seluruh gambar terlihat',
 'dxf-viewer.fields.cancel':'Batalkan pemuatan',
 'dxf-viewer.fields.unsupported':'Berkas tidak didukung. Pilih berkas .dxf berformat ASCII.',
 'voice-changer.fields.faq2a':PITCH,
 'voice-changer.faq.1.a':PITCH,
 'dxf-viewer.fields.measurement':'Ukur jarak',
}
class IndonesianMemoryTest(unittest.TestCase):
 def test_historical_record_flags_and_policy_digests_are_unchanged(self):
  proof=json.loads((DATA/'regression-v20-evidence.json').read_text())
  for policy,value in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),value)
  original=pilot.SEMANTIC_REGRESSIONS[:proof['fixture_prefix_count']]
  self.assertEqual(pilot.digest(original),proof['fixture_prefix_digest'])
  flags={}
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',original):
   for path in sorted((DATA/'checkpoints').rglob('*.jsonl')):
    for row in map(json.loads,path.read_text().splitlines()):
     if row.get('inference_policy','baseline') not in {'baseline',*proof['historical_policy_digests']}:continue
     pilot.validate_record(row);flags[row['record_id']]=pilot.record_flags(row)
  self.assertEqual(len(flags),13577);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])

 def observed(self):
  records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v19/madlad.jsonl').read_text().splitlines())}
  review=json.loads((DATA/'review-context-v19-references.json').read_text())
  return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values())<3]

 def test_actual_seven_v19_callbacks_and_traces_before_exact_memory(self):
  rows=self.observed();self.assertEqual(len(rows),7)
  self.assertEqual({r['key'] for r in rows},set(EXPECTED)-{'voice-changer.faq.1.a'})
  for row in rows:
   with self.subTest(key=row['key']):
    self.assertIsNone(pilot.reviewed_memory(row,'id','context-v19'))
    self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'id'))
    traces=[]
    def callback(parts):
     self.assertEqual(parts,[p['input'] for p in row['forward_segments']])
     return [(p['output'],p['truncated']) for p in row['forward_segments']]
    replay=pilot.translate_complete_sentences_v19([row['model_input']],callback,'en','id',traces)
    self.assertEqual(replay[0][1],row['raw_translation']);self.assertEqual(traces[0],row['forward_segments'])
    values,traces,memory=pilot.forward_with_memory([row],'id','context-v20',lambda *args:self.fail('Exact memory must avoid model callback'))
    self.assertEqual(values,[(EXPECTED[row['key']],EXPECTED[row['key']],False)])
    self.assertEqual(traces,[None]);self.assertEqual(memory,[EXPECTED[row['key']]])
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],memory[0],'en','id','context-v20').values()))
    self.assertFalse(pilot.semantic_issues(row['key'],row['source_hash'],memory[0],'id'))

 def test_inherited_205_targets_inputs_and_eight_context_bound_additions(self):
  old,new=pilot.POLICIES['context-v19'],pilot.POLICIES['context-v20']
  self.assertEqual(old['entries'],new['entries']);self.assertEqual(old['numeric_profile'],new['numeric_profile'])
  self.assertEqual(sum(len(e['translations']) for e in old['reviewed_memory'].values()),205)
  for key,entry in old['reviewed_memory'].items():
   for locale,value in entry['translations'].items():self.assertEqual(new['reviewed_memory'][key]['translations'][locale],value)
  self.assertEqual(sum(len(e['translations']) for e in new['reviewed_memory'].values()),213)
  added={k:e for k,e in new['reviewed_memory'].items() if 'id' in e['translations']};self.assertEqual(set(added),set(EXPECTED))
  for key,entry in added.items():
   self.assertEqual(entry['translations']['id'],EXPECTED[key]);self.assertEqual(entry['source_hash'],hashlib.sha256(entry['source'].encode()).hexdigest())
  self.assertEqual(added['voice-changer.fields.faq2a']['source'],added['voice-changer.faq.1.a']['source'])
  self.assertNotEqual(added['voice-changer.fields.faq2a']['context'],added['voice-changer.faq.1.a']['context'])
  self.assertIsNone(pilot.numeric_data('25 MB','id'))
  self.assertFalse(all(pilot.typed_data_checks('25 MB','25 MB','en','id').values()))
  self.assertIn('context-v20',pilot.TYPED_POLICIES)

 def test_changed_source_hash_or_context_never_reuses_memory(self):
  policy=pilot.POLICIES['context-v20']
  for key in EXPECTED:
   entry=policy['reviewed_memory'][key];unit={'key':key,**{k:entry[k] for k in ['source','source_hash','context']}}
   for field in ['source','source_hash','context']:
    changed={**unit,field:unit[field]+' changed'}
    with self.subTest(key=key,field=field),self.assertRaises(ValueError):pilot.reviewed_memory(changed,'id','context-v20')

 def test_invalid_memory_keeps_raw_and_never_infers_or_repairs(self):
  policy='context-v20';changed=copy.deepcopy(pilot.POLICIES[policy])
  key='voice-changer.fields.loaded';entry=changed['reviewed_memory'][key];bad=EXPECTED[key].replace('{duration}','{waktu}')
  entry['translations']['id']=bad;unit={'key':key,**{k:entry[k] for k in ['source','source_hash','context']}}
  with patch.dict(pilot.POLICIES,{policy:changed}):
   values,traces,memory=pilot.forward_with_memory([unit],'id',policy,lambda *args:self.fail('No fallback'))
   self.assertEqual(values,[(None,bad,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[bad])
  for bad in ['Batas 2,5 MB.','Batas 25² MB.','Batas 25 ribu MB.']:
   self.assertFalse(all(pilot.policy_typed_data_checks('Limit 25 MB.',bad,'en','id',policy).values()))

if __name__=='__main__':unittest.main()
