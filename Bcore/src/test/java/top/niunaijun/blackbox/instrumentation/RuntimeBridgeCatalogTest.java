package top.niunaijun.blackbox.instrumentation;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class RuntimeBridgeCatalogTest {
    @Test
    public void bridgeControlsStartAtFridaSeventeen() {
        assertFalse(RuntimeBridgeCatalog.supportsRuntimeBridges("16.7.19"));
        assertTrue(RuntimeBridgeCatalog.supportsRuntimeBridges("17.0.0"));
        assertTrue(RuntimeBridgeCatalog.supportsRuntimeBridges("17.16.0"));
        assertTrue(RuntimeBridgeCatalog.supportsRuntimeBridges("v18.1.2"));
        assertFalse(RuntimeBridgeCatalog.supportsRuntimeBridges("not-a-version"));
    }

    @Test
    public void everyBridgeHasAValidDefaultAndPinnedAlternatives() {
        for (RuntimeBridgeCatalog.BridgeSpec spec : RuntimeBridgeCatalog.specs()) {
            assertNotNull(RuntimeBridgeCatalog.find(spec.id));
            assertTrue(spec.supportsVersion(spec.defaultVersion));
            assertTrue(spec.versions().size() >= 2);
        }
    }
}
