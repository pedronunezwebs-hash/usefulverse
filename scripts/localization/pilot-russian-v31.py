"""Opt-in Russian v31. Historical functions/policies are delegated unchanged."""
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

POLICY = 'context-v31'
REQUIRED_DEPENDENCIES = frozenset(['docs/quality/translation-pilot/checkpoints/context-v30/madlad.jsonl', 'docs/quality/translation-pilot/corrections-v31.json', 'docs/quality/translation-pilot/next-v31-ru-plan.json', 'docs/quality/translation-pilot/numeric-sources/context-v28/bn-numbers.json', 'docs/quality/translation-pilot/numeric-sources/context-v28/bn-rbnf.xml', 'docs/quality/translation-pilot/numeric-sources/context-v28/bound-readings.json', 'docs/quality/translation-pilot/numeric-sources/context-v28/manifest.json', 'docs/quality/translation-pilot/numeric-sources/context-v29/bound-readings.json', 'docs/quality/translation-pilot/numeric-sources/context-v29/manifest.json', 'docs/quality/translation-pilot/numeric-sources/context-v30/manifest.json', 'docs/quality/translation-pilot/numeric-sources/context-v30/ru-numbers.json', 'docs/quality/translation-pilot/numeric-sources/context-v30/ru-rbnf.xml', 'docs/quality/translation-pilot/numeric-sources/context-v30/ru-units.json', 'docs/quality/translation-pilot/numeric-sources/context-v31/ru-numbers.json', 'docs/quality/translation-pilot/numeric-sources/context-v31/ru-rbnf.xml', 'docs/quality/translation-pilot/numeric-sources/context-v31/ru-units.json', 'docs/quality/translation-pilot/review-context-v30-full-legacy.json', 'docs/quality/translation-pilot/review-context-v30-full.json', 'docs/quality/translation-pilot/review-context-v30-legacy.json', 'docs/quality/translation-pilot/review-context-v30-references.json', 'docs/quality/translation-pilot/review-v28-legacy-reassessment.json', 'docs/quality/translation-pilot/reviewed-memory-v28-import.json', 'docs/quality/translation-pilot/reviewed-memory-v29-import.json', 'docs/quality/translation-pilot/reviewed-memory-v30-import.json', 'docs/quality/translation-pilot/reviewed-memory-v31-import.json', 'docs/quality/translation-pilot/scoped-forward-regressions-v30.json', 'scripts/localization/pilot-bengali-known-corpus-policy.json', 'scripts/localization/pilot-bengali-known-reference-policy.json', 'scripts/localization/pilot-bengali-v28.py', 'scripts/localization/pilot-bengali-v29.py', 'scripts/localization/pilot-english-memo-v31.py', 'scripts/localization/pilot-russian-reference-policy.json', 'scripts/localization/pilot-russian-v30.py', 'scripts/localization/pilot-russian-v31.py', 'scripts/localization/translation-pilot-v29.py', 'scripts/localization/translation-pilot-v30.py', 'scripts/localization/translation-pilot-v31.py', 'scripts/localization/translation-pilot.py'])
PRIMARY = {'ru-numbers.json': 'e6f4cbfea69b3b3a21c0858b94f7b4cd42d0fcb60782ca94f39c92187251ea9f', 'ru-rbnf.xml': 'e5c5c3d118b0d562509fbacc53ff326c655718569e06f9a6fec5a46aa35b272a', 'ru-units.json': '5eb55a4d08fe86f2f2aa629a69f0657996eed0700b19b24f57d6969a5d7056fd'}

def require(condition, message):
    if not condition:
        raise ValueError(message)


def file_sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_sha_bytes(text):
    return hashlib.sha256(text.encode()).hexdigest()


def spaces(match):
    return ' ' * len(match.group())


