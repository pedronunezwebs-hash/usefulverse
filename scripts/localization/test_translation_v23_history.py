"""The v23 opt-in path cannot change historical inputs, grammar, policies or flags."""
import ast
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
def stable(value):
 if isinstance(value,ast.AST):return [type(value).__name__,[[f,stable(c)] for f,c in ast.iter_fields(value) if not(f=='type_params' and c==[])]]
 if isinstance(value,list):return [stable(x) for x in value]
 return value
class V23HistoryTest(unittest.TestCase):
 def test_all14310_old_records_policies_and19_functions_are_unchanged(self):
  proof=json.loads((DATA/'regression-v23-evidence.json').read_text());prefix=pilot.SEMANTIC_REGRESSIONS[:proof['fixture_prefix_count']]
  self.assertEqual(pilot.digest(prefix),proof['fixture_prefix_digest']);flags={}
  for policy,wanted in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),wanted)
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',prefix):
   for path in sorted((DATA/'checkpoints').rglob('*.jsonl')):
    for row in map(json.loads,path.read_text().splitlines()):
     if row.get('inference_policy','baseline') not in {'baseline',*proof['historical_policy_digests']}:continue
     pilot.validate_record(row);flags[row['record_id']]=pilot.record_flags(row)
  self.assertEqual(len(flags),14310);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  self.assertEqual(len(proof['inference_function_ast_digests']),19)
  for name,wanted in proof['inference_function_ast_digests'].items():self.assertEqual(pilot.digest(stable(nodes[name])),wanted,name)
 def test_run_only_adds_exact_v23_route_and_bad_route_is_detected(self):
  from test_translation_indonesian_expanded_memory import strip_v23_dispatch
  proof=json.loads((DATA/'regression-v23-evidence.json').read_text());run=next(n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef) and n.name=='run')
  self.assertEqual(pilot.digest(stable(strip_v23_dispatch(run))),proof['run_ast_digest'])
  damaged=copy.deepcopy(run);call=next(n for n in ast.walk(damaged) if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='cached_prose_v23');call.args[1]=ast.Name(id='prose_translate',ctx=ast.Load())
  with self.assertRaisesRegex(AssertionError,'Changed v23 dispatch'):strip_v23_dispatch(damaged)

if __name__=='__main__':unittest.main()
