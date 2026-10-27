"""Four observed Russian defects: exact retirement, provenance and safe reuse."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

HERE = Path(__file__).parent
entry_path = HERE / 'translation-pilot-v33.py'
spec = importlib.util.spec_from_file_location('entry32', entry_path if entry_path.exists() else HERE / 'translation-pilot-v32.py')
entry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(entry)
pilot = entry.pilot
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
PLAN = {'required_repairs': [{'key': 'dxf-viewer.fields.loaded', 'draft_translation': 'Чертёж загружен локально.', 'retired_translation': 'Чертеж загружается локально.'}]}


class RussianV33Test(unittest.TestCase):
    def test_completed_loading_state_are_repaired_in_active_memory(self):
        units = pilot.RUSSIAN_V32.contracts()['units']
        policy = 'context-v33' if 'context-v33' in pilot.POLICIES else 'context-v32'
        for case in PLAN['required_repairs']:
            with self.subTest(key=case['key']):
                self.assertEqual(pilot.reviewed_memory(units[case['key']], 'ru', policy), case['draft_translation'])

    def test_only_one_russian_variants_change_and_old_snapshot_stays_exact(self):
        old = pilot.POLICIES['context-v32']['reviewed_memory']
        new = pilot.POLICIES['context-v33']['reviewed_memory']
        differences = [(key, locale) for key, row in old.items() for locale, value in row['translations'].items() if value != new[key]['translations'][locale]]
        self.assertEqual(set(differences), {(c['key'], 'ru') for c in PLAN['required_repairs']})
        self.assertEqual(sum(len(r['translations']) for r in new.values()), 905)
        proof = json.loads((DATA / 'v33-baseline.json').read_text())
        for path, digest in proof['frozen_runtime_sha256'].items():
            self.assertEqual(hashlib.sha256((pilot.ROOT / path).read_bytes()).hexdigest(), digest)
        for path, digest in proof['old_checkpoint_sha256'].items():
            self.assertEqual(hashlib.sha256((DATA / path).read_bytes()).hexdigest(), digest)

    def test_contracts_reject_stale_retirement_and_target_after_warming(self):
        route = pilot.RUSSIAN_V33
        self.assertTrue(route.preflight_memory())
        path_type = type(DATA)
        native = path_type.read_bytes
        for filename in ['retired-memory-v32.json', 'review-context-v32-full.json', 'reviewed-memory-v33-import.json']:
            def changed(path):
                data = native(path)
                return data + b' ' if path == DATA / filename else data
            with self.subTest(filename=filename), patch.object(path_type, 'read_bytes', changed), self.assertRaises(ValueError):
                route.contracts()
        policy = copy.deepcopy(pilot.POLICIES['context-v33'])
        policy['reviewed_memory']['dxf-viewer.fields.loaded']['translations']['ru'] = PLAN['required_repairs'][-1]['retired_translation']
        with patch.dict(pilot.POLICIES, {'context-v33': policy}), self.assertRaises(ValueError):
            route.contracts()

    def test_no_mass_inference_or_ungated_full_run(self):
        from types import SimpleNamespace
        route = pilot.RUSSIAN_V33
        for locale in ['', 'ur', 'ru,ur']:
            with self.subTest(locale=locale), patch.object(pilot, 'actions_only'), patch.object(pilot.subprocess, 'run', side_effect=AssertionError('model started')), self.assertRaises(ValueError):
                route.run(SimpleNamespace(policy='context-v33', locales=locale, scope='full'))
        original = pilot.policy_digest
        with patch.object(pilot, 'policy_digest', side_effect=lambda name: 'stale' if name == 'context-v33' else original(name)), self.assertRaises(ValueError):
            route.full_allowed()
