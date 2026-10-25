"""Reproduce the 50 actual v20 forward defects before applying source-bound v21 memory."""
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
EXPECTED={
 'dxf-viewer.fields.units.12':'Nanometer',
 'shikaku.fields.regions':'Persegi panjang',
 'voice-changer.fields.faq3a':'Tidak. Alat ini hanya menerapkan efek audio sederhana. Alat ini tidak mengkloning seseorang, memisahkan vokal, atau mengubah suara menjadi suara orang lain yang nyata.',
 'dxf-viewer.fields.unit':'Satuan gambar',
 'voice-changer.details':'Peramban Anda mendekode audio yang dipilih secara lokal. Filter Web Audio mengatur efek audio. Volume, nada dan kecepatan pemutaran dapat diubah. Gema dapat ditambahkan. Audio lalu dirender menjadi berkas WAV untuk diunduh. Tidak ada audio yang dikirim ke server.',
 'shikaku.home':'Beranda',
 'dxf-viewer.fields.loaded':'Gambar dimuat secara lokal.',
 'dxf-viewer.fields.licenseHeading':'Sumber dan lisensi parser',
 'shikaku.limits':'Teka-teki dibuat di peramban Anda. Kisi yang lebih besar dapat memerlukan waktu pada perangkat yang lebih lambat. Tidak diperlukan akun atau unggahan berkas.',
 'voice-changer.title':'Pengubah Suara Online — Efek Suara Gratis di Peramban Anda',
 'dxf-viewer.title':'Penampil DXF Gratis — Lihat Lapisan, Ukur dan Ekspor SVG',
 'shikaku.freeBadge':'Gratis · tanpa akun · disimpan di perangkat ini',
 'dxf-viewer.fields.units.16':'Hektometer',
 'shikaku.fields.statusNeedStart':'Pilih kotak awal terlebih dahulu.',
 'shikaku.privacy':'Gratis dimainkan. Teka-teki dan kemajuan Anda tetap ada di peramban ini.',
 'shikaku.fields.faq.3.a':'Tidak. Kemajuan hanya disimpan di peramban ini kecuali Anda menghapus data situsnya.',
 'shikaku.fields.statusPlaced':'Persegi panjang ditambahkan.',
 'dxf-viewer.fields.units.14':'Desimeter',
 'voice-changer.howItWorks':'Cara kerja pengubah suara',
 'voice-changer.faq.2.q':'Dapatkah alat ini mengkloning suara atau memisahkan vokal?',
 'dxf-viewer.fields.units.8':'Mikroinci',
 'shikaku.fields.statusInvalid':'Persegi panjang itu tidak cocok dengan petunjuk atau tumpang tindih dengan persegi panjang lain.',
 'dxf-viewer.fields.drawing':'Pratinjau gambar',
 'voice-changer.fields.status':'Status pengubah suara',
 'dxf-viewer.fields.units.9':'Mil',
 'voice-changer.fields.faq3q':'Dapatkah alat ini mengkloning suara atau memisahkan vokal?',
 'dxf-viewer.fields.unitless':'Satuan gambar (tidak dinyatakan)',
 'voice-changer.fields.echo':'Gema',
 'dxf-viewer.fields.cancelled':'Pemuatan dibatalkan.',
 'shikaku.title':'Teka-teki Shikaku Online — Permainan Persegi Panjang Harian Gratis',
 'dxf-viewer.fields.measureFromCoordinates':'Ukur jarak antara koordinat ini',
 'dxf-viewer.home':'Beranda',
 'voice-changer.fields.fileHelp':'Gunakan format yang dapat didekode oleh peramban Anda. Maksimum 25 MB dan 30 detik.',
 'voice-changer.example':'Coba rekaman suara dan bandingkan yang asli dengan preset radio atau preset nada rendah. Perubahan nada juga mengubah kecepatan pemutaran. Ini bukan kloning suara atau koreksi nada tingkat studio.',
 'dxf-viewer.freeBadge':'Alat peramban gratis',
 'dxf-viewer.faq.1.a':'Penampil hanya menggambar jenis entitas yang tercantum di bagian konten yang didukung. Entitas lain dilaporkan menurut jenis dan jumlahnya. Entitas tersebut tidak diam-diam diganti dengan bentuk perkiraan.',
 'dxf-viewer.example':'Garis dari (0, 0) ke (10, 0) memiliki panjang 10 satuan gambar. Penampil membaca kode satuan DXF jika tersedia. Jika tidak ada, hasil pengukuran diberi label sebagai satuan gambar.',
 'voice-changer.faq.2.a':'Tidak. Alat ini hanya menerapkan efek audio sederhana. Alat ini tidak mengkloning seseorang, memisahkan vokal, atau mengubah suara menjadi suara orang lain yang nyata.',
 'dxf-viewer.fields.units.15':'Dekameter',
 'shikaku.name':'Teka-teki Persegi Panjang Shikaku',
 'shikaku.fields.sourceTitle':'Aturan Shikaku',
 'dxf-viewer.fields.units.20':'Parsec',
 'dxf-viewer.fields.bounds':'Batas gambar',
 'dxf-viewer.fields.units.0':'Tanpa satuan',
 'dxf-viewer.fields.units.13':'Mikron',
 'shikaku.fields.statusRemoved':'Persegi panjang dihilangkan.',
 'dxf-viewer.limits':'Pratinjau dan ekspor mendukung LINE, CIRCLE, ARC, serta LWPOLYLINE/POLYLINE bersegmen lurus pada bidang XY. Kurva menggembung, teks, blok, dimensi, spline, entitas 3D dan jenis lainnya dicantumkan sebagai tidak didukung. Semua itu tidak disertakan dalam pengukuran atau ekspor. Ukuran berkas maksimum: 10 MB. Jumlah maksimum rekaman data grup: 200.000.',
 'shikaku.fields.faq.0.a':'Shikaku adalah teka-teki angka. Gambarlah persegi panjang di sekitar petunjuk. Luas setiap persegi panjang harus sama dengan nilai angka pada petunjuknya. Semua kotak dalam kisi harus digunakan tepat sekali.',
 'dxf-viewer.fields.geometryTooLarge':'Gambar ini melebihi batas jumlah rekaman data yang didukung. Ekspor DXF yang lebih kecil atau lebih sederhana.',
 'voice-changer.limits':'Alat ringan ini dirancang untuk klip pendek, bukan lagu berdurasi penuh. Nada diubah dengan menyesuaikan kecepatan pemutaran. Durasi klip dan nada suara berubah bersamaan. Efek tidak dapat menciptakan identitas baru yang alami, memisahkan suara, atau menjamin hasil yang sama di setiap peramban.',
}

