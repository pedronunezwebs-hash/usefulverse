#!/usr/bin/env python3
"""Audit negative baseline reviews. Cannot pass a gate or approve a locale."""
import hashlib
import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location('batch', Path(__file__).with_name('pilot-review-batch.py'))
batch = importlib.util.module_from_spec(spec)
spec.loader.exec_module(batch)
pilot = batch.pilot
DATA = pilot.ROOT / 'docs/quality/translation-pilot'
SIGNALS = frozenset({'wrong_script', 'length_ratio'})
WORD_QUANTITIES = frozenset({'dxf-viewer.fields.invalidCoordinates', 'shikaku.example', 'shikaku.fields.faq.1.a'})


def require(condition, message):
    if not condition:
        raise ValueError(message)


def text_hash(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def audit(review):
    """Recompute evidence, coverage and every warning; no inference or grading."""
    require(review['review_type'] == 'baseline-negative-review-batch-v1', 'Wrong review type')
    require(review['native_review'] is False and review['approved_locales'] == [], 'Approval forbidden')
    require(review['engine_frozen'] is False and review['typed_profile_verified'] is False, 'Baseline is not a frozen typed engine')
    require(review['new_inference_calls'] == 0 and review['inference_policy'] == 'baseline', 'Only existing baseline evidence')
    locale, candidate = review['locale'], review['candidate']
    require(candidate in {'legacy', 'madlad', 'm2m100'}, 'Unknown candidate')
    packs = {engine: batch.prepare(DATA / f'checkpoints/{engine}.jsonl', [locale]) for engine in ['madlad', 'm2m100']}
    require(review['checkpoint_sha256'] == {e: p['checkpoint_sha256'] for e, p in packs.items()}, 'Changed checkpoint')
    require(all(review['source_snapshot_sha256'] == p['source_snapshot_sha256'] for p in packs.values()), 'Changed source snapshot')
    raw = {item['record_id']: item for engine, pack in packs.items() for item in pack['rows']
           if item['evidence']['candidate'] == ('legacy' if candidate == 'legacy' else 'model')
           and (candidate == 'legacy' or engine == candidate)}
    expected = 27 if candidate == 'legacy' else 40
    require(review['expected_rows'] == len(review['rows']) == expected, 'Incomplete review')
    seen, keys, flagged = set(), set(), {}
    for judgment in review['rows']:
        require(judgment['key'] not in keys and judgment['locale'] == locale and judgment['candidate'] == candidate, 'Duplicate or wrong judgment')
        keys.add(judgment['key'])
        require(set(judgment['scores']) == {'meaning', 'numbers_negations', 'naturalness'} and all(type(s) is int and 0 <= s <= 3 for s in judgment['scores'].values()), 'Invalid rubric')
        require(judgment['notes'] and all(note.strip() for note in judgment['notes']), 'Missing direct-review notes')
        require(judgment['score_origin'] == 'direct-existing-source-forward-back-agent-review', 'Wrong score origin')
        require(len(judgment['record_ids']) == (2 if candidate == 'legacy' else 1), 'Missing original engine provenance')
        for identity in judgment['record_ids']:
            require(identity in raw and identity not in seen, 'Unknown or repeated identity')
            seen.add(identity)
            item = raw[identity]
            row = item['evidence']
            require(judgment['key'] == row['key'] and judgment['source_hash'] == row['source_hash'] and judgment['translation_hash'] == text_hash(row['translation']), 'Stale source/forward judgment')
            require(judgment['canonical_context'] == item['canonical_context'], 'Stale source context')
            require(judgment['record_sha256'][identity] == pilot.digest(row), 'Stale full record')
            failures = set(item['warnings'])
            if min(judgment['scores'].values()) < 3:
                require('known_semantic_errors' in failures, 'A scored defect lacks an exact permanent fixture')
            if row['key'] in WORD_QUANTITIES:
                require(judgment['data_contract_unproved'] is True, 'Word quantity lacks locale-specific typed proof')
            if failures:
                flagged[identity] = (row, judgment, failures)
    require(seen == set(raw), 'Omitted original record')
    reconciled = set()
    for entry in review['warning_reconciliation']:
        identity = entry['record_id']
        require(identity in flagged and identity not in reconciled, 'Unknown or duplicate warning entry')
        reconciled.add(identity)
        row, judgment, failures = flagged[identity]
        require(entry['record_sha256'] == pilot.digest(row) and entry['translation_hash'] == text_hash(row['translation']) and entry['back_translation_hash'] == text_hash(row['back_translation']), 'Stale warning evidence')
        require(set(entry['warnings']) == failures, 'Omitted or invented warning')
        for flag, decision in entry['warnings'].items():
            require(bool(decision['note'].strip()) and type(decision['blocks_gate']) is bool, 'Unexplained warning')
            disposition, blocks = decision['disposition'], decision['blocks_gate']
            if flag == 'known_semantic_errors':
                require(disposition == 'forward-defect' and blocks and min(judgment['scores'].values()) < 3, 'Cannot dismiss forward defect')
            elif flag == 'known_back_semantic_errors':
                require(disposition == 'back-defect' and not blocks, 'Back defect is independent of forward grade')
            elif flag.startswith('back_'):
                require(disposition == 'reviewed-signal' and not blocks, 'Explain back token signal separately from independent semantic defects')
            elif flag in SIGNALS:
                require(disposition == 'reviewed-signal' and not blocks, 'Review weak heuristic separately')
            elif disposition == 'forward-defect':
                require(blocks and 'known_semantic_errors' in failures and min(judgment['scores'].values()) < 3, 'Unbound forward defect')
            else:
                require(disposition == 'unproved-data' and blocks and judgment['data_contract_unproved'] is True, 'Unproved forward data cannot be dismissed')
    require(reconciled == set(flagged), 'Missing warning reconciliation')
    gate = review['reference_gate']
    require(gate['passed'] is False and gate['rows'] == expected, 'Negative baseline cannot pass')
    values = metrics(review)
    require(all(gate[key] == value for key, value in values.items()), 'Stale gate metrics')
    require(gate['button_errors'] + gate['number_negation_errors'] + gate['major_rows'] + gate['minor_rows'] > 0, 'Negative review requires observed defects')
    return len(seen)


def metrics(review, keys=None):
    rows = [row for row in review['rows'] if keys is None or row['key'] in keys]
    return {'rows': len(rows), 'points': sum(sum(row['scores'].values()) for row in rows), 'maximum': len(rows) * 9,
            'button_errors': sum(row['critical_control'] and min(row['scores'].values()) < 3 for row in rows),
            'number_negation_errors': sum(row['scores']['numbers_negations'] < 3 for row in rows),
            'major_rows': sum(min(row['scores'].values()) < 2 for row in rows),
            'minor_rows': sum(min(row['scores'].values()) == 2 for row in rows),
            'unproved_data_rows': sum(row['data_contract_unproved'] for row in rows)}
