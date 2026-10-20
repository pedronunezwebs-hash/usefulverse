import copy
import base64
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)


class TranslationPilotTest(unittest.TestCase):
    def test_repeated_protected_values_cannot_disappear_or_multiply(self):
        source = 'Keep {count}, {count}, 25 MB and UsefulVerse.'
        self.assertFalse(pilot.automatic_checks(source, 'Conserva {count}, 25 MB y UsefulVerse.', 'es')['protected_tokens_identical'])
        self.assertTrue(pilot.automatic_checks(source, 'Conserva {count}, {count}, 25 MB y UsefulVerse.', 'es')['protected_tokens_identical'])

    def test_english_fallback_and_wrong_script_are_visible_failures(self):
        self.assertTrue(pilot.automatic_checks('Do not upload files.', 'Do not upload files.', 'ar')['untranslated_source'])
        self.assertEqual(pilot.automatic_checks('Do not upload files.', 'Do not upload files.', 'ar')['expected_script_ratio'], 0)

    def test_resume_identity_includes_source_context_model_and_legacy_revision(self):
        corpus = {'sourceDigest': 'source-v1'}
        unit = {'key': 'tool.button', 'source_hash': 'hash', 'context': 'save-file', 'legacy': {'es': 'Guardar'}}
        first = pilot.record_id(corpus, 'm2m100', 'es', unit, 'legacy', 2)
        changed = copy.deepcopy(unit); changed['legacy']['es'] = 'Ahorrar'
        self.assertNotEqual(first, pilot.record_id(corpus, 'm2m100', 'es', changed, 'legacy', 2))
        self.assertNotEqual(first, pilot.record_id(corpus, 'm2m100', 'es', unit, 'legacy', 1))
        self.assertNotEqual(first, pilot.record_id(corpus, 'madlad', 'es', unit, 'legacy', 2))

    def test_machine_checkpoint_cannot_approve_copy_or_invent_provenance(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'], 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        pilot.validate_record(row)
        for patch in [{'status': 'approved'}, {'reviewer': 'invented-reviewer'}, {'engine_revision': 'latest'}, {'source_hash': 'stale'}]:
            with self.subTest(patch=patch), self.assertRaises(ValueError): pilot.validate_record({**row, **patch})

    def test_model_execution_refuses_local_mac_before_importing_model_libraries(self):
        from unittest.mock import patch
        with patch.dict(pilot.os.environ, {'GITHUB_ACTIONS': 'false'}), self.assertRaises(SystemExit): pilot.actions_only()

    def test_complete_checkpoint_needs_no_model_and_tampered_identity_fails(self):
        corpus = {'sourceDigest': 'source-v1'}
        unit = {'key': 'tool.button', 'source_hash': hashlib.sha256(b'Save').hexdigest(), 'context': 'save-file', 'legacy': {}}
        identity = pilot.record_id(corpus, 'm2m100', 'es', unit, 'model', 2)
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'source': 'Save', 'source_hash': unit['source_hash'], 'corpus_digest': 'source-v1', 'locale': 'es', 'key': unit['key'], 'candidate': 'model', 'beam_size': 2}
        self.assertEqual(pilot.pending_work(corpus, [unit], ['es'], 'm2m100', 2, {identity: row}), [])
        self.assertEqual(pilot.pending_work(corpus, [unit], ['te'], 'm2m100', 2, {}), [])
        with self.assertRaises(ValueError):
            pilot.pending_work(corpus, [unit], ['es'], 'm2m100', 2, {identity: {**row, 'locale': 'ar'}})

    def test_log_collection_recovers_complete_records_without_approving_them(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': 'checkpoint', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        encoded = base64.b64encode(pilot.canonical(row).encode()).decode()
        with tempfile.TemporaryDirectory() as directory:
            log, output = Path(directory) / 'actions.log', Path(directory) / 'checkpoint.jsonl'
            log.write_text(f'timestamp UVPILOT_RECORD {encoded}\nJob failed afterwards\n')
            self.assertEqual(pilot.collect_logs([log, log], output), 1)
            self.assertIn('machine-draft', output.read_text())
            log.write_text('Job failed before its first record\n')
            with self.assertRaises(ValueError): pilot.collect_logs([log], output)

    def test_collecting_a_resumed_job_preserves_the_previous_checkpoint(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': 'old', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        new_row = {**row, 'record_id': 'new'}
        with tempfile.TemporaryDirectory() as directory:
            output, log = Path(directory) / 'checkpoint.jsonl', Path(directory) / 'resumed.log'
            output.write_text(pilot.canonical(row) + '\n')
            log.write_text('UVPILOT_RECORD ' + base64.b64encode(pilot.canonical(new_row).encode()).decode() + '\n')
            self.assertEqual(pilot.collect_logs([log], output), 2)
            self.assertEqual({json.loads(line)['record_id'] for line in output.read_text().splitlines()}, {'old', 'new'})
            before = output.read_bytes()
            log.write_text('UVPILOT_RECORD incomplete-invalid-base64\n')
            with self.assertRaises(ValueError): pilot.collect_logs([log], output)
            self.assertEqual(output.read_bytes(), before)

    def test_pilot_workflow_keeps_runner_context_out_of_job_environment(self):
        workflow = (pilot.ROOT / '.github/workflows/deploy-cloudflare.yml').read_text()
        job = workflow.split('\n  translation-pilot:\n', 1)[1]
        job_configuration, steps = job.split('\n    steps:\n', 1)
        self.assertNotIn('${{ runner.', job_configuration)
        self.assertIn('runs-on: ubuntu-latest', job_configuration)
        self.assertIn('max-parallel: 2', job_configuration)
        self.assertNotIn('secrets.', job)
        self.assertNotIn('wrangler', job)
        self.assertNotIn('upload-artifact', job)
        self.assertIn('persist-credentials: false', steps)

    def test_observed_semantic_errors_are_rejected_even_when_tokens_survive(self):
        fixtures = json.loads(Path(__file__).with_name('pilot-semantic-regressions.json').read_text())
        self.assertGreater(len(fixtures), 40)
        for row in fixtures:
            with self.subTest(locale=row['locale'], key=row['key'], candidate=row['observed_candidate']):
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], row['locale']))
        self.assertEqual(pilot.semantic_issues('shikaku.fields.resume', hashlib.sha256(b'Resume').hexdigest(), 'Reanudar', 'es'), [])

    def test_observed_madlad_marker_and_file_extension_losses_are_not_accepted(self):
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        broken = 'Audio decodificado localmente. Duración: 00000000 segundos.'
        self.assertFalse(pilot.automatic_checks(source, broken, 'es')['protected_tokens_identical'])
        _, saved = pilot.queue.protect(source)
        self.assertIsNone(pilot.queue.restore(broken, saved))
        checks = pilot.automatic_checks('Unsupported file. Choose an ASCII .dxf file.', 'Fil som ikke støttes. Velg en ASCII DXF- fil.', 'nb-NO')
        self.assertFalse(checks['technical_tokens_identical'])
        self.assertTrue(pilot.automatic_checks('Choose an ASCII .dxf file.', 'Velg en ASCII-.dxf-fil.', 'nb-NO')['technical_tokens_identical'])

    def test_agent_review_stays_bound_to_the_exact_observed_translations(self):
        directory = pilot.ROOT / 'docs/quality/translation-pilot'
        records = {}
        for path in (directory / 'checkpoints').glob('*.jsonl'):
            for line in path.read_text().splitlines():
                row = json.loads(line); records[row['record_id']] = row
        for filename, expected_count in [('review-es-nb.json', 240), ('review-core-six.json', 222)]:
            review = json.loads((directory / filename).read_text())
            self.assertFalse(review['native_review'])
            self.assertEqual(review['approved_locales'], [])
            self.assertEqual(len(review['rows']), expected_count)
            for row in review['rows']:
                with self.subTest(key=row['key'], locale=row['locale'], candidate=row['candidate']):
                    self.assertEqual(set(row['scores']), {'meaning', 'numbers_negations', 'naturalness'})
                    self.assertTrue(all(type(score) is int and 0 <= score <= 3 for score in row['scores'].values()))
                    self.assertTrue(row['notes'])
                    for identity in row['record_ids']:
                        actual = records[identity]
                        self.assertEqual(actual['source_hash'], row['source_hash'])
                        self.assertEqual(hashlib.sha256(actual['translation'].encode()).hexdigest(), row['translation_hash'])

    def test_a_valid_forward_translation_does_not_hide_broken_back_translation_tokens(self):
        checks = pilot.automatic_checks('Choose an audio file no larger than 25 MB.',
            'اختر ملفًا صوتيًا لا يزيد حجمه عن 25 MB.', 'ar',
            back_translation='Select the audio file not more than ZXPH0000QXZ MB.')
        self.assertTrue(checks['protected_tokens_identical'])
        self.assertFalse(checks['back_protected_tokens_identical'])

    def test_a_fully_resumed_run_never_downloads_or_imports_a_model(self):
        import contextlib
        import io
        from types import SimpleNamespace
        from unittest.mock import patch
        unit = {'key': 'tool.button', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest(), 'context': 'button', 'legacy': {}, 'reference': True}
        corpus = {'sourceDigest': 'source-v1', 'fullSourceUnits': 1, 'locales': ['en', 'es'], 'units': [unit]}
        identity = pilot.record_id(corpus, 'm2m100', 'es', unit, 'model', 2)
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': identity, 'corpus_digest': 'source-v1', 'locale': 'es', 'key': unit['key'], 'source': 'Save',
            'source_hash': unit['source_hash'], 'candidate': 'model', 'beam_size': 2}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root / 'corpus.json').write_text(json.dumps(corpus)); (root / 'resume.jsonl').write_text(json.dumps(row) + '\n')
            args = SimpleNamespace(corpus=root / 'corpus.json', resume=root / 'resume.jsonl', locales='es', scope='full', engine='m2m100', beam_size=2)
            stream = io.StringIO()
            with patch.object(pilot, 'actions_only'), patch.object(pilot.subprocess, 'run', side_effect=AssertionError('Unexpected model conversion')) as conversion, contextlib.redirect_stdout(stream):
                pilot.run(args)
            conversion.assert_not_called()
            self.assertIn('"conversion_seconds":0', stream.getvalue())

    def test_missing_sentence_spacing_is_not_misreported_as_a_file_extension_change(self):
        checks = pilot.automatic_checks('Audio decoded. Try again.', 'Audio decodificado.Prueba otra vez.', 'es')
        self.assertTrue(checks['technical_tokens_identical'])


if __name__ == '__main__': unittest.main()
