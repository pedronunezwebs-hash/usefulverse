"""In-run exact-text reuse cannot alter data, directions, context inputs or failure handling."""
import contextlib
import importlib.util
import io
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'))
pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)

class RuntimeCacheTest(unittest.TestCase):
 def setUp(self):
  self.logs=io.StringIO();self.capture=contextlib.redirect_stdout(self.logs);self.capture.__enter__();self.addCleanup(self.capture.__exit__,None,None,None)
 def test_batch_duplicates_keep_order_and_every_output(self):
  calls=[]
  def model(texts):calls.append(texts);return [('译:'+s,False) for s in texts]
  cached=pilot.cached_prose_v23(model,model,'en','zh-CN')
  self.assertEqual(cached(['a','b','a']),[('译:a',False),('译:b',False),('译:a',False)])
  self.assertEqual(calls,[['a','b']]);self.assertIn('UVPILOT_CACHE',self.logs.getvalue())
 def test_reuse_across_calls_is_scoped_to_one_model_instance(self):
  calls=[]
  def model(texts):calls.append(texts);return [(s+'!',False) for s in texts]
  self.assertEqual(pilot.cached_prose_v23(model,model,'en','zh-CN')(['same']),[('same!',False)])
  self.assertEqual(pilot.cached_prose_v23(model,model,'en','zh-CN')(['same']),[('same!',False)])
  self.assertEqual(len(calls),1)
  def other(texts):calls.append(texts);return [('different',False) for s in texts]
  self.assertEqual(pilot.cached_prose_v23(other,other,'en','zh-CN')(['same']),[('different',False)])
  self.assertEqual(len(calls),2)
 def test_direction_and_locale_are_distinct(self):
  calls=[]
  def owner(texts):calls.append(texts);return [(str(len(calls)),False) for s in texts]
  values=[pilot.cached_prose_v23(owner,owner,a,b)(['same'])[0][0] for a,b in [('en','zh-CN'),('zh-CN','en'),('en','zh-TW')]]
  self.assertEqual(values,['1','2','3'])
 def test_no_normalization_or_context_input_merging(self):
  seen=[]
  def model(texts):seen.extend(texts);return [(s,False) for s in texts]
  values=['Save the file','Save money','{count} 1','{count}1','Ａ','A']
  self.assertEqual(pilot.cached_prose_v23(model,model,'en','zh-CN')(values),[(s,False) for s in values]);self.assertEqual(seen,values)
 def test_truncation_is_retained_and_not_cached_for_later_calls(self):
  calls=[]
  def model(texts):calls.append(texts);return [('cut',True) for s in texts]
  cached=pilot.cached_prose_v23(model,model,'en','zh-CN');self.assertEqual(cached(['a']),[('cut',True)]);self.assertEqual(cached(['a']),[('cut',True)]);self.assertEqual(len(calls),2)
 def test_bad_batch_shape_and_types_cannot_populate_cache(self):
  def owner(texts):return []
  for bad in [lambda texts:[],lambda texts:[('x','false')],lambda texts:[(None,False)]]:
   with self.subTest(callback=bad),self.assertRaises(ValueError):pilot.cached_prose_v23(bad,owner,'en','zh-CN')(['a'])
  good=lambda texts:[('correct',False) for s in texts]
  self.assertEqual(pilot.cached_prose_v23(good,owner,'en','zh-CN')(['a']),[('correct',False)])
 def test_cached_wrong_number_remains_rejected_without_repair(self):
  calls=[]
  def model(texts):calls.append(texts);return [('数值250 MB。',False) for s in texts]
  cached=pilot.cached_prose_v23(model,model,'en','zh-CN')
  for _ in range(2):
   result=pilot.translate_complete_sentences_v22(['Value 25 MB.'],cached,'en','zh-CN')
   self.assertEqual(result,[(None,'数值250 MB。',False)])
  self.assertEqual(len(calls),1)

if __name__=='__main__':unittest.main()
