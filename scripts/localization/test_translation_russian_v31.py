"""Independent source-bound Russian corpus; no inferred or native approval."""
import importlib.util,json,hashlib,copy,unittest
from pathlib import Path
from unittest.mock import patch
H=Path(__file__).parent
sp=importlib.util.spec_from_file_location('v31',H/('translation-pilot-v31.py'if(H/'translation-pilot-v31.py').exists()else'translation-pilot-v30.py'));entry=importlib.util.module_from_spec(sp);sp.loader.exec_module(entry);pilot=entry.pilot
DATA=pilot.ROOT/'docs/quality/translation-pilot';POLICY='context-v31'
class RussianV31Test(unittest.TestCase):
 def test_all24_pending_targets_are_repaired_or_notation_clarified(self):
  cases=json.loads((DATA/'corrections-v31.json').read_text())['cases'];self.assertEqual(len(cases),24)
  units=pilot.RUSSIAN_V30.contracts()['units']
  for case in cases:
   with self.subTest(key=case['key']):self.assertEqual(pilot.reviewed_memory(units[case['key']],'ru',POLICY)if POLICY in pilot.POLICIES else None,case['translation'])
 def test_source_context_provenance_all214_and731_old_targets_are_preserved(self):
  self.assertTrue(POLICY in pilot.POLICIES);r=pilot.RUSSIAN_V31;c=r.contracts();self.assertEqual(len(c['imports']),214);self.assertEqual(len(c['references']),40)
  self.assertEqual(sum(len(x['translations'])for x in pilot.POLICIES[POLICY]['reviewed_memory'].values()),905)
  for key,item in pilot.POLICIES['context-v30']['reviewed_memory'].items():
   for locale,target in item['translations'].items():self.assertEqual(pilot.POLICIES[POLICY]['reviewed_memory'][key]['translations'][locale],target)
  for field,value in [('source_hash','stale'),('context','wrong')]:
   with self.assertRaises(ValueError):pilot.reviewed_memory({**c['units']['voice-changer.intro'],field:value},'ru',POLICY)
 def test_every_whole_text_and_fragment_has_proved_data(self):
  self.assertTrue(POLICY in pilot.POLICIES);r=pilot.RUSSIAN_V31;self.assertTrue(r.preflight_memory());out=r.preflight_fragments();self.assertEqual(out['whole_texts'],642);self.assertEqual(out['memory_targets'],214)
 def test_frozen23_runtime_and_all_old_checkpoint_bytes_are_identical(self):
  proof=json.loads((DATA/'v31-baseline.json').read_text())
  for name,value in proof['old_runtime_sha256'].items():self.assertEqual(hashlib.sha256((pilot.ROOT/name).read_bytes()).hexdigest(),value)
  for name,value in proof['old_checkpoint_sha256'].items():self.assertEqual(hashlib.sha256((DATA/name).read_bytes()).hexdigest(),value)

 def test_warm_contracts_reject_changed_import_review_and_in_memory_target(self):
  r=pilot.RUSSIAN_V31;r.contracts();cls=type(DATA);native=cls.read_bytes
  for name in ['reviewed-memory-v31-import.json','review-context-v30-full.json','numeric-sources/context-v31/ru-rbnf.xml']:
   file=DATA/name
   def changed(path):
    value=native(path);return value+b' 'if path==file else value
   with self.subTest(name=name),patch.object(cls,'read_bytes',changed),self.assertRaises(ValueError):r.contracts()
  bad=copy.deepcopy(pilot.POLICIES[POLICY]);bad['reviewed_memory']['voice-changer.intro']['translations']['ru']='wrong'
  with patch.dict(pilot.POLICIES,{POLICY:bad}),self.assertRaises(ValueError):r.contracts()
 def test_full_requires_new_reference_gate_and_mass_or_wrong_locale_never_starts_model(self):
  from types import SimpleNamespace
  r=pilot.RUSSIAN_V31
  for locale in ['', 'ur','ru,ur']:
   with patch.object(pilot,'actions_only'),patch.object(pilot.subprocess,'run',side_effect=AssertionError('model started')),self.assertRaises(ValueError):r.run(SimpleNamespace(policy=POLICY,locales=locale,scope='full'))
  original=pilot.policy_digest
  with patch.object(pilot,'policy_digest',side_effect=lambda name:'stale'if name==POLICY else original(name)),self.assertRaises(ValueError):r.full_allowed()
