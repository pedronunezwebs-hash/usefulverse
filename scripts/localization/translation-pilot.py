#!/usr/bin/env python3
"""Measure pinned local translation models on Actions; never approve or publish copy."""
from __future__ import annotations

import argparse
import base64
from collections import Counter
from decimal import Decimal
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import resource
import shutil
import subprocess
import sys
import tempfile
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
CONTEXT_POLICY = json.loads(Path(__file__).with_name("pilot-context-policy.json").read_text())
POLICIES = {CONTEXT_POLICY["id"]: CONTEXT_POLICY, "context-v3": json.loads(Path(__file__).with_name("pilot-sentence-policy.json").read_text()), "context-v4": json.loads(Path(__file__).with_name("pilot-memory-policy.json").read_text())}
POLICIES["context-v5"] = json.loads(Path(__file__).with_name("pilot-coverage-policy.json").read_text())
POLICIES["context-v6"] = json.loads(Path(__file__).with_name("pilot-privacy-policy.json").read_text())
POLICIES["context-v7"] = json.loads(Path(__file__).with_name("pilot-technical-policy.json").read_text())
POLICIES["context-v8"] = json.loads(Path(__file__).with_name("pilot-explicit-negative-policy.json").read_text())
POLICIES["context-v9"] = json.loads(Path(__file__).with_name("pilot-quantity-memory-policy.json").read_text())
POLICIES["context-v10"] = json.loads(Path(__file__).with_name("pilot-whole-unit-policy.json").read_text())
POLICIES["context-v11"] = json.loads(Path(__file__).with_name("pilot-complete-sentence-policy.json").read_text())
POLICIES["context-v12"] = json.loads(Path(__file__).with_name("pilot-reviewed-language-policy.json").read_text())
POLICIES["context-v13"] = json.loads(Path(__file__).with_name("pilot-expanded-language-policy.json").read_text())
POLICIES["context-v14"] = json.loads(Path(__file__).with_name("pilot-shikaku-grammar-policy.json").read_text())
POLICIES["context-v15"] = json.loads(Path(__file__).with_name("pilot-device-performance-policy.json").read_text())
POLICIES["context-v16"] = json.loads(Path(__file__).with_name("pilot-korean-numeric-policy.json").read_text())
POLICIES["context-v17"] = json.loads(Path(__file__).with_name("pilot-korean-memory-policy.json").read_text())
POLICIES["context-v18"] = json.loads(Path(__file__).with_name("pilot-korean-expanded-memory-policy.json").read_text())
POLICIES["context-v19"] = json.loads(Path(__file__).with_name("pilot-indonesian-numeric-policy.json").read_text())
POLICIES["context-v20"] = json.loads(Path(__file__).with_name("pilot-indonesian-memory-policy.json").read_text())
POLICIES["context-v21"] = json.loads(Path(__file__).with_name("pilot-indonesian-expanded-memory-policy.json").read_text())
POLICIES["context-v22"] = json.loads(Path(__file__).with_name("pilot-chinese-numeric-policy.json").read_text())
TYPED_POLICIES = {"context-v10", "context-v11", "context-v12", "context-v13", "context-v14", "context-v15", "context-v16", "context-v17", "context-v18", "context-v19", "context-v20", "context-v21", "context-v22"}
SEMANTIC_REGRESSIONS = json.loads(Path(__file__).with_name("pilot-semantic-regressions.json").read_text())
TECHNICAL_TOKEN = re.compile(r"\.(?:dxf|dwg|png|svg|wav|mp3|pdf|json|csv|txt)\b|\b(?:ASCII|DXF|DWG|PNG|SVG|WAV|MP3|PDF|JSON|CSV|Unicode|KB|MB|GB|TB)\b", re.IGNORECASE)
SOFTWARE_VERSION = re.compile(r"(?<![\w.])\d+(?:\.\d+){2,}(?![\w.]\d)")
SOFTWARE_IDENTIFIER = re.compile(r"(?<!\w)(?:dxf-parser|loglevel|Web Audio)(?!\w)", re.IGNORECASE)
TYPED_LITERAL = re.compile(r"(?<![\w.])\d+(?:\.\d+){2,}(?![\w.]\d)|\((?:in|ft|mi|mm|cm|m|km|yd)\)")
OPAQUE_LITERAL = re.compile(r"https?://[^\s<>]+|`[^`]*`|\{[A-Za-z][A-Za-z0-9_]*\}|</?[A-Za-z][^>]*>")
COORDINATE = re.compile(r"\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*\)")
COORDINATE_SPAN = r"\(\s*[+-]?\d+(?:\.\d+)?\s*,\s*[+-]?\d+(?:\.\d+)?\s*\)"
TYPED_DATA_V7 = re.compile(rf"(?:{TYPED_LITERAL.pattern})|(?:{COORDINATE_SPAN})|(?:{SOFTWARE_IDENTIFIER.pattern})|\b[23]D\b|(?<!\w)[+-]?\d+(?:[.,]\d+)*(?:%|°)?(?!\w)", re.IGNORECASE)
NUMERIC_VALUE = re.compile(r"(?<![\w.])[+-]?\d+(?:[.,\u00a0\u202f ]\d+)*(?:%|°)?(?!\w)")


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def digest(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def policy_digest(policy):
    if policy == "baseline": return None
    if policy not in POLICIES: raise ValueError("Unknown inference policy")
    return digest(POLICIES[policy])


def translation_input(unit, policy):
    policy_digest(policy)
    entry = POLICIES[policy]["entries"].get(unit["key"]) if policy != "baseline" else None
    if entry:
        if any(unit.get(key) != entry[key] for key in ("source", "source_hash", "context")):
            raise ValueError("Stale contextual glossary; review changed source before translation")
        return entry["translation_input"]
    return unit["source"]


def reviewed_memory(unit, locale, policy):
    if policy == "baseline": return None
    policy_digest(policy)
    entry = POLICIES[policy].get("reviewed_memory", {}).get(unit["key"])
    if not entry or locale not in entry["translations"]: return None
    if any(unit.get(key) != entry[key] for key in ("source", "source_hash", "context")):
        raise ValueError("Stale reviewed memory; source and meaning must match exactly")
    return entry["translations"][locale]


def forward_with_memory(units, locale, policy, translate):
    memory = [reviewed_memory(unit, locale, policy) for unit in units]
    values = [(text, text, False) if text is not None else None for text in memory]
    if policy in TYPED_POLICIES:
        for i, text in enumerate(memory):
            if text is not None and not all(policy_typed_data_checks(units[i]["source"], text, "en", locale, policy).values()):
                values[i] = (None, text, False)
    traces = [None] * len(units)
    pending = [i for i, text in enumerate(memory) if text is None]
    if pending:
        model_traces = []
        model_values = translate([translation_input(units[i], policy) for i in pending], "en", locale, model_traces)
        for index, value, trace in zip(pending, model_values, model_traces if policy != "baseline" else [None] * len(pending), strict=True):
            values[index], traces[index] = value, trace
    return values, traces, memory


def record_id(corpus, engine, locale, unit, candidate, beam, policy="baseline"):
    identity = [FORMAT, corpus["sourceDigest"], engine, ENGINES[engine], locale, unit["key"], unit["source_hash"], unit["context"], candidate, beam, unit["legacy"].get(locale) if candidate == "legacy" else None]
    # Keep baseline IDs recoverable; a policy edit invalidates only its own experiment.
    if policy != "baseline": identity += [policy, policy_digest(policy)]
    return digest(identity)


def translate_literal_segments(texts, model_translate, traces=None):
    """Translate only prose. Copy known literal spans in their original positions, never guess a lost marker.

    Fragment boundaries can affect grammar; this experiment still requires linguistic review.
    The callback returns (raw model output, truncated) for each stripped prose fragment.
    """
    literal = re.compile(f"(?:{TECHNICAL_TOKEN.pattern})|(?:{queue.PLACEHOLDER.pattern})", re.IGNORECASE)
    plans, fragments = [], []
    for text in texts:
        plan, end = [], 0
        spans = [(m.start(), m.end()) for m in literal.finditer(text)] + [(len(text), len(text))]
        for start, stop in spans:
            prose = text[end:start]
            if any(char.isalpha() for char in prose):
                index = len(fragments)
                fragments.append(prose.strip())
                left = prose[:len(prose) - len(prose.lstrip())]
                right = prose[len(prose.rstrip()):]
                plan.append(("prose", index, left, right))
            else:
                plan.append(("literal", prose))
            if stop > start: plan.append(("literal", text[start:stop]))
            end = stop
        plans.append(plan)
    translated = model_translate(fragments) if fragments else []
    if len(translated) != len(fragments): raise ValueError("Model returned an incomplete segment batch")
    results = []
    for source, plan in zip(texts, plans, strict=True):
        pieces, truncated = [], False
        for part in plan:
            if part[0] == "literal": pieces.append(part[1])
            else:
                raw, cut = translated[part[1]]
                pieces.append(part[2] + raw.strip() + part[3])
                truncated |= cut
        raw = "".join(pieces)
        if traces is not None:
            traces.append([{"kind": "literal", "text": part[1]} if part[0] == "literal" else
                {"kind": "prose", "input": fragments[part[1]], "output": translated[part[1]][0],
                    "truncated": translated[part[1]][1], "leading_space": part[2], "trailing_space": part[3]} for part in plan])
        valid = bool(raw.strip()) and queue.signature(source) == queue.signature(raw) and Counter(TECHNICAL_TOKEN.findall(source)) == Counter(TECHNICAL_TOKEN.findall(raw))
        results.append((raw if valid else None, raw, truncated))
    return results


def translate_unmasked_sentences(texts, model_translate, traces=None):
    """Keep complete syntax and visible literals in model input. Reject damage, never repair it."""
    outputs = model_translate(texts)
    if len(outputs) != len(texts): raise ValueError("Model returned an incomplete sentence batch")
    results = []
    for source, (raw, cut) in zip(texts, outputs, strict=True):
        valid = bool(raw.strip()) and queue.signature(source) == queue.signature(raw) and Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(source)) == Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(raw))
        if traces is not None:
            traces.append([{"kind": "prose", "input": source, "output": raw, "truncated": cut,
                "leading_space": "", "trailing_space": ""}])
        results.append((raw if valid else None, raw, cut))
    return results


