#!/usr/bin/env python3
"""Resumable, local-only translation memory for new UsefulVerse tool copy.

The queue stores source strings and drafts in SQLite. It does not call a hosted
translation service. Machine translations remain drafts until explicitly approved.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sqlite3
import sys
import time
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = Path(os.environ.get("USEFULVERSE_M2M100_MODEL", ROOT / ".translation-models/m2m100-418M-int8"))
DB_PATH = Path(os.environ.get("USEFULVERSE_TRANSLATION_DB", ROOT / ".translation-data/translation-memory.sqlite3"))
HF_CACHE = Path(os.environ.get("HF_HOME", ROOT / ".hf-cache"))
MODEL_REVISION = "55c2e61bbf05dfb8d7abccdc3fae6fc8512fd636"
LANGUAGES = {
    "es": "es", "fr": "fr", "pt-BR": "pt", "de": "de", "ja": "ja",
    "ko": "ko", "id": "id", "hi": "hi", "ar": "ar", "zh-CN": "zh",
    "bn": "bn", "ru": "ru", "ur": "ur", "tr": "tr", "vi": "vi",
    "it": "it", "zh-TW": "zh", "bg": "bg", "ca": "ca", "nl": "nl",
    "el": "el", "ms": "ms", "pl": "pl", "sv": "sv", "th": "th",
    "uk": "uk", "sw": "sw", "mr": "mr", "ha": "ha", "fil": "tl",
    "ta": "ta", "fa": "fa", "am": "am", "gu": "gu", "nb-NO": "no", "te": "te",
}
PLACEHOLDER = re.compile(r"\{[A-Za-z][A-Za-z0-9_]*\}|https?://[^\s<>]+|`[^`]*`|</?[A-Za-z][^>]*>|UsefulVerse|Unicode|(?<![A-Za-z0-9_])\d+(?:[.,]\d+)*(?:%|°)?", re.IGNORECASE)
MARKER = re.compile(r"ZXQPH(\d{4})QXZ")


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA synchronous=FULL")
    db.execute("""CREATE TABLE IF NOT EXISTS strings (
        locale TEXT NOT NULL, key TEXT NOT NULL, context TEXT NOT NULL,
        source TEXT NOT NULL, source_hash TEXT NOT NULL, signature TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending', translation TEXT,
        engine TEXT, updated_at INTEGER,
        PRIMARY KEY(locale, key)
    )""")
    db.execute("CREATE INDEX IF NOT EXISTS strings_work ON strings(locale, status)")
    db.execute("""CREATE TABLE IF NOT EXISTS review_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        locale TEXT NOT NULL, key TEXT NOT NULL, source_hash TEXT NOT NULL,
        reviewer TEXT NOT NULL, reviewed_at TEXT NOT NULL, review_note TEXT NOT NULL DEFAULT ''
    )""")
    db.execute("CREATE INDEX IF NOT EXISTS review_events_lookup ON review_events(locale,key,source_hash,id)")
    db.execute("""CREATE TABLE IF NOT EXISTS memory (
        locale TEXT NOT NULL, source_hash TEXT NOT NULL, context TEXT NOT NULL,
        signature TEXT NOT NULL, translation TEXT NOT NULL, status TEXT NOT NULL,
        engine TEXT NOT NULL, updated_at INTEGER NOT NULL,
        PRIMARY KEY(locale, source_hash, context, signature)
    )""")
    return db


def digest(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def signature(text: str) -> str:
    return json.dumps(Counter(PLACEHOLDER.findall(text)), ensure_ascii=False, sort_keys=True)


def cmd_extract(args: argparse.Namespace) -> None:
    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    units = payload.get("units") if isinstance(payload, dict) else payload
    if not isinstance(units, list):
        raise SystemExit("Input must be a JSON array or {\"units\":[...]}; each unit needs key, source, context.")
    db = connect()
    added = changed = unchanged = 0
    with db:
        tool_id = payload.get("toolId") if isinstance(payload, dict) else None
        if tool_id:
            active_keys = [unit.get("key") for unit in units if isinstance(unit, dict) and isinstance(unit.get("key"), str)]
            old_keys = [row[0] for row in db.execute("SELECT DISTINCT key FROM strings WHERE key LIKE ?", (f"{tool_id}.%",))]
            stale_keys = sorted(set(old_keys) - set(active_keys))
            if stale_keys:
                db.executemany("DELETE FROM strings WHERE key=?", [(key,) for key in stale_keys])
        for unit in units:
            key, source = unit.get("key"), unit.get("source")
            context = unit.get("context", "")
            if not isinstance(key, str) or not key or not isinstance(source, str) or not source.strip():
                raise ValueError(f"Invalid translation unit: {unit!r}")
            source_hash = digest(source)
            signature_value = signature(source)
            for locale in unit.get("locales", LANGUAGES.keys()):
                if locale not in LANGUAGES:
                    raise ValueError(f"Unsupported product locale: {locale}")
                old = db.execute("SELECT source_hash,context,signature FROM strings WHERE locale=? AND key=?", (locale, key)).fetchone()
                if old and old == (source_hash, context, signature_value):
                    unchanged += 1
                    status = db.execute("SELECT status,translation FROM strings WHERE locale=? AND key=?", (locale, key)).fetchone()
                    if status and status[0] == "pending" and not status[1]:
                        cached = db.execute("SELECT translation,status,engine,updated_at FROM memory WHERE locale=? AND source_hash=? AND context=? AND signature=? AND status IN ('translated','approved')",
                                            (locale, source_hash, context, signature_value)).fetchone()
                        if cached:
                            db.execute("UPDATE strings SET status=?,translation=?,engine=?,updated_at=? WHERE locale=? AND key=?",
                                       (cached[1], cached[0], f"memory:{cached[2]}", cached[3], locale, key))
                    continue
                cached = db.execute("SELECT translation,status,engine FROM memory WHERE locale=? AND source_hash=? AND context=? AND signature=? AND status IN ('translated','approved')",
                                    (locale, source_hash, context, signature_value)).fetchone()
                status = "translated" if cached else "pending"
                db.execute("""INSERT INTO strings(locale,key,context,source,source_hash,signature,status,translation,engine,updated_at)
                    VALUES(?,?,?,?,?,?,?,?,?,?)
                    ON CONFLICT(locale,key) DO UPDATE SET context=excluded.context,source=excluded.source,
                    source_hash=excluded.source_hash,signature=excluded.signature,status=excluded.status,translation=excluded.translation,
                    engine=excluded.engine,updated_at=excluded.updated_at""",
                           (locale, key, context, source, source_hash, signature_value, status,
                            cached[0] if cached else None, f"memory:{cached[2]}" if cached else None, int(time.time()) if cached else None))
                if old: changed += 1
                else: added += 1
    print(json.dumps({"added": added, "changed_source_reset_to_pending": changed, "unchanged": unchanged, "database": str(DB_PATH)}))


def cmd_extract_batch(args: argparse.Namespace) -> None:
    """Import several independently keyed tool-copy files and prune their stale keys."""
    for input_path in args.inputs:
        cmd_extract(argparse.Namespace(input=input_path))


def cmd_import_drafts(args: argparse.Namespace) -> None:
    """Import existing localized copy as drafts; this command never approves a translation."""
    db = connect()
    imported = needs_review = stale = missing = approved_preserved = 0
    now = int(time.time())
    with db:
        with Path(args.input).open(encoding="utf-8") as handle:
            for line_number, line in enumerate(handle, 1):
                if not line.strip():
                    continue
                item = json.loads(line)
                locale, key = item.get("locale"), item.get("key")
                source, translation = item.get("source"), item.get("translation")
                if locale not in LANGUAGES or not isinstance(key, str) or not isinstance(source, str):
                    raise ValueError(f"Invalid draft record on line {line_number}")
                if not isinstance(translation, str) or not translation.strip():
                    needs_review += 1
                    continue
                current = db.execute(
                    "SELECT source,source_hash,signature,status FROM strings WHERE locale=? AND key=?",
                    (locale, key),
                ).fetchone()
                if not current:
                    missing += 1
                    continue
                if current[0] != source or current[1] != digest(source) or current[2] != signature(source):
                    stale += 1
                    continue
                if current[3] == "approved":
                    approved_preserved += 1
                    continue
                is_valid_draft = signature(translation) == current[2]
                status = "translated" if is_valid_draft else "needs-review"
                db.execute(
                    "UPDATE strings SET translation=?,status=?,engine=?,updated_at=? WHERE locale=? AND key=?",
                    (translation, status, "pending-tools-final:machine-draft", now, locale, key),
                )
                if is_valid_draft:
                    db.execute("""INSERT INTO memory(locale,source_hash,context,signature,translation,status,engine,updated_at)
                        SELECT locale,source_hash,context,signature,?,'translated','pending-tools-final:machine-draft',?
                        FROM strings WHERE locale=? AND key=?
                        ON CONFLICT(locale,source_hash,context,signature) DO UPDATE SET
                        translation=excluded.translation,status='translated',engine=excluded.engine,updated_at=excluded.updated_at
                        WHERE memory.status!='approved'""", (translation, now, locale, key))
                    imported += 1
                else:
                    needs_review += 1
    print(json.dumps({
        "drafts_imported": imported,
        "marker_or_empty_issues": needs_review,
        "stale_sources_skipped": stale,
        "missing_queue_keys": missing,
        "human_approved_rows_preserved": approved_preserved,
        "approved_by_import": 0,
    }))


def protect(text: str) -> tuple[str, list[str]]:
    saved = []
    def replace(match: re.Match[str]) -> str:
        marker = f"ZXQPH{len(saved):04d}QXZ"
        saved.append(match.group(0))
        return marker
    return PLACEHOLDER.sub(replace, text), saved


def restore(text: str, saved: list[str]) -> str | None:
    found = [int(value) for value in MARKER.findall(text)]
    if Counter(found) != Counter(range(len(saved))):
        return None
    for i, original in reversed(list(enumerate(saved))):
        text = text.replace(f"ZXQPH{i:04d}QXZ", original)
    return text.strip()


def cmd_translate(args: argparse.Namespace) -> None:
    selected = [args.locale] if args.locale else [locale for locale in LANGUAGES if locale != "te"]
    tool_pattern = f"{args.tool}.%" if getattr(args, "tool", None) else "%"
    if "te" in selected and selected != ["te"]:
        raise SystemExit("Run Telugu separately with `translate te`; it uses the pinned MADLAD model and a larger local memory footprint.")
    db = connect()
    for locale in selected:
        db.execute("UPDATE strings SET status='pending' WHERE locale=? AND status='running' AND key LIKE ?", (locale, tool_pattern))
    if not db.execute("SELECT 1 FROM strings WHERE locale IN (%s) AND status='pending' AND key LIKE ? LIMIT 1" % ",".join("?" for _ in selected), [*selected, tool_pattern]).fetchone():
        print("No pending strings for selected locale(s).")
        return
    try:
        import ctranslate2
        from transformers import M2M100Tokenizer, T5Tokenizer
    except ImportError as error:
        raise SystemExit(f"Translation environment is incomplete: {error}. Use the task-local .translation-env.")
    if selected == ["te"]:
        madlad_revision = os.environ.get("USEFULVERSE_MADLAD_REVISION", "fa184c675da0b5c9e1c8694fccd4e12e2d422094")
        madlad_dir = Path(os.environ.get("USEFULVERSE_MADLAD_MODEL", ROOT / ".translation-models/madlad400-3b-int8"))
        tokenizer_path = os.environ.get("USEFULVERSE_MADLAD_TOKENIZER", "google/madlad400-3b-mt")
        tokenizer_kwargs = {"revision": madlad_revision, "cache_dir": str(HF_CACHE)}
        tokenizer = T5Tokenizer.from_pretrained(tokenizer_path, **tokenizer_kwargs)
        translator = ctranslate2.Translator(str(madlad_dir), device="cpu", inter_threads=1,
                                             intra_threads=max(1, min(4, os.cpu_count() or 1)), compute_type="int8")
        engine_name = f"MADLAD400-3B@{madlad_revision}:CT2-int8"
    else:
        revision = os.environ.get("USEFULVERSE_M2M100_REVISION", MODEL_REVISION)
        tokenizer_path = os.environ.get("USEFULVERSE_M2M100_TOKENIZER", str(MODEL_DIR))
        if not (Path(tokenizer_path) / "vocab.json").is_file():
            cached_tokenizer = HF_CACHE / "hub/models--facebook--m2m100_418M/snapshots" / revision
            if (cached_tokenizer / "vocab.json").is_file():
                tokenizer_path = str(cached_tokenizer)
        tokenizer_kwargs = {} if (Path(tokenizer_path) / "vocab.json").is_file() else {
            "revision": revision, "cache_dir": str(HF_CACHE),
        }
        tokenizer = M2M100Tokenizer.from_pretrained(tokenizer_path, **tokenizer_kwargs)
        tokenizer.src_lang = "en"
        configured_threads = int(os.environ.get("USEFULVERSE_M2M100_THREADS", "4"))
        if configured_threads < 1:
            raise SystemExit("USEFULVERSE_M2M100_THREADS must be a positive integer.")
        translator = ctranslate2.Translator(str(MODEL_DIR), device="cpu", inter_threads=1,
                                            intra_threads=min(configured_threads, os.cpu_count() or 1), compute_type="int8")
        engine_name = f"M2M100@{revision}:CT2-int8"
    opencc = None
    if "zh-TW" in selected:
        from opencc import OpenCC
        opencc = OpenCC("s2twp")
    for locale in selected:
        success = review = batches = processed = 0
        while args.limit is None or processed < args.limit:
            batch_limit = args.batch_size if args.limit is None else min(args.batch_size, args.limit - processed)
            rows = db.execute("SELECT key,context,source,source_hash,signature FROM strings WHERE locale=? AND status='pending' AND key LIKE ? ORDER BY key LIMIT ?",
                              (locale, tool_pattern, batch_limit)).fetchall()
            if not rows:
                break
            with db:
                db.executemany("UPDATE strings SET status='running' WHERE locale=? AND key=? AND status='pending'",
                               [(locale, row[0]) for row in rows])
            try:
                prepared = [protect(row[2]) for row in rows]
                if locale == "te":
                    tokenized = [tokenizer.convert_ids_to_tokens(tokenizer.encode(f"<2{LANGUAGES[locale]}> {masked}")) for masked, _ in prepared]
                    translated = translator.translate_batch(tokenized, beam_size=2, max_batch_size=args.batch_size,
                                                            batch_type="tokens", num_hypotheses=1,
                                                            max_decoding_length=256)
                else:
                    tokenized = [tokenizer.convert_ids_to_tokens(tokenizer.encode(masked)) for masked, _ in prepared]
                    translated = translator.translate_batch(tokenized, target_prefix=[[f"__{LANGUAGES[locale]}__"]] * len(tokenized),
                                                            beam_size=2, max_batch_size=args.batch_size,
                                                            batch_type="tokens", num_hypotheses=1,
                                                            max_decoding_length=256)
            except Exception:
                with db:
                    db.executemany("UPDATE strings SET status='pending' WHERE locale=? AND key=? AND status='running'",
                                   [(locale, row[0]) for row in rows])
                raise
            now = int(time.time())
            with db:
                for row, (masked, saved), output in zip(rows, prepared, translated):
                    tokens = output.hypotheses[0]
                    token_ids = tokenizer.convert_tokens_to_ids(tokens)
                    value = tokenizer.decode(token_ids, skip_special_tokens=True)
                    value = restore(value, saved)
                    if value is not None and locale == "zh-TW":
                        value = opencc.convert(value)
                    if value is None or signature(value) != row[4] or not value.strip():
                        db.execute("UPDATE strings SET status='needs-review',engine=?,updated_at=? WHERE locale=? AND key=?",
                                   (engine_name, now, locale, row[0]))
                        review += 1
                        continue
                    db.execute("UPDATE strings SET status='translated',translation=?,engine=?,updated_at=? WHERE locale=? AND key=?",
                               (value, engine_name, now, locale, row[0]))
                    db.execute("""INSERT INTO memory(locale,source_hash,context,signature,translation,status,engine,updated_at)
                        VALUES(?,?,?,?,?,'translated',?,?) ON CONFLICT(locale,source_hash,context,signature)
                        DO UPDATE SET translation=excluded.translation,status='translated',engine=excluded.engine,updated_at=excluded.updated_at""",
                               (locale, row[3], row[1], row[4], value, engine_name, now))
                    success += 1
            processed += len(rows)
            batches += 1
        remaining = db.execute("SELECT count(*) FROM strings WHERE locale=? AND status='pending' AND key LIKE ?", (locale, tool_pattern)).fetchone()[0]
        print(json.dumps({"locale": locale, "translated_drafts": success, "needs_review": review, "batches_committed": batches, "remaining_pending": remaining}))


def cmd_review_export(args: argparse.Namespace) -> None:
    db = connect()
    rows = db.execute("""SELECT s.locale,s.key,s.context,s.source,s.translation,s.status,s.source_hash,s.engine,
        coalesce(r.reviewer,''),coalesce(r.reviewed_at,''),coalesce(r.review_note,'')
        FROM strings s LEFT JOIN review_events r ON r.id=(
          SELECT max(r2.id) FROM review_events r2 WHERE r2.locale=s.locale AND r2.key=s.key AND r2.source_hash=s.source_hash
        ) WHERE s.status IN ('pending','translated','needs-review','approved')
        AND (? IS NULL OR s.key LIKE ?) ORDER BY s.locale,s.key""", (args.tool, f"{args.tool}.%" if args.tool else "%"))
    with Path(args.output).open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["locale", "key", "context", "source_en", "translation", "status", "source_hash", "engine", "reviewer", "reviewed_at", "review_note"])
        writer.writerows(rows)
    print(f"Exported review rows to {args.output}")


def cmd_review_import(args: argparse.Namespace) -> None:
    db = connect()
    imported = stale = provenance_missing = 0
    inputs = []
    for value in args.inputs:
        path = Path(value)
        if path.is_dir():
            inputs.extend(sorted(path.glob("*.csv")))
        else:
            inputs.append(path)
    if not inputs:
        raise SystemExit("No review CSV files were supplied.")
    for path in inputs:
        with path.open(encoding="utf-8-sig", newline="") as handle, db:
            for row in csv.DictReader(handle):
                if row.get("status") != "approved":
                    continue
                reviewer = (row.get("reviewer") or "").strip()
                reviewed_at = (row.get("reviewed_at") or "").strip()
                review_note = (row.get("review_note") or "").strip()
                if not reviewer or len(reviewer) > 120 or any(ord(ch) < 32 for ch in reviewer):
                    provenance_missing += 1
                    continue
                try:
                    parsed_review_date = time.strptime(reviewed_at, "%Y-%m-%d")
                    if time.strftime("%Y-%m-%d", parsed_review_date) != reviewed_at:
                        raise ValueError("non-canonical date")
                except ValueError:
                    provenance_missing += 1
                    continue
                current = db.execute("SELECT source_hash,signature FROM strings WHERE locale=? AND key=?", (row["locale"], row["key"])).fetchone()
                translation = row.get("translation", "")
                if not current or current[0] != row.get("source_hash") or not translation.strip() or signature(translation) != current[1]:
                    stale += 1
                    continue
                now = int(time.time())
                db.execute("UPDATE strings SET translation=?,status='approved',engine='human-reviewed',updated_at=? WHERE locale=? AND key=?",
                           (translation, now, row["locale"], row["key"]))
                source = db.execute("SELECT source_hash,context,signature FROM strings WHERE locale=? AND key=?", (row["locale"], row["key"])).fetchone()
                db.execute("""INSERT INTO memory(locale,source_hash,context,signature,translation,status,engine,updated_at)
                    VALUES(?,?,?,?,?,'approved','human-reviewed',?) ON CONFLICT(locale,source_hash,context,signature)
                    DO UPDATE SET translation=excluded.translation,status='approved',engine=excluded.engine,updated_at=excluded.updated_at""",
                           (row["locale"], source[0], source[1], source[2], translation, now))
                latest_review = db.execute("SELECT reviewer,reviewed_at,review_note FROM review_events WHERE locale=? AND key=? AND source_hash=? ORDER BY id DESC LIMIT 1",
                                           (row["locale"], row["key"], source[0])).fetchone()
                if latest_review != (reviewer, reviewed_at, review_note):
                    db.execute("INSERT INTO review_events(locale,key,source_hash,reviewer,reviewed_at,review_note) VALUES(?,?,?,?,?,?)",
                               (row["locale"], row["key"], source[0], reviewer, reviewed_at, review_note))
                imported += 1
    print(json.dumps({"files_processed": len(inputs), "approved_imported": imported,
                      "stale_or_invalid_skipped": stale,
                      "missing_review_provenance_skipped": provenance_missing}, ensure_ascii=False))


def cmd_validate(args: argparse.Namespace) -> None:
    db = connect()
    summary = db.execute("SELECT locale,status,count(*) FROM strings GROUP BY locale,status ORDER BY locale,status").fetchall()
    issues = db.execute("SELECT locale,key,status FROM strings WHERE status NOT IN ('approved','exported') OR translation IS NULL OR trim(translation)='' LIMIT 20").fetchall()
    invalid = []
    for locale, key, source, translation, expected in db.execute("SELECT locale,key,source,translation,signature FROM strings WHERE translation IS NOT NULL"):
        if signature(translation) != expected:
            invalid.append((locale, key, "protected-token-signature"))
    result = {"counts": summary, "nonapproved_or_empty": issues, "token_mismatches": invalid[:20], "valid": not issues and not invalid}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if not result["valid"]:
        raise SystemExit(1)


def cmd_revalidate_drafts(args: argparse.Namespace) -> None:
    """Recheck machine drafts with the current placeholder rules, never approve them."""
    db = connect()
    locale_filter = args.locale
    candidates = db.execute(
        """SELECT locale,key,source,translation,signature,status FROM strings
           WHERE status IN ('translated','needs-review')
             AND (engine='pending-tools-final:machine-draft' OR engine LIKE 'M2M100@%'
                  OR engine LIKE 'memory:M2M100@%' OR engine LIKE 'MADLAD400%')
             AND translation IS NOT NULL AND trim(translation)!=''
             AND (? IS NULL OR locale=?)""",
        (locale_filter, locale_filter),
    ).fetchall()
    marked_translated = marked_for_review = stale_signature = 0
    now = int(time.time())
    with db:
        for locale,key,source,translation,stored_signature,status in candidates:
            expected = signature(source)
            if expected != stored_signature:
                stale_signature += 1
                continue
            is_safe = signature(translation) == expected
            next_status = 'translated' if is_safe else 'needs-review'
            if next_status == status:
                continue
            db.execute("UPDATE strings SET status=?,updated_at=? WHERE locale=? AND key=? AND status=?",
                       (next_status, now, locale, key, status))
            changed = db.execute("SELECT changes()").fetchone()[0]
            if next_status == 'translated':
                marked_translated += changed
            else:
                marked_for_review += changed
    print(json.dumps({"machineDraftsReclassifiedAsTranslated": marked_translated,
                      "machineDraftsMarkedForPlaceholderReview": marked_for_review,
                      "sourceSignatureMismatchesSkipped": stale_signature,
                      "approvedByThisCommand": 0}, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    extract = sub.add_parser("extract", help="Import stable-key English units into the local queue")
    extract.add_argument("input")
    extract.set_defaults(run=cmd_extract)
    extract_batch = sub.add_parser("extract-batch", help="Import multiple tool-copy files while pruning each tool's stale keys")
    extract_batch.add_argument("inputs", nargs="+")
    extract_batch.set_defaults(run=cmd_extract_batch)
    import_drafts = sub.add_parser("import-drafts", help="Import existing locale modules as reviewable drafts, never approvals")
    import_drafts.add_argument("input", help="UTF-8 JSONL with locale, key, source, and translation fields")
    import_drafts.set_defaults(run=cmd_import_drafts)
    translate = sub.add_parser("translate", help="Create local M2M100 drafts; resumable by locale")
    translate.add_argument("locale", nargs="?", choices=LANGUAGES)
    translate.add_argument("--resume", action="store_true", help="Resume from the first pending key (the default behavior)")
    translate.add_argument("--limit", type=int, default=None, help="Maximum rows per locale; by default translate every pending row in one model session")
    translate.add_argument("--batch-size", type=int, default=32)
    translate.add_argument("--tool", help="Limit translation to one stable tool-key prefix, such as ipa-transcriber")
    translate.set_defaults(run=cmd_translate)
    export = sub.add_parser("review-export", help="Export drafts with their source hash for review")
    export.add_argument("output")
    export.add_argument("--tool", help="Export only one candidate tool's copy package")
    export.set_defaults(run=cmd_review_export)
    imp = sub.add_parser("review-import", help="Import only explicitly approved, current-source rows")
    imp.add_argument("inputs", nargs="+", help="One or more review CSVs or a directory containing review CSVs")
    imp.set_defaults(run=cmd_review_import)
    validate = sub.add_parser("validate", help="Check completeness and protected values in the current batch")
    validate.set_defaults(run=cmd_validate)
    revalidate = sub.add_parser("revalidate-drafts", help="Clear false placeholder-review flags from safe machine drafts")
    revalidate.add_argument("--locale", choices=LANGUAGES, help="Limit revalidation to one destination locale")
    revalidate.set_defaults(run=cmd_revalidate_drafts)
    args = parser.parse_args()
    args.run(args)


if __name__ == "__main__":
    main()
