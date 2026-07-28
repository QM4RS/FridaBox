package com.qm4rs.fridabox;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

public final class ApkInspector {
    private ApkInspector() {
    }

    public static Result inspect(File apk) throws IOException {
        return inspect(Collections.singletonList(apk), null);
    }

    public static Result inspect(File... apks) throws IOException {
        return inspect(Arrays.asList(apks), null);
    }

    public static Result inspect(Iterable<File> apks) throws IOException {
        return inspect(apks, null);
    }

    public static Result inspect(Iterable<File> apks, String processAbi) throws IOException {
        Set<String> abis = new LinkedHashSet<>();
        boolean hasNativeLibraries = false;
        boolean inspectedAny = false;
        for (File apk : apks) {
            inspectedAny = true;
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
        }
        if (!inspectedAny) throw new IOException("No APK files were provided");
        boolean supported = !hasNativeLibraries || supportsProcessAbi(abis, processAbi);
        return new Result(hasNativeLibraries, supported, abis, processAbi);
    }

    public static final class Result {
        public final boolean hasNativeLibraries;
        public final boolean supported;
        public final Set<String> abis;
        public final String processAbi;

        Result(boolean hasNativeLibraries, boolean supported, Set<String> abis, String processAbi) {
            this.hasNativeLibraries = hasNativeLibraries;
            this.supported = supported;
            this.abis = Collections.unmodifiableSet(new LinkedHashSet<>(abis));
            this.processAbi = processAbi;
        }

        public String description() {
            if (!hasNativeLibraries) return "Pure Java/Kotlin (accepted)";
            if (processAbi == null) {
                return !Collections.disjoint(abis, SUPPORTED_ABIS)
                        ? "Recognized ABI: " + abis : "Rejected; unsupported ABI: " + abis;
            }
            return supported ? "Compatible with " + processAbi + ": " + abis
                    : "Rejected; requires " + processAbi + ", found: " + abis;
        }
    }

    private static boolean supportsProcessAbi(Set<String> abis, String processAbi) {
        if ("armeabi-v7a".equals(processAbi)) {
            return abis.contains("armeabi-v7a") || abis.contains("armeabi");
        }
        return processAbi != null && abis.contains(processAbi);
    }

    private static final Set<String> SUPPORTED_ABIS = Collections.unmodifiableSet(new LinkedHashSet<>(Arrays.asList(
            "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
    )));
}
