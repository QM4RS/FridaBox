# Third-party notices

## NewBlackbox / BlackBox

FridaBox is based on `ALEX5402/NewBlackbox` commit
`89b59836c66f173756a4ae258cf379a957649820`. The foundation repository includes
an Apache License 2.0 notice; see the repository root `LICENSE` file.

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

## Frida Java bridge and agent compiler

The compiled JavaScript agents under `scripts/dist/` include
`frida-java-bridge` 7.0.13. They are built with `frida-compile` 19.0.5.

- Java bridge origin: `https://github.com/frida/frida-java-bridge`
- Compiler origin: `https://github.com/frida/frida-compile`
- License: LGPL-2.0 with the wxWindows Library Licence 3.1 exception, as
  declared by the respective official packages.

The authoritative licence text and exception are the same wxWindows Library
Licence described above. Exact package versions and dependency integrity hashes
are preserved in `package-lock.json`.
