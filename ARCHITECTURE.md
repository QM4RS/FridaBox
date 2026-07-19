# Architecture

FridaBox extends the existing BlackBox virtual package, process, Binder, file,
identity, signature, and lifecycle implementation. It does not introduce a
second plugin framework and never creates a replacement `DexClassLoader` for a
guest.

```text
Host launcher process
        |
        | import original APK
        v
BlackBox virtual package manager
        |
        | allocate :pN virtual process
        v
BActivityThread.handleBindApplication()
        |
        | create guest Context / LoadedApk / ClassLoader
        | initialize virtual runtime and IO redirection
        | populate GuestRuntimeRegistry
        | load Frida Gadget and wait
        v
Frida controller attaches
        |
        | select guest ClassLoader
        | install Java/native hooks
        v
Guest makeApplication()
        |
        v
Guest Application.onCreate()
        |
        v
Guest Activity
```

## Runtime boundary

`GuestRuntimeRegistry` is volatile, process-local state. Each normal BlackBox
virtual process populates it after `VirtualRuntime.setupRuntime`, `NativeCore.init`,
and IO redirection, using the `LoadedApk` ClassLoader. `FridaGadgetLoader` then
performs one synchronized `System.loadLibrary("frida-gadget")` attempt in that
Linux process. The static Gadget configuration pauses that call until a
controller connects. Only afterward does BlackBox call `makeApplication`.

The host status screen uses a small SharedPreferences snapshot because the host
launcher cannot directly read another process's static registry. The Frida
controller reads the authoritative process-local registry through Java.

## Import boundary

The host copies a document-provider stream once into `files/imported-apks`,
computes SHA-256 while copying, inspects the ZIP ABI entries, parses package
metadata, verifies the stored hash, marks the file read-only, and passes the path
only to BlackBox's virtual package manager. No real package installer Intent or
PackageInstaller session is used.
