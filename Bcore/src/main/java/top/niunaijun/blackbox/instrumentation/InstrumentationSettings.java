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
        SharedPreferences preferences = preferences();
        return preferences.getBoolean(KEY_ENABLED, true)
                && preferences.getBoolean(PACKAGE_PREFIX + packageName, true);
    }

    public static void setEnabledForPackage(String packageName, boolean enabled) {
        preferences().edit().putBoolean(PACKAGE_PREFIX + packageName, enabled).commit();
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