def segment_evidence_valid(trace, expected_input, assembled_output):
    """Audit stored model fragments independently of the inference policy's acceptance flag."""
    if not isinstance(trace, list): return False
    source, output = [], []
    for part in trace:
        if part.get("kind") == "literal":
            source.append(part["text"]); output.append(part["text"])
        elif part.get("kind") == "prose":
            if not part["input"].strip() or not part["output"].strip(): return False
            source.append(part["leading_space"] + part["input"] + part["trailing_space"])
            output.append(part["leading_space"] + part["output"].strip() + part["trailing_space"])
        else: return False
    return "".join(source) == expected_input and "".join(output) == assembled_output


def translate_covered_sentences(texts, model_translate, traces=None, literal_pattern=TYPED_LITERAL):
    """Cover every sentence, copying typed data at known source spans in either direction.

    Prose stays in complete sentences except at explicit version/unit data boundaries.
    These boundaries remain visible in the trace; no target-side repair or guessed marker.
    Nonempty output per sentence is necessary, not proof of preserved meaning.
    """
    plans, fragments = [], []
    for text in texts:
        plan, cursor = [], 0
        protected_spans = [(m.start(), m.end()) for m in queue.PLACEHOLDER.finditer(text)]
        # A period inside a URL, code span or numeric token cannot split a sentence.
        breaks = [(m.start(1), m.end(1)) for m in re.finditer(r"[.!?](\s+)(?=\S)", text)
            if not any(start <= m.start() < end for start, end in protected_spans)]
        opaque = [(m.start(), m.end()) for m in OPAQUE_LITERAL.finditer(text)]
        typed = opaque + [(m.start(), m.end()) for m in literal_pattern.finditer(text)
            if not any(start <= m.start() < end for start, end in opaque)]
        spans = sorted(typed + breaks) + [(len(text), len(text))]
        for start, end in spans:
            if start < cursor: continue
            prose = text[cursor:start]
            if any(char.isalpha() for char in prose):
                index = len(fragments); fragments.append(prose.strip())
                plan.append(("prose", index, prose[:len(prose)-len(prose.lstrip())], prose[len(prose.rstrip()):]))
            elif prose:
                plan.append(("literal", prose))
            if end > start: plan.append(("literal", text[start:end]))
            cursor = end
        plans.append(plan)
    outputs = model_translate(fragments) if fragments else []
    if len(outputs) != len(fragments): raise ValueError("Model returned an incomplete sentence batch")
    results = []
    for source, plan in zip(texts, plans, strict=True):
        trace = [{"kind": "literal", "text": part[1]} if part[0] == "literal" else
            {"kind": "prose", "input": fragments[part[1]], "output": outputs[part[1]][0],
                "truncated": outputs[part[1]][1], "leading_space": part[2], "trailing_space": part[3]} for part in plan]
        raw = "".join(part["text"] if part["kind"] == "literal" else
            part["leading_space"] + part["output"].strip() + part["trailing_space"] for part in trace)
        valid = bool(raw.strip()) and segment_evidence_valid(trace, source, raw)
        valid &= queue.signature(source) == queue.signature(raw)
        valid &= Counter(t.casefold() for t in TECHNICAL_TOKEN.findall(source)) == Counter(t.casefold() for t in TECHNICAL_TOKEN.findall(raw))
        valid &= Counter(literal_pattern.findall(source)) == Counter(literal_pattern.findall(raw))
        if traces is not None: traces.append(trace)
        results.append((raw if valid else None, raw, any(part.get("truncated", False) for part in trace)))
    return results


def translate_typed_data_sentences(texts, model_translate, traces=None):
    """v7 only: preserve whole quantities, coordinates and package names at source spans."""
    return translate_covered_sentences(texts, model_translate, traces, TYPED_DATA_V7)


def localized_audit_text(text, locale):
    # Hangul particles do not change an adjacent ASCII identifier or unit.
    # This view is audit-only: opaque data and stored/traced output stay exact.
    return re.sub(r"[\uac00-\ud7a3]", "~", text) if locale == "ko" else text


def numeric_prose(text, locale=None):
    prose = COORDINATE.sub(" ", SOFTWARE_VERSION.sub(" ", OPAQUE_LITERAL.sub(" ", text)))
    # Korean particles can adjoin a quantity. Mask syllables only in the audit,
    # retaining punctuation boundaries between quantities (2개와3개 must not merge).
    return localized_audit_text(prose, locale)


def coordinate_data(text):
    return [tuple(Decimal(value) for value in match.groups())
        for match in COORDINATE.finditer(OPAQUE_LITERAL.sub(" ", text))]


def numeric_data(text, locale):
    """Conservative audit of en/es/nb/ko numbers, separate from the strict literal contract.

    Coordinates have explicit English mathematical notation, including optional spacing.
    Local quantity separators are parsed only by a known grammar; malformed groups fail.
    No translated output is rewritten and no inference acceptance flag is relaxed.
    """
    if locale not in ("en", "es", "nb-NO", "ko"): return None
    if locale == "ko":
        # Compact/Sino-Korean multipliers are numerical content, not particles.
        # This decimal-only grammar rejects them instead of erasing or guessing.
        numeric_text = numeric_prose(text)
        if re.search(r"[0-9][0-9,.\s]*[십백천만억조경]", numeric_text): return None
        if re.search(r"(?:마이너스|플러스)\s*[0-9]", numeric_text): return None
        text = text.replace("\u2212", "-")
    coordinates = coordinate_data(text)
    prose = numeric_prose(text, locale)
    if locale == "ko":
        # CLDR latn snapshot: numeric-sources/context-v16/manifest.json. Strict
        # decimal subset; never guess compact/foreign digits or a skipped sign.
        if any(unicodedata.category(char).startswith("N") and char not in "0123456789" for char in prose): return None
        if re.search(r"[＋﹢﹣－–—‒⁺⁻±∓]\s*\d|[+-]\s*[+-]\s*\d", prose): return None
        covered = re.sub(r"\b\d+D\b", " ", TECHNICAL_TOKEN.sub(" ", prose))
        if re.search(r"\d", NUMERIC_VALUE.sub(" ", covered)): return None
    quantities = Counter()
    grouping, decimal = (",", ".") if locale in ("en", "ko") else ((".", ",") if locale == "es" else (" ", ","))
    group = re.escape(grouping)
    digit = r"[0-9]" if locale == "ko" else r"\d"
    grammar = rf"[+-]?(?:{digit}+|{digit}{{1,3}}(?:{group}{digit}{{3}})+)(?:{re.escape(decimal)}{digit}+)?"
    for match in NUMERIC_VALUE.finditer(prose):
        token = match.group().replace("\u00a0", " ").replace("\u202f", " ")
        suffix = token[-1] if token[-1] in "%°" else ""
        number = token[:-1] if suffix else token
        if not re.fullmatch(grammar, number): return None
        quantities[(Decimal(number.replace(grouping, "").replace(decimal, ".")), suffix)] += 1
    return quantities, coordinates


