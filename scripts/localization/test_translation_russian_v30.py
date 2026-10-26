"""Russian contracts are opt-in; old15 measured files and691 targets stay exact."""
import importlib.util,json,hashlib,copy,unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
HERE=Path(__file__).parent;ENTRY=HERE/'translation-pilot-v30.py'
sp=importlib.util.spec_from_file_location('entry30',ENTRY if ENTRY.exists()else HERE/'translation-pilot-v29.py');entry=importlib.util.module_from_spec(sp);sp.loader.exec_module(entry);pilot=entry.pilot
DATA=pilot.ROOT/'docs/quality/translation-pilot';POLICY='context-v30'
class RussianV30Test(unittest.TestCase):
 def route(self):self.assertIn(POLICY,list(pilot.POLICIES));return pilot.RUSSIAN_V30
 def test_forty_source_bound_memories_and691_inherited_targets(self):
  r=self.route();c=r.contracts();self.assertEqual(len(c['imports']),40);self.assertEqual(len(c['units']),214);self.assertEqual(sum(len(x['translations'])for x in pilot.POLICIES[POLICY]['reviewed_memory'].values()),731)
  for key,value in pilot.POLICIES['context-v29']['reviewed_memory'].items():
   for locale,target in value['translations'].items():self.assertEqual(pilot.POLICIES[POLICY]['reviewed_memory'][key]['translations'][locale],target)
  for key,text in {'dxf-viewer.fields.resetView':'Вписать чертёж','voice-changer.fields.clear':'Очистить аудио','voice-changer.fields.preview':'Прослушать эффект'}.items():self.assertEqual(pilot.reviewed_memory(c['units'][key],'ru',POLICY),text)
 def test_all_sources_controlled_inputs_memory_and_fragments_are_proved(self):
  r=self.route();self.assertTrue(r.preflight_memory());proof=r.preflight_fragments();self.assertEqual(proof['source_units'],214);self.assertEqual(proof['memory_targets'],40);self.assertGreaterEqual(proof['fragments'],468)
 def test_russian_cldr_values_inflections_and_units_reject_wrong_data(self):
  r=self.route()
  for source,target in [('Enter four valid coordinates.','Введите четыре действительных координаты.'),('one rectangle covers six squares','одного прямоугольника на шесть квадратов'),('Maximum 25 MB and 30 seconds.','Не более 25 МБ и 30 секунд.'),('2.5 units','2,5 единицы'),('200,000 records','200 000 записей')]:
   with self.subTest(target=target):self.assertTrue(all(r.checks(source,target,'en','ru',POLICY).values()))
  for target in ['Не более 26 МБ и 30 секунд.','Не более 25 МВ и 30 секунд.','Не более 25 МБ и 31 секунд.']:self.assertFalse(all(r.checks('Maximum 25 MB and 30 seconds.',target,'en','ru',POLICY).values()))
  self.assertFalse(all(r.checks('one rectangle covers six squares','два прямоугольника на шесть квадратов','en','ru',POLICY).values()))
  for text in ['1e3','1/2','½','١','двадцать один','полтора','одиннадцатый','1 00','1 00 000','(٠,٠)','сорок']:
   with self.subTest(text=text):self.assertIsNone(r.numeric(text,'ru'))
  self.assertIsNone(r.numeric('(٠,٠)','en'))
 def test_known_memory_never_repairs_source_context_or_target_mutations(self):
  r=self.route();unit=r.contracts()['units']['voice-changer.fields.clear']
  for field,value in [('source_hash','stale'),('context','different')]:
   with self.subTest(field=field),self.assertRaisesRegex(ValueError,'Stale reviewed memory'):pilot.reviewed_memory({**unit,field:value},'ru',POLICY)
  with self.assertRaises(TypeError):r.contracts()['lexicon']['один']=99
 def test_warm_contracts_reject_changed_primary_review_and_import_bytes(self):
  r=self.route();self.assertTrue(r.contracts());cls=type(DATA);original=cls.read_bytes
  for file in ['numeric-sources/context-v30/ru-numbers.json','reviewed-memory-v30-import.json','review-batch1-ru-madlad.json']:
   path=DATA/file
   def changed(p):
    data=original(p);return data+b' 'if p==path else data
   with self.subTest(file=file),patch.object(cls,'read_bytes',changed),self.assertRaises(ValueError):r.contracts()
  self.assertTrue(r.contracts())
 def test_no_full_or_wrong_locale_can_start_a_model_without_reference_gate(self):
  r=self.route()
  original=pilot.policy_digest
  for locale in ['', 'ur', 'ru,ur','ru']:
   args=SimpleNamespace(policy=POLICY,locales=locale,scope='full')
   with self.subTest(locale=locale),patch.object(pilot,'policy_digest',side_effect=lambda name:'stale-reference-gate'if name==POLICY else original(name)),patch.object(pilot,'actions_only'),patch.object(pilot.subprocess,'run',side_effect=AssertionError('model must not start')),self.assertRaises(ValueError):r.run(args)
 def test_old_fifteen_runtime_files_and_all_checkpoints_are_unchanged(self):
  self.route();proof=json.loads((DATA/'balanced-test-preflight-v30.json').read_text())
  for name,value in proof['frozen_runtime_sha256'].items():self.assertEqual(hashlib.sha256((pilot.ROOT/name).read_bytes()).hexdigest(),value)
  for name,value in proof['historical_checkpoint_sha256'].items():self.assertEqual(hashlib.sha256((DATA/name).read_bytes()).hexdigest(),value)
  self.assertEqual(hashlib.sha256((HERE/'pilot-semantic-regressions.json').read_bytes()).hexdigest(),proof['historical_fixture_sha256'])
if __name__=='__main__':unittest.main()
