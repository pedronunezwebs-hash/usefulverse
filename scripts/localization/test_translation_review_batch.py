"""Review batching reuses exact evidence and must never imply language approval."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('batch', Path(__file__).with_name('pilot-review-batch.py'))
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
DATA = batch.pilot.ROOT / 'docs/quality/translation-pilot'

class ReviewBatchTest(unittest.TestCase):
    def test_three_locales_reuse_every_actual_record_with_exact_provenance(self):
        checkpoint = DATA / 'checkpoints/madlad.jsonl'
        original = [json.loads(line) for line in checkpoint.read_text().splitlines()]
        with patch.object(batch.pilot, 'run', side_effect=AssertionError('No inference')), patch.object(batch.pilot, 'convert', side_effect=AssertionError('No models')):
            result = batch.prepare(checkpoint, ['bn', 'ru', 'ur'])
        expected = {r['record_id']: r for r in original if r['locale'] in ['bn', 'ru', 'ur']}
        self.assertEqual({r['record_id'] for r in result['rows']}, set(expected))
        self.assertEqual(result['checkpoint_sha256'], hashlib.sha256(checkpoint.read_bytes()).hexdigest())
        self.assertEqual(result['approved_locales'], [])
        self.assertEqual(result['inference_calls'], 0)
        self.assertTrue(result['review_required'])
        for row in result['rows']:
            self.assertEqual(row['evidence'], expected[row['record_id']])
            self.assertEqual(row['record_sha256'], batch.pilot.digest(row['evidence']))
            self.assertEqual(row['warnings'], [k for k, failed in batch.pilot.record_flags(row['evidence']).items() if failed])
        text = batch.markdown(result)
        self.assertIn('no hay notas ni aprobaciones automáticas', text)
        for item in result['rows']:
            self.assertIn(json.dumps(item['evidence']['back_translation'], ensure_ascii=False), text)

    def test_missing_duplicate_english_or_oversized_locale_list_is_rejected(self):
        for locales in [[], ['bn', 'bn'], ['en'], ['unknown'], ['bn', 'ru', 'ur', 'tr', 'vi', 'it']]:
            with self.subTest(locales=locales), self.assertRaises(ValueError):
                batch.prepare(DATA / 'checkpoints/madlad.jsonl', locales)

    def test_low_resource_locales_keep80_required_samples_and_legacy_does_not_count(self):
        result = batch.prepare(DATA / 'checkpoints/madlad.jsonl', ['sw', 'mr', 'ha'])
        for locale in result['locales']:
            required = result['reference_requirements'][locale]
            self.assertEqual(required['minimum_model_source_units'], 80)
            self.assertEqual(required['existing_distinct_model_sources'], 40)
            self.assertTrue(required['review_and_full_gate_still_required'])
            self.assertEqual(result['approved_locales'], [])

    def test_conflicting_duplicate_is_rejected_without_silently_choosing_one(self):
        row = next(json.loads(line) for line in (DATA / 'checkpoints/madlad.jsonl').read_text().splitlines() if json.loads(line)['locale'] == 'bn')
        different = copy.deepcopy(row)
        different['status'] = 'different'
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / 'checkpoint.jsonl'
            file.write_text(json.dumps(row) + '\n' + json.dumps(different) + '\n')
            with self.assertRaises(ValueError):
                batch.prepare(file, ['bn'])

    def test_tampered_source_is_rejected_before_reusing_evidence(self):
        row = next(json.loads(line) for line in (DATA / 'checkpoints/madlad.jsonl').read_text().splitlines() if json.loads(line)['locale'] == 'bn')
        row['source'] += ' changed'
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / 'checkpoint.jsonl'
            file.write_text(json.dumps(row) + '\n')
            with self.assertRaises(ValueError):
                batch.prepare(file, ['bn'])

    def test_changed_canonical_context_prevents_reuse(self):
        snapshot = json.loads((DATA / 'numeric-sources/context-v24/source-snapshot.json').read_text())
        checkpoint = DATA / 'checkpoints/madlad.jsonl'
        key = next(json.loads(line)['key'] for line in checkpoint.read_text().splitlines() if json.loads(line)['locale'] == 'bn')
        next(unit for unit in snapshot['units'] if unit['key'] == key)['context'] += ' changed'
        with tempfile.TemporaryDirectory() as directory:
            file = Path(directory) / 'snapshot.json'
            file.write_text(json.dumps(snapshot))
            # Baseline rows lack context: bind the snapshot itself to the frozen corpus.
            # An alternative snapshot must not silently acquire canonical authority.
            with self.assertRaises(ValueError):
                batch.prepare(checkpoint, ['bn'], file)

if __name__ == '__main__':
    unittest.main()
