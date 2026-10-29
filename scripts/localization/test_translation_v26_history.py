"""Every original record/policy/function survives the narrow independent v26 route."""
import ast,copy,importlib.util,json,unittest
from pathlib import Path
from unittest.mock import patch
from test_translation_v25_history import stable
from test_translation_indonesian_expanded_memory import strip_v26_dispatch,strip_v27_dispatch
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class V26HistoryTest(unittest.TestCase):
 def test_original15043_flags1146_fixtures_policies_and71_functions(self):
  proof=json.loads((DATA/'regression-v26-evidence.json').read_text());self.assertEqual(len(proof['function_ast_digests']),71);prefix=pilot.SEMANTIC_REGRESSIONS[:1146];self.assertEqual(pilot.digest(prefix),proof['fixture_prefix_digest'])
  for policy,want in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),want,policy)
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',prefix):
   flags={r['record_id']:pilot.record_flags(r)for f in sorted((DATA/'checkpoints').rglob('*.jsonl'))for r in map(json.loads,f.read_text().splitlines())if r.get('inference_policy','baseline')in proof['record_scope_policies']}
  self.assertEqual(len(flags),15043);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name,want in proof['function_ast_digests'].items():self.assertEqual(pilot.digest(stable(strip_v26_dispatch(nodes[name]))),want,name)
 def test_optin_guards_reject_modified_owner_or_extra_policy_behavior(self):
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name in ['run','policy_typed_data_checks','record_flags']:strip_v26_dispatch(nodes[name])
  changed=copy.deepcopy(nodes['run']);call=next(n for n in ast.walk(changed)if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='cached_prose_v26');call.args[1]=ast.Name(id='prose_translate',ctx=ast.Load())
  with self.assertRaisesRegex(AssertionError,'Changed v26 dispatch'):strip_v26_dispatch(changed)
  changed=copy.deepcopy(nodes['policy_typed_data_checks']);call=next(n for n in ast.walk(changed)if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='chinese_typed_data_checks_v26');call.func.id='typed_data_checks'
  with self.assertRaisesRegex(AssertionError,'Changed v26 dispatch'):strip_v26_dispatch(changed)
 def test_all76_measured_functions_and_auditor_are_intact_except_negative_hook(self):
  proof=json.loads((DATA/'regression-v26-evidence.json').read_text());nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)};self.assertEqual(len(proof['measurement_function_ast_digests_except_auditor']),76)
  for name,want in proof['measurement_function_ast_digests_except_auditor'].items():self.assertEqual(pilot.digest(stable(strip_v27_dispatch(nodes[name]))),want,name)
  self.assertEqual(pilot.digest(stable(strip_v26_dispatch(nodes['audit_review_warnings']))),proof['measured_auditor_ast_digest'])
  damaged=copy.deepcopy(nodes['audit_review_warnings']);call=next(n for n in ast.walk(damaged)if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='chinese_quantity_unproved_v26');call.args[0]=ast.Constant(value=True)
  with self.assertRaisesRegex(AssertionError,'Changed v26 negative audit hook'):strip_v26_dispatch(damaged)
if __name__=='__main__':unittest.main()
