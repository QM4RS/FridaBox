# Runtime bridges

## Why this exists

Frida 17.0.0 removed the Java, Objective-C, and Swift runtime bridges from the
GumJS runtime. An autonomous Gadget Script interaction therefore no longer gets
the `Java` global implicitly. Frida's REPL and `frida-trace` remain compatible
because `frida-tools` injects those bridges itself.

Primary references:

- `https://frida.re/news/2025/05/17/frida-17-0-0-released/`
- `https://frida.re/docs/bridges/`
- `https://frida.re/docs/gadget/#using-the-language-bridges`

`frida-il2cpp-bridge` is different: it is a community module and was never a
built-in GumJS bridge. Its current compatibility statement covers Unity 5.3.0
through 6000.3.x, with Android and Linux as the tested platforms:

- `https://github.com/vfsfitvnm/frida-il2cpp-bridge`

## FridaBox architecture

Frida scripts have isolated globals. Loading a bridge in a second Script does
not make `Java` or `Il2Cpp` visible to the user's Script. FridaBox instead builds
each supported package version with `frida-compile`, stores the resulting bundle
as an APK asset, and extracts its entry module while preparing the private
on-device agent. The final execution order is:

1. FridaBox log capture;
2. enabled runtime-bridge entry modules;
3. the user's unchanged imported agent copy.

Only the generated runtime copy is composed. The originally imported agent and
its recorded digest are not modified.

Bridge settings appear only when the active Gadget is 17.0.0 or newer. They
apply to On-device mode on the next process launch. Computer mode uses Gadget's
Listen interaction; bridge availability there belongs to the attaching client
(`frida`, `frida-trace`, or the API-created agent), because remotely created
Scripts have separate isolates.

## Pinned versions

The APK contains these reproducible, offline choices:

| Bridge | Versions | Default | Source |
| --- | --- | --- | --- |
| Java | 7.0.11, 7.0.12, 7.0.13 | 7.0.13 | official `frida-java-bridge` npm package |
| IL2CPP | 0.12.2, 0.13.0, 0.13.1 | 0.13.1 | community `frida-il2cpp-bridge` npm package |

The npm registry contained 92 Java bridge versions from 3.1.1 through 7.0.13
and 77 published IL2CPP versions through 0.13.1 when this catalog was researched
on 2026-07-28. FridaBox deliberately ships a recent curated set instead of every
historical package to keep the APK small and the test surface bounded.

## Rebuilding

Run:

```powershell
npm ci
python tools/build_frida_agents.py
```

The package aliases in `package.json` allow multiple versions to coexist. The
generated bridge bundles are written to
`app/src/main/assets/fridabox/bridges/`. Gradle's
`verifyRuntimeBridgeAssets` task validates that every catalog entry exists and
has a Frida bundle header.
