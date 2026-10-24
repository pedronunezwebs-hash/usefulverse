"""CI evidence must report the isolated preview, not the preceding ordinary hub build."""
import json
from pathlib import Path
import re
import unittest

DATA = Path(__file__).resolve().parents[2] / 'docs/quality/translation-pilot'


class TranslationCIEvidenceTest(unittest.TestCase):
    def test_preview_count_matches_its_own_step_and_covers_all_generated_tool_pages(self):
        checked = 0
        for path in DATA.glob('ci-v*-verification.json'):
            document = json.loads(path.read_text())
            for run in document.get('runs', []):
                if 'verified_counts' not in run or 'evidence_lines' not in run:
                    continue
                with self.subTest(file=path.name, run=run['run_id']):
                    lines = run['evidence_lines']
                    build = [line for line in lines if 'Built 0 Growth600 pages for 300 tools' in line]
                    self.assertEqual(len(build), 1, 'Must retain the actual preview build line')
                    count = int(re.search(r'\((\d+) files, \d+ bytes\)', build[0]).group(1))
                    self.assertEqual(run['verified_counts']['preview_files'], count)
                    self.assertGreaterEqual(count, run['verified_counts']['preview_tool_pages_noindex'])
                    checked += 1
        self.assertGreaterEqual(checked, 2)


if __name__ == '__main__': unittest.main()
