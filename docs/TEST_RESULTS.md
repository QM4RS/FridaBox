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
- the sample installed only in the FridaBox private workspace and was absent
  from Android user 0's real PackageManager;
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

## Commercial workspace and per-app mode validation

Validation date: 2026-07-20

The redesigned FridaBox launcher and all three per-app modes were validated on
the same Samsung SM-S928B, ARM64 Android 16/API 36 device with the imported
`com.paeezanstudio.pesarkhande` 3.3.7 guest.

- The independent FridaBox launcher, icon, dark product theme, responsive
  workspace cards, bottom navigation, import action, and selected-mode states
  rendered correctly at 1080 x 2340.
- `pesarkhande-agent.js` (198,960 bytes, SHA-256
  `41dd04f7a6a4b8de47fcd94ee5646f43effd8f73b36eda64d46a65f4f304fa49`)
  was selected through Android's document picker and copied without modification.
- On-device mode loaded the private Gadget and Script configuration without a
  controller, then returned to `beforeCreateApplication`; the Unity game reached
  its interactive home screen.
- Runtime reported `local_script_active`, package
  `com.paeezanstudio.pesarkhande`, virtual user ID 0, virtual process slot 1,
  the private source APK, and `dalvik.system.PathClassLoader`.
- Computer mode paused before `beforeCreateApplication`. Direct
  `frida -U gadget` attachment resumed the guest and enumerated 416 native
  modules; the first five were `app_process64`, `linker64`,
  `libandroid_runtime.so`, `libbinder.so`, and `libcutils.so`.
- Clean mode recycled the main guest PID from 26464 to 27819, emitted
  `Instrumentation disabled for this guest process`, opened no Gadget listener,
  and launched the game normally.
- A stale cross-process SharedPreferences cache initially made Runtime display
  `Waiting for computer` for a successful on-device launch. Multi-process reload
  semantics fixed the display; the persisted state was already correct.
- The private JavaScript file is mode 0400 and the private Gadget executable is
  mode 0555 at launch. Android 16 no longer reports the writable-executable
  warning for the FridaBox Gadget copy.

Final automated builds and tests passed:

```powershell
.\gradlew.bat :app:assembleDebug :app:assembleRelease :Bcore:testDebugUnitTest :app:testDebugUnitTest
```

Artifacts:

- debug: 21,049,981 bytes, SHA-256
  `80e70b33fca741e4f805aa233cdfaf5bc6fe2030e93c8fd825611eb5c407c917`;
- release: 13,266,764 bytes, SHA-256
  `caa2218194fcbe91c10d0d29a74b7401aaed53f340b8a0d6668321ddae48ddfb`.

The release artifact was intentionally unsigned because no production keystore
was supplied. `apksigner` confirmed the debug APK verifies and the release APK
does not contain a debug signature.

## Legacy shell removal validation

Validation date: 2026-07-20

The obsolete launcher, GMS/Xposed/fake-location screens, legacy resources,
Chinese launcher translations, bundled UI AARs, and old product documentation
were removed. The application namespace and all host-owned source moved to
`com.qm4rs.fridabox`; only the runtime engine's compatibility API remains under
its upstream package namespace, with attribution retained in
`THIRD_PARTY_NOTICES.md`.

The cleanup passed app/Bcore unit tests, debug and release assembly, and the
complete app lint/check task. On the connected Samsung SM-S928B (ARM64,
Android 16/API 36), the new APK installed successfully, resumed
`com.qm4rs.fridabox/.FridaBoxActivity`, restored both private guests, and launched
`com.paeezanstudio.pesarkhande` in Clean mode through `ProxyActivity$P0` without
a fatal exception.

Final cleanup artifacts:

- debug: 19,795,788 bytes, SHA-256
  `3fabf2887b3bf1aa1a83475b18803755168b33b2111e89f15d3d1434d89994a5`;
- release: 12,454,018 bytes, SHA-256
  `b7e9033def3fbe25f92686ceb3a3e2f623951e8d7fdd450b172d30df25e08e8e`.
