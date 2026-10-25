"""The finite legacy reassessment can only reduce its bound rejected grade."""
import copy,hashlib,importlib.util,json,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('pilot',Path(__file__).with_name('translation-pilot.py'));pilot=importlib.util.module_from_spec(spec);spec.loader.exec_module(pilot)
DATA=pilot.ROOT/'docs/quality/translation-pilot'
class LegacyAuditV25Test(unittest.TestCase):
 def test_rehashed_metadata_cannot_approve_raise_grades_or_change_candidate(self):
  base=json.loads((DATA/'legacy-withdrawal-v25.json').read_text());original=json.loads((DATA/base['review_file']).read_text());records={r['record_id']:r for r in map(json.loads,(DATA/base['source_checkpoint']).read_text().splitlines())}
  self.assertEqual(len(pilot.historical_legacy_forward_withdrawal_v25(original,records)),1)
  self.assertEqual(pilot.historical_forward_withdrawals(original,records),[],'Keep the old model-only mechanism unchanged')
  for mutation in ['passed','passed-other','approved','native','raise','candidate','context','hash']:
   with self.subTest(mutation=mutation),tempfile.TemporaryDirectory()as tmp:
    root=Path(tmp);directory=root/'docs/quality/translation-pilot';directory.mkdir(parents=True);case=copy.deepcopy(base);review=copy.deepcopy(original);rows=copy.deepcopy(records)
    if mutation=='passed':review['full_gate']['zh-CN']['passed']=True
    elif mutation=='passed-other':review['full_gate']['es']={'passed':True}
    elif mutation=='approved':review['approved_locales']=['zh-CN']
    elif mutation=='native':case['native_review']=True
    elif mutation=='raise':case['entries'][0]['scores']['naturalness']=3
    elif mutation=='candidate':rows[case['entries'][0]['record_id']]['candidate']='model'
    elif mutation=='context':case['entries'][0]['context']='unrelated.context'
    else:case['entries'][0]['translation_hash']='stale'
    raw=(json.dumps(review,ensure_ascii=False)+'\n').encode();(directory/case['review_file']).write_bytes(raw);case['review_file_sha256']=hashlib.sha256(raw).hexdigest();case['review_digest']=pilot.digest(review);checkpoint=directory/case['source_checkpoint'];checkpoint.parent.mkdir(parents=True);checkpoint.write_bytes((DATA/base['source_checkpoint']).read_bytes());(directory/'legacy-withdrawal-v25.json').write_text(json.dumps(case,ensure_ascii=False))
    with patch.object(pilot,'ROOT',root),self.assertRaises(ValueError):pilot.historical_legacy_forward_withdrawal_v25(review,rows)
if __name__=='__main__':unittest.main()
