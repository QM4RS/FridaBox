# Usage

FridaBox keeps every imported application inside its private virtual workspace.
Importing an APK does not install that package into Android's real PackageManager.

## Import an application

1. Open **Workspace** and tap the import icon.
2. Choose **Import from apps** to clone a launchable app already installed on
   the device, or **Import from file** to select one base `.apk` through
   Android's document picker.
3. FridaBox validates the full installed base/split set or selected file,
   records its SHA-256 fingerprint, and creates a private guest.

Split-only files (`.apks`, `.xapk`, and `.apkm`) and unsupported native ABIs are
rejected. Installed split applications are imported through their system package
so their active base and split APKs remain available to the virtual runtime.

## Install a Gadget

1. Open **Gadgets**. FridaBox detects the device ABI and only offers matching
   release assets.
2. Tap **Browse versions**. The minimal release browser loads Official builds
   from `frida/frida` ten at a time as the list is scrolled.
3. Download any listed version. Downloads are decompressed in private storage,
   checked as ELF libraries, and rejected when their architecture does not match.
4. Select any installed version as active. Downloading another version does not
   replace the active selection unless no Gadget had been selected yet.

Instrumented launches require an active Gadget. Clean mode remains available
without one. Gadget binaries are never bundled in the FridaBox APK.

## Select runtime bridges

When the active Gadget is 17.0.0 or newer, the **Gadgets** screen shows Java and
IL2CPP runtime-bridge controls. Enable either bridge and select one of its
offline pinned versions. The choice is composed into the generated private
agent on the next **On-device** launch, so a plain script may use the `Java` or
`Il2Cpp` global without importing that package itself.

The switch does not mutate the imported script and cannot change a process that
is already running. It does not apply to **Computer** mode, where each script is
created by the attaching Frida client in its own JavaScript isolate.

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

Tap an app icon, select **On-device**, tap **Select JavaScript**, review the trust warning, and
choose a `.js` file up to 16 MiB. The original file is not modified. The private
copy and the private Gadget executable are made read-only before execution.

An autonomous script has no computer-side message handler. Calls such as `send()`
may be intentionally unobserved, while hooks, replacements, Java calls, native
interceptors, and in-app overlays continue to run in the guest process.

## Runtime and management

The **Runtime** tab reports the latest package, process, virtual user ID, virtual
process slot, source APK, ClassLoader, selected mode, state, and latest error.
Use **Manage** in an app's launch panel for app details, runtime details, virtual data
clearing, or removal from the private workspace.

Only run JavaScript agents you trust. An on-device agent executes with the same
access as the virtual guest process.
