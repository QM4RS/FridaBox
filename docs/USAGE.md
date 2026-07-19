# Usage

1. Install and open the FridaBox host on an ARM64 Android 12–16 research device.
2. Tap **Import APK** and select one base `.apk` through the system document
   picker. `.apks`, `.xapk`, `.apkm`, split-only packages, and 32-bit-only native
   APKs are rejected.
3. Review package, version, SHA-256, private source path, and ABI status.
4. Tap **Launch instrumented**. Startup intentionally pauses before the guest
   `Application` is created.
5. Run the attach command shown on **Runtime status**. Attach and load hooks.
6. Use **Launch without instrumentation** for a clean virtual process where the
   Gadget is not loaded. FridaBox stops the package before switching modes.

Debug builds expose **Install demo guest**. The action installs the generated
`com.qm4rs.fridabox.sample` APK only into BlackBox. Then run:

```text
npm ci
python tools/build_frida_agents.py
python tools/attach_guest.py --package com.qm4rs.fridabox.sample --script scripts/sample-hook.js --keep-alive
```

After startup resumes, press the sample button. The visible result should be
`1337`, demonstrating that the guest ClassLoader was selected.

**Clear virtual app data** and **Remove from virtual space** affect only the
BlackBox virtual environment. They do not invoke Android's real package manager.
