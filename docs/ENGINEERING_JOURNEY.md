# Engineering journey

This document records the engineering problems that turned FridaBox from a
virtual-app proof of concept into a repeatable instrumentation workspace. It is
not a claim that every Android application will run; it is a map of the concrete
failure modes investigated, the narrow fixes selected, and the evidence used to
accept those fixes.

## 1. Establishing a buildable baseline

### Problem

The inherited project did not build reproducibly on the available Windows host.
AGP marker resolution differed from direct module resolution, the requested NDK
revision was unavailable, and `ndk-build` could not parse an `APP_BUILD_SCRIPT`
path containing spaces.

### Resolution

- Map Android plugin IDs to the official AGP module.
- Use the installed complete NDK 29.0.14206865 revision explicitly.
- Add a Bcore-scoped `FRIDABOX_NDK_PROJECT_DIR` override so only the native
  build sees a no-space junction path.
- Record the exact deviation instead of silently changing toolchains.

### Evidence

The baseline investigation and commands are preserved in
[`BASELINE.md`](BASELINE.md). Both Java/Kotlin and native ARM64 builds now run
from the workspace path.

## 2. Finding the only useful early-load point

### Problem

Loading Gadget in the host `Application` instruments the wrong process. Loading
after guest `Application.onCreate()` is too late for early hooks. Loading before
virtual identity, IO redirection, and `LoadedApk` creation leaves Frida without
the correct guest environment.

### Resolution

Insert `FridaGadgetLoader.loadIfEnabled()` inside
`BActivityThread.handleBindApplication()` after runtime/native/ClassLoader setup
and before `makeApplication()`.

### Evidence

The sample guest logs `attachBaseContext` and `onCreate`. During Computer mode,
neither appeared until the Gadget client attached. A build verification task
also rejects source ordering regressions.

## 3. Preserving the original APK

### Problem

The common Gadget workflow mutates and resigns an APK, which changes the object
under study. Importing through Android's PackageInstaller would also place the
guest in the real system package database.

### Resolution

Stream the selected base APK through SAF into private storage, hash while
copying, inspect the archive, verify the private copy again, make it read-only,
and install only through the virtual package manager.

### Evidence

The generated sample asset and imported copy were byte-identical. `adb shell pm
list packages` did not contain the sample package while FridaBox could launch it.

## 4. Selecting the guest ClassLoader

### Problem

Frida's default Java factory can observe the host loader first in a virtual
process. A valid guest class then appears missing even though the application is
running.

### Resolution

Store the actual `LoadedApk` ClassLoader in `GuestRuntimeRegistry`. Load a
bootstrap agent before the user's script and assign that loader to
`Java.classFactory.loader`, with bounded retries during transient startup.

### Evidence

The controller reported `dalvik.system.PathClassLoader` and the sample hook
resolved `com.qm4rs.fridabox.sample.Target` before `Application.onCreate()`.

## 5. Discovering the correct Gadget endpoint

### Problem

Every virtual guest process begins with the same preferred Gadget port. Multiple
processes may move to fallback ports, while another unrelated Frida endpoint may
already exist on the device. A fixed `adb forward tcp:27042 tcp:27042` cannot
identify which guest it reached.

### Resolution

Use Gadget's bounded `pick-next` range, forward each candidate, probe it with a
FridaBox registry agent, reject endpoints without the expected registry, and map
valid endpoints to package and process.

### Evidence

`tools/attach_guest.py --list` discovered the correct sample endpoint and printed
package, process, user ID, virtual process ID, source APK, and ClassLoader.

## 6. Adapting agents to Frida 17

### Problem

Frida 17 API-loaded agents no longer receive the Java bridge implicitly. Plain
source scripts could load yet fail when calling `Java.perform()`.

### Resolution

Pin `frida-java-bridge` 7.0.13 and `frida-compile` 19.0.5, import the bridge
explicitly, commit reproducible bundles under `scripts/dist`, and teach the
controller to choose a compiled counterpart automatically.

### Evidence

Clean `npm ci` agent builds succeeded and the bundled sample hook changed
`Target.add(2, 3)` to `1337`.

