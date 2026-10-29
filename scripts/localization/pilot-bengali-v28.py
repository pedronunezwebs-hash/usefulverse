"""Opt-in Bengali v28. Historical functions/policies are delegated unchanged."""
from collections import Counter
from decimal import Decimal
import hashlib
import json
import os
from pathlib import Path
import re
import resource
import shutil
import subprocess
import sys
import time
import unicodedata
import xml.etree.ElementTree as ET

POLICY = 'context-v28'
PRIMARY = {'bn-numbers.json': 'f5fd869b650fb47a9dce4b29f1498ca0f5d71d70a248eb45eb3f70ede150aab6',
           'bn-rbnf.xml': 'd43d41a479536aa485e7e78df0138004159fa676c27a9ac81a2237d802ea0a1b'}
BASE_SHA = 'd034fe153d164d00dbc3e259b0d2411787e599cdd5f27398eac94acabe842bc4'
BN_WORD = re.compile(r'[\u0980-\u09FF]+')
EN_WORDS = dict(zip('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty'.split(), range(21)))
EN_WORDS.update(thirty=30, forty=40, fifty=50, sixty=60, seventy=70, eighty=80, ninety=90)
EN_UNPROVED = re.compile(r'\b(?:hundred|thousand|million|billion|trillion|half|quarter|dozen|minus|plus|negative|positive|[a-z]+illion)\b', re.I)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def file_sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def spaces(match):
    return ' ' * len(match.group())


