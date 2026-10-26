"""Direct current findings cannot disappear from exact permanent regressions."""
import importlib.util
import json
from pathlib import Path
import unittest
import hashlib
import copy
from types import SimpleNamespace
from unittest.mock import patch

sp = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(sp); sp.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class FindingsV28Test(unittest.TestCase):
    def test_all_direct_findings_bind_actual_original_records_and_permanent_cases(self):
        findings = json.loads((DATA / 'findings-v28.json').read_text())
        self.assertFalse(findings['native_review'])
        self.assertEqual(findings['approved_locales'], [])
        self.assertEqual(hashlib.sha256((DATA / findings['source_checkpoint']).read_bytes()).hexdigest(), findings['source_checkpoint_sha256'])
        records = {r['record_id']: r for file in (DATA / 'checkpoints').rglob('*.jsonl') for r in map(json.loads, file.read_text().splitlines())}
        for case in findings['cases']:
            for identity in case['observed_record_ids']:
                row = records[identity]
                with self.subTest(key=row['key'], direction=case['direction'], identity=identity):
                    field = 'translation' if case['direction'] == 'forward' else 'back_translation'
                    self.assertEqual(case['translation'], row[field])
                    for field in ['key', 'source_hash', 'locale']: self.assertEqual(case[field], row[field])
                    self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], case['translation'], row['locale'], case['direction']))

    def test_current_reviews_have_complete_warning_coverage_and_no_release_approval(self):
        records = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v28/madlad.jsonl').read_text().splitlines())}
        for name in ['references', 'legacy']:
            review = json.loads((DATA / f'review-context-v28-{name}.json').read_text())
            self.assertFalse(review['native_review']); self.assertEqual(review['approved_locales'], [])
            if name == 'references':
                self.assertEqual({row['key'] for row in review['rows']}, set(pilot.BENGALI_V28.contracts()['imports']))
            pilot.audit_review_warnings(review, records)
            for row in review['rows']:
                if min(row['scores'].values()) < 3:
                    raw = records[row['record_ids'][0]]
                    self.assertTrue(pilot.semantic_issues(raw['key'], raw['source_hash'], raw['translation'], 'bn'))
        spec = importlib.util.spec_from_file_location('baseline', Path(__file__).with_name('pilot-baseline-review.py'))
        baseline = importlib.util.module_from_spec(spec); spec.loader.exec_module(baseline)
        original = json.loads((DATA / 'review-batch1-bn-legacy.json').read_text())
        self.assertEqual(baseline.audit(original), 54)
        raw_addenda = (DATA / 'baseline-back-addenda-v28.json').read_text()
        addenda = json.loads(raw_addenda)
        for mutation in ['hash', 'forward', 'blocks', 'duplicate', 'approve']:
            changed = copy.deepcopy(addenda)
            if mutation == 'hash': changed[0]['review_file_sha256'] = 'stale'
            elif mutation == 'forward': changed[0]['warning_reconciliation'][0]['warnings'] = {'known_semantic_errors': dict(disposition='back-defect', blocks_gate=False, note='Invalid forward override')}
            elif mutation == 'blocks': changed[0]['warning_reconciliation'][0]['warnings']['known_back_semantic_errors']['blocks_gate'] = True
            elif mutation == 'duplicate': changed.append(copy.deepcopy(changed[0]))
            else: changed[0]['approved_locales'] = ['bn']
            proxy = SimpleNamespace(loads=lambda value: changed if value == raw_addenda else json.loads(value))
            with self.subTest(mutation=mutation), patch.object(baseline, 'json', proxy), self.assertRaises(ValueError): baseline.audit(original)


if __name__ == '__main__': unittest.main()
