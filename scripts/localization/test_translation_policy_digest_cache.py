"""Performance must preserve mutable inputs, failures and pinned-file validation."""
import copy
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import Mock, patch

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location('pilot', HERE / 'translation-pilot.py')
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)

def factory(callback):
    path = HERE / 'pilot-policy-digest-cache.py'
    if not path.exists():
        return callback  # Before the optimization, every call serializes the same policy.
    spec = importlib.util.spec_from_file_location('policy_digest_cache', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.cache_policy_digests(callback, pilot.POLICIES, (pilot._FrozenPolicyDict, pilot._FrozenPolicyList))

class PolicyDigestCacheTest(unittest.TestCase):
    def test_unchanged_known_policy_memory_is_serialized_once(self):
        original = getattr(pilot.digest, '__wrapped__', pilot.digest)
        callback = Mock(wraps=original)
        cached = factory(callback)
        value = pilot.POLICIES['context-v27']['reviewed_memory']
        expected = original(value)
        self.assertEqual([cached(value) for _ in range(8)], [expected] * 8)
        self.assertEqual(callback.call_count, 1, 'Repeated immutable policy serialization is the measured bottleneck')

    def test_mutable_copy_is_recomputed_after_every_edit(self):
        original = getattr(pilot.digest, '__wrapped__', pilot.digest)
        cached = factory(original)
        value = copy.deepcopy(pilot.POLICIES['context-v27']['reviewed_memory'])
        before = cached(value)
        key = next(iter(value))
        value[key]['source'] += ' changed'
        self.assertNotEqual(cached(value), before)
        self.assertEqual(cached(value), original(value))

    def test_arbitrary_frozen_container_with_mutable_child_is_never_trusted(self):
        original = getattr(pilot.digest, '__wrapped__', pilot.digest)
        cached = factory(original)
        child = [1]
        value = pilot._FrozenPolicyDict({'tuple': (child,)})
        before = cached(value)
        child.append(2)
        self.assertNotEqual(cached(value), before)

    def test_replaced_policy_and_equal_mutable_values_are_recomputed(self):
        original = getattr(pilot.digest, '__wrapped__', pilot.digest)
        callback = Mock(wraps=original)
        cached = factory(callback)
        known = pilot.POLICIES['context-v27']['entries']
        expected = cached(known)
        other = copy.deepcopy(known)
        self.assertEqual(cached(other), expected)
        self.assertEqual(cached(other), expected)
        self.assertEqual(callback.call_count, 3)

    def test_exceptions_are_not_cached(self):
        callback = Mock(side_effect=[ValueError('incomplete'), 'valid'])
        cached = factory(callback)
        known = pilot.POLICIES['context-v27']['entries']
        with self.assertRaisesRegex(ValueError, 'incomplete'):
            cached(known)
        self.assertEqual(cached(known), 'valid')
        self.assertEqual(callback.call_count, 2)

    def test_warm_policy_cache_does_not_cache_or_skip_dependency_reads(self):
        pilot.v27_quantity_contracts()
        manifest = pilot.ROOT / 'docs/quality/translation-pilot/numeric-sources/context-v27/manifest.json'
        old_read = Path.read_bytes
        def damaged(path):
            value = old_read(path)
            return value + b' ' if path == manifest else value
        with patch.object(Path, 'read_bytes', damaged):
            with self.assertRaisesRegex(ValueError, 'manifest/profile'):
                pilot.v27_quantity_contracts()

if __name__ == '__main__':
    unittest.main()
