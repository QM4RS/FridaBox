# Frida connection

Install the pinned controller binding:

```text
python -m pip install -r tools/requirements.txt
npm ci
python tools/build_frida_agents.py
```

The Gadget listens only on device loopback. The controller verifies ADB, selects
an authorized device, forwards TCP 27042–27073, probes each endpoint, rejects
non-Gadget/non-FridaBox endpoints, and maps endpoints through
`GuestRuntimeRegistry`.

Frida 17 Java agents explicitly import `frida-java-bridge`. The controller
loads the compiled probe/bootstrap from `scripts/dist/`; when a source path such
as `scripts/sample-hook.js` has a compiled counterpart, that bundle is selected
automatically.

```text
python tools/attach_guest.py --list
python tools/attach_guest.py --package PACKAGE
python tools/attach_guest.py --package PACKAGE --process PROCESS
python tools/attach_guest.py --package PACKAGE --script scripts/example.js
python tools/attach_guest.py --package PACKAGE --script scripts/example.js --keep-alive
```

`guest-bootstrap.js` loads before the user script and assigns the registry's
guest ClassLoader to `Java.classFactory.loader`. Its RPC exports are `info`,
`useclass`, `enumerateloadedclasses`, and `enumeratemodules`. It retries for a
bounded ten seconds when the ClassLoader is temporarily unavailable.
The controller prints the registry JSON, selected ClassLoader, and native-module
enumeration before loading the user script.

## On-device mode

Computer-side forwarding and controller tools are not used in On-device mode.
FridaBox creates a private Gadget copy with an adjacent Script-interaction
configuration and a relative `agent.js` path. Gadget loads that script before
returning to guest Application creation. The selected script is stored per
package and reused automatically until it is replaced or the guest is removed.

Use Computer mode when the script needs an interactive host, RPC calls, or
observable `send()` messages. Use On-device mode for autonomous hooks and
in-process behavior.

Use `tools/forward_frida_ports.py` when only port forwarding is needed. A client
major-version mismatch prints the exact `pip install frida==17.16.0` repair
command.
