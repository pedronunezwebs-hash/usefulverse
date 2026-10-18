#!/usr/bin/env python3
"""Capture the exact published pages for the 106 tools missing from source.

This is a recovery snapshot, not a replacement for their original modules. It
is deliberately read-only against production and writes only a local gzip
artifact. Static routes and assets are restored by merge-live-only-106.mjs.
"""

from __future__ import annotations

import argparse
import base64
import concurrent.futures
import gzip
import hashlib
import html
import json
import os
import re
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "src/growth600/live-only-106.manifest.json"
DEFAULT_OUTPUT = ROOT / "src/growth600/live-only-106.snapshot.json.gz"
USER_AGENT = "UsefulVerse-static-recovery/1.0"
MAX_WORKERS = 10
_print_lock = threading.Lock()


def fetch(url: str) -> tuple[bytes, str, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=35) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status}: {url}")
                final_url = response.geturl()
                if final_url != url:
                    raise RuntimeError(f"Unexpected redirect {url} -> {final_url}")
                return response.read(), response.headers.get("Content-Type", ""), final_url
        except Exception as error:  # retry transient edge/network failures only
            last_error = error
            if attempt == 3:
                break
            time.sleep(0.5 * (2**attempt))
    raise RuntimeError(f"Could not fetch {url}: {last_error}") from last_error


