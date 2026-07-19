package top.niunaijun.blackbox.instrumentation;

import android.content.pm.ApplicationInfo;

/** Process-local guest metadata exposed to Frida scripts. */
public final class GuestRuntimeRegistry {
    private static volatile String guestPackageName;
    private static volatile String guestProcessName;
    private static volatile int guestUserId = -1;
    private static volatile int virtualProcessId = -1;
    private static volatile ApplicationInfo guestApplicationInfo;
    private static volatile ClassLoader guestClassLoader;
    private static volatile String guestSourceDir;
    private static volatile boolean instrumentationEnabled;
    private static volatile String lastError;
    private static volatile long initializationTimestamp;

    private GuestRuntimeRegistry() {
    }

    public static synchronized void initialize(String packageName, String processName,
                                               int userId, int processId,
                                               ApplicationInfo applicationInfo,
                                               ClassLoader classLoader,
                                               boolean enabled) {
        guestPackageName = packageName;
        guestProcessName = processName;
        guestUserId = userId;
        virtualProcessId = processId;
        guestApplicationInfo = applicationInfo;
        guestClassLoader = classLoader;
        guestSourceDir = applicationInfo == null ? null : applicationInfo.sourceDir;
        instrumentationEnabled = enabled;
        lastError = null;
        initializationTimestamp = System.currentTimeMillis();
    }

    public static synchronized void clear() {
        guestPackageName = null;
        guestProcessName = null;
        guestUserId = -1;
        virtualProcessId = -1;
        guestApplicationInfo = null;
        guestClassLoader = null;
        guestSourceDir = null;
        instrumentationEnabled = false;
        lastError = null;
        initializationTimestamp = 0L;
    }

    public static String getGuestPackageName() { return guestPackageName; }
    public static String getGuestProcessName() { return guestProcessName; }
    public static int getGuestUserId() { return guestUserId; }
    public static int getVirtualProcessId() { return virtualProcessId; }
    public static ApplicationInfo getGuestApplicationInfo() { return guestApplicationInfo; }
    public static ClassLoader getGuestClassLoader() { return guestClassLoader; }
    public static String getGuestSourceDir() { return guestSourceDir; }
    public static boolean isInstrumentationEnabled() { return instrumentationEnabled; }
    public static String getLastError() { return lastError; }
    public static long getInitializationTimestamp() { return initializationTimestamp; }

    public static void setLastError(Throwable error) {
        lastError = error == null ? null : error.getClass().getSimpleName() + ": " + error.getMessage();
    }

    public static void setLastError(String error) {
        lastError = error;
    }

    private static String quote(String value) {
        if (value == null) return "null";
        return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r") + "\"";
    }

    public static String describe() {
        return "{" +
                "\"package\":" + quote(guestPackageName) + ',' +
                "\"process\":" + quote(guestProcessName) + ',' +
                "\"userId\":" + guestUserId + ',' +
                "\"virtualProcessId\":" + virtualProcessId + ',' +
                "\"sourceDir\":" + quote(guestSourceDir) + ',' +
                "\"instrumentationEnabled\":" + instrumentationEnabled + ',' +
                "\"lastError\":" + quote(lastError) + ',' +
                "\"initializedAt\":" + initializationTimestamp +
                '}';
    }
}
