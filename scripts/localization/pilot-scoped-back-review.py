"""Reporting-only detector: an exact back defect is bound to its actual forward."""
import hashlib
import json


def issues(row, registry):
    if registry['native_review'] is not False or registry['approved_locales'] != []:
        raise ValueError('Back findings cannot approve a language')
    found = []
    for case in registry['cases']:
        if case['direction'] != 'back' or case['blocks_gate'] is not False:
            raise ValueError('Back findings cannot grade forward text')
        if hashlib.sha256(case['back_translation'].encode()).hexdigest() != case['back_translation_hash']:
            raise ValueError('Stale back fixture')
        forward = hashlib.sha256(json.dumps(row['translation'], ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
        if all(row[k] == case[k] for k in ['key', 'locale', 'source_hash', 'inference_policy']) and forward == case['forward_digest'] and row['back_translation'] == case['back_translation']:
            found.append(case['issue'])
    return sorted(set(found))
