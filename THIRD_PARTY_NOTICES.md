# Third-party notices

## NewBlackbox / BlackBox

FridaBox is based on `ALEX5402/NewBlackbox` commit
`89b59836c66f173756a4ae258cf379a957649820`. The foundation repository includes
an Apache License 2.0 notice; see the repository root `LICENSE` file.

FridaBox gratefully acknowledges NewBlackbox and the wider BlackBox project
lineage for the virtual package, process, Binder, filesystem, identity,
signature, component, and lifecycle foundation. FridaBox's own work builds a
separate instrumentation product on that foundation: early Gadget integration,
guest runtime discovery, controller tooling, per-app launch modes, integrity and
ABI validation, on-device agent execution, the FridaBox UI, and the associated
test and research documentation.

- NewBlackbox source: `https://github.com/ALEX5402/NewBlackbox`
- Pinned foundation revision:
  `https://github.com/ALEX5402/NewBlackbox/commit/89b59836c66f173756a4ae258cf379a957649820`

## Frida Gadget 17.16.0

- Origin: `https://github.com/frida/frida/releases/tag/17.16.0`
- Asset: `frida-gadget-17.16.0-android-arm64.so.xz`
- Installed filename: `libfrida-gadget.so`
- SHA-256 after XZ decompression:
  `6bf149e5d1c5ec701e7b822cab57bb243f1c2a03318fa974fe373ee711a9ed9e`
- License: wxWindows Library Licence, Version 3.1, as stated by the official
  Frida 17.16.0 `COPYING` file.

The wxWindows licence permits redistribution/modification under GNU Library
General Public Licence version 2 or later and includes an exception permitting
binary object code versions of works based on the library to be used, copied,
linked, modified, and distributed under the distributor's own terms. The full
authoritative text is available at
`https://github.com/frida/frida/blob/17.16.0/COPYING`.

Frida is copyright its respective contributors. FridaBox makes no claim of
ownership over Frida Gadget.

FridaBox gratefully acknowledges the Frida maintainers and contributors for the
instrumentation engine, GumJS runtime, Java bridge, Gadget deployment model, and
controller APIs that make this research possible.

## Tabler Icons

FridaBox UI control icons are generated from the official `@tabler/icons`
package version 3.45.0, sourced from `https://github.com/tabler/tabler-icons`.

MIT License

Copyright (c) 2020-2026 Paweł Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Frida Java and IL2CPP runtime bridges and agent compiler

The compiled JavaScript agents under `scripts/dist/` include
`frida-java-bridge` 7.0.13. They are built with `frida-compile` 19.0.5.
FridaBox also packages offline runtime-bridge bundles for Java 7.0.11 through
7.0.13 and `frida-il2cpp-bridge` 0.12.2 through 0.13.1. These optional bundles
are only composed into a private on-device agent when the user enables them.

- Java bridge origin: `https://github.com/frida/frida-java-bridge`
- IL2CPP bridge origin: `https://github.com/vfsfitvnm/frida-il2cpp-bridge`
- Compiler origin: `https://github.com/frida/frida-compile`
- Java bridge and compiler license: LGPL-2.0 with the wxWindows Library Licence
  3.1 exception, as declared by the respective official packages.
- IL2CPP bridge license: MIT, as declared by its package and repository.

The authoritative licence text and exception are the same wxWindows Library
Licence described above. Exact package versions and dependency integrity hashes
are preserved in `package-lock.json`.
