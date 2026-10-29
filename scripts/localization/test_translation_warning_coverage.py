"""A newly discovered old output must be reviewed without rewriting history."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)


class WarningCoverageTest(unittest.TestCase):
    def case(self):
        path=pilot.ROOT/'docs/quality/translation-pilot/checkpoints/context-v11/madlad.jsonl'
        row=next(r for r in map(json.loads,path.read_text().splitlines()) if r['candidate']=='model' and r['locale']=='es' and r['key']=='dxf-viewer.home')
        self.assertTrue(pilot.record_flags(row)['known_semantic_errors'])
        primary={'inference_policy':'context-v11','expected_rows':0,'rows':[],'warning_reconciliation':[],
                 'requires_complete_model_warning_coverage':True,'warning_coverage_supplemental_reviews':[],
                 'full_gate':{'es':{'passed':False}}}
        return primary,row

    def test_audit_cannot_ignore_a_newly_flagged_old_output_outside_original_sample(self):
        primary,row=self.case()
        with tempfile.TemporaryDirectory() as tmp,patch.object(pilot,'ROOT',Path(tmp)):
            with self.assertRaises(ValueError):pilot.audit_review_warnings(primary,{row['record_id']:row})

    def test_historical_coverage_requires_hash_bound_independent_nonoverriding_review(self):
        primary,row=self.case();h=lambda s:hashlib.sha256(s.encode()).hexdigest()
        judgment={**{k:row[k] for k in ['key','locale','source_hash']},'record_ids':[row['record_id']],
                  'translation_hash':h(row['translation']),'scores':{'meaning':1,'numbers_negations':3,'naturalness':2}}
        supplemental={'inference_policy':'context-v11','expected_rows':1,'rows':[judgment],
                      'full_gate':{'es':{'passed':False}},'approved_locales':[],
                      'warning_reconciliation':[{'record_id':row['record_id'],'translation_hash':h(row['translation']),
                         'back_translation_hash':h(row['back_translation']),'warnings':{'known_semantic_errors':{
                            'disposition':'forward-defect','blocks_gate':True,'note':'Hogar means a house, not navigation Home.'}}}]}
        with tempfile.TemporaryDirectory() as tmp,patch.object(pilot,'ROOT',Path(tmp)):
            directory=Path(tmp)/'docs/quality/translation-pilot';directory.mkdir(parents=True)
            def write(current,extra,mutation=None):
                a=json.dumps(current);b=json.dumps(extra);(directory/'review-primary.json').write_text(a);(directory/'review-supplement.json').write_text(b)
                entry={'review_file':'review-primary.json','review_file_sha256':h(a),'review_digest':pilot.digest(current),
                       'supplemental_review':'review-supplement.json','supplemental_review_sha256':h(b)}
                if mutation=='stale-primary':entry['review_file_sha256']='0'*64
                if mutation=='stale-supplement':entry['supplemental_review_sha256']='0'*64
                if mutation=='stale-digest':entry['review_digest']='0'*64
                if mutation=='path-traversal':entry['supplemental_review']='../review-supplement.json'
                (directory/'review-coverage-addenda.json').write_text(json.dumps([entry]))
            write(primary,supplemental)
            self.assertEqual(pilot.audit_complete_model_warning_coverage(primary,{row['record_id']:row}),{row['record_id']})
            self.assertEqual(pilot.audit_review_warnings(primary,{row['record_id']:row}),0)
            for mutation in ['stale-primary','stale-supplement','stale-digest','path-traversal','wrong-policy','approved','gate','missing-decision','forged-hash','overlap']:
                current=copy.deepcopy(primary);extra=copy.deepcopy(supplemental)
                if mutation=='wrong-policy':extra['inference_policy']='context-v12'
                if mutation=='approved':extra['approved_locales']=['es']
                if mutation=='gate':extra['full_gate']['es']['passed']=True
                if mutation=='missing-decision':extra['warning_reconciliation']=[]
                if mutation=='forged-hash':extra['rows'][0]['translation_hash']='0'*64
                if mutation=='overlap':current['rows']=copy.deepcopy(extra['rows']);current['expected_rows']=1;current['warning_reconciliation']=copy.deepcopy(extra['warning_reconciliation'])
                write(current,extra,mutation)
                with self.subTest(mutation=mutation),self.assertRaises(ValueError):pilot.audit_complete_model_warning_coverage(current,{row['record_id']:row})


if __name__=='__main__':unittest.main()
