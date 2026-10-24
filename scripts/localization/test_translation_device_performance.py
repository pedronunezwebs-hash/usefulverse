"""Observed v14 computing calque, with immutable raw evidence and fail-closed provenance."""
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


class DevicePerformanceTest(unittest.TestCase):
    def observed(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v14/madlad.jsonl').read_text().splitlines())}
        review = json.loads((DATA / 'review-context-v14-full.json').read_text())
        return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values()) < 3]

    def test_observed_grammar_is_replayed_then_replaced_only_by_exact_reviewed_memory(self):
        observed = self.observed()
        self.assertEqual(len(observed), 1)
        expected = {'es': 'Se recomienda un ordenador para un procesamiento más fluido. La velocidad y el uso de memoria dependen de tu dispositivo.'}
        for row in observed:
            with self.subTest(locale=row['locale'], key=row['key']):
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], row['locale']))
                self.assertIsNone(pilot.reviewed_memory(row, row['locale'], 'context-v14'))
                def replay(texts, source, target, traces):
                    def callback(parts):
                        self.assertEqual(parts, [s['input'] for s in row['forward_segments']])
                        return [(s['output'], s['truncated']) for s in row['forward_segments']]
                    return pilot.translate_complete_sentences(texts, callback, source, target, traces)
                values, traces, memory = pilot.forward_with_memory([row], row['locale'], 'context-v14', replay)
                self.assertEqual(values, [(row['translation'], row['raw_translation'], False)])
                self.assertEqual(traces, [row['forward_segments']])
                self.assertEqual(memory, [None])
                values, traces, memory = pilot.forward_with_memory([row], row['locale'], 'context-v15', lambda *args: self.fail('Memory must not invoke or claim model inference'))
                text = expected[row['locale']]
                self.assertEqual(values, [(text, text, False)])
                self.assertEqual(traces, [None]); self.assertEqual(memory, [text])
                self.assertFalse(pilot.semantic_issues(row['key'], row['source_hash'], text, row['locale']))
                for field, value in [('source', row['source'] + ' Changed.'), ('source_hash', '0' * 64), ('context', 'different-meaning')]:
                    with self.assertRaises(ValueError): pilot.reviewed_memory({**row, field: value}, row['locale'], 'context-v15')
                self.assertIsNone(pilot.reviewed_memory(row, 'ja', 'context-v15'))
        old, new = pilot.POLICIES['context-v14'], pilot.POLICIES['context-v15']
        self.assertEqual(old['entries'], new['entries'])
        for key, value in old['reviewed_memory'].items(): self.assertEqual(value, new['reviewed_memory'][key])

    def test_new_policy_cannot_bypass_typed_data_sentence_coverage_or_memory_provenance(self):
        row = copy.deepcopy(self.observed()[0]); policy = 'context-v15'
        text = pilot.reviewed_memory(row, row['locale'], policy)
        row.update(inference_policy=policy, policy_digest=pilot.policy_digest(policy), translation=text, raw_translation=text,
                   translation_origin='reviewed-memory', forward_segments=None,
                   memory_digest=pilot.digest(pilot.POLICIES[policy]['reviewed_memory'][row['key']]))
        row['typed_data_evidence'] = pilot.typed_record_evidence(row)
        pilot.validate_record(row)
        for field, value in [('translation_origin', 'model'), ('memory_digest', '0' * 64), ('translation', text + ' X'), ('forward_segments', [])]:
            with self.assertRaises(ValueError): pilot.validate_record({**row, field: value})
        row.update(key='independent.sentences', source='First sentence. Second sentence.', model_input='First sentence. Second sentence.',
                   translation='Primera oración. Segunda oración.', raw_translation='Primera oración. Segunda oración.', translation_origin='model',
                   forward_segments=[{'kind': 'prose', 'input': 'First sentence. Second sentence.', 'output': 'Primera oración. Segunda oración.', 'truncated': False, 'leading_space': '', 'trailing_space': ''}])
        self.assertTrue(pilot.record_flags(row)['forward_sentence_evidence'])
        source = 'Use Web Audio 1.1.2 for 2D from (-1.5, 0) to (10, 0), with 30 MB and {count}.'
        good = 'Usa Web Audio 1.1.2 para 2D de (-1.5, 0) a (10, 0), con 30 MB y {count}.'
        unit = {'key': 'independent.memory', 'context': 'details', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest()}
        changed = copy.deepcopy(pilot.POLICIES[policy])
        for a, b in [('Web Audio', 'audio web'), ('1.1.2', '1.2.2'), ('2D', '3D'), ('(-1.5, 0)', '(1.5, 0)'), ('30 MB', '10 MB'), ('{count}', '{value}')]:
            raw = good.replace(a, b)
            changed['reviewed_memory'][unit['key']] = {**unit, 'translations': {'es': raw}}
            with patch.dict(pilot.POLICIES, {policy: changed}), self.subTest(damage=a):
                values, traces, memory = pilot.forward_with_memory([unit], 'es', policy, lambda *args: self.fail('No fallback may repair invalid memory'))
                self.assertEqual(values, [(None, raw, False)])
                self.assertEqual(traces, [None]); self.assertEqual(memory, [raw])


if __name__ == '__main__': unittest.main()
