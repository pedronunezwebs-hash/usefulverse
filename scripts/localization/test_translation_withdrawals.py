"""A discovered forward error can withdraw an old perfect score only explicitly and fail closed."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'


class HistoricalWithdrawalTest(unittest.TestCase):
    def evidence(self):
        records = {r['record_id']: r for f in (DATA / 'checkpoints').rglob('*.jsonl') for r in map(json.loads, f.read_text().splitlines())}
        manifest = json.loads((DATA / 'review-withdrawal-addenda.json').read_text())
        item = manifest[0]
        raw = (DATA / item['review_file']).read_bytes()
        return records, manifest, raw, json.loads(raw)

    def test_actual_withdrawal_keeps_original_bytes_and_grade_visible_and_never_approves(self):
        records, manifest, raw, review = self.evidence()
        original = copy.deepcopy(review)
        entries = pilot.historical_forward_withdrawals(review, records)
        self.assertEqual(len(entries), 1)
        entry = entries[0]
        self.assertEqual(entry['scores'], {'meaning': 3, 'numbers_negations': 3, 'naturalness': 2})
        self.assertEqual(entry['original_scores'], {'meaning': 3, 'numbers_negations': 3, 'naturalness': 3})
        self.assertTrue(pilot.record_flags(records[entry['record_id']])['known_semantic_errors'])
        pilot.audit_review_warnings(review, records, check_coverage=False)
        self.assertEqual(review, original)
        self.assertEqual(raw, (DATA / manifest[0]['review_file']).read_bytes())
        self.assertFalse(review['full_gate']['es']['passed'])
        self.assertEqual(review['approved_locales'], [])

    def test_tampered_or_unbound_withdrawal_cannot_hide_a_forward_error_or_a_passed_gate(self):
        records, manifest, raw, review = self.evidence()
        # The real data must validate before adversarial changes, so absence of the new reader is RED.
        self.assertEqual(len(pilot.historical_forward_withdrawals(review, records)), 1)
        cases = ['missing', 'byte-hash', 'digest', 'duplicate', 'duplicate-entry', 'path', 'record', 'key', 'locale', 'context', 'policy', 'source',
                 'translation', 'back', 'original-grade', 'same-grade', 'better-grade', 'float-grade', 'no-note', 'no-reason', 'no-reviewer',
                 'native', 'auto', 'approved', 'back-disposition', 'nonblocking', 'extra-warning', 'passed', 'passed-other-locale', 'no-fixture']
        for case in cases:
            changed = copy.deepcopy(manifest); current = copy.deepcopy(review)
            item = changed[0]; entry = item['entries'][0]
            if case == 'missing': changed = []
            elif case == 'byte-hash': item['review_file_sha256'] = '0' * 64
            elif case == 'digest': item['review_digest'] = 'stale'
            elif case == 'duplicate': changed.append(copy.deepcopy(item))
            elif case == 'duplicate-entry': item['entries'].append(copy.deepcopy(entry))
            elif case == 'path': item['review_file'] = '../outside.json'
            elif case == 'record': entry['record_id'] = next(k for k in records if k != entry['record_id'])
            elif case in ['key', 'locale', 'context']: entry[case] = 'foreign'
            elif case == 'policy': entry['inference_policy'] = 'context-v13'
            elif case == 'source': entry['source_hash'] = '0' * 64
            elif case == 'translation': entry['translation_hash'] = '0' * 64
            elif case == 'back': entry['back_translation_hash'] = '0' * 64
            elif case == 'original-grade': entry['original_scores']['naturalness'] = 2
            elif case == 'same-grade': entry['scores']['naturalness'] = 3
            elif case == 'better-grade': entry['scores']['meaning'] = 4
            elif case == 'float-grade': entry['scores']['naturalness'] = 2.0
            elif case == 'no-note': entry['note'] = ' '
            elif case == 'no-reason': item['reason'] = ' '
            elif case == 'no-reviewer': item['reviewer'] = ' '
            elif case == 'native': item['native_review'] = True
            elif case == 'auto': item['automatic_approval'] = True
            elif case == 'approved': item['approved_locales'] = ['es']
            elif case == 'back-disposition': entry['warning']['known_semantic_errors']['disposition'] = 'back-defect'
            elif case == 'nonblocking': entry['warning']['known_semantic_errors']['blocks_gate'] = False
            elif case == 'extra-warning': entry['warning']['length_ratio'] = copy.deepcopy(entry['warning']['known_semantic_errors'])
            elif case in ['passed', 'passed-other-locale']: current['full_gate']['es' if case == 'passed' else 'nb-NO']['passed'] = True
            current_raw = raw if case not in ['passed', 'passed-other-locale'] else (json.dumps(current, ensure_ascii=False, indent=2) + '\n').encode()
            if case in ['passed', 'passed-other-locale']:
                item['review_file_sha256'] = hashlib.sha256(current_raw).hexdigest(); item['review_digest'] = pilot.digest(current)
            with tempfile.TemporaryDirectory() as tmp:
                directory = Path(tmp) / 'docs/quality/translation-pilot'; directory.mkdir(parents=True)
                (directory / manifest[0]['review_file']).write_bytes(current_raw)
                (directory / 'review-withdrawal-addenda.json').write_text(json.dumps(changed))
                (directory / 'review-warning-addenda.json').write_bytes((DATA / 'review-warning-addenda.json').read_bytes())
                fixtures = pilot.SEMANTIC_REGRESSIONS[:580] if case == 'no-fixture' else pilot.SEMANTIC_REGRESSIONS
                with patch.object(pilot, 'ROOT', Path(tmp)), patch.object(pilot, 'SEMANTIC_REGRESSIONS', fixtures), self.subTest(case=case), self.assertRaises(ValueError):
                    if case in ['no-fixture', 'passed-other-locale']:
                        pilot.historical_forward_withdrawals(current, records)
                    else:
                        pilot.audit_review_warnings(current, records, check_coverage=False)


if __name__ == '__main__': unittest.main()
