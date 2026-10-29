"""Independent v29 entry point; the measured v28 runtime files remain byte-identical."""
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location('usefulverse_historical_pilot', Path(__file__).with_name('translation-pilot.py'))
pilot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pilot)
spec = importlib.util.spec_from_file_location('usefulverse_bengali_v29', Path(__file__).with_name('pilot-bengali-v29.py'))
route = importlib.util.module_from_spec(spec)
spec.loader.exec_module(route)
route.install(vars(pilot))
if __name__ == '__main__': pilot.main()
