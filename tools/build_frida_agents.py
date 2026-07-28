#!/usr/bin/env python3
"""Build Frida agents and the version-pinned offline runtime bridges."""

from __future__ import annotations

import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
OUTPUT = SCRIPTS / "dist"
ENTRIES = ("registry-probe.js", "guest-bootstrap.js", "sample-hook.js")
BRIDGE_SCRIPTS = SCRIPTS / "bridges"
BRIDGE_OUTPUT = ROOT / "app" / "src" / "main" / "assets" / "fridabox" / "bridges"
BRIDGES = (
    ("java", "7.0.11"),
    ("java", "7.0.12"),
    ("java", "7.0.13"),
    ("il2cpp", "0.12.2"),
    ("il2cpp", "0.13.0"),
    ("il2cpp", "0.13.1"),
)


def compiler_path() -> pathlib.Path:
    name = "frida-compile.cmd" if os.name == "nt" else "frida-compile"
    path = ROOT / "node_modules" / ".bin" / name
    if not path.is_file():
        raise SystemExit("Install pinned agent dependencies first: npm ci")
    return path


def main() -> int:
    compiler = compiler_path()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name in ENTRIES:
        subprocess.run(
            [str(compiler), str(SCRIPTS / name), "-o", str(OUTPUT / name), "-S", "-c"],
            cwd=ROOT,
            check=True,
        )
    BRIDGE_OUTPUT.mkdir(parents=True, exist_ok=True)
    for bridge_id, version in BRIDGES:
        name = f"{bridge_id}-{version}.js"
        subprocess.run(
            [str(compiler), str(BRIDGE_SCRIPTS / name), "-o", str(BRIDGE_OUTPUT / name), "-S", "-c"],
            cwd=ROOT,
            check=True,
        )
    print("Built Frida agents: " + ", ".join(str(OUTPUT / name) for name in ENTRIES))
    print("Built runtime bridges: " + ", ".join(
        str(BRIDGE_OUTPUT / f"{bridge_id}-{version}.js") for bridge_id, version in BRIDGES
    ))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
