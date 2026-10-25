"""Every historical function, policy and original flag survives the new opt-in route."""
import ast,copy,importlib.util,json,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def stable(x):
 if isinstance(x,ast.AST):return [type(x).__name__,[[f,stable(v)]for f,v in ast.iter_fields(x)if not(f=='type_params'and v==[])]]
 if isinstance(x,list):return [stable(v)for v in x]
 if isinstance(x,bytes):return ['bytes',x.hex()]
 return x
class V25HistoryTest(unittest.TestCase):
 def test_all14710_original_flags1120_fixtures_and59_functions_are_preserved(self):
  proof=json.loads((DATA/'regression-v25-evidence.json').read_text());prefix=pilot.SEMANTIC_REGRESSIONS[:1120];self.assertEqual(pilot.digest(prefix),proof['fixture_prefix_digest']);self.assertEqual(len(proof['function_ast_digests']),59)
  for policy,want in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),want)
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',prefix):
   flags={r['record_id']:pilot.record_flags(r)for f in sorted((DATA/'checkpoints').rglob('*.jsonl'))for r in map(json.loads,f.read_text().splitlines())if r.get('inference_policy','baseline')in set(proof['historical_policy_digests'])|{'baseline'}}
  self.assertEqual(len(flags),14710);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name,want in proof['function_ast_digests'].items():self.assertEqual(pilot.digest(stable(nodes[name])),want,name)
 def test_measured_functions_remain_unchanged_after_negative_audit(self):
  proof=json.loads((DATA/'regression-v25-evidence.json').read_text());nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  self.assertEqual(len(proof['measurement_function_ast_digests_except_auditor']),69)
  from test_translation_indonesian_expanded_memory import strip_v26_dispatch
  for name,want in proof['measurement_function_ast_digests_except_auditor'].items():self.assertEqual(pilot.digest(stable(strip_v26_dispatch(nodes[name]))),want,name)
 def test_three_dispatchers_only_add_the_exact_version25_route(self):
  from test_translation_indonesian_expanded_memory import strip_v25_dispatch,strip_v26_dispatch
  proof=json.loads((DATA/'regression-v25-evidence.json').read_text());nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  self.assertEqual(stable(strip_v25_dispatch(nodes['run'])),proof['dispatcher_asts']['run'])
  for key in ['record_flags','policy_typed_data_checks']:
   node=strip_v26_dispatch(nodes[key]);matches=[n for n in node.body if isinstance(n,ast.If)and any(isinstance(c,ast.Constant)and c.value=='context-v25'for c in ast.walk(n.test))];self.assertEqual(len(matches),1);self.assertEqual(pilot.digest(stable(matches[0])),proof['opt_in_branch_digests'][key]);node.body.remove(matches[0]);self.assertEqual(stable(node),proof['dispatcher_asts'][key])
  audit=copy.deepcopy(nodes['audit_review_warnings']);hook=next(n for n in ast.walk(audit)if isinstance(n,ast.For)and isinstance(n.target,ast.Name)and n.target.id=='withdrawal')
  expected=ast.parse('historical_forward_withdrawals(review, records) + historical_legacy_forward_withdrawal_v25(review, records)',mode='eval').body
  self.assertEqual(stable(hook.iter),stable(expected));hook.iter=hook.iter.left
  quantity_hook=next(n for n in ast.walk(audit)if isinstance(n,ast.BoolOp)and any(isinstance(v,ast.Call)and isinstance(v.func,ast.Name)and v.func.id=='chinese_quantity_unproved_v25'for v in n.values))
  self.assertEqual(stable(quantity_hook.values[-1]),stable(ast.parse('chinese_quantity_unproved_v25(row)',mode='eval').body));quantity_hook.values.pop()
  self.assertEqual(pilot.digest(stable(audit)),proof['audit_function_ast_digest_before_hook'])
  damaged=copy.deepcopy(nodes['run']);call=next(n for n in ast.walk(damaged)if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='cached_prose_v25');call.args[1]=ast.Name(id='prose_translate',ctx=ast.Load())
  with self.assertRaisesRegex(AssertionError,'Changed v25 dispatch'):strip_v25_dispatch(damaged)
if __name__=='__main__':unittest.main()
