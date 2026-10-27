"""Resolve trusted source and avoid model jobs once the current queue is processed."""
import base64
import importlib.util
import json
import os
from pathlib import Path
from urllib.parse import quote
spec=importlib.util.spec_from_file_location('client',Path(__file__).with_name('autopilot-client.py'))
client=importlib.util.module_from_spec(spec);spec.loader.exec_module(client)
ALLOWED={'main','feat/new-tools-batch-1'}


def resolve():
    if client.api('')['private']:raise RuntimeError('Public repository required for zero-cost runners')
    control=json.loads(Path(__file__).with_name('translation-control.json').read_text())
    ref=os.environ.get('REQUESTED_SOURCE_REF','')
    if not ref and os.environ.get('GITHUB_EVENT_NAME')=='push':ref=os.environ.get('GITHUB_REF_NAME','')
    if not ref:
        try:
            blob=client.api('contents/manifest.json?ref='+quote(client.RESULT_BRANCH,safe=''))
            ref=json.loads(base64.b64decode(blob['content'])).get('source_ref')
        except FileNotFoundError:pass
    ref=ref or control['source_ref']
    if ref not in ALLOWED:raise ValueError('Untrusted source branch')
    sha=client.api('commits/'+quote(ref,safe=''))['sha']
    values=dict(source_ref=ref,source_sha=sha,enabled=str(control['enabled']).lower())
    print(json.dumps(values))
    with open(os.environ['GITHUB_OUTPUT'],'a') as handle:
        for key,value in values.items():handle.write(f'{key}={value}\n')


if __name__=='__main__':resolve()
