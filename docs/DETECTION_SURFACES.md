# Detection surfaces

FridaBox is not undetectable. Virtualization reduces accidental identity and API
leakage but cannot reproduce a normal kernel/system installation.

- The host Linux UID remains the real UID at kernel level.
- The host SELinux domain remains visible.
- BlackBox virtual stub process names may be observed.
- Host and BlackBox classes coexist with guest classes in the ART process.
- Frida threads, mappings, sockets, and modules are observable.
- `/proc/self/maps` can reveal Frida Gadget.
- The default Frida protocol endpoint can be probed even though it is loopback-only.
- ClassLoader topology differs from a normally installed application.
- Some PackageManager, ActivityManager, and other Binder responses are synthesized.
- The system-side PackageManager does not know the guest package.
- The guest shares the host UID and process sandbox rather than receiving a
  system-assigned package UID.
- Play Integrity and hardware-backed attestation cannot be faithfully virtualized.

No app-specific anti-Frida or anti-virtualization bypasses are included.
