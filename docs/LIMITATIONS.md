# Limitations

The MVP targets ordinary single-file APKs on ARM64 Android 12 through Android 16.
Compatibility varies because Android hidden APIs and vendor framework behavior
change, and virtualization is observable.

Explicitly unsupported or excluded:

- split APK sets and App Bundles (`.apks`, `.xapk`, `.apkm`);
- 32-bit-only native APKs and x86 guests;
- system apps, privileged permissions, or Play Store inside the container;
- full Google Play Services compatibility and Play Integrity;
- hardware-backed keystore identity or attestation emulation;
- reliable `isolatedProcess=true`, WebView renderer sandbox, app zygote, or
  external-service instrumentation outside the host UID;
- reliable operation for all banking/RASP applications;
- perfect anti-virtualization or anti-instrumentation resistance.

Normal guest `android:process=":remote"` components routed through BlackBox's
`BActivityThread` receive a best-effort independent Gadget load. Each process
starts at 27042 and relies on `pick-next` for conflicts.

The static config always uses `on_load=wait`; changing the displayed base port
does not rewrite the packaged Gadget configuration in this MVP. The controller's
base/count options must match the port range used for discovery.
