package top.niunaijun.blackbox.utils;

import android.content.Context;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Locale;

/** Detects the ABI of the current host process instead of the device's preferred ABI. */
public final class ProcessAbi {
    private static final String HOST_LIBRARY = "libblackbox.so";

    private ProcessAbi() {
    }

    public static String detect(Context context) {
        if (context != null && context.getApplicationInfo() != null) {
            String nativeLibraryDir = context.getApplicationInfo().nativeLibraryDir;
            if (nativeLibraryDir != null && !nativeLibraryDir.trim().isEmpty()) {
                String abi = fromElf(new File(nativeLibraryDir, HOST_LIBRARY));
                if (abi != null) return abi;
            }
        }
        return fromOsArch(System.getProperty("os.arch"));
    }

    public static String fromElf(File file) {
        if (file == null || !file.isFile()) return null;
        byte[] header = new byte[20];
        try (FileInputStream input = new FileInputStream(file)) {
            if (input.read(header) != header.length) return null;
            return fromElfHeader(header);
        } catch (IOException ignored) {
            return null;
        }
    }

    static String fromElfHeader(byte[] header) {
        if (header == null || header.length < 20
                || (header[0] & 0xff) != 0x7f || header[1] != 'E'
                || header[2] != 'L' || header[3] != 'F' || header[5] != 1) {
            return null;
        }
        int elfClass = header[4] & 0xff;
        int machine = (header[18] & 0xff) | ((header[19] & 0xff) << 8);
        if (elfClass == 2 && machine == 183) return "arm64-v8a";
        if (elfClass == 1 && machine == 40) return "armeabi-v7a";
        if (elfClass == 2 && machine == 62) return "x86_64";
        if (elfClass == 1 && machine == 3) return "x86";
        return null;
    }

    public static String fromOsArch(String value) {
        if (value == null) return null;
        String arch = value.trim().toLowerCase(Locale.ROOT);
        if ("aarch64".equals(arch) || "arm64".equals(arch) || "arm64-v8a".equals(arch)) {
            return "arm64-v8a";
        }
        if ("arm".equals(arch) || "armeabi-v7a".equals(arch) || arch.startsWith("armv7")) {
            return "armeabi-v7a";
        }
        if ("x86_64".equals(arch) || "amd64".equals(arch)) return "x86_64";
        if ("x86".equals(arch) || arch.matches("i[3-6]86")) return "x86";
        return null;
    }

    public static boolean is64Bit(String abi) {
        return "arm64-v8a".equals(abi) || "x86_64".equals(abi);
    }
}
