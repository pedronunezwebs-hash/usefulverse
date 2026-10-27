"""The new Bengali route must prove data and exact memory; no locale approval."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import patch
import ast
import hashlib
import unicodedata
import tempfile
import os
from test_translation_v25_history import stable

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
CORRECTIONS = {'dxf-viewer.fields.resetView': 'অঙ্কনটি পর্দায় ফিট করুন',
               'dxf-viewer.fields.zoomOut': 'ছোট করে দেখুন',
               'shikaku.fields.check': 'ধাঁধা যাচাই করুন'}
SUBSTITUTIONS = {'shikaku.fields.hint': 'একটি ইঙ্গিত দেখাও',
                 'voice-changer.fields.decodeFailed': 'এই ব্রাউজার অডিও ফরম্যাটটি ডিকোড করতে পারেনি। WAV অথবা MP3 চেষ্টা করুন।'}


class BengaliV28Test(unittest.TestCase):
    def test_fraction_symbol_mistaken_for_punctuation_is_a_permanent_observed_defect(self):
        records = [r for e in ['madlad', 'm2m100'] for r in map(json.loads, (DATA / f'checkpoints/{e}.jsonl').read_text().splitlines())]
        for row in [r for r in records if r['locale'] == 'bn' and '\u09f7' in r['translation']]:
            with self.subTest(key=row['key'], engine=row['engine']):
                self.assertEqual(unicodedata.numeric('\u09f7'), 0.25)
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], 'bn'))

    def test_historical_false_perfect_scores_have_an_exact_negative_only_projection(self):
        spec = importlib.util.spec_from_file_location('baseline', Path(__file__).with_name('pilot-baseline-review.py'))
        baseline = importlib.util.module_from_spec(spec); spec.loader.exec_module(baseline)
        original = json.loads((DATA / 'review-batch1-bn-legacy.json').read_text())
        reassessment = json.loads((DATA / 'review-v28-legacy-reassessment.json').read_text())
        effective = baseline.negative_reassessment(original)
        self.assertEqual(baseline.metrics(original)['points'], 236)
        self.assertEqual(baseline.metrics(effective)['points'], 232)
        self.assertFalse(effective['reference_gate']['passed'])
        self.assertEqual(baseline.audit(original), 54)
        self.assertEqual(original, json.loads((DATA / 'review-batch1-bn-legacy.json').read_text()))
        for mutation in ['native', 'raise', 'identity', 'stale', 'approve']:
            changed = copy.deepcopy(reassessment)
            if mutation == 'native': changed['native_review'] = True
            elif mutation == 'raise': changed['rows'][0]['scores'] = dict(meaning=3, numbers_negations=3, naturalness=3)
            elif mutation == 'identity': changed['rows'][0]['record_ids'] = ['unbound']
            elif mutation == 'stale': changed['original_review_sha256'] = 'stale'
            else: changed['approved_locales'] = ['bn']
            with self.subTest(mutation=mutation), self.assertRaises(ValueError): baseline.negative_reassessment(original, changed)

    def test_attached_extension_and_known_negative_copula_keep_their_real_data(self):
        route = pilot.BENGALI_V28
        for key in ['dxf-viewer.fields.unsupported', 'dxf-viewer.fields.binary']:
            item = pilot.POLICIES['context-v28']['reviewed_memory'][key]
            with self.subTest(key=key):
                self.assertTrue(all(route.checks(item['source'], item['translations']['bn'], 'en', 'bn', 'context-v28').values()))

    def test_forty_exact_references_use_reviewed_memory_and_preserve477_prior_targets(self):
        units = {u['key']: u for u in json.loads((DATA / 'numeric-sources/context-v24/source-snapshot.json').read_text())['units']}
        plan = json.loads((DATA / 'batch1-v28-candidate-plan.json').read_text())
        for row in [r for r in plan['rows'] if r['locale'] == 'bn']:
            unit = units[row['key']]
            expected = CORRECTIONS.get(row['key'], SUBSTITUTIONS.get(row['key'], row.get('translation')))
            with self.subTest(key=row['key']):
                self.assertEqual(pilot.reviewed_memory(unit, 'bn', 'context-v28'), expected)
                self.assertEqual(pilot.semantic_issues(unit['key'], unit['source_hash'], expected, 'bn'), [])
        def preserved(before, after):
            if isinstance(before, dict): return isinstance(after, dict) and all(k in after and preserved(v, after[k]) for k, v in before.items())
            return before == after
        self.assertTrue(preserved(pilot.POLICIES['context-v27']['reviewed_memory'], pilot.POLICIES['context-v28']['reviewed_memory']))
        self.assertEqual(sum(len(item['translations']) for item in pilot.POLICIES['context-v28']['reviewed_memory'].values()), 517)

    def test_bengali_values_and_multiplicity_are_proved_without_accepting_wrong_values(self):
        for source, good, bad in [('Enter four valid coordinates.', 'চারটি সঠিক স্থানাঙ্ক লিখুন।', 'পাঁচটি সঠিক স্থানাঙ্ক লিখুন।'),
                                  ('Value 25 MB.', 'মান ২৫ MB।', 'মান ২৫০ MB।'),
                                  ('One rectangle covers six squares.', 'একটি আয়তক্ষেত্র ছয়টি ঘর ঢাকে।', 'একটি আয়তক্ষেত্র পাঁচটি ঘর ঢাকে।')]:
            with self.subTest(source=source):
                self.assertTrue(pilot.policy_typed_data_checks(source, good, 'en', 'bn', 'context-v28')['quantities'])
                self.assertFalse(pilot.policy_typed_data_checks(source, bad, 'en', 'bn', 'context-v28')['quantities'])

    def test_indian_grouping_native_digits_and_decimal_are_strict(self):
        route = pilot.BENGALI_V28
        for value in ['1,00,000.5', '১,০০,০০০.৫', '100000.5']:
            self.assertEqual(route.numeric(value, 'bn')[0], {(Decimal('100000.5'), ''): 1})
        for value in ['100,000', '১,০০,০০', '২৫0', '২৫ হাজার', 'দুইশো', '1e3', '＋২৫', '২৫ MB ২৫ MB', '৳25']:
            with self.subTest(value=value):
                if value == '২৫ MB ২৫ MB': self.assertEqual(route.numeric(value, 'bn')[0][(Decimal(25), '')], 2)
                else: self.assertIsNone(route.numeric(value, 'bn'))

    def test_closed_article_unit_and_negative_readings_cannot_erase_real_numbers(self):
        route = pilot.BENGALI_V28
        memories = pilot.POLICIES['context-v28']['reviewed_memory']
        for key in ['dxf-viewer.fields.file', 'dxf-viewer.faq.2.a', 'shikaku.example', 'voice-changer.fields.tooLarge']:
            item = memories[key]
            self.assertTrue(all(route.checks(item['source'], item['translations']['bn'], 'en', 'bn', 'context-v28').values()), key)
        item = memories['shikaku.example']
        values = route.numeric(item['translations']['bn'], 'bn', item['source'])[0]
        self.assertEqual(values, {(Decimal(6), ''): 2, (Decimal(1), ''): 1})
        self.assertFalse(route.checks('Value 1.', memories['dxf-viewer.faq.2.a']['translations']['bn'], 'en', 'bn', 'context-v28')['quantities'])
        self.assertFalse(route.checks('Value 25 MB.', memories['voice-changer.fields.tooLarge']['translations']['bn'], 'en', 'bn', 'context-v28')['quantities'])

    def test_coordinates_order_tokens_brands_and_placeholders_remain_exact(self):
        route = pilot.BENGALI_V28
        good = route.checks('From (0, 0) to (10, 0).', '(০, ০) থেকে (১০, ০)।', 'en', 'bn', 'context-v28')
        self.assertTrue(good['coordinates'])
        self.assertFalse(route.checks('From (0, 0) to (10, 0).', '(০, ০) থেকে (০, ১০)।', 'en', 'bn', 'context-v28')['coordinates'])
        for source, target, field in [('25 MB', '২৫ KB', 'technical_tokens'), ('Keep {duration}.', 'সময়কাল।', 'opaque_literals'), ('UsefulVerse', 'মজার বিশ্ব', 'brands'), ('Web Audio', 'ওয়েব অডিও', 'software_identifiers'), ('3D', '2D', 'dimensions')]:
            self.assertFalse(route.checks(source, target, 'en', 'bn', 'context-v28')[field])
        self.assertIsNone(pilot.numeric_data('২৫', 'bn'))

    def test_all214_actual_sources_inputs_fragments_and40_memory_targets_before_download(self):
        route = pilot.BENGALI_V28
        units = list(route.contracts()['units'].values())
        self.assertEqual(len(units), 214)
        for unit in units:
            for source in [unit['source'], pilot.translation_input(unit, 'context-v28')]:
                for text in [source, *[p[1] for p in pilot.complete_sentence_parts(source)]]:
                    self.assertTrue(all(route.checks(text, text, 'en', 'en', 'context-v28').values()), (unit['key'], text))
        selected = [unit for unit in units if 'bn' in pilot.POLICIES['context-v28']['reviewed_memory'][unit['key']]['translations']]
        self.assertEqual(len(selected), 40)
        def forbidden(*args): raise AssertionError('No known-reference forward model calls permitted')
        values, traces, memory = pilot.forward_with_memory(selected, 'bn', 'context-v28', forbidden)
        self.assertTrue(all(value[0] is not None for value in values))
        self.assertEqual(traces, [None] * 40)
        self.assertTrue(all(memory))

    def test_changed_primary_file_source_review_and_memory_target_fail_closed(self):
        route = pilot.BENGALI_V28
        module = route.contracts.__func__.__globals__
        original = module['file_sha']
        for fragment in ['bn-rbnf.xml', 'checkpoints/madlad.jsonl', 'review-batch1-bn-legacy.json']:
            def stale(path): return '0' * 64 if str(path).endswith(fragment) else original(path)
            with self.subTest(fragment=fragment), patch.dict(module, {'file_sha': stale}), self.assertRaises(ValueError): route.contracts()
        changed = copy.deepcopy(pilot.POLICIES['context-v28'])
        changed['reviewed_memory']['voice-changer.fields.tooLarge']['translations']['bn'] += ' হ্যাঁ'
        with patch.dict(pilot.POLICIES, {'context-v28': changed}), self.assertRaisesRegex(ValueError, 'memory target'): route.contracts()

    def test_new_semantic_finding_preserves_historical_data_validation_but_blocks_new_inference(self):
        route = pilot.BENGALI_V28
        item = next(x for x in pilot.POLICIES['context-v28']['reviewed_memory'].values() if 'bn' in x['translations'])
        key = next(k for k, v in pilot.POLICIES['context-v28']['reviewed_memory'].items() if v is item)
        synthetic = dict(locale='bn', key=key, source_hash=item['source_hash'], translation=item['translations']['bn'], issue='Synthetic future finding used only by this unit test', direction='forward')
        with patch.object(pilot, 'SEMANTIC_REGRESSIONS', pilot.SEMANTIC_REGRESSIONS + [synthetic]):
            self.assertIsInstance(route.contracts(), dict)
            with self.assertRaisesRegex(ValueError, 'Known Bengali forward defect'):
                route.preflight_memory()

    def test_full_inference_requires_reference_gate_before_any_model_operation(self):
        route = pilot.BENGALI_V28
        if (DATA / 'reference-v28-gate.json').exists():
            module = route.full_allowed.__func__.__globals__
            original = module['file_sha']
            with patch.dict(module, {'file_sha': lambda path: 'stale' if path.name == 'review-context-v28-references.json' else original(path)}), self.assertRaises(ValueError): route.full_allowed()
        else:
            with self.assertRaisesRegex(ValueError, 'references must pass'): route.full_allowed()

    def test_wrong_corpus_digest_or_reference_selection_fails_before_model_download(self):
        route = pilot.BENGALI_V28
        units = [dict(unit, reference=key in route.contracts()['imports'], legacy={}) for key, unit in route.contracts()['units'].items()]
        digest = json.loads((DATA / 'numeric-sources/context-v24/source-snapshot.json').read_text())['corpus_digest']
        module = route.run.__func__.__globals__
        for mutation in ['digest', 'selection']:
            corpus = dict(sourceDigest=digest, units=copy.deepcopy(units), fullSourceUnits=214)
            if mutation == 'digest': corpus['sourceDigest'] = 'forged'
            else:
                next(u for u in corpus['units'] if u['reference'])['reference'] = False
                next(u for u in corpus['units'] if not u['reference'] and u['key'] not in route.contracts()['imports'])['reference'] = True
            with tempfile.TemporaryDirectory() as directory:
                file = Path(directory) / 'corpus.json'; file.write_text(json.dumps(corpus))
                args = SimpleNamespace(policy='context-v28', locales='bn', scope='references', corpus=str(file), engine='madlad', beam_size=3, batch_size=4, resume=None, output=str(Path(directory) / 'output.jsonl'))
                with patch.dict(os.environ, {'GITHUB_ACTIONS': 'true', 'RUNNER_OS': 'Linux', 'RUNNER_TEMP': directory}), patch.object(module['subprocess'], 'run', side_effect=AssertionError('Model download must not start')), self.subTest(mutation=mutation), self.assertRaisesRegex(ValueError, 'corpus digest|reference selection'):
                    route.run(args)

    def test_raw_model_adapter_uses_pinned_cpu_contract_and_rejects_truncation_budget(self):
        route = pilot.BENGALI_V28
        class Tokenizer:
            def encode(self, text): return text.split()
            def convert_ids_to_tokens(self, values): return values
            def convert_tokens_to_ids(self, values): return values
            def decode(self, values, **kwargs): return ' '.join(values)
        class Translator:
            def translate_batch(self, inputs, **kwargs):
                self.kwargs = kwargs; self.inputs = inputs
                return [SimpleNamespace(hypotheses=[['decoded']]) for value in inputs]
        tokenizer, translator = Tokenizer(), Translator()
        args = SimpleNamespace(engine='madlad', beam_size=3, batch_size=4)
        self.assertEqual(route.model_batch(['hello'], 'bn', 'en', args, tokenizer, translator), [('decoded', False)])
        self.assertEqual(translator.inputs, [['<2en>', 'hello']])
        self.assertEqual(translator.kwargs['max_decoding_length'], 256)
        args.engine = 'm2m100'
        route.model_batch(['hello'], 'en', 'bn', args, tokenizer, translator)
        self.assertEqual(translator.kwargs['target_prefix'], [['__bn__']])
        with self.assertRaisesRegex(ValueError, 'refusing truncation'): route.model_batch(['x ' * 513], 'en', 'bn', args, tokenizer, translator)

    def test_bootstrap_is_the_only_original_module_ast_change_and_old_blobs_are_immutable(self):
        proof = json.loads((DATA / 'regression-v28-preflight.json').read_text())
        module = ast.parse(Path(pilot.__file__).read_text())
        extra = [node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'enable_bengali_v28' or isinstance(node, ast.Expr) and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name) and node.value.func.id == 'enable_bengali_v28']
        self.assertEqual(len(extra), 2)
        self.assertEqual(pilot.digest(stable(ast.Module(body=extra, type_ignores=[]))), proof['optin_bootstrap_ast_sha256'])
        module.body = [node for node in module.body if node not in extra]
        self.assertEqual(pilot.digest(stable(module)), proof['original_module_with_cache_ast_sha256'])
        for name, digest in proof['historical_checkpoint_sha256'].items(): self.assertEqual(hashlib.sha256((DATA / name).read_bytes()).hexdigest(), digest)
        for name, digest in proof['historical_policy_digests'].items(): self.assertEqual(pilot.policy_digest(name), digest)
        self.assertEqual(pilot.digest(pilot.SEMANTIC_REGRESSIONS[:1334]), proof['historical_fixture_prefix_digest'])

    def test_workflow_only_adds_the_v28_choice_and_description_without_cost_or_publish_changes(self):
        proof = json.loads((DATA / 'regression-v28-preflight.json').read_text())
        text = (pilot.ROOT / '.github/workflows/deploy-cloudflare.yml').read_text()
        # Bounded site CI budget for the growing complete proof suite;model90unchanged.
        self.assertEqual(text.count('timeout-minutes: 45'),1);text=text.replace('timeout-minutes: 45','timeout-minutes: 30')
        # Four explicit v31 edits before unchanged historical whole-blob guards.
        self.assertEqual(text.count('context-v29, context-v30, context-v31]'),1);text=text.replace('context-v29, context-v30, context-v31]','context-v29, context-v30]')
        self.assertEqual(text.count('Baseline o variantes v2–v31; v31 añade corpus ruso revisado y validación memoizada'),1);text=text.replace('Baseline o variantes v2–v31; v31 añade corpus ruso revisado y validación memoizada','Baseline o variantes v2–v30; v30 añade referencias rusas con contratos propios')
        self.assertEqual(text.count('python -u scripts/localization/translation-pilot-v31.py run'),1);text=text.replace('python -u scripts/localization/translation-pilot-v31.py run','python -u scripts/localization/translation-pilot-v30.py run')
        self.assertEqual(text.count('bash scripts/localization/pilot-precheck-v31.sh'),1);text=text.replace('bash scripts/localization/pilot-precheck-v31.sh','bash scripts/localization/pilot-precheck-v30.sh')
        # Normalize four explicit v30 additions before the existing v29/v28 guards.
        text = text.replace('context-v28, context-v29, context-v30]','context-v28, context-v29]')
        text = text.replace('Baseline o variantes v2–v30; v30 añade referencias rusas con contratos propios','Baseline o variantes v2–v29; v29 añade corpus bengalí conocido con contratos propios')
        text = text.replace('python -u scripts/localization/translation-pilot-v30.py run','python -u scripts/localization/translation-pilot-v29.py run')
        text = text.replace('bash scripts/localization/pilot-precheck-v30.sh','python scripts/localization/run-translation-tests.py --jobs 4')
        # Normalize only the five explicit v29 integration edits, preserving
        # the original v28 golden blob assertion for every other workflow byte.
        text = text.replace('context-v27, context-v28, context-v29]', 'context-v27, context-v28]')
        text = text.replace('Baseline o variantes v2–v29; v29 añade corpus bengalí conocido con contratos propios', 'Baseline o variantes v2–v28; v28 añade referencias bengalíes con contrato propio')
        text = text.replace('python -u scripts/localization/translation-pilot-v29.py run', 'python -u scripts/localization/translation-pilot.py run')
        text = text.replace('python3 scripts/localization/run-translation-tests.py --jobs 4', "python3 -m unittest discover -s scripts/localization -p 'test_translation*.py'")
        text = text.replace('python scripts/localization/run-translation-tests.py --jobs 4', "python -m unittest discover -s scripts/localization -p 'test_translation*.py'")
        self.assertIn('context-v27, context-v28]', text)
        text = text.replace('context-v27, context-v28]', 'context-v27]')
        text = text.replace('Baseline o variantes v2–v28; v28 añade referencias bengalíes con contrato propio', 'Baseline o variantes v2–v27; v27 reutiliza corpus revisado y contratos Shikaku')
        raw = text.encode()
        self.assertEqual(hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest(), proof['workflow_before_blob_sha'])


if __name__ == '__main__': unittest.main()
