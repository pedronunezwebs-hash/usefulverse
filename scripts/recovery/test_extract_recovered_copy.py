import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location("recovered_copy", Path(__file__).with_name("extract-recovered-copy.py"))
recovery = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(recovery)


class RecoveredCopyTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix=".recovered-copy-test-", dir=recovery.ROOT)
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.source = self.root / "snapshot"
        self.manifest = self.root / "manifest.json"
        self.tool_id = "example-tool"
        self.copy = {
            "copyLanguage": "en", "localizationStatus": "approved", "name": "Example tool",
            "title": "Example title", "description": "Example description", "intro": "Choose your input.",
            "fields": {"value": "Input value", "formula": "The formula is x² + y²."},
            "actions": {"calculate": "Calculate"}, "messages": {"ready": "Ready", "done": "Done"},
            "example": {"label": "Load example", "values": {"method": "karvonen", "cards": "As Ad"}},
            "exampleXml": "<value>Example</value>", "exampleCsv": "a,b\n1,2",
            "puzzles": [{"id": "sun", "answer": "sun", "clue": "A star"}],
        }
        self.html = self.source / "pages/tools/example-tool/index.html"
        self.html.parent.mkdir(parents=True)
        self.controller = self.source / "assets/recovered-live-only-106/controllers/example-tool.js"
        self.controller.parent.mkdir(parents=True)
        self.controller.write_text("throw new Error('This JavaScript must never be executed');\n")
        self.manifest.write_text(json.dumps({"tools": [{"id": self.tool_id, "h1": "Example tool"}]}))
        self.write_html()

    def write_html(self, payload=None, lang="en", owner="example-tool", suffix=".js", extra=""):
        data = json.dumps(self.copy, ensure_ascii=False) if payload is None else payload
        self.html.write_text(f'<html lang="{lang}"><main data-tool="{owner}">'
                             f"<script data-tool-copy type='application/json'>{data}</script>{extra}"
                             f'<script type="module" src="/assets/recovered-live-only-106/controllers/example-tool{suffix}"></script>'
                             '</main></html>')

    def extract(self):
        return recovery.extract_documents(self.source, self.manifest, self.root, expected_count=1)

    def test_recovers_prose_and_preserves_formula_without_executing_controller(self):
        document = self.extract()[self.tool_id]
        self.assertEqual(document["sourceCopy"]["fields"], self.copy["fields"])
        self.assertNotIn("localizationStatus", document["sourceCopy"])
        self.assertNotIn("copyLanguage", document["sourceCopy"])
        self.assertEqual(document["provenance"]["status"], "recovered-ui-not-quality-approved")

    def test_raw_examples_and_game_data_stay_outside_translatable_copy(self):
        document = self.extract()[self.tool_id]
        for key in ["exampleXml", "exampleCsv", "puzzles"]:
            self.assertNotIn(key, document["sourceCopy"])
            self.assertEqual(document["nonTranslatableCopy"][key], self.copy[key])
        self.assertEqual(document["sourceCopy"]["example"], {"label": "Load example"})
        self.assertEqual(document["nonTranslatableCopy"]["example"]["values"], self.copy["example"]["values"])

    def test_visible_category_label_is_prose_but_example_category_is_an_internal_value(self):
        self.copy["category"] = "Writing & language"
        self.copy["example"]["category"] = "nature"
        self.write_html()
        document = self.extract()[self.tool_id]
        self.assertEqual(document["sourceCopy"].get("category"), "Writing & language")
        self.assertEqual(document["nonTranslatableCopy"]["example"]["category"], "nature")

    def test_controller_suffix_used_by_push_up_and_memory_tests(self):
        self.controller.rename(self.controller.with_name("example-tool.controller.js"))
        self.write_html(suffix=".controller.js")
        self.assertTrue(self.extract()[self.tool_id]["provenance"]["controllerPath"].endswith(".controller.js"))

    def test_wrong_page_or_copy_language_and_owner_are_rejected(self):
        for case in [dict(lang="es"), dict(owner="other-tool"), dict(payload=json.dumps(dict(self.copy, copyLanguage="de")))]:
            with self.subTest(case=case), self.assertRaises(ValueError):
                self.write_html(**case)
                self.extract()

    def test_copy_name_must_match_inventory_owner(self):
        self.write_html(payload=json.dumps(dict(self.copy, name="Another tool")))
        with self.assertRaisesRegex(ValueError, "another tool"):
            self.extract()

    def test_missing_or_duplicate_copy_is_rejected(self):
        duplicate = '<script data-tool-copy type="application/json">{}</script>'
        self.write_html(extra=duplicate)
        with self.assertRaisesRegex(ValueError, "Ambiguous"):
            self.extract()
        self.html.write_text(self.html.read_text().replace("data-tool-copy", "data-other-copy"))
        with self.assertRaisesRegex(ValueError, "Ambiguous"):
            self.extract()

    def test_duplicate_keys_unsafe_keys_and_nonfinite_numbers_are_rejected(self):
        for text in ['{"a":1,"a":2}', '{"__proto__":{}}', '{"x":NaN}', '{"x":Infinity}']:
            with self.subTest(text=text), self.assertRaises(ValueError):
                recovery.strict_json(text)

    def test_duplicate_html_attribute_and_non_json_script_are_rejected(self):
        for before, after in [('data-tool-copy type=', 'data-tool-copy data-tool-copy type='),
                              ("application/json", "text/javascript")]:
            self.write_html()
            self.html.write_text(self.html.read_text().replace(before, after))
            with self.subTest(after=after), self.assertRaises(ValueError):
                self.extract()

    def test_duplicate_ids_path_traversal_and_missing_inventory_rows_are_rejected(self):
        for tools in [[{"id": "../escape", "h1": "Example tool"}], [],
                      [{"id": "example-tool", "h1": "Example tool"}] * 2]:
            self.manifest.write_text(json.dumps({"tools": tools}))
            with self.subTest(tools=tools), self.assertRaises(ValueError):
                self.extract()

    def test_mixed_controller_or_missing_required_ui_fails_before_output_exists(self):
        self.html.write_text(self.html.read_text().replace("example-tool.js", "different-tool.js"))
        with self.assertRaises(ValueError):
            self.extract()
        original = copy.deepcopy(self.copy)
        for key in ["fields", "actions", "messages", "intro"]:
            self.write_html(payload=json.dumps({k: v for k, v in original.items() if k != key}))
            with self.subTest(key=key), self.assertRaises(ValueError):
                self.extract()
        self.assertFalse((self.root / "output").exists())

    def test_symlinked_page_controller_and_output_are_rejected(self):
        for path in [self.html, self.controller]:
            data = path.read_bytes()
            target = path.with_suffix(".real")
            path.rename(target)
            path.symlink_to(target.name)
            with self.subTest(path=path.name), self.assertRaises(ValueError):
                self.extract()
            path.unlink()
            path.write_bytes(data)
        documents = self.extract()
        (self.root / "real-output").mkdir()
        (self.root / "output").symlink_to("real-output")
        with self.assertRaises(ValueError):
            recovery.write_documents(documents, self.root / "output")

    def test_reproducible_write_check_and_stale_source_rejection(self):
        documents = self.extract()
        output = self.root / "output"
        recovery.write_documents(documents, output)
        recovery.verify_documents(documents, output)
        target = output / "example-tool.json"
        target.write_bytes(target.read_bytes().replace(b'Choose your input.', b'Changed text.'))
        with self.assertRaisesRegex(ValueError, "Stale"):
            recovery.verify_documents(documents, output)

    def test_refuses_to_overwrite_improved_sources(self):
        documents = self.extract()
        output = self.root / "output"
        output.mkdir()
        (output / "author.txt").write_text("Keep my source")
        with self.assertRaisesRegex(ValueError, "overwrite"):
            recovery.write_documents(documents, output)
        self.assertEqual((output / "author.txt").read_text(), "Keep my source")

    def test_changed_controller_invalidates_provenance(self):
        first = self.extract()
        self.controller.write_text("// changed runtime\n")
        self.assertNotEqual(first[self.tool_id]["provenance"]["controllerSha256"],
                            self.extract()[self.tool_id]["provenance"]["controllerSha256"])


if __name__ == "__main__":
    unittest.main()
