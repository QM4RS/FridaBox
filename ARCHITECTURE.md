# FridaBox architecture

FridaBox has two deliberate layers:

1. an independent host product under `com.qm4rs.fridabox`, responsible for APK
   import, integrity, launch policy, agent storage, runtime presentation, and
   the user experience;
2. a retained virtual Android runtime responsible for package, process, Binder,
   filesystem, identity, signature, component, and lifecycle virtualization.

The runtime descends from the NewBlackbox/BlackBox lineage. Its internal package
names are compatibility API and are not the FridaBox product namespace. They are
kept stable because manifests, AIDL, reflection, native code, persisted paths,
and virtual process dispatch all depend on that contract.

## End-to-end lifecycle

```text
FridaBoxActivity
    │
    ├── SAF document stream
    ├── private immutable APK copy
    ├── SHA-256 + ZIP ABI inspection
    └── virtual installation for user 0
            │
            ▼
    virtual package manager
            │
            ▼
    allocate :pN process and dispatch ProxyActivity
            │
            ▼
    BActivityThread.handleBindApplication()
            │
            ├── establish virtual identity and runtime
            ├── initialize native IO redirection
            ├── create guest Context / LoadedApk / PathClassLoader
            ├── populate GuestRuntimeRegistry
            └── apply per-package InstrumentationPreferences
                    │
                    ├── disabled: continue
                    ├── listen: load loopback Gadget and wait for attach
                    └── script: load private Gadget + agent.js
                            │
                            ▼
                    guest makeApplication()
                            │
                            ▼
                    guest Application.onCreate()
                            │
                            ▼
                    guest Activity
```

## Import boundary

The host copies a document-provider stream once into `files/imported-apks` and
computes SHA-256 while copying. It inspects native ZIP entries, parses package
metadata, verifies the stored hash, marks the private file read-only, and passes
that path only to the virtual package manager.

There is no package-installer Intent, PackageInstaller session, APK mutation,
repack, or resign. The original guest package is therefore absent from Android's
real PackageManager.

## Instrumentation boundary

`GuestRuntimeRegistry` is authoritative, volatile, process-local state. It is
populated only after `VirtualRuntime.setupRuntime`, `NativeCore.init`, IO
redirection, and guest `LoadedApk` creation have succeeded. This gives Frida a
real guest ClassLoader while still preceding `makeApplication()`.

`FridaGadgetLoader` makes one synchronized Gadget-load attempt per Linux process.
The loader reads per-package policy from private host storage:

- **disabled** emits an explicit clean-launch state and never loads Gadget;
- **listen** loads the pinned loopback configuration with `on_load=wait`;
- **script** creates a private per-guest Gadget copy and adjacent Script
  interaction config referencing a read-only `agent.js`.

The build task `verifyInstrumentationOrdering` statically verifies that the
loader remains before guest `makeApplication()`.

## Controller boundary

Gadget always listens on device loopback. ADB forwarding is a controller concern,
not a guest concern. `tools/attach_guest.py` forwards a bounded port range,
probes candidates using a compiled registry agent, rejects unrelated endpoints,
and maps each endpoint to package/process metadata from `GuestRuntimeRegistry`.

Before loading a user agent, `guest-bootstrap.js` assigns the registry's guest
ClassLoader to `Java.classFactory.loader` and reports native module enumeration.
This prevents host-first class resolution from producing false negatives.

## Cross-process state

The registry itself is never treated as cross-process storage. A minimal private
SharedPreferences snapshot lets the host UI display the latest package, process,
virtual user, process slot, source APK, ClassLoader, state, and error. Reads use
multi-process reload semantics because host and guest processes maintain
independent in-memory preference caches.

## Process recycling

Instrumentation policy is process-scoped in effect even though it is persisted
per package. Changing mode stops the guest before relaunch. This is essential:
a native library cannot be unloaded safely from a living Android process, so a
Clean launch must receive a fresh virtual process rather than attempting to undo
Gadget initialization.

## Trust and security boundaries

- The imported APK and selected JavaScript agent are untrusted inputs.
- Imported files are size-bounded, hashed, privately stored, and made read-only.
- On-device agents require an explicit trust confirmation and execute with the
  guest process's access.
- Gadget binds only to `127.0.0.1`; remote reachability requires an explicit ADB
  forwarding action.
- Release builds never silently use the debug signing key.
- FridaBox does not claim to defeat kernel, SELinux, Frida, virtualization, or
  hardware-attestation detection.

## Source layout

| Module | Responsibility |
| --- | --- |
| `app` | FridaBox application, UI, import pipeline, modes and management. |
| `Bcore` | Virtual Android runtime, Gadget load point, registry and native integration. |
| `black-reflection` | Generated/reflected access to hidden Android framework APIs. |
| `compiler` | Annotation processing used by the reflection layer. |
| `sample-guest` | Deterministic early-start and hook validation target. |
| `scripts` | Source and reproducibly bundled Frida 17 agents. |
| `tools` | Fetch, build, forward, discover and attach utilities. |
