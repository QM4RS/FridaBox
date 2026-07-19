# Usage

FridaBox keeps every imported application inside its private virtual workspace.
Importing an APK does not install that package into Android's real PackageManager.

## Import an application

1. Open **Workspace** and tap **Import APK**.
2. Select one ARM64 base `.apk` through Android's document picker.
3. FridaBox validates the APK, records its SHA-256, and creates a private guest.

Split-only packages (`.apks`, `.xapk`, and `.apkm`) and unsupported native ABIs
are rejected.

## Choose a launch mode

Every guest remembers one of three independent modes:

- **On-device**: select a trusted `.js` file once. FridaBox stores a byte-for-byte
  private copy, records its SHA-256, and loads it through Frida Gadget's Script
  interaction before the guest Application starts. No cable, computer, Frida CLI,
  port forwarding, or controller process is required on later launches.
- **Computer**: starts the loopback-only Gadget listener and pauses before the
  guest Application. Attach through the normal Frida workflow, for example:

  ```text
  frida -U gadget -l path/to/agent.js
  ```

- **Clean**: recycles the virtual process and launches without loading Frida
  Gadget. The selected on-device agent is retained for future use.

Switching modes always stops the previous guest process before the next launch.

## On-device agents

Select **On-device**, tap **Select JavaScript**, review the trust warning, and
choose a `.js` file up to 16 MiB. The original file is not modified. The private
copy and the private Gadget executable are made read-only before execution.

An autonomous script has no computer-side message handler. Calls such as `send()`
may be intentionally unobserved, while hooks, replacements, Java calls, native
interceptors, and in-app overlays continue to run in the guest process.

## Runtime and management

The **Runtime** tab reports the latest package, process, virtual user ID, virtual
process slot, source APK, ClassLoader, selected mode, state, and latest error.
Use **Manage** on an app card for app details, runtime details, virtual data
clearing, or removal from the private workspace.

Only run JavaScript agents you trust. An on-device agent executes with the same
access as the virtual guest process.