## 7. Running an agent without a computer

### Problem

Interactive Gadget listen mode requires a host to attach and resume execution.
It cannot deliver the requested cable-free, persistent per-app behavior.

### Resolution

Add a per-package Script interaction mode. FridaBox copies the selected agent
byte-for-byte into private storage, records its SHA-256, generates an adjacent
relative-path config, and loads a private Gadget copy on every On-device launch.

### Evidence

A 198,960-byte real-world agent was imported with an identical SHA-256, marked
0400, loaded without a controller, and reached `local_script_active` before the
Unity guest became interactive.

## 8. Preventing launch-mode leakage

### Problem

Gadget is a native library. Once loaded, switching a living process to Clean
mode cannot reliably reverse its threads, mappings, hooks, or listener.

### Resolution

Treat mode changes as process-boundary changes. Stop the virtual package before
every relaunch and make each new process read the current per-package policy.

### Evidence

The validated clean launch used a different PID, emitted an explicit disabled
state, opened no Gadget listener, and restored the sample result from `1337` to
`5`.

## 9. Making runtime state honest across processes

### Problem

The guest registry is process-local. A host-screen read of cached
SharedPreferences could display stale `Waiting for computer` state even after an
On-device agent was active in another process.

### Resolution

Keep the registry authoritative inside the guest and use a deliberately small
controller snapshot with cross-process reload semantics for presentation.

### Evidence

The persisted state was correct during the failure. Reloading eliminated the
stale host display and subsequent On-device launches reported
`local_script_active` consistently.

## 10. Android 16 executable-file constraints

### Problem

Copying a writable native executable into app-private storage triggered modern
Android warnings and created an avoidable writable/executable overlap.

### Resolution

Finish copying and configuration first, then set the private Gadget executable
to mode 0555 and the agent to 0400 before loading.

### Evidence

The final Android 16 run reported the expected permissions and no longer emitted
the writable-executable warning for the private Gadget copy.

## 11. Building a real product boundary

### Problem

The inherited launcher mixed unrelated cloning, GMS, Xposed, fake-location, and
floating-overlay features with the instrumentation research. Its namespace,
resources, dependencies, and branding obscured the actual FridaBox workflow.

### Resolution

- Replace the launcher with a FridaBox-owned workspace and runtime UI.
- Move all host source and tests to `com.qm4rs.fridabox`.
- Replace the inherited `Application` shell with a minimal FridaBox runtime
  bootstrap.
- Remove 7,000+ lines of unused UI code, obsolete resources, legacy AARs, and
  stale product documentation.
- Keep the mature runtime engine as an internal compatibility boundary and
  preserve its required attribution.

### Evidence

Debug/release assembly, app/Bcore tests, lint/check, reinstall, launcher resume,
guest restoration, and a real Clean-mode Unity launch all passed after removal.

## 12. Release safety and reproducibility

### Problem

Research APKs often accidentally ship with a debug key or depend on locally
generated assets whose provenance cannot be reproduced.

### Resolution

- Release signing is configured only when all four explicit keystore variables
  are present; partial configuration fails and no debug fallback exists.
- R8 and resource shrinking are enabled for release.
- Gadget version and SHA-256 are pinned and verified before every app build.
- The debug sample is generated and embedded byte-identically.
- Frida 17 agents are reproducible from lockfile-pinned npm dependencies.

### Evidence

The debug signature verified, the unsigned release contained no debug signature,
and all custom integrity/order/packaging tasks passed. Current artifact hashes
are recorded in [`TEST_RESULTS.md`](TEST_RESULTS.md).

## Current research boundary

FridaBox demonstrates a robust architecture for ordinary single-file ARM64 APKs,
not universal Android virtualization. Split delivery, privileged/system apps,
Play Integrity, hardware-backed attestation, isolated services, WebView renderer
processes, and adversarial commercial RASP remain distinct research problems.
The project documents these boundaries rather than hiding them; see
[`LIMITATIONS.md`](LIMITATIONS.md) and
[`DETECTION_SURFACES.md`](DETECTION_SURFACES.md).
