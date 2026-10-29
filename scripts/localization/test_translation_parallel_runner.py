"""Parallel validation must execute every discovered case and preserve failures/skips."""
import importlib.util,json,os,subprocess,sys,tempfile,unittest
from pathlib import Path
HERE=Path(__file__).parent;SCRIPT=HERE/'run-translation-tests.py'
def module():
 spec=importlib.util.spec_from_file_location('parallel_runner',SCRIPT);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
class ParallelRunnerTest(unittest.TestCase):
 def temp(self):return tempfile.TemporaryDirectory(dir=os.environ.get('RUNNER_TEMP')or os.environ.get('TMPDIR'))
 def execute(self,root,jobs):
  return subprocess.run([sys.executable,'-B',str(SCRIPT),'--test-dir',str(root),'--pattern','case*.py','--scratch-parent',str(root),'--jobs',str(jobs)],capture_output=True,text=True)
 def summary(self,result):
  lines=[s.split('UVTEST_TOTAL ',1)[1]for s in result.stdout.splitlines()if'UVTEST_TOTAL 'in s];self.assertEqual(len(lines),1,result.stderr[-1000:]);return json.loads(lines[0])
 def test_inventory_rejects_missing_duplicate_unknown_and_count_mismatch(self):
  m=module();good=[dict(ids=['a','b'],tests=2,failures=0,errors=0,skipped=0)]
  self.assertTrue(m.validate_results(['a','b'],good))
  for rows in [[dict(good[0],ids=['a'])],[dict(good[0],ids=['a','a'])],[dict(good[0],ids=['a','c'])],[dict(good[0],tests=1)]]:
   with self.subTest(rows=rows),self.assertRaises(ValueError):m.validate_results(['a','b'],rows)
 def test_parallel_toy_suite_matches_serial_pass_failure_error_and_skip(self):
  with self.temp()as tmp:
   root=Path(tmp);(root/'case_mixed.py').write_text("import unittest\nclass Demo(unittest.TestCase):\n def test_pass(self): self.assertEqual(2+2,4)\n def test_fail(self): self.fail('intentional')\n def test_error(self): raise RuntimeError('intentional')\n")
   (root/'case_skipped.py').write_text("import unittest\nclass Extra(unittest.TestCase):\n @unittest.skip('intentional')\n def test_skip(self): pass\n")
   serial=self.execute(root,1);parallel=self.execute(root,2);a,b=self.summary(serial),self.summary(parallel)
   self.assertEqual(serial.returncode,1);self.assertEqual(parallel.returncode,1)
   for key in ['tests','failures','errors','skipped','inventory_sha256']:self.assertEqual(a[key],b[key])
   self.assertEqual((b['tests'],b['failures'],b['errors'],b['skipped']),(4,1,1,1));self.assertEqual(a['workers'],1);self.assertEqual(b['workers'],2)
 def test_success_executes_all_cases_and_removes_owned_scratch(self):
  with self.temp()as tmp:
   root=Path(tmp);(root/'case_good.py').write_text("import unittest\nclass Demo(unittest.TestCase):\n def test_first(self): self.assertTrue(True)\n def test_second(self): self.assertEqual('x','x')\n")
   result=self.execute(root,2);summary=self.summary(result);self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(summary['tests'],2);self.assertEqual(summary['errors']+summary['failures'],0);self.assertEqual(list(root.glob('usefulverse-tests-*')),[])
 def test_more_than_four_workers_is_rejected(self):
  with self.temp()as tmp:
   result=self.execute(Path(tmp),5);self.assertNotEqual(result.returncode,0);self.assertIn('1..4',result.stderr)
if __name__=='__main__':unittest.main()
