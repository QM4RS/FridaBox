# NewBlackbox baseline

- Foundation: `ALEX5402/NewBlackbox`, branch `main`
- Required commit: `89b59836c66f173756a4ae258cf379a957649820`
- Working branch: `feature/fridabox-mvp`
- Baseline date: 2026-07-19
- Host OS: Windows 11 amd64
- Available JVM used: Oracle JDK 24.0.1 (JDK 21 was not installed on the build host)

## Exact pinned-source result

`gradlew clean --stacktrace --console=plain` failed during configuration because
`com.android.application:com.android.application.gradle.plugin:8.13.2` could not
be resolved. A direct request to the official Google Maven artifact URL returned
HTTP 404. No source code had been changed when this result was recorded.

## Narrow baseline compatibility adjustments

The official Google Maven endpoint returned HTTP 404 for AGP and AndroidX
artifacts in this build environment. The Google repository mirror at
`https://maven.aliyun.com/repository/google` is configured ahead of `google()`;
the requested AGP 8.13.2 is retained. Plugin IDs are mapped directly to the
official `com.android.tools.build:gradle` module to avoid marker resolution.

The requested NDK
29.0.13846066 was not installed; the nearest complete installed NDK,
29.0.14206865, is used. Bcore's `ndkVersion` was also moved from the
`externalNativeBuild` block to the Android block where AGP recognizes it.

On Windows, upstream `ndk-build` cannot parse an `APP_BUILD_SCRIPT` path that
contains spaces. Bcore accepts `FRIDABOX_NDK_PROJECT_DIR` as an optional alias
for the Bcore module directory; this build used `D:\FridaBoxBuild\Bcore`, a
directory junction to the real workspace.

## Post-adjustment result

With the repository mirror, installed NDK 29 revision, and scoped Windows
space-path workaround, `:app:assembleDebug` completed successfully. The baseline
build compiled Java/Kotlin resources and both native ABIs present in the original
foundation before FridaBox changed the final target to ARM64-only.