def typed_data_checks(source, target, source_locale, target_locale):
    """v10: whole-unit data contract, independent of the historical literal audit.

    Quantities may change spelling only if both known locale grammars prove equal
    values and multiplicity. Coordinates use explicit mathematical notation and order.
    No output is repaired. Unsupported numeric grammars fail closed, even for memory.
    """
    # Normalize a known mathematical minus before parsing, never in stored output.
    # Every remaining digit must belong to a recognized numeric token: word-bound
    # regex skips (e.g. 1e3/x999/999MB) must not masquerade as number-free prose.
    normalized = [text.replace("\u2212", "-") for text in (source, target)]
    prose = [re.sub(r"\b\d+D\b", " ", TECHNICAL_TOKEN.sub(" ", numeric_prose(text, locale)))
        for text, locale in zip(normalized, (source_locale, target_locale), strict=True)]
    coverage = all(not re.search(r"\d", NUMERIC_VALUE.sub(" ", text)) for text in prose)
    left, right = numeric_data(normalized[0], source_locale), numeric_data(normalized[1], target_locale)
    has_quantities = any(NUMERIC_VALUE.search(text) for text in prose)
    quantities = coverage and (not has_quantities or left is not None and right is not None and left[0] == right[0])
    opaque = lambda text: Counter(OPAQUE_LITERAL.findall(text))
    brands = lambda text: Counter(re.findall(r"UsefulVerse|Unicode", text, re.IGNORECASE))
    tokens = lambda pattern, text, locale: Counter(t.casefold() for t in pattern.findall(localized_audit_text(text, locale)))
    dimensions = lambda text, locale: Counter(re.findall(r"\b\d+D\b", localized_audit_text(OPAQUE_LITERAL.sub(" ", text), locale)))
    units = lambda text: Counter(re.findall(r"\((?:in|ft|mi|mm|cm|m|km|yd)\)", text))
    return {"nonempty": bool(target.strip()), "quantities": quantities,
        "coordinates": coordinate_data(source) == coordinate_data(target),
        "opaque_literals": opaque(source) == opaque(target), "brands": brands(source) == brands(target),
        "versions": Counter(SOFTWARE_VERSION.findall(source)) == Counter(SOFTWARE_VERSION.findall(target)),
        "software_identifiers": tokens(SOFTWARE_IDENTIFIER, source, source_locale) == tokens(SOFTWARE_IDENTIFIER, target, target_locale),
        "technical_tokens": tokens(TECHNICAL_TOKEN, source, source_locale) == tokens(TECHNICAL_TOKEN, target, target_locale),
        "dimensions": dimensions(source, source_locale) == dimensions(target, target_locale), "unit_symbols": units(source) == units(target)}


def translate_whole_units(texts, model_translate, source_locale, target_locale, traces=None):
    """v10 only: translate the whole content unit; retain raw damage without guessing."""
    outputs = model_translate(texts)
    if len(outputs) != len(texts): raise ValueError("Model returned an incomplete whole-unit batch")
    results = []
    for source, (raw, cut) in zip(texts, outputs, strict=True):
        valid = not cut and all(typed_data_checks(source, raw, source_locale, target_locale).values())
        if traces is not None:
            traces.append([{"kind": "prose", "input": source, "output": raw, "truncated": cut,
                "leading_space": "", "trailing_space": ""}])
        results.append((raw if valid else None, raw, cut))
    return results


def typed_record_evidence(row):
    policy = row.get("inference_policy", "baseline")
    return {"input": policy_typed_data_checks(row["source"], row["model_input"], "en", "en", policy),
        "forward": policy_typed_data_checks(row["source"], row["translation"], "en", row["locale"], policy),
        "back": policy_typed_data_checks(row["translation"], row["back_translation"], row["locale"], "en", policy)}


def id_version_matches_v19(text):
    # A valid grouped id decimal must not be erased as a software version.
    # Ambiguous 1.234.567 is conservatively numeric; an opaque code span is exact.
    return [m for m in SOFTWARE_VERSION.finditer(text)
        if not re.fullmatch(r"[0-9]{1,3}(?:\.[0-9]{3})+", m.group())
        and not re.match(r",[0-9]", text[m.end():])]


def numeric_data_id_v19(text):
    """Pinned CLDR Indonesian decimal subset, never a default or historical parser."""
    text = text.replace("\u2212", "-")
    prose = COORDINATE.sub(" ", OPAQUE_LITERAL.sub(" ", text))
    for match in reversed(id_version_matches_v19(prose)):
        prose = prose[:match.start()] + " " + prose[match.end():]
    if any(unicodedata.category(char).startswith("N") and char not in "0123456789" for char in prose): return None
    if re.search(r"[＋﹢﹣－–—‒⁺⁻±∓]\s*\d|[+-]\s*[+-]\s*\d", prose): return None
    # CLDR compact/RBNF forms need a different parser. Never read 200 ribu as 200.
    if re.search(r"[0-9][0-9,.\s]*\s*(?:ribu|rb|juta|jt|miliar|triliun|kuadriliun|ratus|puluh|belas)\b", prose, re.IGNORECASE): return None
    if re.search(r"[0-9][0-9,.\s]*\s*[MT]\b", prose): return None
    if re.search(r"\b(?:negatif|minus|plus|positif)\s*[0-9]", prose, re.IGNORECASE): return None
    covered = re.sub(r"\b\d+D\b", " ", TECHNICAL_TOKEN.sub(" ", prose))
    if re.search(r"\d", NUMERIC_VALUE.sub(" ", covered)): return None
    quantities = Counter()
    grammar = r"[+-]?(?:[0-9]+|[0-9]{1,3}(?:\.[0-9]{3})+)(?:,[0-9]+)?"
    for match in NUMERIC_VALUE.finditer(prose):
        token = match.group()
        suffix = token[-1] if token[-1] in "%°" else ""
        number = token[:-1] if suffix else token
        if not re.fullmatch(grammar, number): return None
        quantities[(Decimal(number.replace(".", "").replace(",", ".")), suffix)] += 1
    return quantities, coordinate_data(text)


def policy_typed_data_checks(source, target, source_locale, target_locale, policy):
    if policy == "context-v22":
        return chinese_typed_data_checks_v22(source, target, source_locale, target_locale)
    result = typed_data_checks(source, target, source_locale, target_locale)
    if policy not in ("context-v19", "context-v20", "context-v21") or "id" not in (source_locale, target_locale): return result
    profile = POLICIES[policy]["numeric_profile"]
    manifest = ROOT / "docs/quality/translation-pilot/numeric-sources/context-v19/manifest.json"
    if profile != {"id": "id-decimal-v1", "locale": "id", "manifest": str(manifest.relative_to(ROOT)),
            "manifest_sha256": hashlib.sha256(manifest.read_bytes()).hexdigest()}:
        raise ValueError("Changed or unbound Indonesian numeric profile")
    values = [numeric_data_id_v19(text) if locale == "id" else numeric_data(text.replace("\u2212", "-"), locale)
        for text, locale in zip((source, target), (source_locale, target_locale), strict=True)]
    result["quantities"] = all(value is not None for value in values) and values[0][0] == values[1][0]
    versions = [Counter(m.group() for m in id_version_matches_v19(text)) if locale == "id" else Counter(SOFTWARE_VERSION.findall(text))
        for text, locale in zip((source, target), (source_locale, target_locale), strict=True)]
    result["versions"] = versions[0] == versions[1]
    return result


def complete_sentence_parts(text):
    """Conservative punctuation boundaries, never inside URL/code/tag/version/data spans.

    Ambiguous punctuation inside opaque data stays in the same unit. This is a
    reproducible segmentation rule for the pilot, not a universal language parser.
    """
    spans = [(m.start(), m.end()) for pattern in (OPAQUE_LITERAL, SOFTWARE_VERSION, COORDINATE, NUMERIC_VALUE)
        for m in pattern.finditer(text)]
    boundaries = [m.start(1) for m in re.finditer(r"[.!?](\s+)(?=\S)", text)
        if not any(start <= m.start() < end for start, end in spans)] + [len(text)]
    parts, cursor = [], 0
    for end in boundaries:
        source = text[cursor:end]
        if source.strip():
            parts.append((source[:len(source)-len(source.lstrip())], source.strip(), source[len(source.rstrip()):]))
        cursor = end
    return parts


