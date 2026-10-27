"""Review-only view connecting exact scoped findings to the common review API.

The original module dictionary and all inference functions remain unchanged.
In particular record_flags still uses its frozen global semantic detector, so
no historical checkpoint flag is retroactively changed. Explicit reviewer calls
also see the new forward fixtures. Attribute patches/vars reach the real module.
"""
import hashlib
import json

class ReviewView:
    __slots__ = ('_module',)

    def __init__(self, module):
        object.__setattr__(self, '_module', module)

    @property
    def __dict__(self):
        return vars(self._module)

    def __getattr__(self, name):
        return getattr(self._module, name)

    def __setattr__(self, name, value):
        setattr(self._module, name, value)

    def __delattr__(self, name):
        delattr(self._module, name)

    def semantic_issues(self, key, source_hash, text, locale, direction='forward'):
        found = self._module.semantic_issues(key, source_hash, text, locale, direction)
        if direction != 'forward':
            return found
        for policy in ['context-v30','context-v31']:
            path=self.ROOT/'docs/quality/translation-pilot'/('scoped-forward-regressions-'+policy.replace('context-','')+'.json')
            if not path.exists():continue
            registry=json.loads(path.read_text())
            if registry['native_review']is not False or registry['approved_locales']!=[]:raise ValueError('Review detector cannot approve languages')
            for case in registry['cases']:
                if case['inference_policy']!=policy or case['direction']!='forward'or case['blocks_gate']is not True:raise ValueError('Invalid scoped forward fixture')
                if hashlib.sha256(case['translation'].encode()).hexdigest()!=case['translation_hash']:raise ValueError('Stale forward text hash')
                if(key,source_hash,text,locale)==(case['key'],case['source_hash'],case['translation'],case['locale']):found=found+[case['issue']]
        return sorted(set(found))