def attr(tag: str, name: str) -> str | None:
    match = re.search(rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
    return html.unescape(match.group(2)) if match else None


def asset_paths_from_html(document: str, page_url: str) -> set[str]:
    paths: set[str] = set()
    for tag in re.findall(r"<(?:script|link|img|source|video|audio|iframe)\b[^>]*>", document, re.I | re.S):
        tag_name = re.match(r"<([a-z]+)", tag, re.I).group(1).lower()
        rel = (attr(tag, "rel") or "").lower().split()
        refs = [attr(tag, "src"), attr(tag, "href"), attr(tag, "poster")]
        for ref in filter(None, refs):
            parsed = urllib.parse.urlsplit(urllib.parse.urljoin(page_url, ref))
            if parsed.scheme not in ("http", "https") or parsed.netloc != "tools.usefulverse.com":
                if tag_name == "script" and attr(tag, "src") == ref:
                    raise RuntimeError(f"External script in published page {page_url}: {ref}")
                if tag_name == "link" and "stylesheet" in rel:
                    raise RuntimeError(f"External stylesheet in published page {page_url}: {ref}")
                continue
            path = parsed.path
            if path == "/favicon.svg" or path.startswith("/assets/"):
                paths.add(path)
    return paths


def local_asset_refs(content: bytes, path: str, content_type: str) -> set[str]:
    text = content.decode("utf-8", "replace")
    refs: set[str] = set()
    if "css" in content_type or path.endswith(".css"):
        raw = re.findall(r"url\(\s*(['\"]?)(.*?)\1\s*\)", text, re.I | re.S)
        raw += [("", x) for x in re.findall(r"@import\s+(?:url\()?['\"]([^'\"]+)['\"]", text, re.I)]
        for _, ref in raw:
            ref = ref.strip()
            if not ref or ref.startswith(("data:", "blob:", "#")):
                continue
            parsed = urllib.parse.urlsplit(urllib.parse.urljoin("https://tools.usefulverse.com" + path, ref))
            if parsed.scheme in ("http", "https") and parsed.netloc == "tools.usefulverse.com":
                refs.add(parsed.path)
    elif "javascript" in content_type or path.endswith((".js", ".mjs")):
        # Capture statically named local resources, workers, and imports.
        for ref in re.findall(r"[\"'`]((?:/|\./|\.\./)[^\"'`]+?\.(?:mjs|js|wasm|json|css|svg|png|webp|woff2?)(?:\?[^\"'`]*)?)[\"'`]", text, re.I):
            parsed = urllib.parse.urlsplit(urllib.parse.urljoin("https://tools.usefulverse.com" + path, ref))
            if parsed.scheme in ("http", "https") and parsed.netloc == "tools.usefulverse.com":
                refs.add(parsed.path)
    return {ref for ref in refs if ref == "/favicon.svg" or ref.startswith("/assets/")}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--replace", action="store_true", help="atomically replace an existing snapshot after the new capture validates")
    args = parser.parse_args()
    if args.output.exists() and not args.replace:
        raise SystemExit(f"Refusing to overwrite existing snapshot: {args.output}")
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    tools = manifest.get("tools", [])
    ids = {tool.get("id") for tool in tools}
    if len(ids) != 106 or None in ids:
        raise SystemExit(f"Expected 106 unique IDs in {args.manifest}, found {len(ids)}")

    sitemap_bytes, content_type, _ = fetch("https://tools.usefulverse.com/sitemap.xml")
    if "xml" not in content_type and not sitemap_bytes.lstrip().startswith(b"<?xml"):
        raise SystemExit("Production sitemap did not return XML")
    sitemap_root = ET.fromstring(sitemap_bytes)
    sitemap_urls = [node.text for node in sitemap_root.iter() if node.tag.endswith("loc") and node.text]
    expected_origin = manifest["origin"]
    selected = []
    for url in sitemap_urls:
        parsed = urllib.parse.urlsplit(url)
        match = re.fullmatch(r"/(?:[a-z0-9-]+/)?tools/([^/]+)/", parsed.path)
        if parsed.scheme == "https" and parsed.netloc == "tools.usefulverse.com" and match and match.group(1) in ids:
            selected.append(url)
    per_tool: dict[str, int] = {tool_id: 0 for tool_id in ids}
    for url in selected:
        slug = re.fullmatch(r"/(?:[a-z0-9-]+/)?tools/([^/]+)/", urllib.parse.urlsplit(url).path).group(1)
        per_tool[slug] += 1
    if len(selected) != 3816 or any(count != 36 for count in per_tool.values()):
        raise SystemExit(f"Production sitemap mismatch: {len(selected)} recovery routes; expected 3,816 (36 per tool).")

    pages: list[dict] = []
    asset_paths: set[str] = {"/favicon.svg"}
    errors: list[str] = []
    done = 0

    def capture_page(url: str) -> tuple[dict, set[str]]:
        body, page_type, final_url = fetch(url)
        document = body.decode("utf-8", "strict")
        canonical = re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)', document, re.I)
        h1 = re.search(r"<h1\b[^>]*>(.*?)</h1>", document, re.I | re.S)
        description = re.search(r'<meta\b[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)', document, re.I | re.S)
        alternates = re.findall(r'<link\b[^>]*rel=["\']alternate["\'][^>]*hreflang=["\']([^"\']+)', document, re.I)
        if "html" not in page_type or not canonical or html.unescape(canonical.group(1)) != url:
            raise RuntimeError(f"Unexpected canonical or response type for {url}")
        if not h1 or not description or len(alternates) != 37:
            raise RuntimeError(f"Missing visible content or hreflang coverage for {url}")
        if re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex', document, re.I):
            raise RuntimeError(f"Recovery route is noindex: {url}")
        path = urllib.parse.urlsplit(final_url).path
        assets = asset_paths_from_html(document, url)
        return ({"url": url, "path": path, "html": document}, assets)

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        future_to_url = {pool.submit(capture_page, url): url for url in selected}
        for future in concurrent.futures.as_completed(future_to_url):
            url = future_to_url[future]
            try:
                page, refs = future.result()
                pages.append(page)
                asset_paths.update(refs)
            except Exception as error:
                errors.append(f"{url}: {error}")
            done += 1
            if done % 100 == 0 or done == len(selected):
                with _print_lock:
                    print(f"Captured pages: {done}/{len(selected)}; assets queued: {len(asset_paths)}; errors: {len(errors)}", flush=True)
    if errors:
        raise SystemExit("Page capture failed; snapshot not written:\n" + "\n".join(errors[:20]))

    assets: dict[str, str] = {}
    queued = set(asset_paths)
    while queued:
        batch = sorted(queued - set(assets))
        if not batch:
            break
        queued.clear()

        def capture_asset(path: str) -> tuple[str, bytes, str]:
            data, asset_type, _ = fetch("https://tools.usefulverse.com" + path)
            return path, data, asset_type

        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
            futures = {pool.submit(capture_asset, path): path for path in batch}
            for future in concurrent.futures.as_completed(futures):
                path = futures[future]
                asset_path, content, asset_type = future.result()
                if path != "/favicon.svg" and "assets/" not in asset_path:
                    raise RuntimeError(f"Unexpected non-asset path: {asset_path}")
                if not content:
                    raise RuntimeError(f"Empty required asset: {asset_path}")
                assets[asset_path] = base64.b64encode(content).decode("ascii")
                queued.update(local_asset_refs(content, asset_path, asset_type) - set(assets))
        print(f"Captured assets: {len(assets)}; pending: {len(queued)}", flush=True)

    snapshot = {
        "schemaVersion": 1,
        "origin": expected_origin,
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "sourceSitemapSha256": hashlib.sha256(sitemap_bytes).hexdigest(),
        "sourceSitemapUrlCount": len(sitemap_urls),
        "sourceSitemapUrls": sorted(sitemap_urls),
        "expectedToolIds": sorted(ids),
        "pages": sorted(pages, key=lambda item: item["url"]),
        "assets": assets,
    }
    payload = json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    fd, temp_name = tempfile.mkstemp(prefix=args.output.name + ".", suffix=".tmp", dir=args.output.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            with gzip.GzipFile(fileobj=stream, mode="wb", compresslevel=9, mtime=0) as compressed:
                compressed.write(payload)
        if args.output.exists() and not args.replace:
            raise SystemExit(f"Refusing to overwrite snapshot created concurrently: {args.output}")
        if args.replace:
            os.replace(temp_name, args.output)
        else:
            os.link(temp_name, args.output)
            os.unlink(temp_name)
    finally:
        if os.path.exists(temp_name):
            os.unlink(temp_name)
    print(f"Saved {len(pages)} localized routes and {len(assets)} required assets to {args.output}")
    print(f"Source sitemap SHA-256: {snapshot['sourceSitemapSha256']}")
    print(f"Snapshot bytes: {args.output.stat().st_size}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
