import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('preview', HERE / 'prepare-preview-packages.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)


class PreviewPackagesTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()
        self.memory = self.root / 'memory'
        self.memory.mkdir()
        (self.memory / 'manifest.json').write_text(json.dumps(dict(format='usefulverse-automatic-results-v1', release_approved=False)))
        self.ids = [tool['slug'] for tool in json.loads((preview.ROOT / 'docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json').read_text())['tools']]
        self.corpus = self.root / 'corpus.json'
        self.corpus.write_text(json.dumps(dict(documents=[dict(toolId=tool, coverage='copy') for tool in self.ids + ['existing-tool']],
            units=[dict(key=tool + '.copy.name') for tool in self.ids + ['existing-tool']], sourceDigest='current')))

    def test_only_candidates_are_reexported_without_network_inference_or_input_writes(self):
        before = (self.memory / 'manifest.json').read_bytes()
        report = dict(catalog_tools=300, exported_entries=4, quarantined=8, refined_adopted=4, approved=False)
        with patch.object(preview.pipeline, 'memory', return_value=({}, {})), patch.object(preview.pipeline, 'read_lines'), \
             patch.object(preview.pipeline, 'export', return_value=report) as export, \
             patch.object(preview.pipeline.client, 'api', side_effect=AssertionError('No network')):
            with contextlib.redirect_stdout(io.StringIO()): preview.prepare(self.corpus, self.memory, self.root / 'out')
        corpus = export.call_args.args[0]
        self.assertEqual({document['toolId'] for document in corpus['documents']}, set(self.ids))
        self.assertEqual(len(corpus['units']), 300)
        self.assertEqual((self.memory / 'manifest.json').read_bytes(), before)

    def test_output_must_be_fresh_and_separate_from_saved_memory(self):
        for output in (self.memory, self.root, self.memory / 'nested'):
            with self.subTest(output=output), self.assertRaises(ValueError): preview.prepare(self.corpus, self.memory, output)

    def test_missing_candidate_and_false_release_provenance_are_rejected(self):
        corpus = json.loads(self.corpus.read_text())
        corpus['documents'].pop(0)
        self.corpus.write_text(json.dumps(corpus))
        with self.assertRaises(ValueError): preview.prepare(self.corpus, self.memory, self.root / 'out')
        (self.memory / 'manifest.json').write_text(json.dumps(dict(format='usefulverse-automatic-results-v1', release_approved=True)))
        with self.assertRaises(ValueError): preview.prepare(self.corpus, self.memory, self.root / 'out')

    def test_symlink_memory_is_rejected(self):
        link = self.root / 'link'
        link.symlink_to(self.memory, target_is_directory=True)
        with self.assertRaises(ValueError): preview.prepare(self.corpus, link, self.root / 'out')


if __name__ == '__main__': unittest.main()
