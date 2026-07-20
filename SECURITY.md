# Security policy

## Supported version

FridaBox 4.x is the actively maintained research line. Older inherited launcher
versions are not supported.

## Reporting a vulnerability

Please use GitHub's private **Report a vulnerability** security-advisory flow for
this repository when it is available. Do not open a public issue for a flaw that
could expose imported APKs, JavaScript agents, device data, signing material, or
an unintended network listener.

Include:

- affected commit/version and Android build;
- device model, ABI, and ROM/vendor information;
- a minimal reproduction using an APK you are allowed to share;
- impact and the crossed trust boundary;
- sanitized logs or a small proof of concept;
- whether the issue reproduces in On-device, Computer, Clean, or all modes.

Please allow reasonable time for validation and a coordinated fix before public
disclosure.

## Security model

- FridaBox processes APKs and JavaScript selected explicitly by the user.
- Imported APKs and on-device agents are untrusted code and execute inside the
  host application's Android security boundary.
- On-device agents have the same effective access as their virtual guest process.
- Gadget is configured for device loopback. ADB forwarding is an explicit
  computer-side action.
- Private files reduce accidental exposure but do not create a hardware-backed
  isolation boundary between the host, guest, and agent.
- FridaBox is not designed to hide from a hostile guest, kernel inspection,
  SELinux inspection, Play Integrity, hardware attestation, or advanced RASP.

## Responsible use

Use FridaBox only on software and devices you own or are explicitly authorized
to assess. The maintainers do not support credential theft, unauthorized access,
surveillance, malware deployment, piracy, or bypassing protections outside a
lawful research or defensive-testing scope.
