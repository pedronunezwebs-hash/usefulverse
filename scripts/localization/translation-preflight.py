#!/usr/bin/env python3
"""Check translation safety before scheduling model jobs; no inference or publishing."""
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
MODULES = ('test_translation_autopilot.py', 'test_translation_refinement.py',
           'test_translation_preview.py', 'test_translation_preflight_contracts.py')


def run(execute=subprocess.run):
    commands = [[sys.executable, '-m', 'unittest', 'discover', '-s', 'scripts/localization', '-p', module]
                for module in MODULES]
    commands.append(['node', '--test', 'scripts/localization/automatic-packages.test.mjs',
                     'scripts/localization/automatic-preview.test.mjs'])
    for index, command in enumerate(commands):
        try:
            result = execute(command, cwd=ROOT, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'}, check=False)
        except OSError as error:
            print(f'Translation preflight could not start check {index + 1}: {error}', file=sys.stderr)
            return 1
        if type(result.returncode) is not int or result.returncode != 0:
            print(f'Translation preflight blocked at check {index + 1}', file=sys.stderr)
            return result.returncode if type(result.returncode) is int and 1 <= result.returncode <= 125 else 1
    print('UVTRANSLATION_PREFLIGHT ' + json.dumps(dict(checks=len(commands), passed=True, inference=False, approved=False)))
    return 0


if __name__ == '__main__':
    raise SystemExit(run())
