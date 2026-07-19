package top.niunaijun.blackbox.instrumentation;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import android.content.pm.ApplicationInfo;

import org.junit.After;
import org.junit.Test;

public class GuestRuntimeRegistryTest {
    @After
    public void clearRegistry() {
        GuestRuntimeRegistry.clear();
    }

    @Test
    public void initializeReplacesProcessLocalSnapshot() {
        ApplicationInfo info = new ApplicationInfo();
        info.sourceDir = "/private/original.apk";
        ClassLoader loader = getClass().getClassLoader();
        GuestRuntimeRegistry.initialize("sample.one", "sample.one:remote", 3, 7, info, loader, true);

        assertEquals("sample.one", GuestRuntimeRegistry.getGuestPackageName());
        assertEquals("sample.one:remote", GuestRuntimeRegistry.getGuestProcessName());
        assertEquals(3, GuestRuntimeRegistry.getGuestUserId());
        assertEquals(7, GuestRuntimeRegistry.getVirtualProcessId());
        assertSame(loader, GuestRuntimeRegistry.getGuestClassLoader());
        assertEquals("/private/original.apk", GuestRuntimeRegistry.getGuestSourceDir());
        assertTrue(GuestRuntimeRegistry.isInstrumentationEnabled());
        assertTrue(GuestRuntimeRegistry.describe().contains("\"package\":\"sample.one\""));
    }

    @Test
    public void clearRemovesPriorGuest() {
        GuestRuntimeRegistry.initialize("sample", "sample", 0, 1, null, null, true);
        GuestRuntimeRegistry.clear();
        assertEquals(null, GuestRuntimeRegistry.getGuestPackageName());
        assertEquals(-1, GuestRuntimeRegistry.getGuestUserId());
        assertFalse(GuestRuntimeRegistry.isInstrumentationEnabled());
    }
}
