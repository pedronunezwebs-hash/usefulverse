"""Known Bengali corpus: strict source-bound data, provenance and no release claim."""
import copy,hashlib,importlib.util,json,os
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch
HERE=Path(__file__).parent
file=HERE/'translation-pilot-v29.py'
sp=importlib.util.spec_from_file_location('entry_v29',file if file.exists()else HERE/'translation-pilot.py');entry=importlib.util.module_from_spec(sp);sp.loader.exec_module(entry);pilot=getattr(entry,'pilot',entry)
DATA=pilot.ROOT/'docs/quality/translation-pilot';POLICY='context-v29'

class BengaliV29Test(unittest.TestCase):
    def test_independent_policy_preserves517_targets_and_adds174_exact_known_targets(self):
        self.assertIn(POLICY,list(pilot.POLICIES))
        before=pilot.POLICIES['context-v28']['reviewed_memory'];after=pilot.POLICIES[POLICY]['reviewed_memory']
        def same(a,b):return isinstance(b,dict)and all(k in b and same(v,b[k])for k,v in a.items())if isinstance(a,dict)else a==b
        self.assertTrue(same(before,after));self.assertEqual(sum(len(v['translations'])for v in after.values()),691)

    def test_all214_imports_bind_exact_source_context_and_reviewed_provenance(self):
        data=json.loads((DATA/'reviewed-memory-v29-import.json').read_text());self.assertEqual(data['approved_locales'],[]);self.assertFalse(data['native_review']);self.assertEqual(len(data['entries']),214)
        route=pilot.BENGALI_V29;contracts=route.contracts();self.assertEqual(len(contracts['references']),40)
        for key,item in contracts['imports'].items():
            with self.subTest(key=key):
                self.assertEqual(pilot.reviewed_memory(contracts['units'][key],'bn',POLICY),item['translation'])
                self.assertEqual(pilot.semantic_issues(key,item['source_hash'],item['translation'],'bn'),[])
        self.assertTrue(route.preflight_memory())

    def test_article_unit_inflections_once_and_dimension_are_proved_for_bound_text_only(self):
        plan=json.loads((DATA/'next-v29-bn-plan.json').read_text());raw={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v28/madlad.jsonl').read_text().splitlines())}
        for choice in plan['best_exact_source_candidates']:
            row=raw[choice['source_record_id']]
            with self.subTest(key=row['key']):self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','bn',POLICY).values()))
        route=getattr(pilot,'BENGALI_V29',pilot.BENGALI_V28)
        self.assertIsNone(route.numeric('Once loaded, continue.','en'))
        self.assertFalse(route.checks('Value 1.','অঙ্কনের একক','en','bn',POLICY)['quantities'])
        self.assertFalse(route.checks('A supported 3D shape.','কোন সমর্থিত দ্বিমাত্রিক জ্যামিতি পাওয়া যায়নি ।','en','bn',POLICY)['dimensions'])

    def test_corrected_units_versions_grouping_and_coordinates_reject_mutations(self):
        route=getattr(pilot,'BENGALI_V29',pilot.BENGALI_V28)
        for source,good,bad in [('Value 25 MB.','মান ২৫ MB।','মান ২৫০ MB।'),('From (0, 0) to (10, 0).','(০, ০) থেকে (১০, ০)।','(১০, ০) থেকে (০, ০)।'),('dxf-parser 1.1.2','dxf-parser 1.1.2','dxf-পার্সার 1.1.2'),('Miles (mi)','মাইল (mi)','মাইল (মি)')]:
            with self.subTest(source=source):self.assertTrue(all(route.checks(source,good,'en','bn',POLICY).values()));self.assertFalse(all(route.checks(source,bad,'en','bn',POLICY).values()))
        for value in ['100,000','১,০০,০০','২৫0','২৫ হাজার','৳25','1e3','¼']:
            with self.subTest(value=value):self.assertIsNone(route.numeric(value,'bn'))

    def test_frozen_v28_runtime_and_all_old_checkpoint_bytes_stay_identical(self):
        proof=json.loads((DATA/'regression-v29-preflight.json').read_text())
        for path,digest in proof['frozen_v28_runtime_sha256'].items():self.assertEqual(hashlib.sha256((pilot.ROOT/path).read_bytes()).hexdigest(),digest,path)
        for path,digest in proof['historical_checkpoints_sha256'].items():self.assertEqual(hashlib.sha256((DATA/path).read_bytes()).hexdigest(),digest,path)
        self.assertEqual(pilot.digest(pilot.SEMANTIC_REGRESSIONS[:1403]),proof['historical_fixture_prefix_digest'])

    def test_stale_target_or_context_cannot_become_a_valid_import(self):
        route=pilot.BENGALI_V29;route.contracts()
        for kind in ['text','context','source']:
            changed=copy.deepcopy(pilot.POLICIES[POLICY]);item=changed['reviewed_memory']['dxf-viewer.fields.units.12']
            if kind=='text':item['translations']['bn']='মাইক্রোসেকেন্ড'
            elif kind=='context':item['context']='another-context'
            else:item['source']='Seconds'
            with self.subTest(kind=kind),patch.dict(pilot.POLICIES,{POLICY:changed}),self.assertRaises(ValueError):route.contracts()

    def test_later_semantic_finding_blocks_inference_without_erasing_historical_data(self):
        route=pilot.BENGALI_V29;item=route.contracts()['imports']['dxf-viewer.fields.units.12'];finding={k:item[k]for k in ['key','source_hash','translation']};finding.update(locale='bn',issue='Synthetic future defect; never accepted for new inference.')
        with patch.object(pilot,'SEMANTIC_REGRESSIONS',pilot.SEMANTIC_REGRESSIONS+[finding]):
            self.assertTrue(route.contracts())
            with self.assertRaisesRegex(ValueError,'forward defect'):route.preflight_memory()

    def test_every_source_controlled_input_and_target_fragment_proves_whole_data(self):
        result=pilot.BENGALI_V29.preflight_fragments()
        self.assertEqual(result['units'],214);self.assertEqual(result['whole_texts'],642)
        self.assertGreaterEqual(result['fragments'],642)
        route=pilot.BENGALI_V29
        for value in ['দুটি','চারপাশে','শোনাতে']:
            with self.subTest(value=value):self.assertIsNone(route.numeric(value,'bn'))

    def test_warm_contract_cache_rejects_changed_dependency_bytes(self):
        route=pilot.BENGALI_V29;route.contracts();path=route.directory/'bound-readings.json';cls=type(path);original=cls.read_bytes
        def changed(file):
            data=original(file)
            return bytes(data)+b' ' if str(file)==str(path) else data
        with patch.object(cls,'read_bytes',changed),self.assertRaisesRegex(ValueError,'dependency'):route.contracts()
        self.assertTrue(route.contracts())

    def test_adapter_keeps_generic_assertions_and_only_three_workflow_edits(self):
        import ast
        from test_translation_v25_history import stable
        proof=json.loads((DATA/'regression-v29-preflight.json').read_text())
        module=ast.parse((HERE/'test_translation_pilot.py').read_text())
        klass=next(n for n in module.body if isinstance(n,ast.ClassDef))
        self.assertEqual(pilot.digest(stable(klass)),proof['original_generic_test_class_ast_digest'])
        text=(pilot.ROOT/'.github/workflows/deploy-cloudflare.yml').read_text()
        edits=[('context-v27, context-v28, context-v29]','context-v27, context-v28]'),('Baseline o variantes v2–v29; v29 añade corpus bengalí conocido con contratos propios','Baseline o variantes v2–v28; v28 añade referencias bengalíes con contrato propio'),('python -u scripts/localization/translation-pilot-v29.py run','python -u scripts/localization/translation-pilot.py run')]
        for after,before in edits:
            self.assertEqual(text.count(after),1);text=text.replace(after,before)
        self.assertEqual(hashlib.sha256(text.encode()).hexdigest(),proof['workflow_before_sha256'])

    def test_no_local_mass_or_ungated_full_conversion(self):
        route=pilot.BENGALI_V29
        for locales,scope in [('', 'references'),('bn,ru','references'),('bn','full')]:
            args=SimpleNamespace(policy=POLICY,locales=locales,scope=scope)
            original=pilot.policy_digest
            denied=lambda name:'stale-denied-gate' if name==POLICY else original(name)
            with patch.object(pilot,'policy_digest',side_effect=denied),self.subTest(locales=locales,scope=scope),patch.object(pilot,'actions_only'),patch.object(pilot.subprocess,'run',side_effect=AssertionError('No model conversion allowed')),self.assertRaises(ValueError):route.run(args)

if __name__=='__main__':unittest.main()
