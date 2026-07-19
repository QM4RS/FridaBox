'use strict';

import Java from 'frida-java-bridge';

Java.perform(() => {
  const registryName = 'top.niunaijun.blackbox.instrumentation.GuestRuntimeRegistry';
  let Registry = null;
  try {
    Registry = Java.use(registryName);
  } catch (_) {
    Java.enumerateClassLoaders({
      onMatch(loader) {
        if (Registry !== null) return;
        try {
          loader.loadClass(registryName);
          Registry = Java.ClassFactory.get(loader).use(registryName);
        } catch (_) {}
      },
      onComplete() {}
    });
  }
  if (Registry === null) throw new Error('GuestRuntimeRegistry ClassLoader was not found');
  const loader = Registry.getGuestClassLoader();
  if (loader === null) throw new Error('GuestRuntimeRegistry has no guest ClassLoader');
  Java.classFactory.loader = loader;
  const Target = Java.use('com.qm4rs.fridabox.sample.Target');
  const add = Target.add.overload('int', 'int');
  add.implementation = function (a, b) {
    console.log('[sample-hook] Target.add(' + a + ', ' + b + ') => 1337');
    return 1337;
  };
  console.log('[sample-hook] installed for ' + Registry.getGuestPackageName());
});
