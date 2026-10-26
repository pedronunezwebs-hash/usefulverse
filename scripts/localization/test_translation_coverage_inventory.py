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
if __name__=='__main__':unittest.main()
