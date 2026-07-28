package top.niunaijun.blackbox.instrumentation;

import android.content.Context;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/** Offline, build-pinned runtime bridges available to autonomous Frida agents. */
public final class RuntimeBridgeCatalog {
    public static final String JAVA_ID = "java";
    public static final String IL2CPP_ID = "il2cpp";
    public static final String MINIMUM_GADGET_VERSION = "17.0.0";

    private static final int MAX_BUNDLE_BYTES = 2 * 1024 * 1024;
    private static final List<BridgeSpec> SPECS = Collections.unmodifiableList(Arrays.asList(
            new BridgeSpec(
                    JAVA_ID,
                    "Java",
                    "Official Frida runtime bridge",
                    "7.0.13",
                    new String[]{"7.0.13", "7.0.12", "7.0.11"}),
            new BridgeSpec(
                    IL2CPP_ID,
                    "IL2CPP",
                    "Community bridge for Unity IL2CPP",
                    "0.13.1",
                    new String[]{"0.13.1", "0.13.0", "0.12.2"})
    ));

    private RuntimeBridgeCatalog() {
    }

    public static List<BridgeSpec> specs() {
        return SPECS;
    }

    public static BridgeSpec find(String id) {
        for (BridgeSpec spec : SPECS) {
            if (spec.id.equals(id)) return spec;
        }
        return null;
    }

    public static boolean supportsRuntimeBridges(String gadgetVersion) {
        int[] parsed = parseVersion(gadgetVersion);
        return parsed != null && parsed[0] >= 17;
    }

    public static String selectedVersion(BridgeSpec spec) {
        String selected = InstrumentationSettings.getRuntimeBridgeVersion(spec.id, spec.defaultVersion);
        return spec.supportsVersion(selected) ? selected : spec.defaultVersion;
    }

    static List<byte[]> loadEnabledBundles(Context context, String gadgetVersion) throws IOException {
        if (!supportsRuntimeBridges(gadgetVersion)) return Collections.emptyList();
        List<byte[]> bundles = new ArrayList<>();
        for (BridgeSpec spec : SPECS) {
            if (!InstrumentationSettings.isRuntimeBridgeEnabled(spec.id)) continue;
            String version = selectedVersion(spec);
            String asset = "fridabox/bridges/" + spec.id + "-" + version + ".js";
            try (InputStream input = context.getAssets().open(asset)) {
                bundles.add(readLimited(input));
            } catch (IOException error) {
                throw new IOException("Runtime bridge asset is unavailable: " + spec.id + " " + version, error);
            }
        }
        return bundles;
    }

    private static byte[] readLimited(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[32 * 1024];
        int total = 0;
        int count;
        while ((count = input.read(buffer)) >= 0) {
            total += count;
            if (total > MAX_BUNDLE_BYTES) throw new IOException("Runtime bridge bundle is unexpectedly large");
            output.write(buffer, 0, count);
        }
        if (total == 0) throw new IOException("Runtime bridge bundle is empty");
        return output.toByteArray();
    }

    static int[] parseVersion(String value) {
        if (value == null) return null;
        String normalized = value.trim();
        if (normalized.startsWith("v") || normalized.startsWith("V")) normalized = normalized.substring(1);
        String[] parts = normalized.split("[.-]", 4);
        if (parts.length < 1 || parts.length > 4) return null;
        int[] result = new int[]{0, 0, 0};
        try {
            for (int index = 0; index < Math.min(3, parts.length); index++) {
                if (parts[index].isEmpty()) return null;
                result[index] = Integer.parseInt(parts[index]);
                if (result[index] < 0) return null;
            }
            return result;
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    public static final class BridgeSpec {
        public final String id;
        public final String title;
        public final String description;
        public final String defaultVersion;
        private final List<String> versions;

        BridgeSpec(String id, String title, String description, String defaultVersion, String[] versions) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.defaultVersion = defaultVersion;
            this.versions = Collections.unmodifiableList(Arrays.asList(versions.clone()));
        }

        public List<String> versions() {
            return versions;
        }

        public boolean supportsVersion(String version) {
            return version != null && versions.contains(version);
        }
    }
}
