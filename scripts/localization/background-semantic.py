#!/usr/bin/env python3
"""Independent CPU screening of meaning. A score is never native approval."""
import ast
from collections import Counter
import hashlib
import json
import math
import os
from pathlib import Path
import re

HERE = Path(__file__).resolve().parent
POLICY = json.loads((HERE/'semantic-policy.json').read_text())
POLICY_DIGEST = hashlib.sha256(json.dumps(POLICY, sort_keys=True).encode() +
    ast.dump(ast.parse(Path(__file__).read_text()), include_attributes=False).encode()).hexdigest()
FORMAT = 'usefulverse-semantic-audit-v1'
PREFIX = 'UVDRAFT_AUDIT '
NUMBER = re.compile(r'(?<![A-Za-z0-9_])[+-]?\d+(?:[.,]\d+)*(?:%|°)?')
NEGATION = re.compile(r"\b(?:no|not|never|without|cannot|can't|doesn't|don't|won't|isn't|aren't)\b", re.I)
FILETYPE = r'(?:png|jpe?g|pdf|svg|webp|gif|csv|json|xml|txt|html|docx|xlsx|pptx|base64)'
OPAQUE=re.compile(r'https?://[^\s<>]+|`[^`]*`|\{[A-Za-z][A-Za-z0-9_]*\}|</?[A-Za-z][^>]*>')


def normalize(text):
    return re.findall(r'[a-z0-9]+', text.lower())


def direction(text):
    text = text.lower()
    forward = re.search(r'\b('+FILETYPE+r')\b.{0,80}?\b(?:to|into|as)\b.{0,30}?\b('+FILETYPE+r')\b', text)
    backward = re.search(r'\b('+FILETYPE+r')\b.{0,80}?\bfrom\b.{0,30}?\b('+FILETYPE+r')\b', text)
    if forward:
        return tuple('jpg' if v=='jpeg' else v for v in forward.groups())
    if backward:
        return tuple('jpg' if v=='jpeg' else v for v in reversed(backward.groups()))
    return None


def critical_changes(source, back):
    flags = []
    if Counter(OPAQUE.findall(source))!=Counter(OPAQUE.findall(back)):
        flags.append('protected_data_in_back_translation')
    if NUMBER.findall(source) != NUMBER.findall(back):
        flags.append('quantity_or_coordinate_order')
    if bool(NEGATION.search(source)) != bool(NEGATION.search(back)):
        flags.append('negation')
    a, b = direction(source), direction(back)
    if a is not None and (b is None or a != b):
        flags.append('conversion_direction')
    for label, pattern in [('minimum', r'\b(?:minimum|at least)\b'), ('maximum', r'\b(?:maximum|at most|up to)\b')]:
        if bool(re.search(pattern, source, re.I)) != bool(re.search(pattern, back, re.I)):
            flags.append(label+'_condition')
    return flags


def decide(row, back, back_truncated, scores):
    reasons = ['structural:'+k for k,v in row['checks'].items() if not v]
    reasons += ['forward:'+warning for warning in row['warnings']]
    reasons += critical_changes(row['source'], back)
    if not back.strip() or back_truncated:
        reasons.append('incomplete_back_translation')
    # Short commands have little context for an inference model: do not silently
    # accept a different command merely because its embedding is close.
    if len(normalize(row['source'])) <= 3 and normalize(row['source']) != normalize(back):
        reasons.append('short_command_changed')
    required = ('similarity', 'forward_entailment', 'reverse_entailment', 'forward_contradiction', 'reverse_contradiction')
    if not isinstance(scores, dict) or any(not isinstance(scores.get(k), (int,float)) or
            isinstance(scores[k], bool) or not math.isfinite(scores[k]) for k in required):
        reasons.append('semantic_evidence_missing')
    else:
        if not -1 <= scores['similarity'] <= 1 or any(not 0 <= scores[k] <= 1 for k in required[1:]):
            raise ValueError('Out-of-range semantic evidence')
        if scores['similarity'] < POLICY['minimum_similarity']: reasons.append('meaning_similarity')
        if min(scores['forward_entailment'], scores['reverse_entailment']) < POLICY['minimum_entailment']:
            reasons.append('meaning_not_preserved_both_ways')
        if max(scores['forward_contradiction'], scores['reverse_contradiction']) > POLICY['maximum_contradiction']:
            reasons.append('contradiction')
    return sorted(set(reasons))


def raw_digest(row):
    return hashlib.sha256(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False).encode()).hexdigest()


def make_audit(row, back, truncated, scores):
    reasons = decide(row, back, truncated, scores)
    return dict(format=FORMAT, record_id=row['record_id'], raw_digest=raw_digest(row),
                policy_digest=POLICY_DIGEST, policy=POLICY, back_translation=back,
                back_truncated=truncated, scores=scores, reasons=reasons,
                auto_usable=not reasons, approved=False, native_review=False)


