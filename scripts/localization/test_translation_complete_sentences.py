"""Observed v10 omission: every complete source sentence must be attempted and audited."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)


class CompleteSentenceTest(unittest.TestCase):
    def units(self):
        path=pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v9/madlad.jsonl'
        return {r['key']:r for r in map(json.loads,path.read_text().splitlines())}

    def test_both_pitch_rate_faq_aliases_attempt_all_three_complete_sentences(self):
        units=self.units();selected=[units[k] for k in ['voice-changer.fields.faq2a','voice-changer.faq.1.a']]
        expected=['This pitch control cannot keep playback speed unchanged.',
                  'Lower pitch means slower audio playback.', 'Higher pitch means faster audio playback.']
        translated=['Este control de tono no puede mantener la velocidad de reproducción sin cambios.',
                    'Un tono más bajo implica una reproducción más lenta.', 'Un tono más alto implica una reproducción más rápida.']
        seen=[]
        def model(texts):
            seen.extend(texts)
            return [(translated[expected.index(t)],False) for t in texts]
        def translate(texts,source_locale,target_locale,traces):
            return pilot.translate_complete_sentences(texts,model,source_locale,target_locale,traces)
        values,traces,memory=pilot.forward_with_memory(selected,'es','context-v11',translate)
        self.assertEqual(seen,expected+expected)
        self.assertEqual(memory,[None,None])
        for unit,(value,raw,cut),trace in zip(selected,values,traces,strict=True):
            self.assertEqual(value,' '.join(translated))
            self.assertFalse(cut)
            self.assertEqual(len(trace),3)
            self.assertTrue(pilot.complete_sentence_evidence_valid(trace,pilot.translation_input(unit,'context-v11'),raw,'en','es'))
        self.assertEqual(values[0],values[1])

    def test_coordinates_2d_versions_api_code_and_urls_stay_inside_sentences(self):
        sentences=['Read dxf-parser 1.1.2.', 'View 2D geometry from (-1.5, 0) to (10, 0).',
                   'Use Web Audio and MP3.', 'Keep {count} and `code. not prose`.', 'Open https://example.com/v1.2?x=3']
        source='  '+' '.join(sentences)+' \n';seen=[];traces=[]
        def model(texts):seen.extend(texts);return [(t,False) for t in texts]
        value,raw,cut=pilot.translate_complete_sentences([source],model,'en','en',traces)[0]
        self.assertEqual(seen,sentences)
        self.assertEqual(value,source)
        self.assertFalse(cut)
        self.assertEqual(traces[0][0]['leading_space'],'  ')
        self.assertEqual(traces[0][-1]['trailing_space'],' \n')
        self.assertTrue(pilot.complete_sentence_evidence_valid(traces[0],source,raw,'en','en'))

    def test_numbers_cannot_move_between_sentences_even_if_global_values_match(self):
        source='Maximum file size: 10 MB. Maximum duration: 30 seconds.'
        wrong=['Tamaño máximo: 30 MB.','Duración máxima: 10 segundos.'];traces=[]
        value,raw,cut=pilot.translate_complete_sentences([source],lambda _:[(t,False) for t in wrong],'en','es',traces)[0]
        self.assertTrue(all(pilot.typed_data_checks(source,raw,'en','es').values()),'Global multisets alone miss this context swap')
        self.assertIsNone(value)
        self.assertIn('30 MB',raw)
        self.assertIn('10 segundos',raw)
        self.assertFalse(pilot.complete_sentence_evidence_valid(traces[0],source,raw,'en','es'))

    def test_empty_truncated_or_missing_sentence_output_is_rejected_without_repair(self):
        source='First sentence. Second sentence.'
        for outputs in [[('Primera oración.',False),('',False)], [('Primera oración.',False),('Segunda oración.',True)]]:
            traces=[];value,raw,cut=pilot.translate_complete_sentences([source],lambda _:outputs,'en','es',traces)[0]
            self.assertIsNone(value)
            self.assertEqual(len(traces[0]),2)
            self.assertFalse(pilot.complete_sentence_evidence_valid(traces[0],source,raw,'en','es'))
        with self.assertRaises(ValueError):pilot.translate_complete_sentences([source],lambda _:[('Primera oración.',False)],'en','es')

    def test_a_forged_merged_trace_cannot_claim_sentence_coverage_or_pass_a_gate(self):
        source='First sentence. Second sentence.';target='Primera oración. Segunda oración.'
        part=lambda a,b:{'kind':'prose','input':a,'output':b,'truncated':False,'leading_space':'','trailing_space':''}
        trace=[part(source,target)]
        self.assertTrue(pilot.segment_evidence_valid(trace,source,target))
        self.assertFalse(pilot.complete_sentence_evidence_valid(trace,source,target,'en','es'))
        path=pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v10/madlad.jsonl'
        row=next(r for r in map(json.loads,path.read_text().splitlines()) if r['candidate']=='model')
        row.update(inference_policy='context-v11',locale='es',key='independent.sentences',source=source,
                   source_hash=hashlib.sha256(source.encode()).hexdigest(),model_input=source,translation=target,raw_translation=target,
                   back_translation=source,forward_segments=trace,translation_origin='model',marker_restore_ok=True,
                   back_segments=[part('Primera oración.','First sentence.'),{**part('Segunda oración.','Second sentence.'),'leading_space':' '}],
                   truncated=False,back_marker_restore_ok=True)
        row['typed_data_evidence']=pilot.typed_record_evidence(row)
        flags={k for k,v in pilot.record_flags(row).items() if v};self.assertIn('forward_sentence_evidence',flags)
        h=lambda s:hashlib.sha256(s.encode()).hexdigest()
        review={'expected_rows':1,'rows':[{'record_ids':[row['record_id']],**{k:row[k] for k in ['key','locale','source_hash']},'translation_hash':h(target),'scores':{'meaning':3,'numbers_negations':3,'naturalness':3}}],
                'reference_gate':{'es':{'passed':True}},'warning_reconciliation':[{'record_id':row['record_id'],'translation_hash':h(target),'back_translation_hash':h(source),
                    'warnings':{flag:{'disposition':'reviewed-signal','blocks_gate':False,'note':'Forged merged trace must never be accepted'} for flag in flags}}]}
        with self.assertRaises(ValueError):pilot.audit_review_warnings(review,{row['record_id']:row})

    def test_v11_bound_unit_label_memory_and_all_214_inputs_preserve_data(self):
        old=pilot.POLICIES['context-v10'];new=pilot.POLICIES['context-v11']
        self.assertEqual(old['entries'],new['entries'])
        for key,memory in old['reviewed_memory'].items():self.assertEqual(memory,new['reviewed_memory'][key])
        units=self.units();unit=units['dxf-viewer.faq.2.a'];memory=pilot.reviewed_memory(unit,'nb-NO','context-v11')
        self.assertIn('merker målingene som tegneenheter',memory)
        self.assertFalse(pilot.semantic_issues(unit['key'],unit['source_hash'],memory,'nb-NO'))
        with self.assertRaises(ValueError):pilot.reviewed_memory({**unit,'context':'other'},'nb-NO','context-v11')
        self.assertEqual(len(units),214)
        for unit in units.values():
            source=pilot.translation_input(unit,'context-v11');traces=[]
            value,raw,cut=pilot.translate_complete_sentences([source],lambda texts:[(t,False) for t in texts],'en','en',traces)[0]
            self.assertEqual(value,source,unit['key'])
            self.assertTrue(pilot.complete_sentence_evidence_valid(traces[0],source,raw,'en','en'),unit['key'])

if __name__=='__main__':unittest.main()
