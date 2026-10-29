"""Post-inference review gate:new observed forward errors must block review.
Does not mutate frozen translation runtimes,raw evidence,flags or old reviews.
"""
import hashlib,json
from pathlib import Path

def audit(review,records,root,policy='context-v32'):
    if review.get('inference_policy')!=policy:return 0
    path=root/'docs/quality/translation-pilot/scoped-forward-regressions-v32.json'
    if not path.exists():raise ValueError('Missing current forward fixtures')
    data=json.loads(path.read_text())
    for old in ['v30','v31']:
        data['cases']+=json.loads((root/('docs/quality/translation-pilot/scoped-forward-regressions-'+old+'.json')).read_text())['cases']
    if data['native_review']is not False or data['approved_locales']!=[]:raise ValueError('Forward audit cannot approve languages')
    gate=review.get('reference_gate',review.get('full_gate',{})).get('ru',{});seen=0
    for j in review['rows']:
        for identity in j['record_ids']:
            row=records[identity]
            for case in data['cases']:
                if case['direction']!='forward'or case['blocks_gate']is not True:raise ValueError('Forward case must block')
                if hashlib.sha256(case['translation'].encode()).hexdigest()!=case['translation_hash']:raise ValueError('Stale forward fixture')
                if all(row[k]==case[k]for k in ['key','source_hash','locale'])and row['translation']==case['translation']:
                    if min(j['scores'].values())>=3 or gate.get('passed')is not False:raise ValueError('Known current forward defect cannot pass')
                    seen+=1
    return seen
