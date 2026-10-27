#!/usr/bin/env python3
"""Bounded Actions-only generation of recoverable drafts; never approve or deploy."""
from __future__ import annotations

import argparse
import base64
from collections import Counter
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
import time
import unicodedata

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('draft_queue', HERE / 'translation-queue.py')
queue = importlib.util.module_from_spec(spec)
spec.loader.exec_module(queue)
FORMAT = 'usefulverse-background-draft-v1'
MODEL = 'google/madlad400-3b-mt'
REVISION = 'fa184c675da0b5c9e1c8694fccd4e12e2d422094'
LOCALES = list(queue.LANGUAGES)
PREFIX = 'UVDRAFT_RECORD '
EXTRA = re.compile(r'(?<!\w)[+-]?\d+(?:[.,]\d+)*(?:%|°)?|\b(?:DXF|DWG|SVG|WAV|MP3|PDF|JSON|CSV|PNG|ASCII|UTF-8|UsefulVerse)\b')
NEGATIVE = re.compile(r"\b(?:no|not|never|without|cannot|can't|doesn't|don't|won't|isn't|aren't)\b", re.I)
SCRIPTS = {'ar': 'ARABIC', 'fa': 'ARABIC', 'ur': 'ARABIC', 'hi': 'DEVANAGARI',
           'mr': 'DEVANAGARI', 'bn': 'BENGALI', 'te': 'TELUGU', 'ta': 'TAMIL',
           'gu': 'GUJARATI', 'am': 'ETHIOPIC', 'ru': 'CYRILLIC', 'uk': 'CYRILLIC',
           'bg': 'CYRILLIC', 'el': 'GREEK', 'th': 'THAI', 'ko': 'HANGUL'}


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def identity(unit, locale):
    return digest(canonical([FORMAT, MODEL, REVISION, 2, locale, unit['source_hash'], unit['context']]))


def protect(text):
    if queue.MARKER.search(text):
        raise ValueError('Source/output contains a reserved translation marker')
    # One pass over all protected spans: markers must never be masked a second time.
    pattern = re.compile('(?:' + queue.PLACEHOLDER.pattern + ')|(?:' + EXTRA.pattern + ')', re.I)
    saved = []
    def replace(match):
        saved.append(match.group())
        return f'ZXQPH{len(saved)-1:04d}QXZ'
    return pattern.sub(replace, text), saved


def checks(source, translation, truncated=False):
    _, expected = protect(source)
    # Damaged restoration is reviewable evidence, not a parser crash.
    clean_translation = queue.MARKER.sub('', translation)
    _, actual = protect(clean_translation)
    prose, _ = protect(source)
    prose = queue.MARKER.sub('', prose)
    return {
        'nonempty': bool(translation.strip()),
        'protected_values': Counter(expected) == Counter(actual),
        'no_residual_markers': not queue.MARKER.search(translation),
        'not_truncated': not truncated,
        'translated': translation != source or not any(c.isalpha() for c in prose),
    }


def warnings(row):
    result = []
    source, translation, locale = row['source'], row['translation'], row['locale']
    if len(source) >= 40 and not 0.25 <= len(translation) / len(source) <= 4:
        result.append('length_ratio')
    letters = [c for c in queue.MARKER.sub('', translation) if c.isalpha()]
    if locale in SCRIPTS and len(letters) >= 12:
        if sum(SCRIPTS[locale] in unicodedata.name(c, '') for c in letters) / len(letters) < 0.5:
            result.append('wrong_script')
    expected = queue.LANGUAGES[locale]
    detected = row.get('detected_language')
    if len(letters) >= 30 and detected and detected != expected:
        result.append('language_detection')
    back = row.get('back_sample')
    if back is not None:
        if not all(checks(source, back['translation'], back['truncated'])[key]
                   for key in ('nonempty', 'protected_values', 'no_residual_markers', 'not_truncated')):
            result.append('back_data')
        if bool(NEGATIVE.search(source)) != bool(NEGATIVE.search(back['translation'])):
            result.append('back_negation')
    return result


def work_items(corpus, locales, shard, shards):
    if not 0 <= shard < shards <= 8:
        raise ValueError('Invalid bounded shard')
    if not locales or len(locales) != len(set(locales)) or any(x not in LOCALES for x in locales):
        raise ValueError('Invalid destination list')
    groups = {}
    seen = set()
    for unit in corpus['units']:
        if unit['key'] in seen or digest(unit['source']) != unit['source_hash'] or not unit['context']:
            raise ValueError('Duplicate key or stale source/context')
        seen.add(unit['key'])
        for locale in locales[shard::shards]:
            rid = identity(unit, locale)
            if rid not in groups:
                groups[rid] = dict(unit, locale=locale, record_id=rid, keys=[])
            elif groups[rid]['source'] != unit['source']:
                raise ValueError('Conflicting source identity')
            groups[rid]['keys'].append(unit['key'])
    return sorted(groups.values(), key=lambda row: (digest(row['context'] + row['source']), row['locale']))


