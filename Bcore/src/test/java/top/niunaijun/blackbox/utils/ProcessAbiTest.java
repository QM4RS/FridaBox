package top.niunaijun.blackbox.utils;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;

public class ProcessAbiTest {
    @Test
    public void processArchitectureKeepsThirtyTwoBitArmOnArm64Device() {
        assertEquals("armeabi-v7a", ProcessAbi.fromOsArch("armv7l"));
    }

    @Test
    public void processArchitectureKeepsThirtyTwoBitX86OnX8664Device() {
        assertEquals("x86", ProcessAbi.fromOsArch("i686"));
    }

    @Test
    public void elfHeaderDistinguishesAllReleaseArchitectures() {
        assertEquals("arm64-v8a", ProcessAbi.fromElfHeader(elfHeader(2, 183)));
        assertEquals("armeabi-v7a", ProcessAbi.fromElfHeader(elfHeader(1, 40)));
        assertEquals("x86_64", ProcessAbi.fromElfHeader(elfHeader(2, 62)));
        assertEquals("x86", ProcessAbi.fromElfHeader(elfHeader(1, 3)));
    }

    @Test
    public void elfHeaderRejectsMachineAndClassMismatch() {
        assertNull(ProcessAbi.fromElfHeader(elfHeader(2, 40)));
        assertNull(ProcessAbi.fromElfHeader(elfHeader(1, 62)));
    }

    private byte[] elfHeader(int elfClass, int machine) {
        byte[] header = new byte[20];
        header[0] = 0x7f;
        header[1] = 'E';
        header[2] = 'L';
        header[3] = 'F';
        header[4] = (byte) elfClass;
        header[5] = 1;
        header[18] = (byte) (machine & 0xff);
        header[19] = (byte) ((machine >> 8) & 0xff);
        return header;
    }
}
