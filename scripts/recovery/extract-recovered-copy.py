"""Recover English UI data without executing HTML/JS or inheriting old approval."""
import argparse
import copy
import hashlib
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src/growth600/live-only-106-source"
MANIFEST = ROOT / "src/growth600/live-only-106.manifest.json"
RAW_DATA_KEYS = {"puzzles", "exampleXml", "exampleCsv", "exampleText"}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def strict_json(text):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result or key in {"__proto__", "prototype", "constructor"}:
                raise ValueError(f"Duplicate or unsafe JSON key: {key}")
            result[key] = value
        return result

    def constant(value):
        raise ValueError(f"Non-finite JSON value: {value}")

    return json.loads(text, object_pairs_hook=pairs, parse_constant=constant)


def regular_bytes(path, anchor):
    path.relative_to(anchor)
    for candidate in [path, *path.parents]:
        if candidate.is_symlink():
            raise ValueError(f"Symlink input/output is not supported: {candidate.name}")
        if candidate == anchor:
            break
    if not path.is_file():
        raise ValueError(f"Missing regular file: {path.name}")
    return path.read_bytes()


class CopyHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.languages = []
        self.owners = []
        self.controllers = []
        self.payloads = []
        self.in_copy = False

    def handle_starttag(self, tag, attributes):
        names = [key for key, _ in attributes]
        if len(names) != len(set(names)):
            raise ValueError("Duplicate HTML attribute")
        attrs = dict(attributes)
        if tag == "html":
            self.languages.append(attrs.get("lang"))
        if tag == "main":
            self.owners.append(attrs.get("data-tool"))
        if tag == "script":
            self.in_copy = "data-tool-copy" in attrs
            if attrs.get("src"):
                self.controllers.append(attrs["src"])
            if self.in_copy:
                if attrs.get("type") != "application/json" or "src" in attrs:
                    raise ValueError("UI copy must be inline application/json")
                self.payloads.append("")

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_copy = False

    def handle_data(self, data):
        if self.in_copy:
            self.payloads[-1] += data


def split_copy(original):
    text = copy.deepcopy(original)
    discarded = [key for key in text if key == "copyLanguage" or key.startswith("localization")]
    for key in discarded:
        del text[key]
    data = {key: text.pop(key) for key in list(text) if key in RAW_DATA_KEYS}
    example = text.get("example")
    if isinstance(example, dict):
        technical = {key: value for key, value in example.items() if key not in {"label", "text"}}
        text["example"] = {key: value for key, value in example.items() if key in {"label", "text"}}
        if technical:
            data["example"] = technical
            if not text["example"]:
                del text["example"]
    return text, data, discarded


def extract_documents(source=SOURCE, manifest=MANIFEST, root=ROOT, expected_count=106):
    inventory = strict_json(regular_bytes(manifest, root).decode("utf-8"))
    tools = inventory.get("tools", [])
    ids = [tool["id"] for tool in tools]
    if len(ids) != expected_count or len(set(ids)) != len(ids):
        raise ValueError("Expected a complete, unique recovered-tool inventory")
    if any(not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", tool_id) for tool_id in ids):
        raise ValueError("Invalid recovered tool ID")
    documents = {}
    for tool in tools:
        tool_id = tool["id"]
        html_path = source / "pages/tools" / tool_id / "index.html"
        html_bytes = regular_bytes(html_path, root)
        parser = CopyHTML()
        parser.feed(html_bytes.decode("utf-8"))
        parser.close()
        allowed_controllers = {
            f"/assets/recovered-live-only-106/controllers/{tool_id}{suffix}"
            for suffix in [".js", ".controller.js"]
        }
        if parser.languages != ["en"] or parser.owners != [tool_id]:
            raise ValueError(f"Wrong English page or owner: {tool_id}")
        if (len(parser.payloads) != 1 or parser.in_copy or len(parser.controllers) != 1
                or parser.controllers[0] not in allowed_controllers):
            raise ValueError(f"Ambiguous/missing copy or controller: {tool_id}")
        original = strict_json(parser.payloads[0])
        if not isinstance(original, dict) or original.get("copyLanguage") != "en":
            raise ValueError(f"Wrong source language: {tool_id}")
        if original.get("name") != tool["h1"]:
            raise ValueError(f"Copy belongs to another tool: {tool_id}")
        for key in ["name", "title", "description", "intro"]:
            if not isinstance(original.get(key), str) or not original[key].strip():
                raise ValueError(f"Missing prose {key}: {tool_id}")
        for key in ["fields", "actions", "messages"]:
            if not isinstance(original.get(key), dict) or not original[key]:
                raise ValueError(f"Missing UI {key}: {tool_id}")
        controller_path = source / parser.controllers[0].lstrip("/")
        controller = regular_bytes(controller_path, root)
        text, data, discarded = split_copy(original)
        documents[tool_id] = {
            "toolId": tool_id,
            "sourceCopy": text,
            "nonTranslatableCopy": data,
            "provenance": {
                "status": "recovered-ui-not-quality-approved", "sourceLocale": "en",
                "htmlPath": html_path.relative_to(root).as_posix(), "htmlSha256": digest(html_bytes),
                "payloadSha256": digest(parser.payloads[0].encode("utf-8")),
                "controllerPath": controller_path.relative_to(root).as_posix(),
                "controllerSha256": digest(controller), "discardedMetadata": discarded,
            },
        }
    return documents


def encode(document):
    return (json.dumps(document, ensure_ascii=False, indent=2, allow_nan=False) + "\n").encode("utf-8")


def verify_documents(documents, output):
    if output.is_symlink() or not output.is_dir():
        raise ValueError("Source directory is missing or symlinked")
    for tool_id, document in documents.items():
        if regular_bytes(output / f"{tool_id}.json", output) != encode(document):
            raise ValueError(f"Stale, modified or mixed English source: {tool_id}")


def write_documents(documents, output):
    # Never overwrite an existing author's improved source. Validate all inputs
    # before writing and publish the new directory in one same-filesystem rename.
    if output.exists() or output.is_symlink():
        raise ValueError("Refusing to overwrite an existing source directory")
    if output.parent.is_symlink() or not output.parent.is_dir():
        raise ValueError("Output parent must be an existing regular directory")
    staging = Path(tempfile.mkdtemp(prefix=".recovered-ui-", dir=output.parent))
    try:
        for tool_id, document in documents.items():
            (staging / f"{tool_id}.json").write_bytes(encode(document))
        os.rename(staging, output)
    finally:
        if staging.exists():
            shutil.rmtree(staging)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "translation-sources")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--write", action="store_true")
    mode.add_argument("--check", action="store_true")
    args = parser.parse_args()
    documents = extract_documents()
    if args.write:
        write_documents(documents, args.output)
    verify_documents(documents, args.output)
    print(json.dumps({"owners": len(documents), "bytes": sum(len(encode(d)) for d in documents.values()),
                      "status": "sources-checked-not-quality-approved", "mode": "write" if args.write else "check"}))


if __name__ == "__main__":
    main()
