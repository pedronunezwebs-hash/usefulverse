"""Reporting-only audit for observed Russian data gaps, always gate-blocking.
The eight measured v30 inference/data files stay byte-identical. This module
never changes flags, typed data acceptance, model outputs or inference routing.
"""
import hashlib,json
from pathlib import Path
POLICY='context-v30'
def require(condition,message):
    if not condition:raise ValueError(message)
class PostReviewAudit:
    def __init__(self,route):self.route=route
    def __getattr__(self,name):return getattr(self.route,name)
    def require_observed_unit_gap(self,row,judgment,decision,gate):
        data=json.loads((self.data/'unproved-data-v30-full.json').read_text())
        require(data['approved_locales']==[]and data['native_review']is False,'Unproved audit cannot approve languages')
        matches=[x for x in data['rows']if x['record_id']==row['record_id']]
        require(len(matches)==1,'Only actual observed unit gaps are reportable')
        item=matches[0]
        require(all(row[k]==item[k]for k in ['inference_policy','key','locale','source_hash'])and item['translation_hash']==hashlib.sha256(row['translation'].encode()).hexdigest(),'Stale unproved unit evidence')
        failed=sorted(k for k,v in self.ns['typed_record_evidence'](row)['forward'].items()if not v)
        require(failed==item['failed_forward_checks']==['unit_symbols']and item['blocks_gate']is True,'No other broken datum can use the localized-unit audit')
        require(decision['blocks_gate']is True and gate.get('passed')is False and judgment.get('data_contract_unproved')is True,'Unproved unit data must remain blocked')

    def audit(self, review, records, check_coverage=True):
        if review.get('inference_policy') != POLICY: return self.legacy_audit(review, records, check_coverage)
        require(review['native_review'] is False and review['approved_locales'] == [] and len(review['rows']) == review['expected_rows'], 'Invalid v30 review scope')
        seen, expected = {}, {}
        for judgment in review['rows']:
            require(judgment['record_ids'] and set(judgment['scores']) == {'meaning', 'numbers_negations', 'naturalness'} and all(type(v) is int and 0 <= v <= 3 for v in judgment['scores'].values()), 'Invalid v30 rubric')
            for identity in judgment['record_ids']:
                row = records[identity]
                require(identity not in seen and row['inference_policy'] == POLICY and row['locale'] == 'ru' and all(judgment[k] == row[k] for k in ['key', 'locale', 'source_hash']) and judgment['translation_hash'] == hashlib.sha256(row['translation'].encode()).hexdigest(), 'Stale v30 judgment')
                seen[identity] = judgment
                flags = {f for f, value in self.flags(row).items() if value}
                if flags: expected[identity] = (row, flags)
        entries = {e['record_id']: e for e in review['warning_reconciliation']}
        require(len(entries) == len(review['warning_reconciliation']) and set(entries) == set(expected), 'Incomplete v30 warnings')
        gate = review.get('reference_gate', review.get('full_gate', {})).get('ru', {})
        for identity, (row, flags) in expected.items():
            entry = entries[identity]
            require(set(entry['warnings']) == flags and all(entry[k + '_hash'] == hashlib.sha256(row[k].encode()).hexdigest() for k in ['translation', 'back_translation']), 'Stale v30 warning evidence')
            for flag, decision in entry['warnings'].items():
                require(decision['note'].strip() and type(decision['blocks_gate']) is bool, 'Unexplained v30 warning')
                disposition = decision['disposition']
                require(disposition in {'forward-defect', 'back-defect', 'reviewed-signal', 'unproved-data'}, 'Unknown warning decision')
                if flag == 'known_semantic_errors': require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Cannot dismiss v30 forward defect')
                elif flag == 'known_back_semantic_errors': require(disposition == 'back-defect' and not decision['blocks_gate'], 'Back defect cannot grade the forward text')
                elif flag.startswith('back_'): require(disposition in {'back-defect', 'reviewed-signal'} and not decision['blocks_gate'], 'Explain v30 back warning separately')
                elif flag in {'length_ratio', 'wrong_script'}: require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Weak heuristic is not a rubric')
                elif flag == 'unit_symbols' and disposition == 'unproved-data':
                    self.require_observed_unit_gap(row, seen[identity], decision, gate)
                elif disposition == 'unproved-data': require(flag in {'forward_typed_data', 'forward_sentence_evidence', 'marker_restore', 'protected_tokens'} and decision['blocks_gate'] and gate.get('passed') is False and seen[identity].get('data_contract_unproved') is True, 'Unproved data must block without fabricated linguistic scores')
                elif flag == 'protected_tokens' and all(self.ns['typed_record_evidence'](row)['forward'].values()): require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Proved quantity spelling only')
                else: require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Broken forward contract cannot pass')
                require(not (decision['blocks_gate'] and gate.get('passed')), 'Blocking warning contradicts gate')
        if check_coverage and review.get('requires_complete_model_warning_coverage'): self.ns['audit_complete_model_warning_coverage'](review, records)
        return len(expected)

def install(namespace):
    old=PostReviewAudit(namespace['RUSSIAN_V30']).audit
    if 'RUSSIAN_V31' not in namespace:namespace['audit_review_warnings']=old;return
    def combined(review,records,check_coverage=True):
        if review.get('inference_policy')=='context-v31':return namespace['RUSSIAN_V31'].audit(review,records,check_coverage)
        return old(review,records,check_coverage)
    namespace['audit_review_warnings']=combined
