"""Memoization preserves exact parser results and invalidates before reuse."""
import importlib.util,json,tempfile,unittest,copy,os
from pathlib import Path
from unittest.mock import patch
HERE=Path(__file__).parent
class EnglishMemoV31Test(unittest.TestCase):
 def load(self):
  file=HERE/'pilot-english-memo-v31.py';self.assertTrue(file.exists(),'Missing guarded English memo')
  sp=importlib.util.spec_from_file_location('memo31',file);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m);return m
 def test_cache_exact_results_and_invalidate_files_functions_policies_and_root(self):
  m=self.load()
  with tempfile.TemporaryDirectory()as tmp:
   root=Path(tmp);folder=root/'docs/quality/translation-pilot';folder.mkdir(parents=True);file=folder/'input.txt';file.write_text('first')
   class Frozen(dict):pass
   ns=dict(ROOT=root,Path=Path,POLICIES={'p':Frozen()},freeze_policy=lambda x:Frozen(x));calls=[]
   def original(text,locale,opposite=None):calls.append((text,locale));return {'value':[file.read_text(),text,locale]}
   memo=m.EnglishMemo(ns,original,limit=2)
   first=memo('one','en');first['value'][0]='mutated';self.assertEqual(memo('one','en')['value'][0],'first');self.assertEqual(len(calls),1)
   stamp=file.stat();file.write_text('other');os.utime(file,ns=(stamp.st_atime_ns,stamp.st_mtime_ns));self.assertEqual(memo('one','en')['value'][0],'other');self.assertEqual(len(calls),2)
   ns['POLICIES']['p']=Frozen(changed=True);memo('one','en');self.assertEqual(len(calls),3)
   ns['helper']=lambda:None;memo('one','en');self.assertEqual(len(calls),4)
   native=Path.read_bytes
   with patch.object(Path,'read_bytes',lambda p:native(p)):
    memo('one','en');self.assertEqual(len(calls),5)
   memo('two','en');memo('three','en');self.assertLessEqual(len(memo.cache),2)
   memo('one','ru');memo('one','ru');self.assertEqual(calls[-2:],[('one','ru'),('one','ru')])
 def test_real_parser_rejects_mutations_after_warming_and_preserves_frozen_functions(self):
  m=self.load();sp=importlib.util.spec_from_file_location('base30',HERE/'translation-pilot-v30.py');e=importlib.util.module_from_spec(sp);sp.loader.exec_module(e);p=e.pilot;original=p.BENGALI_V29.numeric;memo=m.EnglishMemo(vars(p),original)
  for text in ['Value 25 MB.','Value 26 MB.','(0, 0) to (10, 0).','(10, 0) to (0, 0).','١','1e3','1/2','one','Once loaded, continue.']:
   with self.subTest(text=text):self.assertEqual(memo(text,'en'),original(text,'en'));self.assertEqual(memo(text,'en'),original(text,'en'))
  self.assertIsNone(memo('١','en'));self.assertNotEqual(memo('Value 25 MB.','en'),memo('Value 26 MB.','en'))
