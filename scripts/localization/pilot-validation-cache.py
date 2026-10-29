"""Bounded, process-local reuse of immutable inputs; no saved approvals or disk cache.

File reuse requires the same device, inode, size and nanosecond mtime/ctime.
Restoring mtime does not restore ctime. Unstable reads fail closed. Filesystems
without these metadata fields use ordinary reads. Every consumer still checks
the pinned SHA256; the hash cache is keyed by the exact immutable bytes.
"""
from collections import OrderedDict
from functools import wraps
import io
import hashlib as native_hashlib
import os
from pathlib import Path


class BoundedCache:
    def __init__(self, byte_limit=32 * 1024 * 1024, entry_limit=512):
        self.byte_limit = byte_limit
        self.entry_limit = entry_limit
        self.bytes = 0
        self.entries = OrderedDict()

    def get(self, key):
        item = self.entries.get(key)
        if item is not None:
            self.entries.move_to_end(key)
            return item[0]
        return None

    def put(self, key, value, size):
        old = self.entries.pop(key, None)
        if old is not None:
            self.bytes -= old[1]
        if size > self.byte_limit:
            return
        self.entries[key] = (value, size)
        self.bytes += size
        while self.bytes > self.byte_limit or len(self.entries) > self.entry_limit:
            _, (_, removed) = self.entries.popitem(last=False)
            self.bytes -= removed

    def clear(self):
        self.entries.clear()
        self.bytes = 0


FILE_BYTES = BoundedCache()
SHA256_BYTES = BoundedCache()


def file_signature(info):
    fields = ('st_dev', 'st_ino', 'st_size', 'st_mtime_ns', 'st_ctime_ns')
    if not all(hasattr(info, key) for key in fields) or info.st_ctime_ns % 1_000_000_000 == 0:
        return None  # Coarse change times cannot safely identify a same-second edit.
    return tuple(getattr(info, key) for key in fields)


class ValidatedPath(type(Path())):
    def read_bytes(self):
        before = file_signature(self.stat())
        key = os.path.abspath(self)
        saved = FILE_BYTES.get(key)
        if before is not None and saved is not None and saved[0] == before:
            return saved[1]
        value = super().read_bytes()
        after = file_signature(self.stat())
        if before is not None and (before != after or len(value) != before[2]):
            raise OSError('File changed during validation read: ' + str(self))
        if after is not None:
            FILE_BYTES.put(key, (after, value), len(value))
        return value

    def read_text(self, encoding=None, errors=None, newline=None):
        with io.TextIOWrapper(io.BytesIO(self.read_bytes()), encoding=encoding, errors=errors, newline=newline) as stream:
            return stream.read()


class HashlibView:
    def __init__(self, original):
        self.original = original
        self.cache = SHA256_BYTES if original is native_hashlib else BoundedCache()

    def __getattr__(self, name):
        return getattr(self.original, name)

    def sha256(self, value=b'', **kwargs):
        # Mutable buffers, nondefault constructor options and other algorithms
        # keep their native semantics. Return a copy, so update() stays local.
        if type(value) is not bytes or kwargs:
            return self.original.sha256(value, **kwargs)
        saved = self.cache.get(value)
        if saved is not None:
            return saved.copy()
        result = self.original.sha256(value)
        self.cache.put(value, result.copy(), len(value))
        return result


def cache_policy_digests(original, policies, frozen_types):
    # Only these JSON-loaded, deeply frozen policy objects are trusted. An
    # arbitrary frozen container can hide a mutable child inside a tuple.
    known = {}
    for policy in policies.values():
        if type(policy) not in frozen_types:
            continue
        for value in (policy, policy.get('entries'), policy.get('reviewed_memory')):
            if type(value) in frozen_types:
                known[id(value)] = value
    hashes = {}

    @wraps(original)
    def cached(value):
        identity = id(value)
        if known.get(identity) is not value:
            return original(value)
        if identity not in hashes:
            hashes[identity] = original(value)
        return hashes[identity]
    return cached
