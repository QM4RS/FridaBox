# FridaBox research roadmap

FridaBox 4.0.0 proves the complete import, early instrumentation, guest
ClassLoader, native enumeration, On-device, Computer, and Clean flow on a real
ARM64 Android 16 device. The next phase is not a promise of invisibility. It is
a measured effort to remove unnecessary fingerprints and make the virtual
environment more coherent under guest observation.

Every roadmap change must target software and devices the researcher is
authorized to assess, preserve a deterministic Clean mode, and add evidence to
the detection-surface documentation.

## P0 — Regression laboratory

Hardening without measurement becomes folklore. Before broad interception work,
build a repeatable probe suite that records:

- `/proc/self/maps`, mount, status, task, fd, cmdline, and network observations;
- Java and native class/module/thread visibility;
- PackageManager, ActivityManager, user, UID, process, storage, and signature
  responses;
- host/guest filesystem paths and permission behavior;
- differences between a normal installation, FridaBox Clean mode, and each
  instrumented mode.

Acceptance criteria:

- probes run against owned sample applications;
- output is structured and diffable across Android versions/vendors;
- every future hardening PR includes a before/after result;
- the suite itself does not claim that an untested surface is protected.

## P1 — Reduce avoidable Frida visibility

Research and minimize identifiers that are implementation defaults rather than
requirements of the instrumentation architecture. Candidate surfaces include
module names and paths, configuration artifacts, listener behavior, thread
metadata, and other stable strings exposed to the guest.

Guardrails:

- preserve compatibility with the pinned official Frida engine;
- do not add app-specific bypasses;
- do not weaken loopback-only networking or artifact integrity checks;
- keep controller discovery deterministic;
- document residual native mappings, threads, sockets, and protocol surfaces.

## P1 — `/proc` and process-map consistency

Research a coherent mediation layer for guest reads of `/proc`, with special
attention to maps and related views. Filtering one file in isolation is usually
detectable because the same fact appears through multiple kernel and runtime
interfaces.

The work should first map all relevant access paths—Java APIs, libc calls,
direct syscalls, file descriptors, memory APIs, and secondary proc entries—then
define which views can be made mutually consistent without destabilizing the
guest or concealing host security failures.

Acceptance criteria:

- behavior is specified before hooks are added;
- direct and indirect reads are tested;
- filtered output remains structurally valid;
- native crashes and anti-tamper loops have bounded failure handling;
- limitations and bypassable paths remain explicit.

## P1 — Higher-fidelity virtual environment

Improve consistency across the surfaces that reveal a virtualized application:

- PackageManager and ActivityManager identity;
- UID, user, process, task, and component relationships;
- filesystem roots, storage volumes, permissions, and canonical paths;
- Binder attribution and calling identity;
- application info, signatures, installers, and source directories;
- ClassLoader, resources, providers, services, jobs, and broadcast behavior;
- WebView and isolated/external process boundaries where technically feasible.

The goal is a sandbox whose answers agree with each other, not a collection of
hard-coded return values. Changes must be Android-version-aware and backed by
comparison tests against normal installations.

## P2 — Compatibility expansion

- Split APK and App Bundle import with explicit split integrity.
- Broader Android/vendor ROM device matrix.
- Multi-process and service instrumentation regression coverage.
- Better WebView renderer and isolated-process diagnostics.
- Optional architectures only after the full integrity and runtime flow can be
  validated for them.

## P2 — Research ergonomics

- Exportable, sanitized runtime reports.
- Per-agent metadata, hashes, versions, and rollback.
- Script validation and clearer autonomous-agent diagnostics.
- Reusable probe packs for Java, native, Binder, storage, and lifecycle tests.
- Automated comparison of Computer, On-device, and Clean process snapshots.

## How to contribute

Choose one observable surface and open an issue before starting a large change.
Define the hypothesis, authorized test target, smallest implementation, expected
tradeoffs, and acceptance evidence.

If you already have Codex or Claude access, consider dedicating one week of your
own quota to that bounded task instead of donating money. Use the assistant for
investigation, tests, documentation, and review—not as a source of unaudited bulk
changes. Keep credentials and private research material out of prompts, review
all output personally, and submit the result as a focused pull request following
[CONTRIBUTING.md](CONTRIBUTING.md).

The most valuable contribution is not the largest patch. It is the smallest
change that makes one measured observation more correct without breaking the
validated FridaBox flow.
