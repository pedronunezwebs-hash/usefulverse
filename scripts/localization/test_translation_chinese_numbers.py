"""v22 decimal-only zh-CN audit. Chinese spellout/compact forms stay fail closed."""
import ast
import copy
import hashlib
import importlib.util
import json
from decimal import Decimal
from pathlib import Path
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def stable(v):
 if isinstance(v,ast.AST):return [type(v).__name__,[[f,stable(c)] for f,c in ast.iter_fields(v) if not(f=='type_params' and c==[])]]
 if isinstance(v,list):return [stable(x) for x in v]
 return v

class ChineseNumbersTest(unittest.TestCase):
 def valid(self,source,target):return all(pilot.policy_typed_data_checks(source,target,'en','zh-CN','context-v22').values())
 def test_decimal_values_with_chinese_adjacency(self):
  for source,target in [('Maximum 200,000.','最多200,000。'),('Maximum 200,000.','最多200000。'),
   ('Value 1,234,567.89.','数值1,234,567.89。'),('Value 0.125.','数值0.125。'),
   ('Value -2.25.','数值−2.25。'),('Value +2.25.','数值+2.25。'),
   ('Keep 30% and 45°.','保留30%和45°。'),('Keep 2 and 2.','保留2和2。'),
   ('Limit 25 MB.','限制25 MB。'),('Limit 25 MB.','限制25MB。'),('Use 10.5 units.','使用10.5单位。')]:
   with self.subTest(target=target):self.assertTrue(self.valid(source,target))
 def test_unsupported_or_malformed_quantities_fail_closed(self):
  for target in ['数值200.000。','数值20,000。','数值200,00。','数值20,00,000。','数值200 000。',
   '数值200\u00a0000。','数值200\u202f000。','数值200,000.5。','数值200000和200000。',
   '数值20万。','数值二十万。','数值200千。','数值2e5。','数值x200000。','数值２０００００。',
   '数值٢٠٠٠٠٠。','数值200000²。','数值＋200000。','数值–200000。','数值--200000。',
   '数值+ -200000。','数值负200000。','数值200000点0。','数值200000M。']:
   with self.subTest(target=target):self.assertFalse(self.valid('Value 200,000.',target))
  self.assertFalse(self.valid('Value 2.','数值−2。'))
  self.assertFalse(self.valid('Keep 2 and 2.','保留2。'))
  self.assertFalse(self.valid('No quantities.','数值²。'))
  self.assertFalse(self.valid('No quantities.','数值二十五。'))
  for numeral in ['廿','丗','卌','萬','億','貳']:
   with self.subTest(numeral=numeral):self.assertFalse(self.valid('No quantities.','数值'+numeral+'。'))
 def test_opaque_versions_dimensions_and_unit_damage(self):
  source='Use dxf-parser 1.1.2; 2D; (-1.5, 0) to (10, 0); 200,000; `v9.2 x999`; https://example.com/123; {count} {count}.'
  target='使用dxf-parser 1.1.2；2D；(-1.5, 0)至(10, 0)；200,000；`v9.2 x999`；https://example.com/123; {count} {count}。'
  self.assertTrue(self.valid(source,target))
  for old,new in [('dxf-parser','dxf-parzer'),('1.1.2','1.2.2'),('2D','3D'),('(-1.5, 0)','(1.5, 0)'),
   ('(10, 0)','(0, 10)'),('200,000','200.000'),('`v9.2 x999`','`v9.3 x999`'),('/123','/124'),('{count} {count}','{count}')]:
   with self.subTest(damage=old):self.assertFalse(self.valid(source,target.replace(old,new)))
  self.assertTrue(self.valid('Open ASCII .dxf files up to 25 MB.','打开ASCII .dxf文件，最大25MB。'))
  self.assertFalse(self.valid('Limit 25 MB.','限制25GB。'))
 def test_sentence_trace_rejects_swapped_values_and_preserves_raw(self):
  source='The first value is 10. The second value is 20.';outputs=['数值20。','数值10。'];raw=' '.join(outputs)
  self.assertTrue(self.valid(source,raw));traces=[]
  values=pilot.translate_complete_sentences_v22([source],lambda parts:[(v,False) for v in outputs],'en','zh-CN',traces)
  self.assertEqual(values,[(None,raw,False)])
  self.assertFalse(pilot.complete_sentence_evidence_valid_v22(traces[0],source,raw,'en','zh-CN'))
 def test_memory_damage_never_falls_back_or_repairs(self):
  policy='context-v22';source='Maximum 200,000.';unit={'key':'independent.memory','source':source,'source_hash':hashlib.sha256(source.encode()).hexdigest(),'context':'limits'}
  changed=copy.deepcopy(pilot.POLICIES[policy])
  for raw in ['最多200.000。','最多20万。']:
   changed['reviewed_memory'][unit['key']]={**unit,'translations':{'zh-CN':raw}}
   with patch.dict(pilot.POLICIES,{policy:changed}):
    values,traces,memory=pilot.forward_with_memory([unit],'zh-CN',policy,lambda *args:self.fail('No fallback'))
    self.assertEqual(values,[(None,raw,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[raw])
 def test_pinned_cldr_profile_and_unchanged_memory(self):
  directory=DATA/'numeric-sources/context-v22';manifest=json.loads((directory/'manifest.json').read_text())
  for row in manifest['files']:
   self.assertEqual(hashlib.sha256((directory/row['path']).read_bytes()).hexdigest(),row['sha256'])
   self.assertIn('/'+row.get('revision',manifest['cldr_json_revision'])+'/',row['url'])
  numbers=json.loads((directory/'zh-numbers.json').read_text())['main']['zh']['numbers']
  self.assertEqual(numbers['defaultNumberingSystem'],'latn')
  self.assertEqual(numbers['symbols-numberSystem-latn']['group'],',')
  self.assertEqual(numbers['symbols-numberSystem-latn']['decimal'],'.')
  self.assertEqual(numbers['decimalFormats-numberSystem-latn']['standard'],'#,##0.###')
  for key in ['entries','reviewed_memory']:self.assertEqual(pilot.POLICIES['context-v21'][key],pilot.POLICIES['context-v22'][key])
  self.assertEqual(sum(len(e['translations']) for e in pilot.POLICIES['context-v22']['reviewed_memory'].values()),263)
  self.assertIsNone(pilot.numeric_data('25 MB','zh-CN'))
  for policy in ['baseline','context-v16','context-v19','context-v20','context-v21']:
   self.assertFalse(all(pilot.policy_typed_data_checks('25 MB','25 MB','en','zh-CN',policy).values()))
 def test_profile_tampering_is_rejected(self):
  changed=copy.deepcopy(pilot.POLICIES['context-v22']);changed['numeric_profile']['manifest_sha256']='0'*64
  with patch.dict(pilot.POLICIES,{'context-v22':changed}),self.assertRaisesRegex(ValueError,'numeric profile'):
   self.valid('Limit 25 MB.','限制25MB。')
 def test_generated_round_trip_detects_changed_values(self):
  for integer in [0,1,12,999,1000,1234,999999,1000000,1234567,200000,999999999]:
   for sign in [-1,1]:
    for fraction in ['0.00','0.25','0.89']:
     value=sign*(Decimal(integer)+Decimal(fraction));en=format(value,',.2f');source='Value '+en+'.';target='数值'+en+'。'
     with self.subTest(value=str(value)):
      self.assertTrue(self.valid(source,target));self.assertTrue(all(pilot.policy_typed_data_checks(target,source,'zh-CN','en','context-v22').values()))
      self.assertFalse(self.valid(source,'数值'+format(value+1,',.2f')+'。'))
 def test_historical_policies_raw_flags_and_functions_are_frozen(self):
  proof=json.loads((DATA/'regression-v22-evidence.json').read_text())
  for policy,value in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),value)
  original=pilot.SEMANTIC_REGRESSIONS[:proof['fixture_prefix_count']];self.assertEqual(pilot.digest(original),proof['fixture_prefix_digest'])
  flags={}
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',original):
   for path in sorted((DATA/'checkpoints').rglob('*.jsonl')):
    for row in map(json.loads,path.read_text().splitlines()):
     if row.get('inference_policy','baseline') not in {'baseline',*proof['historical_policy_digests']}:continue
     pilot.validate_record(row);flags[row['record_id']]=pilot.record_flags(row)
  self.assertEqual(len(flags),proof['historical_records']);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name,value in proof['inference_function_ast_digests'].items():self.assertEqual(pilot.digest(stable(nodes[name])),value,name)

 def test_run_changes_only_the_explicit_v22_dispatch(self):
  from test_translation_indonesian_expanded_memory import historical_run_ast
  proof=json.loads((DATA/'regression-v22-evidence.json').read_text())
  run=next(n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef) and n.name=='run')
  self.assertEqual(pilot.digest(historical_run_ast(run)),proof['historical_run_ast_digest'])
  damaged=copy.deepcopy(run)
  call=next(n for n in ast.walk(damaged) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='translate_complete_sentences_v22')
  call.func.id='translate_complete_sentences_v19'
  with self.assertRaisesRegex(AssertionError,'Changed v22 dispatch'):historical_run_ast(damaged)
  damaged=copy.deepcopy(run);damaged.body.append(ast.Pass())
  self.assertNotEqual(pilot.digest(historical_run_ast(damaged)),proof['historical_run_ast_digest'])

if __name__=='__main__':unittest.main()
