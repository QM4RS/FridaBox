package com.qm4rs.fridabox

import android.content.Context
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import org.tukaani.xz.XZInputStream
import top.niunaijun.blackbox.instrumentation.InstrumentationSettings
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.Locale
import java.util.zip.GZIPInputStream

enum class GadgetSource(
    val id: String,
    val title: String,
    val repository: String
) {
    OFFICIAL("official", "Official Frida", "frida/frida");

    fun expectedAsset(version: String, architecture: String): String =
        "frida-gadget-$version-android-$architecture.so.xz"

    companion object {
        fun fromId(value: String?): GadgetSource? = entries.firstOrNull { it.id == value }
    }
}

data class GadgetAbi(val androidName: String, val releaseName: String) {
    companion object {
        private val supported = listOf(
            GadgetAbi("arm64-v8a", "arm64"),
            GadgetAbi("armeabi-v7a", "arm"),
            GadgetAbi("x86_64", "x86_64"),
            GadgetAbi("x86", "x86")
        )

        fun detect(): GadgetAbi? = Build.SUPPORTED_ABIS
            .firstNotNullOfOrNull { deviceAbi -> supported.firstOrNull { it.androidName == deviceAbi } }
    }
}

data class GadgetRelease(
    val source: GadgetSource,
    val version: String,
    val abi: GadgetAbi,
    val assetName: String,
    val downloadUrl: String,
    val compressedSize: Long,
    val publishedAt: String
)

data class InstalledGadget(
    val source: GadgetSource,
    val version: String,
    val abi: GadgetAbi,
    val file: File,
    val sha256: String,
    val size: Long
) {
    val identity: String get() = "${source.id}:$version:${abi.androidName}"
}

data class GadgetCatalog(
    val releases: List<GadgetRelease>,
    val fromCache: Boolean,
    val hasMore: Boolean
)

class GadgetManager(private val context: Context) {
    private val root = File(context.filesDir, DOWNLOAD_ROOT)
    private val cacheRoot = File(context.cacheDir, "gadget-catalogs")

    init {
        if (InstrumentationSettings.getSelectedGadgetSource() != null
            && InstrumentationSettings.getSelectedGadgetSource() != GadgetSource.OFFICIAL.id) {
            InstrumentationSettings.clearSelectedGadget()
        }
    }

    fun detectedAbi(): GadgetAbi? = GadgetAbi.detect()

    fun loadCatalog(source: GadgetSource, abi: GadgetAbi, page: Int): GadgetCatalog {
        val cache = File(cacheRoot, "${source.id}-${abi.androidName}-$page.json")
        return try {
            val json = requestText(releaseCatalogUrl(source, page))
            val releases = parseCatalog(json, source, abi)
            writeAtomically(cache, json.toByteArray(Charsets.UTF_8))
            GadgetCatalog(releases, false, JSONArray(json).length() == CATALOG_PAGE_SIZE)
        } catch (networkError: Exception) {
            if (!cache.isFile) throw networkError
            val cached = cache.readText(Charsets.UTF_8)
            val releases = parseCatalog(cached, source, abi)
            GadgetCatalog(releases, true, JSONArray(cached).length() == CATALOG_PAGE_SIZE)
        }
    }

    fun download(release: GadgetRelease): InstalledGadget {
        val currentAbi = detectedAbi() ?: throw IOException("This device ABI is not supported")
        if (release.abi != currentAbi) throw IOException("The selected release does not match this device ABI")

        val directory = installDirectory(release.source, release.version, release.abi).apply {
            if (!isDirectory && !mkdirs()) throw IOException("Unable to create Gadget storage")
        }
        val temporary = File(directory, "$PAYLOAD_NAME.partial")
        val destination = File(directory, PAYLOAD_NAME)
        val metadata = File(directory, METADATA_NAME)
        if (temporary.exists() && !temporary.delete()) throw IOException("Unable to replace partial download")

        val connection = openConnection(release.downloadUrl, "application/octet-stream")
        try {
            if (connection.responseCode !in 200..299) {
                throw IOException("GitHub download failed (HTTP ${connection.responseCode})")
            }
            val compressedLength = connection.contentLengthLong
            if (compressedLength > MAX_COMPRESSED_BYTES) throw IOException("Gadget download is unexpectedly large")
            val digest = MessageDigest.getInstance("SHA-256")
            var total = 0L
            decompressed(connection.inputStream, release.assetName).use { input ->
                FileOutputStream(temporary).use { output ->
                    val buffer = ByteArray(128 * 1024)
                    while (true) {
                        val count = input.read(buffer)
                        if (count < 0) break
                        total += count
                        if (total > MAX_DECOMPRESSED_BYTES) throw IOException("Expanded Gadget is unexpectedly large")
                        digest.update(buffer, 0, count)
                        output.write(buffer, 0, count)
                    }
                    output.fd.sync()
                }
            }
            if (total == 0L) throw IOException("Downloaded Gadget is empty")
            validateElf(temporary, release.abi)
            replace(temporary, destination)
            if (!destination.setReadable(true, true) || !destination.setWritable(false, false)) {
                throw IOException("Unable to secure downloaded Gadget")
            }
            val sha256 = digest.digest().joinToString("") { "%02x".format(it) }
            val record = InstalledGadget(
                release.source, release.version, release.abi, destination, sha256, total
            )
            writeMetadata(metadata, record, release.assetName)
            return record
        } catch (error: Exception) {
            temporary.delete()
            throw error
        } finally {
            connection.disconnect()
        }
    }

