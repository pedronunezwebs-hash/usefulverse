"""Split only the fixture-free generic cases, keeping all IDs and fixture lifetimes."""
import importlib.util,json,os,subprocess,sys,tempfile,unittest
from pathlib import Path
HERE=Path(__file__).parent;SCRIPT=HERE/'run-translation-tests.py'
sp=importlib.util.spec_from_file_location('balanced_runner',SCRIPT);runner=importlib.util.module_from_spec(sp);sp.loader.exec_module(runner)
class BalancedRunnerTest(unittest.TestCase):
 def test_fixture_free_generic_cases_share_four_workers_without_dropping_ids(self):
  with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR'))as temp:
   root=Path(temp);(root/'test_translation_pilot.py').write_text('import unittest\nclass Demo(unittest.TestCase):\n'+''.join(f' def test_{i}(self): self.assertTrue(True)\n'for i in range(8)))
   ids=[f'test_translation_pilot.Demo.test_{i}'for i in range(8)];buckets=runner.partition(ids,4,root)
   self.assertEqual(sorted(x for b in buckets for x in b),ids);self.assertEqual([len(b)for b in buckets],[2,2,2,2])
 def test_module_class_async_or_inherited_fixtures_keep_module_together(self):
  cases=['def setUpModule(): pass\nclass Demo(unittest.TestCase):\n pass\n','class Demo(unittest.TestCase):\n @classmethod\n def setUpClass(cls): pass\n','class Demo(unittest.TestCase):\n async def asyncSetUp(self): pass\n','class Demo(CustomBase):\n pass\n']
  with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR'))as temp:
   root=Path(temp)
   for source in cases:
    (root/'test_translation_pilot.py').write_text('import unittest\n'+source);ids=['test_translation_pilot.Demo.test_a','test_translation_pilot.Demo.test_b'];buckets=runner.partition(ids,4,root)
    with self.subTest(source=source):self.assertEqual(sum(bool(b)for b in buckets),1);self.assertEqual(sorted(x for b in buckets for x in b),ids)
 def test_real_parallel_processes_cover_all_stateless_generic_cases(self):
  with tempfile.TemporaryDirectory(dir=os.environ.get('TMPDIR'))as temp:
   root=Path(temp);(root/'test_translation_pilot.py').write_text('import unittest\nclass Demo(unittest.TestCase):\n'+''.join(f' def test_{i}(self): self.assertEqual(1,1)\n'for i in range(8)))
   result=subprocess.run([sys.executable,'-B',str(SCRIPT),'--test-dir',str(root),'--jobs','4','--scratch-parent',str(root)],capture_output=True,text=True);self.assertEqual(result.returncode,0,result.stderr);totals=[json.loads(s.split('UVTEST_TOTAL ',1)[1])for s in result.stdout.splitlines()if s.startswith('UVTEST_TOTAL ')];self.assertEqual(len(totals),1);self.assertEqual(totals[0]['tests'],8);self.assertEqual(totals[0]['workers'],4);self.assertEqual(totals[0]['failures']+totals[0]['errors'],0);self.assertEqual(list(root.glob('usefulverse-tests-*')),[])
if __name__=='__main__':unittest.main()
