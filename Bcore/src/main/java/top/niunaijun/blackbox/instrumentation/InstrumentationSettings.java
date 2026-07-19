package top.niunaijun.blackbox.instrumentation;

import android.content.Context;
import android.content.SharedPreferences;

import top.niunaijun.blackbox.BlackBoxCore;

/** Shared host preferences read independently by each virtual process. */
public final class InstrumentationSettings {
    public static final String PREFERENCES = "fridabox_instrumentation";
    public static final String KEY_ENABLED = "instrumentation_enabled";
    public static final String KEY_BASE_PORT = "frida_base_port";
    public static final String KEY_SCAN_COUNT = "frida_port_scan_count";
    public static final String KEY_ADVANCED_LOGS = "show_advanced_logs";
    private static final String PACKAGE_PREFIX = "package_enabled_";
    private static final String PACKAGE_MODE_PREFIX = "package_mode_";
    private static final String PACKAGE_SCRIPT_PREFIX = "package_script_";

    public static final String MODE_COMPUTER = "computer";
    public static final String MODE_LOCAL_SCRIPT = "local_script";
    public static final String MODE_CLEAN = "clean";

    private InstrumentationSettings() {
    }

    private static SharedPreferences preferences() {
        Context context = BlackBoxCore.getContext();
        return context.getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
    }

    public static boolean isGloballyEnabled() {
        return preferences().getBoolean(KEY_ENABLED, true);
    }

    public static boolean isEnabledForPackage(String packageName) {
        return preferences().getBoolean(KEY_ENABLED, true)
                && !MODE_CLEAN.equals(getModeForPackage(packageName));
    }

    public static void setEnabledForPackage(String packageName, boolean enabled) {
        setModeForPackage(packageName, enabled ? MODE_COMPUTER : MODE_CLEAN);
    }

    public static String getModeForPackage(String packageName) {
        SharedPreferences preferences = preferences();
        String mode = preferences.getString(PACKAGE_MODE_PREFIX + packageName, null);
        if (isValidMode(mode)) return mode;
        return preferences.getBoolean(PACKAGE_PREFIX + packageName, true)
                ? MODE_COMPUTER : MODE_CLEAN;
    }

    public static void setModeForPackage(String packageName, String mode) {
        String safeMode = isValidMode(mode) ? mode : MODE_COMPUTER;
        preferences().edit()
                .putString(PACKAGE_MODE_PREFIX + packageName, safeMode)
                .putBoolean(PACKAGE_PREFIX + packageName, !MODE_CLEAN.equals(safeMode))
                .commit();
    }

    public static String getScriptPathForPackage(String packageName) {
        return preferences().getString(PACKAGE_SCRIPT_PREFIX + packageName, null);
    }

    public static void setScriptPathForPackage(String packageName, String path) {
        SharedPreferences.Editor editor = preferences().edit();
        if (path == null || path.trim().isEmpty()) {
            editor.remove(PACKAGE_SCRIPT_PREFIX + packageName);
        } else {
            editor.putString(PACKAGE_SCRIPT_PREFIX + packageName, path);
        }
        editor.commit();
    }

    public static void clearPackage(String packageName) {
        preferences().edit()
                .remove(PACKAGE_PREFIX + packageName)
                .remove(PACKAGE_MODE_PREFIX + packageName)
                .remove(PACKAGE_SCRIPT_PREFIX + packageName)
                .commit();
    }

    private static boolean isValidMode(String mode) {
        return MODE_COMPUTER.equals(mode)
                || MODE_LOCAL_SCRIPT.equals(mode)
                || MODE_CLEAN.equals(mode);
    }

    public static int getBasePort() {
        return clamp(preferences().getInt(KEY_BASE_PORT, 27042), 1024, 65535, 27042);
    }

    public static int getPortScanCount() {
        return clamp(preferences().getInt(KEY_SCAN_COUNT, 32), 1, 128, 32);
    }

    public static boolean showAdvancedLogs() {
        return preferences().getBoolean(KEY_ADVANCED_LOGS, false);
    }

    static int clamp(int value, int minimum, int maximum, int fallback) {
        return value < minimum || value > maximum ? fallback : value;
    }
}