def stable_ast(value):
 """Compare AST fields, independent of ast.dump rendering defaults (3.11/3.14).

 Empty type_params was added in 3.12; all actual code fields, empty lists,
 optional None values and nonempty type parameters remain in the digest.
 """
 if isinstance(value,ast.AST):
  return [type(value).__name__,[[field,stable_ast(child)] for field,child in ast.iter_fields(value) if not (field=='type_params' and child==[])]]
 if isinstance(value,list):return [stable_ast(child) for child in value]
 return value

def strip_v26_dispatch(node):
 """Remove only the exact opt-in route; reject altered cache owners or audit code."""
 node=copy.deepcopy(node)
 if node.name=='run':
  expected=ast.parse('if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v7":\n return translate_complete_sentences_v26(texts, cached_prose_v26(prose_translate, model_translate, source_locale, target_locale), source_locale, target_locale, traces)').body[0]
 elif node.name=='policy_typed_data_checks':
  expected=ast.parse('if policy == "context-v26":\n return chinese_typed_data_checks_v26(source, target, source_locale, target_locale)').body[0]
 elif node.name=='audit_review_warnings':
  matches=[n for n in ast.walk(node)if isinstance(n,ast.BoolOp)and any(isinstance(v,ast.Call)and isinstance(v.func,ast.Name)and v.func.id=='chinese_quantity_unproved_v26'for v in n.values)]
  expected=ast.parse('chinese_quantity_unproved_v22(row) or chinese_quantity_unproved_v23(row) or chinese_quantity_unproved_v24(row) or chinese_quantity_unproved_v25(row) or chinese_quantity_unproved_v26(row)',mode='eval').body
  if len(matches)!=1 or stable_ast(matches[0])!=stable_ast(expected):raise AssertionError('Changed v26 negative audit hook')
  matches[0].values.pop()
  return node
 elif node.name=='record_flags':
  previous=next(n for n in node.body if isinstance(n,ast.If)and any(isinstance(v,ast.Constant)and v.value=='context-v25'for v in ast.walk(n.test)))
  class Rewrite(ast.NodeTransformer):
   def visit_Name(self,n):
    if n.id.endswith('_v25'):n.id=n.id[:-4]+'_v26'
    return n
   def visit_Constant(self,n):
    if n.value=='context-v25':n.value='context-v26'
    return n
  expected=Rewrite().visit(copy.deepcopy(previous))
 else:return node
 removed=0
 for parent in ast.walk(node):
  for field,children in ast.iter_fields(parent):
   if not isinstance(children,list):continue
   for i,child in reversed(list(enumerate(children))):
    if isinstance(child,ast.If)and stable_ast(child.test)==stable_ast(expected.test):
     if stable_ast(child)!=stable_ast(expected):raise AssertionError('Changed v26 dispatch')
     del children[i];removed+=1
 if removed!=1:raise AssertionError('Missing or duplicate v26 dispatch')
 return node