    fun installed(): List<InstalledGadget> {
        val abi = detectedAbi() ?: return emptyList()
        if (!root.isDirectory) return emptyList()
        return root.walkTopDown()
            .filter { it.isFile && it.name == METADATA_NAME }
            .mapNotNull { metadata -> runCatching { readMetadata(metadata) }.getOrNull() }
            .filter { it.abi == abi && it.file.isFile }
            .filter { runCatching { validateElf(it.file, it.abi) }.isSuccess }
            .sortedWith(compareByDescending<InstalledGadget> { versionParts(it.version) }
                .thenBy { it.source.ordinal })
            .toList()
    }

    fun selected(): InstalledGadget? {
        val path = InstrumentationSettings.getSelectedGadgetPath() ?: return null
        val selected = runCatching { File(path).canonicalFile }.getOrNull() ?: return null
        return installed().firstOrNull { runCatching { it.file.canonicalFile == selected }.getOrDefault(false) }
    }

    fun select(gadget: InstalledGadget) {
        val currentAbi = detectedAbi() ?: throw IOException("This device ABI is not supported")
        if (gadget.abi != currentAbi || !gadget.file.isFile) {
            throw IOException("The selected Gadget is not available for this device")
        }
        validateElf(gadget.file, gadget.abi)
        if (!InstrumentationSettings.setSelectedGadget(
                gadget.file.canonicalPath,
                gadget.source.id,
                gadget.version,
                gadget.abi.androidName,
                gadget.sha256
            )) {
            throw IOException("Unable to save the selected Gadget")
        }
    }

    fun findInstalled(release: GadgetRelease): InstalledGadget? {
        val expected = runCatching {
            File(installDirectory(release.source, release.version, release.abi), METADATA_NAME)
        }.getOrNull() ?: return null
        return runCatching { readMetadata(expected) }.getOrNull()
            ?.takeIf { it.file.isFile && runCatching { validateElf(it.file, it.abi) }.isSuccess }
    }

    private fun parseCatalog(json: String, source: GadgetSource, abi: GadgetAbi): List<GadgetRelease> {
        val releases = JSONArray(json)
        val result = ArrayList<GadgetRelease>()
        for (index in 0 until releases.length()) {
            val release = releases.optJSONObject(index) ?: continue
            if (release.optBoolean("draft") || release.optBoolean("prerelease")) continue
            val version = release.optString("tag_name").trim()
            if (!isSafeSegment(version)) continue
            val expected = source.expectedAsset(version, abi.releaseName)
            val assets = release.optJSONArray("assets") ?: continue
            for (assetIndex in 0 until assets.length()) {
                val asset = assets.optJSONObject(assetIndex) ?: continue
                val name = asset.optString("name")
                if (name != expected) continue
                val url = asset.optString("browser_download_url")
                if (!isTrustedUrl(url)) continue
                result += GadgetRelease(
                    source = source,
                    version = version,
                    abi = abi,
                    assetName = name,
                    downloadUrl = url,
                    compressedSize = asset.optLong("size", -1L),
                    publishedAt = release.optString("published_at")
                )
                break
            }
        }
        return result
    }

    private fun installDirectory(source: GadgetSource, version: String, abi: GadgetAbi): File {
        if (!isSafeSegment(version)) throw IOException("Invalid Gadget version")
        return File(root, "${source.id}${File.separator}$version${File.separator}${abi.androidName}")
    }

    private fun writeMetadata(file: File, gadget: InstalledGadget, assetName: String) {
        val json = JSONObject()
            .put("source", gadget.source.id)
            .put("version", gadget.version)
            .put("abi", gadget.abi.androidName)
            .put("releaseAbi", gadget.abi.releaseName)
            .put("sha256", gadget.sha256)
            .put("size", gadget.size)
            .put("asset", assetName)
            .toString()
        writeAtomically(file, json.toByteArray(Charsets.UTF_8))
    }

    private fun readMetadata(file: File): InstalledGadget {
        if (!file.isFile || file.length() > MAX_METADATA_BYTES) throw IOException("Invalid Gadget metadata")
        val json = JSONObject(file.readText(Charsets.UTF_8))
        val source = GadgetSource.fromId(json.getString("source")) ?: throw IOException("Unknown Gadget source")
        val version = json.getString("version")
        if (!isSafeSegment(version)) throw IOException("Invalid Gadget version")
        val androidAbi = json.getString("abi")
        val releaseAbi = json.getString("releaseAbi")
        val abi = GadgetAbi(androidAbi, releaseAbi)
        val payload = File(file.parentFile, PAYLOAD_NAME).canonicalFile
        val canonicalRoot = root.canonicalFile
        if (!payload.path.startsWith(canonicalRoot.path + File.separator)) throw IOException("Invalid Gadget path")
        return InstalledGadget(
            source, version, abi, payload, json.getString("sha256"), json.getLong("size")
        )
    }

