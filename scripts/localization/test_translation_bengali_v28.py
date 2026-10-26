"""The new Bengali route must prove data and exact memory; no locale approval."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
CORRECTIONS = {'dxf-viewer.fields.resetView': 'অঙ্কনটি পর্দায় ফিট করুন',
               'dxf-viewer.fields.zoomOut': 'ছোট করে দেখুন',
               'shikaku.fields.check': 'ধাঁধা যাচাই করুন'}


class BengaliV28Test(unittest.TestCase):
    def test_forty_exact_references_use_reviewed_memory_and_preserve477_prior_targets(self):
        units = {u['key']: u for u in json.loads((DATA / 'numeric-sources/context-v24/source-snapshot.json').read_text())['units']}
        plan = json.loads((DATA / 'batch1-v28-candidate-plan.json').read_text())
        for row in [r for r in plan['rows'] if r['locale'] == 'bn']:
            unit = units[row['key']]
            expected = CORRECTIONS.get(row['key'], row.get('translation'))
            with self.subTest(key=row['key']):
                self.assertEqual(pilot.reviewed_memory(unit, 'bn', 'context-v28'), expected)
                self.assertEqual(pilot.semantic_issues(unit['key'], unit['source_hash'], expected, 'bn'), [])
        def preserved(before, after):
            if isinstance(before, dict): return isinstance(after, dict) and all(k in after and preserved(v, after[k]) for k, v in before.items())
            return before == after
        self.assertTrue(preserved(pilot.POLICIES['context-v27']['reviewed_memory'], pilot.POLICIES['context-v28']['reviewed_memory']))
        self.assertEqual(sum(len(item['translations']) for item in pilot.POLICIES['context-v28']['reviewed_memory'].values()), 517)

    def test_bengali_values_and_multiplicity_are_proved_without_accepting_wrong_values(self):
        for source, good, bad in [('Enter four valid coordinates.', 'চারটি সঠিক স্থানাঙ্ক লিখুন।', 'পাঁচটি সঠিক স্থানাঙ্ক লিখুন।'),
                                  ('Value 25 MB.', 'মান ২৫ MB।', 'মান ২৫০ MB।'),
                                  ('One rectangle covers six squares.', 'একটি আয়তক্ষেত্র ছয়টি ঘর ঢাকে।', 'একটি আয়তক্ষেত্র পাঁচটি ঘর ঢাকে।')]:
            with self.subTest(source=source):
                self.assertTrue(pilot.policy_typed_data_checks(source, good, 'en', 'bn', 'context-v28')['quantities'])
                self.assertFalse(pilot.policy_typed_data_checks(source, bad, 'en', 'bn', 'context-v28')['quantities'])


if __name__ == '__main__': unittest.main()
