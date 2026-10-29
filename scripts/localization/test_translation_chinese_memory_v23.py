"""Replay every actual v22 defect before applying source/hash/context-bound v23 memory."""
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
EXPECTED={
'voice-changer.fields.loaded':'音频已在本地解码。时长：{duration} 秒。',
'voice-changer.fields.decodeFailed':'此浏览器无法解码该音频格式。请尝试 WAV 或 MP3。',
'voice-changer.fields.faq1a':'不。浏览器会在本地解码并处理所选音频。UsefulVerse 不会接收录音。',
'voice-changer.fields.faq2a':'不。这个简单的音高控制通过改变播放速率来调整音高。音高降低时，播放变慢；音高提高时，播放变快。',
'shikaku.fields.daily':'每日谜题',
'dxf-viewer.faq.2.a':'只有 DXF 声明以毫米为单位时，测量结果才以毫米表示。否则，查看器会使用文件声明的单位，或将测量结果标为绘图单位。',
'dxf-viewer.fields.unsupported':'不支持此文件。请选择 ASCII 格式的 .dxf 文件。',
'dxf-viewer.fields.measurement':'测量距离',
'dxf-viewer.fields.resetView':'调整视图以显示整个图形',
}
def observed():
 records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v22/madlad.jsonl').read_text().splitlines())}
 review=json.loads((DATA/'review-context-v22-references.json').read_text())
 return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values())<3]

class ChineseMemoryV23Test(unittest.TestCase):
 def test_all_nine_actual_callbacks_then_exact_memory_without_model_fallback(self):
  rows=observed();self.assertEqual(len(rows),9);self.assertEqual({r['key'] for r in rows},set(EXPECTED))
  for row in rows:
   with self.subTest(key=row['key']):
    self.assertIsNone(pilot.reviewed_memory(row,'zh-CN','context-v22'))
    self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'zh-CN'))
    def replay(parts):
     self.assertEqual(parts,[s['input'] for s in row['forward_segments']]);return [(s['output'],s['truncated']) for s in row['forward_segments']]
    traces=[];values=pilot.translate_complete_sentences_v22([row['model_input']],replay,'en','zh-CN',traces)
    self.assertEqual(values[0][1],row['raw_translation']);self.assertEqual(traces[0],row['forward_segments'])
    values,traces,memory=pilot.forward_with_memory([row],'zh-CN','context-v23',lambda *args:self.fail('No model fallback for exact reviewed memory'))
    self.assertEqual(memory,[EXPECTED[row['key']]]);self.assertEqual(values,[(memory[0],memory[0],False)]);self.assertEqual(traces,[None])
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],memory[0],'en','zh-CN','context-v23').values()))
 def test_existing263_targets_and_controlled_inputs_are_preserved(self):
  old,new=pilot.POLICIES['context-v22'],pilot.POLICIES['context-v23'];self.assertEqual(new['entries'],old['entries'])
  for key,value in old['reviewed_memory'].items():
   actual=new['reviewed_memory'][key]
   for field in ['source','source_hash','context']:self.assertEqual(actual[field],value[field])
   for locale,target in value['translations'].items():self.assertEqual(actual['translations'][locale],target)
  self.assertEqual(sum(len(e['translations']) for e in old['reviewed_memory'].values()),263)
  self.assertEqual(sum(len(e['translations']) for e in new['reviewed_memory'].values()),274)
  for duplicate,original in [('voice-changer.faq.0.a','voice-changer.fields.faq1a'),('voice-changer.faq.1.a','voice-changer.fields.faq2a')]:
   entry=new['reviewed_memory'][duplicate];self.assertEqual(entry['translations']['zh-CN'],EXPECTED[original]);self.assertEqual(entry['source_hash'],hashlib.sha256(entry['source'].encode()).hexdigest());self.assertNotEqual(entry['context'],new['reviewed_memory'][original]['context'])
 def test_changed_context_or_source_cannot_inherit_memory(self):
  row=observed()[0]
  for field,value in [('context','unrelated'),('source',row['source']+' Changed')]:
   changed={**row,field:value}
   with self.subTest(field=field),self.assertRaisesRegex(ValueError,'Stale'):pilot.reviewed_memory(changed,'zh-CN','context-v23')
 def test_missing_duration_marker_is_never_repaired_or_accepted(self):
  row=next(r for r in observed() if r['key']=='voice-changer.fields.loaded');changed=copy.deepcopy(pilot.POLICIES['context-v23']);raw=EXPECTED[row['key']].replace('{duration}','{持续时间}')
  changed['reviewed_memory'][row['key']]['translations']['zh-CN']=raw
  with patch.dict(pilot.POLICIES,{'context-v23':changed}):
   values,_,memory=pilot.forward_with_memory([row],'zh-CN','context-v23',lambda *args:self.fail('No fallback'))
   self.assertEqual(values,[(None,raw,False)]);self.assertEqual(memory,[raw])

if __name__=='__main__':unittest.main()
