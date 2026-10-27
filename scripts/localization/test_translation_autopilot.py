import contextlib
import copy
import datetime as dt
import importlib.util
import io
import json
import types
from pathlib import Path
import unittest
from unittest.mock import patch

HERE=Path(__file__).resolve().parent
def load(name):
    spec=importlib.util.spec_from_file_location(name.replace('-','_'),HERE/(name+'.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
semantic=load('background-semantic');alerts=load('translation-alerts')
client=load('autopilot-client')


class SemanticScreenTest(unittest.TestCase):
    def row(self):
        return dict(record_id='abc',source='Your file stays on your device.',translation='El archivo permanece en tu dispositivo.',
                    checks={'nonempty':True},warnings=[])
    def scores(self):
        return dict(similarity=.95,forward_entailment=.95,reverse_entailment=.95,
                    forward_contradiction=.01,reverse_contradiction=.01)
    def test_critical_direction_order_negation_and_data(self):
        cases=[('Convert PNG to PDF.','Convert PDF to PNG.','conversion_direction'),
               ('From (2, 3) to (5, 7).','From (3, 2) to (5, 7).','quantity_or_coordinate_order'),
               ('Files never leave.','Files leave.','negation'),
               ('Use at least 5 files.','Use at most 5 files.','minimum_condition'),
               ('Open {file}.','Open {files}.','protected_data_in_back_translation')]
        for source,back,expected in cases:self.assertIn(expected,semantic.critical_changes(source,back))
        self.assertEqual(semantic.direction('Make PDF files from PNG images.'),('png','pdf'))
        self.assertEqual(semantic.critical_changes('Save {file} with 5 pages.','Save {file} with 5 pages.'),[])
    def test_scores_cannot_hide_structural_or_command_errors(self):
        row=self.row();self.assertEqual(semantic.decide(row,row['source'],False,self.scores()),[])
        row['checks']['nonempty']=False;self.assertIn('structural:nonempty',semantic.decide(row,row['source'],False,self.scores()))
        row=self.row();row['source']='Download'
        self.assertIn('short_command_changed',semantic.decide(row,'Delete',False,self.scores()))
    def test_missing_nan_or_weak_scores_do_not_pass(self):
        row=self.row()
        for scores in [None,{},dict(self.scores(),similarity=float('nan'))]:
            self.assertIn('semantic_evidence_missing',semantic.decide(row,row['source'],False,scores))
        self.assertIn('contradiction',semantic.decide(row,row['source'],False,dict(self.scores(),forward_contradiction=.9)))
    def test_audit_is_bound_to_raw_policy_and_honest_approval(self):
        row=self.row();audit=semantic.make_audit(row,row['source'],False,self.scores())
        semantic.validate_audit(audit,row)
        for field,value in [('raw_digest','bad'),('policy_digest','old'),('approved',True),('native_review',True),('auto_usable',False)]:
            bad=copy.deepcopy(audit);bad[field]=value
            with self.assertRaises(ValueError):semantic.validate_audit(bad,row)
    def test_model_cannot_download_on_mac(self):
        with patch.dict('os.environ',{'GITHUB_ACTIONS':'','RUNNER_OS':'macOS'}):
            with self.assertRaises(RuntimeError):semantic.Models()
    def test_completed_loading_aspect_is_normalized_without_progress_or_actor_changes(self):
        self.assertEqual(semantic.canonical_state('The drawing has finished loading.'),'The drawing is loaded.')
        self.assertEqual(semantic.canonical_state('The drawing is fully loaded.'),'The drawing is loaded.')
        for text in ['The drawing is still loading.','The drawing is not fully loaded.','The app has finished loading a file.']:
            self.assertEqual(semantic.canonical_state(text),text)


class GithubClientTest(unittest.TestCase):
    def test_repo_root_url_has_no_trailing_slash(self):
        calls=[]
        def run(command,**kwargs):
            calls.append(command);return types.SimpleNamespace(returncode=0,stdout=b'{"private":false}',stderr=b'')
        with patch.object(client.subprocess,'run',run):self.assertFalse(client.api('')['private'])
        self.assertEqual(calls[0][-1],'repos/pedronunezwebs-hash/usefulverse')


class TranslationNoticeTest(unittest.TestCase):
    def run_record(self):
        return dict(id=12,status='in_progress',conclusion=None,created_at='2026-10-28T00:00:00Z',html_url='https://github.com/example/run')
    def test_aggregate_queued_with_active_jobs_is_not_false_alarm(self):
        now=dt.datetime(2026,10,28,3,tzinfo=dt.timezone.utc)
        row=self.run_record();row['status']='queued'
        self.assertEqual(alerts.classify(row,[dict(name='drafts (0)',status='in_progress',conclusion=None,started_at='2026-10-28T00:00:00Z')],None,now),(None,None))
        self.assertEqual(alerts.classify(row,[],None,now)[0],'queued')
    def test_failure_cancellation_and_pending_are_reported(self):
        now=dt.datetime(2026,10,28,3,tzinfo=dt.timezone.utc)
        row=self.run_record()
        self.assertEqual(alerts.classify(row,[dict(name='job',status='completed',conclusion='failure')],None,now)[0],'failed')
        row.update(status='completed',conclusion='cancelled')
        self.assertEqual(alerts.classify(row,[],None,now)[0],'stopped')
        row['conclusion']='success'
        self.assertEqual(alerts.classify(row,[],dict(run_id=12,pending=2,quarantined=1),now)[0],'pending')
        self.assertEqual(alerts.classify(row,[],dict(run_id=12,pending=0,quarantined=0),now)[0],'complete')
    def test_unchanged_notice_does_not_notify_again(self):
        calls=[]
        body='<!-- usefulverse-translation:12 -->\n<!-- state:failed -->'
        def api(path,*args):
            calls.append(path)
            return [dict(number=5,body=body,html_url='https://github.com/issue/5')]
        url,changed=alerts.notify(self.run_record(),'failed','bad',None,api)
        self.assertFalse(changed);self.assertEqual(len(calls),1)
    def test_new_notice_is_assigned_to_pedro_without_external_mail(self):
        calls=[]
        def api(path,*args):
            calls.append((path,args))
            return [] if path.startswith('issues?') else dict(html_url='https://github.com/issue/6')
        alerts.notify(self.run_record(),'stopped','Stopped',None,api)
        self.assertEqual(calls[-1][1][1]['assignees'],['pedronunezwebs-hash'])


if __name__=='__main__':unittest.main()
