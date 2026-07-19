'use strict';

import Java from 'frida-java-bridge';

const REGISTRY = 'top.niunaijun.blackbox.instrumentation.GuestRuntimeRegistry';
const MAX_ATTEMPTS = 40;
const RETRY_MS = 250;
let registry = null;
let guestLoader = null;

function findRegistry() {
  try {
    return Java.use(REGISTRY);
  } catch (_) {
    let found = null;
    Java.enumerateClassLoaders({
      onMatch(loader) {
        if (found !== null) return;
        try {
          loader.loadClass(REGISTRY);
          const factory = Java.ClassFactory.get(loader);
          found = factory.use(REGISTRY);
        } catch (_) {}
      },
      onComplete() {}
    });
    return found;
  }
}

function bootstrap(attempt) {
  Java.perform(() => {
    registry = findRegistry();
    if (registry !== null) {
      guestLoader = registry.getGuestClassLoader();
      if (guestLoader !== null) {
        Java.classFactory.loader = guestLoader;
        console.log('[FridaBox] package=' + registry.getGuestPackageName());
        console.log('[FridaBox] process=' + registry.getGuestProcessName());
        console.log('[FridaBox] userId=' + registry.getGuestUserId());
        console.log('[FridaBox] virtualProcessId=' + registry.getVirtualProcessId());
        console.log('[FridaBox] source=' + registry.getGuestSourceDir());
        console.log('[FridaBox] ClassLoader=' + guestLoader.toString());
        return;
      }
    }
    if (attempt + 1 < MAX_ATTEMPTS) {
      setTimeout(() => bootstrap(attempt + 1), RETRY_MS);
    } else {
      console.error('[FridaBox] guest ClassLoader unavailable after ' + (MAX_ATTEMPTS * RETRY_MS) + ' ms');
    }
  });
}

bootstrap(0);

rpc.exports = {
  info() {
    return Java.performNow(() => registry === null ? { error: 'registry unavailable' } : JSON.parse(registry.describe()));
  },
  useclass(className) {
    return Java.performNow(() => {
      if (guestLoader === null) throw new Error('guest ClassLoader is not ready');
      Java.classFactory.loader = guestLoader;
      return Java.use(className).$className;
    });
  },
  enumerateloadedclasses(prefix) {
    const match = prefix || '';
    return Java.performNow(() => Java.enumerateLoadedClassesSync().filter(name => name.indexOf(match) === 0));
  },
  enumeratemodules() {
    return Process.enumerateModules().map(module => ({ name: module.name, base: module.base.toString(), path: module.path }));
  }
};
