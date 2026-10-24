"""V12 observed outside-sample context/title/grammar failures: exact memories never imply model quality."""
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


class ExpandedLanguageTest(unittest.TestCase):
    def observed(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v12/madlad.jsonl').read_text().splitlines())}
        review = json.loads((DATA / 'review-context-v12-full.json').read_text())
        return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values()) < 3]

    def test_all_twenty_three_observed_bad_outputs_use_bound_memory_without_model_calls(self):
        observed = self.observed()
        self.assertEqual(len(observed), 23)
        def forbidden(*args): self.fail('Reviewed memory must not be attributed to model inference')
        for row in observed:
            with self.subTest(locale=row['locale'], key=row['key']):
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], row['locale']) or pilot.record_flags(row)['software_identifiers'])
                self.assertIsNone(pilot.reviewed_memory(row, row['locale'], 'context-v12'))
                values, traces, memories = pilot.forward_with_memory([row], row['locale'], 'context-v13', forbidden)
                text = values[0][0]
                self.assertIsNotNone(text)
                self.assertNotEqual(text, row['raw_translation'])
                self.assertEqual(values, [(text, text, False)])
                self.assertEqual(traces, [None])
                self.assertEqual(memories, [text])
                self.assertFalse(pilot.semantic_issues(row['key'], row['source_hash'], text, row['locale']))
                self.assertTrue(all(pilot.typed_data_checks(row['source'], text, 'en', row['locale']).values()))
                for field, value in [('source', row['source'] + ' Changed.'), ('source_hash', '0' * 64), ('context', 'another-meaning')]:
                    with self.assertRaises(ValueError): pilot.reviewed_memory({**row, field: value}, row['locale'], 'context-v13')
                self.assertIsNone(pilot.reviewed_memory(row, 'ja', 'context-v13'))
        old = pilot.POLICIES['context-v12']; new = pilot.POLICIES['context-v13']
        self.assertEqual(old['entries'], new['entries'])
        for key, memory in old['reviewed_memory'].items(): self.assertEqual(memory, new['reviewed_memory'][key])

    def test_damaged_memory_keeps_raw_evidence_and_fails_closed_for_each_data_family(self):
        source = 'Use Web Audio 1.1.2 for 2D from (-1.5, 0) to (10, 0), with 30 MB and {count}.'
        good = 'Usa Web Audio 1.1.2 para 2D de (-1.5, 0) a (10, 0), con 30 MB y {count}.'
        unit = {'key': 'independent.memory', 'context': 'details', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest()}
        policy = copy.deepcopy(pilot.POLICIES['context-v13'])
        for a, b in [('Web Audio', 'audio web'), ('1.1.2', '1.2.2'), ('2D', '3D'), ('(-1.5, 0)', '(1.5, 0)'), ('30 MB', '10 MB'), ('{count}', '{value}')]:
            with self.subTest(damage=a):
                raw = good.replace(a, b)
                policy['reviewed_memory'][unit['key']] = {**unit, 'translations': {'es': raw}}
                with patch.dict(pilot.POLICIES, {'context-v13': policy}):
                    values, traces, memories = pilot.forward_with_memory([unit], 'es', 'context-v13', lambda *args: self.fail('No model fallback may repair invalid memory'))
                    self.assertEqual(values, [(None, raw, False)])
                    self.assertEqual(memories, [raw])
                    self.assertEqual(traces, [None])

    def test_checkpoint_cannot_forge_model_origin_or_memory_revision_or_sentence_trace(self):
        row = copy.deepcopy(self.observed()[0]); policy = 'context-v13'
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
        self.assertTrue(pilot.segment_evidence_valid(row['forward_segments'], row['model_input'], row['raw_translation']))
        self.assertTrue(pilot.record_flags(row)['forward_sentence_evidence'], 'A v13 row must not bypass per-sentence coverage')
        row.update(source='Use Web Audio.', translation='Usa audio web.')
        self.assertTrue(pilot.record_flags(row)['forward_typed_data'], 'API identifiers are still hard data in v13')


if __name__ == '__main__': unittest.main()
