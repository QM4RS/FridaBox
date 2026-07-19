'use strict';

const seen = new Set();

function report(module) {
  if (seen.has(module.path)) return;
  seen.add(module.path);
  console.log('[native-load] ' + module.name + ' base=' + module.base + ' path=' + module.path);
  if (typeof globalThis.onGuestModuleLoaded === 'function') {
    try { globalThis.onGuestModuleLoaded(module); } catch (error) { console.error(error.stack || error); }
  }
}

Process.enumerateModules().forEach(report);
Process.attachModuleObserver({ onAdded: report, onRemoved() {} });

['dlopen', 'android_dlopen_ext'].forEach(name => {
  const address = Module.findGlobalExportByName(name);
  if (address === null) return;
  Interceptor.attach(address, {
    onEnter(args) { this.path = args[0].isNull() ? null : args[0].readCString(); },
    onLeave(result) {
      if (this.path !== null) console.log('[' + name + '] ' + this.path + ' => ' + result);
    }
  });
});