def strip_v25_dispatch(node):
 node=strip_v26_dispatch(node)
 """Remove only the exact opt-in v25 route; preserve every historical field."""
 node=copy.deepcopy(node)
 expected=ast.parse('if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v6":\n return translate_complete_sentences_v25(texts, cached_prose_v25(prose_translate, model_translate, source_locale, target_locale), source_locale, target_locale, traces)').body[0]
 removed=0
 for parent in ast.walk(node):
  for field,children in ast.iter_fields(parent):
   if not isinstance(children,list):continue
   for index,child in reversed(list(enumerate(children))):
    if isinstance(child,ast.If) and stable_ast(child.test)==stable_ast(expected.test):
     if stable_ast(child)!=stable_ast(expected):raise AssertionError('Changed v25 dispatch')
     del children[index];removed+=1
 if removed!=1:raise AssertionError('Missing or duplicate v25 dispatch')
 return node


def strip_v24_dispatch(node):
 node=strip_v25_dispatch(node)
 """Remove only the exact opt-in v24 route; preserve every historical field."""
 node=copy.deepcopy(node)
 expected=ast.parse('if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v5":\n return translate_complete_sentences_v24(texts, cached_prose_v24(prose_translate, model_translate, source_locale, target_locale), source_locale, target_locale, traces)').body[0]
 removed=0
 for parent in ast.walk(node):
  for field,children in ast.iter_fields(parent):
   if not isinstance(children,list):continue
   for index,child in reversed(list(enumerate(children))):
    if isinstance(child,ast.If) and stable_ast(child.test)==stable_ast(expected.test):
     if stable_ast(child)!=stable_ast(expected):raise AssertionError('Changed v24 dispatch')
     del children[index];removed+=1
 if removed!=1:raise AssertionError('Missing or duplicate v24 dispatch')
 return node


