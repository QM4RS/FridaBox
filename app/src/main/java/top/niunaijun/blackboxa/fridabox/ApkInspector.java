package top.niunaijun.blackboxa.fridabox;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public final class ApkInspector {
    private ApkInspector() {
    }

    public static Result inspect(File apk) throws IOException {
        Set<String> abis = new LinkedHashSet<>();
        boolean hasNativeLibraries = false;
        try (ZipFile archive = new ZipFile(apk)) {
            if (archive.getEntry("AndroidManifest.xml") == null) {
                throw new IOException("The selected file has no AndroidManifest.xml");
            }
            for (ZipEntry entry : Collections.list(archive.entries())) {
                String name = entry.getName();
                if (!entry.isDirectory() && name.startsWith("lib/") && name.endsWith(".so")) {
                    String[] parts = name.split("/", 3);
                    if (parts.length == 3) {
                        hasNativeLibraries = true;
                        abis.add(parts[1]);
                    }
                }
            }
        }
        boolean supported = !hasNativeLibraries || abis.contains("arm64-v8a");
        return new Result(hasNativeLibraries, supported, abis);
    }

    public static final class Result {
        public final boolean hasNativeLibraries;
        public final boolean supported;
        public final Set<String> abis;

        Result(boolean hasNativeLibraries, boolean supported, Set<String> abis) {
            this.hasNativeLibraries = hasNativeLibraries;
            this.supported = supported;
            this.abis = Collections.unmodifiableSet(new LinkedHashSet<>(abis));
        }

        public String description() {
            if (!hasNativeLibraries) return "Pure Java/Kotlin (accepted)";
            return supported ? "ARM64 supported: " + abis : "Rejected; no arm64-v8a: " + abis;
        }
    }
}
