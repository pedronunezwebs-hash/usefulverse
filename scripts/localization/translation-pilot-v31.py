"""Independent known Russian corpus; old23 runtime files remain byte-exact."""
import importlib.util
from pathlib import Path
sp=importlib.util.spec_from_file_location('entry30',Path(__file__).with_name('translation-pilot-v30.py'));entry=importlib.util.module_from_spec(sp);sp.loader.exec_module(entry);pilot=entry.pilot
sp=importlib.util.spec_from_file_location('memo31',Path(__file__).with_name('pilot-english-memo-v31.py'));memo=importlib.util.module_from_spec(sp);sp.loader.exec_module(memo);memo.install(vars(pilot))
sp=importlib.util.spec_from_file_location('ru31',Path(__file__).with_name('pilot-russian-v31.py'));route=importlib.util.module_from_spec(sp);sp.loader.exec_module(route);route.install(vars(pilot))
if __name__=='__main__':pilot.main()
