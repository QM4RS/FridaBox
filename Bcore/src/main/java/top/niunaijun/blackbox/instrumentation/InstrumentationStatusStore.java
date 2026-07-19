package top.niunaijun.blackbox.instrumentation;

import android.content.Context;
import android.content.SharedPreferences;

import top.niunaijun.blackbox.BlackBoxCore;

/** Small cross-process status snapshot for the host runtime screen. */
public final class InstrumentationStatusStore {
    private InstrumentationStatusStore() {
    }

    private static SharedPreferences preferences() {
        return BlackBoxCore.getContext().getSharedPreferences(
                InstrumentationSettings.PREFERENCES, Context.MODE_PRIVATE);
    }

    public static void recordBinding() {
        String packageName = GuestRuntimeRegistry.getGuestPackageName();
        preferences().edit()
                .putString("runtime_package", packageName)
                .putString("runtime_process", GuestRuntimeRegistry.getGuestProcessName())
                .putInt("runtime_vpid", GuestRuntimeRegistry.getVirtualProcessId())
                .putString("runtime_source", GuestRuntimeRegistry.getGuestSourceDir())
                .putBoolean("runtime_enabled", GuestRuntimeRegistry.isInstrumentationEnabled())
                .putString("runtime_state", GuestRuntimeRegistry.isInstrumentationEnabled()
                        ? "waiting_for_attach" : "disabled")
                .putString("runtime_error", null)
                .putLong("runtime_timestamp", GuestRuntimeRegistry.getInitializationTimestamp())
                .commit();
    }

    public static void recordLoaded() {
        preferences().edit().putString("runtime_state", "loaded").putString("runtime_error", null).commit();
    }

    public static void recordError(String error) {
        preferences().edit().putString("runtime_state", "failed").putString("runtime_error", error).commit();
    }
}
