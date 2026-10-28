"""Install exact browser build dependencies locally; no inference/model downloads.

The root manifest/lock and translator are never modified. Native inference is
unnecessary for browser bundles. Transformers' browser package and root common
runtime still need their exact locked bytes; omission previously broke bundling.
"""
import argparse
import base64
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
EXTRA = ("onnxruntime-web", "onnxruntime-common", "@huggingface/jinja", "@huggingface/tokenizers")


def browser_lock(package, lock):
    packages = lock["packages"]
    dependencies = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
    dependencies.pop("@huggingface/transformers")
    dependencies.update({name: packages["node_modules/" + name]["version"] for name in EXTRA})
    pending = [("", name, True) for name in dependencies]
    selected = set()
    while pending:
        parent, name, required = pending.pop()
        while True:
            key = str(Path(parent) / "node_modules" / name)
            if key in packages:
                break
            if not parent:
                key = None
                break
            parent = str(Path(parent).parent)
            if parent == ".":
                parent = ""
        if key is None:
            if required:
                raise ValueError("Unresolved locked dependency: " + name)
            continue
        if key in selected:
            continue
        selected.add(key)
        for field in ("dependencies", "optionalDependencies", "peerDependencies"):
            pending.extend((key, name, field == "dependencies") for name in packages[key].get(field, {}))
    if "node_modules/onnxruntime-node" in selected or "node_modules/sharp" in selected:
        raise ValueError("Native inference entered browser dependency graph")
    manifest = {k: package[k] for k in ("name", "version", "private", "type")}
    manifest["dependencies"] = dependencies
    result = {**lock, "packages": {"": {"name": package["name"], "version": package["version"], "dependencies": dependencies}, **{k: packages[k] for k in sorted(selected)}}}
    return manifest, result


def extract_locked_package(data, entry, destination):
    algorithm, expected = entry["integrity"].split("-", 1)
    if algorithm != "sha512" or base64.b64encode(hashlib.sha512(data).digest()).decode() != expected:
        raise ValueError("Locked package integrity mismatch")
    with tarfile.open(fileobj=io.BytesIO(data)) as archive:
        members = archive.getmembers()
        if any(not m.name.startswith("package/") or ".." in Path(m.name).parts or not (m.isfile() or m.isdir()) for m in members):
            raise ValueError("Unsafe package archive")
        archive.extractall(destination, filter="data")


def footprint(root):
    seen, total = set(), 0
    for folder, _, files in os.walk(root, followlinks=False):
        for name in files:
            path = Path(folder) / name
            if path.is_symlink():
                continue
            stat = path.stat()
            key = stat.st_dev, stat.st_ino
            if key not in seen:
                total += stat.st_size
                seen.add(key)
    return total


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--install", action="store_true")
    args = parser.parse_args()
    output = args.output.resolve()
    relative = output.relative_to(ROOT)
    if not relative.parts[0].startswith(".qa-") or output.exists():
        raise ValueError("Use a new directory under this checkout's .qa-* tree")
    if footprint(ROOT) + 900_000_000 > 2_000_000_000 or shutil.disk_usage(ROOT).free < 10_900_000_000:
        raise ValueError("Not enough working-space/free-disk budget")
    package = json.loads((ROOT / "package.json").read_text())
    original = json.loads((ROOT / "package-lock.json").read_text())
    manifest, lock = browser_lock(package, original)
    output.mkdir(parents=True)
    (output / "package.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (output / "package-lock.json").write_text(json.dumps(lock, indent=2) + "\n")
    if not args.install:
        print(json.dumps({"prepared": True, "packages": len(lock["packages"]) - 1, "installed": False}))
        return
    cache = output / "npm-cache"
    subprocess.run(["npm", "ci", "--ignore-scripts", "--no-audit", "--no-fund", "--cache", str(cache)], cwd=output, check=True)
    entry = original["packages"]["node_modules/@huggingface/transformers"]
    with urllib.request.urlopen(entry["resolved"], timeout=60) as response:
        data = response.read(20 * 1024 * 1024)
    temporary = output / "exact-transformers"
    temporary.mkdir()
    extract_locked_package(data, entry, temporary)
    shutil.move(temporary / "package", output / "node_modules/@huggingface/transformers")
    temporary.rmdir()
    shutil.rmtree(cache)
    print(json.dumps({"installed": True, "rootLockPreserved": True, "nativeInferenceInstalled": False}))


if __name__ == "__main__":
    main()