def validate_record(row):
    if row.get('format') != FORMAT or row.get('model') != MODEL or row.get('revision') != REVISION:
        raise ValueError('Wrong draft format/model')
    if row.get('approved') is not False or row.get('status') not in ('machine-draft', 'needs-review'):
        raise ValueError('A background draft cannot carry approval')
    if row.get('beam_size') != 2 or type(row.get('truncated')) is not bool:
        raise ValueError('Wrong draft decoding contract')
    if row.get('locale') not in LOCALES or digest(row['source']) != row['source_hash']:
        raise ValueError('Stale draft source/locale')
    if identity(row, row['locale']) != row['record_id']:
        raise ValueError('Stale draft identity')
    expected = checks(row['source'], row['translation'], row['truncated'])
    if row['checks'] != expected:
        raise ValueError('Stale or forged automatic checks')
    if row.get('warnings') != warnings(row):
        raise ValueError('Stale automatic warnings')
    if row['status'] != ('machine-draft' if all(expected.values()) and not row['warnings'] else 'needs-review'):
        raise ValueError('Unsafe draft status')
    return row


def load_records(paths):
    result = {}
    for path in paths:
        for line in Path(path).read_text().splitlines():
            if not line.strip():
                continue
            if PREFIX in line:
                row = json.loads(base64.b64decode(line.split(PREFIX, 1)[1].strip(), validate=True))
            elif line.startswith('{'):
                row = json.loads(line)
            else:
                continue
            validate_record(row)
            old = result.get(row['record_id'])
            if old and canonical(old) != canonical(row):
                raise ValueError('Conflicting checkpoint; refusing overwrite')
            result[row['record_id']] = row
    return result


def make_record(unit, raw, truncated, restored, elapsed):
    translation = restored if restored is not None else raw
    flags = checks(unit['source'], translation, truncated)
    row = dict(format=FORMAT, model=MODEL, revision=REVISION, beam_size=2,
                record_id=unit['record_id'], key=unit['key'], keys=unit['keys'],
                source=unit['source'], source_hash=unit['source_hash'], context=unit['context'],
                locale=unit['locale'], translation=translation, raw_translation=raw,
                truncated=truncated, checks=flags,
                status='machine-draft' if all(flags.values()) else 'needs-review', approved=False,
                seconds=elapsed, source_commit=os.environ.get('GITHUB_SHA', ''),
                run_id=os.environ.get('GITHUB_RUN_ID', ''), detected_language=None, back_sample=None)
    row['warnings'] = warnings(row)
    row['status'] = 'machine-draft' if all(flags.values()) and not row['warnings'] else 'needs-review'
    return row


class Model:
    def __init__(self, directory):
        import ctranslate2
        from ctranslate2.converters import TransformersConverter
        from transformers import T5Tokenizer
        if shutil.disk_usage(directory.parent).free < 18 * 1024**3:
            raise RuntimeError('Need 18 GiB on the standard runner; no paid fallback')
        self.tokenizer = T5Tokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=False)
        TransformersConverter(MODEL, revision=REVISION, low_cpu_mem_usage=True,
                              load_as_float16=True, trust_remote_code=False).convert(str(directory), quantization='int8')
        self.translator = ctranslate2.Translator(str(directory), device='cpu', compute_type='int8',
                                               inter_threads=1, intra_threads=min(4, os.cpu_count() or 1))

    def translate(self, texts, locale):
        code = 'en' if locale == 'en' else queue.LANGUAGES[locale]
        inputs = [self.tokenizer.convert_ids_to_tokens(self.tokenizer.encode(f'<2{code}> {text}')) for text in texts]
        allowed = [i for i, tokens in enumerate(inputs) if len(tokens) <= 512]
        outputs = self.translator.translate_batch([inputs[i] for i in allowed], beam_size=2, max_batch_size=8,
                                                 num_hypotheses=1, max_decoding_length=256)
        if len(outputs) != len(allowed):
            raise ValueError('Incomplete model batch')
        # Oversize inputs become explicit review records; no source is truncated/sent.
        result = [(text, True) for text in texts]
        for i, output in zip(allowed, outputs, strict=True):
            result[i] = (self.tokenizer.decode(self.tokenizer.convert_tokens_to_ids(output.hypotheses[0]), skip_special_tokens=True),
                         len(output.hypotheses[0]) >= 256)
        if locale == 'zh-TW':
            from opencc import OpenCC
            converter = OpenCC('s2twp')
            result = [(converter.convert(text), cut) for text, cut in result]
        return result


