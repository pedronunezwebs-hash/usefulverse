#!/usr/bin/env python3
"""Bounded free Actions pipeline: recover, audit, export and commit data only."""
import argparse
import base64
from collections import Counter, defaultdict
import datetime as dt
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import subprocess
import time
from urllib.parse import urlencode

HERE=Path(__file__).resolve().parent
def load(name):
    spec=importlib.util.spec_from_file_location(name.replace('-','_'),HERE/(name+'.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
client=load('autopilot-client');drafts=load('background-drafts');semantic=load('background-semantic')
RAW_FORMAT=drafts.FORMAT


def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def write(path,text):
    path.parent.mkdir(parents=True,exist_ok=True)
    if path.is_symlink() or any(p.is_symlink() for p in path.parents):raise ValueError('Symlinks are not result files')
    temporary=path.with_suffix(path.suffix+'.tmp');temporary.write_text(text);os.replace(temporary,path)


def merge(rows, audits, row):
    if row.get('format')==RAW_FORMAT:
        drafts.validate_record(row);table=rows;key=row['record_id']
    elif row.get('format')==semantic.FORMAT:
        table=audits;key=row['record_id']+':'+row['policy_digest']
    else:raise ValueError('Unknown checkpoint format')
    if key in table and canonical(table[key])!=canonical(row):raise ValueError('Conflicting immutable checkpoint')
    table[key]=row


def read_lines(text,rows,audits,partial_tail=False):
    lines=text.splitlines()
    for index,line in enumerate(lines):
        try:
            if drafts.PREFIX in line:row=json.loads(base64.b64decode(line.split(drafts.PREFIX,1)[1].strip(),validate=True))
            elif semantic.PREFIX in line:row=json.loads(base64.b64decode(line.split(semantic.PREFIX,1)[1].strip(),validate=True))
            elif line.startswith('{'):row=json.loads(line)
            else:continue
        except (ValueError,TypeError):
            if partial_tail and index==len(lines)-1:continue
            raise
        merge(rows,audits,row)


def memory(directory):
    rows={};audits={}
    if directory.exists():
        for path in sorted((directory/'memory').rglob('*.jsonl')):
            read_lines(path.read_text(),rows,audits)
    return rows,audits


def active_audit(row,audits):
    audit=audits.get(row['record_id']+':'+semantic.POLICY_DIGEST)
    return semantic.validate_audit(audit,row) if audit else None


def harvest(run_id,rows,audits,imported=None,shard=None):
    imported=imported if imported is not None else set()
    jobs=client.api(f'actions/runs/{int(run_id)}/jobs?per_page=100')['jobs']
    for job in jobs:
        if job['status']!='completed' or not re.search(r'(?:^| / )drafts(?:-next|-last)? \(',job['name']):continue
        if job['id'] in imported:continue
        if shard is not None and not re.search(r'\('+str(shard)+r'\)$',job['name']):continue
        if not any(s['name'] in ('Generate resumable drafts without publishing','Audit meaning and quarantine') and s['status']=='completed' and s.get('conclusion')!='skipped' for s in job.get('steps',[])):continue
        try:raw=client.request(f'actions/jobs/{job["id"]}/logs').decode()
        except FileNotFoundError:continue
        # Downloaded terminal escapes are opaque data, never terminal output.
        selected='\n'.join(line for line in raw.splitlines() if drafts.PREFIX in line or semantic.PREFIX in line)
        read_lines(selected,rows,audits,partial_tail=job.get('conclusion')=='cancelled')
        imported.add(job['id'])


def collect_runs(rows,audits,directory,shard=None):
    try:imported=set(json.loads((directory/'manifest.json').read_text()).get('imported_jobs',[]))
    except FileNotFoundError:imported=set()
    ids={int(os.environ['GITHUB_RUN_ID'])}
    control=json.loads((HERE/'translation-control.json').read_text())
    ids.update(control.get('migration_runs',[]))
    for workflow in ['translation-drafts.yml','translation-autopilot.yml']:
        try:
            runs=client.api('actions/workflows/'+workflow+'/runs?'+urlencode(dict(status='completed',per_page=3)))['workflow_runs']
            ids.update(r['id'] for r in runs)
        except FileNotFoundError:pass
    for run_id in sorted(ids):harvest(run_id,rows,audits,imported,shard)
    return sorted(imported)


def recover(args):
    if client.api('')['private']:raise RuntimeError('Public standard runners only')
    rows,audits=memory(args.memory)
    for path in (HERE.parents[1]/'docs/quality/translation-drafts/checkpoints').glob('*.jsonl'):
        read_lines(path.read_text(),rows,audits)
    collect_runs(rows,audits,args.memory,args.shard)
    corpus=json.loads(args.corpus.read_text())
    wanted={r['record_id'] for r in drafts.work_items(corpus,args.locales.split(',') if args.locales else drafts.LOCALES,args.shard,4)}
    selected={k:v for k,v in rows.items() if k in wanted}
    valid_audits={k:v for k,v in audits.items() if v['record_id'] in selected}
    write(args.raw,''.join(canonical(selected[k])+'\n' for k in sorted(selected)))
    write(args.audits,''.join(canonical(valid_audits[k])+'\n' for k in sorted(valid_audits)))
    pending_raw=len(wanted)-len(selected)
    pending_audit=sum(active_audit(row,valid_audits) is None for row in selected.values())
    run=client.api('actions/runs/'+os.environ['GITHUB_RUN_ID'])
    start=dt.datetime.fromisoformat(run['created_at'].replace('Z','+00:00'))
    deadline=(start+dt.timedelta(hours=24)).timestamp()
    left=max(0,int((deadline-time.time())/60)-20)
    budget=min(int(args.minutes),left)
    gen=min(120,budget//2) if pending_raw else 0
    audit=budget-gen
    if pending_audit>max(1000,len(selected)//2):gen=0;audit=budget
    if not pending_raw and not pending_audit:gen=audit=0
    result=dict(pending_raw=pending_raw,pending_audit=pending_audit,gen_minutes=gen,audit_minutes=audit,deadline=int(deadline),reused=len(selected))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'],'a') as handle:
            for k,v in result.items():handle.write(f'{k}={v}\n')
    print('UVAUTOPILOT_PLAN '+canonical(result),flush=True)


def translator(directory):
    if not (directory/'model.bin').exists():return drafts.Model(directory)
    import ctranslate2
    from transformers import T5Tokenizer
    model=drafts.Model.__new__(drafts.Model)
    model.tokenizer=T5Tokenizer.from_pretrained(drafts.MODEL,revision=drafts.REVISION,trust_remote_code=False)
    model.translator=ctranslate2.Translator(str(directory),device='cpu',compute_type='int8',inter_threads=1,intra_threads=min(4,os.cpu_count() or 1))
    return model


def audit(args):
    if os.environ.get('GITHUB_ACTIONS')!='true' or os.environ.get('RUNNER_OS')!='Linux':raise RuntimeError('Inference only in Actions Linux')
    rows={};audits={}
    for path in [args.raw,args.audits,args.generated]:
        if path.exists():read_lines(path.read_text(),rows,audits)
    for row in rows.values():
        previous=active_audit(row,audits)
        if previous:print(semantic.PREFIX+base64.b64encode(canonical(previous).encode()).decode(),flush=True)
    pending=[row for row in rows.values() if active_audit(row,audits) is None]
    if not pending:return
    deadline=min(time.time()+int(args.minutes)*60,int(args.deadline))
    if time.time()+5>=deadline:return
    models=semantic.Models();semantic.selftest(models)
    deadline=min(time.time()+int(args.minutes)*60,int(args.deadline))
    back_model=None;counts=Counter()
    for row in sorted(pending,key=lambda r:r['record_id']):
        if time.time()+5>=deadline:break
        if all(row['checks'].values()) and not row['warnings']:
            if row.get('back_sample'):
                back=row['back_sample']['translation'];cut=row['back_sample']['truncated']
            else:
                if back_model is None:back_model=translator(args.model_dir)
                masked,saved=drafts.protect(row['translation'])
                [(raw,cut)]=back_model.translate([masked],'en')
                back=drafts.queue.restore(raw,saved) or raw
            scores=models.score(row['source'],row['translation'],back)
        else:back='';cut=True;scores=None
        result=semantic.make_audit(row,back,cut,scores)
        semantic.validate_audit(result,row)
        print(semantic.PREFIX+base64.b64encode(canonical(result).encode()).decode(),flush=True)
        counts['usable' if result['auto_usable'] else 'quarantined']+=1
        if sum(counts.values())%16==0:print('UVAUTOPILOT_AUDIT_PROGRESS '+canonical(counts),flush=True)
    print('UVAUTOPILOT_AUDIT_SUMMARY '+canonical(dict(counts=counts,remaining=len(pending)-sum(counts.values()),approved=False)),flush=True)


def export(corpus,rows,audits,directory,run_id):
    locales=corpus['destinationLocales'];unit_map={}
    for unit in corpus['units']:
        for locale in locales:unit_map[(locale,unit['key'])]=(unit,drafts.identity(unit,locale))
    source_targets=set(identity for unit,identity in unit_map.values())
    generated=set(rows)&source_targets
    audited={key for key in generated if active_audit(rows[key],audits)}
    usable={key for key in audited if active_audit(rows[key],audits)['auto_usable']}
    groups=defaultdict(list)
    for key,row in rows.items():groups[('raw',row['locale'],key[:2])].append(row)
    for key,result in audits.items():
        row=rows.get(result['record_id'])
        if row:groups[('audits',row['locale'],result['record_id'][:2])].append(result)
    for (kind,locale,prefix),records in groups.items():
        if locale not in drafts.LOCALES:raise ValueError('Unexpected memory locale')
        raw=''.join(canonical(r)+'\n' for r in sorted(records,key=lambda r:canonical(r)))
        if len(raw.encode())>25*1024**2:raise ValueError('Checkpoint file exceeds the free pipeline bound')
        write(directory/'memory'/kind/locale/(prefix+'.jsonl'),raw)
    for old in (directory/'packages').glob('*/*.json'):
        if old.is_symlink():raise ValueError('Symlink package')
        old.unlink()
    exported=0;incomplete=0
    for document in corpus['documents']:
        tool=document['toolId']
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',tool):raise ValueError('Unsafe package owner')
        units=[unit for unit in corpus['units'] if unit['key'].startswith(tool+'.')]
        for locale in locales:
            entries={};missing=[]
            for unit in units:
                identity=unit_map[locale,unit['key']][1]
                if identity in usable:entries[unit['key']]=dict(source_hash=unit['source_hash'],context=unit['context'],translation=rows[identity]['translation'])
                else:missing.append(unit['key'])
            exported+=len(entries);incomplete+=bool(missing)
            package=dict(schemaVersion=1,toolId=tool,locale=locale,semantic_policy=semantic.POLICY_DIGEST,coverage=document['coverage'],entries=entries,missing=missing,
                         complete_extracted_copy=not missing,release_approved=False,native_review=False,source_digest=corpus['sourceDigest'])
            if entries:write(directory/'packages'/locale/(tool+'.json'),canonical(package)+'\n')
    report=dict(schemaVersion=1,run_id=int(run_id),source_digest=corpus['sourceDigest'],source_targets=len(source_targets),generated=len(generated),
                audited=len(audited),pending=len(source_targets)-len(generated)+len(generated)-len(audited),quarantined=len(audited)-len(usable),
                exported_entries=exported,incomplete_packages=incomplete,catalog_tools=corpus['tools'],coverage=corpus['coverage'],
                approved=False,native_review=False,semantic_policy=semantic.POLICY_DIGEST)
    write(directory/'report.json',canonical(report)+'\n')
    write(directory/'manifest.json',canonical(dict(format='usefulverse-automatic-results-v1',source_commit=os.environ.get('DRAFT_SOURCE_SHA'),run_id=int(run_id),
                                               source_ref=os.environ.get('DRAFT_SOURCE_REF','feat/new-tools-batch-1'),result_branch=client.RESULT_BRANCH,maximum_cost_usd=0,release_approved=False))+'\n')
    return report


def validate_destination(directory):
    branch=subprocess.check_output(['git','branch','--show-current'],cwd=directory,text=True).strip()
    if branch!=client.RESULT_BRANCH:raise ValueError('Results may only be committed to the dedicated data branch')
    remote=subprocess.check_output(['git','remote','get-url','origin'],cwd=directory,text=True).strip()
    if remote.removesuffix('.git').rstrip('/')!='https://github.com/'+client.REPOSITORY:raise ValueError('Wrong results repository')


def deliver(args):
    if client.api('')['private']:raise RuntimeError('Public standard runners only')
    if args.commit:validate_destination(args.memory)
    rows,audits=memory(args.memory)
    imported=collect_runs(rows,audits,args.memory)
    report=export(json.loads(args.corpus.read_text()),rows,audits,args.memory,os.environ['GITHUB_RUN_ID'])
    manifest=args.memory/'manifest.json'
    data=json.loads(manifest.read_text());data['imported_jobs']=imported
    write(manifest,canonical(data)+'\n')
    print('UVAUTOPILOT_REPORT '+canonical(report),flush=True)
    if not args.commit:return
    paths=[name for name in ['memory','packages','report.json','manifest.json'] if (args.memory/name).exists()]
    subprocess.run(['git','add','--',*paths],cwd=args.memory,check=True)
    names=subprocess.check_output(['git','diff','--cached','--name-only'],cwd=args.memory,text=True).splitlines()
    if any(not (name.startswith(('memory/','packages/')) or name in ('report.json','manifest.json')) for name in names):raise ValueError('Forbidden result path')
    if not names:return
    subprocess.run(['git','config','user.name','github-actions[bot]'],cwd=args.memory,check=True)
    subprocess.run(['git','config','user.email','github-actions[bot]@users.noreply.github.com'],cwd=args.memory,check=True)
    subprocess.run(['git','commit','-m','chore: save automatic translation results [skip ci]'],cwd=args.memory,check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['git','push','origin','HEAD:refs/heads/'+client.RESULT_BRANCH],cwd=args.memory,check=True)


def ready(args):
    corpus=json.loads(args.corpus.read_text())
    try:report=json.loads((args.memory/'report.json').read_text())
    except FileNotFoundError:report={}
    done=report.get('source_digest')==corpus['sourceDigest'] and report.get('semantic_policy')==semantic.POLICY_DIGEST and report.get('pending')==0
    value='false' if done else 'true'
    print('UVAUTOPILOT_READY '+value)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'],'a') as handle:handle.write('run_models='+value+'\n')


def main():
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
    p=sub.add_parser('ready');p.add_argument('--corpus',type=Path,required=True);p.add_argument('--memory',type=Path,required=True)
    p=sub.add_parser('recover');p.add_argument('--corpus',type=Path,required=True);p.add_argument('--memory',type=Path,required=True)
    p.add_argument('--raw',type=Path,required=True);p.add_argument('--audits',type=Path,required=True);p.add_argument('--shard',type=int,required=True)
    p.add_argument('--locales',default='');p.add_argument('--minutes',type=int,default=240)
    p=sub.add_parser('audit')
    for name in ['raw','audits','generated','model-dir']:p.add_argument('--'+name,type=Path,required=True)
    p.add_argument('--minutes',type=int,required=True);p.add_argument('--deadline',type=int,required=True)
    p=sub.add_parser('deliver');p.add_argument('--corpus',type=Path,required=True);p.add_argument('--memory',type=Path,required=True);p.add_argument('--commit',action='store_true')
    args=parser.parse_args();globals()[args.command](args)


if __name__=='__main__':main()
