"""Adversarial file/hash cache tests, independent of translation acceptance."""
import ast
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
from test_translation_v25_history import stable

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location('cache', HERE / 'pilot-validation-cache.py')
cache = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cache)
spec = importlib.util.spec_from_file_location('pilot', HERE / 'translation-pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)

class ValidationCacheTest(unittest.TestCase):
    def setUp(self):
        cache.FILE_BYTES.clear()
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.file = cache.ValidatedPath(self.tmp.name) / 'source.json'
        self.file.write_bytes(b'{"n":1}\r\n')

    def test_repeated_reads_open_the_file_once(self):
        original = io.open
        with patch.object(io, 'open', wraps=original) as opened:
            self.assertEqual([self.file.read_bytes() for _ in range(8)], [b'{"n":1}\r\n'] * 8)
            self.assertEqual(opened.call_count, 1)

    def test_same_length_edit_and_restored_mtime_invalidate(self):
        old = self.file.stat()
        self.file.read_bytes()
        self.file.write_bytes(b'{"n":9}\r\n')
        os.utime(self.file, ns=(old.st_atime_ns, old.st_mtime_ns))
        self.assertEqual(self.file.read_bytes(), b'{"n":9}\r\n')

    def test_atomic_replacement_and_deletion_do_not_serve_old_bytes(self):
        old = self.file.stat()
        self.file.read_bytes()
        replacement = self.file.with_name('replacement.json')
        replacement.write_bytes(b'{"n":4}\r\n')
        os.utime(replacement, ns=(old.st_atime_ns, old.st_mtime_ns))
        replacement.replace(self.file)
        self.assertEqual(self.file.read_bytes(), b'{"n":4}\r\n')
        self.file.unlink()
        with self.assertRaises(FileNotFoundError):
            self.file.read_bytes()

    def test_new_root_and_symlink_target_are_isolated(self):
        other = self.file.with_name('other.json')
        other.write_bytes(b'other')
        link = self.file.with_name('link.json')
        link.symlink_to(self.file)
        self.assertEqual(link.read_bytes(), self.file.read_bytes())
        link.unlink()
        link.symlink_to(other)
        self.assertEqual(link.read_bytes(), b'other')
        with tempfile.TemporaryDirectory() as directory:
            different = cache.ValidatedPath(directory) / self.file.name
            different.write_bytes(b'different')
            self.assertEqual(different.read_bytes(), b'different')

    def test_read_changed_mid_operation_fails_closed(self):
        original = io.open
        def changed(*args, **kwargs):
            stream = original(*args, **kwargs)
            os.utime(self.file, ns=(1, 1))
            return stream
        with patch.object(io, 'open', changed):
            with self.assertRaisesRegex(OSError, 'changed during validation'):
                self.file.read_bytes()

    def test_text_decoding_newlines_errors_and_fresh_json_values(self):
        plain = Path(self.file)
        self.assertEqual(self.file.read_text(), plain.read_text())
        with plain.open(newline='') as stream:
            self.assertEqual(self.file.read_text(newline=''), stream.read())
        one = json.loads(self.file.read_text())
        one['n'] = 99
        self.assertEqual(json.loads(self.file.read_text()), {'n': 1})
        self.file.write_bytes(b'\xff')
        with self.assertRaises(UnicodeDecodeError):
            self.file.read_text(encoding='utf-8')
        self.assertEqual(self.file.read_text(encoding='utf-8', errors='replace'), '\ufffd')

    def test_filesystem_without_nanosecond_metadata_does_not_cache(self):
        original = io.open
        with patch.object(cache, 'file_signature', return_value=None), patch.object(io, 'open', wraps=original) as opened:
            self.file.read_bytes()
            self.file.read_bytes()
            self.assertEqual(opened.call_count, 2)

    def test_coarse_change_times_disable_file_reuse(self):
        self.assertIsNone(cache.file_signature(SimpleNamespace(st_dev=1, st_ino=2, st_size=3, st_mtime_ns=4, st_ctime_ns=2_000_000_000)))

    def test_byte_and_entry_limits_evict(self):
        bounded = cache.BoundedCache(byte_limit=4, entry_limit=2)
        bounded.put('a', b'aa', 2)
        bounded.put('b', b'bb', 2)
        self.assertEqual(bounded.get('a'), b'aa')
        bounded.put('c', b'cc', 2)
        self.assertIsNone(bounded.get('b'))
        bounded.put('oversized', b'12345', 5)
        self.assertIsNone(bounded.get('oversized'))
        self.assertLessEqual(bounded.bytes, 4)

    def test_hash_results_are_copies_and_mutable_buffers_are_fresh(self):
        view = cache.HashlibView(hashlib)
        first = view.sha256(b'source')
        first.update(b' changed')
        self.assertEqual(view.sha256(b'source').hexdigest(), hashlib.sha256(b'source').hexdigest())
        mutable = bytearray(b'1')
        before = view.sha256(mutable).hexdigest()
        mutable[0] = ord('2')
        self.assertNotEqual(view.sha256(mutable).hexdigest(), before)
        self.assertEqual(view.sha256(memoryview(mutable)).digest(), hashlib.sha256(mutable).digest())
        self.assertEqual(view.sha256(b'source', usedforsecurity=False).digest(), hashlib.sha256(b'source', usedforsecurity=False).digest())
        self.assertEqual(view.sha1(b'source').digest(), hashlib.sha1(b'source').digest())

    def test_only_explicit_cache_bootstrap_changes_the_original_module_ast(self):
        proof = json.loads((pilot.ROOT / 'docs/quality/translation-pilot/acceleration-source-proof.json').read_text())
        module = ast.parse((HERE / 'translation-pilot.py').read_text())
        extra = [node for node in module.body if isinstance(node, ast.FunctionDef) and node.name == 'enable_validation_cache' or isinstance(node, ast.Expr) and isinstance(node.value, ast.Call) and isinstance(node.value.func, ast.Name) and node.value.func.id == 'enable_validation_cache']
        self.assertEqual(len(extra), 2)
        self.assertEqual(pilot.digest(stable(ast.Module(body=extra, type_ignores=[]))), proof['bootstrap_ast_sha256'])
        module.body = [node for node in module.body if node not in extra]
        self.assertEqual(pilot.digest(stable(module)), proof['original_module_ast_sha256'])

    def test_all15443_historical_flags_match_the_uncached_baseline(self):
        proof = json.loads((pilot.ROOT / 'docs/quality/translation-pilot/acceleration-measurements.json').read_text())
        # This is a frozen cache-equivalence experiment, not a ban on discovering
        # future defects. New findings have their own exact-evidence tests.
        with patch.object(pilot, 'SEMANTIC_REGRESSIONS', pilot.SEMANTIC_REGRESSIONS[:1151]):
            flags = {row['record_id']: pilot.record_flags(row) for file in sorted((pilot.ROOT / 'docs/quality/translation-pilot/checkpoints').rglob('*.jsonl')) for row in map(json.loads, file.read_text().splitlines())}
        self.assertEqual(len(flags), proof['records'])
        self.assertEqual(pilot.digest(flags), proof['record_flags_sha256'])

if __name__ == '__main__':
    unittest.main()
