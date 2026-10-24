"""Versioned Indonesian decimal contract; historical parsers stay fail closed."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from decimal import Decimal
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec); spec.loader.exec_module(pilot)

class IndonesianNumbersTest(unittest.TestCase):
    def valid(self, source, target):
        return all(pilot.policy_typed_data_checks(source,target,'en','id','context-v19').values())

    def test_versioned_cldr_profile_and_history(self):
        directory = pilot.ROOT/'docs/quality/translation-pilot/numeric-sources/context-v19'
        manifest = json.loads((directory/'manifest.json').read_text())
        for row in manifest['files']:
            self.assertEqual(hashlib.sha256((directory/row['path']).read_bytes()).hexdigest(),row['sha256'])
            self.assertIn('/'+row.get('revision',manifest['cldr_json_revision'])+'/',row['url'])
        numbers=json.loads((directory/'id-numbers.json').read_text())['main']['id']['numbers']
        self.assertEqual(numbers['defaultNumberingSystem'],'latn')
        self.assertEqual(numbers['symbols-numberSystem-latn']['group'],'.')
        self.assertEqual(numbers['symbols-numberSystem-latn']['decimal'],',')
        self.assertEqual(numbers['decimalFormats-numberSystem-latn']['standard'],'#,##0.###')
        old,new=pilot.POLICIES['context-v18'],pilot.POLICIES['context-v19']
        self.assertEqual(old['entries'],new['entries'])
        self.assertEqual(old['reviewed_memory'],new['reviewed_memory'])
        self.assertEqual(new['numeric_profile']['manifest_sha256'],hashlib.sha256((directory/'manifest.json').read_bytes()).hexdigest())
        self.assertIn('context-v19',pilot.TYPED_POLICIES)
        self.assertIsNone(pilot.numeric_data('25 MB','id'))
        for policy in ['baseline','context-v15','context-v16','context-v17','context-v18']:
            self.assertFalse(all(pilot.policy_typed_data_checks('25 MB','25 MB','en','id',policy).values()))

    def test_valid_decimal_grouping_signs_and_multiplicity(self):
        for source,target in [('Maximum 200,000.','Maksimum 200.000.'),('Maximum 200,000.','Maksimum 200000.'),
            ('Value 1,234,567.89.','Nilai 1.234.567,89.'),('Value 0.125.','Nilai 0,125.'),
            ('Value -2.25.','Nilai −2,25.'),('Value +2.25.','Nilai +2,25.'),
            ('Keep 30% and 45°.','Pertahankan 30% dan 45°.'),('Keep 2 and 2.','Pertahankan 2 dan 2.'),
            ('Limit 25 MB.','Batas 25 MB.'),('Use 10.5 units.','Gunakan 10,5 unit.')]:
            with self.subTest(target=target):self.assertTrue(self.valid(source,target))

    def test_malformed_ambiguous_compact_and_hidden_digits_fail_closed(self):
        for target in ['Nilai 200,000.','Nilai 20.000.','Nilai 200.00.','Nilai 20.00.000.',
            'Nilai 200 000.','Nilai 200\u00a0000.','Nilai 200\u202f000.','Nilai 200.000,5.',
            'Nilai 200.000 dan 200.000.','Nilai 200 ribu.','Nilai 200 rb.','Nilai 200 M.','Nilai 200 T.','Nilai 2e5.',
            'Nilai x200000.','Nilai 200000MB.','Nilai ２０００００.','Nilai ٢٠٠٠٠٠.',
            'Nilai 200000².','Nilai ＋200000.','Nilai –200000.','Nilai --200000.','Nilai + -200000.']:
            with self.subTest(target=target):self.assertFalse(self.valid('Value 200,000.',target))
        self.assertFalse(self.valid('Value 2.','Nilai −2.'))
        self.assertFalse(self.valid('Value 2 and 2.','Nilai 2.'))
        self.assertFalse(self.valid('No quantities.','Tidak ada angka ².'))

    def test_versions_coordinates_code_and_opaque_contracts(self):
        source='Use dxf-parser 1.1.2; 2D; (-1.5, 0) to (10, 0); 200,000; `v9.2 x999`; https://example.com/123; {count} {count}.'
        target='Gunakan dxf-parser 1.1.2; 2D; (-1.5, 0) ke (10, 0); 200.000; `v9.2 x999`; https://example.com/123; {count} {count}.'
        self.assertTrue(self.valid(source,target))
        for old,new in [('dxf-parser','dxf-parzer'),('1.1.2','1.2.2'),('2D','3D'),('(-1.5, 0)','(1.5, 0)'),
            ('(10, 0)','(0, 10)'),('200.000','200,000'),('`v9.2 x999`','`v9.3 x999`'),('/123','/124'),('{count} {count}','{count}')]:
            with self.subTest(damage=old):self.assertFalse(self.valid(source,target.replace(old,new)))

    def test_sentence_trace_contract_cannot_swap_values(self):
        source='The first value is 10. The second value is 20.'
        outputs=['Nilai pertama adalah 20.','Nilai kedua adalah 10.'];raw=' '.join(outputs)
        self.assertTrue(self.valid(source,raw))
        traces=[]
        values=pilot.translate_complete_sentences_v19([source],lambda parts:[(v,False) for v in outputs],'en','id',traces)
        self.assertEqual(values,[(None,raw,False)])
        self.assertEqual([p['output'] for p in traces[0]],outputs)
        self.assertFalse(pilot.complete_sentence_evidence_valid_v19(traces[0],source,raw,'en','id'))

    def test_bad_memory_preserves_raw_without_fallback(self):
        policy='context-v19';source='Maximum 200,000.'
        unit={'key':'independent.memory','source':source,'source_hash':hashlib.sha256(source.encode()).hexdigest(),'context':'limits'}
        changed=copy.deepcopy(pilot.POLICIES[policy])
        for raw in ['Maksimum 200,000.','Maksimum 200 ribu.']:
            changed['reviewed_memory'][unit['key']]={**unit,'translations':{'id':raw}}
            with patch.dict(pilot.POLICIES,{policy:changed}):
                values,traces,memory=pilot.forward_with_memory([unit],'id',policy,lambda *args:self.fail('No fallback'))
                self.assertEqual(values,[(None,raw,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[raw])

    def test_all_historical_policies_and_record_flags_remain_identical(self):
        data=pilot.ROOT/'docs/quality/translation-pilot'
        proof=json.loads((data/'regression-v19-evidence.json').read_text())
        for policy,value in proof['historical_policy_digests'].items():
            self.assertEqual(pilot.policy_digest(policy),value)
        flags={}
        original=pilot.SEMANTIC_REGRESSIONS[:732]
        self.assertEqual(pilot.digest(original),proof['fixture_prefix_digest'])
        # New linguistic discoveries can flag old raw id outputs. Isolate the
        # original fixture prefix to compare numeric/inference behavior itself.
        with patch.object(pilot,'SEMANTIC_REGRESSIONS',original):
            for path in sorted((data/'checkpoints').rglob('*.jsonl')):
                for row in map(json.loads,path.read_text().splitlines()):
                    if row.get('inference_policy','baseline') not in {'baseline',*proof['historical_policy_digests']}:continue
                    pilot.validate_record(row)
                    flags[row['record_id']]=pilot.record_flags(row)
        self.assertEqual(len(flags),13510)
        self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])

    def test_profile_tampering_is_rejected(self):
        policy=copy.deepcopy(pilot.POLICIES['context-v19'])
        policy['numeric_profile']['manifest_sha256']='0'*64
        with patch.dict(pilot.POLICIES,{'context-v19':policy}),self.assertRaisesRegex(ValueError,'numeric profile'):
            self.valid('Limit 25 MB.','Batas 25 MB.')

    def test_generated_grouped_decimals_round_trip_and_detect_changed_value(self):
        for integer in [0,1,12,999,1000,1234,999999,1000000,1234567,200000,999999999]:
            for sign in [-1,1]:
                for fraction in ['0.00','0.25','0.89']:
                    value=sign*(Decimal(integer)+Decimal(fraction))
                    en=format(value,',.2f')
                    local=en.translate(str.maketrans({',':'.','.':','}))
                    source='Value '+en+'.';target='Nilai '+local+'.'
                    with self.subTest(value=str(value)):
                        self.assertTrue(self.valid(source,target))
                        self.assertTrue(all(pilot.policy_typed_data_checks(target,source,'id','en','context-v19').values()))
                        wrong=format(value+1,',.2f').translate(str.maketrans({',':'.','.':','}))
                        self.assertFalse(self.valid(source,'Nilai '+wrong+'.'))
        self.assertFalse(self.valid('Version 1.234.567.','Versi 1.234.567.'),'Ambiguous version/grouped integer must stay blocked; code spans are exact')

if __name__=='__main__':unittest.main()
