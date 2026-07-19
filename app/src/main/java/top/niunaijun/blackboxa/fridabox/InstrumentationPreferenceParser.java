package top.niunaijun.blackboxa.fridabox;

public final class InstrumentationPreferenceParser {
    private InstrumentationPreferenceParser() {
    }

    public static int parsePort(String text, int fallback) {
        return parseRange(text, 1024, 65535, fallback);
    }

    public static int parseScanCount(String text, int fallback) {
        return parseRange(text, 1, 128, fallback);
    }

    private static int parseRange(String text, int minimum, int maximum, int fallback) {
        try {
            int value = Integer.parseInt(text == null ? "" : text.trim());
            return value >= minimum && value <= maximum ? value : fallback;
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }
}
