# Test results

Validation date: 2026-07-19

## Host validation

The following commands completed successfully on the build host:

```powershell
.\gradlew.bat clean
.\gradlew.bat :sample-guest:assembleDebug
.\gradlew.bat :app:assembleDebug
.\gradlew.bat test
.\gradlew.bat :app:check
.\gradlew.bat :app:verifyDebugApkFridaPackaging :app:verifyInstrumentationOrdering :app:verifyDemoGuestUnmodified
npm ci
python tools\build_frida_agents.py
python -m py_compile tools\attach_guest.py tools\forward_frida_ports.py tools\fetch_frida_gadget.py tools\build_frida_agents.py
```

For this workspace path, native builds used:

```powershell
$env:FRIDABOX_NDK_PROJECT_DIR='D:\FridaBoxBuild\Bcore'
```

Unit-test results: 16 executions passed, with zero failures, errors, or skips.
This is eight test methods run for both debug and release variants:

- `ApkInspectorTest`: 3 per variant;
- `ApkIntegrityTest`: 1 per variant;
- `InstrumentationPreferenceParserTest`: 2 per variant;
- `GuestRuntimeRegistryTest`: 2 per variant.

The final APK and custom verification tasks passed:

- output: `app/build/outputs/apk/debug/FridaBox_4.0.0_arm64-v8a-debug.apk`;
- size: 19,977,904 bytes;
- SHA-256: `a87af38ff7f4a54d2cdc0207ac68319a1a05ab8067b7acdeb057c6c967ed2573`;
- packaged ABIs: ARM64 only;
- packaged native files: `libblackbox.so`, `libfrida-gadget.so`, and
  `libfrida-gadget.config.so` under `lib/arm64-v8a/`;
- Frida Gadget 17.16.0 SHA-256:
  `6bf149e5d1c5ec701e7b822cab57bb243f1c2a03318fa974fe373ee711a9ed9e`;
- early-load ordering and byte-identical demo-asset checks passed.
- pinned Frida 17 registry/bootstrap/sample agents rebuilt successfully, and
  controller help plus empty-range discovery completed successfully.

The build host provided JDK 24.0.1 and complete NDK 29.0.14206865 rather than
the requested JDK 21 and NDK 29.0.13846066. These substitutions and the
baseline build investigation are recorded in `docs/BASELINE.md`.

## Device validation

Runtime validation passed on a Samsung SM-S928B running ARM64 Android 16/API 36:

- latest host APK installed successfully;
- the sample installed only in BlackBox and was absent from Android user 0's
  real PackageManager;
- Gadget paused startup before `SampleApplication.attachBaseContext` and
  `onCreate`;
- the controller mapped port 27042 to the sample package/process and reported
  user ID 0, virtual process ID 0, source APK, and guest `PathClassLoader`;
- native enumeration returned 419 modules;
- `sample-hook.js` changed `Target.add(2, 3)` from 5 to 1337;
- launching without instrumentation recycled the process, opened no Gadget
  listener, and restored the visible result to 5.

The command and log transcript, including two device-discovered fixes, is in
`docs/device-validation.log`.
