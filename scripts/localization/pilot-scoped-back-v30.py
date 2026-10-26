"""Post-inference back audit, bound to the actual forward target.

Historical generic flags and frozen translation runtimes stay untouched. A
back string can be faithful to an old erroneous forward target and erroneous
for a corrected target: source/back hashes alone cannot distinguish them.
"""
import hashlib
import json
from pathlib import Path
DATA=Path(__file__).resolve().parents[2]/'docs/quality/translation-pilot'

def issues(row):
    path=DATA/'scoped-back-regressions-v30.json'
    data=json.loads(path.read_text())
    if data.get('approved_locales')!=[] or data.get('native_review') is not False:
        raise ValueError('Back audit cannot approve a locale or claim native review')
    found=[]
    for case in data['cases']:
        if case['direction']!='back' or case['blocks_gate'] is not False:
            raise ValueError('Scoped back audit cannot alter forward grades or gates')
        if hashlib.sha256(case['back_translation'].encode()).hexdigest()!=case['back_translation_hash']:
            raise ValueError('Stale back regression text hash')
        if all(row.get(k)==case[k] for k in ('key','locale','source_hash','inference_policy')) and hashlib.sha256(row['translation'].encode()).hexdigest()==case['forward_hash'] and row['back_translation']==case['back_translation']:
            found.append(case['issue'])
    return sorted(set(found))
