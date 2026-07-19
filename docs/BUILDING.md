# Building

## Prerequisites

- JDK 21 (the requested/recommended toolchain).
- Android SDK 35 and build tools.
- Android NDK 29.0.13846066 when available. This build host only had the closely
  related complete NDK 29.0.14206865, which is recorded in `docs/BASELINE.md`.
- Python 3.10 or newer.
- Node.js 20 or newer and npm for reproducibly building Frida 17 Java agents.

Create `local.properties` with the SDK path, then fetch the pinned official
Gadget:

```powershell
python tools\fetch_frida_gadget.py
```

The script uses the GitHub Releases API and Python's standard `lzma` module. The
build fails with a direct instruction if the binary is absent. No XZ archive is
kept.

Install the pinned Java bridge/compiler and build the controller agents:

```powershell
npm ci
python tools\build_frida_agents.py
```

Frida 17 no longer bundles runtime bridges into API-loaded GumJS agents. The
compiled files under `scripts/dist/` are reproducible from the source scripts,
`package.json`, and `package-lock.json`.

On Windows, if the repository path contains spaces, create a no-space junction
and set the Bcore-only native path override:

```powershell
New-Item -ItemType Junction -Path D:\FridaBoxBuild -Target 'D:\path with spaces\FridaBox'
$env:FRIDABOX_NDK_PROJECT_DIR='D:\FridaBoxBuild\Bcore'
```

Build and test:

```powershell
.\gradlew.bat clean
.\gradlew.bat :sample-guest:assembleDebug
.\gradlew.bat :app:assembleDebug
.\gradlew.bat test
.\gradlew.bat :app:check
```

The debug host build depends on the sample build and copies its byte-identical
APK into generated debug assets. Generated sample APKs are not source-controlled.
The final host output is under `app/build/outputs/apk/debug/` and is ARM64-only.
