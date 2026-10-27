import base64
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import Mock, patch

HERE=Path(__file__).resolve().parent
def load(name):
    spec=importlib.util.spec_from_file_location(name.replace('-','_'),HERE/(name+'.py'))
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
quality=load('background-refinement');pipeline=load('translation-autopilot')


class BoundedQualityTest(unittest.TestCase):
    def fixture(self):
        unit=dict(key='sample-tool.copy.title',source='Download the file.',source_hash=quality.drafts.digest('Download the file.'),
                  context='sample-tool UI copy.title',locales=['es'])
        corpus=dict(units=[unit],destinationLocales=['es'],sourceDigest='source',tools=1,
                    documents=[dict(toolId='sample-tool',sourceCopy={},coverage='centralized-copy')],coverage={})
        work=quality.drafts.work_items(corpus,['es'],0,4)[0]
        parent=quality.drafts.make_record(work,'Borra el archivo.',False,'Borra el archivo.',.1)
        scores=dict(similarity=.95,forward_entailment=.95,reverse_entailment=.95,forward_contradiction=.01,reverse_contradiction=.01)
        primary=quality.semantic.make_audit(parent,'Delete the file.',False,scores)
        value=quality.candidate(parent,'Descarga el archivo.','Descarga el archivo.',False,'es',dict(translation=parent['source'],truncated=False))
        audit=quality.semantic.make_audit(value,parent['source'],False,scores)
        result=quality.make_result(parent,primary,[dict(candidate=value,audit=audit)])
        return corpus,parent,primary,result
    def test_prior_agent_reference_data_is_reproducible_and_all_known_errors_stay_blocked(self):
        history=load('historical-quality')
        self.assertEqual(history.read(),history.compile_references())
        bad=[r for r in quality.history.data['records'] if not r['accepted']]
        self.assertEqual(len(bad),46)
        for row in bad:
            self.assertTrue(quality.history.rejects(dict(row,key=row['key'].replace('.', '.copy.',1))))
            changed=dict(row,source_hash=quality.drafts.digest('Another source'))
            self.assertFalse(quality.history.rejects(changed))
    def test_relabeling_an_old_failure_without_changing_its_review_hash_is_rejected(self):
        history=load('historical-quality');data=copy.deepcopy(quality.history.data)
        next(r for r in data['records'] if not r['accepted'])['accepted']=True
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'forged.json';path.write_text(json.dumps(data))
            with patch.object(history,'PATH',path):
                with self.assertRaises(ValueError):history.read()
    def test_known_bad_translation_cannot_be_selected_even_when_models_falsely_pass(self):
        _,_,_,fixture=self.fixture();scores=fixture['proposals'][0]['audit']['scores']
        ref=next(r for r in quality.history.data['records'] if not r['accepted'] and all(quality.drafts.checks(r['source'],r['translation']).values()))
        row=dict(ref,record_id='known-bad',keys=[ref['key']],checks=quality.drafts.checks(ref['source'],ref['translation']),warnings=[])
        audit=quality.semantic.make_audit(row,ref['source'],False,scores)
        self.assertTrue(audit['auto_usable']);self.assertFalse(quality.primary_usable(row,audit))
        self.assertIsNone(quality.selected_translation(row,{},audit))
    def test_passing_original_never_spends_another_model_call_or_gets_replaced(self):
        _,parent,primary,result=self.fixture()
        good=quality.semantic.make_audit(parent,parent['source'],False,result['proposals'][0]['audit']['scores'])
        translator=Mock(side_effect=AssertionError('must not translate a passing original'))
        self.assertIsNone(quality.refine(parent,good,Mock(),translator,Mock(),time.time()+60))
        self.assertEqual(quality.selected_translation(parent,{},good),parent['translation'])
        with self.assertRaises(ValueError):quality.validate_result(result,parent,good)
    def test_valid_refinement_is_bound_and_selected_without_rewriting_primary(self):
        _,parent,primary,result=self.fixture();before=copy.deepcopy(parent)
        quality.validate_result(result,parent,primary)
        audits={quality.key(parent):result}
        self.assertEqual(quality.selected_translation(parent,audits,primary),'Descarga el archivo.')
        self.assertFalse(quality.pending(parent,audits,primary));self.assertEqual(parent,before)
    def test_model_scores_cannot_approve_changed_numbers_negation_or_command(self):
        _,parent,primary,result=self.fixture();scores=result['proposals'][0]['audit']['scores']
        for source,back in [('Save 5 pages.','Save 50 pages.'),('Never upload the file.','Upload the file.'),('Download','Delete')]:
            p=dict(parent,source=source,source_hash=quality.drafts.digest(source))
            v=quality.candidate(p,'Descarga el archivo.','Descarga el archivo.',False,'es')
            a=quality.semantic.make_audit(v,back,False,scores)
            self.assertFalse(a['auto_usable'])
    def test_forged_source_candidate_recipe_or_approval_is_rejected(self):
        _,parent,primary,result=self.fixture()
        for field,value in [('raw_digest','other'),('selected',True),('approved',True),('native_review',True),('policy_digest','old')]:
            bad=copy.deepcopy(result);bad[field]=value
            with self.assertRaises(ValueError):quality.validate_result(bad,parent,primary)
        bad=copy.deepcopy(result);bad['proposals'][0]['candidate']['context']='another context'
        with self.assertRaises(ValueError):quality.validate_result(bad,parent,primary)
    def test_alternative_count_is_bounded_and_unresolved_attempt_is_not_repeated(self):
        _,parent,primary,result=self.fixture()
        empty=quality.make_result(parent,primary,[]);quality.validate_result(empty,parent,primary)
        self.assertFalse(quality.pending(parent,{quality.key(parent):empty},primary))
        self.assertIsNone(quality.selected_translation(parent,{quality.key(parent):empty},primary))
        bad=copy.deepcopy(result);bad['proposals']*=3
        with self.assertRaises(ValueError):quality.validate_result(bad,parent,primary)
    def test_budget_expiring_during_search_is_not_saved_as_a_completed_attempt(self):
        _,parent,primary,_=self.fixture()
        with patch.object(quality.time,'time',side_effect=[0,100]), patch.object(quality,'alternatives',return_value=[('Descarga el archivo.',False)]):
            self.assertIsNone(quality.refine(parent,primary,Mock(),lambda:Mock(),lambda text:('es',1),60))
    def test_empty_or_oversized_proposal_cannot_pass_or_start_unbounded_decoding(self):
        _,parent,primary,result=self.fixture()
        value=quality.candidate(parent,'','',False,'es')
        audit=quality.semantic.make_audit(value,'',True,None)
        self.assertFalse(audit['auto_usable'])
        self.assertIsNone(quality.choose(parent,primary,[dict(candidate=value,audit=audit)]))
        model=Mock();model.tokenizer.encode.return_value=list(range(513))
        model.tokenizer.convert_ids_to_tokens.side_effect=lambda ids:ids
        self.assertEqual(quality.alternatives(model,'long source','es'),[])
        model.translator.translate_batch.assert_not_called()
    def test_expired_budget_cannot_start_a_new_model(self):
        _,parent,primary,_=self.fixture();translator=Mock(side_effect=AssertionError('expired'))
        self.assertIsNone(quality.refine(parent,primary,Mock(),translator,Mock(),time.time()-1))
    def test_duplicate_alternatives_cannot_create_multiple_back_translations(self):
        _,parent,primary,_=self.fixture();model=Mock();model.translate.return_value=[(parent['source'],False)]
        scores=dict(similarity=.95,forward_entailment=.95,reverse_entailment=.95,forward_contradiction=.01,reverse_contradiction=.01)
        models=Mock();models.score.return_value=scores
        with patch.object(quality,'alternatives',return_value=[('Descarga el archivo.',False)]*2):
            result=quality.refine(parent,primary,models,lambda:model,lambda value:('es',1),time.time()+60)
        self.assertEqual(len(result['proposals']),1);self.assertEqual(model.translate.call_count,1)
    def test_pipeline_roundtrip_exports_only_the_checked_candidate_and_immutable_original(self):
        corpus,parent,primary,result=self.fixture();rows={};audits={}
        for value in [parent,primary,result]:pipeline.merge(rows,audits,value)
        self.assertEqual(rows[parent['record_id']],parent)
        encoded=quality.PREFIX+base64.b64encode(json.dumps(result).encode()).decode()
        pipeline.read_lines(encoded,rows,audits)
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp).resolve();report=pipeline.export(corpus,rows,audits,root,1)
            pack=json.loads((root/'packages/es/sample-tool.json').read_text())
            self.assertEqual(pack['entries'][parent['key']]['translation'],'Descarga el archivo.')
            self.assertEqual(report['refined_adopted'],1);self.assertEqual(report['pending'],0)
            self.assertEqual(report['by_locale']['es']['usable'],1)
            self.assertFalse(pack['release_approved'])
    def test_quarantined_existing_audit_remains_pending_until_its_one_refinement(self):
        corpus,parent,primary,_=self.fixture();audits={quality.primary_key(parent):primary}
        with tempfile.TemporaryDirectory() as temp:
            report=pipeline.export(corpus,{parent['record_id']:parent},audits,Path(temp).resolve(),1)
            self.assertEqual(report['refinement_pending'],1);self.assertEqual(report['pending'],1)


if __name__=='__main__':unittest.main()
