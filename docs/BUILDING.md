# Building

## Prerequisites

- JDK 21 (the requested/recommended toolchain).
- Android SDK 35 and build tools.
- Android NDK 29.0.13846066 when available. This build host only had the closely
  related complete NDK 29.0.14206865, which is recorded in `docs/BASELINE.md`.
- Python 3.10 or newer.
- Node.js 20 or newer and npm for reproducibly building Frida 17 Java agents
  and generating Android vectors from the official `@tabler/icons` package.

Create `local.properties` with the SDK path. Frida Gadget is intentionally not a
build input and no Gadget binary is packaged in the APK. After installation, the
user downloads and selects an ABI-compatible Official Frida build from the
in-app **Gadgets** screen.

Install the pinned Java bridge/compiler and build the controller agents:

```powershell
npm ci
npm run verify:android-icons
python tools\build_frida_agents.py
```

Frida 17 no longer bundles runtime bridges into API-loaded GumJS agents. The
compiled files under `scripts/dist/` are reproducible from the source scripts,
`package.json`, and `package-lock.json`.

UI control icons are generated from pinned `@tabler/icons` sources with
`npm run generate:android-icons`. The app `check` task runs the matching
verification script and fails if a committed Android vector is out of sync.

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
The final host outputs are under `app/build/outputs/apk/debug/` for `armeabi-v7a`,
`arm64-v8a`, `x86`, and `x86_64`.
`verifyDebugApkHasNoGadget` inspects the assembled APK and fails if a Gadget
library or configuration is accidentally bundled again.

## Production release

The release variant enables R8 optimization, code shrinking, and resource
shrinking. It never falls back to the Android debug signing key.

Build an unsigned release artifact for later signing:

```powershell
$env:FRIDABOX_NDK_PROJECT_DIR='D:\FridaBoxBuild\Bcore'
.\gradlew.bat :app:assembleRelease
```

For a signed production build, provide all four variables before running the
same task:

```powershell
$env:FRIDABOX_RELEASE_STORE_FILE='D:\secure\fridabox-release.jks'
$env:FRIDABOX_RELEASE_STORE_PASSWORD='<store password>'
$env:FRIDABOX_RELEASE_KEY_ALIAS='fridabox'
$env:FRIDABOX_RELEASE_KEY_PASSWORD='<key password>'
.\gradlew.bat :app:assembleRelease
```

If only some signing variables are present, configuration fails instead of
producing an ambiguously signed artifact. Keep the keystore and credentials
outside the repository and CI logs.

Release outputs are written to `app/build/outputs/apk/release/`, one APK each for
`armeabi-v7a`, `arm64-v8a`, `x86`, and `x86_64`.
