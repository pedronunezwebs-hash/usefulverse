#!/usr/bin/env python3
"""Audit negative baseline reviews. Cannot pass a gate or approve a locale."""
import hashlib
import copy
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


def negative_reassessment(review, reassessment=None):
    """Project two new negative findings without editing the historical review."""
    file = DATA / 'review-v28-legacy-reassessment.json'
    if reassessment is None:
        if not file.exists(): return review
        reassessment = json.loads(file.read_text())
    if pilot.digest(review) != reassessment['original_review_digest']: return review
    require(reassessment['original_review_file'] == 'review-batch1-bn-legacy.json' and reassessment['negative_only'] is True and reassessment['native_review'] is False and reassessment['approved_locales'] == [], 'Reassessment cannot approve or change scope')
    original = DATA / reassessment['original_review_file']
    require(hashlib.sha256(original.read_bytes()).hexdigest() == reassessment['original_review_sha256'] and pilot.digest(json.loads(original.read_text())) == reassessment['original_review_digest'], 'Stale original negative-review binding')
    require(review['reference_gate']['passed'] is False and review['locale'] == 'bn' and review['candidate'] == 'legacy', 'Only a blocked Bengali legacy review may be reassessed')
    require(reassessment['expected_rows'] == len(reassessment['rows']) == 2 and {r['key'] for r in reassessment['rows']} == {'shikaku.fields.hint', 'voice-changer.fields.decodeFailed'}, 'Wrong reassessment scope')
    result = copy.deepcopy(review)
    records = {r['record_id']: r for engine in ['madlad', 'm2m100'] for r in map(json.loads, (DATA / f'checkpoints/{engine}.jsonl').read_text().splitlines())}
    for correction in reassessment['rows']:
        old = next(row for row in result['rows'] if row['key'] == correction['key'])
        require(all(old[k] == correction[k] for k in ['key', 'locale', 'source_hash', 'translation_hash', 'record_ids', 'record_sha256']), 'Unbound negative rubric')
        require(set(correction['scores']) == set(old['scores']) and all(type(v) is int and 0 <= v <= old['scores'][k] for k, v in correction['scores'].items()) and any(v < old['scores'][k] for k, v in correction['scores'].items()), 'Reassessment must only lower old scores')
        old['scores'] = correction['scores']; old['notes'] += correction['notes']
        for identity in correction['record_ids']:
            raw = records[identity]
            require('\u09f7' in raw['translation'] and pilot.semantic_issues(raw['key'], raw['source_hash'], raw['translation'], 'bn'), 'Missing exact observed fraction regression')
            entry = next((item for item in result['warning_reconciliation'] if item['record_id'] == identity), None)
            if entry is None:
                entry = dict(record_id=identity, record_sha256=pilot.digest(raw), translation_hash=text_hash(raw['translation']), back_translation_hash=text_hash(raw['back_translation']), warnings={})
                result['warning_reconciliation'].append(entry)
            require('known_semantic_errors' not in entry['warnings'], 'Negative reassessment cannot replace an old warning')
            entry['warnings']['known_semantic_errors'] = dict(disposition='forward-defect', blocks_gate=True, note=correction['notes'][0])
    result['reference_gate'].update(metrics(result))
    return result


def audit(review):
    """Recompute evidence, coverage and every warning; no inference or grading."""
    original = review
    review = negative_reassessment(review)
    file = DATA / 'baseline-back-addenda-v28.json'
    if file.exists():
        for addendum in json.loads(file.read_text()):
            if addendum['review_digest'] != pilot.digest(original): continue
            path = DATA / addendum['review_file']
            require(path.name == addendum['review_file'] and path.name.startswith('review-batch1-bn-') and hashlib.sha256(path.read_bytes()).hexdigest() == addendum['review_file_sha256'] and pilot.digest(json.loads(path.read_text())) == addendum['review_digest'], 'Stale baseline back addendum')
            require(addendum['approved_locales'] == [], 'Back addendum cannot approve a locale')
            review = copy.deepcopy(review)
            bound = {identity for row in review['rows'] for identity in row['record_ids']}
            for entry in addendum['warning_reconciliation']:
                require(entry['record_id'] in bound and set(entry['warnings']) == {'known_back_semantic_errors'} and entry['warnings']['known_back_semantic_errors']['disposition'] == 'back-defect' and entry['warnings']['known_back_semantic_errors']['blocks_gate'] is False, 'Only non-gating back findings may supplement an old baseline')
                previous = next((item for item in review['warning_reconciliation'] if item['record_id'] == entry['record_id']), None)
                if previous:
                    require(all(previous[k] == entry[k] for k in ['translation_hash', 'back_translation_hash', 'record_sha256']) and 'known_back_semantic_errors' not in previous['warnings'], 'Back addendum cannot replace an old warning')
                    previous['warnings'].update(entry['warnings'])
                else: review['warning_reconciliation'].append(copy.deepcopy(entry))
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
