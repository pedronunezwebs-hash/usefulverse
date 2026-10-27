#!/usr/bin/env python3
"""One bounded second search for quarantined drafts; originals remain immutable."""
import ast
import base64
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import time

HERE=Path(__file__).resolve().parent
def load(name):
    spec=importlib.util.spec_from_file_location(name.replace('-','_'),HERE/(name+'.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
semantic=load('background-semantic');drafts=load('background-drafts');history=load('historical-quality').Guard()
FORMAT='usefulverse-quality-refinement-v1'
PREFIX='UVREFINE_RECORD '
RECIPE=dict(model=drafts.MODEL,revision=drafts.REVISION,beam_size=4,maximum_candidates=2,
            max_input_tokens=512,max_output_tokens=256,attempts_per_source=1,
            semantic_policy=semantic.POLICY_DIGEST,prior_judgments=history.digest)
POLICY_DIGEST=hashlib.sha256(json.dumps(RECIPE,sort_keys=True).encode()+
    ast.dump(ast.parse(Path(__file__).read_text()),include_attributes=False).encode()).hexdigest()
CANDIDATE_FORMAT='usefulverse-refinement-candidate-v1'


def digest(value):return semantic.raw_digest(value)
def primary_key(row):return row['record_id']+':'+semantic.POLICY_DIGEST
def key(row):return row['record_id']+':'+POLICY_DIGEST


def candidate(parent,raw,translation,truncated,detected_language,back=None):
    value=dict(format=CANDIDATE_FORMAT,parent_digest=digest(parent),source=parent['source'],source_hash=parent['source_hash'],
               context=parent['context'],key=parent['key'],keys=parent['keys'],locale=parent['locale'],model=drafts.MODEL,revision=drafts.REVISION,beam_size=4,
               raw_translation=raw,translation=translation,truncated=truncated,detected_language=detected_language,back_sample=back)
    value['checks']=drafts.checks(value['source'],translation,truncated)
    value['warnings']=drafts.warnings(value)
    value['record_id']=digest(value)
    return value


def validate_candidate(value,parent):
    expected=candidate(parent,value['raw_translation'],value['translation'],value['truncated'],value['detected_language'],value.get('back_sample'))
    if type(value['truncated']) is not bool or value!=expected:raise ValueError('Candidate changed source, configuration or evidence')
    restored=drafts.queue.restore(value['raw_translation'],drafts.protect(parent['source'])[1])
    if value['translation']!=(restored if restored is not None else value['raw_translation']):
        raise ValueError('Candidate translation is not the exact restored model output')


def primary_usable(parent,primary):return primary['auto_usable'] and not history.rejects(parent)


def choose(parent,primary,proposals):
    if primary_usable(parent,primary):return None
    passing=[(i,p) for i,p in enumerate(proposals) if p['audit']['auto_usable'] and not history.rejects(p['candidate'])]
    if not passing:return None
    # All hard/semantic gates must pass before scores can rank alternatives.
    def rank(item):
        i,p=item;s=p['audit']['scores']
        return (min(s['forward_entailment'],s['reverse_entailment'],s['similarity']),-i)
    return max(passing,key=rank)[0]


def make_result(parent,primary,proposals):
    return dict(format=FORMAT,record_id=parent['record_id'],raw_digest=digest(parent),policy_digest=POLICY_DIGEST,
                recipe=RECIPE,primary_audit_digest=digest(primary),proposals=copy.deepcopy(proposals),
                selected=choose(parent,primary,proposals),approved=False,native_review=False)


def validate_result(result,parent,primary):
    semantic.validate_audit(primary,parent)
    if primary_usable(parent,primary):raise ValueError('A passing original must never be refined or replaced')
    if result.get('format')!=FORMAT or result.get('record_id')!=parent['record_id'] or result.get('raw_digest')!=digest(parent):
        raise ValueError('Refinement is not bound to the exact original')
    if result.get('policy_digest')!=POLICY_DIGEST or result.get('recipe')!=RECIPE or result.get('primary_audit_digest')!=digest(primary):
        raise ValueError('Stale refinement recipe or primary evidence')
    if result.get('approved') is not False or result.get('native_review') is not False:raise ValueError('No automatic human approval')
    proposals=result.get('proposals')
    if not isinstance(proposals,list) or len(proposals)>RECIPE['maximum_candidates']:raise ValueError('Unbounded candidate search')
    seen={parent['translation']}
    for proposal in proposals:
        value=proposal['candidate'];validate_candidate(value,parent)
        if value['translation'] in seen:raise ValueError('Repeated candidate is not a second attempt')
        seen.add(value['translation']);semantic.validate_audit(proposal['audit'],value)
    expected=choose(parent,primary,proposals)
    if type(result.get('selected')) not in (int,type(None)) or result['selected']!=expected:raise ValueError('Forged candidate selection')
    return result


def active(parent,audits,primary):
    result=audits.get(key(parent))
    return validate_result(result,parent,primary) if result else None


def pending(parent,audits,primary):
    return primary is None or (not primary_usable(parent,primary) and active(parent,audits,primary) is None)


def selected_translation(parent,audits,primary):
    if primary is None:return None
    if primary_usable(parent,primary):return parent['translation']
    result=active(parent,audits,primary)
    if result is None or result['selected'] is None:return None
    return result['proposals'][result['selected']]['candidate']['translation']


def alternatives(model,text,locale):
    code=drafts.queue.LANGUAGES[locale]
    tokens=model.tokenizer.convert_ids_to_tokens(model.tokenizer.encode(f'<2{code}> {text}'))
    if len(tokens)>RECIPE['max_input_tokens']:return []
    results=model.translator.translate_batch([tokens],beam_size=4,num_hypotheses=2,max_batch_size=1,
                                            max_input_length=512,max_decoding_length=256)
    if len(results)!=1 or len(results[0].hypotheses)>2:raise ValueError('Unexpected bounded model output')
    output=[]
    for hypothesis in results[0].hypotheses:
        value=model.tokenizer.decode(model.tokenizer.convert_tokens_to_ids(hypothesis),skip_special_tokens=True)
        if locale=='zh-TW':
            from opencc import OpenCC
            value=OpenCC('s2twp').convert(value)
        output.append((value,len(hypothesis)>=256))
    return output


def refine(parent,primary,models,translator,classify,deadline):
    if primary_usable(parent,primary):return None
    if time.time()+10>=deadline:return None
    model=translator();masked,saved=drafts.protect(parent['source'])
    outputs=alternatives(model,masked,parent['locale'])
    proposals=[];seen={parent['translation']}
    for raw,cut in outputs:
        if time.time()+5>=deadline:break
        restored=drafts.queue.restore(raw,saved);translation=restored if restored is not None else raw
        if translation in seen:continue
        seen.add(translation)
        detected=classify(translation)[0]
        value=candidate(parent,raw,translation,cut,detected)
        back=None;scores=None
        if all(value['checks'].values()) and not value['warnings']:
            protected,literals=drafts.protect(translation)
            [(back_raw,back_cut)]=model.translate([protected],'en')
            back=dict(translation=drafts.queue.restore(back_raw,literals) or back_raw,truncated=back_cut)
            value=candidate(parent,raw,translation,cut,detected,back)
            scores=models.score(value['source'],translation,back['translation'])
        audit=semantic.make_audit(value,back['translation'] if back else '',back['truncated'] if back else True,scores)
        proposals.append(dict(candidate=value,audit=audit))
    result=make_result(parent,primary,proposals)
    return validate_result(result,parent,primary)


def benchmark(memory,model_dir):
    if os.environ.get('GITHUB_ACTIONS')!='true' or os.environ.get('RUNNER_OS')!='Linux':raise RuntimeError('Models only in Actions Linux')
    pipeline=load('translation-autopilot')
    rows,audits=pipeline.memory(memory)
    startup=time.monotonic()
    models=semantic.Models();semantic.selftest(models)
    calibration=history.calibrate(models,semantic,drafts)
    print('UVREFINE_CALIBRATION '+json.dumps(calibration,sort_keys=True),flush=True)
    cache=[]
    def translator():
        if not cache:cache.append(pipeline.translator(model_dir))
        return cache[0]
    import langid
    deadline=time.time()+35*60
    eligible=[(r,pipeline.active_audit(r,audits)) for r in rows.values()]
    eligible=[(r,a) for r,a in eligible if a]
    passing=[(r,a) for r,a in eligible if primary_usable(r,a)]
    bad=sorted([(r,a) for r,a in eligible if not primary_usable(r,a)],key=lambda pair:pair[0]['record_id'])[:20]
    if bad:translator()
    initialization_seconds=round(time.monotonic()-startup,3)
    attempted=adopted=0;seconds=[];failures={}
    for row,primary in bad:
        tick=time.monotonic();result=refine(row,primary,models,translator,langid.classify,deadline)
        seconds.append(round(time.monotonic()-tick,3))
        if result is None:continue
        print(PREFIX+base64.b64encode(json.dumps(result,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).decode(),flush=True)
        attempted+=1;adopted+=result['selected'] is not None
        for proposal in result['proposals']:
            for reason in proposal['audit']['reasons']:failures[reason]=failures.get(reason,0)+1
    # Original accepted entries are returned unchanged; no model call for them.
    assert all(selected_translation(r,audits,a)==r['translation'] for r,a in passing)
    summary=dict(calibration=calibration,policy_digest=POLICY_DIGEST,primary_policy=semantic.POLICY_DIGEST,attempted=attempted,rescued=adopted,
                 unresolved=attempted-adopted,passing_originals_preserved=len(passing),additional_candidates_max=2,
                 seconds=seconds,initialization_seconds=initialization_seconds,remaining_reasons=failures,native_review=False,approved=False)
    print('UVREFINE_BENCHMARK '+json.dumps(summary,sort_keys=True),flush=True)


if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--memory',type=Path,required=True);parser.add_argument('--model-dir',type=Path,required=True)
    args=parser.parse_args();benchmark(args.memory,args.model_dir)
