package top.niunaijun.blackboxa.fridabox;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TemporaryFolder;

import java.io.File;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ApkInspectorTest {
    @Rule public final TemporaryFolder temporary = new TemporaryFolder();

    @Test
    public void pureJavaApkIsAccepted() throws Exception {
        File apk = apkWith("classes.dex");
        ApkInspector.Result result = ApkInspector.inspect(apk);
        assertFalse(result.hasNativeLibraries);
        assertTrue(result.supported);
    }

    @Test
    public void arm64ApkIsAccepted() throws Exception {
        ApkInspector.Result result = ApkInspector.inspect(apkWith("lib/arm64-v8a/libsample.so"));
        assertTrue(result.hasNativeLibraries);
        assertTrue(result.supported);
    }

    @Test
    public void thirtyTwoBitOnlyApkIsRejected() throws Exception {
        ApkInspector.Result result = ApkInspector.inspect(apkWith("lib/armeabi-v7a/libsample.so"));
        assertTrue(result.hasNativeLibraries);
        assertFalse(result.supported);
    }

    private File apkWith(String entry) throws Exception {
        File file = temporary.newFile("test-" + System.nanoTime() + ".apk");
        try (ZipOutputStream output = new ZipOutputStream(new FileOutputStream(file))) {
            output.putNextEntry(new ZipEntry("AndroidManifest.xml")); output.write(1); output.closeEntry();
            output.putNextEntry(new ZipEntry(entry)); output.write(2); output.closeEntry();
        }
        return file;
    }
}
