package top.niunaijun.blackbox.instrumentation;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.io.File;
import java.nio.charset.StandardCharsets;

public class LocalScriptGadgetRuntimeTest {
    @Test
    public void configUsesAutonomousScriptInteraction() {
        String config = LocalScriptGadgetRuntime.buildConfig(
                "sample.\"guest", "/private/agents/fridabox-runtime.js");
        assertTrue(config.contains("\"type\": \"script\""));
        assertTrue(config.contains("\"path\": \"/private/agents/fridabox-runtime.js\""));
        assertTrue(config.contains("\"on_change\": \"ignore\""));
        assertTrue(config.contains("\"runtime\": \"v8\""));
        assertTrue(config.contains("sample.\\\"guest"));
    }

    @Test
    public void logBridgeCapturesConsoleAndSendWithoutChangingTheSourceAgent() {
        String bridge = LocalScriptGadgetRuntime.buildLogBridge(new File("runtime.jsonl"));
        assertTrue(bridge.contains("console.log = function"));
        assertTrue(bridge.contains("console.error = function"));
        assertTrue(bridge.contains("Object.getOwnPropertyDescriptor(globalThis, 'send')"));
        assertTrue(bridge.contains("__fridaboxSend"));
        assertTrue(bridge.contains("runtime.jsonl"));
        assertTrue(bridge.contains("new File(logPath, 'a')"));
    }

    @Test
    public void compiledBundleKeepsItsHeaderBeforeTheInjectedBridge() throws Exception {
        String source = "📦\n16 /scripts/sample-hook.js\n✄\nvar hook = true;";
        String bridge = "console.log('bridge');\n";
        String result = new String(LocalScriptGadgetRuntime.instrumentAgent(
                source.getBytes(StandardCharsets.UTF_8), bridge), StandardCharsets.UTF_8);

        assertTrue(result.contains("✄\n" + bridge + "(function (send) {\nvar hook = true;"));
        assertTrue(result.contains("})(globalThis.__fridaboxSend);"));
    }

    @Test
    public void plainScriptReceivesBridgeAtTheBeginning() throws Exception {
        String source = "console.log('agent');";
        String bridge = "console.log('bridge');\n";
        String result = new String(LocalScriptGadgetRuntime.instrumentAgent(
                source.getBytes(StandardCharsets.UTF_8), bridge), StandardCharsets.UTF_8);

        assertTrue(result.startsWith(bridge));
        assertTrue(result.contains("(function (send) {\n" + source));
        assertTrue(result.endsWith("})(globalThis.__fridaboxSend);\n"));
    }

    @Test
    public void privatePathCheckRejectsSiblingPrefix() {
        File root = new File("/data/user/0/host/files/fridabox-agents");
        assertTrue(LocalScriptGadgetRuntime.isInside(root, new File(root, "guest/agent.js")));
        assertFalse(LocalScriptGadgetRuntime.isInside(root, new File(root.getPath() + "-other/agent.js")));
    }
}
