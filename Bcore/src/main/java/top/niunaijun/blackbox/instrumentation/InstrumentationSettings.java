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
    public static final String KEY_GADGET_PATH = "selected_gadget_path";
    public static final String KEY_GADGET_SOURCE = "selected_gadget_source";
    public static final String KEY_GADGET_VERSION = "selected_gadget_version";
    public static final String KEY_GADGET_ABI = "selected_gadget_abi";
    public static final String KEY_GADGET_SHA256 = "selected_gadget_sha256";
    public static final String KEY_JAVA_BRIDGE_ENABLED = "runtime_bridge_java_enabled";
    public static final String KEY_JAVA_BRIDGE_VERSION = "runtime_bridge_java_version";
    public static final String KEY_IL2CPP_BRIDGE_ENABLED = "runtime_bridge_il2cpp_enabled";
    public static final String KEY_IL2CPP_BRIDGE_VERSION = "runtime_bridge_il2cpp_version";
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

    public static String getSelectedGadgetPath() {
        return preferences().getString(KEY_GADGET_PATH, null);
    }

    public static String getSelectedGadgetSource() {
        return preferences().getString(KEY_GADGET_SOURCE, null);
    }

    public static String getSelectedGadgetVersion() {
        return preferences().getString(KEY_GADGET_VERSION, null);
    }

    public static String getSelectedGadgetAbi() {
        return preferences().getString(KEY_GADGET_ABI, null);
    }

    public static String getSelectedGadgetSha256() {
        return preferences().getString(KEY_GADGET_SHA256, null);
    }

    public static boolean setSelectedGadget(
            String path, String source, String version, String abi, String sha256) {
        if (path == null || path.trim().isEmpty()
                || source == null || source.trim().isEmpty()
                || version == null || version.trim().isEmpty()
                || abi == null || abi.trim().isEmpty()
                || sha256 == null || sha256.trim().isEmpty()) {
            return false;
        }
        return preferences().edit()
                .putString(KEY_GADGET_PATH, path)
                .putString(KEY_GADGET_SOURCE, source)
                .putString(KEY_GADGET_VERSION, version)
                .putString(KEY_GADGET_ABI, abi)
                .putString(KEY_GADGET_SHA256, sha256)
                .commit();
    }

    public static boolean clearSelectedGadget() {
        return preferences().edit()
                .remove(KEY_GADGET_PATH)
                .remove(KEY_GADGET_SOURCE)
                .remove(KEY_GADGET_VERSION)
                .remove(KEY_GADGET_ABI)
                .remove(KEY_GADGET_SHA256)
                .commit();
    }

    public static boolean isRuntimeBridgeEnabled(String bridgeId) {
        String key = runtimeBridgeEnabledKey(bridgeId);
        return key != null && preferences().getBoolean(key, false);
    }

    public static String getRuntimeBridgeVersion(String bridgeId, String fallback) {
        String key = runtimeBridgeVersionKey(bridgeId);
        return key == null ? fallback : preferences().getString(key, fallback);
    }

    public static boolean setRuntimeBridge(String bridgeId, boolean enabled, String version) {
        RuntimeBridgeCatalog.BridgeSpec spec = RuntimeBridgeCatalog.find(bridgeId);
        String enabledKey = runtimeBridgeEnabledKey(bridgeId);
        String versionKey = runtimeBridgeVersionKey(bridgeId);
        if (spec == null || !spec.supportsVersion(version) || enabledKey == null || versionKey == null) {
            return false;
        }
        return preferences().edit()
                .putBoolean(enabledKey, enabled)
                .putString(versionKey, version)
                .commit();
    }

    private static String runtimeBridgeEnabledKey(String bridgeId) {
        if (RuntimeBridgeCatalog.JAVA_ID.equals(bridgeId)) return KEY_JAVA_BRIDGE_ENABLED;
        if (RuntimeBridgeCatalog.IL2CPP_ID.equals(bridgeId)) return KEY_IL2CPP_BRIDGE_ENABLED;
        return null;
    }

    private static String runtimeBridgeVersionKey(String bridgeId) {
        if (RuntimeBridgeCatalog.JAVA_ID.equals(bridgeId)) return KEY_JAVA_BRIDGE_VERSION;
        if (RuntimeBridgeCatalog.IL2CPP_ID.equals(bridgeId)) return KEY_IL2CPP_BRIDGE_VERSION;
        return null;
    }

    static int clamp(int value, int minimum, int maximum, int fallback) {
        return value < minimum || value > maximum ? fallback : value;
    }
}
