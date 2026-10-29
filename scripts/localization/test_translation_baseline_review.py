"""Bound negative reviews and reusable candidates never become approvals."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('audit', Path(__file__).with_name('pilot-baseline-review.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
pilot, DATA = audit.pilot, audit.DATA


class BaselineReviewTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.reviews = {path.name: json.loads(path.read_text()) for path in DATA.glob('review-batch1-*.json')}
        historical = json.loads((DATA / 'regression-v28-preflight.json').read_text())
        cls.records = {row['record_id']: row for name in historical['historical_checkpoint_sha256'] for row in map(json.loads, (DATA / name).read_text().splitlines())}

    def test_nine_complete_reviews_bind402_original_records_without_new_inference(self):
        self.assertEqual(len(self.reviews), 9)
        self.assertEqual(sum(audit.audit(review) for review in self.reviews.values()), 402)
        self.assertEqual(sum(len(review['rows']) for review in self.reviews.values()), 321)

    def test_stale_missing_duplicate_or_approved_evidence_is_rejected(self):
        original = self.reviews['review-batch1-ur-madlad.json']
        for mutation in ['approval', 'gate', 'typed', 'inference', 'checkpoint', 'snapshot', 'missing-row', 'missing-id', 'context', 'record', 'forward', 'missing-warning', 'missing-flag', 'stale-back', 'perfect-defect', 'dismiss-defect', 'duplicate-warning']:
            review = copy.deepcopy(original)
            judgment = next(row for row in review['rows'] if min(row['scores'].values()) < 3)
            entry = next(entry for entry in review['warning_reconciliation'] if 'known_semantic_errors' in entry['warnings'])
            if mutation == 'approval': review['approved_locales'] = ['ur']
            elif mutation == 'gate': review['reference_gate']['passed'] = True
            elif mutation == 'typed': review['typed_profile_verified'] = True
            elif mutation == 'inference': review['new_inference_calls'] = 1
            elif mutation == 'checkpoint': review['checkpoint_sha256']['madlad'] = 'stale'
            elif mutation == 'snapshot': review['source_snapshot_sha256'] = 'stale'
            elif mutation == 'missing-row': review['rows'].pop()
            elif mutation == 'missing-id': judgment['record_ids'] = []
            elif mutation == 'context': judgment['canonical_context'] = 'wrong context'
            elif mutation == 'record': judgment['record_sha256'][judgment['record_ids'][0]] = 'stale'
            elif mutation == 'forward': judgment['translation_hash'] = 'stale'
            elif mutation == 'missing-warning': review['warning_reconciliation'].pop()
            elif mutation == 'missing-flag': entry['warnings'].pop('known_semantic_errors')
            elif mutation == 'stale-back': entry['back_translation_hash'] = 'stale'
            elif mutation == 'perfect-defect': judgment['scores'] = {key: 3 for key in judgment['scores']}
            elif mutation == 'dismiss-defect': entry['warnings']['known_semantic_errors'].update(disposition='reviewed-signal', blocks_gate=False)
            else: review['warning_reconciliation'].append(copy.deepcopy(entry))
            with self.subTest(mutation=mutation), self.assertRaises(ValueError):
                audit.audit(review)

    def test_unproved_localized_unit_does_not_become_a_fake_linguistic_error_or_pass(self):
        review = self.reviews['review-batch1-ru-madlad.json']
        row = next(row for row in review['rows'] if row['key'] == 'voice-changer.fields.tooLarge')
        self.assertEqual(set(row['scores'].values()), {3})
        self.assertTrue(row['data_contract_unproved'])
        entry = next(e for e in review['warning_reconciliation'] if e['record_id'] in row['record_ids'])
        self.assertEqual(entry['warnings']['technical_tokens']['disposition'], 'unproved-data')
        changed = copy.deepcopy(review)
        next(e for e in changed['warning_reconciliation'] if e['record_id'] in row['record_ids'])['warnings']['technical_tokens'].update(disposition='reviewed-signal', blocks_gate=False)
        with self.assertRaises(ValueError): audit.audit(changed)

    def test_word_quantities_need_locale_proof_even_when_baseline_parser_is_silent(self):
        changed = copy.deepcopy(self.reviews['review-batch1-bn-madlad.json'])
        row = next(row for row in changed['rows'] if row['key'] == 'shikaku.example')
        row['data_contract_unproved'] = False
        with self.assertRaisesRegex(ValueError, 'Word quantity'): audit.audit(changed)

    def test_back_upload_error_does_not_falsify_valid_russian_download_grade(self):
        review = self.reviews['review-batch1-ru-madlad.json']
        row = next(row for row in review['rows'] if row['key'] == 'dxf-viewer.fields.exportSvg')
        self.assertEqual(set(row['scores'].values()), {3})
        entry = next(e for e in review['warning_reconciliation'] if e['record_id'] in row['record_ids'])
        self.assertEqual(entry['warnings']['known_back_semantic_errors']['disposition'], 'back-defect')
        self.assertFalse(entry['warnings']['known_back_semantic_errors']['blocks_gate'])

    def test_only_exact_observed_records_gain_semantic_flags_and_frozen_benchmark_survives(self):
        proof = json.loads((DATA / 'batch1-regression-proof.json').read_text())
        prefix = pilot.SEMANTIC_REGRESSIONS[:1151]
        self.assertEqual(pilot.digest(prefix), proof['fixture_prefix_sha256'])
        self.assertGreaterEqual(len(pilot.SEMANTIC_REGRESSIONS), 1334)
        with patch.object(pilot, 'SEMANTIC_REGRESSIONS', prefix):
            before = {i: pilot.record_flags(row) for i, row in self.records.items()}
        with patch.object(pilot, 'SEMANTIC_REGRESSIONS', pilot.SEMANTIC_REGRESSIONS[:1334]):
            after = {i: pilot.record_flags(row) for i, row in self.records.items()}
        self.assertEqual(len(before), 15443)
        self.assertEqual(pilot.digest(before), proof['before_flags_sha256'])
        self.assertEqual(pilot.digest(after), proof['after_flags_sha256'])
        benchmark = json.loads((DATA / 'acceleration-measurements.json').read_text())
        self.assertEqual(pilot.digest(before), benchmark['record_flags_sha256'])
        actual = [{'record_id': i, 'flag': f} for i in before for f in before[i] if before[i][f] != after[i][f]]
        self.assertEqual(sorted(actual, key=str), sorted(proof['actual_changes'], key=str))
        findings = json.loads((DATA / 'batch1-observed-findings.json').read_text())
        allowed = {i for c in findings['cases'] for i in c['observed_record_ids']}
        self.assertEqual({x['record_id'] for x in actual}, allowed)
        self.assertEqual(set(proof['allowed_changed_record_ids']), allowed)
        for change in actual:
            self.assertIn(change['flag'], {'known_semantic_errors', 'known_back_semantic_errors'})
            self.assertFalse(before[change['record_id']][change['flag']])
            self.assertTrue(after[change['record_id']][change['flag']])

    def test_reusable_plan_is_exact_linguistic_preselection_with_no_import_or_approval(self):
        plan = json.loads((DATA / 'batch1-v28-candidate-plan.json').read_text())
        self.assertEqual(plan['approved_locales'], [])
        self.assertFalse(plan['engine_frozen'])
        self.assertEqual(plan['new_inference_calls'], 0)
        self.assertEqual(len(plan['rows']), 120)
        self.assertEqual(len({(r['locale'], r['key']) for r in plan['rows']}), 120)
        reusable = 0
        for row in plan['rows']:
            possible = [(name, j) for name, review in self.reviews.items() for j in review['rows'] if j['locale'] == row['locale'] and j['key'] == row['key'] and min(j['scores'].values()) == 3]
            if row['status'] == 'manual-forward-repair-required':
                self.assertEqual(possible, [])
                continue
            reusable += 1
            judgment = next(j for j in self.reviews[row['review_file']]['rows'] if j['key'] == row['key'])
            self.assertEqual(min(judgment['scores'].values()), 3)
            for field in ['source_hash', 'canonical_context', 'translation_hash', 'record_ids', 'record_sha256', 'data_contract_unproved']:
                self.assertEqual(row[field], judgment[field])
            for identity in row['record_ids']: self.assertEqual(row['translation'], self.records[identity]['translation'])
        self.assertEqual(reusable, 106)
        for name, digest in plan['review_sha256'].items(): self.assertEqual(audit.text_hash((DATA / name).read_text()), digest)
        for comparison in plan['same27_comparison']:
            review = self.reviews[comparison['review_file']]
            keys = {r['key'] for r in self.reviews[f"review-batch1-{review['locale']}-legacy.json"]['rows']}
            self.assertEqual({key: comparison[key] for key in audit.metrics(review, keys)}, audit.metrics(review, keys))


if __name__ == '__main__':
    unittest.main()
