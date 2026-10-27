"""Independent four-repair Russian route; all33 measured files unchanged."""
import importlib.util
from pathlib import Path
sp=importlib.util.spec_from_file_location('entry32',Path(__file__).with_name('translation-pilot-v32.py'));entry=importlib.util.module_from_spec(sp);sp.loader.exec_module(entry);pilot=entry.pilot
sp=importlib.util.spec_from_file_location('ru33',Path(__file__).with_name('pilot-russian-v33.py'));route=importlib.util.module_from_spec(sp);sp.loader.exec_module(route);route.install(vars(pilot))
if __name__=='__main__':pilot.main()