def strip_v23_dispatch(node):
 """Remove only the exact opt-in v23 route; preserve every historical field."""
 node=strip_v24_dispatch(node)
 node=copy.deepcopy(node)
 expected=ast.parse('if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v4":\n return translate_complete_sentences_v23(texts, cached_prose_v23(prose_translate, model_translate, source_locale, target_locale), source_locale, target_locale, traces)').body[0]
 removed=0
 for parent in ast.walk(node):
  for field,children in ast.iter_fields(parent):
   if not isinstance(children,list):continue
   for index,child in reversed(list(enumerate(children))):
    if isinstance(child,ast.If) and stable_ast(child.test)==stable_ast(expected.test):
     if stable_ast(child)!=stable_ast(expected):raise AssertionError('Changed v23 dispatch')
     del children[index];removed+=1
 if removed!=1:raise AssertionError('Missing or duplicate v23 dispatch')
 return node


def historical_run_ast(node):
 """Remove exact v23/v22 routes; compare every historical run field."""
 node=strip_v23_dispatch(node)
 expected=ast.parse('if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v3":\n return translate_complete_sentences_v22(texts, prose_translate, source_locale, target_locale, traces)').body[0]
 removed=0
 for parent in ast.walk(node):
  for field,children in ast.iter_fields(parent):
   if not isinstance(children,list):continue
   for index,child in reversed(list(enumerate(children))):
    if isinstance(child,ast.If) and stable_ast(child.test)==stable_ast(expected.test):
     if stable_ast(child)!=stable_ast(expected):raise AssertionError('Changed v22 dispatch')
     del children[index];removed+=1
 if removed!=1:raise AssertionError('Missing or duplicate v22 dispatch')
 return stable_ast(node)


def observed():
 records={r['record_id']:r for r in map(json.loads,(DATA/'checkpoints/context-v20/madlad.jsonl').read_text().splitlines())}
 review=json.loads((DATA/'review-context-v20-full.json').read_text())
 return [records[j['record_ids'][0]] for j in review['rows'] if min(j['scores'].values())<3]