class RussianV31:
    def __init__(self, namespace):
        self.ns = namespace
        self.root = namespace['ROOT']
        self.data = self.root / 'docs/quality/translation-pilot'
        self.directory = self.data / 'numeric-sources/context-v31'
        self.legacy_checks = namespace['policy_typed_data_checks']
        self.legacy_flags = namespace['record_flags']
        self.legacy_run = namespace['run']
        self.legacy_audit = namespace['audit_review_warnings']
        self.cache = {}

    def contracts(self):
        n=self.ns;require(n['ROOT']==self.root,'Changed v31 root')
        path=self.directory/'manifest.json';manifest=json.loads(path.read_text());profile=n['POLICIES'][POLICY]['numeric_profile']
        require(profile==dict(id='ru-known-corpus-cldr-v1',locale='ru',manifest=str(path.relative_to(self.root)),manifest_sha256=file_sha(path)),'Changed Russian manifest binding')
        require(manifest['id']==profile['id']and manifest['base_policy']=='context-v30'and set(manifest['dependencies'])==REQUIRED_DEPENDENCIES,'Changed v31 dependency scope')
        actual={name:file_sha(self.root/name)for name in REQUIRED_DEPENDENCIES};require(actual==manifest['dependencies'],'Changed v31 dependency bytes')
        require(all(file_sha(self.directory/name)==value for name,value in PRIMARY.items()),'Changed pinned CLDR primary')
        signature=n['digest']([actual,n['policy_digest'](POLICY),n['policy_digest']('context-v30')])
        if signature in self.cache:return self.cache[signature]
        base=n['RUSSIAN_V30'].contracts();policy=n['POLICIES'][POLICY];before=n['POLICIES']['context-v30']['reviewed_memory']
        require(policy['entries']==n['POLICIES']['context-v30']['entries'],'Changed controlled English')
        def preserved(a,b):return isinstance(b,dict)and all(k in b and preserved(v,b[k])for k,v in a.items())if isinstance(a,dict)else a==b
        require(preserved(before,policy['reviewed_memory'])and sum(len(x['translations'])for x in policy['reviewed_memory'].values())==905,'Changed old731 targets')
        data=json.loads((self.data/'reviewed-memory-v31-import.json').read_text());require(data['policy']==POLICY and data['native_review']is False and data['approved_locales']==[]and len(data['entries'])==214,'Wrong v31 import scope')
        records={r['record_id']:r for r in map(json.loads,(self.data/'checkpoints/context-v30/madlad.jsonl').read_text().splitlines())};fixes={x['key']:x for x in json.loads((self.data/'corrections-v31.json').read_text())['cases']};imports={}
        for item in data['entries']:
            key=item['key'];unit=base['units'][key];row=records[item['source_record_id']];require(key not in imports and all(item[k]==unit[k]for k in ['source','source_hash','context'])and all(row[k]==unit[k]for k in ['source','source_hash'])and n['digest'](row)==item['source_record_sha256'],'Stale v31 source/provenance')
            review=self.data/item['source_review'];require(file_sha(review)==item['source_review_sha256'],'Changed source review');judgment=next(j for j in json.loads(review.read_text())['rows']if row['record_id']in j['record_ids']);require(judgment==item['source_judgment'],'Changed original judgment')
            if item['origin']=='existing-exact-agent-reviewed-import':require(min(judgment['scores'].values())==3 and not judgment['data_contract_unproved']and row['translation']==item['translation'],'Reuse requires exact positive proved target')
            else:
                require(key in fixes and fixes[key]['translation']==item['translation']and fixes[key]['prior_record_id']==row['record_id']and row['translation']!=item['translation'],'Unproved repair provenance')
                require((item['origin']=='agent-correction'and min(judgment['scores'].values())<3)or(item['origin']=='agent-notation-clarification'and min(judgment['scores'].values())==3 and judgment['data_contract_unproved']),'Do not fabricate a linguistic defect')
            require(item['native_review']is False and item['approved_locales']==[]and set(item['scores'].values())=={3}and file_sha_bytes(item['translation'])==item['translation_sha256']and n['reviewed_memory'](unit,'ru',POLICY)==item['translation'],'Changed v31 target')
            imports[key]=item
        require(set(imports)==set(base['units']),'Missing whole-corpus target')
        require(manifest['lexicon']==dict(base['lexicon'])and manifest['dimension_words']==dict(base['dimensions'])and manifest['unsupported_cardinal_words']==list(base['unsupported']),'Changed Russian grammar')
        result=dict(units=base['units'],references=base['references'],imports=imports,lexicon=base['lexicon'],dimensions=base['dimensions'],unsupported=base['unsupported'],corpus_digest=base['corpus_digest']);result=n['freeze_policy'](result);self.cache={signature:result};return result


    def reading(self,text,opposite=None):
        return None


    def dimension_data(self,text,locale,opposite=None):
        result=Counter(m.group().casefold()for m in re.finditer(r'(?<![A-Za-z0-9_])[23]D(?![A-Za-z0-9_])',text))
        if locale=='ru':result.update(self.contracts()['dimensions'][m.group().lower().replace('ё','е')]for m in re.finditer('[А-Яа-яЁё]+',text)if m.group().lower().replace('ё','е')in self.contracts()['dimensions'])
        return result


    def preflight_memory(self):
        c=self.contracts()
        for unit in c['units'].values():
            require(all(self.checks(unit['source'],self.ns['translation_input'](unit,POLICY),'en','en',POLICY).values()),'Unproved Russian controlled source: '+unit['key'])
        for key,item in c['imports'].items():
            require(not self.ns['semantic_issues'](key,item['source_hash'],item['translation'],'ru'),'Known Russian forward defect: '+key)
            require(all(self.checks(item['source'],item['translation'],'en','ru',POLICY).values()),'Unproved Russian forward memory: '+key)
        self.preflight_fragments();return True


    def preflight_fragments(self):
        c=self.contracts();fragments=0;fields=[]
        for unit in c['units'].values():fields.extend([(unit['key'],unit['source'],'en'),(unit['key'],self.ns['translation_input'](unit,POLICY),'en')])
        fields.extend((key,item['translation'],'ru')for key,item in c['imports'].items())
        for key,text,locale in fields:
            whole=self.numeric(text,locale);require(whole is not None,'Unproved whole Russian/source text: '+key);quantities,coords,dimensions=Counter(),[],Counter()
            for _,part,_ in self.ns['complete_sentence_parts'](text):
                value=self.numeric(part,locale);require(value is not None,'Unproved Russian/source fragment: '+key);quantities.update(value[0]);coords.extend(value[1]);dimensions.update(self.dimension_data(part,locale));fragments+=1
            require((quantities,coords)==whole and dimensions==self.dimension_data(text,locale),'Russian fragment/whole mismatch: '+key)
        return dict(source_units=214,memory_targets=214,whole_texts=len(fields),fragments=fragments)


    def numeric(self,text,locale,opposite=None):
        require(locale in {'en','ru'},'Unsupported Russian numeric locale')
        if any(unicodedata.category(ch).startswith('N')and ch not in '0123456789'for ch in text):return None
        if locale=='en':return self.ns['BENGALI_V29'].numeric(text,'en')
        c=self.contracts();n=self.ns;normalized=unicodedata.normalize('NFC',text).replace('\u2212','-');coordinates=n['coordinate_data'](normalized)
        prose=n['COORDINATE'].sub(spaces,n['OPAQUE_LITERAL'].sub(spaces,normalized));prose=n['SOFTWARE_VERSION'].sub(spaces,prose)
        for pattern in [n['TECHNICAL_TOKEN'],n['SOFTWARE_IDENTIFIER'],re.compile(r'(?<![A-Za-z0-9_])[23]D(?![A-Za-z0-9_])')]:prose=pattern.sub(spaces,prose)
        if any((unicodedata.category(ch).startswith('N')and ch not in '0123456789')or unicodedata.category(ch)=='Sc'for ch in prose):return None
        if re.search(r'[0-9]\s*[eE]\s*[+-]?[0-9]|[0-9]\s*/\s*[0-9]|[＋﹢﹣－–—‒⁺⁻±∓]\s*[0-9]|[+-]\s*[+-]\s*[0-9]',prose):return None
        values=Counter();chars=list(prose)
        for match in re.finditer('[А-Яа-яЁё]+',prose):
            word=match.group().lower().replace('ё','е')
            if word in c['dimensions']:chars[match.start():match.end()]=' '*len(match.group())
            elif word in c['lexicon']:values[(Decimal(c['lexicon'][word]),'')]+=1;chars[match.start():match.end()]=' '*len(match.group())
            elif word in c['unsupported']or re.search(r'^(?:тысяч|миллион|миллиард|триллион|полтор|четверт|половин)',word)or any(word.startswith(cardinal)for cardinal in c['lexicon']):return None
        prose=''.join(chars);pattern=re.compile(r'(?<![\w.])[+-]?[0-9]+(?:[.,\u00a0\u202f ][0-9]+)*(?:%|°)?(?!\w)')
        for match in pattern.finditer(prose):
            token=match.group();suffix=token[-1]if token[-1]in '%°'else'';number=token[:-1]if suffix else token
            if not re.fullmatch(r'[+-]?(?:[0-9]+|[0-9]{1,3}(?:[ \u00a0\u202f][0-9]{3})+)(?:[.,][0-9]+)?',number):return None
            values[(Decimal(re.sub('[ \u00a0\u202f]','',number).replace(',','.')),suffix)]+=1
        remainder=pattern.sub(spaces,prose)
        if any(ch.isdecimal()for ch in remainder)or re.search('[%°]',remainder):return None
        return values,coordinates


    def checks(self, source, target, source_locale, target_locale, policy):
        if policy != POLICY: return self.legacy_checks(source, target, source_locale, target_locale, policy)
        require(source_locale in {'en', 'ru'} and target_locale in {'en', 'ru'}, 'Unsupported v31 numeric pair')
        self.contracts()
        result = self.ns['typed_data_checks'](source, target, source_locale, target_locale)
        left = self.numeric(source, source_locale)
        right = self.numeric(target, target_locale, source if target_locale == 'ru' else None)
        result['quantities'] = left is not None and right is not None and left[0] == right[0]
        result['coordinates'] = left is not None and right is not None and left[1] == right[1]
        # ASCII token boundaries are stable next to Russian letters/marks; no
        # translated token is repaired, and technical values/multiplicity stay exact.
        def tokens(pattern, text):
            return Counter(m.group().casefold() for m in re.finditer(r'(?<![A-Za-z0-9_])(?:' + pattern + r')(?![A-Za-z0-9_])', text, re.I))
        def technical(text):
            extensions = re.compile(r'\.(?:dxf|dwg|png|svg|wav|mp3|pdf|json|csv|txt)(?![A-Za-z0-9_])', re.I)
            values = Counter(m.group().casefold() for m in extensions.finditer(text))
            values.update(tokens(r'ASCII|DXF|DWG|PNG|SVG|WAV|MP3|PDF|JSON|CSV|Unicode|KB|MB|GB|TB', extensions.sub(spaces, text)))
            values.update({'mb':len(re.findall(r'(?<![А-Яа-яЁё])МБ(?![А-Яа-яЁё])',text))})
            return values
        result['technical_tokens'] = technical(source) == technical(target)
        result['software_identifiers'] = tokens(r'dxf-parser|loglevel|Web Audio', source) == tokens(r'dxf-parser|loglevel|Web Audio', target)
        result['dimensions'] = self.dimension_data(source, source_locale) == self.dimension_data(target, target_locale, source if target_locale == 'ru' else None)
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
        require(len(outputs) == len(sentences), 'Incomplete v31 sentence batch')
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
        require(review['native_review'] is False and review['approved_locales'] == [] and len(review['rows']) == review['expected_rows'], 'Invalid v31 review scope')
        seen, expected = {}, {}
        for judgment in review['rows']:
            require(judgment['record_ids'] and set(judgment['scores']) == {'meaning', 'numbers_negations', 'naturalness'} and all(type(v) is int and 0 <= v <= 3 for v in judgment['scores'].values()), 'Invalid v31 rubric')
            for identity in judgment['record_ids']:
                row = records[identity]
                require(identity not in seen and row['inference_policy'] == POLICY and row['locale'] == 'ru' and all(judgment[k] == row[k] for k in ['key', 'locale', 'source_hash']) and judgment['translation_hash'] == hashlib.sha256(row['translation'].encode()).hexdigest(), 'Stale v31 judgment')
                seen[identity] = judgment
                flags = {f for f, value in self.flags(row).items() if value}
                if flags: expected[identity] = (row, flags)
        entries = {e['record_id']: e for e in review['warning_reconciliation']}
        require(len(entries) == len(review['warning_reconciliation']) and set(entries) == set(expected), 'Incomplete v31 warnings')
        gate = review.get('reference_gate', review.get('full_gate', {})).get('ru', {})
        for identity, (row, flags) in expected.items():
            entry = entries[identity]
            require(set(entry['warnings']) == flags and all(entry[k + '_hash'] == hashlib.sha256(row[k].encode()).hexdigest() for k in ['translation', 'back_translation']), 'Stale v31 warning evidence')
            for flag, decision in entry['warnings'].items():
                require(decision['note'].strip() and type(decision['blocks_gate']) is bool, 'Unexplained v31 warning')
                disposition = decision['disposition']
                require(disposition in {'forward-defect', 'back-defect', 'reviewed-signal', 'unproved-data'}, 'Unknown warning decision')
                if flag == 'known_semantic_errors': require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Cannot dismiss v31 forward defect')
                elif flag == 'known_back_semantic_errors': require(disposition == 'back-defect' and not decision['blocks_gate'], 'Back defect cannot grade the forward text')
                elif flag.startswith('back_'): require(disposition in {'back-defect', 'reviewed-signal'} and not decision['blocks_gate'], 'Explain v31 back warning separately')
                elif flag in {'length_ratio', 'wrong_script'}: require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Weak heuristic is not a rubric')
                elif disposition == 'unproved-data': require(flag in {'forward_typed_data', 'forward_sentence_evidence', 'marker_restore', 'protected_tokens'} and decision['blocks_gate'] and gate.get('passed') is False and seen[identity].get('data_contract_unproved') is True, 'Unproved data must block without fabricated linguistic scores')
                elif flag == 'protected_tokens' and all(self.ns['typed_record_evidence'](row)['forward'].values()): require(disposition == 'reviewed-signal' and not decision['blocks_gate'], 'Proved quantity spelling only')
                else: require(disposition == 'forward-defect' and decision['blocks_gate'] and min(seen[identity]['scores'].values()) < 3, 'Broken forward contract cannot pass')
                require(not (decision['blocks_gate'] and gate.get('passed')), 'Blocking warning contradicts gate')
        if check_coverage and review.get('requires_complete_model_warning_coverage'): self.ns['audit_complete_model_warning_coverage'](review, records)
        return len(expected)

    def full_allowed(self):
        path = self.data / 'reference-v31-gate.json'
        require(path.exists(), 'Russian references must pass before full inference')
        gate = json.loads(path.read_text())
        checkpoint = self.data / 'checkpoints/context-v31/madlad.jsonl'
        review_path = self.data / 'review-context-v31-references.json'
        require(gate['policy_digest'] == self.ns['policy_digest'](POLICY) and gate['review_sha256'] == file_sha(review_path), 'Stale v31 reference gate')
        review = json.loads(review_path.read_text())
        records = {r['record_id']: r for r in map(json.loads, checkpoint.read_text().splitlines())}
        frozen = [records[identity] for identity in gate['reference_record_ids']]
        require(len(frozen) == 67 and len(set(gate['reference_record_ids'])) == 67 and self.ns['digest'](frozen) == gate['reference_records_digest'], 'Changed or incomplete original v31 reference records')
        self.audit(review, records, check_coverage=False)
        rows = review['rows']
        require(len(rows) == 40 and len({r['key'] for r in rows}) == 40 and all(r['scores']['numbers_negations'] == 3 and (not r['critical_control'] or min(r['scores'].values()) == 3) and not r.get('data_contract_unproved') for r in rows), 'Russian references have open defects')
        require(sum(min(r['scores'].values()) == 2 for r in rows) <= 2 and all(min(r['scores'].values()) >= 2 for r in rows) and review['reference_gate']['ru']['passed'] is True, 'Russian reference rubric has not passed')
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
        require(all(len(tokens) <= 512 for tokens in inputs), 'Input exceeds v31 token budget; refusing truncation')
        outputs = translator.translate_batch(inputs, beam_size=args.beam_size, max_batch_size=args.batch_size,
            batch_type='examples', num_hypotheses=1, max_decoding_length=256, **options)
        require(len(outputs) == len(texts), 'Incomplete raw v31 model batch')
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
        require(args.locales == 'ru', 'v31 runs Russian only; no default mass inference')
        self.preflight_memory()
        if args.scope == 'full': self.full_allowed()
        corpus = json.loads(Path(args.corpus).read_text())
        contracts = self.contracts()
        require(corpus['sourceDigest'] == contracts['corpus_digest'], 'Wrong v31 corpus digest')
        units = sorted((u for u in corpus['units'] if args.scope == 'full' or u['reference']), key=lambda u: (not u['reference'], u['key']))
        require(len(units) == (40 if args.scope == 'references' else corpus['fullSourceUnits']), 'Wrong v31 corpus scope')
        require({u['key'] for u in units} == set(contracts['references'] if args.scope == 'references' else contracts['units']), 'Wrong v31 reference selection or full source coverage')
        for unit in units:
            require(hashlib.sha256(unit['source'].encode()).hexdigest() == unit['source_hash'], 'Stale v31 source hash')
            canonical = self.contracts()['units'].get(unit['key'])
            require(canonical is not None and all(unit[k] == canonical[k] for k in ['source', 'source_hash', 'context']), 'Changed actual v31 source/context')
            require(all(self.checks(unit['source'], n['translation_input'](unit, POLICY), 'en', 'en', POLICY).values()), 'Unproved v31 controlled input before model download')
            memory = n['reviewed_memory'](unit, 'ru', POLICY)
            if memory is not None: require(all(self.checks(unit['source'], memory, 'en', 'ru', POLICY).values()), 'Unproved v31 forward memory before model download')
        completed = {}
        if args.resume:
            for line in Path(args.resume).read_text().splitlines():
                row = json.loads(line); n['validate_record'](row); completed[row['record_id']] = row
        work = n['pending_work'](corpus, units, ['ru'], args.engine, args.beam_size, completed, POLICY)
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
                require(len(outputs) == len(missing) and all(isinstance(raw, str) and type(cut) is bool for raw, cut in outputs), 'Invalid raw v31 model batch')
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
    global hashlib
    hashlib = namespace['hashlib']
    policy = json.loads(Path(__file__).with_name('pilot-russian-known-corpus-policy.json').read_text())
    require(policy['id'] == POLICY and policy['protection'] == 'complete-sentences-typed-data-v10', 'Wrong Russian policy')
    namespace['POLICIES'][POLICY] = namespace['freeze_policy'](policy)
    namespace['TYPED_POLICIES'].add(POLICY)
    route = RussianV31(namespace)
    namespace['RUSSIAN_V31'] = route
    namespace['policy_typed_data_checks'] = route.checks
    namespace['record_flags'] = route.flags
    namespace['audit_review_warnings'] = route.audit
    namespace['run'] = route.run