def complete_sentence_evidence_valid(trace, source, raw, source_locale, target_locale):
    if not segment_evidence_valid(trace, source, raw): return False
    expected = complete_sentence_parts(source)
    if not expected or len(trace) != len(expected): return False
    for part, (leading, text, trailing) in zip(trace, expected, strict=True):
        if part.get("kind") != "prose" or (part.get("leading_space"), part.get("input"), part.get("trailing_space")) != (leading, text, trailing): return False
        if part.get("truncated") or not all(typed_data_checks(text, part["output"], source_locale, target_locale).values()): return False
    return True


def translate_complete_sentences(texts, model_translate, source_locale, target_locale, traces=None):
    """v11 only: translate complete sentences with exact attempted-source coverage."""
    plans = [complete_sentence_parts(text) for text in texts]
    sentences = [part[1] for plan in plans for part in plan]
    outputs = model_translate(sentences) if sentences else []
    if len(outputs) != len(sentences): raise ValueError("Model returned an incomplete complete-sentence batch")
    results, cursor = [], 0
    for source, plan in zip(texts, plans, strict=True):
        trace = [{"kind": "prose", "input": text, "output": outputs[cursor+i][0], "truncated": outputs[cursor+i][1],
            "leading_space": leading, "trailing_space": trailing} for i, (leading, text, trailing) in enumerate(plan)]
        cursor += len(plan)
        raw = "".join(part["leading_space"] + part["output"].strip() + part["trailing_space"] for part in trace)
        valid = all(typed_data_checks(source, raw, source_locale, target_locale).values())
        valid &= complete_sentence_evidence_valid(trace, source, raw, source_locale, target_locale)
        if traces is not None: traces.append(trace)
        results.append((raw if valid else None, raw, any(part["truncated"] for part in trace)))
    return results



def complete_sentence_evidence_valid_v19(trace, source, raw, source_locale, target_locale):
    if not segment_evidence_valid(trace, source, raw): return False
    expected = complete_sentence_parts(source)
    if not expected or len(trace) != len(expected): return False
    for part, (leading, text, trailing) in zip(trace, expected, strict=True):
        if part.get("kind") != "prose" or (part.get("leading_space"), part.get("input"), part.get("trailing_space")) != (leading, text, trailing): return False
        if part.get("truncated") or not all(policy_typed_data_checks(text, part["output"], source_locale, target_locale, "context-v19").values()): return False
    return True


def translate_complete_sentences_v19(texts, model_translate, source_locale, target_locale, traces=None):
    """v19 independent version: translate complete sentences with exact attempted-source coverage."""
    plans = [complete_sentence_parts(text) for text in texts]
    sentences = [part[1] for plan in plans for part in plan]
    outputs = model_translate(sentences) if sentences else []
    if len(outputs) != len(sentences): raise ValueError("Model returned an incomplete complete-sentence batch")
    results, cursor = [], 0
    for source, plan in zip(texts, plans, strict=True):
        trace = [{"kind": "prose", "input": text, "output": outputs[cursor+i][0], "truncated": outputs[cursor+i][1],
            "leading_space": leading, "trailing_space": trailing} for i, (leading, text, trailing) in enumerate(plan)]
        cursor += len(plan)
        raw = "".join(part["leading_space"] + part["output"].strip() + part["trailing_space"] for part in trace)
        valid = all(policy_typed_data_checks(source, raw, source_locale, target_locale, "context-v19").values())
        valid &= complete_sentence_evidence_valid_v19(trace, source, raw, source_locale, target_locale)
        if traces is not None: traces.append(trace)
        results.append((raw if valid else None, raw, any(part["truncated"] for part in trace)))
    return results



def chinese_audit_text_v22(text):
    # Audit-only boundaries; original output, opaque spans and traces stay exact.
    text = re.sub(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]", "~", text)
    return re.sub(r"(?<=[0-9])(?=(?:KB|MB|GB|TB)\b)", " ", text, flags=re.IGNORECASE)


def numeric_data_zh_v22(text):
    """Pinned CLDR latn decimal subset. Never silently erase numeric Han content."""
    text = text.replace("\u2212", "-")
    prose = COORDINATE.sub(" ", OPAQUE_LITERAL.sub(" ", text))
    # RBNF/spellout and compact notation have a different grammar. False-positive
    # lexical warnings are safer than accepting an unproved numerical conversion.
    # CLDR RBNF also uses 丗 (30), absent from Python Unicode Numeric_Value.
    if any((unicodedata.numeric(c, None) is not None and c not in "0123456789") or c == "丗" for c in prose): return None
    if re.search(r"(?:负|正)\s*[0-9]|[0-9]\s*点\s*[0-9]", prose): return None
    if any(unicodedata.category(c).startswith("N") and c not in "0123456789" for c in prose): return None
    if re.search(r"[＋﹢﹣－–—‒⁺⁻±∓]\s*\d|[+-]\s*[+-]\s*\d|[0-9]\s*[％‰]", prose): return None
    prose = SOFTWARE_VERSION.sub(" ", chinese_audit_text_v22(prose))
    covered = re.sub(r"\b\d+D\b", " ", TECHNICAL_TOKEN.sub(" ", prose))
    if re.search(r"\d", NUMERIC_VALUE.sub(" ", covered)): return None
    quantities = Counter()
    grammar = r"[+-]?(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)(?:\.[0-9]+)?"
    for match in NUMERIC_VALUE.finditer(prose):
        token = match.group(); suffix = token[-1] if token[-1] in "%°" else ""
        number = token[:-1] if suffix else token
        if not re.fullmatch(grammar, number): return None
        quantities[(Decimal(number.replace(",", "")), suffix)] += 1
    return quantities, coordinate_data(text)


def chinese_typed_data_checks_v22(source, target, source_locale, target_locale):
    result = typed_data_checks(source, target, source_locale, target_locale)
    if "zh-CN" not in (source_locale, target_locale): return result
    manifest = ROOT / "docs/quality/translation-pilot/numeric-sources/context-v22/manifest.json"
    if POLICIES["context-v22"]["numeric_profile"] != {"id": "zh-CN-decimal-v1", "locale": "zh-CN", "manifest": str(manifest.relative_to(ROOT)),
            "manifest_sha256": hashlib.sha256(manifest.read_bytes()).hexdigest()}:
        raise ValueError("Changed or unbound Chinese numeric profile")
    values = [numeric_data_zh_v22(text) if locale == "zh-CN" else numeric_data(text.replace("\u2212", "-"), locale)
        for text, locale in zip((source, target), (source_locale, target_locale), strict=True)]
    result["quantities"] = all(v is not None for v in values) and values[0][0] == values[1][0]
    # Technical word boundaries differ from numerical equality; never widen the
    # historical parser or normalize the stored opaque/code/placeholder contract.
    views = [chinese_audit_text_v22(text) if locale == "zh-CN" else localized_audit_text(text, locale)
        for text, locale in zip((source, target), (source_locale, target_locale), strict=True)]
    for key, pattern in (("versions", SOFTWARE_VERSION), ("software_identifiers", SOFTWARE_IDENTIFIER), ("technical_tokens", TECHNICAL_TOKEN)):
        result[key] = Counter(t.casefold() for t in pattern.findall(views[0])) == Counter(t.casefold() for t in pattern.findall(views[1]))
    dimensions = lambda text: Counter(re.findall(r"\b\d+D\b", OPAQUE_LITERAL.sub(" ", text)))
    result["dimensions"] = dimensions(views[0]) == dimensions(views[1])
    return result


def complete_sentence_evidence_valid_v22(trace, source, raw, source_locale, target_locale):
    if not segment_evidence_valid(trace, source, raw): return False
    expected = complete_sentence_parts(source)
    if not expected or len(trace) != len(expected): return False
    for part, (leading, text, trailing) in zip(trace, expected, strict=True):
        if part.get("kind") != "prose" or (part.get("leading_space"), part.get("input"), part.get("trailing_space")) != (leading, text, trailing): return False
        if part.get("truncated") or not all(policy_typed_data_checks(text, part["output"], source_locale, target_locale, "context-v22").values()): return False
    return True


def translate_complete_sentences_v22(texts, model_translate, source_locale, target_locale, traces=None):
    """v22 independent version: translate complete sentences with exact attempted-source coverage."""
    plans = [complete_sentence_parts(text) for text in texts]
    sentences = [part[1] for plan in plans for part in plan]
    outputs = model_translate(sentences) if sentences else []
    if len(outputs) != len(sentences): raise ValueError("Model returned an incomplete complete-sentence batch")
    results, cursor = [], 0
    for source, plan in zip(texts, plans, strict=True):
        trace = [{"kind": "prose", "input": text, "output": outputs[cursor+i][0], "truncated": outputs[cursor+i][1],
            "leading_space": leading, "trailing_space": trailing} for i, (leading, text, trailing) in enumerate(plan)]
        cursor += len(plan)
        raw = "".join(part["leading_space"] + part["output"].strip() + part["trailing_space"] for part in trace)
        valid = all(policy_typed_data_checks(source, raw, source_locale, target_locale, "context-v22").values())
        valid &= complete_sentence_evidence_valid_v22(trace, source, raw, source_locale, target_locale)
        if traces is not None: traces.append(trace)
        results.append((raw if valid else None, raw, any(part["truncated"] for part in trace)))
    return results



