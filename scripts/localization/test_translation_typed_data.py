"""Observed v6 failures: quantity/coordinate formats and ambiguous technical senses."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec); spec.loader.exec_module(pilot)

class TypedDataTest(unittest.TestCase):
    def test_capitalization_regression_does_not_mark_the_lowercase_fix_as_same_error(self):
        source='A clue marked 6 belongs inside one rectangle that covers exactly six squares.'
        import hashlib
        source_hash=hashlib.sha256(source.encode()).hexdigest()
        bad='Una pista marcada 6 Pertenece dentro de un rectángulo que cubre exactamente seis cuadrados.'
        issue='Mayúscula en mitad de frase por segmentar junto al número.'
        self.assertIn(issue,pilot.semantic_issues('shikaku.example',source_hash,bad,'es'))
        self.assertNotIn(issue,pilot.semantic_issues('shikaku.example',source_hash,bad.replace('Pertenece','pertenece'),'es'))
        source='No. Your browser decodes and processes the selected audio locally. UsefulVerse does not receive the recording.'
        bad='Su navegador decodifica y procesa el audio seleccionado localmente. UsefulVerse No recibe la grabación.'
        issue='Mayúscula suelta en «UsefulVerse No recibe» por separar el sujeto literal.'
        source_hash=hashlib.sha256(source.encode()).hexdigest()
        self.assertIn(issue,pilot.semantic_issues('voice-changer.fields.faq1a',source_hash,bad,'es'))
        self.assertNotIn(issue,pilot.semantic_issues('voice-changer.fields.faq1a',source_hash,bad.replace('UsefulVerse No','UsefulVerse no'),'es'))

    def test_v8_explicit_upload_answer_is_not_lost_between_identical_faq_aliases(self):
        policy=pilot.POLICIES['context-v8']
        for key in ['voice-changer.fields.faq1a','voice-changer.faq.0.a']:
            entry=policy['reviewed_memory'][key]
            self.assertTrue(entry['translations']['es'].startswith('No. '))
            self.assertTrue(entry['translations']['nb-NO'].startswith('Nei. '))
            self.assertIn('never uploaded',policy['entries'][key]['translation_input'])
            self.assertFalse(entry['native_review'])
            for locale,text in entry['translations'].items():
                self.assertTrue(pilot.automatic_checks(entry['source'],text,locale)['protected_tokens_identical'])
        self.assertEqual(policy['reviewed_memory']['voice-changer.fields.faq1a']['translations'],policy['reviewed_memory']['voice-changer.faq.0.a']['translations'])

    def test_equivalent_local_quantity_formats_do_not_claim_a_changed_value(self):
        for locale,target in [('es','Máximo: 200.000 registros; 10 MB.'),('nb-NO','Maksimum: 200 000 oppføringer; 10 MB.')]:
            c=pilot.automatic_checks('Maximum: 200,000 records; 10 MB.',target,locale)
            self.assertTrue(c['numeric_values_identical'])
            self.assertFalse(c['protected_tokens_identical'],'Literal contract remains independently strict')
        for locale,target in [('es','Máximo: 200 registros; 10 MB.'),('nb-NO','Maksimum: 200 001 oppføringer; 10 MB.')]:
            self.assertFalse(pilot.automatic_checks('Maximum: 200,000 records; 10 MB.',target,locale)['numeric_values_identical'])

    def test_coordinates_preserve_order_signs_and_decimal_values_without_guessing(self):
        source='A line from (0, 0) to (10, 0) measures 10 drawing units.'
        self.assertTrue(pilot.automatic_checks(source,'Una línea de (0,0) a (10,0) mide 10 unidades.','es')['coordinate_values_identical'])
        for target in ['Una línea de (10,0) a (0,0) mide 10 unidades.','Una línea de (0,0) a (100,0) mide 10 unidades.']:
            self.assertFalse(pilot.automatic_checks(source,target,'es')['coordinate_values_identical'])
        self.assertFalse(pilot.automatic_checks('From (-1.5, 0) to (2, 0).','De (1.5,0) a (2,0).','es')['coordinate_values_identical'])
        self.assertTrue(pilot.automatic_checks('From (-1.5, 0) to (2, 0).','De (-1.50,0) a (2,0).','es')['coordinate_values_identical'])

    def test_numeric_audit_keeps_decimal_conventions_and_rejects_malformed_groups(self):
        source='Read 1.5 and -2.25; repeat 1.5.'
        self.assertTrue(pilot.automatic_checks(source,'Lee 1,5 y -2,25; repite 1,5.','es')['numeric_values_identical'])
        for text in ['Lee 1,5 y 2,25; repite 1,5.','Lee 1,5 y -2,25.','Lee 1,5 y -2,25; repite 15.']:
            self.assertFalse(pilot.automatic_checks(source,text,'es')['numeric_values_identical'])
        self.assertFalse(pilot.automatic_checks('Maximum: 200,000.','Máximo: 20.00.00.','es')['numeric_values_identical'])
        self.assertTrue(pilot.automatic_checks('Use dxf-parser 1.1.2 at https://example.com/123 and `v9`.','Usa dxf-parser 1.1.2 en https://example.com/123 y `v9`.','es')['numeric_values_identical'])

    def test_quantity_failures_do_not_mark_unchanged_coordinates_as_wrong(self):
        source='From (0, 0) to (10, 0). Maximum: 200,000 records.'
        target='De (0,0) a (10,0). Máximo: 20.00.00 registros.'
        checks=pilot.automatic_checks(source,target,'es')
        self.assertFalse(checks['numeric_values_identical'])
        self.assertTrue(checks['coordinate_values_identical'])
        checks=pilot.automatic_checks(source,'Von (0,0) nach (10,0). Höchstens: 200.000 Datensätze.','de')
        self.assertIsNone(checks['numeric_values_identical'])
        self.assertTrue(checks['coordinate_values_identical'])

    def test_v7_protects_complete_typed_data_spans_and_keeps_full_trace(self):
        source='Read dxf-parser 1.1.2 and Web Audio here. Maximum 200,000 records. Draw (0, 0) to (10, 0).'
        seen=[]; traces=[]
        def model(texts):
            seen.extend(texts)
            return [(s.replace('Maximum','Máximo').replace('Read','Lee').replace('Draw','Dibuja'),False) for s in texts]
        value,raw,cut=pilot.translate_typed_data_sentences([source],model,traces)[0]
        self.assertTrue(value); self.assertFalse(cut)
        for token in ['dxf-parser','Web Audio','1.1.2','200,000','(0, 0)','(10, 0)']:
            self.assertIn(token,raw)
            self.assertFalse(any(token in s for s in seen),token)
        self.assertTrue(pilot.segment_evidence_valid(traces[0],source,raw))
        self.assertTrue(pilot.automatic_checks(source,raw,'es')['protected_tokens_identical'])

    def test_copied_source_numeric_literals_keep_the_explicit_data_contract(self):
        source='Maximum: 200,000 records; -2.25 and 1.5.'
        self.assertTrue(pilot.automatic_checks(source,'Máximo: 200,000 registros; -2.25 y 1.5.','es')['numeric_values_identical'])
        self.assertFalse(pilot.automatic_checks(source,'Máximo: 200,000 registros; 2.25 y 1.5.','es')['numeric_values_identical'])
        self.assertIsNone(pilot.automatic_checks('Maximum 200,000.','Höchstens 200.000.','de')['numeric_values_identical'])

    def test_invented_extra_number_in_prose_is_rejected_without_guessing_a_repair(self):
        source='This tool supports clips up to 30 seconds. Trim the file and try again.'
        observed={'This tool supports clips up to':'Esta herramienta soporta clips de hasta',
            'seconds.':'10 segundos.','Trim the file and try again.':'Recorte el archivo e inténtelo de nuevo.'}
        traces=[]
        value,raw,truncated=pilot.translate_typed_data_sentences([source],lambda texts:[(observed[text],False) for text in texts],traces)[0]
        self.assertIsNone(value)
        self.assertIn('30 10 segundos',raw,'Keep the raw failure; do not silently remove the invented 10')
        self.assertFalse(truncated)
        self.assertTrue(pilot.segment_evidence_valid(traces[0],source,raw))
        checks=pilot.automatic_checks(source,raw,'es',back_translation='This tool supports clips up to 30 10 seconds. Trim the file and try again.')
        self.assertFalse(checks['numeric_values_identical'])
        self.assertFalse(checks['back_numeric_values_identical'])

    def test_v7_policy_is_bound_to_source_context_and_preserves_faq_aliases(self):
        policy=pilot.POLICIES['context-v7']
        self.assertEqual(policy['protection'],'covered-sentences-typed-data-v2')
        rows=[json.loads(line) for line in (pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v6/madlad.jsonl').read_text().splitlines()]
        units={r['key']:r for r in rows}
        for section in ['entries','reviewed_memory']:
            for key,entry in policy[section].items():
                for field in ['source','source_hash','context']:self.assertEqual(entry[field],units[key][field],key)
                if section=='entries':
                    for sentence in entry['translation_input'].split('. '):self.assertLessEqual(len(sentence.split()),20,key)
                else:
                    self.assertFalse(entry['native_review']); self.assertEqual(entry['review_kind'],'agent')
                    for locale,text in entry['translations'].items():
                        checks=pilot.automatic_checks(entry['source'],text,locale,key)
                        self.assertTrue(checks['protected_tokens_identical'],key)
                        self.assertTrue(checks['technical_tokens_identical'],key)
        for a,b in [('voice-changer.fields.faq3a','voice-changer.faq.2.a'),('voice-changer.fields.faq3q','voice-changer.faq.2.q')]:
            self.assertEqual(policy['entries'][a]['translation_input'],policy['entries'][b]['translation_input'])
        unit=copy.deepcopy(units['dxf-viewer.details']); unit['context']='other'
        with self.assertRaisesRegex(ValueError,'Stale'):pilot.translation_input(unit,'context-v7')

if __name__=='__main__':unittest.main()
