#!/usr/bin/env python3
"""Forward the FridaBox Gadget discovery range through ADB."""

from __future__ import annotations

import argparse
import shutil
import subprocess


def authorized_device(adb: str) -> str:
    result = subprocess.run([adb, "devices"], check=True, text=True, capture_output=True)
    devices = []
    unauthorized = []
    for line in result.stdout.splitlines()[1:]:
        fields = line.split()
        if len(fields) >= 2 and fields[1] == "device":
            devices.append(fields[0])
        elif len(fields) >= 2 and fields[1] == "unauthorized":
            unauthorized.append(fields[0])
    if not devices:
        suffix = f"; unauthorized: {', '.join(unauthorized)}" if unauthorized else ""
        raise RuntimeError("No authorized Android device found" + suffix)
    return devices[0]


def forward_ports(adb: str, serial: str, base_port: int, count: int) -> None:
    for port in range(base_port, base_port + count):
        subprocess.run(
            [adb, "-s", serial, "forward", f"tcp:{port}", f"tcp:{port}"],
            check=True,
            stdout=subprocess.DEVNULL,
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-port", type=int, default=27042)
    parser.add_argument("--count", type=int, default=32)
    args = parser.parse_args()
    adb = shutil.which("adb")
    if adb is None:
        raise SystemExit("adb was not found on PATH; install Android platform-tools")
    try:
        serial = authorized_device(adb)
        forward_ports(adb, serial, args.base_port, args.count)
    except (RuntimeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from error
    print(f"Forwarded {args.base_port}..{args.base_port + args.count - 1} on {serial}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