def semantic_issues(key, source_hash, translation, locale, direction="forward"):
    normalized = unicodedata.normalize("NFKC", translation).strip()
    return sorted({row["issue"] for row in SEMANTIC_REGRESSIONS if row["key"] == key
        and row.get("direction", "forward") == direction
        and row["source_hash"] == source_hash and row["locale"] == locale
        and (unicodedata.normalize("NFKC", row["translation"]).strip() == normalized if row.get("case_sensitive") else
            unicodedata.normalize("NFKC", row["translation"]).casefold().strip() == normalized.casefold())})


def automatic_checks(source, translation, locale, key=None, back_translation=None):
    letters = [char for char in translation if char.isalpha()]
    required_script = SCRIPTS.get(locale)
    script_ratio = None if not required_script or not letters else sum(required_script in unicodedata.name(char, "") for char in letters) / len(letters)
    unit_label = bool(key and key.startswith("dxf-viewer.fields.units."))
    unit_symbols = lambda text: Counter(re.findall(r"\(([^()]*)\)", text))
    # An exact signed source-token multiset is the explicit unlocalized data contract.
    # Otherwise parse only the target locale's grammar; do not guess ambiguous formats.
    literal_numeric_copy = Counter(NUMERIC_VALUE.findall(numeric_prose(source))) == Counter(NUMERIC_VALUE.findall(numeric_prose(translation)))
    source_data = numeric_data(source, "en")
    target_data = numeric_data(translation, "en" if literal_numeric_copy else locale)
    localized_target_data = numeric_data(translation, locale)
    back_data = None if back_translation is None else numeric_data(back_translation, "en")
    source_coordinates = coordinate_data(source)
    known_numeric_locale = locale in ("en", "es", "nb-NO", "ko")
    return {
        "numeric_notation": "source-literal" if literal_numeric_copy else locale if known_numeric_locale else None,
        "numeric_values_identical": None if not known_numeric_locale else source_data is not None and target_data is not None and source_data[0] == target_data[0],
        "localized_numeric_values_identical": None if not known_numeric_locale else source_data is not None and localized_target_data is not None and source_data[0] == localized_target_data[0],
        "coordinate_values_identical": None if not source_coordinates else source_coordinates == coordinate_data(translation),
        "back_numeric_values_identical": None if back_translation is None else source_data is not None and back_data is not None and source_data[0] == back_data[0],
        "back_coordinate_values_identical": None if back_translation is None or not source_coordinates else source_coordinates == coordinate_data(back_translation),
        "software_identifiers_identical": Counter(t.casefold() for t in SOFTWARE_IDENTIFIER.findall(source)) == Counter(t.casefold() for t in SOFTWARE_IDENTIFIER.findall(localized_audit_text(translation, locale))),
        "back_software_identifiers_identical": None if back_translation is None else Counter(t.casefold() for t in SOFTWARE_IDENTIFIER.findall(source)) == Counter(t.casefold() for t in SOFTWARE_IDENTIFIER.findall(back_translation)),
        "software_versions_identical": Counter(SOFTWARE_VERSION.findall(source)) == Counter(SOFTWARE_VERSION.findall(translation)),
        "back_software_versions_identical": None if back_translation is None else Counter(SOFTWARE_VERSION.findall(source)) == Counter(SOFTWARE_VERSION.findall(back_translation)),
        "unit_symbols_identical": None if not unit_label else unit_symbols(source) == unit_symbols(translation),
        "back_unit_symbols_identical": None if not unit_label or back_translation is None else unit_symbols(source) == unit_symbols(back_translation),
        "nonempty": bool(translation.strip()),
        "protected_tokens_identical": queue.signature(source) == queue.signature(translation),
        "technical_tokens_identical": Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(source)) == Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(localized_audit_text(translation, locale))),
        "back_technical_tokens_identical": None if back_translation is None else Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(source)) == Counter(token.casefold() for token in TECHNICAL_TOKEN.findall(back_translation)),
        "back_protected_tokens_identical": None if back_translation is None else queue.signature(source) == queue.signature(back_translation),
        "untranslated_source": source.casefold().strip() == translation.casefold().strip(),
        "length_ratio": round(len(translation) / max(1, len(source)), 3),
        "expected_script_ratio": script_ratio,
        "known_semantic_errors": semantic_issues(key, hashlib.sha256(source.encode()).hexdigest(), translation, locale),
        "known_back_semantic_errors": [] if back_translation is None else semantic_issues(key, hashlib.sha256(source.encode()).hexdigest(), back_translation, locale, "back"),
        "review_required": True,
    }


def validate_record(row):
    if row.get("format") != FORMAT or row.get("status") != "machine-draft":
        raise ValueError("Pilot records must remain machine-draft, never approved")
    if any(row.get(field) for field in ("reviewer", "reviewed_at", "approved")):
        raise ValueError("Machine output cannot create review provenance")
    if row.get("engine") not in ENGINES or row.get("engine_revision") != ENGINES[row["engine"]]["revision"]:
        raise ValueError("Unknown or changed model revision")
    policy = row.get("inference_policy", "baseline")
    if policy != "baseline":
        if row.get("policy_digest") != policy_digest(policy):
            raise ValueError("Changed inference policy in checkpoint")
        unit = {"key": row["key"], "source": row["source"], "source_hash": row["source_hash"], "context": row["context"]}
        expected_input = translation_input(unit, policy) if row["candidate"] == "model" else row["source"]
        if row.get("model_input") != expected_input:
            raise ValueError("Contextual input does not match reviewed source")
        memory = reviewed_memory(unit, row["locale"], policy) if row["candidate"] == "model" else None
        if memory is not None:
            if row.get("translation_origin") != "reviewed-memory" or row.get("translation") != memory or row.get("forward_segments") is not None:
                raise ValueError("Reviewed memory output/provenance mismatch")
            if row.get("memory_digest") != digest(POLICIES[policy]["reviewed_memory"][row["key"]]):
                raise ValueError("Reviewed memory revision mismatch")
    if row.get("source_hash") != hashlib.sha256(row["source"].encode()).hexdigest():
        raise ValueError("Stale source hash in checkpoint")
    if policy in TYPED_POLICIES:
        if row.get("typed_data_evidence") != typed_record_evidence(row):
            raise ValueError("Typed data evidence differs from the raw record")
        if not all(row["typed_data_evidence"]["input"].values()):
            raise ValueError("Controlled input changed canonical typed data")


def emit(row):
    validate_record(row)
    # Small complete records survive job failure/cancellation in Actions logs.
    print("UVPILOT_RECORD " + base64.b64encode(canonical(row).encode()).decode(), flush=True)


def actions_only():
    if os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("RUNNER_OS") != "Linux":
        raise SystemExit("Model download/inference is restricted to GitHub Actions Linux runners; not the Mac.")


def pending_work(corpus, units, locales, engine, beam, completed, policy="baseline"):
    work = []
    for locale in locales:
        if engine == "m2m100" and locale == "te":
            continue
        for candidate in ("model", "legacy"):
            pending = []
            for unit in units:
                if candidate == "legacy" and not unit["legacy"].get(locale):
                    continue
                identity = record_id(corpus, engine, locale, unit, candidate, beam, policy)
                previous = completed.get(identity)
                if previous:
                    validate_record(previous)
                    expected = {"corpus_digest": corpus["sourceDigest"], "engine": engine, "locale": locale,
                        "key": unit["key"], "source_hash": unit["source_hash"], "candidate": candidate, "beam_size": beam}
                    if policy != "baseline":
                        expected.update(inference_policy=policy, policy_digest=policy_digest(policy))
                    elif previous.get("inference_policy", "baseline") != "baseline":
                        raise ValueError("Contextual checkpoint cannot impersonate the baseline")
                    if any(previous.get(key) != value for key, value in expected.items()):
                        raise ValueError("Checkpoint identity does not match its contents")
                else:
                    pending.append(unit)
            if pending:
                work.append((locale, candidate, pending))
    return work


