"""Post-inference forward regression audit; no translation inference is modified.

Every observed forward defect is source/key/policy/locale/text bound.
Historical generic flags and frozen translation runtimes stay untouched.
"""
import hashlib
import json
from pathlib import Path
DATA=Path(__file__).resolve().parents[2]/'docs/quality/translation-pilot'

def issues(row):
    path=DATA/'scoped-forward-regressions-v30.json'
    data=json.loads(path.read_text())
    if data.get('approved_locales')!=[] or data.get('native_review') is not False:
        raise ValueError('Forward audit cannot approve a locale or claim native review')
    found=[]
    for case in data['cases']:
        if case['direction']!='forward' or case['blocks_gate'] is not True:
            raise ValueError('Forward defect must block its gate')
        if hashlib.sha256(case['translation'].encode()).hexdigest()!=case['translation_hash']:
            raise ValueError('Stale forward regression text hash')
        if all(row.get(k)==case[k] for k in ('key','locale','source_hash','inference_policy')) and row['translation']==case['translation']:
            found.append(case['issue'])
    return sorted(set(found))
