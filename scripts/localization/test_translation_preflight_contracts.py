import contextlib
import datetime as dt
import importlib.util
import io
from pathlib import Path
import types
import unittest

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('preflight', HERE / 'translation-preflight.py')
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)


class PreflightContractsTest(unittest.TestCase):
    def execute(self, callback):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return preflight.run(callback)

    def test_complete_safety_and_adapter_suites_run_without_inference_or_shell(self):
        calls = []
        def execute(command, **options):
            calls.append((command, options))
            self.assertEqual(options['cwd'], preflight.ROOT)
            self.assertFalse(options['check'])
            self.assertNotIn('shell', options)
            self.assertEqual(options['env']['PYTHONDONTWRITEBYTECODE'], '1')
            return types.SimpleNamespace(returncode=0)
        self.assertEqual(self.execute(execute), 0)
        self.assertEqual([command[-1] for command, _ in calls[:-1]], list(preflight.MODULES))
        self.assertEqual(calls[-1][0], ['node', '--test', 'scripts/localization/automatic-packages.test.mjs',
                                      'scripts/localization/automatic-preview.test.mjs'])

    def test_a_failure_in_any_suite_stops_before_running_later_checks(self):
        for fail_at in range(len(preflight.MODULES) + 1):
            with self.subTest(fail_at=fail_at):
                calls = []
                def execute(command, **options):
                    calls.append(command)
                    return types.SimpleNamespace(returncode=7 if len(calls) == fail_at + 1 else 0)
                self.assertEqual(self.execute(execute), 7)
                self.assertEqual(len(calls), fail_at + 1)

    def test_process_signals_invalid_status_and_missing_runtime_block_the_gate(self):
        for status in (-9, None, True, 256):
            with self.subTest(status=status):
                self.assertEqual(self.execute(lambda *args, **kwargs: types.SimpleNamespace(returncode=status)), 1)
        def unavailable(*args, **kwargs): raise FileNotFoundError('runtime unavailable')
        self.assertEqual(self.execute(unavailable), 1)

    def test_models_depend_on_preflight_of_the_same_pinned_source(self):
        workflow = (preflight.ROOT / '.github/workflows/translation-autopilot.yml').read_text()
        self.assertIn('\n  preflight:\n', workflow, 'Model scheduling must have a safety dependency')
        gate = workflow.split('\n  preflight:\n', 1)[1].split('\n  wave-1:\n', 1)[0]
        self.assertIn('needs: ready', gate)
        self.assertIn("if: needs.ready.outputs.run_models == 'true'", gate)
        self.assertIn('uses: ./.github/workflows/translation-preflight.yml', gate)
        self.assertIn('source_sha: ${{ needs.ready.outputs.source_sha }}', gate)
        first = workflow.split('\n  wave-1:\n', 1)[1].split('\n  wave-2:\n', 1)[0]
        self.assertIn('needs: [ready, preflight]', first)
        self.assertNotIn('continue-on-error', gate + first)
        self.assertNotIn('always()', first)
        self.assertNotIn('failure()', first)

    def test_preflight_failure_is_an_actionable_alert_even_with_an_old_empty_queue(self):
        spec = importlib.util.spec_from_file_location('preflight_alerts', HERE / 'translation-alerts.py')
        alerts = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(alerts)
        run = dict(id=42, status='completed', conclusion='failure', created_at='2026-10-28T00:00:00Z')
        jobs = [dict(name='preflight / safety', status='completed', conclusion='failure')]
        report = dict(run_id=41, pending=0, quarantined=0)
        state, message = alerts.classify(run, jobs, report, dt.datetime(2026, 10, 28, tzinfo=dt.timezone.utc))
        self.assertEqual(state, 'failed')
        self.assertIn('preflight / safety', message)

    def test_preflight_is_public_standard_read_only_and_runs_the_real_contracts(self):
        path = preflight.ROOT / '.github/workflows/translation-preflight.yml'
        self.assertTrue(path.is_file(), 'Reusable preflight workflow must exist')
        workflow = path.read_text()
        self.assertIn('workflow_call:', workflow)
        self.assertIn("ref: ${{ inputs.source_sha || 'feat/new-tools-batch-1' }}", workflow)
        self.assertIn("github.event.repository.private == false", workflow)
        self.assertIn('runs-on: ubuntu-latest', workflow)
        self.assertIn('contents: read', workflow)
        self.assertIn("python-version: '3.11'", workflow)
        self.assertIn('node-version-file: .node-version', workflow)
        self.assertIn('run: python scripts/localization/translation-preflight.py', workflow)
        for forbidden in ('contents: write', 'secrets:', 'upload-artifact', 'actions/cache', 'cache:', 'continue-on-error'):
            self.assertNotIn(forbidden, workflow)


if __name__ == '__main__': unittest.main()
