"""Coverage policy totals must come from reviewed groups, not manual increments."""
import json
from pathlib import Path
import unittest
DATA=Path(__file__).resolve().parents[2]/'docs/quality/translation-pilot'
class CoverageInventoryTest(unittest.TestCase):
    def test_contextual_policy_count_matches_the_actual_review_inventory(self):
        groups=json.loads((DATA/'review-metrics.json').read_text())['groups']
        actual={g['policy']for g in groups if g.get('policy','').startswith('context-v')}
        coverage=json.loads((DATA/'reference-coverage.json').read_text())
        self.assertEqual(coverage['contextual_policies_reviewed'],len(actual))

    def test_regression_counters_match_actual_global_and_scoped_cases(self):
        root = Path(__file__).parent
        coverage = json.loads((DATA / 'reference-coverage.json').read_text())
        global_count = len(json.loads((root / 'pilot-semantic-regressions.json').read_text()))
        back = sum(len(json.loads(p.read_text())['cases']) for p in DATA.glob('scoped-back-regressions-v*.json'))
        forward = sum(len(json.loads(p.read_text())['cases']) for p in DATA.glob('scoped-forward-regressions-v*.json'))
        self.assertEqual(coverage['scoped_back_regressions'], back)
        self.assertEqual(coverage['scoped_forward_regressions'], forward)
        self.assertEqual(coverage['total_permanent_regression_cases'], global_count + back + forward)

if __name__=='__main__':unittest.main()
