# FridaBox

FridaBox is an authorized mobile-security research workspace that runs an original,
unmodified APK inside private virtual processes and loads Frida Gadget before
the guest `Application` is created. It requires no root, frida-server, Magisk,
Zygisk, system-image changes, real PackageManager installation, APK patching,
repacking, or resigning.

The host application ID and Android namespace are both `com.qm4rs.fridabox`.
Third-party engine provenance is isolated in `THIRD_PARTY_NOTICES.md`.

## MVP capabilities

- SAF import of one base APK into app-private, read-only storage.
- SHA-256 verification before and after private virtual installation.
- ARM64 native-library inspection; pure Java/Kotlin guests are accepted and
  native guests without `arm64-v8a` are rejected.
- Per-guest instrumented or non-instrumented launches with virtual process stop
  before mode changes.
- Frida Gadget 17.16.0 bound to loopback, default port 27042, with conflict
  fallback and `on_load=wait` for pre-`Application.onCreate()` hooks.
- Process-local guest registry and controller-side ClassLoader selection.
- Debug sample guest proving `Target.add(2, 3)` can be replaced with `1337`.
- Reproducibly bundled Frida 17 Java agents using pinned `frida-java-bridge`
  7.0.13 and `frida-compile` 19.0.5.

Start with [docs/BUILDING.md](docs/BUILDING.md), [docs/USAGE.md](docs/USAGE.md),
and [docs/FRIDA_CONNECTION.md](docs/FRIDA_CONNECTION.md).

FridaBox is not undetectable. See [docs/DETECTION_SURFACES.md](docs/DETECTION_SURFACES.md)
and [docs/LIMITATIONS.md](docs/LIMITATIONS.md).

The complete Android 16 device transcript is in
[docs/device-validation.log](docs/device-validation.log).
