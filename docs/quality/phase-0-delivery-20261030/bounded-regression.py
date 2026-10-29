"""Permanent regression for accidental overlap of owned local heavy jobs."""
import fcntl, json, shutil, subprocess, sys, tempfile
from pathlib import Path

root=Path.cwd();qa=root/'.qa-phase0';qa.mkdir(exist_ok=True)
wrapper=Path(__file__).with_name('bounded-runner.py').resolve()
temporary=Path(tempfile.mkdtemp(prefix='lock-regression-',dir=qa))
try:
    report=temporary/'report.json';log=temporary/'child.log'
    command=[sys.executable,str(wrapper),str(report),str(log),sys.executable,'-c',"print('lock released')"]
    with (qa/'heavy.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        blocked=subprocess.run(command,text=True,capture_output=True)
        assert blocked.returncode!=0 and 'Another owned heavy command' in blocked.stderr+blocked.stdout
        assert not report.exists() and not log.exists()
    released=subprocess.run(command,text=True,capture_output=True)
    assert released.returncode==0 and json.loads(report.read_text())['exitCode']==0
    assert 'lock released' in log.read_text()
    print(json.dumps({'secondJobBlocked':True,'blockedChildNotStarted':True,'nextJobWorksAfterRelease':True}))
finally:
    shutil.rmtree(temporary)
