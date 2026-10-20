"""Regressions from the context-v4 full pilot, before context-v5 implementation."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec); spec.loader.exec_module(pilot)


class SentenceCoverageTest(unittest.TestCase):
    def test_every_sentence_including_final_privacy_and_limits_reaches_the_model(self):
        source = 'Audio is processed locally. No audio is sent to a server. Maximum 25 MB and 30 seconds.'
        translations = {'Audio is processed locally.': 'El audio se procesa localmente.',
            'No audio is sent to a server.': 'No se envía audio a un servidor.',
            'Maximum 25 MB and 30 seconds.': 'Máximo 25 MB y 30 segundos.'}
        seen, traces = [], []
        def model(texts):
            seen.extend(texts); return [(translations[text], False) for text in texts]
        value, raw, cut = pilot.translate_covered_sentences([source], model, traces)[0]
        self.assertEqual(seen, list(translations))
        self.assertEqual(value, ' '.join(translations.values()))
        self.assertFalse(cut)
        self.assertTrue(pilot.segment_evidence_valid(traces[0], source, raw))
        self.assertEqual(sum(part['kind'] == 'prose' for part in traces[0]), 3)
        with self.assertRaises(ValueError): pilot.translate_covered_sentences([source], lambda _: [('Omitted sentences.', False)])
        rejected = pilot.translate_covered_sentences([source], lambda texts: [('', False) if i == 1 else (text, False) for i,text in enumerate(texts)])[0]
        self.assertIsNone(rejected[0], 'An empty middle sentence cannot be hidden by nonempty surrounding sentences')

    def test_versions_and_unit_symbols_are_copied_at_known_spans_in_both_directions(self):
        inputs = ['El visor incluye dxf-parser 1.1.2 y loglevel 1.9.2. Usa código local.', 'Pulgadas (in)', 'Kilometer (km)']
        seen, traces = [], []
        def model(texts):
            seen.extend(texts); return [(text, False) for text in texts]
        values = pilot.translate_covered_sentences(inputs, model, traces)
        self.assertEqual([value for value, _, _ in values], inputs)
        self.assertFalse(any(token in ' '.join(seen) for token in ['1.1.2','1.9.2','(in)','(km)']))
        for source, (_, raw, _), trace in zip(inputs, values, traces):
            self.assertTrue(pilot.segment_evidence_valid(trace, source, raw))
        # A model must not inject another version/symbol; never remove or restore guessed spans.
        self.assertIsNone(pilot.translate_covered_sentences(['Metres (m)'], lambda texts: [('Meters (ft)', False) for _ in texts])[0][0])

    def test_sentence_boundaries_preserve_decimals_extensions_urls_and_repetitions(self):
        texts = ['Keep 1.5 MB and file.dxf. Do not upload. Do not upload.',
            'Read https://example.com/v1.2.3 first. Then choose a file.', '  Keep {count}.\n\nKeep {count}.  ', '', '25 MB']
        traces = []
        values = pilot.translate_covered_sentences(texts, lambda chunks: [(chunk, False) for chunk in chunks], traces)
        self.assertEqual([value for value, _, _ in values[:-2]], texts[:-2])
        self.assertIsNone(values[-2][0])
        self.assertEqual(values[-1][0], '25 MB')
        for source, (_, raw, _), trace in zip(texts[:-2], values[:-2], traces[:-2]):
            self.assertTrue(pilot.segment_evidence_valid(trace, source, raw))
        traces[0].pop()
        self.assertFalse(pilot.segment_evidence_valid(traces[0], texts[0], values[0][1]))

    def test_v5_covers_clear_preset_and_duplicate_faq_families_by_exact_context(self):
        corpus = json.loads((pilot.ROOT / 'docs/quality/translation-pilot/full-sample-plan.json').read_text())
        self.assertEqual(len(corpus['review_keys']), 68)
        policy = pilot.POLICIES['context-v5']
        for key, expected in [('dxf-viewer.fields.clear','Remove the loaded drawing'),
            ('dxf-viewer.fields.clearMeasure','Remove the measurement'), ('voice-changer.fields.clean','Neutral voice')]:
            self.assertEqual(policy['entries'][key]['translation_input'], expected)
        for left,right in [('voice-changer.fields.faq1a','voice-changer.faq.0.a'),
            ('voice-changer.fields.faq2a','voice-changer.faq.1.a'), ('voice-changer.fields.faq3a','voice-changer.faq.2.a')]:
            self.assertEqual(policy['entries'][left]['translation_input'],policy['entries'][right]['translation_input'])
            entry=policy['entries'][right]
            with self.assertRaises(ValueError):pilot.translation_input({'key':right,**entry,'context':'wrong-sense'}, 'context-v5')
        unit=policy['reviewed_memory']['voice-changer.fields.clean']
        self.assertEqual(unit['translations'], {'es':'Voz neutra','nb-NO':'Nøytral stemme'})
        for key, entry in policy['reviewed_memory'].items():
            self.assertFalse(entry['native_review'])
            for locale,text in entry['translations'].items():
                checks=pilot.automatic_checks(entry['source'],text,locale,key)
                self.assertTrue(checks['protected_tokens_identical'],key)
                self.assertTrue(checks['technical_tokens_identical'],key)
                self.assertIsNot(checks['unit_symbols_identical'],False,key)

    def test_software_versions_are_checked_without_normalizing_broken_digits(self):
        source='Includes parser 1.1.2 and loglevel 1.9.2.'
        checks=pilot.automatic_checks(source,'Incluye parser 1. 1. 2 y loglevel 1.9.2.','es',back_translation='Includes parser 1.1.2 and loglevel 1.2.9.')
        self.assertFalse(checks['software_versions_identical'])
        self.assertFalse(checks['back_software_versions_identical'])
        self.assertTrue(pilot.automatic_checks(source,source,'en')['software_versions_identical'])

    def test_opaque_tokens_cannot_be_split_when_they_contain_versions_or_unit_symbols(self):
        source='Read https://example.com/1.2.3 and `function(in)` first. Keep {count}.'
        seen=[]; traces=[]
        def model(texts):
            seen.extend(texts); return [(text.replace('Read','Lee').replace('first.','primero.').replace('Keep','Conserva'),False) for text in texts]
        value,raw,_=pilot.translate_covered_sentences([source],model,traces)[0]
        self.assertIn('https://example.com/1.2.3',value)
        self.assertIn('`function(in)`',value)
        self.assertFalse(any('example.com' in text or 'function' in text or '{count}' in text for text in seen))
        self.assertTrue(pilot.segment_evidence_valid(traces[0],source,raw))

    def test_package_identifiers_are_audited_separately_from_version_numbers(self):
        source='This viewer bundles dxf-parser 1.1.2 and loglevel 1.9.2.'
        target='Denne viseren inkluderer dxf-parser 1.1.2 og loglevel 1.9.2.'
        checks=pilot.automatic_checks(source,target,'nb-NO',back_translation='This viewer includes dxf parser 1.1.2 and loglevel 1.9.2.')
        self.assertTrue(checks['software_versions_identical'])
        self.assertTrue(checks['back_software_versions_identical'])
        self.assertTrue(checks['software_identifiers_identical'])
        self.assertFalse(checks['back_software_identifiers_identical'])

    def test_observed_back_errors_are_flagged_separately_from_correct_forward_copy(self):
        cases=[('shikaku.fields.selectStart','Choose a start square.','Velg en startrute.','Choose a start window.'),
            ('shikaku.fields.faq.1.a','No. Each rectangle must contain exactly one number clue.','Nei. Hvert rektangel må inneholde nøyaktig én tall-ledetråd.','No, no, no. Each rectangle must contain exactly one number clue.')]
        for key,source,target,back in cases:
            checks=pilot.automatic_checks(source,target,'nb-NO',key,back)
            self.assertTrue(checks['known_back_semantic_errors'])
            self.assertEqual(checks['known_semantic_errors'],[],'A defective back translation cannot disqualify correct forward wording by itself')

    def test_v6_privacy_memory_negates_upload_without_negating_local_loading(self):
        entry=pilot.POLICIES['context-v6']['reviewed_memory']['voice-changer.fields.privacy']
        self.assertEqual(entry['translations']['es'],'El audio permanece en este navegador. No se sube a UsefulVerse ni se guarda allí.')
        self.assertEqual(entry['translations']['nb-NO'],'Lyden blir i denne nettleseren. Den lastes ikke opp til UsefulVerse og lagres ikke der.')
        self.assertFalse(entry['native_review'])
        self.assertTrue(pilot.semantic_issues('voice-changer.fields.privacy', entry['source_hash'], 'El audio permanece en este navegador. No es cargado o guardado por UsefulVerse.', 'es'))
        for locale,text in entry['translations'].items():
            self.assertTrue(pilot.automatic_checks(entry['source'],text,locale)['protected_tokens_identical'])

    def test_v5_entries_and_memory_are_bound_to_the_full_observed_corpus(self):
        path=pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v4/madlad.jsonl'
        units={row['key']:row for row in map(json.loads,path.read_text().splitlines())}
        policy=pilot.POLICIES['context-v5']
        for section in ['entries','reviewed_memory']:
            for key,entry in policy[section].items():
                for field in ['source','source_hash','context']:self.assertEqual(entry[field],units[key][field],key)
                if section=='entries':
                    for sentence in entry['translation_input'].split('. '):self.assertLessEqual(len(sentence.split()),20,key)

if __name__ == '__main__': unittest.main()
