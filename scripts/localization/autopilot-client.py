"""GitHub-only, captured-byte client. No hosted model API or external service."""
import json
import subprocess

REPOSITORY='pedronunezwebs-hash/usefulverse'
RESULT_BRANCH='automation/translation-results'
_escape=None


def request(path, method='GET', payload=None):
    global _escape
    command=['gh','api']
    allow=path.endswith('/logs') and _escape is not False
    if allow: command.append('--allow-escape-sequences')
    command.append('repos/'+REPOSITORY+'/'+path)
    if method!='GET': command+=['--method',method]
    data=None
    if payload is not None:
        command+=['--input','-'];data=json.dumps(payload,allow_nan=False).encode()
    result=subprocess.run(command,input=data,capture_output=True)
    if allow and result.returncode and b'unknown flag' in result.stderr:
        _escape=False;command.remove('--allow-escape-sequences')
        result=subprocess.run(command,input=data,capture_output=True)
    if result.returncode:
        if b'HTTP 404' in result.stderr:raise FileNotFoundError(path)
        raise RuntimeError('GitHub request failed: '+result.stderr.decode()[:1600])
    return result.stdout


def api(path, method='GET', payload=None):
    return json.loads(request(path,method,payload))
