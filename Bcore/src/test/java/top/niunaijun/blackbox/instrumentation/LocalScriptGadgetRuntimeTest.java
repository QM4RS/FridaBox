package top.niunaijun.blackbox.instrumentation;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.io.File;

public class LocalScriptGadgetRuntimeTest {
    @Test
    public void configUsesAutonomousScriptInteraction() {
        String config = LocalScriptGadgetRuntime.buildConfig("sample.\"guest");
        assertTrue(config.contains("\"type\": \"script\""));
        assertTrue(config.contains("\"path\": \"agent.js\""));
        assertTrue(config.contains("sample.\\\"guest"));
    }

    @Test
    public void privatePathCheckRejectsSiblingPrefix() {
        File root = new File("/data/user/0/host/files/fridabox-agents");
        assertTrue(LocalScriptGadgetRuntime.isInside(root, new File(root, "guest/agent.js")));
        assertFalse(LocalScriptGadgetRuntime.isInside(root, new File(root.getPath() + "-other/agent.js")));
    }
}