def collect_logs(paths, output):
    records = {}
    if output.exists():
        for line in output.read_text().splitlines():
            row = json.loads(line)
            validate_record(row)
            records[row["record_id"]] = row
    recovered = 0
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
            recovered += 1
    if not recovered:
        raise ValueError("No complete pilot records in logs; refusing empty checkpoint")
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=output.parent, delete=False) as handle:
            temporary = Path(handle.name)
            for key in sorted(records): handle.write(canonical(records[key]) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, output)
    finally:
        if temporary is not None: temporary.unlink(missing_ok=True)
    return len(records)


def record_flags(row):
    """Recompute warning flags from raw evidence, never trust old checkpoint audits."""
    checks = automatic_checks(row["source"], row["translation"], row["locale"], row["key"], row["back_translation"])
    flags = {"numeric_values": checks["numeric_values_identical"] is False,
                "localized_numeric_values": checks["localized_numeric_values_identical"] is False,
                "coordinate_values": checks["coordinate_values_identical"] is False,
                "back_numeric_values": checks["back_numeric_values_identical"] is False,
                "back_coordinate_values": checks["back_coordinate_values_identical"] is False,
                "software_identifiers": not checks["software_identifiers_identical"],
                "back_software_identifiers": checks["back_software_identifiers_identical"] is False,
                "software_versions": not checks["software_versions_identical"],
                "back_software_versions": checks["back_software_versions_identical"] is False,
                "unit_symbols": checks["unit_symbols_identical"] is False,
                "back_unit_symbols": checks["back_unit_symbols_identical"] is False, "empty": not checks["nonempty"], "protected_tokens": not checks["protected_tokens_identical"],
                "technical_tokens": not checks["technical_tokens_identical"], "english_unchanged": checks["untranslated_source"], "length_ratio": not 0.5 <= checks["length_ratio"] <= 2.5,
                "wrong_script": checks["expected_script_ratio"] is not None and checks["expected_script_ratio"] < 0.6,
                "known_semantic_errors": bool(checks["known_semantic_errors"]), "marker_restore": not row["marker_restore_ok"],
                "known_back_semantic_errors": bool(checks["known_back_semantic_errors"]),
                "back_technical_tokens": checks["back_technical_tokens_identical"] is False,
                "back_protected_tokens": checks["back_protected_tokens_identical"] is False, "back_marker_restore": not row.get("back_marker_restore_ok", True), "truncated": row["truncated"]}
    contextual = row.get("inference_policy", "baseline") != "baseline"
    if contextual:
        flags["forward_segment_evidence"] = row["candidate"] == "model" and row.get("translation_origin") != "reviewed-memory" and not segment_evidence_valid(row.get("forward_segments"), row["model_input"], row["raw_translation"])
        flags["back_segment_evidence"] = not segment_evidence_valid(row.get("back_segments"), row["translation"], row["back_translation"])
    if row.get("inference_policy") in TYPED_POLICIES:
        evidence = typed_record_evidence(row)
        flags["forward_typed_data"] = not all(evidence["forward"].values()) or not all(evidence["input"].values())
        flags["back_typed_data"] = not all(evidence["back"].values())
    if row.get("inference_policy") in {"context-v11", "context-v12", "context-v13", "context-v14", "context-v15", "context-v16", "context-v17", "context-v18"}:
        flags["forward_sentence_evidence"] = row["candidate"] == "model" and row.get("translation_origin") != "reviewed-memory" and not complete_sentence_evidence_valid(row.get("forward_segments"), row["model_input"], row["raw_translation"], "en", row["locale"])
        flags["back_sentence_evidence"] = not complete_sentence_evidence_valid(row.get("back_segments"), row["translation"], row["back_translation"], row["locale"], "en")
    if row.get("inference_policy") in ("context-v19", "context-v20", "context-v21"):
        flags["forward_sentence_evidence"] = row["candidate"] == "model" and row.get("translation_origin") != "reviewed-memory" and not complete_sentence_evidence_valid_v19(row.get("forward_segments"), row["model_input"], row["raw_translation"], "en", row["locale"])
        flags["back_sentence_evidence"] = not complete_sentence_evidence_valid_v19(row.get("back_segments"), row["translation"], row["back_translation"], row["locale"], "en")
    if row.get("inference_policy") == "context-v22":
        evidence = typed_record_evidence(row)
        # Use the same explicit v22 boundary contract in audit and inference;
        # preserve all historical flags and every damaged-token hard block.
        for flag, check in (("technical_tokens", "technical_tokens"), ("software_identifiers", "software_identifiers"), ("software_versions", "versions")):
            flags[flag] = not evidence["forward"][check]
            flags["back_" + flag] = not evidence["back"][check]
        flags["forward_sentence_evidence"] = row["candidate"] == "model" and row.get("translation_origin") != "reviewed-memory" and not complete_sentence_evidence_valid_v22(row.get("forward_segments"), row["model_input"], row["raw_translation"], "en", row["locale"])
        flags["back_sentence_evidence"] = not complete_sentence_evidence_valid_v22(row.get("back_segments"), row["translation"], row["back_translation"], row["locale"], "en")
    return flags


def audit_complete_model_warning_coverage(review, records):
    """Require all current model warnings, including later discoveries in old raw text.

    Historical supplements bind both original and supplemental review bytes. They
    cannot replace a rubric, approve a locale or change a historical gate.
    """
    audit_review_warnings(review, records, check_coverage=False)
    directory = ROOT / "docs/quality/translation-pilot"
    policy = review["inference_policy"]
    def identities(value):
        result = {identity for row in value["rows"] for identity in row["record_ids"]}
        if any(records[identity].get("inference_policy") != policy or records[identity]["candidate"] != "model" for identity in result):
            raise ValueError("Warning coverage must use model records from the same inference policy")
        return result
    def read_review(name, expected_sha=None):
        if not isinstance(name, str) or Path(name).name != name or not name.endswith(".json"):
            raise ValueError("Supplemental review must be a local JSON basename")
        raw = (directory / name).read_bytes()
        if expected_sha is not None and hashlib.sha256(raw).hexdigest() != expected_sha:
            raise ValueError("Stale supplemental/original review byte hash")
        return json.loads(raw)
    covered = identities(review)
    for name in review.get("warning_coverage_supplemental_reviews", []):
        supplemental = read_review(name)
        if supplemental["inference_policy"] != policy:
            raise ValueError("Supplemental review has a different inference policy")
        audit_review_warnings(supplemental, records, check_coverage=False)
        covered.update(identities(supplemental))
    addenda_file = directory / "review-coverage-addenda.json"
    addenda = json.loads(addenda_file.read_text()) if addenda_file.exists() else []
    for entry in addenda:
        if entry["review_digest"] != digest(review): continue
        original = read_review(entry["review_file"], entry["review_file_sha256"])
        if digest(original) != digest(review):
            raise ValueError("Historical coverage addendum differs from the original review")
        supplemental = read_review(entry["supplemental_review"], entry["supplemental_review_sha256"])
        if supplemental["inference_policy"] != policy or supplemental.get("approved_locales") or any(
                gate.get("passed") for field in ["reference_gate", "full_gate"] for gate in supplemental.get(field, {}).values()):
            raise ValueError("Historical coverage cannot approve or override a gate or policy")
        added = identities(supplemental)
        if added & covered:
            raise ValueError("Historical coverage cannot replace an already reviewed record")
        audit_review_warnings(supplemental, records, check_coverage=False)
        covered.update(added)
    flagged = {identity for identity, row in records.items() if row.get("inference_policy") == policy
               and row["candidate"] == "model" and any(record_flags(row).values())}
    if not flagged <= covered:
        raise ValueError("An automatic warning outside the fixed sample was not reviewed")
    return covered


