"""Preflight all254 actual model sources/traces and477 exact memory targets."""
import ast,copy,importlib.util,json,unittest
from pathlib import Path
from unittest.mock import patch
from test_translation_v25_history import stable
from test_translation_indonesian_expanded_memory import strip_v27_dispatch
sp=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(sp);sp.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class PreflightV27Test(unittest.TestCase):
 def test_all254_actual_model_inputs_fragments_traces_and477_memory_targets(self):
  rows=[r for v in [25,26]for r in map(json.loads,(DATA/f'checkpoints/context-v{v}/madlad.jsonl').read_text().splitlines())if r['candidate']=='model'];self.assertEqual(len(rows),254);contracts=pilot.v27_quantity_contracts();checked=0
  for row in rows:
   with self.subTest(key=row['key'],policy=row['inference_policy']):
    for source in [row['source'],pilot.translation_input(row,'context-v27')]:
     for text in [source,*[p[1]for p in pilot.complete_sentence_parts(source)]]:self.assertIsNotNone(pilot.numeric_data_zh_v27(text,'en',contracts));checked+=1
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],row['translation'],'en','zh-CN','context-v27').values()))
    if row['forward_segments']:self.assertTrue(pilot.complete_sentence_evidence_valid_v27(row['forward_segments'],row['model_input'],row['raw_translation'],'en','zh-CN'))
    def forbidden(*args):raise AssertionError('Known214 corpus must not request any forward model inference')
    values,traces,memory=pilot.forward_with_memory([row],'zh-CN','context-v27',forbidden);self.assertIsNotNone(values[0][0]);self.assertTrue(memory[0]);self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],values[0][0],'en','zh-CN','context-v27').values()))
  self.assertGreaterEqual(checked,1164)
  memories=pilot.POLICIES['context-v27']['reviewed_memory'];self.assertEqual(sum(len(x['translations'])for x in memories.values()),477)
  def preserved(before,after):
   if isinstance(before,dict):return isinstance(after,dict)and all(k in after and preserved(v,after[k])for k,v in before.items())
   return before==after
  for key,item in pilot.POLICIES['context-v26']['reviewed_memory'].items():self.assertTrue(preserved(item,memories[key]),key)
  for key,item in memories.items():
   for locale,text in item['translations'].items():
    checks=pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v27');self.assertEqual(pilot.semantic_issues(key,item['source_hash'],text,locale),[],(key,locale))
    with self.subTest(key=key,locale=locale):
     if locale=='zh-CN':self.assertTrue(all(checks.values()))
     else:self.assertEqual(checks,pilot.policy_typed_data_checks(item['source'],text,'en',locale,'context-v26'))
  for key in memories:
   item=memories[key]
   if 'zh-CN'not in item['translations']:continue
   for field in ['source','source_hash','context']:
    changed={k:item[k]for k in ['source','source_hash','context']};changed['key']=key;changed[field]+='different'
    with self.assertRaisesRegex(ValueError,'Stale reviewed memory'):pilot.reviewed_memory(changed,'zh-CN','context-v27')
 def test_original15110_flags1146_fixtures_and78_functions_remain_identical(self):
  proof=json.loads((DATA/'regression-v27-evidence.json').read_text());self.assertEqual(len(proof['function_ast_digests']),78);self.assertEqual(pilot.digest(pilot.SEMANTIC_REGRESSIONS[:1146]),proof['fixture_prefix_digest'])
  for policy,want in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),want,policy)
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',pilot.SEMANTIC_REGRESSIONS[:1146]):
   flags={r['record_id']:pilot.record_flags(r)for f in sorted((DATA/'checkpoints').rglob('*.jsonl'))for r in map(json.loads,f.read_text().splitlines())if r.get('inference_policy','baseline')in proof['record_scope_policies']}
  self.assertEqual(len(flags),15110);self.assertEqual(pilot.digest(flags),proof['record_flags_digest']);nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name,want in proof['function_ast_digests'].items():self.assertEqual(pilot.digest(stable(strip_v27_dispatch(nodes[name]))),want,name)
 def test_optin_route_rejects_changed_cache_owner_and_extra_behavior(self):
  nodes={n.name:n for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name in ['run','record_flags','policy_typed_data_checks']:strip_v27_dispatch(nodes[name])
  changed=copy.deepcopy(nodes['run']);call=next(n for n in ast.walk(changed)if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='cached_prose_v27');call.args[1]=ast.Name(id='prose_translate',ctx=ast.Load())
  with self.assertRaisesRegex(AssertionError,'Changed v27 dispatch'):strip_v27_dispatch(changed)
if __name__=='__main__':unittest.main()
