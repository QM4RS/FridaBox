package top.niunaijun.blackboxa.fridabox

import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.graphics.Typeface
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.CheckBox
import android.widget.EditText
import android.widget.HorizontalScrollView
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Switch
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import top.niunaijun.blackbox.BlackBoxCore
import top.niunaijun.blackbox.instrumentation.InstrumentationSettings
import top.niunaijun.blackboxa.BuildConfig
import java.io.File
import java.io.FileOutputStream
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.Executors

/** Minimal host UI for APK import, virtual launch, runtime status, and settings. */
class FridaBoxActivity : AppCompatActivity() {
    private val worker = Executors.newSingleThreadExecutor()
    private lateinit var content: LinearLayout
    private val settings: SharedPreferences by lazy {
        getSharedPreferences(InstrumentationSettings.PREFERENCES, Context.MODE_PRIVATE)
    }
    private val metadata: SharedPreferences by lazy {
        getSharedPreferences("fridabox_imports", Context.MODE_PRIVATE)
    }

    private val apkPicker = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) importApk(uri)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showHome()
    }

    override fun onDestroy() {
        worker.shutdown()
        super.onDestroy()
    }

    private fun baseScreen(title: String): LinearLayout {
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(16), dp(12), dp(16), dp(12))
            setBackgroundColor(0xfff7f8fa.toInt())
        }
        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        header.addView(TextView(this).apply {
            text = title
            textSize = 24f
            setTypeface(typeface, Typeface.BOLD)
        }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        header.addView(Button(this).apply {
            text = "Home"
            setOnClickListener { showHome() }
        })
        header.addView(Button(this).apply {
            text = "Runtime"
            setOnClickListener { showRuntime() }
        })
        header.addView(Button(this).apply {
            text = "Settings"
            setOnClickListener { showSettings() }
        })
        root.addView(header)
        content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(12), 0, dp(24))
        }
        root.addView(ScrollView(this).apply { addView(content) }, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))
        setContentView(root)
        return content
    }

    private fun showHome() {
        baseScreen("FridaBox")
        content.addView(TextView(this).apply {
            text = "Non-root Android application virtualization with per-guest Frida Gadget instrumentation."
            textSize = 16f
        })
        content.addView(Button(this).apply {
            text = "Import APK"
            setOnClickListener { apkPicker.launch(arrayOf("application/vnd.android.package-archive", "application/octet-stream")) }
        })
        if (BuildConfig.DEBUG) {
            content.addView(Button(this).apply {
                text = "Install demo guest"
                setOnClickListener { installDemoGuest() }
            })
        }
        content.addView(sectionTitle("Virtual applications"))
        refreshApps()
    }

    private fun refreshApps() {
        val marker = TextView(this).apply { text = "Loading…" }
        content.addView(marker)
        worker.execute {
            val packages = try {
                BlackBoxCore.get().getInstalledPackages(PackageManager.GET_META_DATA, 0)
            } catch (error: Throwable) {
                runOnUiThread { marker.text = "Unable to read virtual packages: ${error.message}" }
                return@execute
            }
            runOnUiThread {
                content.removeView(marker)
                if (packages.isEmpty()) {
                    content.addView(TextView(this).apply { text = "No APKs imported yet." })
                } else {
                    packages.sortedBy { it.packageName }.forEach { addAppCard(it) }
                }
            }
        }
    }

    private fun addAppCard(info: PackageInfo) {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(12), dp(12), dp(12), dp(12))
            setBackgroundColor(0xffffffff.toInt())
        }
        val heading = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        heading.addView(ImageView(this).apply {
            try { setImageDrawable(info.applicationInfo?.loadIcon(BlackBoxCore.getPackageManager())) } catch (_: Throwable) { }
        }, LinearLayout.LayoutParams(dp(56), dp(56)))
        heading.addView(TextView(this).apply {
            text = buildString {
                append(info.packageName)
                append("\nVersion: ").append(info.versionName ?: "unknown")
                append("\nInstrumentation: ")
                append(if (settings.getBoolean("package_enabled_${info.packageName}", true)) "enabled" else "disabled")
            }
            setPadding(dp(12), 0, 0, 0)
        }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        card.addView(heading)
        val actions = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        actions.addView(actionButton("Launch instrumented") { confirmInstrumentedLaunch(info.packageName) })
        actions.addView(actionButton("Launch without instrumentation") { launch(info.packageName, false) })
        actions.addView(actionButton("Clear virtual app data") { clearApp(info.packageName) })
        actions.addView(actionButton("Remove from virtual space") { removeApp(info.packageName) })
        actions.addView(actionButton("View runtime details") { showRuntime(info.packageName) })
        card.addView(HorizontalScrollView(this).apply { addView(actions) })
        val sha = metadata.getString("${info.packageName}.sha256", null)
        if (sha != null) {
            card.addView(TextView(this).apply {
                text = "SHA-256: $sha\nSource: ${metadata.getString("${info.packageName}.source", "unknown")}\n" +
                    "ABI: ${metadata.getString("${info.packageName}.abi", "unknown")}\n" +
                    "Target SDK: ${metadata.getInt("${info.packageName}.targetSdk", info.applicationInfo?.targetSdkVersion ?: -1)}"
                textSize = 12f
                setTextIsSelectable(true)
            })
        }
        content.addView(card, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply { topMargin = dp(10) })
    }

    private fun confirmInstrumentedLaunch(packageName: String) {
        AlertDialog.Builder(this)
            .setTitle("Early instrumentation")
            .setMessage("Guest startup is paused until Frida attaches. Run the generated attach command or disable instrumentation.")
            .setPositiveButton("Launch") { _, _ -> launch(packageName, true) }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun launch(packageName: String, instrumented: Boolean) {
        worker.execute {
            try {
                InstrumentationSettings.setEnabledForPackage(packageName, instrumented)
                BlackBoxCore.get().stopPackage(packageName, 0)
                Thread.sleep(150)
                val launched = BlackBoxCore.get().launchApk(packageName, 0)
                runOnUiThread {
                    toast(if (launched) "Guest launch requested" else "Guest has no launchable activity")
                    if (instrumented) showRuntime(packageName)
                }
            } catch (error: Throwable) {
                runOnUiThread { toast("Launch failed: ${error.message}") }
            }
        }
    }

    private fun clearApp(packageName: String) {
        worker.execute {
            try {
                BlackBoxCore.get().stopPackage(packageName, 0)
                BlackBoxCore.get().clearPackage(packageName, 0)
                runOnUiThread { toast("Virtual app data cleared") }
            } catch (error: Throwable) {
                runOnUiThread { toast("Clear failed: ${error.message}") }
            }
        }
    }

    private fun removeApp(packageName: String) {
        AlertDialog.Builder(this).setTitle("Remove $packageName?")
            .setMessage("This removes the app and its data only from BlackBox virtual space.")
            .setPositiveButton("Remove") { _, _ ->
                worker.execute {
                    try {
                        BlackBoxCore.get().stopPackage(packageName, 0)
                        BlackBoxCore.get().uninstallPackageAsUser(packageName, 0)
                        runOnUiThread { showHome() }
                    } catch (error: Throwable) {
                        runOnUiThread { toast("Remove failed: ${error.message}") }
                    }
                }
            }.setNegativeButton("Cancel", null).show()
    }

    private fun importApk(uri: Uri) {
        val name = displayName(uri)
        val lowerName = name.lowercase(Locale.ROOT)
        if (!lowerName.endsWith(".apk") || lowerName.endsWith(".apks") ||
            lowerName.endsWith(".xapk") || lowerName.endsWith(".apkm")) {
            toast("Select one base .apk file; bundles and split sets are not supported")
            return
        }
        toast("Importing $name…")
        worker.execute {
            val directory = File(filesDir, "imported-apks").apply { mkdirs() }
            val temporary = File.createTempFile("import-", ".partial", directory)
            try {
                val digest = MessageDigest.getInstance("SHA-256")
                contentResolver.openInputStream(uri).use { input ->
                    requireNotNull(input) { "Unable to open the selected document" }
                    FileOutputStream(temporary).use { output ->
                        val buffer = ByteArray(64 * 1024)
                        while (true) {
                            val count = input.read(buffer)
                            if (count < 0) break
                            digest.update(buffer, 0, count)
                            output.write(buffer, 0, count)
                        }
                        output.fd.sync()
                    }
                }
                val originalHash = digest.digest().joinToString("") { "%02x".format(it) }
                val archiveInfo = packageManager.getPackageArchiveInfo(temporary.absolutePath, PackageManager.GET_META_DATA)
                    ?: error("Android could not parse this APK")
                if (!archiveInfo.splitNames.isNullOrEmpty()) error("Split-only APKs are not supported in this MVP")
                val abi = ApkInspector.inspect(temporary)
                if (!abi.supported) error("32-bit-only/native APK rejected: ${abi.description()}")
                val safePackage = archiveInfo.packageName.replace(Regex("[^A-Za-z0-9._-]"), "_")
                val stored = File(directory, "$safePackage-${originalHash.take(12)}.apk")
                if (stored.exists()) stored.delete()
                if (!temporary.renameTo(stored)) error("Unable to move APK into private storage")
                if (ApkIntegrity.sha256(stored) != originalHash) error("SHA-256 changed while importing")
                stored.setReadable(true, true)
                stored.setWritable(false, false)
                val installResult = BlackBoxCore.get().installPackageAsUser(stored, 0)
                if (!installResult.success) error(installResult.msg ?: "Virtual installation failed")
                if (ApkIntegrity.sha256(stored) != originalHash) error("Stored APK was modified during virtual installation")
                metadata.edit()
                    .putString("${archiveInfo.packageName}.sha256", originalHash)
                    .putString("${archiveInfo.packageName}.source", stored.absolutePath)
                    .putString("${archiveInfo.packageName}.abi", abi.description())
                    .putString("${archiveInfo.packageName}.version", archiveInfo.versionName)
                    .putInt("${archiveInfo.packageName}.targetSdk", archiveInfo.applicationInfo?.targetSdkVersion ?: -1)
                    .apply()
                InstrumentationSettings.setEnabledForPackage(archiveInfo.packageName, true)
                runOnUiThread {
                    toast("Imported ${archiveInfo.packageName}; SHA-256 verified")
                    showHome()
                }
            } catch (error: Throwable) {
                temporary.delete()
                runOnUiThread { toast("Import rejected: ${error.message}") }
            }
        }
    }

    private fun installDemoGuest() {
        worker.execute {
            try {
                val directory = File(filesDir, "imported-apks").apply { mkdirs() }
                val output = File(directory, "sample-guest.apk")
                if (output.exists() && !output.delete()) error("Unable to replace the prior demo APK")
                assets.open("demo/sample-guest.apk").use { input ->
                    FileOutputStream(output).use { input.copyTo(it) }
                }
                val sha = ApkIntegrity.sha256(output)
                output.setWritable(false, false)
                val result = BlackBoxCore.get().installPackageAsUser(output, 0)
                if (!result.success) error(result.msg ?: "Demo virtual installation failed")
                metadata.edit().putString("${result.packageName}.sha256", sha)
                    .putString("${result.packageName}.source", output.absolutePath)
                    .putString("${result.packageName}.abi", ApkInspector.inspect(output).description()).apply()
                runOnUiThread { toast("Demo guest installed into virtual space"); showHome() }
            } catch (error: Throwable) {
                runOnUiThread { toast("Demo install failed: ${error.message}") }
            }
        }
    }

    private fun showRuntime(packageHint: String? = null) {
        baseScreen("Runtime status")
        val packageName = settings.getString("runtime_package", packageHint) ?: packageHint ?: "No guest bound"
        val state = settings.getString("runtime_state", "idle")
        val basePort = settings.getInt(InstrumentationSettings.KEY_BASE_PORT, 27042)
        val count = settings.getInt(InstrumentationSettings.KEY_SCAN_COUNT, 32)
        val command = "python tools/attach_guest.py --package $packageName --keep-alive"
        content.addView(detail("Guest package", packageName))
        content.addView(detail("Guest process", settings.getString("runtime_process", "unknown") ?: "unknown"))
        content.addView(detail("Virtual process slot", settings.getInt("runtime_vpid", -1).toString()))
        content.addView(detail("Guest source path", settings.getString("runtime_source", "unknown") ?: "unknown"))
        content.addView(detail("Instrumentation enabled", settings.getBoolean("runtime_enabled", false).toString()))
        content.addView(detail("Gadget load status", state ?: "idle"))
        content.addView(detail("Expected port range", "$basePort..${basePort + count - 1}"))
        content.addView(detail("Latest error", settings.getString("runtime_error", "none") ?: "none"))
        content.addView(TextView(this).apply {
            text = "Attach command\n$command"
            setTextIsSelectable(true)
            setPadding(0, dp(12), 0, dp(8))
        })
        content.addView(Button(this).apply {
            text = "Copy attach command"
            setOnClickListener {
                (getSystemService(CLIPBOARD_SERVICE) as ClipboardManager)
                    .setPrimaryClip(ClipData.newPlainText("FridaBox attach", command))
                toast("Attach command copied")
            }
        })
        content.addView(Button(this).apply { text = "Refresh"; setOnClickListener { showRuntime(packageHint) } })
    }

    private fun showSettings() {
        baseScreen("Instrumentation settings")
        val enabled = Switch(this).apply {
            text = "Instrumentation enabled"
            isChecked = settings.getBoolean(InstrumentationSettings.KEY_ENABLED, true)
        }
        val pause = CheckBox(this).apply {
            text = "Pause guest until attach (required for this MVP)"
            isChecked = true
            isEnabled = false
        }
        val port = numericSetting("Frida base port", settings.getInt(InstrumentationSettings.KEY_BASE_PORT, 27042))
        val count = numericSetting("Port scan count", settings.getInt(InstrumentationSettings.KEY_SCAN_COUNT, 32))
        val logs = Switch(this).apply {
            text = "Show advanced logs"
            isChecked = settings.getBoolean(InstrumentationSettings.KEY_ADVANCED_LOGS, false)
        }
        content.addView(enabled); content.addView(pause); content.addView(port.first); content.addView(count.first); content.addView(logs)
        content.addView(Button(this).apply {
            text = "Save settings"
            setOnClickListener {
                settings.edit()
                    .putBoolean(InstrumentationSettings.KEY_ENABLED, enabled.isChecked)
                    .putInt(InstrumentationSettings.KEY_BASE_PORT, InstrumentationPreferenceParser.parsePort(port.second.text.toString(), 27042))
                    .putInt(InstrumentationSettings.KEY_SCAN_COUNT, InstrumentationPreferenceParser.parseScanCount(count.second.text.toString(), 32))
                    .putBoolean(InstrumentationSettings.KEY_ADVANCED_LOGS, logs.isChecked)
                    .apply()
                toast("Settings saved")
            }
        })
        content.addView(TextView(this).apply {
            text = "Limitations: FridaBox is not undetectable. The host UID/SELinux domain, virtual stub process, host classes, ClassLoader topology, synthesized Binder responses, Gadget module/threads/socket, and /proc/self/maps remain observable. Play Integrity and hardware-backed attestation are not virtualized."
            setPadding(0, dp(20), 0, 0)
        })
    }

    private fun numericSetting(label: String, value: Int): Pair<LinearLayout, EditText> {
        val input = EditText(this).apply {
            setText(value.toString()); inputType = InputType.TYPE_CLASS_NUMBER
        }
        return LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL
            addView(TextView(this@FridaBoxActivity).apply { text = label }, LinearLayout.LayoutParams(0, dp(56), 1f))
            addView(input, LinearLayout.LayoutParams(dp(140), dp(56)))
        } to input
    }

    private fun detail(label: String, value: String) = TextView(this).apply {
        text = "$label: $value"; setTextIsSelectable(true); setPadding(0, dp(5), 0, dp(5))
    }

    private fun sectionTitle(text: String) = TextView(this).apply {
        this.text = text; textSize = 19f; setTypeface(typeface, Typeface.BOLD); setPadding(0, dp(18), 0, dp(4))
    }

    private fun actionButton(label: String, action: () -> Unit) = Button(this).apply {
        text = label; setOnClickListener { action() }
    }

    private fun displayName(uri: Uri): String {
        contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use {
            if (it.moveToFirst()) return it.getString(0) ?: "selected.apk"
        }
        return uri.lastPathSegment ?: "selected.apk"
    }

    private fun toast(message: String) = Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
