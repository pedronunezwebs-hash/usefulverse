#!/usr/bin/env python3
"""Measure pinned local translation models on Actions; never approve or publish copy."""
from __future__ import annotations

import argparse
import base64
from collections import Counter
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import resource
import shutil
import subprocess
import sys
import time
import unicodedata

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("translation_queue", Path(__file__).with_name("translation-queue.py"))
queue = importlib.util.module_from_spec(spec)
spec.loader.exec_module(queue)
ENGINES = {
    "m2m100": {"repository": "facebook/m2m100_418M", "revision": "55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636", "license": "MIT", "minimum_free_gib": 5},
    "madlad": {"repository": "google/madlad400-3b-mt", "revision": "fa184c675da0b5c9e1c8694fccd4e12e2d422094", "license": "Apache-2.0", "minimum_free_gib": 18},
}
ALIASES = {"pt-BR": "pt", "zh-CN": "zh", "zh-TW": "zh", "fil": "tl", "nb-NO": "no"}
SCRIPTS = {"ar": "ARABIC", "fa": "ARABIC", "ur": "ARABIC", "hi": "DEVANAGARI", "mr": "DEVANAGARI", "bn": "BENGALI", "te": "TELUGU", "ta": "TAMIL", "gu": "GUJARATI", "am": "ETHIOPIC", "ru": "CYRILLIC", "uk": "CYRILLIC", "bg": "CYRILLIC", "el": "GREEK", "th": "THAI", "ko": "HANGUL"}
FORMAT = "usefulverse-translation-pilot-v1"
SEMANTIC_REGRESSIONS = json.loads(Path(__file__).with_name("pilot-semantic-regressions.json").read_text())


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def record_id(corpus, engine, locale, unit, candidate, beam):
    return digest([FORMAT, corpus["sourceDigest"], engine, ENGINES[engine], locale, unit["key"], unit["source_hash"], unit["context"], candidate, beam, unit["legacy"].get(locale) if candidate == "legacy" else None])


def semantic_issues(key, source_hash, translation, locale):
    normalized = unicodedata.normalize("NFKC", translation).casefold().strip()
    return sorted({row["issue"] for row in SEMANTIC_REGRESSIONS if row["key"] == key
        and row["source_hash"] == source_hash and row["locale"] == locale
        and unicodedata.normalize("NFKC", row["translation"]).casefold().strip() == normalized})


def automatic_checks(source, translation, locale, key=None):
    letters = [char for char in translation if char.isalpha()]
    required_script = SCRIPTS.get(locale)
    script_ratio = None if not required_script or not letters else sum(required_script in unicodedata.name(char, "") for char in letters) / len(letters)
    return {
        "nonempty": bool(translation.strip()),
        "protected_tokens_identical": queue.signature(source) == queue.signature(translation),
        "untranslated_source": source.casefold().strip() == translation.casefold().strip(),
        "length_ratio": round(len(translation) / max(1, len(source)), 3),
        "expected_script_ratio": script_ratio,
        "known_semantic_errors": semantic_issues(key, hashlib.sha256(source.encode()).hexdigest(), translation, locale),
        "review_required": True,
    }


def validate_record(row):
    if row.get("format") != FORMAT or row.get("status") != "machine-draft":
        raise ValueError("Pilot records must remain machine-draft, never approved")
    if any(row.get(field) for field in ("reviewer", "reviewed_at", "approved")):
        raise ValueError("Machine output cannot create review provenance")
    if row.get("engine") not in ENGINES or row.get("engine_revision") != ENGINES[row["engine"]]["revision"]:
        raise ValueError("Unknown or changed model revision")
    if row.get("source_hash") != hashlib.sha256(row["source"].encode()).hexdigest():
        raise ValueError("Stale source hash in checkpoint")


def emit(row):
    validate_record(row)
    # Small complete records survive job failure/cancellation in Actions logs.
    print("UVPILOT_RECORD " + base64.b64encode(canonical(row).encode()).decode(), flush=True)


