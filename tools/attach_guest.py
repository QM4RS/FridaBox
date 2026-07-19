#!/usr/bin/env python3
"""Discover FridaBox Gadget endpoints and attach by virtual guest identity."""

from __future__ import annotations

import argparse
import json
import pathlib
import queue
import re
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from typing import Any

from forward_frida_ports import authorized_device, forward_ports

ROOT = pathlib.Path(__file__).resolve().parents[1]
AGENT_DIST = ROOT / "scripts/dist"
BOOTSTRAP = AGENT_DIST / "guest-bootstrap.js"
REGISTRY_PROBE = AGENT_DIST / "registry-probe.js"
FRIDA_VERSION = "17.16.0"


@dataclass
class Endpoint:
    port: int
    device: Any
    session: Any
    info: dict[str, Any]


def device_listening_ports(adb: str, serial: str, base_port: int, count: int) -> list[int]:
    """Return listening device ports in the configured range, or the range if ss is unavailable."""
    result = subprocess.run(
        [adb, "-s", serial, "shell", "ss", "-ltn"],
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0 or "not found" in result.stderr.lower():
        return list(range(base_port, base_port + count))
    upper = base_port + count
    ports: set[int] = set()
    for line in result.stdout.splitlines():
        if "LISTEN" not in line:
            continue
        for value in re.findall(r":(\d+)\b", line):
            port = int(value)
            if base_port <= port < upper:
                ports.add(port)
    return sorted(ports)


def message_printer(message: dict[str, Any], data: bytes | None) -> None:
    if message.get("type") == "send":
        print(f"[script] {message.get('payload')}")
    elif message.get("type") == "error":
        print(f"[script-error] {message.get('stack') or message}", file=sys.stderr)
    else:
        print(f"[script-message] {message}")
    if data:
        print(f"[script-data] {len(data)} bytes")


def probe_endpoint(frida: Any, port: int) -> Endpoint | None:
    manager = frida.get_device_manager()
    device = manager.add_remote_device(f"127.0.0.1:{port}")
    processes = device.enumerate_processes()
    gadget = next((process for process in processes if process.name == "Gadget"), None)
    if gadget is None:
        return None
    session = device.attach(gadget.pid)
    answers: queue.Queue[dict[str, Any]] = queue.Queue()

    def on_message(message: dict[str, Any], _data: bytes | None) -> None:
        if message.get("type") == "send" and isinstance(message.get("payload"), dict):
            answers.put(message["payload"])
        elif message.get("type") == "error":
            answers.put({
                "kind": "fridabox-error",
                "value": message.get("stack") or message.get("description") or str(message),
            })

    script = session.create_script(REGISTRY_PROBE.read_text(encoding="utf-8"))
    script.on("message", on_message)
    script.load()
    try:
        answer = answers.get(timeout=4.0)
    except queue.Empty:
        script.unload()
        session.detach()
        return None
    script.unload()
    if answer.get("kind") != "fridabox-registry":
        print(f"Port {port} rejected: {answer.get('value', 'registry probe failed')}", file=sys.stderr)
        session.detach()
        return None
    try:
        info = json.loads(answer["value"])
    except (KeyError, TypeError, json.JSONDecodeError):
        session.detach()
        return None
    return Endpoint(port, device, session, info)


def discover(frida: Any, ports: list[int]) -> list[Endpoint]:
    endpoints: list[Endpoint] = []
    for port in ports:
        try:
            endpoint = probe_endpoint(frida, port)
            if endpoint is not None:
                endpoints.append(endpoint)
        except Exception as error:
            text = str(error).lower()
            if "version" in text and ("mismatch" in text or "incompatible" in text):
                print_version_fix(frida, error)
            continue
    return endpoints


def print_version_fix(frida: Any, error: Exception) -> None:
    local = getattr(frida, "__version__", "unknown")
    print(f"Frida protocol/version error (client {local}, Gadget {FRIDA_VERSION}): {error}", file=sys.stderr)
    print(f"Fix: {sys.executable} -m pip install --upgrade frida=={FRIDA_VERSION}", file=sys.stderr)


def print_table(endpoints: list[Endpoint]) -> None:
    headings = ("PORT", "GUEST PACKAGE", "GUEST PROCESS", "VPID", "SOURCE APK")
    rows = [
        (str(item.port), str(item.info.get("package")), str(item.info.get("process")),
         str(item.info.get("virtualProcessId")), str(item.info.get("sourceDir")))
        for item in endpoints
    ]
    widths = [len(value) for value in headings]
    for row in rows:
        widths = [max(width, len(value)) for width, value in zip(widths, row)]
    print("  ".join(value.ljust(width) for value, width in zip(headings, widths)))
    print("  ".join("-" * width for width in widths))
    for row in rows:
        print("  ".join(value.ljust(width) for value, width in zip(row, widths)))


def loadable_user_agent(source: pathlib.Path) -> pathlib.Path:
    if source.parent.name != "dist":
        compiled = source.parent / "dist" / source.name
        if compiled.is_file():
            return compiled
    return source


def attach_scripts(endpoint: Endpoint, user_script: pathlib.Path | None, keep_alive: bool) -> None:
    scripts = []
    bootstrap = endpoint.session.create_script(BOOTSTRAP.read_text(encoding="utf-8"))
    bootstrap.on("message", message_printer)
    bootstrap.load()
    scripts.append(bootstrap)
    bootstrap_info: dict[str, Any] | None = None
    for _attempt in range(40):
        try:
            candidate = bootstrap.exports_sync.info()
            bootstrap.exports_sync.useclass("java.lang.Object")
            if isinstance(candidate, dict) and "error" not in candidate:
                bootstrap_info = candidate
                break
        except Exception:
            pass
        time.sleep(0.25)
    if bootstrap_info is None:
        raise RuntimeError("guest bootstrap did not select a ClassLoader within 10 seconds")
    modules = bootstrap.exports_sync.enumeratemodules()
    print("GuestRuntimeRegistry: " + json.dumps(bootstrap_info, sort_keys=True), flush=True)
    print(f"Native modules: {len(modules)}", flush=True)
    for module in modules[:12]:
        print(f"  {module.get('name')} @ {module.get('base')} {module.get('path')}", flush=True)
    if user_script is not None:
        agent = loadable_user_agent(user_script)
        script = endpoint.session.create_script(agent.read_text(encoding="utf-8"))
        script.on("message", message_printer)
        script.load()
        scripts.append(script)
    print(f"Attached on port {endpoint.port} to {endpoint.info.get('package')} / {endpoint.info.get('process')}")
    if keep_alive or user_script is not None:
        stopped = threading.Event()
        try:
            while not stopped.wait(0.5):
                pass
        except KeyboardInterrupt:
            print("Detaching…")
    for script in reversed(scripts):
        try:
            script.unload()
        except Exception:
            pass


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="discover and list guests")
    parser.add_argument("--package", help="guest package to attach")
    parser.add_argument("--process", help="optional guest process name")
    parser.add_argument("--script", type=pathlib.Path, help="user JavaScript loaded after bootstrap")
    parser.add_argument("--keep-alive", action="store_true")
    parser.add_argument("--base-port", type=int, default=27042)
    parser.add_argument("--count", type=int, default=32)
    args = parser.parse_args()
    if not args.list and not args.package:
        parser.error("use --list or --package PACKAGE")
    if args.script is not None and not args.script.is_file():
        parser.error(f"script does not exist: {args.script}")
    if not BOOTSTRAP.is_file() or not REGISTRY_PROBE.is_file():
        raise SystemExit("Compiled Frida 17 agents are missing; run: npm ci && python tools/build_frida_agents.py")

    import shutil
    adb = shutil.which("adb")
    if adb is None:
        raise SystemExit("adb was not found on PATH; install Android platform-tools")
    try:
        serial = authorized_device(adb)
        forward_ports(adb, serial, args.base_port, args.count)
    except (RuntimeError, subprocess.CalledProcessError) as error:
        raise SystemExit(str(error)) from error

    try:
        import frida
    except ImportError as error:
        raise SystemExit(f"Install controller dependencies: {sys.executable} -m pip install -r tools/requirements.txt") from error
    local_major = str(getattr(frida, "__version__", "0")).split(".", 1)[0]
    if local_major != FRIDA_VERSION.split(".", 1)[0]:
        print_version_fix(frida, RuntimeError("major versions differ"))
        return 2
    ports = device_listening_ports(adb, serial, args.base_port, args.count)
    endpoints = discover(frida, ports)
    print_table(endpoints)
    if args.list:
        for endpoint in endpoints:
            endpoint.session.detach()
        return 0
    matches = [item for item in endpoints if item.info.get("package") == args.package]
    if args.process:
        matches = [item for item in matches if item.info.get("process") == args.process]
    if not matches:
        raise SystemExit("No matching FridaBox guest endpoint was discovered")
    chosen = matches[0]
    for endpoint in endpoints:
        if endpoint is not chosen:
            endpoint.session.detach()
    try:
        attach_scripts(chosen, args.script, args.keep_alive)
    finally:
        chosen.session.detach()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
