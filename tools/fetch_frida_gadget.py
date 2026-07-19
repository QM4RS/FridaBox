#!/usr/bin/env python3
"""Fetch and verify the pinned official Frida Gadget Android ARM64 binary."""

from __future__ import annotations

import argparse
import hashlib
import json
import lzma
import pathlib
import shutil
import tempfile
import urllib.request

VERSION = "17.16.0"
ASSET = f"frida-gadget-{VERSION}-android-arm64.so.xz"
API_URL = f"https://api.github.com/repos/frida/frida/releases/tags/{VERSION}"
ROOT = pathlib.Path(__file__).resolve().parents[1]
DEST = ROOT / "app/src/main/jniLibs/arm64-v8a/libfrida-gadget.so"
CHECKSUM = ROOT / "tools/frida-gadget-17.16.0.sha256"
EXPECTED_SHA256 = "6bf149e5d1c5ec701e7b822cab57bb243f1c2a03318fa974fe373ee711a9ed9e"


def sha256(path: pathlib.Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def release_asset_url() -> str:
    request = urllib.request.Request(
        API_URL,
        headers={"Accept": "application/vnd.github+json", "User-Agent": "FridaBox-build"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        release = json.load(response)
    if release.get("tag_name") != VERSION:
        raise RuntimeError(f"GitHub returned unexpected release {release.get('tag_name')!r}")
    for asset in release.get("assets", []):
        if asset.get("name") == ASSET:
            return str(asset["browser_download_url"])
    raise RuntimeError(f"Release {VERSION} does not contain {ASSET}")


def fetch(force: bool = False) -> str:
    if DEST.exists() and not force:
        digest = sha256(DEST)
        if digest != EXPECTED_SHA256:
            raise RuntimeError(f"Existing Gadget SHA-256 mismatch: {digest}")
        CHECKSUM.write_text(f"{digest}  {DEST.name}\n", encoding="ascii")
        return digest
    DEST.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="fridabox-") as temp_dir:
        archive = pathlib.Path(temp_dir) / ASSET
        request = urllib.request.Request(release_asset_url(), headers={"User-Agent": "FridaBox-build"})
        with urllib.request.urlopen(request, timeout=120) as response, archive.open("wb") as output:
            shutil.copyfileobj(response, output)
        temporary_output = pathlib.Path(temp_dir) / DEST.name
        with lzma.open(archive, "rb") as source, temporary_output.open("wb") as output:
            shutil.copyfileobj(source, output)
        if temporary_output.stat().st_size < 1_000_000:
            raise RuntimeError("Downloaded Gadget is unexpectedly small")
        shutil.move(str(temporary_output), DEST)
    digest = sha256(DEST)
    if digest != EXPECTED_SHA256:
        DEST.unlink(missing_ok=True)
        raise RuntimeError(f"Downloaded Gadget SHA-256 mismatch: {digest}")
    CHECKSUM.write_text(f"{digest}  {DEST.name}\n", encoding="ascii")
    return digest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="replace an existing Gadget")
    args = parser.parse_args()
    digest = fetch(args.force)
    print(f"Frida Gadget {VERSION}: {DEST}")
    print(f"SHA-256: {digest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