def actions_only():
    if os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("RUNNER_OS") != "Linux":
        raise SystemExit("Model download/inference is restricted to GitHub Actions Linux runners; not the Mac.")


def pending_work(corpus, units, locales, engine, beam, completed):
    work = []
    for locale in locales:
        if engine == "m2m100" and locale == "te":
            continue
        for candidate in ("model", "legacy"):
            pending = []
            for unit in units:
                if candidate == "legacy" and not unit["legacy"].get(locale):
                    continue
                identity = record_id(corpus, engine, locale, unit, candidate, beam)
                previous = completed.get(identity)
                if previous:
                    validate_record(previous)
                    expected = {"corpus_digest": corpus["sourceDigest"], "engine": engine, "locale": locale,
                        "key": unit["key"], "source_hash": unit["source_hash"], "candidate": candidate, "beam_size": beam}
                    if any(previous.get(key) != value for key, value in expected.items()):
                        raise ValueError("Checkpoint identity does not match its contents")
                else:
                    pending.append(unit)
            if pending:
                work.append((locale, candidate, pending))
    return work


def collect_logs(paths, output):
    records = {}
    for path in paths:
        for line in Path(path).read_text().splitlines():
            if "UVPILOT_RECORD " not in line:
                continue
            payload = line.split("UVPILOT_RECORD ", 1)[1].strip()
            row = json.loads(base64.b64decode(payload, validate=True))
            validate_record(row)
            identity = row["record_id"]
            if identity in records and canonical(records[identity]) != canonical(row):
                raise ValueError("Conflicting duplicate checkpoint; refusing to overwrite evidence")
            records[identity] = row
    if not records:
        raise ValueError("No complete pilot records in logs; refusing empty checkpoint")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("".join(canonical(records[key]) + "\n" for key in sorted(records)))
    return len(records)


def summarize(paths):
    groups = {}
    seen = set()
    for path in paths:
        for line in Path(path).read_text().splitlines():
            row = json.loads(line)
            validate_record(row)
            if row["record_id"] in seen:
                continue
            seen.add(row["record_id"])
            group = groups.setdefault((row["engine"], row["locale"], row["candidate"]), Counter())
            group["records"] += 1
            checks = automatic_checks(row["source"], row["translation"], row["locale"], row["key"])
            for flag, fails in {"empty": not checks["nonempty"], "protected_tokens": not checks["protected_tokens_identical"],
                "english_unchanged": checks["untranslated_source"], "length_ratio": not 0.5 <= checks["length_ratio"] <= 2.5,
                "wrong_script": checks["expected_script_ratio"] is not None and checks["expected_script_ratio"] < 0.6,
                "known_semantic_errors": bool(checks["known_semantic_errors"]), "marker_restore": not row["marker_restore_ok"], "truncated": row["truncated"]}.items():
                group[flag] += int(fails)
    return {"approved": 0, "review_required": True, "groups": [{"engine": engine, "locale": locale, "candidate": candidate, **counts}
        for (engine, locale, candidate), counts in sorted(groups.items())]}


def convert(engine, model_dir):
    actions_only()
    from ctranslate2.converters import TransformersConverter
    config = ENGINES[engine]
    model_dir.parent.mkdir(parents=True, exist_ok=True)
    available = shutil.disk_usage(model_dir.parent).free / (1024 ** 3)
    if available < config["minimum_free_gib"]:
        raise SystemExit(f"Insufficient runner disk for {engine}: {available:.1f} GiB; need {config['minimum_free_gib']}. No paid runner fallback.")
    converter = TransformersConverter(config["repository"], revision=config["revision"],
        low_cpu_mem_usage=True, load_as_float16=True, trust_remote_code=False)
    converter.convert(str(model_dir), quantization="int8")
    files = {}
    for path in model_dir.rglob("*"):
        if path.is_file():
            with path.open("rb") as handle:
                files[str(path.relative_to(model_dir))] = hashlib.file_digest(handle, "sha256").hexdigest()
    print("UVPILOT_MODEL " + canonical({"engine": engine, **config, "converted_sha256": files}), flush=True)


