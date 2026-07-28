# Changelog

All notable FridaBox changes are documented here. The project follows semantic
versioning for its public releases.

## [Unreleased]

## [4.2.0] - 2026-07-28

### Added

- Optional, version-selectable Java and Unity IL2CPP runtime bridges for Frida
  Gadget 17 and newer, embedded privately into the on-device agent at launch.
- Reproducible bridge build inputs and packaged Java 7.0.11-7.0.13 and IL2CPP
  0.12.2, 0.13.0, and 0.13.1 bridge versions.

### Changed

- Simplified the application navigation to Workspace, Gadgets, and Settings by
  removing the redundant Runtime destination.
- Refined the liquid-glass bottom navigation with icon-only active indicators,
  heavier active icons, tactile button motion, and animated screen transitions.
- Centered the Gadget version browser and moved in-app notifications above the
  bottom navigation.
- Simplified Settings by removing obsolete global instrumentation and advanced
  runtime-detail controls.

### Fixed

- Preserve the Gadget screen scroll position when selecting Gadget or bridge
  versions instead of rebuilding at the top of the page.
- Keep bridge enablement and version choices device-local and apply them to the
  next private on-device agent without requiring imports in user scripts.
- Restore clear spacing between the Settings controls and security warning.

## [4.1.1] - 2026-07-28

### Fixed

- Select downloaded Frida Gadgets by the actual host process ABI instead of the
  device's preferred ABI, preventing 64-bit Gadgets from being selected by
  32-bit ARM or x86 release APKs.
- Require guest native libraries to match the exact FridaBox process ABI and
  extract only that ABI, preventing cross-architecture guest import failures.
- Report the correct x86_64 process bitness on Android 5.0 and 5.1.

## [4.1.0] - 2026-07-28

### Added

- Separate release APKs for `armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64`.
- In-app APK inspection now accepts supported 32-bit ARM and x86 guest ABIs.
- Downloadable official Frida Gadget management, including ABI validation and
  on-device or computer-controlled runtime selection.
- A liquid-glass launcher, downloadable Gadget screen, and guest log overlay.

### Changed

- Updated application iconography, navigation, runtime visibility, and release
  dependency set.

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
