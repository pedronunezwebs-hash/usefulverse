import copy
import base64
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('pilot', Path(__file__).with_name('translation-pilot-v32.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
pilot = pilot.pilot
post_spec = importlib.util.spec_from_file_location("post_review30", Path(__file__).with_name("pilot-review-audit-v30.py"))
post_review = importlib.util.module_from_spec(post_spec)
post_spec.loader.exec_module(post_review)
post_review.install(vars(pilot))
view_spec = importlib.util.spec_from_file_location("review_view30", Path(__file__).with_name("pilot-review-view-v30.py"))
review_view = importlib.util.module_from_spec(view_spec)
view_spec.loader.exec_module(review_view)
pilot = review_view.ReviewView(pilot)


class TranslationPilotTest(unittest.TestCase):
    def test_later_back_findings_preserve_old_reviews_without_a_gate_override(self):
        from unittest.mock import patch
        directory=pilot.ROOT/'docs/quality/translation-pilot'
        addenda=json.loads((directory/'review-warning-addenda.json').read_text())
        self.assertTrue(addenda)
        item=addenda[0];file=directory/item['review_file'];review=json.loads(file.read_text())
        self.assertEqual(hashlib.sha256(file.read_bytes()).hexdigest(),item['review_file_sha256'])
        self.assertEqual(pilot.digest(review),item['review_digest'])
        records={r['record_id']:r for f in (directory/'checkpoints').rglob('*.jsonl') for r in map(json.loads,f.read_text().splitlines())}
        self.assertEqual(pilot.audit_review_warnings(review,records),14)
        for mutation in ['stale-review','stale-text','gate','forward','duplicate']:
            changed=copy.deepcopy(addenda);entry=changed[0]['warning_reconciliation'][0]
            if mutation=='stale-review':changed[0]['review_digest']='old'
            elif mutation=='stale-text':entry['back_translation_hash']='old'
            elif mutation=='duplicate':changed.append(copy.deepcopy(changed[0]))
            elif mutation=='gate':entry['warnings']['known_back_semantic_errors']['blocks_gate']=True
            else:entry['warnings']={'protected_tokens':{'disposition':'back-defect','blocks_gate':False,'note':'Invalid forward override'}}
            with tempfile.TemporaryDirectory() as tmp:
                path=Path(tmp)/'docs/quality/translation-pilot/review-warning-addenda.json';path.parent.mkdir(parents=True);path.write_text(json.dumps(changed))
                with patch.object(pilot,'ROOT',Path(tmp)),self.subTest(mutation=mutation),self.assertRaises(ValueError):pilot.audit_review_warnings(review,records)

    def test_run_evidence_inventory_cannot_omit_a_checkpoint(self):
        directory=pilot.ROOT/'docs/quality/translation-pilot'
        evidence=json.loads((directory/'context-run-evidence.json').read_text())
        actual={str(path.relative_to(directory)):{'records':len(path.read_text().splitlines()),
            'sha256':hashlib.sha256(path.read_bytes()).hexdigest()} for path in (directory/'checkpoints').rglob('*.jsonl')}
        declared={entry['path']:{key:entry[key] for key in ['records','sha256']} for entry in evidence['checkpoints']}
        self.assertEqual(declared,actual)
        self.assertEqual(evidence['total_records'],sum(entry['records'] for entry in actual.values()))

    def test_reference_gate_cannot_ignore_fixture_warnings_or_reuse_stale_hashes(self):
        directory=pilot.ROOT/'docs/quality/translation-pilot'
        records={r['record_id']:r for r in map(json.loads,(directory/'checkpoints/context-v7/madlad.jsonl').read_text().splitlines())}
        old=json.loads((directory/'review-context-v7-references.json').read_text())
        judgment=next(row for row in old['rows'] if row['locale']=='es' and row['key']=='voice-changer.fields.faq1a')
        identity=judgment['record_ids'][0];actual=records[identity]
        flags=[flag for flag,failed in pilot.record_flags(actual).items() if failed]
        self.assertIn('known_semantic_errors',flags)
        entry={'record_id':identity,**{field+'_hash':hashlib.sha256(actual[field].encode()).hexdigest() for field in ['translation','back_translation']},
            'warnings':{flag:{'disposition':'forward-defect' if flag=='known_semantic_errors' else 'reviewed-signal',
                'note':'Observed upload FAQ lost its explicit No; other signals reviewed independently.',
                'blocks_gate':flag=='known_semantic_errors'} for flag in flags}}
        review={'expected_rows':1,'rows':[copy.deepcopy(judgment)],'reference_gate':{'es':{'passed':False}},'warning_reconciliation':[entry]}
        self.assertEqual(pilot.audit_review_warnings(review,records),1)
        for mutation in ['missing','stale','perfect','passed','full-passed','back','unexplained','stale-rubric','duplicate','unbound']:
            changed=copy.deepcopy(review)
            if mutation=='missing':changed['warning_reconciliation']=[]
            elif mutation=='stale':changed['warning_reconciliation'][0]['translation_hash']='old'
            elif mutation=='perfect':changed['rows'][0]['scores']={key:3 for key in judgment['scores']}
            elif mutation=='passed':changed['reference_gate']['es']['passed']=True
            elif mutation=='full-passed':changed['full_gate']={'es':{'passed':True}};changed.pop('reference_gate')
            elif mutation=='back':changed['warning_reconciliation'][0]['warnings']['known_semantic_errors']['disposition']='back-defect'
            elif mutation=='stale-rubric':changed['rows'][0]['translation_hash']='old'
            elif mutation=='duplicate':changed['rows'][0]['record_ids'].append(identity)
            elif mutation=='unbound':changed['rows'][0]['record_ids']=[]
            else:changed['warning_reconciliation'][0]['warnings']['known_semantic_errors']['note']=' '
            with self.subTest(mutation=mutation),self.assertRaises(ValueError):pilot.audit_review_warnings(changed,records)

    def test_summary_and_new_reviews_reconcile_the_same_current_warning_flags(self):
        directory=pilot.ROOT/'docs/quality/translation-pilot'
        paths=sorted((directory/'checkpoints').rglob('*.jsonl'))
        self.assertEqual(pilot.summarize(paths),json.loads((directory/'automatic-summary.json').read_text()))
        records={r['record_id']:r for path in paths for r in map(json.loads,path.read_text().splitlines())}
        for path in directory.glob('review-context-v*-*.json'):
            if int(path.name.split('-')[2][1:])>=9:
                review=json.loads(path.read_text())
                pilot.audit_review_warnings(review,records)
                if review.get('requires_complete_model_warning_coverage'):
                    reviewed=pilot.audit_complete_model_warning_coverage(review,records)
                    flagged={identity for identity,row in records.items() if row.get('inference_policy')==review['inference_policy']
                        and row['candidate']=='model' and any(pilot.record_flags(row).values())}
                    self.assertTrue(flagged<=reviewed,'An automatic warning outside the fixed sample was not reviewed')
                for historical in review.get('legacy_comparison',{}).get('rows',[]):
                    old=json.loads((directory/review['legacy_comparison']['review_file']).read_text())
                    original=next(row for row in old['rows'] if row['candidate']=='legacy' and row['key']==historical['key'] and row['locale']==historical['locale'])
                    actual=records[historical['record_ids'][0]]
                    for field in ['source_hash','scores','translation_hash']:self.assertEqual(historical[field],original[field])
                    self.assertEqual(actual['source_hash'],historical['source_hash'])
                    self.assertEqual(hashlib.sha256(actual['translation'].encode()).hexdigest(),historical['translation_hash'])

    def test_repeated_protected_values_cannot_disappear_or_multiply(self):
        source = 'Keep {count}, {count}, 25 MB and UsefulVerse.'
        self.assertFalse(pilot.automatic_checks(source, 'Conserva {count}, 25 MB y UsefulVerse.', 'es')['protected_tokens_identical'])
        self.assertTrue(pilot.automatic_checks(source, 'Conserva {count}, {count}, 25 MB y UsefulVerse.', 'es')['protected_tokens_identical'])

    def test_english_fallback_and_wrong_script_are_visible_failures(self):
        self.assertTrue(pilot.automatic_checks('Do not upload files.', 'Do not upload files.', 'ar')['untranslated_source'])
        self.assertEqual(pilot.automatic_checks('Do not upload files.', 'Do not upload files.', 'ar')['expected_script_ratio'], 0)

    def test_resume_identity_includes_source_context_model_and_legacy_revision(self):
        corpus = {'sourceDigest': 'source-v1'}
        unit = {'key': 'tool.button', 'source_hash': 'hash', 'context': 'save-file', 'legacy': {'es': 'Guardar'}}
        first = pilot.record_id(corpus, 'm2m100', 'es', unit, 'legacy', 2)
        changed = copy.deepcopy(unit); changed['legacy']['es'] = 'Ahorrar'
        self.assertNotEqual(first, pilot.record_id(corpus, 'm2m100', 'es', changed, 'legacy', 2))
        self.assertNotEqual(first, pilot.record_id(corpus, 'm2m100', 'es', unit, 'legacy', 1))
        self.assertNotEqual(first, pilot.record_id(corpus, 'madlad', 'es', unit, 'legacy', 2))

    def test_machine_checkpoint_cannot_approve_copy_or_invent_provenance(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'], 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        pilot.validate_record(row)
        for patch in [{'status': 'approved'}, {'reviewer': 'invented-reviewer'}, {'engine_revision': 'latest'}, {'source_hash': 'stale'}]:
            with self.subTest(patch=patch), self.assertRaises(ValueError): pilot.validate_record({**row, **patch})

    def test_model_execution_refuses_local_mac_before_importing_model_libraries(self):
        from unittest.mock import patch
        with patch.dict(pilot.os.environ, {'GITHUB_ACTIONS': 'false'}), self.assertRaises(SystemExit): pilot.actions_only()

    def test_complete_checkpoint_needs_no_model_and_tampered_identity_fails(self):
        corpus = {'sourceDigest': 'source-v1'}
        unit = {'key': 'tool.button', 'source_hash': hashlib.sha256(b'Save').hexdigest(), 'context': 'save-file', 'legacy': {}}
        identity = pilot.record_id(corpus, 'm2m100', 'es', unit, 'model', 2)
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'source': 'Save', 'source_hash': unit['source_hash'], 'corpus_digest': 'source-v1', 'locale': 'es', 'key': unit['key'], 'candidate': 'model', 'beam_size': 2}
        self.assertEqual(pilot.pending_work(corpus, [unit], ['es'], 'm2m100', 2, {identity: row}), [])
        self.assertEqual(pilot.pending_work(corpus, [unit], ['te'], 'm2m100', 2, {}), [])
        with self.assertRaises(ValueError):
            pilot.pending_work(corpus, [unit], ['es'], 'm2m100', 2, {identity: {**row, 'locale': 'ar'}})

    def test_log_collection_recovers_complete_records_without_approving_them(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': 'checkpoint', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        encoded = base64.b64encode(pilot.canonical(row).encode()).decode()
        with tempfile.TemporaryDirectory() as directory:
            log, output = Path(directory) / 'actions.log', Path(directory) / 'checkpoint.jsonl'
            log.write_text(f'timestamp UVPILOT_RECORD {encoded}\nJob failed afterwards\n')
            self.assertEqual(pilot.collect_logs([log, log], output), 1)
            self.assertIn('machine-draft', output.read_text())
            log.write_text('Job failed before its first record\n')
            with self.assertRaises(ValueError): pilot.collect_logs([log], output)

    def test_collecting_a_resumed_job_preserves_the_previous_checkpoint(self):
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': 'old', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest()}
        new_row = {**row, 'record_id': 'new'}
        with tempfile.TemporaryDirectory() as directory:
            output, log = Path(directory) / 'checkpoint.jsonl', Path(directory) / 'resumed.log'
            output.write_text(pilot.canonical(row) + '\n')
            log.write_text('UVPILOT_RECORD ' + base64.b64encode(pilot.canonical(new_row).encode()).decode() + '\n')
            self.assertEqual(pilot.collect_logs([log], output), 2)
            self.assertEqual({json.loads(line)['record_id'] for line in output.read_text().splitlines()}, {'old', 'new'})
            before = output.read_bytes()
            log.write_text('UVPILOT_RECORD incomplete-invalid-base64\n')
            with self.assertRaises(ValueError): pilot.collect_logs([log], output)
            self.assertEqual(output.read_bytes(), before)

    def test_pilot_workflow_keeps_runner_context_out_of_job_environment(self):
        workflow = (pilot.ROOT / '.github/workflows/deploy-cloudflare.yml').read_text()
        job = workflow.split('\n  translation-pilot:\n', 1)[1]
        job_configuration, steps = job.split('\n    steps:\n', 1)
        self.assertNotIn('${{ runner.', job_configuration)
        self.assertIn('runs-on: ubuntu-latest', job_configuration)
        self.assertIn('max-parallel: 2', job_configuration)
        self.assertNotIn('secrets.', job)
        self.assertNotIn('wrangler', job)
        self.assertNotIn('upload-artifact', job)
        self.assertIn('persist-credentials: false', steps)

    def test_observed_semantic_errors_are_rejected_even_when_tokens_survive(self):
        fixtures = json.loads(Path(__file__).with_name('pilot-semantic-regressions.json').read_text())
        self.assertGreater(len(fixtures), 40)
        for row in fixtures:
            with self.subTest(locale=row['locale'], key=row['key'], candidate=row['observed_candidate']):
                self.assertTrue(pilot.semantic_issues(row['key'], row['source_hash'], row['translation'], row['locale'], row.get('direction', 'forward')))
        self.assertEqual(pilot.semantic_issues('shikaku.fields.resume', hashlib.sha256(b'Resume').hexdigest(), 'Reanudar', 'es'), [])
        # The independent review/checkpoint evidence defines expected failures.
        # Removing an observed error from the fixture registry must fail this test.
        directory = pilot.ROOT / 'docs/quality/translation-pilot'
        records = {row['record_id']: row for path in (directory / 'checkpoints').rglob('*.jsonl')
            for row in map(json.loads, path.read_text().splitlines())}
        for path in sorted(directory.glob('review-context-v*-*.json')):
            if int(path.name.split('-')[2][1:]) < 5: continue
            review = json.loads(path.read_text())
            for row in review['rows']:
                if row['candidate'] == 'legacy' or min(row['scores'].values()) == 3: continue
                actual = records[row['record_ids'][0]]
                with self.subTest(review=path.name, locale=row['locale'], key=row['key']):
                    self.assertTrue(pilot.semantic_issues(actual['key'], actual['source_hash'], actual['translation'], actual['locale']),
                        'An independently reviewed error has lost its permanent regression')
            for finding in review.get('back_findings', []):
                actual = records[finding['record_id']]
                with self.subTest(review=path.name, locale=actual['locale'], key=actual['key'], direction='back'):
                    self.assertEqual(hashlib.sha256(actual['back_translation'].encode()).hexdigest(), finding['back_translation_hash'])
                    checks = pilot.automatic_checks(actual['source'], actual['translation'], actual['locale'], actual['key'], actual['back_translation'])
                    if finding.get('check'):
                        self.assertFalse(checks[finding['check']])
                    else:
                        self.assertTrue(checks['known_back_semantic_errors'])

    def test_observed_madlad_marker_and_file_extension_losses_are_not_accepted(self):
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        broken = 'Audio decodificado localmente. Duración: 00000000 segundos.'
        self.assertFalse(pilot.automatic_checks(source, broken, 'es')['protected_tokens_identical'])
        _, saved = pilot.queue.protect(source)
        self.assertIsNone(pilot.queue.restore(broken, saved))
        checks = pilot.automatic_checks('Unsupported file. Choose an ASCII .dxf file.', 'Fil som ikke støttes. Velg en ASCII DXF- fil.', 'nb-NO')
        self.assertFalse(checks['technical_tokens_identical'])
        self.assertTrue(pilot.automatic_checks('Choose an ASCII .dxf file.', 'Velg en ASCII-.dxf-fil.', 'nb-NO')['technical_tokens_identical'])

    def test_agent_review_stays_bound_to_the_exact_observed_translations(self):
        directory = pilot.ROOT / 'docs/quality/translation-pilot'
        records = {}
        for path in (directory / 'checkpoints').rglob('*.jsonl'):
            for line in path.read_text().splitlines():
                row = json.loads(line); pilot.validate_record(row); records[row['record_id']] = row
        known_counts = {'review-es-nb.json': 240, 'review-core-six.json': 402, 'review-madlad-de-fr.json': 80, 'review-context-v2-m2m100.json': 80, 'review-context-v2-madlad.json': 80, 'review-context-v3-madlad.json': 80}
        for path in sorted(directory.glob('review*.json')):
            review = json.loads(path.read_text())
            if 'rows' not in review: continue  # aggregate metrics are not a review
            expected_count = known_counts.get(path.name, review.get('expected_rows'))
            self.assertIsNotNone(expected_count, 'Every review declares its complete scope')
            self.assertFalse(review['native_review'])
            self.assertEqual(review['approved_locales'], [])
            self.assertEqual(len(review['rows']), expected_count)
            for row in review['rows']:
                with self.subTest(key=row['key'], locale=row['locale'], candidate=row['candidate']):
                    self.assertEqual(set(row['scores']), {'meaning', 'numbers_negations', 'naturalness'})
                    self.assertTrue(all(type(score) is int and 0 <= score <= 3 for score in row['scores'].values()))
                    self.assertTrue(row['notes'])
                    for identity in row['record_ids']:
                        actual = records[identity]
                        self.assertEqual(actual['source_hash'], row['source_hash'])
                        self.assertEqual(hashlib.sha256(actual['translation'].encode()).hexdigest(), row['translation_hash'])

    def test_a_valid_forward_translation_does_not_hide_broken_back_translation_tokens(self):
        checks = pilot.automatic_checks('Choose an audio file no larger than 25 MB.',
            'اختر ملفًا صوتيًا لا يزيد حجمه عن 25 MB.', 'ar',
            back_translation='Select the audio file not more than ZXPH0000QXZ MB.')
        self.assertTrue(checks['protected_tokens_identical'])
        self.assertFalse(checks['back_protected_tokens_identical'])

    def test_a_fully_resumed_run_never_downloads_or_imports_a_model(self):
        import contextlib
        import io
        from types import SimpleNamespace
        from unittest.mock import patch
        unit = {'key': 'tool.button', 'source': 'Save', 'source_hash': hashlib.sha256(b'Save').hexdigest(), 'context': 'button', 'legacy': {}, 'reference': True}
        corpus = {'sourceDigest': 'source-v1', 'fullSourceUnits': 1, 'locales': ['en', 'es'], 'units': [unit]}
        identity = pilot.record_id(corpus, 'm2m100', 'es', unit, 'model', 2)
        row = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'm2m100', 'engine_revision': pilot.ENGINES['m2m100']['revision'],
            'record_id': identity, 'corpus_digest': 'source-v1', 'locale': 'es', 'key': unit['key'], 'source': 'Save',
            'source_hash': unit['source_hash'], 'candidate': 'model', 'beam_size': 2}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory); (root / 'corpus.json').write_text(json.dumps(corpus)); (root / 'resume.jsonl').write_text(json.dumps(row) + '\n')
            args = SimpleNamespace(corpus=root / 'corpus.json', resume=root / 'resume.jsonl', locales='es', scope='full', engine='m2m100', beam_size=2)
            stream = io.StringIO()
            with patch.object(pilot, 'actions_only'), patch.object(pilot.subprocess, 'run', side_effect=AssertionError('Unexpected model conversion')) as conversion, contextlib.redirect_stdout(stream):
                pilot.run(args)
            conversion.assert_not_called()
            self.assertIn('"conversion_seconds":0', stream.getvalue())

    def test_context_policy_disambiguates_actions_without_changing_canonical_source(self):
        source = 'Resume'
        unit = {'key': 'shikaku.fields.resume', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest(), 'context': 'fields.resume', 'legacy': {}}
        self.assertEqual(pilot.translation_input(unit, 'baseline'), source)
        self.assertEqual(pilot.translation_input(unit, 'context-v2'), 'Continue the saved game')
        self.assertEqual(unit['source'], source)
        self.assertNotEqual(pilot.record_id({'sourceDigest': 'same'}, 'madlad', 'es', unit, 'model', 2),
            pilot.record_id({'sourceDigest': 'same'}, 'madlad', 'es', unit, 'model', 2, 'context-v2'))
        with self.assertRaises(ValueError): pilot.translation_input({**unit, 'source': 'Resume playback'}, 'context-v2')

    def test_literals_never_reach_the_model_and_are_reassembled_without_guessing(self):
        seen = []
        def model(texts):
            seen.extend(texts)
            values = {'Audio decoded locally. Duration:': 'Audio decodificado localmente. Duración:', 'seconds.': 'segundos.'}
            return [(values[text], False) for text in texts]
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        result = pilot.translate_literal_segments([source], model)
        self.assertEqual(result[0][0], 'Audio decodificado localmente. Duración: {duration} segundos.')
        self.assertTrue(pilot.automatic_checks(source, result[0][0], 'es')['protected_tokens_identical'])
        self.assertFalse(any('{duration}' in text or 'ZXQPH' in text for text in seen))
        with self.assertRaises(ValueError): pilot.translate_literal_segments([source], lambda texts: [])

    def test_literal_segmentation_preserves_repetitions_extensions_and_punctuation(self):
        source = 'Keep {count}, {count}, 25 MB, ASCII .dxf and UsefulVerse.'
        seen = []
        def model(texts):
            seen.extend(texts)
            return [(text.replace('Keep', 'Conserva').replace('and', 'y'), False) for text in texts]
        result = pilot.translate_literal_segments([source], model)[0][0]
        checks = pilot.automatic_checks(source, result, 'es')
        self.assertTrue(checks['protected_tokens_identical'])
        self.assertTrue(checks['technical_tokens_identical'])
        self.assertFalse(any(token in ' '.join(seen) for token in ['{count}', '25', 'MB', 'ASCII', '.dxf', 'UsefulVerse']))
        self.assertEqual(pilot.translate_literal_segments(['25 MB'], lambda _: self.fail('literal-only input must not run a model'))[0][0], '25 MB')
        broken = pilot.translate_literal_segments(['Value: {count}'], lambda texts: [('Valor {count}', False) for _ in texts])[0]
        self.assertIsNone(broken[0], 'A hallucinated extra placeholder must fail, never be repaired')

    def test_contextual_entries_preserve_literals_and_use_short_controlled_sentences(self):
        for entry in pilot.CONTEXT_POLICY['entries'].values():
            with self.subTest(concept=entry['concept']):
                self.assertEqual(hashlib.sha256(entry['source'].encode()).hexdigest(), entry['source_hash'])
                self.assertEqual(pilot.queue.signature(entry['source']), pilot.queue.signature(entry['translation_input']))
                self.assertTrue(pilot.automatic_checks(entry['source'], entry['translation_input'], 'en')['technical_tokens_identical'])
                for sentence in entry['translation_input'].split('. '): self.assertLessEqual(len(sentence.split()), 20)

    def test_segment_evidence_rejects_empty_prose_changed_literals_and_forged_assembly(self):
        trace = [{'kind': 'prose', 'input': 'Duration:', 'output': 'Duración:', 'leading_space': '', 'trailing_space': ' ', 'truncated': False},
            {'kind': 'literal', 'text': '{duration}'}]
        self.assertTrue(pilot.segment_evidence_valid(trace, 'Duration: {duration}', 'Duración: {duration}'))
        self.assertFalse(pilot.segment_evidence_valid(trace, 'Duration: {duration}', 'Duración: 00000000'))
        self.assertFalse(pilot.segment_evidence_valid(trace, 'Duration: {count}', 'Duración: {duration}'))
        empty = copy.deepcopy(trace); empty[0]['output'] = ''
        self.assertFalse(pilot.segment_evidence_valid(empty, 'Duration: {duration}', ' {duration}'))

    def test_literal_evidence_round_trip_for_a_thousand_input_shapes(self):
        for i in range(1000):
            source = (' ' * (i % 3)) + f'Keep {{count}}, {{count}}, {i} MB and ASCII .dxf.' + (' ' * (i % 2))
            traces = []
            result = pilot.translate_literal_segments([source], lambda texts: [(text, False) for text in texts], traces)
            self.assertEqual(result[0][0], source)
            self.assertTrue(pilot.segment_evidence_valid(traces[0], source, source))

    def test_full_sentence_variant_keeps_model_context_and_rejects_any_lost_literal(self):
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        seen, traces = [], []
        def model(texts):
            seen.extend(texts)
            return [('Audio decodificado localmente. Duración: {duration} segundos.', False)]
        value, raw, _ = pilot.translate_unmasked_sentences([source], model, traces)[0]
        self.assertEqual(seen, [source])
        self.assertEqual(value, raw)
        self.assertTrue(pilot.segment_evidence_valid(traces[0], source, raw))
        for broken in ['Audio decodificado. Duración: 00000000 segundos.', '', 'Audio {duration} {duration}']:
            self.assertIsNone(pilot.translate_unmasked_sentences([source], lambda _: [(broken, False)])[0][0])
        with self.assertRaises(ValueError): pilot.translate_unmasked_sentences([source], lambda _: [])
        self.assertIsNone(pilot.translate_unmasked_sentences(['Choose an ASCII .dxf file.'], lambda _: [('Elige un archivo ASCII DXF.', False)])[0][0])

    def test_a_baseline_record_cannot_impersonate_a_contextual_checkpoint(self):
        source = 'Save'
        unit = {'key': 'tool.button', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest(), 'context': 'button', 'legacy': {}}
        corpus = {'sourceDigest': 'same'}
        identity = pilot.record_id(corpus, 'madlad', 'es', unit, 'model', 2, 'context-v3')
        baseline = {'format': pilot.FORMAT, 'status': 'machine-draft', 'engine': 'madlad', 'engine_revision': pilot.ENGINES['madlad']['revision'],
            'record_id': identity, 'corpus_digest': 'same', 'locale': 'es', 'key': unit['key'], 'source': source,
            'source_hash': unit['source_hash'], 'candidate': 'model', 'beam_size': 2}
        with self.assertRaises(ValueError): pilot.pending_work(corpus, [unit], ['es'], 'madlad', 2, {identity: baseline}, 'context-v3')

    def test_actual_contextual_reference_checkpoint_resumes_without_a_model(self):
        import contextlib
        import io
        from types import SimpleNamespace
        from unittest.mock import patch
        checkpoint = pilot.ROOT / 'docs/quality/translation-pilot/checkpoints/context-v2/m2m100.jsonl'
        rows = [json.loads(line) for line in checkpoint.read_text().splitlines()]
        units = {}
        for row in rows:
            unit = units.setdefault(row['key'], {'key': row['key'], 'source': row['source'], 'source_hash': row['source_hash'],
                'context': row['context'], 'reference': True, 'legacy': {}})
            if row['candidate'] == 'legacy': unit['legacy'][row['locale']] = row['translation']
        self.assertEqual(len(units), 40)
        corpus = {'sourceDigest': rows[0]['corpus_digest'], 'fullSourceUnits': 214, 'locales': ['en', 'es', 'nb-NO'], 'units': list(units.values())}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'corpus.json'; path.write_text(json.dumps(corpus))
            args = SimpleNamespace(corpus=path, resume=checkpoint, locales='es,nb-NO', scope='references', engine='m2m100', beam_size=2, policy='context-v2')
            stream = io.StringIO()
            with patch.object(pilot, 'actions_only'), patch.object(pilot.subprocess, 'run', side_effect=AssertionError('Unexpected model conversion')), contextlib.redirect_stdout(stream):
                pilot.run(args)
            self.assertIn('"conversion_seconds":0', stream.getvalue())

    def test_reviewed_memory_is_bound_to_source_context_and_destination(self):
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        unit = {'key': 'voice-changer.fields.loaded', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest(), 'context': 'fields.loaded'}
        text = pilot.reviewed_memory(unit, 'es', 'context-v4')
        self.assertEqual(text, 'Audio decodificado localmente. Duración: {duration} segundos.')
        self.assertIsNone(pilot.reviewed_memory(unit, 'fr', 'context-v4'))
        self.assertIsNone(pilot.reviewed_memory(unit, 'es', 'context-v3'))
        for changed in [{'source_hash': 'stale'}, {'context': 'another-sense'}]:
            with self.assertRaises(ValueError): pilot.reviewed_memory({**unit, **changed}, 'es', 'context-v4')

    def test_reviewed_memory_bypasses_model_without_fabricating_model_output(self):
        source = 'Audio decoded locally. Duration: {duration} seconds.'
        unit = {'key': 'voice-changer.fields.loaded', 'source': source, 'source_hash': hashlib.sha256(source.encode()).hexdigest(), 'context': 'fields.loaded'}
        def no_model(*args): self.fail('Reviewed memory hit must never be retranslated')
        values, traces, memory = pilot.forward_with_memory([unit], 'es', 'context-v4', no_model)
        self.assertIn('{duration}', values[0][0])
        self.assertIsNone(traces[0])
        self.assertEqual(memory, [values[0][0]])

    def test_every_reviewed_memory_entry_preserves_literals_and_has_actual_agent_provenance(self):
        for entry in pilot.POLICIES['context-v4']['reviewed_memory'].values():
            self.assertEqual(entry['review_kind'], 'agent')
            self.assertFalse(entry['native_review'])
            self.assertTrue(entry['reviewer'])
            for locale, text in entry['translations'].items():
                checks = pilot.automatic_checks(entry['source'], text, locale)
                self.assertTrue(checks['protected_tokens_identical'])
                self.assertTrue(checks['technical_tokens_identical'])

    def test_a_good_forward_extension_cannot_hide_its_loss_on_back_translation(self):
        checks = pilot.automatic_checks('Choose an ASCII .dxf file.', 'Velg en ASCII .dxf-fil.', 'nb-NO',
            back_translation='Choose an ASCII DXF file.')
        self.assertTrue(checks['technical_tokens_identical'])
        self.assertFalse(checks['back_technical_tokens_identical'])

    def test_unit_symbols_survive_forward_and_back_translation_in_unit_labels(self):
        checks = pilot.automatic_checks('Inches (in)', 'Pulgadas (pulgadas)', 'es', 'dxf-viewer.fields.units.1', 'Inches (inches)')
        self.assertFalse(checks['unit_symbols_identical'])
        self.assertFalse(checks['back_unit_symbols_identical'])
        checks = pilot.automatic_checks('Kilometres (km)', 'Kilometer (km)', 'nb-NO', 'dxf-viewer.fields.units.7', 'Kilometers (miles)')
        self.assertTrue(checks['unit_symbols_identical'])
        self.assertFalse(checks['back_unit_symbols_identical'])
        ordinary = pilot.automatic_checks('Audio stays in this browser.', 'El audio permanece en este navegador.', 'es', 'voice-changer.fields.privacy')
        self.assertIsNone(ordinary['unit_symbols_identical'], 'English preposition in is not a unit token')

    def test_missing_sentence_spacing_is_not_misreported_as_a_file_extension_change(self):
        checks = pilot.automatic_checks('Audio decoded. Try again.', 'Audio decodificado.Prueba otra vez.', 'es')
        self.assertTrue(checks['technical_tokens_identical'])


if __name__ == '__main__': unittest.main()
