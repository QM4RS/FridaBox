# Changelog

All notable FridaBox changes are documented here. The project follows semantic
versioning for its public releases.

## [Unreleased]

### Documentation

- Added the public research roadmap for Frida visibility, `/proc`/maps
  consistency, and higher-fidelity virtual-environment behavior.
- Added a contribution model that asks users to donate a bounded week of their
  own Codex or Claude engineering time instead of money.

## [4.0.0] - 2026-07-20

### Added

- Independent FridaBox application, Android namespace, brand, icon, responsive
  workspace, runtime dashboard, settings, and per-guest management.
- Per-app **On-device**, **Computer**, and **Clean** launch modes.
- Trusted JavaScript selection through SAF with private byte-identical storage,
  SHA-256 recording, size bounds, and read-only execution permissions.
- Autonomous Gadget Script interaction requiring no ADB or computer after agent
  selection.
- Loopback Gadget endpoint discovery and guest mapping through
  `GuestRuntimeRegistry`.
- Guest ClassLoader bootstrap and native module enumeration.
- ARM64 APK inspection and clear rejection of incompatible/split inputs.
- Generated sample guest and deterministic `Target.add(2, 3) -> 1337` hook.
- Reproducible Frida 17 agent bundles with pinned npm dependencies.
- Explicit production signing configuration, R8, and resource shrinking.
- Android 16 device-validation transcript and engineering documentation.

### Changed

- Gadget now loads after virtual runtime/IO/ClassLoader setup and before guest
  `makeApplication()`.
- Launch-mode changes recycle the virtual process to prevent instrumentation
  state from leaking into Clean launches.
- Runtime snapshots reload safely across host/guest process boundaries.
- Private Gadget and agent permissions comply with modern Android executable
  file constraints.
- Guest-visible inherited product strings were replaced with FridaBox identity.

### Removed

- The inherited launcher and unrelated GMS, Xposed, fake-location, floating
  overlay, cloning-list, and legacy settings surfaces.
- Obsolete launcher resources, translations, UI AARs, and product documents.
- Debug-key fallback for release artifacts.

## Foundation

FridaBox began from NewBlackbox commit
`89b59836c66f173756a4ae258cf379a957649820`. Upstream provenance and bundled
Frida licensing are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
