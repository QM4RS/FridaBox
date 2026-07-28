package top.niunaijun.blackbox.utils;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class AbiUtilsTest {
    @Rule
    public final TemporaryFolder temporary = new TemporaryFolder();

    @Test
    public void x86ProcessRejectsArmOnlyGuest() throws Exception {
        AbiUtils abi = new AbiUtils(apkWith("lib/armeabi-v7a/libsample.so"));
        assertFalse(abi.supports("x86"));
    }

    @Test
    public void armProcessAcceptsLegacyArmeabiFallback() throws Exception {
        AbiUtils abi = new AbiUtils(apkWith("lib/armeabi/libsample.so"));
        assertTrue(abi.supports("armeabi-v7a"));
    }

    @Test
    public void sixtyFourBitProcessRejectsThirtyTwoBitGuest() throws Exception {
        AbiUtils abi = new AbiUtils(apkWith("lib/x86/libsample.so"));
        assertFalse(abi.supports("x86_64"));
    }

    private File apkWith(String entry) throws Exception {
        File file = temporary.newFile("guest-" + System.nanoTime() + ".apk");
        try (ZipOutputStream output = new ZipOutputStream(new FileOutputStream(file))) {
            output.putNextEntry(new ZipEntry(entry));
            output.write(1);
            output.closeEntry();
        }
        return file;
    }
}
