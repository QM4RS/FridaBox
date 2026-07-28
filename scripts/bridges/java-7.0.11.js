'use strict';

import JavaBridge from 'frida-java-bridge-7-0-11';

if (typeof globalThis.Java === 'undefined') globalThis.Java = JavaBridge;