def run(args):
    actions_only()
    corpus = json.loads(Path(args.corpus).read_text())
    locales = args.locales.split(",") if args.locales else [key for key in corpus["locales"] if key != "en"]
    if len(set(locales)) != len(locales) or any(key not in corpus["locales"] or key == "en" for key in locales):
        raise SystemExit("Invalid pilot destination list")
    units = sorted((unit for unit in corpus["units"] if args.scope == "full" or unit["reference"]), key=lambda unit: (not unit["reference"], unit["key"]))
    expected_count = 40 if args.scope == "references" else corpus["fullSourceUnits"]
    if len(units) != expected_count or any(hashlib.sha256(unit["source"].encode()).hexdigest() != unit["source_hash"] for unit in units):
        raise SystemExit("Corpus mismatch or stale source hashes")
    completed = {}
    if args.resume:
        for line in Path(args.resume).read_text().splitlines():
            row = json.loads(line)
            validate_record(row)
            completed[row["record_id"]] = row
    work = pending_work(corpus, units, locales, args.engine, args.beam_size, completed)
    if args.engine == "m2m100" and "te" in locales:
        print("UVPILOT_UNSUPPORTED " + canonical({"engine": args.engine, "locale": "te", "reason": "M2M100 does not support Telugu"}), flush=True)
    if not work:
        print("UVPILOT_SUMMARY " + canonical({"engine": args.engine, "counts": {}, "scope": args.scope,
            "resumed": True, "conversion_seconds": 0, "approved": 0}), flush=True)
        return
    config = ENGINES[args.engine]
    model_dir = Path(os.environ["RUNNER_TEMP"]) / f"usefulverse-pilot-{args.engine}"
    started = time.monotonic()
    subprocess.run([sys.executable, __file__, "convert", "--engine", args.engine, "--model-dir", str(model_dir)], check=True)
    conversion_seconds = time.monotonic() - started
    import ctranslate2
    from transformers import M2M100Tokenizer, T5Tokenizer
    import langid
    from opencc import OpenCC
    tokenizer_cls = M2M100Tokenizer if args.engine == "m2m100" else T5Tokenizer
    tokenizer = tokenizer_cls.from_pretrained(config["repository"], revision=config["revision"], trust_remote_code=False)
    translator = ctranslate2.Translator(str(model_dir), device="cpu", inter_threads=1, intra_threads=min(4, os.cpu_count() or 1), compute_type="int8")
    opencc = OpenCC("s2twp")

    def translate(texts, source_locale, target_locale):
        target = ALIASES.get(target_locale, target_locale)
        protected = [queue.protect(text) for text in texts]
        if args.engine == "m2m100":
            tokenizer.src_lang = ALIASES.get(source_locale, source_locale)
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(text)) for text, _ in protected]
            options = {"target_prefix": [[f"__{target}__"]] * len(inputs)}
        else:
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(f"<2{target}> {text}")) for text, _ in protected]
            options = {}
        if any(len(tokens) > 512 for tokens in inputs):
            raise ValueError("Input exceeds pilot token budget; refusing truncation")
        outputs = translator.translate_batch(inputs, beam_size=args.beam_size, max_batch_size=args.batch_size,
            batch_type="examples", num_hypotheses=1, max_decoding_length=256, **options)
        result = []
        for output, (_, saved) in zip(outputs, protected, strict=True):
            tokens = output.hypotheses[0]
            raw = tokenizer.decode(tokenizer.convert_tokens_to_ids(tokens), skip_special_tokens=True)
            restored = queue.restore(raw, saved)
            if restored is not None and target_locale == "zh-TW": restored = opencc.convert(restored)
            result.append((restored, raw, len(tokens) >= 256))
        return result

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    counts = Counter()
    try:
        with output.open("a", encoding="utf-8") as handle:
            for locale, candidate, pending in work:
                for start in range(0, len(pending), args.batch_size):
                    batch = pending[start:start + args.batch_size]
                    tick = time.monotonic()
                    values = translate([unit["source"] for unit in batch], "en", locale) if candidate == "model" else [(unit["legacy"][locale], unit["legacy"][locale], False) for unit in batch]
                    back = translate([value or raw for value, raw, _ in values], locale, "en")
                    seconds = time.monotonic() - tick
                    for unit, (value, raw, truncated), (back_value, back_raw, back_truncated) in zip(batch, values, back, strict=True):
                        text = value if value is not None else raw
                        detected, confidence = langid.classify(text) if sum(char.isalpha() for char in text) >= 20 else (None, None)
                        row = {"format": FORMAT, "record_id": record_id(corpus, args.engine, locale, unit, candidate, args.beam_size),
                            "corpus_digest": corpus["sourceDigest"], "engine": args.engine, "engine_revision": config["revision"], "engine_license": config["license"],
                            "candidate": candidate, "locale": locale, "key": unit["key"], "tool": unit["tool"], "source": unit["source"], "source_hash": unit["source_hash"],
                            "translation": text, "raw_translation": raw, "back_translation": back_value or back_raw,
                            "marker_restore_ok": value is not None, "truncated": truncated or back_truncated,
                            "detected_language": detected, "language_detector_score": confidence,
                            "checks": automatic_checks(unit["source"], text, locale, unit["key"]), "seconds_per_batch_unit": seconds / len(batch),
                            "beam_size": args.beam_size, "status": "machine-draft", "reviewer": "", "reviewed_at": "",
                            "actions_run_id": os.environ.get("GITHUB_RUN_ID", ""), "actions_run_attempt": os.environ.get("GITHUB_RUN_ATTEMPT", ""),
                            "source_commit": os.environ.get("GITHUB_SHA", "")}
                        emit(row)
                        handle.write(canonical(row) + "\n")
                        handle.flush()
                        completed[row["record_id"]] = row
                        counts[candidate] += 1
                    print("UVPILOT_PROGRESS " + canonical({"engine": args.engine, "locale": locale, "candidate": candidate, "completed": dict(counts)}), flush=True)
        print("UVPILOT_SUMMARY " + canonical({"engine": args.engine, "counts": dict(counts), "scope": args.scope,
            "conversion_seconds": conversion_seconds, "total_seconds": time.monotonic() - started,
            "peak_rss_kib": resource.getrusage(resource.RUSAGE_SELF).ru_maxrss, "approved": 0}), flush=True)
    finally:
        translator.unload_model()
        shutil.rmtree(model_dir, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    conversion = sub.add_parser("convert")
    conversion.add_argument("--engine", choices=ENGINES, required=True)
    conversion.add_argument("--model-dir", required=True)
    collection = sub.add_parser("collect")
    collection.add_argument("--logs", nargs="+", required=True)
    collection.add_argument("--output", required=True)
    summary = sub.add_parser("summarize")
    summary.add_argument("--checkpoints", nargs="+", required=True)
    summary.add_argument("--output", required=True)
    work = sub.add_parser("run")
    work.add_argument("--engine", choices=ENGINES, required=True)
    work.add_argument("--corpus", required=True)
    work.add_argument("--output", required=True)
    work.add_argument("--scope", choices=["references", "full"], default="references")
    work.add_argument("--locales", default="")
    work.add_argument("--resume")
    work.add_argument("--batch-size", type=int, choices=range(1, 17), default=8)
    work.add_argument("--beam-size", type=int, choices=[1, 2, 3, 4], default=2)
    args = parser.parse_args()
    if args.command == "convert": convert(args.engine, Path(args.model_dir))
    elif args.command == "collect": print(canonical({"records": collect_logs(args.logs, Path(args.output)), "output": args.output}))
    elif args.command == "summarize": Path(args.output).write_text(json.dumps(summarize(args.checkpoints), ensure_ascii=False, indent=2) + "\n")
    else: run(args)


if __name__ == "__main__": main()
