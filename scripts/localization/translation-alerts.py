#!/usr/bin/env python3
"""Notify Pedro only on an actionable transition; no model tokens or email API."""
import argparse
import base64
import datetime as dt
import importlib.util
import json
import os
from pathlib import Path
import re

spec=importlib.util.spec_from_file_location('client',Path(__file__).with_name('autopilot-client.py'))
client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
OWNER='pedronunezwebs-hash'


def instant(value):
    return dt.datetime.fromisoformat(value.replace('Z','+00:00'))


def classify(run, jobs, report, now):
    failed=[j['name'] for j in jobs if j.get('conclusion') in ('failure','timed_out','startup_failure','action_required')]
    if failed:return 'failed','Falló un trabajo: '+', '.join(failed)
    conclusion=run.get('conclusion')
    if conclusion in ('failure','cancelled','timed_out','action_required','stale'):
        return 'stopped','La ejecución terminó con estado '+str(conclusion)+'.'
    if run['status']!='completed':
        active=[j for j in jobs if j['status']=='in_progress']
        if active and any(j.get('started_at') and (now-instant(j['started_at'])).total_seconds()>6*3600 for j in active):
            return 'stalled','Un trabajo sigue activo después del límite previsto; comprobar la ejecución.'
        if not active and (now-instant(run['created_at'])).total_seconds()>90*60:
            return 'queued','No hay trabajos ejecutándose y la tanda lleva más de 90 minutos esperando.'
        return None,None
    if report is None:return 'report_missing','La tanda terminó sin un informe final verificable.'
    # A later saved campaign supersedes the latest-report pointer. Do not
    # turn a previously successful run into a false missing-report alarm.
    if conclusion=='success' and report.get('run_id',0)>run['id']:return None,None
    if report.get('run_id')!=run['id']:return 'report_missing','El informe disponible no corresponde a esta tanda.'
    pending=report.get('pending',0);quarantine=report.get('quarantined',0)
    if pending or quarantine:
        return 'pending',f'La tanda terminó: {pending} unidades pendientes y {quarantine} en cuarentena. No se publican automáticamente.'
    return 'complete','La cola se completó y se guardaron los paquetes con controles automáticos. La publicación mantiene sus puertas propias.'


def controller_state(workflow, runs, report, control, now):
    if not control.get('enabled',False):return 'paused','El traductor está pausado en translation-control.json.'
    if workflow.get('state')!='active':return 'disabled','GitHub ha desactivado el workflow del traductor.'
    if any(run['status']!='completed' for run in runs):return None,None
    latest=max((instant(run['created_at']) for run in runs),default=instant(control['watch_from_utc']))
    if (not report or report.get('pending',0)>0) and (now-latest).total_seconds()>30*3600:
        return 'overdue','Hay traducciones pendientes y no ha arrancado una tanda en más de 30 horas; comprobar el cron.'
    return None,None


def notify(run, state, explanation, report, api=client.api):
    marker=f'<!-- usefulverse-translation:{run["id"]} -->'
    issues=api('issues?state=all&per_page=100')
    previous=next((i for i in issues if marker in (i.get('body') or '')),None)
    title=f'[Traducciones] tanda {run["id"]}: {state}'
    body=(marker+'\n'+f'<!-- state:{state} -->\n\n@{OWNER}\n\n'+explanation+
          f'\n\n[Ejecución de GitHub]({run["html_url"]})\n\n'+
          'Este aviso lo genera GitHub sin ChatGPT ni API de correo. No implica aprobación nativa ni publicación.\n')
    if report:
        body+='\nResumen: '+json.dumps({k:report.get(k) for k in ['source_targets','generated','audited','pending','quarantined','exported_entries']},ensure_ascii=False)+'\n'
    if previous:
        if f'<!-- state:{state} -->' in (previous.get('body') or ''):return previous['html_url'],False
        api('issues/'+str(previous['number']),'PATCH',dict(title=title,body=body))
        api('issues/'+str(previous['number'])+'/comments','POST',dict(body=f'@{OWNER} Cambio de estado: **{state}**. '+explanation))
        return previous['html_url'],True
    issue=api('issues','POST',dict(title=title,body=body,assignees=[OWNER]))
    return issue['html_url'],True


def run_watch(args):
    if client.api('')['private']:
        raise RuntimeError('Only the authorized public repository is allowed')
    if args.probe:
        run=dict(id=0,html_url='https://github.com/'+client.REPOSITORY+'/actions',status='completed',conclusion='success')
        url,_=notify(run,'probe','Prueba del aviso automático solicitada al configurar el sistema. No se ha detectado una avería.',None)
        print(json.dumps(dict(notification_test=url)));return
    rows=[]
    if args.run_id:rows=[client.api('actions/runs/'+str(args.run_id))]
    else:
        for workflow in ['translation-drafts.yml','translation-autopilot.yml']:
            try:rows.extend(client.api('actions/workflows/'+workflow+'/runs?per_page=5')['workflow_runs'])
            except FileNotFoundError:pass
    now=dt.datetime.now(dt.timezone.utc)
    control=json.loads(Path(__file__).with_name('translation-control.json').read_text())
    if not args.run_id:
        try:
            workflow=client.api('actions/workflows/translation-autopilot.yml')
            new_runs=[run for run in rows if run.get('workflow_id')==workflow['id']]
            try:
                blob=client.api('contents/report.json?ref='+client.RESULT_BRANCH)
                latest_report=json.loads(base64.b64decode(blob['content']))
            except FileNotFoundError:latest_report=None
            state,reason=controller_state(workflow,new_runs,latest_report,control,now)
            if state:
                url,changed=notify(dict(id=-1,html_url='https://github.com/'+client.REPOSITORY+'/actions/workflows/translation-autopilot.yml'),state,reason,latest_report)
                print(json.dumps(dict(controller=state,notification=url,changed=changed)))
        except FileNotFoundError:pass
    for run in rows:
        if (run.get('head_repository') or {}).get('full_name')!=client.REPOSITORY:continue
        if run['status']=='completed' and instant(run['updated_at'])<instant(control['watch_from_utc']):continue
        jobs=client.api('actions/runs/'+str(run['id'])+'/jobs?per_page=100')['jobs']
        report=None
        try:
            blob=client.api('contents/report.json?ref='+client.RESULT_BRANCH)
            report=json.loads(base64.b64decode(blob['content']))
        except FileNotFoundError:pass
        state,reason=classify(run,jobs,report,now)
        if state:
            url,changed=notify(run,state,reason,report)
            print(json.dumps(dict(run=run['id'],state=state,notification=url,changed=changed)))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--run-id',type=int)
    parser.add_argument('--probe',action='store_true')
    run_watch(parser.parse_args())
