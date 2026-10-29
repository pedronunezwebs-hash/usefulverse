#!/usr/bin/env python3
"""Revalidate saved translation proofs for an isolated noindex build. No inference/API."""
import argparse
from collections import Counter
import json
import os
from pathlib import Path
import importlib.util

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
spec = importlib.util.spec_from_file_location('preview_pipeline', HERE / 'translation-autopilot.py')
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


def prepare(corpus_path, memory, output):
    for path in (corpus_path, memory, output):
        if path.is_symlink() or any(parent.is_symlink() for parent in path.parents):
            raise ValueError('Preview inputs and output must not be symlinks')
    corpus_path, memory, output = (path.resolve() for path in (corpus_path, memory, output))
    if not memory.is_dir() or output.exists() or output in memory.parents or memory in output.parents:
        raise ValueError('Use a fresh output directory separate from the saved memory')
    manifest = json.loads((memory / 'manifest.json').read_text())
    if manifest.get('format') != 'usefulverse-automatic-results-v1' or manifest.get('release_approved') is not False:
        raise ValueError('Unexpected translation memory provenance')
    corpus = json.loads(corpus_path.read_text())
    candidates = {tool['slug'] for tool in json.loads((ROOT / 'docs/planning/usefulverse-1000-2026-10-19/implementation-progress.json').read_text())['tools']}
    if len(candidates) != 300:
        raise ValueError('Expected the canonical 300 staged tools')
    corpus['documents'] = [document for document in corpus['documents'] if document['toolId'] in candidates]
    if {document['toolId'] for document in corpus['documents']} != candidates:
        raise ValueError('Missing canonical candidate source')
    corpus['units'] = [unit for unit in corpus['units'] if unit['key'].split('.')[0] in candidates]
    corpus['tools'] = len(candidates)
    corpus['coverage'] = dict(Counter(document['coverage'] for document in corpus['documents']))
    rows, audits = pipeline.memory(memory)
    for relative in ('docs/quality/translation-drafts/checkpoints', 'docs/quality/translation-drafts/quality-v1/checkpoints'):
        for path in sorted((ROOT / relative).glob('*.jsonl')):
            pipeline.read_lines(path.read_text(), rows, audits)
    # Export recomputes current policies, hashes, contexts and prior-error vetoes.
    # It never trusts a previously exported package or starts a model.
    report = pipeline.export(corpus, rows, audits, output, os.environ.get('GITHUB_RUN_ID', '0'))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as stream:
            stream.write(f"semantic_policy={report['semantic_policy']}\nquality_policy={report['quality_policy']}\n")
    print(json.dumps({key: report[key] for key in ('catalog_tools', 'exported_entries', 'quarantined', 'refined_adopted', 'approved')}, sort_keys=True))
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('corpus', 'memory', 'output'):
        parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args()
    prepare(args.corpus, args.memory, args.output)
