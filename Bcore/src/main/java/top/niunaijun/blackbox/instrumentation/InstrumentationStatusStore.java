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
        String mode = InstrumentationSettings.getModeForPackage(packageName);
        String state;
        if (!GuestRuntimeRegistry.isInstrumentationEnabled()) {
            state = "disabled";
        } else if (InstrumentationSettings.MODE_LOCAL_SCRIPT.equals(mode)) {
            state = "loading_local_script";
        } else {
            state = "waiting_for_attach";
        }
        preferences().edit()
                .putString("runtime_package", packageName)
                .putString("runtime_process", GuestRuntimeRegistry.getGuestProcessName())
                .putInt("runtime_user_id", GuestRuntimeRegistry.getGuestUserId())
                .putInt("runtime_vpid", GuestRuntimeRegistry.getVirtualProcessId())
                .putString("runtime_source", GuestRuntimeRegistry.getGuestSourceDir())
                .putString("runtime_class_loader", classLoaderDescription())
                .putBoolean("runtime_enabled", GuestRuntimeRegistry.isInstrumentationEnabled())
                .putString("runtime_mode", mode)
                .putString("runtime_script", InstrumentationSettings.getScriptPathForPackage(packageName))
                .putString("runtime_state", state)
                .putString("runtime_error", null)
                .putLong("runtime_timestamp", GuestRuntimeRegistry.getInitializationTimestamp())
                .commit();
    }

    private static String classLoaderDescription() {
        ClassLoader loader = GuestRuntimeRegistry.getGuestClassLoader();
        if (loader == null) return null;
        return loader.getClass().getName() + "@" + Integer.toHexString(System.identityHashCode(loader));
    }

    public static void recordLoaded() {
        String mode = preferences().getString("runtime_mode", InstrumentationSettings.MODE_COMPUTER);
        String state = InstrumentationSettings.MODE_LOCAL_SCRIPT.equals(mode)
                ? "local_script_active" : "computer_attached";
        preferences().edit().putString("runtime_state", state).putString("runtime_error", null).commit();
    }

    public static void recordError(String error) {
        preferences().edit().putString("runtime_state", "failed").putString("runtime_error", error).commit();
    }
}