    private fun requestText(url: String): String {
        val connection = openConnection(url, "application/vnd.github+json")
        try {
            if (connection.responseCode !in 200..299) {
                throw IOException("GitHub release lookup failed (HTTP ${connection.responseCode})")
            }
            val bytes = readLimited(connection.inputStream, MAX_CATALOG_BYTES)
            return bytes.toString(Charsets.UTF_8)
        } finally {
            connection.disconnect()
        }
    }

    private fun openConnection(value: String, accept: String): HttpURLConnection {
        if (!isTrustedUrl(value)) throw IOException("Untrusted Gadget download URL")
        return (URL(value).openConnection() as HttpURLConnection).apply {
            connectTimeout = 15_000
            readTimeout = 45_000
            instanceFollowRedirects = true
            setRequestProperty("Accept", accept)
            setRequestProperty("User-Agent", "FridaBox/${BuildConfig.VERSION_NAME}")
            setRequestProperty("X-GitHub-Api-Version", "2022-11-28")
        }
    }

    private fun decompressed(input: InputStream, assetName: String): InputStream = when {
        assetName.endsWith(".xz") -> XZInputStream(input)
        assetName.endsWith(".gz") -> GZIPInputStream(input, 128 * 1024)
        else -> throw IOException("Unsupported Gadget archive format")
    }

    companion object {
        private const val DOWNLOAD_ROOT = "fridabox-gadgets"
        internal const val CATALOG_PAGE_SIZE = 10
        private const val PAYLOAD_NAME = "payload.so"
        private const val METADATA_NAME = "metadata.json"
        private const val MAX_METADATA_BYTES = 16L * 1024L
        private const val MAX_CATALOG_BYTES = 24L * 1024L * 1024L
        private const val MAX_COMPRESSED_BYTES = 96L * 1024L * 1024L
        private const val MAX_DECOMPRESSED_BYTES = 192L * 1024L * 1024L

        internal fun releaseCatalogUrl(source: GadgetSource, page: Int): String {
            require(page > 0) { "Catalog page must be positive" }
            return "https://api.github.com/repos/${source.repository}/releases" +
                "?per_page=$CATALOG_PAGE_SIZE&page=$page"
        }

        internal fun validateElf(file: File, abi: GadgetAbi) {
            val header = ByteArray(20)
            FileInputStream(file).use { input ->
                if (input.read(header) != header.size) throw IOException("Downloaded Gadget is truncated")
            }
            if (header[0].toInt() and 0xff != 0x7f || header[1] != 'E'.code.toByte()
                || header[2] != 'L'.code.toByte() || header[3] != 'F'.code.toByte()) {
                throw IOException("Downloaded Gadget is not an ELF library")
            }
            if (header[5].toInt() != 1) throw IOException("Only little-endian Android ELF libraries are supported")
            val machine = (header[18].toInt() and 0xff) or ((header[19].toInt() and 0xff) shl 8)
            val expected = when (abi.androidName) {
                "arm64-v8a" -> 183
                "armeabi-v7a" -> 40
                "x86" -> 3
                "x86_64" -> 62
                else -> -1
            }
            if (machine != expected) throw IOException("Gadget ELF architecture does not match ${abi.androidName}")
        }

        private fun readLimited(input: InputStream, maximum: Long): ByteArray {
            input.use {
                val output = ByteArrayOutputStream()
                val buffer = ByteArray(64 * 1024)
                var total = 0L
                while (true) {
                    val count = it.read(buffer)
                    if (count < 0) break
                    total += count
                    if (total > maximum) throw IOException("GitHub response is unexpectedly large")
                    output.write(buffer, 0, count)
                }
                return output.toByteArray()
            }
        }

        private fun writeAtomically(destination: File, bytes: ByteArray) {
            destination.parentFile?.let { if (!it.isDirectory && !it.mkdirs()) throw IOException("Unable to create storage") }
            val temporary = File(destination.parentFile, destination.name + ".partial")
            FileOutputStream(temporary).use { output ->
                output.write(bytes)
                output.fd.sync()
            }
            replace(temporary, destination)
        }

        private fun replace(temporary: File, destination: File) {
            if (destination.exists() && !destination.delete()) throw IOException("Unable to replace ${destination.name}")
            if (!temporary.renameTo(destination)) throw IOException("Unable to install ${destination.name}")
        }

        private fun isSafeSegment(value: String): Boolean =
            value.isNotBlank() && value.length <= 64 && value.matches(Regex("[A-Za-z0-9._-]+"))

        private fun isTrustedUrl(value: String): Boolean = runCatching {
            val url = URL(value)
            val host = url.host.lowercase(Locale.ROOT)
            url.protocol == "https" && (host == "api.github.com" || host == "github.com"
                || host.endsWith(".githubusercontent.com"))
        }.getOrDefault(false)

        private fun versionParts(value: String): String = value.split('.')
            .joinToString(".") { it.toIntOrNull()?.toString()?.padStart(8, '0') ?: it }
    }
}
