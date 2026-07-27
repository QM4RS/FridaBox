package com.qm4rs.fridabox

import org.junit.Assert.assertEquals
import org.junit.Assert.assertThrows
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import java.io.IOException

class GadgetManagerTest {
    @get:Rule
    val temporary = TemporaryFolder()

    @Test
    fun releaseAssetNameMatchesOfficialRepository() {
        assertEquals(
            "frida-gadget-17.9.11-android-arm64.so.xz",
            GadgetSource.OFFICIAL.expectedAsset("17.9.11", "arm64")
        )
    }

    @Test
    fun releaseCatalogUsesTenItemPages() {
        assertEquals(
            "https://api.github.com/repos/frida/frida/releases?per_page=10&page=3",
            GadgetManager.releaseCatalogUrl(GadgetSource.OFFICIAL, 3)
        )
    }

    @Test
    fun elfValidationAcceptsMatchingArchitecture() {
        val file = temporary.newFile("payload.so")
        file.writeBytes(elfHeader(183))
        GadgetManager.validateElf(file, GadgetAbi("arm64-v8a", "arm64"))
    }

    @Test
    fun elfValidationRejectsWrongArchitecture() {
        val file = temporary.newFile("payload.so")
        file.writeBytes(elfHeader(40))
        assertThrows(IOException::class.java) {
            GadgetManager.validateElf(file, GadgetAbi("arm64-v8a", "arm64"))
        }
    }

    private fun elfHeader(machine: Int): ByteArray = ByteArray(20).also {
        it[0] = 0x7f
        it[1] = 'E'.code.toByte()
        it[2] = 'L'.code.toByte()
        it[3] = 'F'.code.toByte()
        it[4] = 2
        it[5] = 1
        it[18] = (machine and 0xff).toByte()
        it[19] = (machine shr 8).toByte()
    }
}