def historical_forward_withdrawals(review, records):
    """Read explicit downgrades of old perfect ratings without altering their evidence.

    This narrow mechanism only covers a newly fixture-confirmed forward defect in an
    already rejected historical review. It cannot approve, improve or silently regrade.
    """
    directory = ROOT / "docs/quality/translation-pilot"
    path = directory / "review-withdrawal-addenda.json"
    addenda = json.loads(path.read_text()) if path.exists() else []
    result, seen = [], set()
    judgments = {identity: row for row in review["rows"] for identity in row["record_ids"]}
    score_keys = {"meaning", "numbers_negations", "naturalness"}
    for item in addenda:
        if item.get("review_digest") != digest(review): continue
        name = item.get("review_file")
        if not isinstance(name, str) or Path(name).name != name or not name.endswith(".json"):
            raise ValueError("Withdrawal must bind a local original review basename")
        raw = (directory / name).read_bytes()
        if hashlib.sha256(raw).hexdigest() != item.get("review_file_sha256") or digest(json.loads(raw)) != digest(review):
            raise ValueError("Stale withdrawal original bytes or review digest")
        if (item.get("schema_version") != 1 or item.get("kind") != "historical-perfect-forward-score-withdrawal"
                or item.get("automatic_approval") is not False or item.get("approved_locales") != []
                or item.get("native_review") is not False or item.get("review_kind") != "agent"
                or not item.get("reason", "").strip() or not item.get("reviewer", "").strip()
                or not item.get("reviewed_at_utc", "").strip() or not item.get("entries")):
            raise ValueError("Withdrawal requires explicit non-approving agent provenance and reason")
        if review.get("approved_locales") or any(gate.get("passed") for field in ["reference_gate", "full_gate"] for gate in review.get(field, {}).values()):
            raise ValueError("Withdrawal cannot conceal an approved locale or passed historical gate")
        for entry in item["entries"]:
            identity = entry.get("record_id")
            if identity in seen or identity not in judgments or identity not in records:
                raise ValueError("Duplicate or unbound withdrawn record")
            seen.add(identity)
            row, original = records[identity], judgments[identity]
            validate_record(row)
            if row.get("candidate") != "model" or row.get("inference_policy") != review.get("inference_policy"):
                raise ValueError("Withdrawal must use the original model and policy")
            if any(entry.get(field) != row.get(field) for field in ["key", "locale", "source_hash", "context", "inference_policy"]):
                raise ValueError("Stale withdrawal source or semantic context")
            if any(entry.get(field + "_hash") != hashlib.sha256(row[field].encode()).hexdigest() for field in ["translation", "back_translation"]):
                raise ValueError("Stale withdrawal raw text hash")
            old, new = entry.get("original_scores", {}), entry.get("scores", {})
            if (old != original["scores"] or set(old) != score_keys or set(new) != score_keys
                    or any(type(old[key]) is not int or old[key] != 3 or type(new[key]) is not int or not 0 <= new[key] <= old[key] for key in score_keys)
                    or min(new.values()) == 3 or not entry.get("note", "").strip()):
                raise ValueError("Withdrawal must retain the exact old perfect score and only lower it")
            if not record_flags(row)["known_semantic_errors"]:
                raise ValueError("Withdrawal requires an independently observed permanent forward fixture")
            warning = entry.get("warning", {})
            if set(warning) != {"known_semantic_errors"}:
                raise ValueError("Withdrawal cannot override unrelated warning decisions")
            decision = warning["known_semantic_errors"]
            if decision.get("disposition") != "forward-defect" or decision.get("blocks_gate") is not True or not decision.get("note", "").strip():
                raise ValueError("Withdrawn forward defect must explicitly block the gate")
            result.append(entry)
    return result


