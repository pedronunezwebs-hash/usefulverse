import fcntl, json, os, signal, subprocess, sys, time
from pathlib import Path
root=Path.cwd().resolve()
report=Path(sys.argv[1]);log=Path(sys.argv[2]);cmd=sys.argv[3:]
assert report.resolve().is_relative_to(root/'.qa-phase0') and log.resolve().is_relative_to(root/'.qa-phase0') and cmd
lock=(root/'.qa-phase0/heavy.lock').open('a')
try: fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
except BlockingIOError: raise SystemExit('Another owned heavy command is running')
maximum=0;minimum=None;samples=0;stopped=False
def resources():
    global maximum,minimum,samples
    total=0;seen=set()
    for folder,_,files in os.walk(root,followlinks=False):
        for name in files:
            p=Path(folder)/name
            if p.is_symlink():continue
            try:s=p.stat()
            except FileNotFoundError:continue
            key=(s.st_dev,s.st_ino)
            if key not in seen:total+=s.st_size;seen.add(key)
    s=os.statvfs(root);free=s.f_bavail*s.f_frsize
    maximum=max(maximum,total);minimum=free if minimum is None else min(minimum,free);samples+=1
    return total<=2_000_000_000 and free>=10_000_000_000
if not resources():raise SystemExit('Resource budget exceeded before command')
with log.open('w') as stream:
    process=subprocess.Popen(cmd,stdout=stream,stderr=subprocess.STDOUT,start_new_session=True)
    try:
        while process.poll() is None:
            if not resources():
                stopped=True;os.killpg(process.pid,signal.SIGTERM);break
            time.sleep(2)
        code=process.wait()
    finally:
        if process.poll() is None:os.killpg(process.pid,signal.SIGTERM);process.wait()
resources()
result={'command':cmd,'exitCode':code,'resourceStop':stopped,'maxSampledWorkingBytes':maximum,'minSampledFreeBytes':minimum,'samples':samples,'workingBudgetBytes':2_000_000_000,'minFreeBytes':10_000_000_000}
report.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
raise SystemExit(1 if stopped else code)
