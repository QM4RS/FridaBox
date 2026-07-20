# Contributing to FridaBox

FridaBox welcomes focused contributions that improve correctness,
compatibility, observability, documentation, or responsible research workflows.

## Before opening an issue

- Confirm the target and device are authorized for your testing.
- Read [docs/LIMITATIONS.md](docs/LIMITATIONS.md) and
  [docs/DETECTION_SURFACES.md](docs/DETECTION_SURFACES.md).
- Search existing issues for the Android version, vendor ROM, package type, and
  failure signature.
- Remove credentials, personal data, proprietary APKs, private agents, tokens,
  and device identifiers from logs.

Security vulnerabilities should follow [SECURITY.md](SECURITY.md), not a public
issue.

## Development setup

Use JDK 21, Android SDK 35, NDK 29.0.14206865, Python 3.10+, and Node.js 20+.
Follow [docs/BUILDING.md](docs/BUILDING.md) for Gadget verification and the
Windows no-space native-build workaround.

```text
npm ci
python tools/build_frida_agents.py
./gradlew :app:assembleDebug :Bcore:testDebugUnitTest :app:testDebugUnitTest :app:check
```

## Pull requests

Keep changes narrow and explain the runtime boundary they affect. A useful pull
request includes:

- the problem and why the current behavior is incorrect;
- the smallest viable implementation;
- affected Android versions, ABIs, and process types;
- host-side test results;
- device evidence for lifecycle, native, Binder, or virtualization changes;
- explicit confirmation that imported APK bytes were not modified;
- documentation updates for new behavior or limitations.

Do not combine unrelated reformatting, package renames, or generated-file churn
with a runtime fix.

## Runtime changes

Changes around `BActivityThread`, `NativeCore`, IO redirection, Binder proxies,
Gadget loading, process allocation, or package persistence require device
validation. At minimum, test:

1. import of an original ARM64 base APK;
2. absence of the guest from the real PackageManager;
3. Computer-mode pause and attach;
4. Java hook execution with the guest ClassLoader;
5. native module enumeration;
6. process recycling into Clean mode;
7. a second instrumented launch after Clean mode.

Add exact commands and relevant log lines to a dedicated validation note. Never
commit proprietary APKs or third-party scripts without redistribution rights.

## Style

- Preserve existing source encoding and line endings where practical.
- Keep user-facing language precise; do not promise stealth or universal app
  compatibility.
- Prefer explicit failure states over silent fallbacks.
- Keep network listeners loopback-only by default.
- Pin and verify externally fetched runtime artifacts.
- Add tests for parsers, integrity rules, state transitions, and regressions.

By contributing, you agree that your contribution is licensed under the
repository's Apache License 2.0.
