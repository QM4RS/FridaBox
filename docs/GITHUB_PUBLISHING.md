# GitHub publishing checklist

This repository is prepared to publish under the project name **FridaBox**.

## Suggested About description

> Android research workspace for per-app Frida Gadget instrumentation: on-device
> JavaScript, desktop attach, and clean launches without root or APK patching.

## Suggested topics

```text
android
android-security
arm64
dynamic-analysis
frida
frida-gadget
instrumentation
mobile-security
reverse-engineering
virtualization
kotlin
research
```

## Repository settings

- Set the default branch to `main`.
- Enable Issues and private vulnerability reporting.
- Enable Actions with read-only default workflow permissions.
- Add branch protection requiring the **Build, test, and verify** check.
- Require pull requests and dismiss stale approvals after new commits.
- Prevent force pushes and branch deletion on `main`.
- Enable Dependabot alerts and security updates.
- Add a social preview image only when it reflects the current FridaBox UI.

Do not reuse the removed legacy BlackBox64 GIF as the social preview.

## First push

Review the destination remote before pushing:

```text
git remote -v
git status
git log --oneline -5
```

Then push the intended branch explicitly:

```text
git push -u origin feature/fridabox-mvp
```

If this branch is intended to become the public default, create/review a pull
request into `main` and let Android CI finish before merging.

## Release checklist

1. Update `versionCode`, `versionName`, and `CHANGELOG.md`.
2. Run the host test and verification commands from `docs/BUILDING.md`.
3. Complete the device flow in `docs/TEST_RESULTS.md` on at least one supported
   ARM64 Android version.
4. Build with all four `FRIDABOX_RELEASE_*` signing variables set.
5. Verify the release signature, packaged ABIs, Gadget hash, and absence of a
   debug certificate.
6. Publish checksums with the APK and identify the tested device/Android build.
7. State known limitations and never describe FridaBox as undetectable.

The CI-produced release APK is intentionally unsigned unless a separate secure
release process provides signing credentials. Never store a keystore or signing
secret in the repository or workflow file.
