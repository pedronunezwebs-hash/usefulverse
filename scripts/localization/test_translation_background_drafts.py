import argparse
import base64
import copy
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import types
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('background_drafts', HERE / 'background-drafts.py')
drafts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(drafts)


class BackgroundDraftsTest(unittest.TestCase):
    def unit(self, key='a.copy.button', source='Use {count} files; -12.5% stays on your device.', context='Shared UI copy.actions.load'):
        return dict(key=key, source=source, source_hash=drafts.digest(source), context=context)

    def record(self):
        unit = drafts.work_items({'units': [self.unit()]}, ['es'], 0, 4)[0]
        return drafts.make_record(unit, 'Usa {count} archivos; -12.5% permanece en tu dispositivo.', False,
                                  'Usa {count} archivos; -12.5% permanece en tu dispositivo.', 1.0)

    def test_deduplication_requires_exact_context_source_and_locale(self):
        one = self.unit()
        same = self.unit(key='b.copy.button')
        other_context = self.unit(key='c.copy.button', context='Other UI')
        work = drafts.work_items({'units': [one, same, other_context]}, ['es', 'fr'], 0, 1)
        self.assertEqual(len(work), 4)
        self.assertEqual(sum(len(row['keys']) for row in work), 6)
        self.assertEqual(len({row['record_id'] for row in work}), 4)
        stale = copy.deepcopy(one)
        stale['source'] += '!'
        with self.assertRaises(ValueError):
            drafts.work_items({'units': [stale]}, ['es'], 0, 1)
        with self.assertRaises(ValueError):
            drafts.work_items({'units': [one, one]}, ['es'], 0, 1)

    def test_four_shards_partition_all_36_destinations_without_overlap(self):
        groups = [drafts.work_items({'units': [self.unit()]}, drafts.LOCALES, shard, 4) for shard in range(4)]
        self.assertEqual([len(group) for group in groups], [9, 9, 9, 9])
        self.assertEqual(len({row['locale'] for group in groups for row in group}), 36)
        with self.assertRaises(ValueError):
            drafts.work_items({'units': []}, ['xx'], 0, 4)

    def test_numbers_signs_placeholders_code_and_urls_are_preserved(self):
        source = 'Open {file} at https://example.com/a?q=2 with -12.5% +4 PDF `a=5`.'
        masked, saved = drafts.protect(source)
        self.assertEqual(drafts.queue.restore(masked, saved), source)
        translation = source.replace('Open', 'Abre').replace('with', 'con').replace('at ', 'en ')
        self.assertTrue(all(drafts.checks(source, translation).values()))
        for damaged in [translation.replace('-12.5%', '12.5%'), translation.replace('{file}', '{files}'),
                        translation.replace('PDF', 'pdf'), translation + ' ZXQPH0000QXZ']:
            self.assertFalse(all(drafts.checks(source, damaged).values()))
        self.assertFalse(drafts.checks('Open a file', '')['nonempty'])
        self.assertFalse(drafts.checks('Open a file', 'Open a file')['translated'])
        self.assertFalse(drafts.checks('Open a file', 'Abre un archivo', True)['not_truncated'])

    def test_checkpoint_recovery_accepts_timestamped_logs_but_rejects_tampering(self):
        row = self.record()
        drafts.validate_record(row)
        with tempfile.TemporaryDirectory() as root:
            path = Path(root) / 'job.log'
            path.write_text('log header\n2026-10-27T00:00:00Z ' + drafts.PREFIX +
                            base64.b64encode(drafts.canonical(row).encode()).decode() + '\n')
            self.assertEqual(drafts.load_records([path]), {row['record_id']: row})
            changed = copy.deepcopy(row)
            changed['translation'] = changed['translation'].replace('Usa', 'Utiliza')
            path.write_text(drafts.canonical(row) + '\n' + drafts.canonical(changed) + '\n')
            with self.assertRaisesRegex(ValueError, 'Conflicting'):
                drafts.load_records([path])
        for field, value in [('approved', True), ('source_hash', 'bad'), ('beam_size', 1), ('revision', 'main')]:
            bad = copy.deepcopy(row)
            bad[field] = value
            with self.assertRaises(ValueError):
                drafts.validate_record(bad)

    def test_inference_cannot_start_on_the_mac(self):
        with patch.dict(os.environ, {'GITHUB_ACTIONS': '', 'RUNNER_OS': 'macOS'}):
            with self.assertRaisesRegex(RuntimeError, 'never on the Mac'):
                drafts.generate(argparse.Namespace())

    def test_end_to_end_round_robin_flush_resume_and_no_approval(self):
        class FakeModel:
            calls = []
            def __init__(self, directory):
                pass
            def translate(self, texts, locale):
                self.calls.append((locale, len(texts)))
                return [('Traducción ' + text, False) for text in texts]
        with tempfile.TemporaryDirectory() as root:
            root = Path(root)
            corpus = root / 'corpus.json'
            corpus.write_text(json.dumps({'tools': 1, 'units': [self.unit()]}))
            output = root / 'drafts.jsonl'
            args = argparse.Namespace(corpus=corpus, output=output, model_dir=root/'model', locales='es,fr',
                                      shard=0, shards=1, minutes=1, resume=[])
            env = {'GITHUB_ACTIONS': 'true', 'RUNNER_OS': 'Linux',
                   'GITHUB_REPOSITORY': 'pedronunezwebs-hash/usefulverse', 'GITHUB_STEP_SUMMARY': ''}
            detector = types.SimpleNamespace(classify=lambda text: ('es', 0))
            with patch.dict(os.environ, env), patch.object(drafts, 'Model', FakeModel), patch.dict('sys.modules', {'langid': detector}), contextlib.redirect_stdout(io.StringIO()):
                drafts.generate(args)
                first = output.read_bytes()
                args.resume = [output]
                drafts.generate(args)
                self.assertEqual(output.read_bytes(), first)
                self.assertEqual(FakeModel.calls, [('es', 1), ('en', 1), ('fr', 1), ('en', 1)])
            rows = drafts.load_records([output])
            self.assertEqual(len(rows), 2)
            self.assertTrue(all(row['approved'] is False for row in rows.values()))

    def test_automatic_language_script_and_back_negation_warnings(self):
        row = self.record()
        row['detected_language'] = 'en'
        self.assertIn('language_detection', drafts.warnings(row))
        row['locale'] = 'ur'
        self.assertIn('wrong_script', drafts.warnings(row))
        row['source'] = 'Your files never leave your device.'
        row['back_sample'] = dict(translation='Your files leave your device.', truncated=False)
        self.assertIn('back_negation', drafts.warnings(row))

    def test_long_input_is_reported_without_truncating_or_sending_it(self):
        model = drafts.Model.__new__(drafts.Model)
        model.tokenizer = types.SimpleNamespace(encode=lambda text: list(text), convert_ids_to_tokens=lambda tokens: tokens,
                                                convert_tokens_to_ids=lambda tokens: tokens, decode=lambda tokens, **kwargs: ''.join(tokens))
        calls = []
        def translate(inputs, **kwargs):
            calls.extend(inputs)
            return [types.SimpleNamespace(hypotheses=[list('hola')]) for item in inputs]
        model.translator = types.SimpleNamespace(translate_batch=translate)
        self.assertEqual(model.translate(['x' * 600, 'hello'], 'es'), [('x' * 600, True), ('hola', False)])
        self.assertEqual(len(calls), 1)

    def test_traditional_chinese_applies_the_existing_regional_conversion(self):
        model = drafts.Model.__new__(drafts.Model)
        model.tokenizer = types.SimpleNamespace(encode=lambda text: list(text), convert_ids_to_tokens=lambda tokens: tokens,
                                                convert_tokens_to_ids=lambda tokens: tokens, decode=lambda tokens, **kwargs: ''.join(tokens))
        model.translator = types.SimpleNamespace(translate_batch=lambda inputs, **kwargs: [types.SimpleNamespace(hypotheses=[list('文件')])])
        conversion = types.SimpleNamespace(convert=lambda text: text.replace('文件', '檔案'))
        with patch.dict('sys.modules', {'opencc': types.SimpleNamespace(OpenCC=lambda config: conversion)}):
            self.assertEqual(model.translate(['a file'], 'zh-TW'), [('檔案', False)])

    def test_workflow_has_no_billing_storage_secrets_writes_or_deploy(self):
        text = (HERE.parents[1] / '.github/workflows/translation-drafts.yml').read_text()
        self.assertIn('runs-on: ubuntu-latest', text)
        self.assertIn('max-parallel: 2', text)
        self.assertIn('timeout-minutes: 300', text)
        self.assertIn('persist-credentials: false', text)
        for forbidden in ['contents: write', 'secrets.', 'upload-artifact', 'actions/cache', 'wrangler', 'pull_request_target', 'schedule:']:
            self.assertNotIn(forbidden, text)


if __name__ == '__main__':
    unittest.main()
