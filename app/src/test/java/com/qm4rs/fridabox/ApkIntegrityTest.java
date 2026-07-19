package com.qm4rs.fridabox;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import java.io.ByteArrayInputStream;

public class ApkIntegrityTest {
    @Test
    public void computesKnownSha256() throws Exception {
        assertEquals("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
                ApkIntegrity.sha256(new ByteArrayInputStream("abc".getBytes("UTF-8"))));
    }
}