def generate(args):
    if os.environ.get('GITHUB_ACTIONS') != 'true' or os.environ.get('RUNNER_OS') != 'Linux':
        raise RuntimeError('Inference/downloads only on Actions Linux, never on the Mac')
    if os.environ.get('GITHUB_REPOSITORY') != 'pedronunezwebs-hash/usefulverse':
        raise RuntimeError('Only the authorized public repository')
    if not 1 <= args.minutes <= 240:
        raise ValueError('Time budget must be 1–240 minutes')
    corpus = json.loads(args.corpus.read_text())
    locales = args.locales.split(',') if args.locales else LOCALES
    work = work_items(corpus, locales, args.shard, args.shards)
    completed = load_records(args.resume)
    remaining = [unit for unit in work if unit['record_id'] not in completed]
    # Carry valid prior records into this job's logs. Later jobs can resume even
    # before an agent collects the final checkpoint into Git.
    recovered_bytes = 0
    for unit in work:
        if unit['record_id'] in completed:
            encoded = PREFIX + base64.b64encode(canonical(completed[unit['record_id']]).encode()).decode()
            recovered_bytes += len(encoded) + 1
            print(encoded, flush=True)
    print('UVDRAFT_PLAN ' + canonical(dict(shard=args.shard, unique_targets=len(work),
          pending=len(remaining), reused=len(work)-len(remaining), tools=corpus['tools'],
          minutes=args.minutes, approved=0)), flush=True)
    if getattr(args, 'plan_only', False):
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a') as handle:
                handle.write(f'pending={len(remaining)}\n')
        return
    if not remaining:
        return
    args.model_dir.parent.mkdir(parents=True, exist_ok=True)
    model = Model(args.model_dir)
    import langid
    # Conversion has its own room in the 300 min job timeout. A 1 min smoke run
    # must still exercise inference after downloading/converting the model.
    deadline = time.monotonic() + args.minutes * 60
    queues = {locale: [u for u in remaining if u['locale'] == locale] for locale in locales[args.shard::args.shards]}
    counts = Counter()
    sampled = Counter()
    warning_counts = Counter()
    emitted_bytes = recovered_bytes
    started = time.monotonic()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('a') as handle:
        # Round robin across destinations prevents one long locale starving the others.
        while any(queues.values()) and time.monotonic() < deadline and emitted_bytes < 256 * 1024**2:
            for locale, pending in queues.items():
                if not pending or time.monotonic() >= deadline:
                    continue
                batch = pending[:8]
                prepared = [protect(unit['source']) for unit in batch]
                tick = time.monotonic()
                outputs = model.translate([text for text, _ in prepared], locale)
                seconds = time.monotonic() - tick
                for unit, (_, saved), (raw, cut) in zip(batch, prepared, outputs, strict=True):
                    row = make_record(unit, raw, cut, queue.restore(raw, saved), seconds/len(batch))
                    row['detected_language'] = langid.classify(row['translation'])[0]
                    # At most 20 back-translations per destination, not every phrase.
                    if sampled[locale] < 20 and all(row['checks'].values()):
                        masked, saved_back = protect(row['translation'])
                        [(back_raw, back_cut)] = model.translate([masked], 'en')
                        row['back_sample'] = dict(translation=queue.restore(back_raw, saved_back) or back_raw,
                                                  truncated=back_cut)
                        sampled[locale] += 1
                    row['warnings'] = warnings(row)
                    row['status'] = 'machine-draft' if all(row['checks'].values()) and not row['warnings'] else 'needs-review'
                    validate_record(row)
                    handle.write(canonical(row) + '\n')
                    handle.flush()
                    # No artifacts/cache quota. Complete records survive a failed later batch.
                    encoded = PREFIX + base64.b64encode(canonical(row).encode()).decode()
                    emitted_bytes += len(encoded) + 1
                    print(encoded, flush=True)
                    counts[locale + ':' + row['status']] += 1
                    warning_counts.update(locale + ':' + warning for warning in row['warnings'])
                del pending[:len(batch)]
                print('UVDRAFT_PROGRESS ' + canonical(dict(counts=counts, remaining=sum(map(len, queues.values())),
                      seconds=round(time.monotonic()-started, 2), approved=0)), flush=True)
    summary = dict(counts=counts, samples=sampled, warnings=warning_counts, remaining=sum(map(len, queues.values())),
                   paused=any(queues.values()), approved=0,
                   recover='Download completed job logs and run background-drafts.py collect; commit checkpoints before deleting logs.')
    print('UVDRAFT_SUMMARY ' + canonical(summary), flush=True)
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as handle:
            handle.write('## Translation drafts\n\n```json\n' + json.dumps(summary, indent=2) + '\n```\n')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    run = sub.add_parser('run')
    run.add_argument('--corpus', type=Path, required=True)
    run.add_argument('--output', type=Path, required=True)
    run.add_argument('--model-dir', type=Path, required=True)
    run.add_argument('--locales', default='')
    run.add_argument('--shard', type=int, default=0)
    run.add_argument('--shards', type=int, default=4)
    run.add_argument('--minutes', type=int, default=240)
    run.add_argument('--resume', nargs='*', default=[])
    run.add_argument('--plan-only', action='store_true')
    collect = sub.add_parser('collect')
    collect.add_argument('--output', type=Path, required=True)
    collect.add_argument('logs', nargs='+')
    args = parser.parse_args()
    if args.command == 'run':
        generate(args)
    else:
        records = load_records(([args.output] if args.output.exists() else []) + args.logs)
        if not records:
            raise ValueError('No draft records; refusing empty export')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(mode='w', dir=args.output.parent, delete=False) as handle:
            temporary = Path(handle.name)
            for key in sorted(records):
                handle.write(canonical(records[key]) + '\n')
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, args.output)
        print(canonical(dict(records=len(records), approved=0)))


if __name__ == '__main__':
    main()
