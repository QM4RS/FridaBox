package top.niunaijun.blackbox.instrumentation;

import android.util.Log;

import java.util.concurrent.atomic.AtomicBoolean;

/** Loads Frida Gadget at most once in the current Linux process. */
public final class FridaGadgetLoader {
    private static final String TAG = "FridaBox.Gadget";
    private static final AtomicBoolean ATTEMPTED = new AtomicBoolean(false);
    private static final Object LOAD_LOCK = new Object();
    private static volatile boolean loaded;

    private FridaGadgetLoader() {
    }

    public static boolean loadIfEnabled() {
        if (!GuestRuntimeRegistry.isInstrumentationEnabled()) {
            Log.i(TAG, "Instrumentation disabled for this guest process");
            return false;
        }
        if (loaded) return true;
        synchronized (LOAD_LOCK) {
            if (loaded) return true;
            if (!ATTEMPTED.compareAndSet(false, true)) return false;
            try {
                InstrumentationStatusStore.recordBinding();
                Log.i(TAG, "Loading Frida Gadget for " + GuestRuntimeRegistry.getGuestProcessName());
                System.loadLibrary("frida-gadget");
                loaded = true;
                InstrumentationStatusStore.recordLoaded();
                Log.i(TAG, "Frida Gadget loaded");
                return true;
            } catch (UnsatisfiedLinkError | SecurityException error) {
                GuestRuntimeRegistry.setLastError(error);
                InstrumentationStatusStore.recordError(GuestRuntimeRegistry.getLastError());
                Log.e(TAG, "Frida Gadget load failed; guest will continue", error);
            } catch (Throwable error) {
                GuestRuntimeRegistry.setLastError(error);
                InstrumentationStatusStore.recordError(GuestRuntimeRegistry.getLastError());
                Log.e(TAG, "Unexpected Frida Gadget initialization failure; guest will continue", error);
            }
            return false;
        }
    }

    public static boolean isLoaded() {
        return loaded;
    }
}
