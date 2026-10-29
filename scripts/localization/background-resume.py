#!/usr/bin/env python3
"""Recover machine checkpoints from recent completed jobs using read-only access."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import urlencode

spec = importlib.util.spec_from_file_location('background', Path(__file__).with_name('background-drafts.py'))
drafts = importlib.util.module_from_spec(spec)
spec.loader.exec_module(drafts)
REPO = 'repos/pedronunezwebs-hash/usefulverse'
ALLOW_ESCAPE_SUPPORTED = None


def github(path):
    global ALLOW_ESCAPE_SUPPORTED
    # Logs contain ANSI bytes from Actions itself. Capture them as opaque data;
    # never render the downloaded response in a terminal or evaluate its contents.
    allow = path.endswith('/logs') and ALLOW_ESCAPE_SUPPORTED is not False
    command = ['gh', 'api'] + (['--allow-escape-sequences'] if allow else []) + [REPO + '/' + path]
    result = subprocess.run(command, capture_output=True)
    if allow and result.returncode and b'unknown flag' in result.stderr:
        ALLOW_ESCAPE_SUPPORTED = False
        result = subprocess.run(['gh', 'api', REPO + '/' + path], capture_output=True)
    if result.returncode:
        error = result.stderr.decode()
        if 'HTTP 404' in error:
            raise FileNotFoundError(path)
        raise RuntimeError('GitHub read failed: ' + error)
    return result.stdout


def recover(corpus, locales, shard, shards, branch, output, request=github):
    wanted = {row['record_id'] for row in drafts.work_items(corpus, locales, shard, shards)}
    runs = json.loads(request('actions/workflows/translation-drafts.yml/runs?' +
                              urlencode(dict(branch=branch, status='completed', per_page=20))))['workflow_runs']
    current = os.environ.get('GITHUB_RUN_ID')
    if current:
        runs = [dict(id=int(current))] + runs
    recovered = {}
    with tempfile.TemporaryDirectory(dir=output.parent) as root:
        for run in runs:
            jobs = json.loads(request(f"actions/runs/{run['id']}/jobs?per_page=100"))['jobs']
            for job in jobs:
                if job['status'] != 'completed' or job.get('conclusion') == 'skipped' or not job['name'].startswith(('drafts (', 'drafts-next (')):
                    continue
                if not any(step['name'] == 'Generate resumable drafts without publishing' and
                           step['status'] == 'completed' and step.get('conclusion') != 'skipped'
                           for step in job.get('steps', [])):
                    continue
                path = Path(root) / 'job.log'
                try:
                    path.write_bytes(request(f"actions/jobs/{job['id']}/logs"))
                except FileNotFoundError:
                    print(drafts.canonical(dict(warning='Prior logs unavailable; committed checkpoints are still used.', job=job['id'])))
                    continue
                for identity, row in drafts.load_records([path]).items():
                    if identity not in wanted:
                        continue
                    previous = recovered.get(identity)
                    if previous and drafts.canonical(previous) != drafts.canonical(row):
                        raise ValueError('Conflicting prior machine checkpoints')
                    recovered[identity] = row
    output.write_text(''.join(drafts.canonical(recovered[key])+'\n' for key in sorted(recovered)))
    print(drafts.canonical(dict(recovered=len(recovered), previous_runs=len(runs), shard=shard, approved=0)))
    return recovered


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--corpus', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--locales', default='')
    parser.add_argument('--shard', type=int, required=True)
    args = parser.parse_args()
    recover(json.loads(args.corpus.read_text()), args.locales.split(',') if args.locales else drafts.LOCALES,
            args.shard, 4, os.environ['GITHUB_REF_NAME'], args.output)
