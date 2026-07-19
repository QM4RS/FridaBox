package top.niunaijun.blackbox.instrumentation;

import android.content.Context;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import top.niunaijun.blackbox.BlackBoxCore;

/** Prepares a private Gadget copy configured to autonomously load one guest agent. */
final class LocalScriptGadgetRuntime {
    private static final String AGENT_ROOT = "fridabox-agents";
    private static final String AGENT_NAME = "agent.js";
    private static final String RUNTIME_NAME = "libfridabox-agent.so";
    private static final String CONFIG_NAME = "libfridabox-agent.config.so";

    private LocalScriptGadgetRuntime() {
    }

    static File prepare(String packageName, String scriptPath) throws IOException {
        Context context = BlackBoxCore.getContext();
        if (scriptPath == null || scriptPath.trim().isEmpty()) {
            throw new IOException("No on-device JavaScript agent is selected");
        }
        File root = new File(context.getFilesDir(), AGENT_ROOT).getCanonicalFile();
        File script = new File(scriptPath).getCanonicalFile();
        if (!isInside(root, script) || !AGENT_NAME.equals(script.getName()) || !script.isFile()) {
            throw new IOException("Selected JavaScript agent is outside FridaBox private storage");
        }
        if (!script.setReadable(true, true) || !script.setWritable(false, false)) {
            throw new IOException("Unable to secure the selected JavaScript agent");
        }

        File directory = script.getParentFile();
        File source = new File(context.getApplicationInfo().nativeLibraryDir, "libfrida-gadget.so");
        if (!source.isFile()) throw new IOException("Packaged Frida Gadget is missing");

        File runtime = new File(directory, RUNTIME_NAME);
        if (!runtime.isFile() || runtime.length() != source.length()) {
            copyAtomically(source, runtime);
        }
        if (!runtime.setReadable(true, false)
                || !runtime.setExecutable(true, false)
                || !runtime.setWritable(false, false)) {
            throw new IOException("Unable to secure private Frida Gadget permissions");
        }

        File config = new File(directory, CONFIG_NAME);
        writeUtf8Atomically(config, buildConfig(packageName));
        return runtime;
    }

    static String buildConfig(String packageName) {
        return "{\n" +
                "  \"interaction\": {\n" +
                "    \"type\": \"script\",\n" +
                "    \"path\": \"" + AGENT_NAME + "\",\n" +
                "    \"on_change\": \"reload\",\n" +
                "    \"parameters\": { \"package\": \"" + json(packageName) + "\" }\n" +
                "  },\n" +
                "  \"runtime\": \"qjs\",\n" +
                "  \"teardown\": \"minimal\"\n" +
                "}\n";
    }

    static boolean isInside(File root, File child) {
        String rootPath = root.getAbsolutePath();
        String childPath = child.getAbsolutePath();
        return childPath.startsWith(rootPath + File.separator);
    }

    private static String json(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"")
                .replace("\n", "\\n").replace("\r", "\\r");
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

    private static void writeUtf8Atomically(File destination, String value) throws IOException {
        byte[] expected = value.getBytes(StandardCharsets.UTF_8);
        if (destination.isFile() && destination.length() == expected.length) {
            byte[] current = new byte[expected.length];
            try (FileInputStream input = new FileInputStream(destination)) {
                if (input.read(current) == current.length && java.util.Arrays.equals(current, expected)) return;
            }
        }
        File temporary = new File(destination.getParentFile(), destination.getName() + ".partial");
        try (FileOutputStream output = new FileOutputStream(temporary)) {
            output.write(expected);
            output.getFD().sync();
        }
        replace(temporary, destination);
    }

    private static void replace(File temporary, File destination) throws IOException {
        if (destination.exists() && !destination.delete()) throw new IOException("Unable to replace " + destination.getName());
        if (!temporary.renameTo(destination)) throw new IOException("Unable to install " + destination.getName());
    }
}
