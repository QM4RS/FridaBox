package top.niunaijun.blackbox.instrumentation;

import android.content.Context;

import java.io.File;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import top.niunaijun.blackbox.BlackBoxCore;

/** Prepares a private Gadget copy configured to autonomously load one guest agent. */
final class LocalScriptGadgetRuntime {
    private static final String AGENT_ROOT = "fridabox-agents";
    private static final String AGENT_NAME = "agent.js";
    private static final String INSTRUMENTED_AGENT_NAME = "fridabox-runtime.js";
    private static final String LOG_NAME = "runtime.jsonl";
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
        File log = new File(directory, LOG_NAME);
        writeUtf8Atomically(log, "");
        File instrumentedAgent = new File(directory, INSTRUMENTED_AGENT_NAME);
        writeInstrumentedAgentAtomically(instrumentedAgent, script, buildLogBridge(log));
        if (!instrumentedAgent.setReadable(true, true) || !instrumentedAgent.setWritable(false, false)) {
            throw new IOException("Unable to secure the instrumented JavaScript agent");
        }

        File source = DownloadedGadgetRuntime.requireSelected(context);

        File runtime = new File(directory, RUNTIME_NAME);
        DownloadedGadgetRuntime.syncSelected(source, runtime);

        File config = new File(directory, CONFIG_NAME);
        writeUtf8Atomically(config, buildConfig(packageName, instrumentedAgent.getAbsolutePath()));
        return runtime;
    }

    static String buildConfig(String packageName, String agentPath) {
        return "{\n" +
                "  \"interaction\": {\n" +
                "    \"type\": \"script\",\n" +
                "    \"path\": \"" + json(agentPath) + "\",\n" +
                "    \"on_change\": \"ignore\",\n" +
                "    \"parameters\": { \"package\": \"" + json(packageName) + "\" }\n" +
                "  },\n" +
                "  \"runtime\": \"v8\",\n" +
                "  \"teardown\": \"minimal\"\n" +
                "}\n";
    }

    static String buildLogBridge(File log) {
        return "(function () {\n" +
                "  try {\n" +
                "  const logPath = \"" + json(log.getAbsolutePath()) + "\";\n" +
                "  const maxBytes = 512 * 1024;\n" +
                "  const original = { log: console.log, warn: console.warn, error: console.error, send: globalThis.send };\n" +
                "  function render(value) {\n" +
                "    if (typeof value === 'string') return value;\n" +
                "    try { return JSON.stringify(value); } catch (_) { return String(value); }\n" +
                "  }\n" +
                "  function append(level, values) {\n" +
                "    try {\n" +
                "      const message = Array.prototype.map.call(values, render).join(' ');\n" +
                "      let line = JSON.stringify({ time: Date.now(), level: level, message: message }) + '\\n';\n" +
                "      let existing = '';\n" +
                "      try { existing = File.readAllText(logPath); } catch (_) {}\n" +
                "      if (existing.length + line.length > maxBytes) {\n" +
                "        const notice = JSON.stringify({ time: Date.now(), level: 'system', message: 'Earlier logs were truncated' }) + '\\n';\n" +
                "        const keep = Math.max(0, maxBytes - notice.length - line.length);\n" +
                "        existing = existing.slice(Math.max(0, existing.length - keep));\n" +
                "        line = notice + line;\n" +
                "        File.writeAllText(logPath, existing + line);\n" +
                "        return;\n" +
                "      }\n" +
                "      const stream = new File(logPath, 'a');\n" +
                "      try { stream.write(line); stream.flush(); } finally { stream.close(); }\n" +
                "    } catch (error) { try { original.error.call(console, '[FridaBox log bridge]', error.stack || error); } catch (_) {} }\n" +
                "  }\n" +
                "  console.log = function () { append('log', arguments); return original.log.apply(console, arguments); };\n" +
                "  console.warn = function () { append('warn', arguments); return original.warn.apply(console, arguments); };\n" +
                "  console.error = function () { append('error', arguments); return original.error.apply(console, arguments); };\n" +
                "  const wrappedSend = function (payload, data) { append('send', [payload]); return original.send(payload, data); };\n" +
                "  Object.defineProperty(globalThis, '__fridaboxSend', { value: wrappedSend, configurable: true });\n" +
                "  try {\n" +
                "    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'send');\n" +
                "    if (!descriptor || descriptor.writable) globalThis.send = wrappedSend;\n" +
                "    else if (descriptor.configurable) Object.defineProperty(globalThis, 'send', Object.assign({}, descriptor, { value: wrappedSend }));\n" +
                "  } catch (error) { append('system', ['send() capture unavailable: ' + error]); }\n" +
                "  append('system', ['On-device agent started']);\n" +
                "  } catch (error) { try { console.error('[FridaBox log bridge]', error.stack || error); } catch (_) {} }\n" +
                "})();\n";
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

    private static void writeInstrumentedAgentAtomically(
            File destination, File source, String bridge) throws IOException {
        File temporary = new File(destination.getParentFile(), destination.getName() + ".partial");
        if (temporary.exists() && !temporary.delete()) {
            throw new IOException("Unable to replace temporary JavaScript agent");
        }
        try (FileInputStream input = new FileInputStream(source);
             ByteArrayOutputStream sourceBytes = new ByteArrayOutputStream((int) source.length())) {
            byte[] buffer = new byte[64 * 1024];
            int count;
            while ((count = input.read(buffer)) >= 0) sourceBytes.write(buffer, 0, count);
            byte[] instrumented = instrumentAgent(sourceBytes.toByteArray(), bridge);
            try (FileOutputStream output = new FileOutputStream(temporary)) {
                output.write(instrumented);
                output.getFD().sync();
            }
        }
        replace(temporary, destination);
    }

    static byte[] instrumentAgent(byte[] source, String bridge) throws IOException {
        int offset = injectionOffset(source);
        if (offset < 0) throw new IOException("Invalid Frida bundle header");
        byte[] prefix = (bridge + "(function (send) {\n").getBytes(StandardCharsets.UTF_8);
        byte[] suffix = "\n})(globalThis.__fridaboxSend);\n".getBytes(StandardCharsets.UTF_8);
        if (offset > 0) return instrumentBundle(source, prefix, suffix, offset);
        ByteArrayOutputStream output = new ByteArrayOutputStream(source.length + prefix.length + suffix.length);
        output.write(prefix, 0, prefix.length);
        output.write(source, 0, source.length);
        output.write(suffix, 0, suffix.length);
        return output.toByteArray();
    }

    private static byte[] instrumentBundle(
            byte[] source, byte[] prefix, byte[] suffix, int bodyOffset) throws IOException {
        int lengthStart = 0;
        while (lengthStart < bodyOffset && source[lengthStart] != '\n') lengthStart++;
        lengthStart++;
        int lengthEnd = lengthStart;
        long declaredLength = 0;
        while (lengthEnd < bodyOffset && source[lengthEnd] >= '0' && source[lengthEnd] <= '9') {
            declaredLength = declaredLength * 10 + (source[lengthEnd] - '0');
            lengthEnd++;
        }
        if (lengthStart >= bodyOffset || lengthEnd == lengthStart
                || lengthEnd >= bodyOffset || source[lengthEnd] != ' ') {
            throw new IOException("Invalid Frida bundle module length");
        }

        long bodyEndLong = bodyOffset + declaredLength;
        if (bodyEndLong > source.length) throw new IOException("Invalid Frida bundle module length");
        int bodyEnd = (int) bodyEndLong;
        byte[] updatedLength = Long.toString(declaredLength + prefix.length + suffix.length)
                .getBytes(StandardCharsets.US_ASCII);
        ByteArrayOutputStream output = new ByteArrayOutputStream(
                source.length + prefix.length + suffix.length
                        + updatedLength.length - (lengthEnd - lengthStart));
        output.write(source, 0, lengthStart);
        output.write(updatedLength, 0, updatedLength.length);
        output.write(source, lengthEnd, bodyOffset - lengthEnd);
        output.write(prefix, 0, prefix.length);
        output.write(source, bodyOffset, bodyEnd - bodyOffset);
        output.write(suffix, 0, suffix.length);
        output.write(source, bodyEnd, source.length - bodyEnd);
        return output.toByteArray();
    }

    static int injectionOffset(byte[] source) {
        byte[] magic = "📦".getBytes(StandardCharsets.UTF_8);
        if (!startsWith(source, magic)) return 0;
        byte[] unixMarker = "\n✄\n".getBytes(StandardCharsets.UTF_8);
        int unix = indexOf(source, unixMarker);
        if (unix >= 0) return unix + unixMarker.length;
        byte[] windowsMarker = "\r\n✄\r\n".getBytes(StandardCharsets.UTF_8);
        int windows = indexOf(source, windowsMarker);
        return windows < 0 ? -1 : windows + windowsMarker.length;
    }

    private static boolean startsWith(byte[] value, byte[] prefix) {
        if (value.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (value[i] != prefix[i]) return false;
        }
        return true;
    }

    private static int indexOf(byte[] value, byte[] needle) {
        for (int i = 0; i <= value.length - needle.length; i++) {
            int j = 0;
            while (j < needle.length && value[i + j] == needle[j]) j++;
            if (j == needle.length) return i;
        }
        return -1;
    }

    private static void replace(File temporary, File destination) throws IOException {
        if (destination.exists() && !destination.delete()) throw new IOException("Unable to replace " + destination.getName());
        if (!temporary.renameTo(destination)) throw new IOException("Unable to install " + destination.getName());
    }
}
