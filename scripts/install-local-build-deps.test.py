import importlib.util
import json
from pathlib import Path
import unittest
import copy

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("localdeps", ROOT / "scripts/install-local-build-deps.py")
localdeps = importlib.util.module_from_spec(spec)
spec.loader.exec_module(localdeps)


class BrowserDependencyTests(unittest.TestCase):
    def test_exact_browser_graph_keeps_both_common_versions_without_native_inference(self):
        package = json.loads((ROOT / "package.json").read_text())
        lock = json.loads((ROOT / "package-lock.json").read_text())
        original = copy.deepcopy(lock)
        manifest, derived = localdeps.browser_lock(package, lock)
        self.assertEqual(lock, original)
        self.assertNotIn("node_modules/onnxruntime-node", derived["packages"])
        self.assertNotIn("node_modules/sharp", derived["packages"])
        for path, value in derived["packages"].items():
            if path:
                self.assertEqual(value, lock["packages"][path])
        self.assertEqual(manifest["dependencies"]["onnxruntime-common"], lock["packages"]["node_modules/onnxruntime-common"]["version"])
        self.assertIn("node_modules/onnxruntime-web/node_modules/onnxruntime-common", derived["packages"])

    def test_missing_required_package_fails(self):
        package = json.loads((ROOT / "package.json").read_text())
        lock = json.loads((ROOT / "package-lock.json").read_text())
        del lock["packages"]["node_modules/esbuild"]
        with self.assertRaises(ValueError):
            localdeps.browser_lock(package, lock)

    def test_bad_archive_integrity_never_extracts(self):
        with self.assertRaises(ValueError):
            localdeps.extract_locked_package(b"damaged", {"integrity": "sha512-invalid"}, ROOT)


if __name__ == "__main__":
    unittest.main()
