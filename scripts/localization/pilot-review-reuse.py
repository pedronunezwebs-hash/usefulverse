"""Reuse only byte-identical S/F/B already read in the operator's current turn.

Validate raw records first. This helper neither grades nor approves translations.
Changed text/context is returned for direct reading; no normalization is applied.
"""
import argparse
import hashlib
import json
from pathlib import Path

FIELDS = ('key', 'locale', 'candidate', 'source', 'source_hash', 'context', 'translation', 'back_translation')


def partition(prior, current, confirmed_read_ids):
    old = {r['record_id']: r for r in prior}
    if len(old) != len(prior) or not set(confirmed_read_ids) <= set(old):
        raise ValueError('Duplicate or unconfirmed prior records')
    signature = lambda r: tuple(r[k] for k in FIELDS)
    index = {signature(old[i]): old[i] for i in sorted(confirmed_read_ids)}
    seen, pairs, new = set(), [], []
    for row in current:
        if row['record_id'] in seen:
            raise ValueError('Duplicate current record')
        seen.add(row['record_id'])
        if hashlib.sha256(row['source'].encode()).hexdigest() != row['source_hash']:
            raise ValueError('Stale current source hash')
        previous = index.get(signature(row))
        if previous is None:
            new.append(row)
        else:
            payload = json.dumps(signature(row), ensure_ascii=False, separators=(',', ':'))
            pairs.append(dict(current_record_id=row['record_id'], prior_record_id=previous['record_id'], fields_sha256=hashlib.sha256(payload.encode()).hexdigest()))
    return pairs, new


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for flag in ['prior', 'current', 'confirmed-read-proof', 'output']:
        parser.add_argument('--' + flag, type=Path, required=True)
    args = parser.parse_args()
    load = lambda p: [json.loads(line) for line in p.read_text().splitlines()]
    confirmed = json.loads(args.confirmed_read_proof.read_text())['prior_direct_read_record_ids']
    pairs, new = partition(load(args.prior), load(args.current), confirmed)
    args.output.write_text(json.dumps(dict(independent_rereview_claimed=False, native_review=False, approved_locales=[], fields=FIELDS, reused_exact_pairs=pairs, requires_direct_read=new), ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(reused=len(pairs), requires_direct_read=len(new), approved_locales=[])))
