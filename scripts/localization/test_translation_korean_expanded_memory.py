"""Replay all 37 observed v17 full-scope defects before exact v18 memory correction."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
EXPECTED = {
    'dxf-viewer.example': '(0, 0)에서 (10, 0)까지의 선 길이는 10 도면 단위입니다. DXF에 단위 코드가 있으면 뷰어가 해당 코드를 읽습니다. 코드가 없으면 측정값을 도면 단위로 표시합니다.',
    'dxf-viewer.faq.1.a': '뷰어는 지원 콘텐츠에 나열된 개체 유형만 그립니다. 그 밖의 개체는 유형과 개수를 표시하며, 알리지 않고 대략적인 모양으로 대체하지 않습니다.',
    'dxf-viewer.faq.1.q': '일부 개체가 표시되지 않는 이유는 무엇인가요?',
    'dxf-viewer.fields.bounds': '도면 경계',
    'dxf-viewer.fields.clear': '불러온 도면 지우기',
    'dxf-viewer.fields.drawing': '도면 미리보기',
    'dxf-viewer.fields.hidden': '숨김',
    'dxf-viewer.fields.licenseLoglevel': 'loglevel MIT 라이선스',
    'dxf-viewer.fields.parsing': '도면 분석 중…',
    'dxf-viewer.fields.renderUnsupported': '이 브라우저에서 도면 미리보기를 만들 수 없습니다.',
    'dxf-viewer.fields.tooLarge': '이 파일은 10 MB 제한을 초과합니다. 더 작은 도면 파일을 선택하세요.',
    'dxf-viewer.fields.unit': '도면 단위',
    'dxf-viewer.fields.unitless': '도면 단위 (지정되지 않음)',
    'dxf-viewer.fields.units.11': '옹스트롬',
    'dxf-viewer.fields.units.14': '데시미터',
    'dxf-viewer.fields.units.15': '데카미터',
    'dxf-viewer.fields.units.8': '마이크로인치',
    'dxf-viewer.fields.units.9': '밀',
    'dxf-viewer.fields.visible': '표시',
    'dxf-viewer.intro': '이 기기에서 ASCII DXF 도면을 여세요. 도면을 이동하거나 확대하고, 레이어를 표시하거나 숨기고, 거리를 측정할 수 있습니다. 이 뷰어가 지원하는 도형을 내보낼 수 있습니다. 원본 파일은 업로드되지 않습니다.',
    'dxf-viewer.privacy': '이 브라우저에서 파일을 읽으며 업로드하지 않습니다. 기본 2D 선, 원, 호와 직선 선분으로 이루어진 폴리라인만 그립니다. 지원하지 않는 개체는 목록에 표시하며 측정과 내보내기에서 제외합니다.',
    'shikaku.description': 'Shikaku를 온라인에서 무료로 즐기세요. 각 격자를 숫자에 맞는 넓이의 직사각형으로 나누세요. 일일 퍼즐과 힌트, 새로운 보드를 이용할 수 있으며 게임 진행 상황은 이 기기에만 저장됩니다.',
    'shikaku.fields.dragHelp': '마주 보는 두 모서리를 클릭하거나 드래그하여 직사각형을 그리세요. 키보드에서는 Tab 키로 원하는 칸까지 이동한 뒤 Enter 키를 눌러 선택하세요.',
    'shikaku.fields.faq.2.a': '이 게임은 정답이 하나뿐임이 검증된 보드만 허용합니다.',
    'shikaku.fields.faq.3.a': '아니요. 진행 상황은 이 브라우저에만 저장되며, 사이트 데이터를 지우면 삭제됩니다.',
    'shikaku.fields.regions': '직사각형',
    'shikaku.fields.statusRevealed': '정답이 표시되었습니다. 다시 플레이하려면 새 퍼즐을 시작하세요.',
    'shikaku.fields.statusWon': '퍼즐을 풀었어요! 모든 칸을 올바르게 덮었습니다.',
    'shikaku.fields.statusWrong': '직사각형의 넓이와 단서를 확인하세요.',
    'shikaku.useTool': '퍼즐 풀기',
    'voice-changer.description': '피치를 바꾸고 라디오나 저음 목소리 효과를 적용해 보세요. 에코를 미리 듣고 처리한 오디오를 기기에서 내보낼 수 있습니다. 무료이며 개인정보를 보호하고, 파일을 업로드하지 않습니다.',
    'voice-changer.details': '브라우저가 선택한 오디오를 기기에서 디코딩하고 Web Audio 필터, 볼륨과 피치 및 재생 속도 조절, 선택적 에코 효과를 적용합니다. 그런 다음 다운로드할 WAV 파일을 만듭니다. 오디오는 서버로 전송되지 않습니다.',
    'voice-changer.faq.0.a': '아니요. 브라우저는 선택한 오디오를 기기에서 디코딩하고 처리합니다. UsefulVerse는 녹음을 받지 않습니다.',
    'voice-changer.fields.device': '더 원활하게 처리하려면 컴퓨터를 사용하는 것이 좋습니다. 속도와 메모리 사용량은 기기에 따라 달라집니다.',
    'voice-changer.fields.effect': '효과 프리셋',
    'voice-changer.fields.loading': '오디오를 기기에서 디코딩 중…',
    'voice-changer.limits': '이 가벼운 도구는 노래 전체가 아닌 짧은 클립용으로 설계되었습니다. 재생 속도를 조절해 피치를 바꾸므로 클립 길이와 목소리 톤이 함께 바뀝니다. 효과로는 자연스러운 새로운 정체성을 만들거나 목소리를 분리할 수 없습니다. 브라우저마다 같은 결과를 보장할 수도 없습니다.',
}


class KoreanExpandedMemoryTest(unittest.TestCase):
    def observed(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA/'checkpoints/context-v17/madlad.jsonl').read_text().splitlines())}
        review = json.loads((DATA/'review-context-v17-full.json').read_text())
        return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values()) < 3]

    def test_all_37_actual_callbacks_and_traces_replay_before_exact_memory(self):
        rows = self.observed()
        self.assertEqual({r['key'] for r in rows}, set(EXPECTED))
        self.assertEqual(len(rows), 37)
        for row in rows:
            with self.subTest(key=row['key']):
                self.assertIsNone(pilot.reviewed_memory(row, 'ko', 'context-v17'))
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], 'ko'))

                def replay(texts, source, target, traces):
                    def callback(parts):
                        self.assertEqual(parts, [s['input'] for s in row['forward_segments']])
                        return [(s['output'], s['truncated']) for s in row['forward_segments']]
                    return pilot.translate_complete_sentences(texts, callback, source, target, traces)

                values, traces, memory = pilot.forward_with_memory([row], 'ko', 'context-v17', replay)
                valid = all(pilot.typed_data_checks(row['model_input'], row['raw_translation'], 'en', 'ko').values()) and pilot.complete_sentence_evidence_valid(row['forward_segments'], row['model_input'], row['raw_translation'], 'en', 'ko')
                self.assertEqual(values, [(row['raw_translation'] if valid else None, row['raw_translation'], False)])
                self.assertEqual(traces, [row['forward_segments']])
                self.assertEqual(memory, [None])
                text = EXPECTED[row['key']]
                values, traces, memory = pilot.forward_with_memory([row], 'ko', 'context-v18', lambda *args: self.fail('Memory must not claim new inference'))
                self.assertEqual(values, [(text, text, False)])
                self.assertEqual(traces, [None])
                self.assertEqual(memory, [text])
                self.assertTrue(all(pilot.typed_data_checks(row['source'], text, 'en', 'ko').values()))
                self.assertFalse(pilot.semantic_issues(row['key'], row['source_hash'], text, 'ko'))
                for field, value in [('source', row['source']+' Changed.'), ('source_hash', '0'*64), ('context', 'unreviewed-context')]:
                    with self.assertRaises(ValueError):
                        pilot.reviewed_memory({**row, field: value}, 'ko', 'context-v18')
                self.assertIsNone(pilot.reviewed_memory(row, 'ja', 'context-v18'))

    def test_all_168_inherited_targets_and_numeric_grammar_are_unchanged(self):
        old, new = pilot.POLICIES['context-v17'], pilot.POLICIES['context-v18']
        self.assertEqual(old['entries'], new['entries'])
        self.assertEqual(old['numeric_grammar'], new['numeric_grammar'])
        for key, entry in old['reviewed_memory'].items():
            for field, value in entry.items():
                if field != 'translations':
                    self.assertEqual(value, new['reviewed_memory'][key][field])
            for locale, text in entry['translations'].items():
                self.assertEqual(text, new['reviewed_memory'][key]['translations'][locale])
        self.assertEqual(sum(len(e['translations']) for e in old['reviewed_memory'].values()), 168)
        self.assertEqual(sum(len(e['translations']) for e in new['reviewed_memory'].values()), 205)
        for key, review in old['korean_memory_reviews'].items():
            self.assertEqual(review, new['korean_memory_reviews'][key])

    def test_technical_units_identifiers_and_context_are_distinct(self):
        self.assertEqual(EXPECTED['dxf-viewer.fields.units.14'], '데시미터')
        self.assertEqual(EXPECTED['dxf-viewer.fields.units.15'], '데카미터')
        self.assertIn('loglevel', EXPECTED['dxf-viewer.fields.licenseLoglevel'])
        self.assertIn('Web Audio', EXPECTED['voice-changer.details'])
        self.assertNotIn('unit-format', EXPECTED['dxf-viewer.fields.units.8'])
        self.assertNotIn('쿠키', EXPECTED['shikaku.fields.faq.3.a'])
        self.assertNotIn('녹화', EXPECTED['voice-changer.faq.0.a'])
        for row in self.observed():
            review = pilot.POLICIES['context-v18']['korean_memory_reviews'][row['key']]
            self.assertEqual(review['source_hash'], row['source_hash'])
            self.assertEqual(review['context'], row['context'])
            self.assertEqual(review['translation_sha256'], hashlib.sha256(EXPECTED[row['key']].encode()).hexdigest())
            self.assertFalse(review['native_review'])

    def test_new_policy_still_rejects_damaged_data_without_inference_fallback(self):
        policy = 'context-v18'
        source = 'Use Web Audio 1.1.2 for 2D from (-1.5, 0) to (10, 0), with 30 MB and {count}.'
        good = 'Web Audio 1.1.2를 사용해 2D에서 (-1.5, 0)부터 (10, 0)까지, 30 MB와 {count}를 사용하세요.'
        unit = dict(key='independent.memory', context='details', source=source, source_hash=hashlib.sha256(source.encode()).hexdigest())
        self.assertTrue(all(pilot.typed_data_checks(source, good, 'en', 'ko').values()))
        changed = copy.deepcopy(pilot.POLICIES[policy])
        for a, b in [('Web Audio', 'audio web'), ('1.1.2', '1.2.2'), ('2D', '3D'), ('(-1.5, 0)', '(1.5, 0)'), ('30 MB', '10 MB'), ('{count}', '{value}')]:
            raw = good.replace(a, b)
            changed['reviewed_memory'][unit['key']] = {**unit, 'translations': {'ko': raw}}
            with patch.dict(pilot.POLICIES, {policy: changed}), self.subTest(damage=a):
                values, traces, memory = pilot.forward_with_memory([unit], 'ko', policy, lambda *args: self.fail('Invalid memory may not fall back'))
                self.assertEqual(values, [(None, raw, False)])
                self.assertEqual(traces, [None])
                self.assertEqual(memory, [raw])


if __name__ == '__main__':
    unittest.main()
