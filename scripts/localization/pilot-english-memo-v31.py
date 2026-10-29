"""Bounded exact English delegation cache; frozen parser remains the oracle.

Every lookup checks the complete local policy/evidence/code inventory, including
ctime, inode and read-function identities. Unknown/non-English work delegates.
Results are copied so callers cannot mutate later evidence. No disk cache.
"""
from collections import OrderedDict
import copy
import os
from pathlib import Path

class EnglishMemo:
    def __init__(self, namespace, original, limit=4096):
        self.ns, self.original, self.limit = namespace, original, limit
        self.root = namespace['ROOT']
        self.frozen_type = type(namespace['freeze_policy']({}))
        self.cache = OrderedDict()
        self.directories = ()
        self.files = ()
        self.inventory_stamp = None
        self.epoch = None
        self.hits = self.misses = 0

    @staticmethod
    def signature(path):
        try:
            s = os.stat(path)
            return s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns, s.st_ctime_ns
        except FileNotFoundError:
            return None

    def stamp(self):
        if self.ns['ROOT'] != self.root:
            return None
        policies = self.ns['POLICIES']
        if any(type(p) is not self.frozen_type for p in policies.values()):
            return None
        roots = [self.root/'docs/quality/translation-pilot', self.root/'scripts/localization']
        dirs_now = tuple((str(d), self.signature(d)) for d in self.directories)
        if not self.directories or dirs_now != self.inventory_stamp:
            directories, files = set(roots), set()
            for folder in roots:
                if folder.exists():
                    for path in folder.rglob('*'):
                        if path.is_dir(): directories.add(path)
                        elif path.is_file(): files.add(path)
            src = self.root/'src/markets-no-ch'
            directories.add(src)
            files.update(src/(tool+'-'+suffix+'.mjs') for tool in ['voice-changer','shikaku','dxf-viewer'] for suffix in ['copy-en','translations'])
            self.directories, self.files = sorted(directories), sorted(files)
            self.inventory_stamp = tuple((str(d), self.signature(d)) for d in self.directories)
        path = self.ns['Path']
        return (self.inventory_stamp, tuple((str(f), self.signature(f)) for f in self.files),
                tuple(sorted((name, id(value)) for name, value in self.ns.items())),
                tuple(sorted((name, id(value)) for name, value in policies.items())),
                id(path.read_bytes), id(path.read_text), id(path.stat), id(self.original))

    def __call__(self, text, locale, opposite=None):
        if locale != 'en':
            return self.original(text, locale, opposite)
        epoch = self.stamp()
        if epoch is None:
            return self.original(text, locale, opposite)
        if epoch != self.epoch:
            self.cache.clear()
            self.epoch = epoch
        key = text, locale, opposite
        if key in self.cache:
            self.hits += 1
            self.cache.move_to_end(key)
            return copy.deepcopy(self.cache[key])
        self.misses += 1
        result = self.original(text, locale, opposite)
        # Recursive oracle calls can populate/change the epoch. Only store if the
        # dependency snapshot still equals the one used before this computation.
        if self.stamp() == epoch:
            self.cache[key] = copy.deepcopy(result)
            self.cache.move_to_end(key)
            while len(self.cache) > self.limit:
                self.cache.popitem(last=False)
        return result

def install(namespace):
    route = namespace['BENGALI_V29']
    memo = EnglishMemo(namespace, route.numeric)
    route.numeric = memo
    namespace['ENGLISH_MEMO_V31'] = memo
    return memo
