<div align="center">

# FridaBox

### On-device Android instrumentation, inside a private virtual workspace

[![Android](https://img.shields.io/badge/Android-12--16-3DDC84?logo=android&logoColor=white)](docs/TEST_RESULTS.md)
[![ABI](https://img.shields.io/badge/ABI-arm64--v8a-5C6BC0)](docs/BUILDING.md)
[![Frida](https://img.shields.io/badge/Frida_Gadget-17.16.0-FF6B35)](THIRD_PARTY_NOTICES.md)
[![Release](https://img.shields.io/badge/release-4.0.0-00BFA5)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![Status](https://img.shields.io/badge/status-device--validated-success)](docs/device-validation.log)
[![Android CI](https://github.com/QM4RS/FridaBox/actions/workflows/android.yml/badge.svg)](https://github.com/QM4RS/FridaBox/actions/workflows/android.yml)

**Import an original APK. Choose a per-app mode. Run trusted Frida JavaScript
directly on the phone, attach from a computer, or launch clean.**

[Features](#what-fridabox-does) · [How it works](#how-it-works) ·
[Quick start](#quick-start) · [Research](#engineering-and-research) ·
[Limitations](#scope-and-limitations) · [Acknowledgements](#acknowledgements)

</div>

---

FridaBox is an Android mobile-security research workspace built for authorized
dynamic analysis. It runs an original, unmodified APK inside app-private virtual
processes and can load Frida Gadget before the guest `Application` is created.

It does **not** require root, Magisk, Zygisk, frida-server, a modified system
image, real PackageManager installation, APK patching, repacking, or resigning.
The host application ID and Android namespace are both
`com.qm4rs.fridabox`.

> [!IMPORTANT]
> FridaBox is intended for applications and devices you own or are explicitly
> authorized to test. It is a research tool, not an invisibility product. Read
> [SECURITY.md](SECURITY.md) and [the documented detection surfaces](docs/DETECTION_SURFACES.md)
> before using it in an assessment.

## Why FridaBox exists

Traditional Gadget workflows patch a target APK, add a native library, rebuild
it, and sign the modified package. That changes the artifact under test and can
invalidate signatures, integrity assumptions, update paths, and experimental
results. A frida-server workflow avoids repacking but normally requires a rooted
or specially prepared device.

FridaBox explores a different boundary:

- preserve the imported APK byte-for-byte;
- install it only into a private virtual package manager;
- create the guest's real Android `LoadedApk` and `ClassLoader`;
- load a pinned Gadget inside the assigned virtual process;
- pause before guest `Application.onCreate()` when interactive attachment is
  requested;
- keep instrumentation policy per guest instead of globally.

The result is a repeatable laboratory for early Java/native hooks while the
original package remains absent from Android's real PackageManager.

## What FridaBox does

| Capability | What it provides |
| --- | --- |
| Original APK import | SAF-based import into private storage with SHA-256 verification before and after virtual installation. |
| Three launch modes | **On-device**, **Computer**, and **Clean**, remembered independently for every guest. |
| Earliest practical Gadget load | Gadget is loaded after guest runtime/IO setup but before `makeApplication()` and guest `Application.onCreate()`. |
| No-computer instrumentation | A trusted JavaScript agent can be selected once and automatically loaded on every On-device launch. |
| Familiar desktop workflow | Computer mode supports the normal `frida -U gadget -l agent.js` flow and pauses startup until attachment. |
| Deterministic clean launch | The virtual process is recycled before starting without Gadget, preventing mode leakage from a previous process. |
| Correct Java context | The controller selects the guest `PathClassLoader`, not the host loader, before user hooks execute. |
| Runtime observability | Package, process, virtual user, process slot, source APK, ClassLoader, mode, state, and latest error are exposed. |
| Endpoint discovery | The controller probes a bounded forwarded range and identifies the correct Gadget endpoint for a guest. |
| Native visibility | Loaded native modules can be enumerated before a user agent is installed. |
| ARM64 validation | Native guests are inspected before import; incompatible native APKs and split containers are rejected clearly. |
| Production-oriented host | Independent FridaBox identity, responsive Material UI, R8/resource shrinking, and explicit release signing. |

## Launch modes

### On-device

Choose a trusted `.js` file through Android's document picker. FridaBox stores a
private byte-identical copy, records its hash, creates a per-guest Script
interaction configuration, and loads it on future launches—without ADB, a USB
cable, port forwarding, or a computer-side Frida client.

### Computer

FridaBox loads its loopback-only Gadget listener and pauses guest startup. Attach
using the familiar workflow:

```text
frida -U gadget -l path/to/agent.js
```

For deterministic multi-guest discovery and automatic ClassLoader selection:

```text
python tools/attach_guest.py --list
python tools/attach_guest.py --package com.example.app --script scripts/example.js
```

### Clean

FridaBox stops the existing virtual process, disables instrumentation for the
next process, and launches the guest normally. The saved on-device agent remains
available for later use.

## How it works

```text
Original APK selected with SAF
            │
            ▼
Private copy + SHA-256 + ABI inspection
            │
            ▼
Virtual package installation (not Android PackageManager)
            │
            ▼
Virtual process allocation and guest runtime setup
            │
            ├── Clean ───────────────► guest makeApplication()
            │
            ├── On-device ───────────► Gadget + private agent.js
            │                              │
            │                              ▼
            │                         guest makeApplication()
            │
            └── Computer ────────────► Gadget listens + startup waits
                                           │
                                      controller attaches
                                           │
                                           ▼
                                      guest makeApplication()
```

The instrumentation hook lives in `BActivityThread.handleBindApplication()`.
At that point the virtual identity, filesystem redirection, guest context, and
guest ClassLoader exist, but the guest `Application` has not yet been created.
That ordering is enforced by a build verification task.

See [ARCHITECTURE.md](ARCHITECTURE.md) for component boundaries and
[docs/ENGINEERING_JOURNEY.md](docs/ENGINEERING_JOURNEY.md) for the failures,
constraints, and fixes that shaped the implementation.

## Demonstrated result

The repository includes a generated sample guest and a small hook:

```javascript
Java.perform(function () {
  const Target = Java.use('com.qm4rs.fridabox.sample.Target');
  Target.add.implementation = function (a, b) {
    return 1337;
  };
});
```

The complete Android 16 device validation proved that:

- the sample package was absent from the real Android PackageManager;
- startup paused before `SampleApplication.onCreate()`;
- the correct Gadget endpoint and guest ClassLoader were discovered;
- native module enumeration returned hundreds of modules;
- `Target.add(2, 3)` changed from `5` to `1337`;
- recycling into Clean mode removed the listener and restored the result to `5`.

The commercial workspace flow was also validated with a real ARM64 Unity guest
in On-device, Computer, and Clean modes. Evidence and exact commands are in
[docs/TEST_RESULTS.md](docs/TEST_RESULTS.md) and
[docs/device-validation.log](docs/device-validation.log).

## Quick start

### Requirements

- an ARM64 Android 12–16 device;
- JDK 21;
- Android SDK 35 and NDK 29.0.14206865;
- Python 3.10+;
- Node.js 20+ and npm when rebuilding the bundled Frida 17 agents.

### Build

```text
python tools/fetch_frida_gadget.py
npm ci
python tools/build_frida_agents.py
./gradlew :app:assembleDebug :Bcore:testDebugUnitTest :app:testDebugUnitTest :app:check
```

Windows paths containing spaces need the scoped native-build workaround
documented in [docs/BUILDING.md](docs/BUILDING.md). The output is written under
`app/build/outputs/apk/debug/`.

### Use

1. Install and open FridaBox.
2. Tap **Import APK** and select an ARM64 base APK.
3. Choose **On-device**, **Computer**, or **Clean** on that guest's card.
4. Select an agent for On-device mode, or attach normally in Computer mode.
5. Inspect live state in the **Runtime** tab.

See [docs/USAGE.md](docs/USAGE.md) and
[docs/FRIDA_CONNECTION.md](docs/FRIDA_CONNECTION.md) for the complete workflow.

## Engineering and research

FridaBox is the outcome of runtime investigation rather than a wrapper around a
single `System.loadLibrary()` call. The project had to solve:

- ordering Gadget before guest `Application` creation without loading it in the
  host process;
- preserving the guest's genuine `LoadedApk` ClassLoader for Java hooks;
- discovering the right loopback Gadget among colliding virtual processes;
- bundling `frida-java-bridge` explicitly for Frida 17 agents;
- making autonomous Script interaction work with private, read-only artifacts;
- maintaining reliable cross-process runtime state on Android;
- recycling virtual processes so instrumentation mode never leaks;
- satisfying Android 16 executable-file restrictions;
- keeping the imported APK byte-identical and outside the real PackageManager;
- producing reproducible debug/release builds across Windows path and NDK
  constraints;
- replacing the inherited application shell with an independent FridaBox
  product while preserving the mature runtime engine boundary.

Each problem, failed assumption, narrow fix, and verification method is recorded
in [the engineering journey](docs/ENGINEERING_JOURNEY.md).

## Repository map

```text
app/                 FridaBox Android product, UI, import and per-app policy
Bcore/               Virtual Android runtime and instrumentation integration
black-reflection/    Hidden-framework reflection layer used by the runtime
compiler/            Compile-time reflection helpers
sample-guest/        Deterministic hook demonstration target
scripts/             Frida probe, bootstrap, sample and native agents
tools/               Gadget fetch, agent build, forwarding and attach tools
docs/                Build, usage, limitations and device evidence
```

## Scope and limitations

FridaBox currently targets single-file ARM64 APKs. Split APK sets, privileged or
system applications, full Google Play Services, Play Integrity, hardware-backed
attestation, and perfect anti-instrumentation resistance are outside the current
scope. Vendor behavior and hidden Android APIs can still affect compatibility.

FridaBox deliberately does not claim stealth. Frida mappings, sockets and
threads; virtual stub processes; the shared host UID; Binder synthesis; and
ClassLoader topology may all be observable. Read
[docs/LIMITATIONS.md](docs/LIMITATIONS.md) and
[docs/DETECTION_SURFACES.md](docs/DETECTION_SURFACES.md).

## Research roadmap

The next research phase focuses on making the virtual environment more
internally consistent and reducing avoidable instrumentation fingerprints:

- reduce unnecessary Frida-visible artifacts and default identifiers;
- research safe mediation of `/proc`, including coherent views of process maps;
- improve filesystem, package, process, Binder, identity, ClassLoader, and
  service behavior so guests observe a more faithful sandbox;
- replace the workable Codex-assisted UI baseline with a human-led product
  design pass, an original FridaBox icon system, and a stronger visual identity;
- expand the Android/vendor test matrix and add regression probes for every
  detection surface addressed.

This work is tracked in [ROADMAP.md](ROADMAP.md). FridaBox will continue to
document what remains observable and will not describe best-effort hardening as
undetectability.

### Contribute a week of engineering, not money

FridaBox is not asking for financial donations. If the project is useful to you
and you already have access to Codex or Claude, consider dedicating one week of
your own usage quota to a scoped roadmap item: investigate it, implement the
narrowest fix, validate it on an authorized target, and open a pull request.

Use your own account and review every generated change yourself. Never share
accounts, API keys, session tokens, private APKs, or proprietary agents. A small,
well-tested PR with reproducible device evidence is more valuable than a large
unreviewed code dump.

## Project status

FridaBox 4.0.0 is a device-validated research release. The full sample hook and
three-mode guest flow have passed on a Samsung SM-S928B running ARM64 Android
16/API 36. Compatibility reports for other devices and ROMs are welcome when
they include reproducible logs and authorized test targets.

See [CHANGELOG.md](CHANGELOG.md), [CONTRIBUTING.md](CONTRIBUTING.md), and
[SECURITY.md](SECURITY.md). Repository owners can use the
[GitHub publishing checklist](docs/GITHUB_PUBLISHING.md) for the first public
push, branch protection, topics, and release setup.

## Contact

- LinkedIn: [Mahdi Karzari](https://www.linkedin.com/in/mahdikarzari)
- Telegram: [@QM4RS](https://t.me/QM4RS)

For security-sensitive reports, start with GitHub's private vulnerability
reporting when available. If that channel is unavailable, use one of the contact
methods above and avoid sending secrets or sensitive proof in the first message.

## Acknowledgements

FridaBox stands on years of work by the Android instrumentation and
virtualization communities.

- **[Frida](https://github.com/frida/frida)** provides the dynamic
  instrumentation engine, Frida Gadget, GumJS, the Java bridge, and the tooling
  model that makes this research possible. FridaBox pins and verifies Gadget
  17.16.0 and uses the official Frida 17 Java-agent toolchain.
- **[NewBlackbox](https://github.com/ALEX5402/NewBlackbox)** and the broader
  **BlackBox** project lineage provided the virtual package/process/Binder/IO
  runtime foundation. FridaBox began from NewBlackbox commit
  `89b59836c66f173756a4ae258cf379a957649820`, then added its instrumentation
  lifecycle, controller protocol, per-app modes, integrity pipeline, research
  tooling, validation suite, and independent product surface.
- The Android Open Source Project and its contributors provide the platform
  interfaces and runtime behavior this project studies.

Thank you to every upstream maintainer and researcher who published the work
that made FridaBox possible. Ownership and license details are preserved in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

FridaBox is distributed under the [Apache License 2.0](LICENSE). Bundled Frida
components retain their own license terms; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
