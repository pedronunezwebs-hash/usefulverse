"""Pinned Korean decimal grammar; data cannot be guessed, repaired or hidden in prose."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec); spec.loader.exec_module(pilot)

class KoreanNumbersTest(unittest.TestCase):
    def valid(self, source, target):
        return all(pilot.typed_data_checks(source, target, 'en', 'ko').values())

    def test_official_cldr_snapshot_and_runtime_grammar_match(self):
        directory = pilot.ROOT / 'docs/quality/translation-pilot/numeric-sources/context-v16'
        manifest = json.loads((directory / 'manifest.json').read_text())
        self.assertEqual(manifest['cldr_json_revision'], '91c267402229a59e3ef2774544f001bf959e8809')
        for row in manifest['files']:
            if row.get('snapshot_in_repository') is False: continue
            self.assertEqual(hashlib.sha256((directory / row['path']).read_bytes()).hexdigest(), row['sha256'])
            self.assertIn('/' + row.get('revision',manifest['cldr_json_revision']) + '/', row['url'])
        numbers = json.loads((directory / 'ko-numbers.json').read_text())['main']['ko']['numbers']
        systems = json.loads((directory / 'numberingSystems.json').read_text())['supplemental']['numberingSystems']
        self.assertEqual(numbers['defaultNumberingSystem'], 'latn')
        self.assertEqual(systems['latn']['_digits'], '0123456789')
        symbols = numbers['symbols-numberSystem-latn']
        self.assertEqual((symbols['group'], symbols['decimal'], symbols['plusSign'], symbols['minusSign']), (',', '.', '+', '-'))
        self.assertEqual(numbers['decimalFormats-numberSystem-latn']['standard'], '#,##0.###')
        self.assertTrue(self.valid('Maximum 200,000.', '최대 200,000.'))

    def test_decimal_grouping_values_multiplicity_and_hangul_adjacency(self):
        for source, target in [('Maximum 200,000.', '최대 200000.'), ('Maximum 200,000.', '최대200,000개.'),
            ('Use 1,234,567.89.', '1,234,567.89 사용.'), ('Value 0.125.', '값0.125입니다.'),
            ('Keep 2 and 3.', '2개와3개.'), ('Keep 30% and 45°.', '30% 및 45° 유지.')]:
            with self.subTest(target=target): self.assertTrue(self.valid(source, target))
        for target in ['최대 200.000.', '최대 20,000.', '최대 200,00.', '최대 20,00,000.', '최대 200 000.',
            '최대 200\u00a0000.', '최대 200\u202f000.', '최대 200,000.5.', '최대 20만.', '최대 200,000 및 200,000.']:
            with self.subTest(target=target): self.assertFalse(self.valid('Maximum 200,000.', target))

    def test_hangul_numeric_multipliers_are_not_erased_as_particles(self):
        for suffix in ['천', '만', '억', '조', '십', '백', '경']:
            with self.subTest(suffix=suffix):
                self.assertFalse(self.valid('Value 20.', '값20' + suffix + '.'))
                self.assertIsNone(pilot.numeric_data('값20' + suffix, 'ko'))

    def test_spelled_signs_adjacent_to_digits_are_not_erased_as_particles(self):
        self.assertFalse(self.valid('Value 2.', '값 마이너스2.'))
        self.assertIsNone(pilot.numeric_data('플러스2', 'ko'))

    def test_unicode_signs_never_turn_negative_into_positive(self):
        self.assertTrue(self.valid('Value -2.25.', '값 −2.25.'))
        self.assertTrue(self.valid('Value +2.25.', '값 +2.25.'))
        self.assertFalse(self.valid('Value 2.25.', '값 −2.25.'))
        for target in ['값 ＋2.25.', '값 －2.25.', '값 ﹣2.25.', '값 –2.25.', '값 --2.25.', '값 +-2.25.', '값 + -2.25.']:
            with self.subTest(target=target): self.assertFalse(self.valid('Value -2.25.', target))

    def test_all_digits_must_be_proven_not_skipped(self):
        for target in ['값 1e3.', '값 x999.', '값 999MB.', '값 ２.', '값 ٢.', '값 2².', '값 ²2.']:
            with self.subTest(target=target): self.assertFalse(self.valid('Value 2.', target))
        for locale in ['id','de','ha','am','te','gu','ta','mr','sw']:
            self.assertIsNone(pilot.numeric_data('200,000', locale))
            self.assertFalse(all(pilot.typed_data_checks('Maximum 200,000.', '200,000.', 'en', locale).values()))

    def test_versions_coordinates_code_and_opaque_data_keep_their_own_contract(self):
        source = 'Use dxf-parser 1.1.2; 2D; (-1.5, 0) to (10, 0); 200,000; `v9.2 x999`; https://example.com/123; {count} {count}.'
        target = 'dxf-parser 1.1.2 사용; 2D; (-1.5, 0) ~ (10, 0); 200,000; `v9.2 x999`; https://example.com/123; {count} {count}.'
        self.assertTrue(self.valid(source,target))
        for old,new in [('dxf-parser','dxf-parzer'), ('1.1.2','1.2.2'), ('2D','3D'), ('(-1.5, 0)','(1.5, 0)'),
            ('(10, 0)','(0, 10)'), ('200,000','200.000'), ('`v9.2 x999`','`v9.3 x999`'), ('/123','/124'), ('{count} {count}','{count}')]:
            with self.subTest(damage=old): self.assertFalse(self.valid(source,target.replace(old,new)))

    def test_complete_sentence_contract_rejects_context_swaps_and_keeps_raw_trace(self):
        source = 'The first value is 10. The second value is 20.'
        outputs = ['첫 번째 값은 20.', '두 번째 값은 10.']
        raw = ' '.join(outputs)
        self.assertTrue(self.valid(source,raw), 'Whole-unit multisets alone miss swapped values')
        traces=[]
        values=pilot.translate_complete_sentences([source],lambda parts:[(v,False) for v in outputs],'en','ko',traces)
        self.assertEqual(values, [(None,raw,False)])
        self.assertEqual([p['output'] for p in traces[0]],outputs)
        self.assertFalse(pilot.complete_sentence_evidence_valid(traces[0],source,raw,'en','ko'))

    def test_real_korean_suffixes_do_not_hide_preserved_ascii_technical_tokens(self):
        rows=map(json.loads,(pilot.ROOT/'docs/quality/translation-pilot/checkpoints/madlad.jsonl').read_text().splitlines())
        keys={'voice-changer.fields.decodeFailed','dxf-viewer.fields.binary','voice-changer.fields.tooLarge','dxf-viewer.faq.0.a','dxf-viewer.faq.2.a'}
        seen=set()
        for row in rows:
            if row['locale']!='ko' or row['candidate']!='model' or row['key'] not in keys: continue
            seen.add(row['key'])
            with self.subTest(key=row['key']):
                self.assertTrue(pilot.typed_data_checks(row['source'],row['translation'],'en','ko')['technical_tokens'])
                self.assertTrue(pilot.automatic_checks(row['source'],row['translation'],'ko',row['key'])['technical_tokens_identical'])
        self.assertEqual(seen,keys)
        source='Use Web Audio and dxf-parser 1.1.2 for 2D; try WAV or MP3.'
        target='Web Audio로 dxf-parser를 1.1.2 버전으로 2D로 사용; WAV 또는 MP3로 시도.'
        self.assertTrue(self.valid(source,target))
        for old,new in [('Web Audio','Web AudioX'),('dxf-parser','dxf-parserX'),('2D','3D'),('MP3','MP4')]:
            with self.subTest(damage=old):self.assertFalse(self.valid(source,target.replace(old,new)))

    def test_invalid_numeric_memory_never_falls_back_or_repairs_raw(self):
        policy='context-v16'; source='Maximum 200,000.'
        unit={'key':'independent.memory','source':source,'source_hash':hashlib.sha256(source.encode()).hexdigest(),'context':'limits'}
        changed=copy.deepcopy(pilot.POLICIES[policy])
        for locale,raw in [('ko','최대 20만.'),('ko','최대 200.000.'),('id','200,000.')]:
            changed['reviewed_memory'][unit['key']]={**unit,'translations':{locale:raw}}
            with patch.dict(pilot.POLICIES,{policy:changed}),self.subTest(locale=locale,raw=raw):
                values,traces,memory=pilot.forward_with_memory([unit],locale,policy,lambda *args:self.fail('No inference fallback'))
                self.assertEqual(values,[(None,raw,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[raw])

    def test_v16_preserves_v15_and_has_no_korean_memory_or_bypass(self):
        old,new=pilot.POLICIES['context-v15'],pilot.POLICIES['context-v16']
        self.assertEqual(old['entries'],new['entries']); self.assertEqual(old['reviewed_memory'],new['reviewed_memory'])
        self.assertIn('context-v16',pilot.TYPED_POLICIES)
        for key,entry in new['reviewed_memory'].items():
            self.assertNotIn('ko',entry['translations'])
        policy='context-v16'
        row=json.loads((pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v15/madlad.jsonl').read_text().splitlines()[0])
        row.update(candidate='model',inference_policy=policy,policy_digest=pilot.policy_digest(policy),key='independent.v16',locale='ko',
            source='First sentence. Second sentence.',model_input='First sentence. Second sentence.',
            translation='첫 번째 문장. 두 번째 문장.',raw_translation='첫 번째 문장. 두 번째 문장.',translation_origin='model',
            forward_segments=[{'kind':'prose','input':'First sentence. Second sentence.','output':'첫 번째 문장. 두 번째 문장.',
                'truncated':False,'leading_space':'','trailing_space':''}])
        self.assertTrue(pilot.record_flags(row)['forward_sentence_evidence'])

if __name__ == '__main__': unittest.main()
