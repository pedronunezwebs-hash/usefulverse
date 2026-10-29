"""Exact same-turn S/F/B reuse must cover every current row and fail closed."""
import hashlib
import json
from pathlib import Path
import unittest

DATA = Path(__file__).resolve().parents[2] / 'docs/quality/translation-pilot'


class SameTurnReadReuseTest(unittest.TestCase):
    def test_reuse_binds_exact_source_context_candidate_forward_and_back(self):
        proof = json.loads((DATA / 'same-turn-read-reuse-v33.json').read_text())
        self.assertEqual(proof['fields'], ['key', 'locale', 'candidate', 'source', 'source_hash', 'context', 'translation', 'back_translation'])
        old = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v32/madlad.jsonl').read_text().splitlines())}
        current = {r['record_id']: r for r in map(json.loads, (DATA / 'checkpoints/context-v33/madlad.jsonl').read_text().splitlines())}
        self.assertTrue(proof['same_turn'])
        self.assertFalse(proof['independent_rereview_claimed'])
        self.assertFalse(proof['native_review'])
        self.assertEqual(proof['approved_locales'], [])
        self.assertEqual(set(proof['prior_direct_read_record_ids']), set(old))
        seen = set()
        reused = 0
        new = []
        for phase in proof['phases'].values():
            for pair in phase['reused_exact_pairs']:
                identity = pair['current_record_id']
                self.assertNotIn(identity, seen)
                seen.add(identity)
                row, prior = current[identity], old[pair['prior_record_id']]
                self.assertEqual([row[k] for k in proof['fields']], [prior[k] for k in proof['fields']])
                value = json.dumps([row[k] for k in proof['fields']], ensure_ascii=False, separators=(',', ':'))
                self.assertEqual(hashlib.sha256(value.encode()).hexdigest(), pair['fields_sha256'])
                reused += 1
            for identity in phase['new_text_record_ids']:
                self.assertNotIn(identity, seen)
                seen.add(identity)
                new.append(current[identity])
        self.assertEqual(seen, set(current))
        self.assertEqual(len(current), 333)
        self.assertEqual(reused, 279)
        self.assertEqual(len(new), 54)
        prior_by_key = {(r['key'], r['candidate']): r for r in old.values()}
        changed_forward = [r for r in new if r['translation'] != prior_by_key[(r['key'], r['candidate'])]['translation']]
        self.assertEqual(len(changed_forward), 1)
        self.assertEqual(changed_forward[0]['key'], 'dxf-viewer.fields.loaded')
        self.assertEqual(changed_forward[0]['translation'], 'Чертёж загружен локально.')

    def test_all_current_judgments_declare_reuse_or_actual_new_read(self):
        proof = json.loads((DATA / 'same-turn-read-reuse-v33.json').read_text())
        reused = {x['current_record_id'] for p in proof['phases'].values() for x in p['reused_exact_pairs']}
        for path in DATA.glob('review-context-v33-*.json'):
            review = json.loads(path.read_text())
            self.assertFalse(review['native_review'])
            self.assertEqual(review['approved_locales'], [])
            for row in review['rows']:
                origin = 'same-turn-exact-SFB-review-reuse' if row['record_ids'][0] in reused else 'direct-current-S/F/B-agent-review'
                self.assertEqual(row['score_origin'], origin)

    def test_reusable_partition_rejects_changed_context_back_or_stale_source(self):
        import copy
        import importlib.util
        spec = importlib.util.spec_from_file_location('reuse', Path(__file__).with_name('pilot-review-reuse.py'))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        source = 'Drawing loaded locally.'
        row = dict(record_id='old', key='loaded', locale='ru', candidate='model', source=source, source_hash=hashlib.sha256(source.encode()).hexdigest(), context='fields.loaded', translation='Чертёж загружен локально.', back_translation=source)
        current = dict(row, record_id='current')
        pairs, new = module.partition([row], [current], {'old'})
        self.assertEqual(len(pairs), 1)
        self.assertEqual(new, [])
        for field in ['key', 'locale', 'candidate', 'context', 'translation', 'back_translation']:
            changed = dict(current, **{field: 'changed'})
            with self.subTest(field=field):
                self.assertEqual(module.partition([row], [changed], {'old'}), ([], [changed]))
        with self.assertRaises(ValueError):
            module.partition([row], [dict(current, source_hash='stale')], {'old'})
        with self.assertRaises(ValueError):
            module.partition([row], [current], {'unread'})
        with self.assertRaises(ValueError):
            module.partition([row], [current, current], {'old'})