class IndonesianExpandedMemoryTest(unittest.TestCase):
 def test_actual_fifty_v20_callbacks_then_exact_v21_memory(self):
  rows=observed();self.assertEqual(len(rows),50);self.assertEqual({r['key'] for r in rows},set(EXPECTED))
  for row in rows:
   with self.subTest(key=row['key']):
    self.assertIsNone(pilot.reviewed_memory(row,'id','context-v20'))
    self.assertTrue(pilot.semantic_issues(row['key'],row['source_hash'],row['translation'],'id'))
    traces=[]
    def callback(parts):
     self.assertEqual(parts,[p['input'] for p in row['forward_segments']]);return [(p['output'],p['truncated']) for p in row['forward_segments']]
    replay=pilot.translate_complete_sentences_v19([row['model_input']],callback,'en','id',traces)
    self.assertEqual(replay[0][1],row['raw_translation']);self.assertEqual(traces[0],row['forward_segments'])
    values,traces,memory=pilot.forward_with_memory([row],'id','context-v21',lambda *args:self.fail('Known memory must avoid inference'))
    self.assertEqual(values,[(EXPECTED[row['key']],EXPECTED[row['key']],False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[EXPECTED[row['key']]])
    self.assertTrue(all(pilot.policy_typed_data_checks(row['source'],memory[0],'en','id','context-v21').values()))
    self.assertFalse(pilot.semantic_issues(row['key'],row['source_hash'],memory[0],'id'))

 def test_old_213_targets_controlled_inputs_and_numeric_profile_preserved(self):
  old,new=pilot.POLICIES['context-v20'],pilot.POLICIES['context-v21']
  self.assertEqual(old['entries'],new['entries']);self.assertEqual(old['numeric_profile'],new['numeric_profile']);self.assertEqual(old['protection'],new['protection'])
  self.assertEqual(sum(len(e['translations']) for e in old['reviewed_memory'].values()),213)
  for key,entry in old['reviewed_memory'].items():
   for locale,value in entry['translations'].items():self.assertEqual(new['reviewed_memory'][key]['translations'][locale],value)
  self.assertEqual(sum(len(e['translations']) for e in new['reviewed_memory'].values()),263)
  added={key for key,entry in new['reviewed_memory'].items() if 'id' in entry['translations'] and 'id' not in old['reviewed_memory'].get(key,{}).get('translations',{})};self.assertEqual(added,set(EXPECTED))
  self.assertIsNone(pilot.numeric_data('25 MB','id'));self.assertFalse(all(pilot.typed_data_checks('25 MB','25 MB','en','id').values()))
  self.assertIn('context-v21',pilot.TYPED_POLICIES)

 def test_stale_source_hash_or_context_rejected_for_all_fifty(self):
  for row in observed():
   for field in ['source','source_hash','context']:
    with self.subTest(key=row['key'],field=field),self.assertRaises(ValueError):pilot.reviewed_memory({**row,field:row[field]+' changed'},'id','context-v21')

 def test_corrupt_memory_is_rejected_without_repair_or_fallback(self):
  policy='context-v21';key='voice-changer.fields.fileHelp';row=next(r for r in observed() if r['key']==key)
  for bad in [EXPECTED[key].replace('25 MB','2,5 MB'),EXPECTED[key].replace('30 detik','300 detik')]:
   changed=copy.deepcopy(pilot.POLICIES[policy]);changed['reviewed_memory'][key]['translations']['id']=bad
   with patch.dict(pilot.POLICIES,{policy:changed}):
    values,traces,memory=pilot.forward_with_memory([row],'id',policy,lambda *args:self.fail('No fallback'))
    self.assertEqual(values,[(None,bad,False)]);self.assertEqual(traces,[None]);self.assertEqual(memory,[bad])

 def test_ast_guard_is_portable_and_still_detects_changed_code(self):
  current=ast.parse('def f(x): return x').body[0]
  legacy=copy.deepcopy(current)
  legacy._fields=tuple(field for field in legacy._fields if field!='type_params')
  if hasattr(legacy,'type_params'):delattr(legacy,'type_params')
  self.assertEqual(stable_ast(current),stable_ast(legacy))
  self.assertIn(['decorator_list',[]],stable_ast(current)[1])
  self.assertIn(['returns',None],stable_ast(current)[1])
  changed=ast.parse('def f(x): return x + 1').body[0]
  self.assertNotEqual(stable_ast(current),stable_ast(changed))

 def test_frozen_history_original_flags_policy_digests_and_inference_functions(self):
  proof=json.loads((DATA/'regression-v21-evidence.json').read_text())
  for policy,value in proof['historical_policy_digests'].items():self.assertEqual(pilot.policy_digest(policy),value)
  addenda=json.loads((DATA/'review-warning-addenda.json').read_text());self.assertEqual(pilot.digest(addenda[:proof['historical_back_addenda_prefix_count']]),proof['historical_back_addenda_prefix_digest'])
  prefix=pilot.SEMANTIC_REGRESSIONS[:proof['fixture_prefix_count']];self.assertEqual(pilot.digest(prefix),proof['fixture_prefix_digest']);flags={}
  with patch.object(pilot,'SEMANTIC_REGRESSIONS',prefix):
   for path in sorted((DATA/'checkpoints').rglob('*.jsonl')):
    for row in map(json.loads,path.read_text().splitlines()):
     if row.get('inference_policy','baseline') not in {'baseline',*proof['historical_policy_digests']}:continue
     pilot.validate_record(row);flags[row['record_id']]=pilot.record_flags(row)
  self.assertEqual(len(flags),13910);self.assertEqual(pilot.digest(flags),proof['record_flags_digest'])
  nodes={n.name:historical_run_ast(n) if n.name=="run" else stable_ast(n) for n in ast.parse(Path(pilot.__file__).read_text()).body if isinstance(n,ast.FunctionDef)}
  for name,value in proof['inference_function_ast_digests'].items():self.assertEqual(pilot.digest(nodes[name]),value)

if __name__=='__main__':unittest.main()
