"""Replay the ten observed v16 defects; reviewed v17 memory keeps source/context exact."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec); spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
EXPECTED = {
    'dxf-viewer.faq.2.a': 'DXF에 단위가 밀리미터로 지정된 경우에만 그렇습니다. 그 외에는 뷰어가 지정된 단위를 사용하거나 측정값을 도면 단위로 표시합니다.',
    'dxf-viewer.fields.resetView': '도면 전체를 화면에 맞추기',
    'dxf-viewer.fields.unsupported': '지원하지 않는 파일입니다. ASCII 형식의 .dxf 파일을 선택하세요.',
    'shikaku.example': '6으로 표시된 단서는 정확히 여섯 칸을 덮는 직사각형 하나 안에 있어야 합니다.',
    'shikaku.fields.check': '퍼즐 확인',
    'shikaku.fields.reveal': '정답 보기',
    'voice-changer.fields.faq1a': '아니요. 브라우저는 선택한 오디오를 기기에서 디코딩하고 처리합니다. UsefulVerse는 녹음을 받지 않습니다.',
    'voice-changer.fields.faq2a': '아니요. 이 간단한 피치 조절은 재생 속도를 바꿉니다. 피치를 낮추면 재생이 느려지고, 높이면 빨라집니다.',
    'voice-changer.fields.load': '오디오를 로컬에서 불러오기',
    'voice-changer.fields.tooLarge': '크기가 25 MB 이하인 오디오 파일을 선택하세요.',
}

class KoreanMemoryTest(unittest.TestCase):
    def observed(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v16/madlad.jsonl').read_text().splitlines())}
        review = json.loads((DATA/'review-context-v16-references.json').read_text())
        return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values()) < 3]

    def test_all_ten_actual_callbacks_and_traces_replay_before_exact_memory_replacement(self):
        rows = self.observed(); self.assertEqual({r['key'] for r in rows}, set(EXPECTED))
        for row in rows:
            with self.subTest(key=row['key']):
                self.assertIsNone(pilot.reviewed_memory(row, 'ko', 'context-v16'))
                self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'ko'))
                def replay(texts, source, target, traces):
                    def callback(parts):
                        self.assertEqual(parts,[s['input'] for s in row['forward_segments']])
                        return [(s['output'],s['truncated']) for s in row['forward_segments']]
                    return pilot.translate_complete_sentences(texts,callback,source,target,traces)
                values,traces,memory = pilot.forward_with_memory([row],'ko','context-v16',replay)
                valid = all(pilot.typed_data_checks(row['model_input'],row['raw_translation'],'en','ko').values()) and pilot.complete_sentence_evidence_valid(row['forward_segments'],row['model_input'],row['raw_translation'],'en','ko')
                self.assertEqual(values,[(row['raw_translation'] if valid else None,row['raw_translation'],False)])
                self.assertEqual(traces,[row['forward_segments']]); self.assertEqual(memory,[None])
                text = EXPECTED[row['key']]
                values,traces,memory = pilot.forward_with_memory([row],'ko','context-v17',lambda *args:self.fail('Reviewed memory must not claim model inference'))
                self.assertEqual(values,[(text,text,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[text])
                self.assertTrue(all(pilot.typed_data_checks(row['source'],text,'en','ko').values()))
                self.assertFalse(pilot.semantic_issues(row['key'],row['source_hash'],text,'ko'))
                for field,value in [('source',row['source']+' Changed.'),('source_hash','0'*64),('context','different-meaning')]:
                    with self.assertRaises(ValueError):pilot.reviewed_memory({**row,field:value},'ko','context-v17')
                self.assertIsNone(pilot.reviewed_memory(row,'ja','context-v17'))

    def test_both_full_pitch_faq_contexts_and_all_inherited_targets_stay_exact(self):
        old,new = pilot.POLICIES['context-v16'],pilot.POLICIES['context-v17']
        self.assertEqual(old['entries'],new['entries']);self.assertEqual(old['numeric_grammar'],new['numeric_grammar'])
        for key,entry in old['reviewed_memory'].items():
            for field,value in entry.items():
                if field!='translations':self.assertEqual(value,new['reviewed_memory'][key][field])
            for locale,text in entry['translations'].items():self.assertEqual(text,new['reviewed_memory'][key]['translations'][locale])
        self.assertEqual(sum(len(e['translations']) for e in new['reviewed_memory'].values())-sum(len(e['translations']) for e in old['reviewed_memory'].values()),11)
        source='No. This lightweight pitch control changes playback rate, so a lower pitch plays slower and a higher pitch plays faster.'
        for key,context in [('voice-changer.fields.faq2a','fields.faq2a'),('voice-changer.faq.1.a','faq.1.a')]:
            unit=dict(key=key,context=context,source=source,source_hash=hashlib.sha256(source.encode()).hexdigest())
            self.assertEqual(len(pilot.complete_sentence_parts(pilot.translation_input(unit,'context-v17'))),3)
            self.assertEqual(pilot.reviewed_memory(unit,'ko','context-v17'),EXPECTED['voice-changer.fields.faq2a'])
            with self.assertRaises(ValueError):pilot.reviewed_memory({**unit,'context':'another-faq'},'ko','context-v17')
        self.assertEqual(pilot.numeric_data(EXPECTED['shikaku.example'],'ko'),pilot.numeric_data('A clue marked 6 belongs inside one rectangle that covers exactly six squares.','en'))
        self.assertNotIn('미만',EXPECTED['voice-changer.fields.tooLarge']);self.assertIn('25 MB 이하',EXPECTED['voice-changer.fields.tooLarge'])

    def test_new_memory_cannot_bypass_typed_data_or_fall_back_to_inference(self):
        policy='context-v17';source='Use Web Audio 1.1.2 for 2D from (-1.5, 0) to (10, 0), with 30 MB and {count}.'
        good='Web Audio 1.1.2를 사용해 2D에서 (-1.5, 0)부터 (10, 0)까지, 30 MB와 {count}를 사용하세요.'
        unit=dict(key='independent.memory',context='details',source=source,source_hash=hashlib.sha256(source.encode()).hexdigest())
        self.assertTrue(all(pilot.typed_data_checks(source,good,'en','ko').values()))
        changed=copy.deepcopy(pilot.POLICIES[policy])
        for a,b in [('Web Audio','audio web'),('1.1.2','1.2.2'),('2D','3D'),('(-1.5, 0)','(1.5, 0)'),('30 MB','10 MB'),('{count}','{value}')]:
            raw=good.replace(a,b);changed['reviewed_memory'][unit['key']]={**unit,'translations':{'ko':raw}}
            with patch.dict(pilot.POLICIES,{policy:changed}),self.subTest(damage=a):
                values,traces,memory=pilot.forward_with_memory([unit],'ko',policy,lambda *args:self.fail('Invalid memory may not fall back'))
                self.assertEqual(values,[(None,raw,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[raw])
        self.assertFalse(all(pilot.typed_data_checks('25 MB','25 MB','en','id').values()))

    def test_new_policy_keeps_memory_provenance_and_complete_sentence_contract(self):
        row=copy.deepcopy(self.observed()[0]);policy='context-v17';text=pilot.reviewed_memory(row,'ko',policy)
        row.update(inference_policy=policy,policy_digest=pilot.policy_digest(policy),translation=text,raw_translation=text,translation_origin='reviewed-memory',forward_segments=None,memory_digest=pilot.digest(pilot.POLICIES[policy]['reviewed_memory'][row['key']]))
        row['typed_data_evidence']=pilot.typed_record_evidence(row);pilot.validate_record(row)
        for field,value in [('translation_origin','model'),('memory_digest','0'*64),('translation',text+' X'),('forward_segments',[])]:
            with self.assertRaises(ValueError):pilot.validate_record({**row,field:value})
        row.update(key='independent.sentences',source='First sentence. Second sentence.',model_input='First sentence. Second sentence.',translation='첫 문장입니다. 두 번째 문장입니다.',raw_translation='첫 문장입니다. 두 번째 문장입니다.',translation_origin='model',forward_segments=[dict(kind='prose',input='First sentence. Second sentence.',output='첫 문장입니다. 두 번째 문장입니다.',truncated=False,leading_space='',trailing_space='')])
        self.assertTrue(pilot.record_flags(row)['forward_sentence_evidence'])

if __name__=='__main__':unittest.main()
