#!/usr/bin/env python3
"""Build Frida 17 Java agents with the explicitly pinned Java bridge."""

from __future__ import annotations

import os
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
OUTPUT = SCRIPTS / "dist"
ENTRIES = ("registry-probe.js", "guest-bootstrap.js", "sample-hook.js")


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
    print("Built Frida agents: " + ", ".join(str(OUTPUT / name) for name in ENTRIES))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
