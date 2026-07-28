package top.niunaijun.blackbox.instrumentation;

import android.content.Context;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import top.niunaijun.blackbox.BlackBoxCore;
import top.niunaijun.blackbox.utils.ProcessAbi;

/** Resolves a selected, downloaded Gadget and prepares per-guest runtime copies. */
final class DownloadedGadgetRuntime {
    private static final String DOWNLOAD_ROOT = "fridabox-gadgets";
    private static final String RUNTIME_ROOT = "fridabox-gadget-runtimes";
    private static final String RUNTIME_NAME = "libpayload.so";
    private static final String CONFIG_NAME = "libpayload.config.so";
    private static final String SOURCE_NAME = "payload.source";

    private DownloadedGadgetRuntime() {
    }

    static File prepareListener(String packageName) throws IOException {
        Context context = BlackBoxCore.getContext();
        File source = requireSelected(context);
        File directory = new File(context.getFilesDir(),
                RUNTIME_ROOT + File.separator + safeName(packageName));
        if (!directory.isDirectory() && !directory.mkdirs()) {
            throw new IOException("Unable to create the Gadget runtime directory");
        }
        File runtime = new File(directory, RUNTIME_NAME);
        syncSelected(source, runtime);
        writeUtf8Atomically(new File(directory, CONFIG_NAME), listenerConfig());
        return runtime;
    }

    static File requireSelected(Context context) throws IOException {
        String selectedPath = InstrumentationSettings.getSelectedGadgetPath();
        String selectedAbi = InstrumentationSettings.getSelectedGadgetAbi();
        if (selectedPath == null || selectedPath.trim().isEmpty()) {
            throw new IOException("No downloaded Frida Gadget is selected");
        }
        File root = new File(context.getFilesDir(), DOWNLOAD_ROOT).getCanonicalFile();
        File selected = new File(selectedPath).getCanonicalFile();
        if (!isInside(root, selected) || !selected.isFile()) {
            throw new IOException("The selected Frida Gadget is missing or outside private storage");
        }
        if (!supportsAbi(context, selectedAbi)) {
            throw new IOException("The selected Frida Gadget ABI does not match this process");
        }
        validateElf(selected, selectedAbi);
        return selected;
    }

    static void syncSelected(File source, File destination) throws IOException {
        String identity = source.getCanonicalPath() + "\n"
                + String.valueOf(InstrumentationSettings.getSelectedGadgetSha256()) + "\n";
        File marker = new File(destination.getParentFile(), SOURCE_NAME);
        if (!destination.isFile() || destination.length() != source.length()
                || !identity.equals(readUtf8(marker))) {
            copyAtomically(source, destination);
            writeUtf8Atomically(marker, identity);
        }
        if (!destination.setReadable(true, false)
                || !destination.setExecutable(true, false)
                || !destination.setWritable(false, false)) {
            throw new IOException("Unable to secure the private Frida Gadget runtime");
        }
    }

    private static String listenerConfig() {
        return "{\n" +
                "  \"interaction\": {\n" +
                "    \"type\": \"listen\",\n" +
                "    \"address\": \"127.0.0.1\",\n" +
                "    \"port\": " + InstrumentationSettings.getBasePort() + ",\n" +
                "    \"on_port_conflict\": \"pick-next\",\n" +
                "    \"on_load\": \"wait\"\n" +
                "  },\n" +
                "  \"runtime\": \"qjs\",\n" +
                "  \"teardown\": \"minimal\"\n" +
                "}\n";
    }

    private static void validateElf(File file, String abi) throws IOException {
        byte[] header = new byte[20];
        try (FileInputStream input = new FileInputStream(file)) {
            if (input.read(header) != header.length) throw new IOException("Downloaded Gadget is truncated");
        }
        if ((header[0] & 0xff) != 0x7f || header[1] != 'E' || header[2] != 'L' || header[3] != 'F') {
            throw new IOException("Downloaded Gadget is not an ELF library");
        }
        int machine = (header[18] & 0xff) | ((header[19] & 0xff) << 8);
        int expected = expectedMachine(abi);
        if (expected < 0 || machine != expected) {
            throw new IOException("Downloaded Gadget ELF architecture does not match " + abi);
        }
    }

    private static int expectedMachine(String abi) {
        if ("arm64-v8a".equals(abi)) return 183;
        if ("armeabi-v7a".equals(abi)) return 40;
        if ("x86".equals(abi)) return 3;
        if ("x86_64".equals(abi)) return 62;
        return -1;
    }

    private static boolean supportsAbi(Context context, String abi) {
        return abi != null && abi.equals(ProcessAbi.detect(context));
    }

    private static boolean isInside(File root, File child) {
        return child.getAbsolutePath().startsWith(root.getAbsolutePath() + File.separator);
    }

    private static String safeName(String value) {
        return value == null ? "unknown" : value.replaceAll("[^A-Za-z0-9._-]", "_");
    }

    private static void copyAtomically(File source, File destination) throws IOException {
        File temporary = new File(destination.getParentFile(), destination.getName() + ".partial");
        if (temporary.exists() && !temporary.delete()) throw new IOException("Unable to replace temporary Gadget");
        try (FileInputStream input = new FileInputStream(source);
             FileOutputStream output = new FileOutputStream(temporary)) {
            byte[] buffer = new byte[128 * 1024];
            int count;
            while ((count = input.read(buffer)) >= 0) output.write(buffer, 0, count);
            output.getFD().sync();
        }
        replace(temporary, destination);
    }

    private static String readUtf8(File file) {
        if (!file.isFile() || file.length() > 4096) return null;
        try (FileInputStream input = new FileInputStream(file);
             ByteArrayOutputStream output = new ByteArrayOutputStream((int) file.length())) {
            byte[] buffer = new byte[512];
            int count;
            while ((count = input.read(buffer)) >= 0) output.write(buffer, 0, count);
            return output.toString(StandardCharsets.UTF_8.name());
        } catch (IOException ignored) {
            return null;
        }
    }

    static void writeUtf8Atomically(File destination, String value) throws IOException {
        byte[] expected = value.getBytes(StandardCharsets.UTF_8);
        File temporary = new File(destination.getParentFile(), destination.getName() + ".partial");
        try (FileOutputStream output = new FileOutputStream(temporary)) {
            output.write(expected);
            output.getFD().sync();
        }
        replace(temporary, destination);
    }

    private static void replace(File temporary, File destination) throws IOException {
        if (destination.exists() && !destination.delete()) {
            throw new IOException("Unable to replace " + destination.getName());
        }
        if (!temporary.renameTo(destination)) throw new IOException("Unable to install " + destination.getName());
    }
}
