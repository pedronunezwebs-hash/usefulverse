"""Exact earlier agent judgments become regression data, never native approval."""
from collections import Counter
import hashlib
import json
from pathlib import Path

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
PATH=ROOT/'docs/quality/translation-drafts/quality-references-v1.json'
REVIEWS=[f'review-context-v{v}-{scope}.json' for v,scope in
         [(15,'full'),(18,'full'),(21,'full'),(27,'full'),(29,'full'),(33,'full'),
          (21,'full-legacy'),(27,'full-legacy'),(29,'full-legacy'),(33,'full-legacy')]]


def sha(text):return hashlib.sha256(text.encode()).hexdigest()
def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def normalize_key(key):return key.replace('.copy.','.',1)


def compile_references():
    base=ROOT/'docs/quality/translation-pilot';records={}
    for path in (base/'checkpoints').rglob('*.jsonl'):
        for line in path.read_text().splitlines():
            row=json.loads(line);records[row['record_id']]=row
    output=[];sources={}
    for name in REVIEWS:
        text=(base/name).read_text();review=json.loads(text);sources[name]=sha(text)
        for judgment in review['rows']:
            matches=[records[rid] for rid in judgment['record_ids'] if rid in records and sha(records[rid]['translation'])==judgment['translation_hash']]
            if not matches:raise ValueError('Reviewed translation missing from immutable checkpoints')
            raw=matches[-1]
            if raw['source_hash']!=judgment['source_hash'] or sha(raw['source'])!=raw['source_hash'] or raw['locale']!=judgment['locale'] or raw['key']!=judgment['key']:
                raise ValueError('Review source/key/language changed')
            scores=judgment['scores'];accepted=scores['meaning']==scores['numbers_negations']==3 and scores['naturalness']>=2
            output.append(dict(key=normalize_key(raw['key']),locale=raw['locale'],source_hash=raw['source_hash'],
                               source=raw['source'],translation=raw['translation'],translation_hash=sha(raw['translation']),
                               back_translation=raw['back_translation'],accepted=accepted,scores=scores,
                               review=name,review_sha256=sources[name],record_id=raw['record_id'],record_sha256=sha(canonical(raw))))
    return dict(format='usefulverse-prior-agent-references-v1',native_review=False,approved=False,sources=sources,records=output)


def read():
    data=json.loads(PATH.read_text())
    if data['native_review'] is not False or data['approved'] is not False:raise ValueError('References are earlier agent judgments only')
    for name,expected in data['sources'].items():
        if sha((ROOT/'docs/quality/translation-pilot'/name).read_text())!=expected:raise ValueError('Earlier judgment file changed')
    for row in data['records']:
        if sha(row['source'])!=row['source_hash'] or sha(row['translation'])!=row['translation_hash']:raise ValueError('Reference text changed')
    return data


def identity(row):return (normalize_key(row['key']),row['locale'],row['source_hash'],row.get('translation_hash') or sha(row['translation']))


class Guard:
    def __init__(self):
        self.data=read();self.digest=sha(canonical(self.data))
        # A conflicting earlier judgment remains blocked rather than silently approved.
        self.rejected={identity(row) for row in self.data['records'] if not row['accepted']}
    def rejects(self,row):
        keys=row.get('keys') or [row['key']]
        return any((normalize_key(key),row['locale'],row['source_hash'],sha(row['translation'])) in self.rejected for key in keys)
    def calibrate(self,models,semantic,drafts):
        rows=[];positive=Counter();seen=set()
        for ref in self.data['records']:
            identity_key=identity(ref)
            if identity_key in seen:continue
            if ref['accepted'] and positive[ref['locale']]>=20:continue
            seen.add(identity_key)
            if ref['accepted']:positive[ref['locale']]+=1
            row=dict(key=ref['key'],keys=[ref['key']],locale=ref['locale'],source=ref['source'],source_hash=ref['source_hash'],translation=ref['translation'],
                     checks=drafts.checks(ref['source'],ref['translation']),warnings=[])
            scores=models.score(ref['source'],ref['translation'],ref['back_translation'])
            reasons=semantic.decide(row,ref['back_translation'],False,scores)
            model_pass=not reasons;guard_rejects=self.rejects(row)
            rows.append(dict(accepted_before=ref['accepted'],locale=ref['locale'],model_pass=model_pass,known_rejection=guard_rejects))
            if not ref['accepted'] and model_pass and not guard_rejects:raise ValueError('An earlier known defect escaped the new quality gate')
        return dict(prior_agent_references=len(rows),previously_accepted=sum(r['accepted_before'] for r in rows),
                    previously_rejected=sum(not r['accepted_before'] for r in rows),
                    known_errors_blocked=sum(not r['accepted_before'] and (not r['model_pass'] or r['known_rejection']) for r in rows),
                    model_only_false_accepts_blocked_by_memory=sum(not r['accepted_before'] and r['model_pass'] and r['known_rejection'] for r in rows),
                    accepted_before_and_model_passes=sum(r['accepted_before'] and r['model_pass'] and not r['known_rejection'] for r in rows),
                    native_review=False,approved=False)


if __name__=='__main__':
    data=compile_references();PATH.write_text(json.dumps(data,ensure_ascii=False,sort_keys=True,separators=(',',':'))+'\n')
    print(json.dumps(dict(records=len(data['records']),rejected=sum(not r['accepted'] for r in data['records']),native_review=False)))
