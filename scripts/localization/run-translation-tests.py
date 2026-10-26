#!/usr/bin/env python3
"""Run the complete discovered translation suite on at most four local CPUs.

No test selection or retry: module fixtures stay together, every case ID is
accounted for, and a worker crash, missing case, failure or error fails the job.
"""
import argparse
import ast
from collections import Counter, defaultdict
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest

HERE = Path(__file__).resolve().parent


def flatten(suite):
    for item in suite:
        if isinstance(item, unittest.TestSuite):
            yield from flatten(item)
        else:
            yield item


def validate_results(expected, rows):
    """Counts alone cannot prove all tests ran: validate the exact multiset."""
    if len(expected) != len(set(expected)) or not expected:
        raise ValueError('Expected inventory must be nonempty and unique')
    actual = []
    for row in rows:
        ids = row['ids']
        if row['tests'] != len(ids):
            raise ValueError('Worker test count does not match executed case IDs')
        for name in ('tests', 'failures', 'errors', 'skipped'):
            if type(row[name]) is not int or row[name] < 0:
                raise ValueError('Invalid worker result count')
        if row['skipped'] > row['tests']:
            raise ValueError('Invalid skipped count')
        actual.extend(ids)
    if Counter(actual) != Counter(expected):
        raise ValueError('Missing, duplicate or unknown executed case ID')
    return True


class InventoryResult(unittest.TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.executed_ids = []

    def startTest(self, test):
        self.executed_ids.append(test.id())
        super().startTest(test)


def worker(args):
    sys.path.insert(0, str(args.test_dir))
    ids = json.loads(args.ids_json.read_text())
    suite = unittest.defaultTestLoader.loadTestsFromNames(ids)
    loaded = [test.id() for test in flatten(suite)]
    if loaded != ids:
        raise ValueError('Worker could not load its exact assigned inventory')
    stream = io.StringIO()
    result = unittest.TextTestRunner(stream=stream, resultclass=InventoryResult).run(suite)
    data = dict(ids=result.executed_ids, tests=result.testsRun,
                failures=len(result.failures) + len(result.unexpectedSuccesses),
                errors=len(result.errors), skipped=len(result.skipped))
    args.result_json.write_text(json.dumps(data))
    if not result.wasSuccessful():
        sys.stderr.write(stream.getvalue())
    return 0 if result.wasSuccessful() else 1


def partition(expected, jobs, test_dir):
    """Keep module fixtures; split only the audited stateless generic module."""
    path = Path(test_dir) / 'test_translation_pilot.py'
    can_split = False
    if path.exists():
        tree = ast.parse(path.read_text())
        fixtures = {'setUpModule', 'tearDownModule', 'setUpClass', 'tearDownClass',
                    'setUp', 'tearDown', 'asyncSetUp', 'asyncTearDown'}
        classes = [node for node in tree.body if isinstance(node, ast.ClassDef)]
        can_split = bool(classes) and all(
            not node.decorator_list and not node.keywords and len(node.bases) == 1 and ast.unparse(node.bases[0]) == 'unittest.TestCase'
            for node in classes) and not any(
                isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in fixtures
                for node in ast.walk(tree))
    groups = defaultdict(list)
    for case in expected:
        module = case.split('.', 1)[0]
        groups[case if can_split and module == 'test_translation_pilot' else module].append(case)
    buckets = [[] for _ in range(min(jobs, len(groups)))]
    for group in sorted(groups, key=lambda name: (-len(groups[name]), name)):
        min(buckets, key=len).extend(groups[group])
    return [bucket for bucket in buckets if bucket]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--jobs', type=int, default=4)
    parser.add_argument('--test-dir', type=Path, default=HERE)
    parser.add_argument('--pattern', default='test_translation*.py')
    parser.add_argument('--scratch-parent', type=Path)
    parser.add_argument('--worker', action='store_true', help=argparse.SUPPRESS)
    parser.add_argument('--ids-json', type=Path, help=argparse.SUPPRESS)
    parser.add_argument('--result-json', type=Path, help=argparse.SUPPRESS)
    args = parser.parse_args()
    if not 1 <= args.jobs <= 4:
        parser.error('--jobs must be in 1..4 (standard runner CPU bound)')
    args.test_dir = args.test_dir.resolve()
    if args.worker:
        return worker(args)
    started = time.monotonic()
    sys.path.insert(0, str(args.test_dir))
    suite = unittest.defaultTestLoader.discover(str(args.test_dir), pattern=args.pattern)
    expected = sorted(test.id() for test in flatten(suite))
    if not expected or len(expected) != len(set(expected)):
        raise ValueError('Discovery must return nonempty unique case IDs')
    if args.test_dir == HERE:
        if args.pattern != 'test_translation*.py':
            raise ValueError('Real suite cannot narrow its discovery pattern')
        baseline = json.loads((HERE.parent.parent / 'docs/quality/translation-pilot/parallel-test-inventory-v29.json').read_text())
        if baseline['serial_tests'] != len(baseline['ids']) or not set(baseline['ids']) <= set(expected):
            raise ValueError('A case from the passing serial suite is missing')
    # All case IDs are retained; only the generic fixture-free cases split.
    buckets = partition(expected, args.jobs, args.test_dir)
    rows, codes = [], []
    parent = args.scratch_parent or os.environ.get('RUNNER_TEMP') or os.environ.get('TMPDIR')
    with tempfile.TemporaryDirectory(prefix='usefulverse-tests-', dir=parent) as temp:
        children = []
        try:
            for index, ids in enumerate(buckets):
                directory = Path(temp)
                ids_path, result_path = directory / f'{index}-ids.json', directory / f'{index}-result.json'
                ids_path.write_text(json.dumps(ids))
                output = (directory / f'{index}-output.log').open('w+')
                command = [sys.executable, '-B', str(Path(__file__).resolve()), '--worker',
                           '--test-dir', str(args.test_dir), '--ids-json', str(ids_path),
                           '--result-json', str(result_path)]
                child = subprocess.Popen(command, stdout=output, stderr=subprocess.STDOUT)
                children.append((child, output, result_path))
            for index, (child, output, result_path) in enumerate(children):
                code = child.wait()
                codes.append(code)
                output.seek(0)
                detail = output.read()
                if code:
                    sys.stderr.write(detail)
                if not result_path.exists():
                    raise ValueError(f'Worker {index} exited {code} without complete inventory')
                row = json.loads(result_path.read_text())
                rows.append(row)
                print('UVTEST_WORKER ' + json.dumps(dict(worker=index, exit=code, **row)), flush=True)
            validate_results(expected, rows)
        finally:
            for child, output, _ in children:
                if child.poll() is None:
                    child.terminate()
                    child.wait()
                output.close()
    summary = {name: sum(row[name] for row in rows) for name in ('tests', 'failures', 'errors', 'skipped')}
    summary.update(inventory_sha256=hashlib.sha256(json.dumps(expected, separators=(',', ':')).encode()).hexdigest(),
                   workers=len(buckets), seconds=round(time.monotonic() - started, 3))
    print('UVTEST_TOTAL ' + json.dumps(summary), flush=True)
    print(f"Ran {summary['tests']} tests in {summary['seconds']:.3f}s", file=sys.stderr)
    passed = not any(codes) and not summary['failures'] and not summary['errors']
    print(('OK' + (f" (skipped={summary['skipped']})" if summary['skipped'] else '')) if passed else 'FAILED', file=sys.stderr)
    return 0 if passed else 1


if __name__ == '__main__':
    sys.exit(main())
