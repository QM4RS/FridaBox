'use strict';

import Java from 'frida-java-bridge';

Java.performNow(function () {
  try {
    const name = 'top.niunaijun.blackbox.instrumentation.GuestRuntimeRegistry';
    let Registry = null;
    try {
      Registry = Java.use(name);
    } catch (_) {
      Java.enumerateClassLoaders({
        onMatch(loader) {
          if (Registry !== null) return;
          try {
            loader.loadClass(name);
            Registry = Java.ClassFactory.get(loader).use(name);
          } catch (_) {}
        },
        onComplete() {}
      });
    }
    if (Registry === null) throw new Error('GuestRuntimeRegistry ClassLoader was not found');
    send({kind: 'fridabox-registry', value: Registry.describe()});
  } catch (error) {
    send({kind: 'fridabox-error', value: String(error.stack || error)});
  }
});
