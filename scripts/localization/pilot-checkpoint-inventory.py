"""Refresh/check the complete checkpoint ledger after collecting real raw logs.

Only the derived checkpoint inventory and total change. Raw records, model-run
provenance, grades and approval flags are preserved.
"""
import argparse
import hashlib
import json
from pathlib import Path


def refresh(directory, write=False):
    path = directory / 'context-run-evidence.json'
    evidence = json.loads(path.read_text())
    actual = {str(p.relative_to(directory)): dict(records=len(p.read_text().splitlines()), sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for p in sorted((directory / 'checkpoints').rglob('*.jsonl'))}
    declared = {p['path']: {k: p[k] for k in ['records', 'sha256']} for p in evidence['checkpoints']}
    total = sum(p['records'] for p in actual.values())
    if not write:
        if actual != declared or evidence['total_records'] != total:
            raise ValueError('Checkpoint ledger is stale; collect raw evidence then refresh it')
    else:
        evidence['checkpoints'] = [dict(path=name, **row) for name, row in actual.items()]
        evidence['total_records'] = total
        path.write_text(json.dumps(evidence, ensure_ascii=False, indent=2) + '\n')
    return dict(checkpoints=len(actual), records=total, approved_locales=evidence['approved_locales'])


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path(__file__).resolve().parents[2] / 'docs/quality/translation-pilot')
    parser.add_argument('--write', action='store_true')
    args = parser.parse_args()
    print(json.dumps(refresh(args.directory, args.write)))