def audit_review_warnings(review, records, check_coverage=True):
    """Require an exact, hash-bound decision for every warning before accepting a review.

    Back-translation defects are separate from forward quality. A known forward fixture
    cannot silently inherit full marks, as happened in the withdrawn v7 reference gate.
    This audit checks review consistency; it does not make a linguistic judgment.
    """
    expected = {}
    judgments = {}
    if len(review["rows"]) != review["expected_rows"]:
        raise ValueError("Review row count differs from its declared scope")
    for judgment in review["rows"]:
        if not judgment["record_ids"]:
            raise ValueError("Every rubric must be bound to observed records")
        for identity in judgment["record_ids"]:
            row = records[identity]
            if identity in judgments:
                raise ValueError("Duplicate record judgment in review")
            if any(judgment[field] != row[field] for field in ["key", "locale", "source_hash"]) or judgment["translation_hash"] != hashlib.sha256(row["translation"].encode()).hexdigest():
                raise ValueError("Stale rubric source or translation hash")
            flags = sorted(flag for flag, failed in record_flags(row).items() if failed)
            if flags: expected[identity] = (row, flags)
            judgments[identity] = judgment
    reconciliations = json.loads(json.dumps(review["warning_reconciliation"]))
    addenda_path = ROOT / "docs/quality/translation-pilot/review-warning-addenda.json"
    addenda = json.loads(addenda_path.read_text()) if addenda_path.exists() else []
    for addendum in addenda:
        if addendum["review_digest"] != digest(review): continue
        # Preserve historical review bytes. Only newly observed back defects can
        # supplement an exact old review; no rubric/gate/forward override is allowed.
        for entry in addendum["warning_reconciliation"]:
            if any(not (flag.startswith("back_") or flag == "known_back_semantic_errors") or
                    decision["disposition"] != "back-defect" or decision["blocks_gate"]
                    for flag, decision in entry["warnings"].items()):
                raise ValueError("Historical addenda can only record non-gating back defects")
            previous = next((r for r in reconciliations if r["record_id"] == entry["record_id"]), None)
            if previous:
                if any(previous[field] != entry[field] for field in ["translation_hash", "back_translation_hash"]) or set(previous["warnings"]) & set(entry["warnings"]):
                    raise ValueError("Historical addendum cannot replace an existing decision")
                previous["warnings"].update(entry["warnings"])
            else: reconciliations.append(entry)
    for withdrawal in historical_forward_withdrawals(review, records):
        identity = withdrawal["record_id"]
        # The original remains visible and immutable; only this audit uses the
        # explicit negative reassessment to prevent inheriting its false full marks.
        judgments[identity] = {**judgments[identity], "scores": withdrawal["scores"]}
        existing = next((entry for entry in reconciliations if entry["record_id"] == identity), None)
        if existing:
            if set(existing["warnings"]) & set(withdrawal["warning"]):
                raise ValueError("Withdrawal cannot replace an existing warning decision")
            existing["warnings"].update(withdrawal["warning"])
        else:
            reconciliations.append({"record_id": identity,
                **{field + "_hash": withdrawal[field + "_hash"] for field in ["translation", "back_translation"]},
                "warnings": withdrawal["warning"]})
    resolutions = {entry["record_id"]: entry for entry in reconciliations}
    if len(resolutions) != len(reconciliations) or set(resolutions) != set(expected):
        raise ValueError("Missing, extra or duplicate warning reconciliation")
    for identity, (row, flags) in expected.items():
        entry = resolutions[identity]
        for field in ["translation", "back_translation"]:
            if entry.get(field + "_hash") != hashlib.sha256(row[field].encode()).hexdigest():
                raise ValueError("Stale warning reconciliation text hash")
        if set(entry["warnings"]) != set(flags):
            raise ValueError("Every current warning needs an explicit reconciliation")
        for flag, decision in entry["warnings"].items():
            disposition = decision.get("disposition")
            if disposition not in {"forward-defect", "back-defect", "reviewed-signal"} or not decision.get("note", "").strip() or type(decision.get("blocks_gate")) is not bool:
                raise ValueError("Warning decision needs disposition, note and explicit gate effect")
            if flag == "known_semantic_errors" and disposition != "forward-defect":
                raise ValueError("A known forward fixture cannot be silently accepted")
            # Only a recomputed, fully valid v10 contract can explain a historical
            # numeric-token spelling difference. Other policies and damaged tokens
            # retain their hard block. Stored acceptance flags are never trusted.
            quantity_only_signal = flag == "protected_tokens" and row.get("inference_policy") in TYPED_POLICIES and all(typed_record_evidence(row)["forward"].values()) and all(typed_record_evidence(row)["input"].values())
            if not quantity_only_signal and flag in {"numeric_values", "localized_numeric_values", "coordinate_values", "empty", "protected_tokens", "technical_tokens",
                    "software_identifiers", "software_versions", "unit_symbols", "marker_restore", "forward_segment_evidence", "forward_typed_data", "forward_sentence_evidence"}:
                if disposition != "forward-defect" or not decision["blocks_gate"]:
                    raise ValueError("A broken forward data contract must block the gate")
            if disposition == "forward-defect" and min(judgments[identity]["scores"].values()) == 3:
                raise ValueError("Forward defect contradicts a perfect rubric")
            if disposition == "back-defect" and not flag.startswith("back_") and flag != "known_back_semantic_errors":
                raise ValueError("A forward warning cannot be dismissed as a back defect")
            gate = review.get("reference_gate", review.get("full_gate", {})).get(row["locale"], {})
            if decision["blocks_gate"] and gate.get("passed"):
                raise ValueError("Passed gate contradicts a blocking warning")
    if check_coverage and review.get("requires_complete_model_warning_coverage"):
        audit_complete_model_warning_coverage(review, records)
    return len(expected)


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
            group = groups.setdefault((row.get("inference_policy", "baseline"), row["engine"], row["locale"], row["candidate"]), Counter())
            group["records"] += 1
            group["reviewed_memory_hits"] += int(row.get("translation_origin") == "reviewed-memory")
            for flag, fails in record_flags(row).items():
                group[flag] += int(fails)
    return {"approved": 0, "review_required": True, "groups": [{"inference_policy": policy, "engine": engine, "locale": locale, "candidate": candidate, **counts}
        for (policy, engine, locale, candidate), counts in sorted(groups.items())]}


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
    policy = getattr(args, "policy", "baseline")
    policy_digest(policy)
    work = pending_work(corpus, units, locales, args.engine, args.beam_size, completed, policy)
    if args.engine == "m2m100" and "te" in locales:
        print("UVPILOT_UNSUPPORTED " + canonical({"engine": args.engine, "locale": "te", "reason": "M2M100 does not support Telugu"}), flush=True)
    if not work:
        print("UVPILOT_SUMMARY " + canonical({"engine": args.engine, "counts": {}, "scope": args.scope,
            "resumed": True, "conversion_seconds": 0, "approved": 0}), flush=True)
        return
    if policy in TYPED_POLICIES:
        for _, candidate, pending in work:
            for unit in pending:
                text = translation_input(unit, policy) if candidate == "model" else unit["source"]
                if not all(typed_data_checks(unit["source"], text, "en", "en").values()):
                    raise ValueError("Invalid canonical/controlled typed input before model download: " + unit["key"])
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

    def model_translate(texts, source_locale, target_locale):
        target = ALIASES.get(target_locale, target_locale)
        if args.engine == "m2m100":
            tokenizer.src_lang = ALIASES.get(source_locale, source_locale)
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(text)) for text in texts]
            options = {"target_prefix": [[f"__{target}__"]] * len(inputs)}
        else:
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(f"<2{target}> {text}")) for text in texts]
            options = {}
        if any(len(tokens) > 512 for tokens in inputs):
            raise ValueError("Input exceeds pilot token budget; refusing truncation")
        outputs = translator.translate_batch(inputs, beam_size=args.beam_size, max_batch_size=args.batch_size,
            batch_type="examples", num_hypotheses=1, max_decoding_length=256, **options)
        result = []
        for output in outputs:
            tokens = output.hypotheses[0]
            raw = tokenizer.decode(tokenizer.convert_tokens_to_ids(tokens), skip_special_tokens=True)
            result.append((raw, len(tokens) >= 256))
        return result

    def translate(texts, source_locale, target_locale, traces=None):
        if policy != "baseline":
            def prose_translate(prose):
                values = model_translate(prose, source_locale, target_locale)
                return [(opencc.convert(raw) if target_locale == "zh-TW" else raw, cut) for raw, cut in values]
            if POLICIES[policy]["protection"] == "full-sentence-literals-v1":
                return translate_unmasked_sentences(texts, prose_translate, traces)
            if POLICIES[policy]["protection"] == "whole-unit-typed-data-v1":
                return translate_whole_units(texts, prose_translate, source_locale, target_locale, traces)
            if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v3":
                return translate_complete_sentences_v22(texts, prose_translate, source_locale, target_locale, traces)
            if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v2":
                return translate_complete_sentences_v19(texts, prose_translate, source_locale, target_locale, traces)
            if POLICIES[policy]["protection"] == "complete-sentences-typed-data-v1":
                return translate_complete_sentences(texts, prose_translate, source_locale, target_locale, traces)
            if POLICIES[policy]["protection"] == "covered-sentences-typed-data-v1":
                return translate_covered_sentences(texts, prose_translate, traces)
            if POLICIES[policy]["protection"] == "covered-sentences-typed-data-v2":
                return translate_typed_data_sentences(texts, prose_translate, traces)
            return translate_literal_segments(texts, prose_translate, traces)
        protected = [queue.protect(text) for text in texts]
        outputs = model_translate([text for text, _ in protected], source_locale, target_locale)
        result = [(queue.restore(raw, saved), raw, cut) for (raw, cut), (_, saved) in zip(outputs, protected, strict=True)]
        return [(opencc.convert(value) if value is not None and target_locale == "zh-TW" else value, raw, cut) for value, raw, cut in result]

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    counts = Counter()
    try:
        with output.open("a", encoding="utf-8") as handle:
            for locale, candidate, pending in work:
                for start in range(0, len(pending), args.batch_size):
                    batch = pending[start:start + args.batch_size]
                    tick = time.monotonic()
                    forward_traces, back_traces = [], []
                    if candidate == "model":
                        values, forward_traces, memory = forward_with_memory(batch, locale, policy, translate)
                    else:
                        values = [(unit["legacy"][locale], unit["legacy"][locale], False) for unit in batch]
                        memory = [None] * len(batch)
                    back = translate([value or raw for value, raw, _ in values], locale, "en", back_traces)
                    seconds = time.monotonic() - tick
                    for index, (unit, (value, raw, truncated), (back_value, back_raw, back_truncated)) in enumerate(zip(batch, values, back, strict=True)):
                        text = value if value is not None else raw
                        detected, confidence = langid.classify(text) if sum(char.isalpha() for char in text) >= 20 else (None, None)
                        row = {"format": FORMAT, "record_id": record_id(corpus, args.engine, locale, unit, candidate, args.beam_size, policy),
                            "corpus_digest": corpus["sourceDigest"], "engine": args.engine, "engine_revision": config["revision"], "engine_license": config["license"],
                            "candidate": candidate, "locale": locale, "key": unit["key"], "tool": unit["tool"], "source": unit["source"], "source_hash": unit["source_hash"],
                            "translation": text, "raw_translation": raw, "back_translation": back_value or back_raw,
                            "marker_restore_ok": value is not None, "back_marker_restore_ok": back_value is not None, "truncated": truncated or back_truncated,
                            "detected_language": detected, "language_detector_score": confidence,
                            "checks": automatic_checks(unit["source"], text, locale, unit["key"], back_value or back_raw), "seconds_per_batch_unit": seconds / len(batch),
                            "beam_size": args.beam_size, "status": "machine-draft", "reviewer": "", "reviewed_at": "",
                            "actions_run_id": os.environ.get("GITHUB_RUN_ID", ""), "actions_run_attempt": os.environ.get("GITHUB_RUN_ATTEMPT", ""),
                            "source_commit": os.environ.get("GITHUB_SHA", "")}
                        if policy != "baseline":
                            row.update(inference_policy=policy, policy_digest=policy_digest(policy), context=unit["context"],
                                model_input=translation_input(unit, policy) if candidate == "model" else unit["source"],
                                protection=POLICIES[policy]["protection"], forward_segments=forward_traces[index] if candidate == "model" else None,
                                back_segments=back_traces[index], translation_origin="reviewed-memory" if memory[index] is not None else candidate,
                                memory_digest=digest(POLICIES[policy]["reviewed_memory"][unit["key"]]) if memory[index] is not None else None)
                        if memory[index] is not None: counts["reviewed_memory_hits"] += 1
                        if policy in TYPED_POLICIES: row["typed_data_evidence"] = typed_record_evidence(row)
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
    audit = sub.add_parser("audit-review")
    audit.add_argument("--review", required=True)
    audit.add_argument("--checkpoints", nargs="+", required=True)
    work = sub.add_parser("run")
    work.add_argument("--engine", choices=ENGINES, required=True)
    work.add_argument("--corpus", required=True)
    work.add_argument("--output", required=True)
    work.add_argument("--scope", choices=["references", "full"], default="references")
    work.add_argument("--locales", default="")
    work.add_argument("--resume")
    work.add_argument("--policy", choices=["baseline", *POLICIES], default="baseline")
    work.add_argument("--batch-size", type=int, choices=range(1, 17), default=8)
    work.add_argument("--beam-size", type=int, choices=[1, 2, 3, 4], default=2)
    args = parser.parse_args()
    if args.command == "convert": convert(args.engine, Path(args.model_dir))
    elif args.command == "collect": print(canonical({"records": collect_logs(args.logs, Path(args.output)), "output": args.output}))
    elif args.command == "summarize": Path(args.output).write_text(json.dumps(summarize(args.checkpoints), ensure_ascii=False, indent=2) + "\n")
    elif args.command == "audit-review":
        records = {row["record_id"]: row for path in args.checkpoints for row in map(json.loads, Path(path).read_text().splitlines())}
        for row in records.values(): validate_record(row)
        print(canonical({"warning_records_reconciled": audit_review_warnings(json.loads(Path(args.review).read_text()), records), "automatic_approval": False}))
    else: run(args)


if __name__ == "__main__": main()