def validate_audit(audit, row):
    if audit.get('format')!=FORMAT or audit.get('record_id')!=row['record_id'] or audit.get('raw_digest')!=raw_digest(row):
        raise ValueError('Audit is not bound to these exact raw bytes')
    if audit.get('policy_digest')!=POLICY_DIGEST or audit.get('policy')!=POLICY:
        raise ValueError('Stale semantic policy')
    if audit.get('approved') is not False or audit.get('native_review') is not False:
        raise ValueError('Automatic screening cannot impersonate human approval')
    reasons=decide(row,audit['back_translation'],audit['back_truncated'],audit['scores'])
    if audit['reasons']!=reasons or audit['auto_usable'] is not (not reasons):
        raise ValueError('Forged semantic decision')
    return audit


class Models:
    def __init__(self):
        if os.environ.get('GITHUB_ACTIONS')!='true' or os.environ.get('RUNNER_OS')!='Linux':
            raise RuntimeError('Model downloads and inference only in Actions Linux')
        import torch
        from transformers import AutoModel, AutoModelForSequenceClassification, AutoTokenizer
        torch.set_num_threads(min(4, os.cpu_count() or 1))
        self.torch=torch
        e,n=POLICY['embedding'],POLICY['nli']
        self.et=AutoTokenizer.from_pretrained(e['repository'],revision=e['revision'],trust_remote_code=False)
        self.em=AutoModel.from_pretrained(e['repository'],revision=e['revision'],trust_remote_code=False,use_safetensors=True).to('cpu').eval()
        self.nt=AutoTokenizer.from_pretrained(n['repository'],revision=n['revision'],trust_remote_code=False)
        self.nm=AutoModelForSequenceClassification.from_pretrained(n['repository'],revision=n['revision'],trust_remote_code=False,use_safetensors=True).to('cpu').eval()
        if {str(k):v.lower() for k,v in self.nm.config.id2label.items()}!={'0':'contradiction','1':'entailment','2':'neutral'}:
            raise ValueError('Unexpected NLI label contract')

    def score(self, source, translation, back):
        torch=self.torch
        e=self.et(['query: '+source,'query: '+translation],padding=True,truncation=False,return_tensors='pt')
        n=self.nt([source,back],[back,source],padding=True,truncation=False,return_tensors='pt')
        if e['input_ids'].shape[1]>POLICY['max_tokens'] or n['input_ids'].shape[1]>POLICY['max_tokens']:
            return None
        with torch.inference_mode():
            hidden=self.em(**e).last_hidden_state
            mask=e['attention_mask'].unsqueeze(-1).to(hidden.dtype)
            vectors=(hidden*mask).sum(1)/mask.sum(1).clamp(min=1)
            vectors=torch.nn.functional.normalize(vectors,p=2,dim=1)
            similarity=float((vectors[0]*vectors[1]).sum())
            probs=self.nm(**n).logits.softmax(dim=-1).tolist()
        return dict(similarity=max(-1.0,min(1.0,similarity)),forward_entailment=probs[0][1],reverse_entailment=probs[1][1],
                    forward_contradiction=probs[0][0],reverse_contradiction=probs[1][0])


def selftest(models):
    cases=[
        ('The file is saved on your device.','The file is saved on your device.',True),
        ('You can download the result.','The result is available to download.',True),
        ('No file is uploaded to a server.','Files are not uploaded to any server.',True),
        ('The drawing has finished loading.','The drawing is fully loaded.',True),
        ('No file is uploaded to a server.','Files are uploaded to a server.',False),
        ('The drawing has finished loading.','The drawing is still loading.',False),
        ('Download','Delete',False),
        ('Convert PNG images to PDF.','Convert PDF files to PNG.',False),
        ('The maximum is 20 files.','The maximum is 200 files.',False),
        ('If the file is valid, process it.','If the file is invalid, process it.',False),
    ]
    results=[]
    for source,back,expected in cases:
        row=dict(source=source,translation=back,checks={'reference':True},warnings=[])
        scores=models.score(source,back,back)
        reasons=decide(row,back,False,scores)
        results.append(dict(source=source,expected=expected,passed=not reasons,reasons=reasons,scores=scores))
    print('UVDRAFT_MODEL_CHECK '+json.dumps(dict(policy_digest=POLICY_DIGEST,cases=results),ensure_ascii=False),flush=True)
    if any(result['passed']!=result['expected'] for result in results):
        raise ValueError('Semantic self-check failed; refusing automatic acceptance')
    return results


if __name__=='__main__':
    selftest(Models())