class BengaliV28:
    def __init__(self, namespace):
        self.ns = namespace
        self.root = namespace['ROOT']
        self.data = self.root / 'docs/quality/translation-pilot'
        self.directory = self.data / 'numeric-sources/context-v28'
        self.legacy_checks = namespace['policy_typed_data_checks']
        self.legacy_flags = namespace['record_flags']
        self.legacy_run = namespace['run']
        self.legacy_audit = namespace['audit_review_warnings']
        self.cache = {}

    def contracts(self):
        n = self.ns
        policy = n['POLICIES'][POLICY]
        profile = policy['numeric_profile']
        manifest_path = self.directory / 'manifest.json'
        require(profile == {'id': 'bn-decimal-bound-v1', 'locale': 'bn', 'manifest': str(manifest_path.relative_to(self.root)), 'manifest_sha256': file_sha(manifest_path)}, 'Changed Bengali profile binding')
        manifest = json.loads(manifest_path.read_text())
        require(manifest['id'] == profile['id'] and manifest['locale'] == 'bn' and manifest['base_policy'] == 'context-v27', 'Unknown Bengali manifest')
        require(manifest['base_policy_sha256'] == BASE_SHA and file_sha(self.root / manifest['base_policy_file']) == BASE_SHA, 'Changed historical memory base')
        dependencies = manifest['dependencies']
        required = {'docs/quality/translation-pilot/numeric-sources/context-v24/source-snapshot.json',
                    'scripts/localization/pilot-chinese-known-corpus-policy.json',
                    'docs/quality/translation-pilot/batch1-v28-candidate-plan.json',
                    'docs/quality/translation-pilot/reviewed-memory-v28-import.json',
                    'docs/quality/translation-pilot/numeric-sources/context-v28/bound-readings.json',
                    'docs/quality/translation-pilot/checkpoints/madlad.jsonl',
                    'docs/quality/translation-pilot/checkpoints/m2m100.jsonl',
                    'docs/quality/translation-pilot/review-v28-legacy-reassessment.json',
                    *{f'docs/quality/translation-pilot/review-batch1-bn-{e}.json' for e in ['legacy', 'madlad', 'm2m100']},
                    'docs/quality/translation-pilot/numeric-sources/context-v22/numberingSystems.json',
                    'docs/quality/translation-pilot/numeric-sources/context-v22/LICENSE'}
        require(set(dependencies) == required, 'Incomplete Bengali provenance dependency inventory')
        current = {path: file_sha(self.root / path) for path in sorted(dependencies)}
        require(current == dependencies, 'Changed Bengali source, review, memory or checkpoint evidence')
        require({item['path']: item['sha256'] for item in manifest['primary_files']} == PRIMARY, 'Changed primary CLDR inventory')
        require(all(file_sha(self.directory / path) == digest for path, digest in PRIMARY.items()), 'Changed pinned Bengali CLDR bytes')
        # Validate actual source modules too, not just a copied snapshot.
        n['v24_quantity_contracts']()
        # A later semantic finding must not make a historical raw record
        # unreadable. Current semantic acceptance is checked before inference
        # and by the current review/flag auditors, separately from data validity.
        cache_key = n['digest']([profile, current, n['policy_digest'](POLICY)])
        if cache_key in self.cache:
            return self.cache[cache_key]
        numbers = json.loads((self.directory / 'bn-numbers.json').read_text())['main']['bn']['numbers']
        require(numbers['defaultNumberingSystem'] == 'beng', 'Unexpected Bengali default digits')
        for system in ['latn', 'beng']:
            require(numbers[f'symbols-numberSystem-{system}']['decimal'] == '.' and numbers[f'symbols-numberSystem-{system}']['group'] == ',' and numbers[f'decimalFormats-numberSystem-{system}']['standard'] == '#,##,##0.###', 'Changed Bengali grouping grammar')
        systems = json.loads((self.data / 'numeric-sources/context-v22/numberingSystems.json').read_text())['supplemental']['numberingSystems']
        require(systems['beng']['_digits'] == '০১২৩৪৫৬৭৮৯' and systems['latn']['_digits'] == '0123456789', 'Changed digit definitions')
        rbnf = '\n'.join(node.text or '' for node in ET.fromstring((self.directory / 'bn-rbnf.xml').read_text()).iter('rbnfRules'))
        cardinal = rbnf.split('%spellout-cardinal:\n', 1)[1].split('%spellout-ordinal:', 1)[0]
        lexicon = {unicodedata.normalize('NFC', text): int(value) for value, text in re.findall(r'(?m)^(\d+): ([^;]+);$', cardinal) if int(value) < 100}
        require(len(lexicon) == 100 and lexicon['চার'] == 4 and lexicon['ছয়'] == 6, 'Incomplete pinned cardinal subset')
        imports = json.loads((self.data / 'reviewed-memory-v28-import.json').read_text())
        require(imports['policy'] == POLICY and imports['native_review'] is False and imports['approved_locales'] == [] and len(imports['entries']) == 40, 'Invalid known-memory import scope')
        snapshot = json.loads((self.root / manifest['source_snapshot']).read_text())
        units = {u['key']: u for u in snapshot['units']}
        base = n['POLICIES']['context-v27']['reviewed_memory']
        def preserved(before, after):
            return isinstance(after, dict) and all(k in after and preserved(v, after[k]) for k, v in before.items()) if isinstance(before, dict) else before == after
        require(preserved(base, policy['reviewed_memory']) and sum(len(item['translations']) for item in policy['reviewed_memory'].values()) == 517, 'A historical memory target was changed')
        records = {r['record_id']: r for engine in ['madlad', 'm2m100'] for r in map(json.loads, (self.data / f'checkpoints/{engine}.jsonl').read_text().splitlines())}
        import_by_key = {}
        corrections = {'dxf-viewer.fields.resetView', 'dxf-viewer.fields.zoomOut', 'shikaku.fields.check'}
        for item in imports['entries']:
            key = item['key']
            require(key not in import_by_key and key in units, 'Duplicate or unknown Bengali import')
            unit = units[key]
            require(all(item[k] == unit[k] for k in ['source', 'source_hash', 'context']), 'Stale imported source/context')
            text = item['translation']
            require(hashlib.sha256(text.encode()).hexdigest() == item['translation_sha256'] and n['reviewed_memory'](unit, 'bn', POLICY) == text, 'Stale Bengali memory target')
            require(item['native_review'] is False and item['review_kind'] == 'agent' and set(item['scores'].values()) == {3}, 'Unreviewed or mislabelled Bengali memory')
            if key in corrections:
                require(item['origin'] == 'agent-correction' and not item['record_ids'], 'New correction is not old model evidence')
            else:
                path = self.data / item['source_review']
                require(item['origin'] == 'existing-agent-reviewed-import' and file_sha(path) == item['source_review_sha256'], 'Changed import review')
                judgment = next((j for j in json.loads(path.read_text())['rows'] if j['key'] == key and j['locale'] == 'bn'), None)
                require(judgment is not None and set(judgment['scores'].values()) == {3} and judgment['translation_hash'] == item['translation_sha256'] and judgment['source_hash'] == unit['source_hash'] and judgment['canonical_context'] == unit['context'], 'Unproved imported judgment')
                require(judgment['record_ids'] == item['record_ids'] and judgment['record_sha256'] == item['record_sha256'], 'Changed record provenance')
                for identity in item['record_ids']:
                    row = records[identity]
                    require(row['translation'] == text and row['source_hash'] == unit['source_hash'] and n['digest'](row) == item['record_sha256'][identity], 'Changed original raw record')
            import_by_key[key] = item
        readings = json.loads((self.directory / 'bound-readings.json').read_text())['entries']
        require(len(readings) == len(import_by_key) == 40 and len({r['key'] for r in readings}) == 40, 'Incomplete bound readings')
        by_text = {}
        for reading in readings:
            item = import_by_key[reading['key']]
            require(all(reading[k] == item[k] for k in ['source', 'source_hash', 'context', 'translation', 'translation_sha256']), 'Unbound lexical reading')
            normalized = unicodedata.normalize('NFC', reading['translation'])
            seen = set()
            for zero in reading['zero_readings']:
                start, end, word, kind = (zero[k] for k in ['start', 'end', 'text', 'kind'])
                require(0 <= start < end <= len(normalized) and normalized[start:end] == word and not seen.intersection(range(start, end)), 'Stale or overlapping lexical span')
                seen.update(range(start, end))
                require(kind in {'article', 'unit-noun', 'negative-copula'}, 'Unknown zero reading')
                if kind == 'article': require(word == 'একটি' and bool(re.search(r'\b(?:a|an)\b', item['source'], re.I)), 'A numeral cannot be erased as an article')
                elif kind == 'unit-noun': require(word == 'একক' and reading['key'] == 'dxf-viewer.faq.2.a' and 'unit' in item['source'], 'Unproved unit noun')
                else: require(word == unicodedata.normalize('NFC', 'নয়') and (reading['key'] == 'voice-changer.fields.tooLarge' and 'no larger' in item['source'] or reading['key'] == 'dxf-viewer.fields.binary' and 'not supported' in item['source']), 'Unproved negative copula')
            require(reading['translation'] not in by_text, 'Ambiguous duplicate lexical context')
            by_text[reading['translation']] = reading
        result = dict(lexicon=lexicon, readings=by_text, units=units, imports=import_by_key, corpus_digest=snapshot['corpus_digest'])
        self.cache = {cache_key: result}
        return result

    def preflight_memory(self):
        contracts = self.contracts()
        for key, item in contracts['imports'].items():
            require(not self.ns['semantic_issues'](key, item['source_hash'], item['translation'], 'bn'), 'Known Bengali forward defect blocks new inference: ' + key)
        return True

    def numeric(self, text, locale, opposite=None):
        n = self.ns
        contracts = self.contracts()
        require(locale in {'en', 'bn'}, 'Unsupported v28 numeric locale')
        normalized = unicodedata.normalize('NFC', text).replace('\u2212', '-')
        reading = contracts['readings'].get(text) if locale == 'bn' else None
        if reading and opposite is not None and opposite not in {reading['source'], n['translation_input'](contracts['units'][reading['key']], POLICY)}:
            reading = None
        if reading:
            chars = list(normalized)
            for span in reading['zero_readings']: chars[span['start']:span['end']] = ' ' * (span['end'] - span['start'])
            normalized = ''.join(chars)
        # Coordinates retain order; each component has one digit system.
        coordinates = n['coordinate_data'](normalized)
        for match in n['COORDINATE'].finditer(normalized):
            for value in match.groups():
                families = {0 if c in '0123456789' else 1 for c in value if c.isdecimal()}
                if len(families) > 1: return None
        prose = n['COORDINATE'].sub(spaces, n['OPAQUE_LITERAL'].sub(spaces, normalized))
        prose = n['SOFTWARE_VERSION'].sub(spaces, prose)
        for pattern in [n['TECHNICAL_TOKEN'], n['SOFTWARE_IDENTIFIER'], re.compile(r'(?<![A-Za-z0-9_])[23]D(?![A-Za-z0-9_])')]: prose = pattern.sub(spaces, prose)
        if any(unicodedata.category(c) == 'Sc' for c in prose): return None
        allowed_digits = '0123456789' + ('০১২৩৪৫৬৭৮৯' if locale == 'bn' else '')
        if any(unicodedata.category(c).startswith('N') and c not in allowed_digits for c in prose): return None
        if re.search(r'[＋﹢﹣－–—‒⁺⁻±∓]\s*[0-9০-৯]|[+-]\s*[+-]\s*[0-9০-৯]', prose): return None
        values = Counter()
        if locale == 'en':
            # Keep the prior source-bound English proof; no historical parser changes.
            known = n['numeric_data_zh_v27'](text, 'en', n['v27_quantity_contracts']())
            if known is not None and re.search(r'\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten)\b', prose, re.I): return known
            if EN_UNPROVED.search(prose): return None
            def english(match):
                word = match.group().casefold()
                if word in EN_WORDS: values[(Decimal(EN_WORDS[word]), '')] += 1; return spaces(match)
                return match.group()
            prose = re.sub(r'\b[A-Za-z]+\b', english, prose)
            if re.search(r'[0-9]\s*[eE]\s*[+-]?[0-9]', prose): return None
        else:
            if re.search(r'(?:হাজার|লাখ|কোটি|আরব|খরব|শো|শত|অর্ধেক|অর্ধ|সিকি|আড়াই|দেড়|দশমিক|ঋণ|অসীম)', prose): return None
            prose = re.sub(r'([0-9০-৯]+)টি', lambda m: m.group(1) + '  ', prose)
            for match in list(BN_WORD.finditer(prose)):
                word = match.group()
                if all(c in '০১২৩৪৫৬৭৮৯' for c in word): continue
                stem = word[:-2] if word.endswith('টি') else word
                if stem in contracts['lexicon']:
                    values[(Decimal(contracts['lexicon'][stem]), '')] += 1
                    prose = prose[:match.start()] + ' ' * len(word) + prose[match.end():]
                elif any(word.startswith(cardinal) for cardinal in contracts['lexicon']): return None
        numeric_pattern = re.compile(r'(?<![\w.])[+-]?[0-9০-৯]+(?:[.,\u00a0\u202f ][0-9০-৯]+)*(?:%|°)?(?!\w)')
        for match in numeric_pattern.finditer(prose):
            token = match.group()
            digits = [c for c in token if c.isdecimal()]
            if len({0 if c in '0123456789' else 1 for c in digits}) > 1: return None
            ascii_token = ''.join(str(unicodedata.decimal(c)) if c.isdecimal() else c for c in token)
            suffix = ascii_token[-1] if ascii_token[-1] in '%°' else ''
            number = ascii_token[:-1] if suffix else ascii_token
            grouping = r'[0-9]{1,2}(?:,[0-9]{2})*,[0-9]{3}' if locale == 'bn' else r'[0-9]{1,3}(?:,[0-9]{3})+'
            if not re.fullmatch(r'[+-]?(?:[0-9]+|' + grouping + r')(?:\.[0-9]+)?', number): return None
            values[(Decimal(number.replace(',', '')), suffix)] += 1
        remainder = numeric_pattern.sub(spaces, prose)
        if any(c.isdecimal() for c in remainder) or re.search(r'[%°]', remainder): return None
        return values, coordinates

    def checks(self, source, target, source_locale, target_locale, policy):
        if policy != POLICY: return self.legacy_checks(source, target, source_locale, target_locale, policy)
        if 'bn' not in {source_locale, target_locale} and {source_locale, target_locale} != {'en'}:
            return self.legacy_checks(source, target, source_locale, target_locale, 'context-v27')
        require(source_locale in {'en', 'bn'} and target_locale in {'en', 'bn'}, 'Unsupported v28 numeric pair')
        self.contracts()
        result = self.ns['typed_data_checks'](source, target, source_locale, target_locale)
        left = self.numeric(source, source_locale)
        right = self.numeric(target, target_locale, source if target_locale == 'bn' else None)
        result['quantities'] = left is not None and right is not None and left[0] == right[0]
        result['coordinates'] = left is not None and right is not None and left[1] == right[1]
        # ASCII token boundaries are stable next to Bengali letters/marks; no
        # translated token is repaired, and technical values/multiplicity stay exact.
        def tokens(pattern, text):
            return Counter(m.group().casefold() for m in re.finditer(r'(?<![A-Za-z0-9_])(?:' + pattern + r')(?![A-Za-z0-9_])', text, re.I))
        def technical(text):
            extensions = re.compile(r'\.(?:dxf|dwg|png|svg|wav|mp3|pdf|json|csv|txt)(?![A-Za-z0-9_])', re.I)
            values = Counter(m.group().casefold() for m in extensions.finditer(text))
            values.update(tokens(r'ASCII|DXF|DWG|PNG|SVG|WAV|MP3|PDF|JSON|CSV|Unicode|KB|MB|GB|TB', extensions.sub(spaces, text)))
            return values
        result['technical_tokens'] = technical(source) == technical(target)
        result['software_identifiers'] = tokens(r'dxf-parser|loglevel|Web Audio', source) == tokens(r'dxf-parser|loglevel|Web Audio', target)
        result['dimensions'] = tokens(r'[23]D', source) == tokens(r'[23]D', target)
        return result

    def trace_valid(self, trace, source, raw, source_locale, target_locale):
        n = self.ns
        if not n['segment_evidence_valid'](trace, source, raw): return False
        expected = n['complete_sentence_parts'](source)
        if not expected or len(trace) != len(expected): return False
        for part, (leading, text, trailing) in zip(trace, expected, strict=True):
            if part.get('kind') != 'prose' or (part.get('leading_space'), part.get('input'), part.get('trailing_space')) != (leading, text, trailing): return False
            if part.get('truncated') or not all(self.checks(text, part['output'], source_locale, target_locale, POLICY).values()): return False
        return True

    def translate(self, texts, model, source_locale, target_locale, traces=None):
        plans = [self.ns['complete_sentence_parts'](text) for text in texts]
        sentences = [part[1] for plan in plans for part in plan]
        outputs = model(sentences) if sentences else []
        require(len(outputs) == len(sentences), 'Incomplete v28 sentence batch')
        results, cursor = [], 0
        for source, plan in zip(texts, plans, strict=True):
            trace = [dict(kind='prose', input=text, output=outputs[cursor+i][0], truncated=outputs[cursor+i][1], leading_space=leading, trailing_space=trailing) for i, (leading, text, trailing) in enumerate(plan)]
            cursor += len(plan)
            raw = ''.join(p['leading_space'] + p['output'].strip() + p['trailing_space'] for p in trace)
            valid = all(self.checks(source, raw, source_locale, target_locale, POLICY).values()) and self.trace_valid(trace, source, raw, source_locale, target_locale)
            if traces is not None: traces.append(trace)
            results.append((raw if valid else None, raw, any(p['truncated'] for p in trace)))
        return results

    def flags(self, row):
        flags = self.legacy_flags(row)
        if row.get('inference_policy') != POLICY: return flags
        evidence = self.ns['typed_record_evidence'](row)
        for flag, check in [('technical_tokens', 'technical_tokens'), ('software_identifiers', 'software_identifiers'), ('software_versions', 'versions')]:
            flags[flag], flags['back_' + flag] = not evidence['forward'][check], not evidence['back'][check]
        flags['forward_sentence_evidence'] = row['candidate'] == 'model' and row.get('translation_origin') != 'reviewed-memory' and not self.trace_valid(row.get('forward_segments'), row['model_input'], row['raw_translation'], 'en', row['locale'])
        flags['back_sentence_evidence'] = not self.trace_valid(row.get('back_segments'), row['translation'], row['back_translation'], row['locale'], 'en')
        return flags

    def audit(self, review, records, check_coverage=True):
        if review.get('inference_policy') != POLICY: return self.legacy_audit(review, records, check_coverage)
        require(review['native_review'] is False and review['approved_locales'] == [] and len(review['rows']) == review['expected_rows'], 'Invalid v28 review scope')
        seen, expected = {}, {}
        for judgment in review['rows']:
            require(judgment['record_ids'] and set(judgment['scores']) == {'meaning', 'numbers_negations', 'naturalness'} and all(type(v) is int and 0 <= v <= 3 for v in judgment['scores'].values()), 'Invalid v28 rubric')
            for identity in judgment['record_ids']:
                row = records[identity]
                require(identity not in seen and row['inference_policy'] == POLICY and row['locale'] == 'bn' and all(judgment[k] == row[k] for k in ['key', 'locale', 'source_hash']) and judgment['translation_hash'] == hashlib.sha256(row['translation'].encode()).hexdigest(), 'Stale v28 judgment')
                seen[identity] = judgment
                flags = {f for f, value in self.flags(row).items() if value}
                if flags: expected[identity] = (row, flags)
        entries = {e['record_id']: e for e in review['warning_reconciliation']}
        require(len(entries) == len(review['warning_reconciliation']) and set(entries) == set(expected), 'Incomplete v28 warnings')
        gate = review.get('reference_gate', review.get('full_gate', {})).get('bn', {})
        for identity, (row, flags) in expected.items():
            entry = entries[identity]
            require(set(entry['warnings']) == flags and all(entry[k + '_hash'] == hashlib.sha256(row[k].encode()).hexdigest() for k in ['translation', 'back_translation']), 'Stale v28 warning evidence')
            for flag, decision in entry['warnings'].items():
                require(decision['note'].strip() and type(decision['blocks_gate']) is bool, 'Unexplained v28 warning')
                disposition = decision['disposition']
                require(disposition in {'forward-defect', 'back-defect', 'reviewed-signal', 'unproved-data'}, 'Unknown warning decision')
                if flag == 'known_semantic_errors': require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Cannot dismiss v28 forward defect')
                elif flag == 'known_back_semantic_errors': require(disposition == 'back-defect' and not decision['blocks_gate'], 'Back defect cannot grade the forward text')
                elif flag.startswith('back_'): require(disposition in {'back-defect', 'reviewed-signal'} and not decision['blocks_gate'], 'Explain v28 back warning separately')
                elif flag in {'length_ratio', 'wrong_script'}: require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Weak heuristic is not a rubric')
                elif disposition == 'unproved-data': require(flag in {'forward_typed_data', 'forward_sentence_evidence', 'marker_restore', 'protected_tokens'} and decision['blocks_gate'] and gate.get('passed') is False and seen[identity].get('data_contract_unproved') is True, 'Unproved data must block without fabricated linguistic scores')
                elif flag == 'protected_tokens' and all(self.ns['typed_record_evidence'](row)['forward'].values()): require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Proved quantity spelling only')
                else: require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Broken forward contract cannot pass')
                require(not (decision['blocks_gate'] and gate.get('passed')), 'Blocking warning contradicts gate')
        if check_coverage and review.get('requires_complete_model_warning_coverage'): self.ns['audit_complete_model_warning_coverage'](review, records)
        return len(expected)

    def full_allowed(self):
        path = self.data / 'reference-v28-gate.json'
        require(path.exists(), 'Bengali references must pass before full inference')
        gate = json.loads(path.read_text())
        checkpoint = self.data / 'checkpoints/context-v28/madlad.jsonl'
        review_path = self.data / 'review-context-v28-references.json'
        require(gate['policy_digest'] == self.ns['policy_digest'](POLICY) and gate['review_sha256'] == file_sha(review_path), 'Stale v28 reference gate')
        review = json.loads(review_path.read_text())
        records = {r['record_id']: r for r in map(json.loads, checkpoint.read_text().splitlines())}
        frozen = [records[identity] for identity in gate['reference_record_ids']]
        require(len(frozen) == 67 and len(set(gate['reference_record_ids'])) == 67 and self.ns['digest'](frozen) == gate['reference_records_digest'], 'Changed or incomplete original v28 reference records')
        self.audit(review, records, check_coverage=False)
        rows = review['rows']
        require(len(rows) == 40 and len({r['key'] for r in rows}) == 40 and all(r['scores']['numbers_negations'] == 3 and (not r['critical_control'] or min(r['scores'].values()) == 3) and not r.get('data_contract_unproved') for r in rows), 'Bengali references have open defects')
        require(sum(min(r['scores'].values()) == 2 for r in rows) <= 2 and all(min(r['scores'].values()) >= 2 for r in rows) and review['reference_gate']['bn']['passed'] is True, 'Bengali reference rubric has not passed')
        return True

    def model_batch(self, texts, source_locale, target_locale, args, tokenizer, translator):
        target = self.ns['ALIASES'].get(target_locale, target_locale)
        if args.engine == 'm2m100':
            tokenizer.src_lang = self.ns['ALIASES'].get(source_locale, source_locale)
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(text)) for text in texts]
            options = {'target_prefix': [[f'__{target}__']] * len(inputs)}
        else:
            inputs = [tokenizer.convert_ids_to_tokens(tokenizer.encode(f'<2{target}> {text}')) for text in texts]
            options = {}
        require(all(len(tokens) <= 512 for tokens in inputs), 'Input exceeds v28 token budget; refusing truncation')
        outputs = translator.translate_batch(inputs, beam_size=args.beam_size, max_batch_size=args.batch_size,
            batch_type='examples', num_hypotheses=1, max_decoding_length=256, **options)
        require(len(outputs) == len(texts), 'Incomplete raw v28 model batch')
        result = []
        for output in outputs:
            tokens = output.hypotheses[0]
            raw = tokenizer.decode(tokenizer.convert_tokens_to_ids(tokens), skip_special_tokens=True)
            result.append((raw, len(tokens) >= 256))
        return result

    def run(self, args):
        if getattr(args, 'policy', 'baseline') != POLICY: return self.legacy_run(args)
        n = self.ns
        n['actions_only']()
        require(args.locales == 'bn', 'v28 runs Bengali only; no default mass inference')
        self.preflight_memory()
        if args.scope == 'full': self.full_allowed()
        corpus = json.loads(Path(args.corpus).read_text())
        contracts = self.contracts()
        require(corpus['sourceDigest'] == contracts['corpus_digest'], 'Wrong v28 corpus digest')
        units = sorted((u for u in corpus['units'] if args.scope == 'full' or u['reference']), key=lambda u: (not u['reference'], u['key']))
        require(len(units) == (40 if args.scope == 'references' else corpus['fullSourceUnits']), 'Wrong v28 corpus scope')
        require({u['key'] for u in units} == set(contracts['imports'] if args.scope == 'references' else contracts['units']), 'Wrong v28 reference selection or full source coverage')
        for unit in units:
            require(hashlib.sha256(unit['source'].encode()).hexdigest() == unit['source_hash'], 'Stale v28 source hash')
            canonical = self.contracts()['units'].get(unit['key'])
            require(canonical is not None and all(unit[k] == canonical[k] for k in ['source', 'source_hash', 'context']), 'Changed actual v28 source/context')
            require(all(self.checks(unit['source'], n['translation_input'](unit, POLICY), 'en', 'en', POLICY).values()), 'Unproved v28 controlled input before model download')
            memory = n['reviewed_memory'](unit, 'bn', POLICY)
            if memory is not None: require(all(self.checks(unit['source'], memory, 'en', 'bn', POLICY).values()), 'Unproved v28 forward memory before model download')
        completed = {}
        if args.resume:
            for line in Path(args.resume).read_text().splitlines():
                row = json.loads(line); n['validate_record'](row); completed[row['record_id']] = row
        work = n['pending_work'](corpus, units, ['bn'], args.engine, args.beam_size, completed, POLICY)
        if not work:
            print('UVPILOT_SUMMARY ' + n['canonical'](dict(engine=args.engine, counts={}, scope=args.scope, resumed=True, conversion_seconds=0, approved=0)), flush=True)
            return
        config = n['ENGINES'][args.engine]
        model_dir = Path(os.environ['RUNNER_TEMP']) / f'usefulverse-pilot-{args.engine}'
        started = time.monotonic()
        subprocess.run([sys.executable, n['__file__'], 'convert', '--engine', args.engine, '--model-dir', str(model_dir)], check=True)
        conversion_seconds = time.monotonic() - started
        import ctranslate2
        import langid
        from transformers import M2M100Tokenizer, T5Tokenizer
        tokenizer_cls = M2M100Tokenizer if args.engine == 'm2m100' else T5Tokenizer
        tokenizer = tokenizer_cls.from_pretrained(config['repository'], revision=config['revision'], trust_remote_code=False)
        translator = ctranslate2.Translator(str(model_dir), device='cpu', inter_threads=1, intra_threads=min(4, os.cpu_count() or 1), compute_type='int8')
        def model_translate(texts, source_locale, target_locale):
            return self.model_batch(texts, source_locale, target_locale, args, tokenizer, translator)
        raw_cache = {}
        def translate(texts, source_locale, target_locale, traces=None):
            def prose(sentences):
                missing = list(dict.fromkeys(s for s in sentences if (source_locale, target_locale, s) not in raw_cache))
                outputs = model_translate(missing, source_locale, target_locale) if missing else []
                require(len(outputs) == len(missing) and all(isinstance(raw, str) and type(cut) is bool for raw, cut in outputs), 'Invalid raw v28 model batch')
                current = dict(zip(missing, outputs, strict=True))
                for text, pair in current.items():
                    if not pair[1]: raw_cache[source_locale, target_locale, text] = pair
                print('UVPILOT_CACHE ' + n['canonical'](dict(policy=POLICY, source_locale=source_locale, target_locale=target_locale, requested=len(sentences), inferred=len(missing), cache_hits=len(sentences)-len(missing))), flush=True)
                return [current.get(s, raw_cache.get((source_locale, target_locale, s))) for s in sentences]
            return self.translate(texts, prose, source_locale, target_locale, traces)
        output = Path(args.output); output.parent.mkdir(parents=True, exist_ok=True); counts = Counter()
        try:
            with output.open('a', encoding='utf-8') as handle:
                for locale, candidate, pending in work:
                    for start in range(0, len(pending), args.batch_size):
                        batch = pending[start:start+args.batch_size]; tick = time.monotonic(); back_traces = []
                        if candidate == 'model': values, forward_traces, memory = n['forward_with_memory'](batch, locale, POLICY, translate)
                        else: values, forward_traces, memory = [(u['legacy'][locale], u['legacy'][locale], False) for u in batch], [None]*len(batch), [None]*len(batch)
                        back = translate([value or raw for value, raw, _ in values], locale, 'en', back_traces)
                        seconds = time.monotonic() - tick
                        for i, (unit, (value, raw, cut), (back_value, back_raw, back_cut)) in enumerate(zip(batch, values, back, strict=True)):
                            text = value if value is not None else raw
                            detected, confidence = langid.classify(text) if sum(c.isalpha() for c in text) >= 20 else (None, None)
                            row = dict(format=n['FORMAT'], record_id=n['record_id'](corpus,args.engine,locale,unit,candidate,args.beam_size,POLICY), corpus_digest=corpus['sourceDigest'], engine=args.engine, engine_revision=config['revision'], engine_license=config['license'], candidate=candidate, locale=locale, key=unit['key'], tool=unit['tool'], source=unit['source'], source_hash=unit['source_hash'], translation=text, raw_translation=raw, back_translation=back_value or back_raw, marker_restore_ok=value is not None, back_marker_restore_ok=back_value is not None, truncated=cut or back_cut, detected_language=detected, language_detector_score=confidence, checks=n['automatic_checks'](unit['source'],text,locale,unit['key'],back_value or back_raw), seconds_per_batch_unit=seconds/len(batch), beam_size=args.beam_size, status='machine-draft', reviewer='', reviewed_at='', actions_run_id=os.environ.get('GITHUB_RUN_ID',''), actions_run_attempt=os.environ.get('GITHUB_RUN_ATTEMPT',''), source_commit=os.environ.get('GITHUB_SHA',''), inference_policy=POLICY, policy_digest=n['policy_digest'](POLICY), context=unit['context'], model_input=n['translation_input'](unit,POLICY) if candidate=='model' else unit['source'], protection=n['POLICIES'][POLICY]['protection'], forward_segments=forward_traces[i] if candidate=='model' else None, back_segments=back_traces[i], translation_origin='reviewed-memory' if memory[i] is not None else candidate, memory_digest=n['digest'](n['POLICIES'][POLICY]['reviewed_memory'][unit['key']]) if memory[i] is not None else None)
                            row['typed_data_evidence'] = n['typed_record_evidence'](row)
                            n['emit'](row); handle.write(n['canonical'](row)+'\n'); handle.flush(); completed[row['record_id']] = row; counts[candidate] += 1
                            if memory[i] is not None: counts['reviewed_memory_hits'] += 1
                        print('UVPILOT_PROGRESS '+n['canonical'](dict(engine=args.engine,locale=locale,candidate=candidate,completed=dict(counts))),flush=True)
            print('UVPILOT_SUMMARY '+n['canonical'](dict(engine=args.engine,counts=dict(counts),scope=args.scope,conversion_seconds=conversion_seconds,total_seconds=time.monotonic()-started,peak_rss_kib=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,approved=0)),flush=True)
        finally:
            translator.unload_model(); shutil.rmtree(model_dir, ignore_errors=True)


def install(namespace):
    policy = json.loads(Path(__file__).with_name('pilot-bengali-known-reference-policy.json').read_text())
    require(policy['id'] == POLICY and policy['protection'] == 'complete-sentences-typed-data-v9', 'Wrong Bengali policy')
    namespace['POLICIES'][POLICY] = namespace['freeze_policy'](policy)
    namespace['TYPED_POLICIES'].add(POLICY)
    route = BengaliV28(namespace)
    namespace['BENGALI_V28'] = route
    namespace['policy_typed_data_checks'] = route.checks
    namespace['record_flags'] = route.flags
    namespace['audit_review_warnings'] = route.audit
    namespace['run'] = route.run
