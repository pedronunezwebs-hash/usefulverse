"""v9 observed fragmentation and ambiguous 200,000: independent v10 contracts."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


class WholeUnitTest(unittest.TestCase):
    def test_whole_unit_keeps_2d_coordinates_and_api_names_in_context(self):
        source = 'View 2D lines with Web Audio. From (0, 0) to (10, 0), measure 10 units.'
        target = 'Ve líneas 2D con Web Audio. De (0, 0) a (10, 0), mide 10 unidades.'
        seen, traces = [], []
        def model(texts):
            seen.extend(texts)
            return [(target, False)]
        value, raw, cut = pilot.translate_whole_units([source], model, 'en', 'es', traces)[0]
        self.assertEqual(seen, [source])
        self.assertEqual((value, raw, cut), (target, target, False))
        self.assertTrue(pilot.segment_evidence_valid(traces[0], source, raw))
        self.assertEqual(len(traces[0]), 1)

    def test_localized_quantities_do_not_relax_opaque_or_other_typed_data(self):
        source = 'UsefulVerse: {count} {count} `v9` https://example.com/123 <b>Unicode</b>; dxf-parser 1.1.2; 3D; (in); 200,000; -2.25; 10 MB; 30%.'
        target = source.replace('200,000', '200.000').replace('-2.25', '-2,25')
        self.assertTrue(all(pilot.typed_data_checks(source, target, 'en', 'es').values()))
        for old, new in [('{count} {count}', '{count}'), ('`v9`', '`v8`'), ('/123', '/124'),
                         ('</b>', '</i>'), ('Unicode', 'unicode'), ('1.1.2', '1.1.3'),
                         ('dxf-parser', 'dxf-parzer'), ('3D', '4D'), ('(in)', '(ft)'),
                         ('200.000', '200,000'), ('-2,25', '2,25'), ('10 MB', '10 GB'), ('30%', '30°')]:
            with self.subTest(damage=(old,new)):
                self.assertFalse(all(pilot.typed_data_checks(source, target.replace(old,new), 'en', 'es').values()))
        for target in ['Máximo 200\u00a0000.', 'Máximo 200\u202f000.', 'Máximo 200 000.']:
            self.assertTrue(all(pilot.typed_data_checks('Maximum 200,000.',target,'en','nb-NO').values()))
        self.assertFalse(all(pilot.typed_data_checks('Maximum 200,000.','Maksimum 200,000.','en','nb-NO').values()))
        self.assertTrue(all(pilot.typed_data_checks('Maximum 200\u00a0000.','Maximum 200,000.','nb-NO','en').values()))

    def test_bad_data_is_retained_raw_without_repair_and_truncation_rejects(self):
        source = 'Up to 30 seconds. Draw (-1.5, 0) to (10, 0).'
        for bad in ['Hasta 30 10 segundos. Dibuja (-1.5, 0) a (10, 0).',
                    'Hasta 30 segundos. Dibuja (1.5, 0) a (10, 0).',
                    'Hasta 30 segundos. Dibuja (10, 0) a (-1.5, 0).', '']:
            value, raw, cut = pilot.translate_whole_units([source],lambda _: [(bad,False)],'en','es')[0]
            self.assertIsNone(value)
            self.assertEqual(raw,bad)
        self.assertIsNone(pilot.translate_whole_units(['Save'],lambda _: [('Guardar',True)],'en','es')[0][0])
        with self.assertRaises(ValueError):pilot.translate_whole_units(['Save'],lambda _: [],'en','es')

    def test_unknown_quantity_grammar_fails_closed_but_number_free_prose_can_run(self):
        self.assertFalse(all(pilot.typed_data_checks('Maximum 200,000.','Maximum 200.000.','en','de').values()))
        self.assertTrue(all(pilot.typed_data_checks('Save {count}.','Speichern {count}.','en','de').values()))

    def test_unicode_minus_and_unparsed_digits_cannot_hide_changed_values(self):
        # CLDR nb minus is U+2212. A regex that skips it turns a negative into positive.
        self.assertFalse(all(pilot.typed_data_checks('Value 2.25.','Verdi −2,25.','en','nb-NO').values()))
        self.assertTrue(all(pilot.typed_data_checks('Value -2.25.','Verdi −2,25.','en','nb-NO').values()))
        for target in ['Valor 1e3.','Valor x999.','Valor 999MB.']:
            self.assertFalse(all(pilot.typed_data_checks('Value.',target,'en','es').values()),target)

    def test_v10_memories_and_controlled_input_use_the_same_data_contract(self):
        policy = pilot.POLICIES['context-v10']
        self.assertEqual(policy['entries'],pilot.POLICIES['context-v9']['entries'])
        for key, entry in policy['entries'].items():
            self.assertTrue(all(pilot.typed_data_checks(entry['source'],entry['translation_input'],'en','en').values()),key)
        for key, entry in policy['reviewed_memory'].items():
            for locale,target in entry['translations'].items():
                self.assertTrue(all(pilot.typed_data_checks(entry['source'],target,'en',locale).values()),(key,locale))
        unit = {**policy['reviewed_memory']['dxf-viewer.limits'],'key':'dxf-viewer.limits'}
        def forbidden(*args):self.fail('Reviewed whole memory must not call the model')
        for locale in ['es','nb-NO']:
            values,_,_=pilot.forward_with_memory([unit],locale,'context-v10',forbidden)
            self.assertIsNotNone(values[0][0])
            altered=copy.deepcopy(policy['reviewed_memory']['dxf-viewer.limits'])
            try:
                policy['reviewed_memory']['dxf-viewer.limits']['translations'][locale]='Broken 10 MB 200,000.'
                self.assertIsNone(pilot.forward_with_memory([unit],locale,'context-v10',forbidden)[0][0][0])
            finally:policy['reviewed_memory']['dxf-viewer.limits']=altered
        with self.assertRaises(ValueError):pilot.reviewed_memory({**unit,'context':'other'},'es','context-v10')

    def test_quantity_format_signal_can_be_reconciled_only_with_recomputed_contract(self):
        # Use a genuine historical record as a shape, but independent new source/text.
        path=pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v9/madlad.jsonl'
        row=next(r for r in map(json.loads,path.read_text().splitlines()) if r['candidate']=='model')
        import hashlib
        row.update(inference_policy='context-v10', source='Maximum 200,000.', translation='Máximo 200.000.',
                   raw_translation='Máximo 200.000.', back_translation='Maximum 200,000.', locale='es',
                   model_input='Maximum 200,000.', marker_restore_ok=True,back_marker_restore_ok=True,
                   forward_segments=[{'kind':'prose','input':'Maximum 200,000.','output':'Máximo 200.000.','truncated':False,'leading_space':'','trailing_space':''}],
                   back_segments=[{'kind':'prose','input':'Máximo 200.000.','output':'Maximum 200,000.','truncated':False,'leading_space':'','trailing_space':''}],translation_origin='model')
        row['source_hash']=hashlib.sha256(row['source'].encode()).hexdigest()
        def review_for(actual):
            identity=actual['record_id']; h=lambda s:hashlib.sha256(s.encode()).hexdigest()
            flags={k for k,v in pilot.record_flags(actual).items() if v}
            return {'expected_rows':1,'rows':[{'record_ids':[identity],**{k:actual[k] for k in ['key','locale','source_hash']},'translation_hash':h(actual['translation']),'scores':{'meaning':3,'numbers_negations':3,'naturalness':3}}],
                'reference_gate':{'es':{'passed':True}},'warning_reconciliation':[{'record_id':identity,'translation_hash':h(actual['translation']),'back_translation_hash':h(actual['back_translation']),
                    'warnings':{k:{'disposition':'reviewed-signal','blocks_gate':False,'note':'Quantity-only spelling differs; all recomputed typed invariants and local values match.'} for k in flags}}]}
        self.assertTrue(pilot.record_flags(row)['protected_tokens'])
        self.assertFalse(pilot.record_flags(row)['forward_typed_data'])
        self.assertEqual(pilot.audit_review_warnings(review_for(row),{row['record_id']:row}),1)
        damaged=copy.deepcopy(row);damaged['translation']='Máximo 200,001.'
        damaged['typed_data_evidence']={'forward':{'quantities':True}} # cannot forge acceptance
        self.assertTrue(pilot.record_flags(damaged)['forward_typed_data'])
        with self.assertRaises(ValueError):pilot.audit_review_warnings(review_for(damaged),{damaged['record_id']:damaged})

    def test_checkpoint_evidence_is_bound_to_raw_text_and_canonical_input(self):
        import hashlib
        source='Maximum 200,000.'
        row={'format':pilot.FORMAT,'status':'machine-draft','engine':'madlad',
             'engine_revision':pilot.ENGINES['madlad']['revision'],'candidate':'model',
             'inference_policy':'context-v10','policy_digest':pilot.policy_digest('context-v10'),
             'key':'independent.limit','context':'limits','source':source,
             'source_hash':hashlib.sha256(source.encode()).hexdigest(),'model_input':source,
             'locale':'es','translation':'Máximo 200.000.','back_translation':source}
        row['typed_data_evidence']=pilot.typed_record_evidence(row)
        pilot.validate_record(row)
        changed=copy.deepcopy(row);changed['translation']='Máximo 200,000.'
        with self.assertRaisesRegex(ValueError,'Typed data evidence'):pilot.validate_record(changed)
        changed=copy.deepcopy(row);changed['typed_data_evidence']['forward']['quantities']=False
        with self.assertRaisesRegex(ValueError,'Typed data evidence'):pilot.validate_record(changed)

if __name__=='__main__':unittest.main()
