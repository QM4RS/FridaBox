package com.qm4rs.fridabox

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.SharedPreferences
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.res.ColorStateList
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.provider.OpenableColumns
import android.text.InputType
import android.view.Gravity
import android.view.Menu
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.PopupMenu
import android.widget.Space
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import com.google.android.material.button.MaterialButton
import com.google.android.material.button.MaterialButtonToggleGroup
import com.google.android.material.card.MaterialCardView
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.switchmaterial.SwitchMaterial
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import top.niunaijun.blackbox.BlackBoxCore
import top.niunaijun.blackbox.instrumentation.InstrumentationSettings
import com.qm4rs.fridabox.databinding.ActivityFridaboxBinding
import java.io.File
import java.io.FileOutputStream
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.Executors

/** Product workspace for importing, configuring, and launching FridaBox guests. */
class FridaBoxActivity : AppCompatActivity() {
    private enum class Screen { WORKSPACE, RUNTIME, SETTINGS }

    private lateinit var binding: ActivityFridaboxBinding
    private val worker = Executors.newSingleThreadExecutor()
    private var screen = Screen.WORKSPACE
    private var screenGeneration = 0
    private var changingNavigation = false
    private var pendingScriptPackage: String? = null

    @Suppress("DEPRECATION")
    private val settings: SharedPreferences by lazy {
        getSharedPreferences(InstrumentationSettings.PREFERENCES, Context.MODE_MULTI_PROCESS)
    }
    private val metadata: SharedPreferences by lazy {
        getSharedPreferences("fridabox_imports", Context.MODE_PRIVATE)
    }

    private val apkPicker = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) importApk(uri)
    }
    private val scriptPicker = registerForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        val packageName = pendingScriptPackage
        pendingScriptPackage = null
        if (uri != null && packageName != null) importAgent(packageName, uri)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFridaboxBinding.inflate(layoutInflater)
        setContentView(binding.root)
        pendingScriptPackage = savedInstanceState?.getString("pending_script_package")

        binding.importFab.setOnClickListener { openApkPicker() }
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            if (changingNavigation) return@setOnItemSelectedListener true
            when (item.itemId) {
                R.id.nav_workspace -> showWorkspace()
                R.id.nav_runtime -> showRuntime()
                R.id.nav_settings -> showSettings()
                else -> return@setOnItemSelectedListener false
            }
            true
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (screen == Screen.WORKSPACE) finish() else showWorkspace()
            }
        })
        showWorkspace()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString("pending_script_package", pendingScriptPackage)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        worker.shutdown()
        super.onDestroy()
    }

    private fun showWorkspace() {
        screen = Screen.WORKSPACE
        val generation = resetScreen(R.id.nav_workspace, showImport = false)
        binding.toolbar.title = getString(R.string.fb_brand)
        binding.toolbar.subtitle = getString(R.string.fb_brand_tagline)

        binding.content.addView(heroCard())
        binding.content.requestFocus()
        binding.contentScroll.post {
            binding.content.requestFocus()
            binding.contentScroll.scrollTo(0, 0)
        }
        val titleRow = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(28), 0, dp(10))
        }
        titleRow.addView(verticalText(
            getString(R.string.fb_guest_workspace),
            getString(R.string.fb_guest_workspace_hint)
        ), LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        val count = badge("…", color(R.color.fb_surface_high), color(R.color.fb_primary))
        titleRow.addView(count)
        binding.content.addView(titleRow)
        binding.content.addView(primaryButton(getString(R.string.fb_import_apk)) {
            openApkPicker()
        }, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(48)).apply {
            bottomMargin = dp(14)
        })

        val guestList = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        binding.content.addView(guestList)
        setLoading(true)
        worker.execute {
            val result = runCatching {
                BlackBoxCore.get().getInstalledPackages(PackageManager.GET_META_DATA, 0)
                    .sortedBy { it.packageName }
            }
            runOnUiThread {
                if (generation != screenGeneration || isFinishing) return@runOnUiThread
                setLoading(false)
                result.onSuccess { packages ->
                    count.text = packages.size.toString()
                    if (packages.isEmpty()) guestList.addView(emptyWorkspace())
                    else packages.forEach { guestList.addView(appCard(it)) }
                }.onFailure { error ->
                    guestList.addView(messageCard(
                        "Workspace unavailable",
                        error.message ?: "Unable to read virtual applications",
                        R.color.fb_error
                    ))
                }
            }
        }
    }

    private fun heroCard(): View {
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(22), dp(22), dp(22), dp(22))
            background = ContextCompat.getDrawable(this@FridaBoxActivity, R.drawable.bg_fridabox_hero)
        }
        body.addView(labelText(getString(R.string.fb_hero_eyebrow), R.color.fb_primary, 11f, true))
        body.addView(labelText(getString(R.string.fb_hero_title), R.color.fb_text_primary, 29f, true).apply {
            setPadding(0, dp(8), 0, 0)
        })
        body.addView(labelText(getString(R.string.fb_hero_body), R.color.fb_text_secondary, 15f, false).apply {
            setPadding(0, dp(10), 0, 0)
            setLineSpacing(0f, 1.15f)
        })
        val signals = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.START
            setPadding(0, dp(18), 0, 0)
        }
        signals.addView(badge("ARM64", color(R.color.fb_surface_tint), color(R.color.fb_primary)))
        signals.addView(space(dp(8), 1))
        signals.addView(badge("v${BuildConfig.VERSION_NAME}", color(R.color.fb_surface_tint), color(R.color.fb_text_primary)))
        body.addView(signals)
        return body
    }

    private fun emptyWorkspace(): View {
        return surfaceCard().apply {
            addView(LinearLayout(this@FridaBoxActivity).apply {
                orientation = LinearLayout.VERTICAL
                gravity = Gravity.CENTER_HORIZONTAL
                setPadding(dp(24), dp(36), dp(24), dp(36))
                addView(ImageView(this@FridaBoxActivity).apply {
                    setImageResource(R.drawable.logo)
                }, LinearLayout.LayoutParams(dp(52), dp(52)))
                addView(labelText(getString(R.string.fb_no_guests), R.color.fb_text_primary, 19f, true).apply {
                    setPadding(0, dp(16), 0, 0)
                })
                addView(labelText(getString(R.string.fb_no_guests_body), R.color.fb_text_secondary, 14f, false).apply {
                    gravity = Gravity.CENTER
                    setPadding(0, dp(8), 0, dp(18))
                })
                addView(primaryButton(getString(R.string.fb_import_apk)) { openApkPicker() })
            })
        }
    }

    private fun appCard(info: PackageInfo): View {
        val packageName = info.packageName
        val mode = InstrumentationSettings.getModeForPackage(packageName)
        val appLabel = runCatching {
            info.applicationInfo?.loadLabel(BlackBoxCore.getPackageManager())?.toString()
        }.getOrNull().orEmpty().ifBlank { packageName.substringAfterLast('.') }

        val card = surfaceCard().apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(14) }
        }
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
        }
        card.addView(body)

        val heading = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        val icon = ImageView(this).apply {
            runCatching { setImageDrawable(info.applicationInfo?.loadIcon(BlackBoxCore.getPackageManager())) }
            background = rounded(color(R.color.fb_surface_tint), dp(16))
            setPadding(dp(8), dp(8), dp(8), dp(8))
        }
        heading.addView(icon, LinearLayout.LayoutParams(dp(58), dp(58)))
        heading.addView(verticalText(
            appLabel,
            "$packageName  ·  ${info.versionName ?: "—"}"
        ).apply { setPadding(dp(13), 0, dp(8), 0) }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        val modeBadge = badge(modeShortLabel(mode), modeColor(mode, true), modeColor(mode, false))
        heading.addView(modeBadge)
        body.addView(heading)

        body.addView(labelText("Launch mode", R.color.fb_text_secondary, 12f, true).apply {
            setPadding(0, dp(18), 0, dp(7))
        })
        val modeInfo = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val group = MaterialButtonToggleGroup(this).apply {
            isSingleSelection = true
            isSelectionRequired = true
        }
        val localId = View.generateViewId()
        val computerId = View.generateViewId()
        val cleanId = View.generateViewId()
        group.addView(modeButton(localId, getString(R.string.fb_mode_local)))
        group.addView(modeButton(computerId, getString(R.string.fb_mode_computer)))
        group.addView(modeButton(cleanId, getString(R.string.fb_mode_clean)))
        group.check(when (mode) {
            InstrumentationSettings.MODE_LOCAL_SCRIPT -> localId
            InstrumentationSettings.MODE_CLEAN -> cleanId
            else -> computerId
        })
        group.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (!isChecked) return@addOnButtonCheckedListener
            val selected = when (checkedId) {
                localId -> InstrumentationSettings.MODE_LOCAL_SCRIPT
                cleanId -> InstrumentationSettings.MODE_CLEAN
                else -> InstrumentationSettings.MODE_COMPUTER
            }
            InstrumentationSettings.setModeForPackage(packageName, selected)
            modeBadge.text = modeShortLabel(selected)
            modeBadge.backgroundTintList = ColorStateList.valueOf(modeColor(selected, true))
            modeBadge.setTextColor(modeColor(selected, false))
            renderModeInfo(modeInfo, packageName, selected)
        }
        body.addView(group, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(48)))
        body.addView(modeInfo)
        renderModeInfo(modeInfo, packageName, mode)

        val actions = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(16), 0, 0)
        }
        actions.addView(primaryButton(getString(R.string.fb_launch)) {
            launchConfigured(packageName)
        }, LinearLayout.LayoutParams(0, dp(50), 1f))
        actions.addView(space(dp(10), 1))
        actions.addView(outlineButton(getString(R.string.fb_more)) { anchor ->
            showAppMenu(anchor, info, appLabel)
        }, LinearLayout.LayoutParams(0, dp(50), 0.56f))
        body.addView(actions)
        return card
    }

    private fun renderModeInfo(container: LinearLayout, packageName: String, mode: String) {
        container.removeAllViews()
        val title: String
        val description: String
        when (mode) {
            InstrumentationSettings.MODE_LOCAL_SCRIPT -> {
                title = getString(R.string.fb_mode_local_title)
                description = getString(R.string.fb_mode_local_body)
            }
            InstrumentationSettings.MODE_CLEAN -> {
                title = getString(R.string.fb_mode_clean_title)
                description = getString(R.string.fb_mode_clean_body)
            }
            else -> {
                title = getString(R.string.fb_mode_computer_title)
                description = getString(R.string.fb_mode_computer_body)
            }
        }
        val panel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(13), dp(12), dp(13), dp(12))
            background = rounded(color(R.color.fb_surface_tint), dp(14))
        }
        panel.addView(labelText(title, R.color.fb_text_primary, 14f, true))
        panel.addView(labelText(description, R.color.fb_text_secondary, 12.5f, false).apply {
            setPadding(0, dp(4), 0, 0)
        })
        if (mode == InstrumentationSettings.MODE_LOCAL_SCRIPT) {
            val scriptName = metadata.getString("$packageName.scriptName", null)
            val scriptHash = metadata.getString("$packageName.scriptSha", null)
            panel.addView(labelText(
                scriptName ?: getString(R.string.fb_no_script),
                if (scriptName == null) R.color.fb_warning else R.color.fb_success,
                12.5f,
                true
            ).apply { setPadding(0, dp(10), 0, 0) })
            if (scriptHash != null) {
                panel.addView(labelText("SHA-256  ${scriptHash.take(16)}…", R.color.fb_text_secondary, 11f, false))
            }
            panel.addView(outlineButton(
                if (scriptName == null) getString(R.string.fb_select_script) else getString(R.string.fb_replace_script)
            ) { chooseAgent(packageName) }.apply {
                layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(44)).apply {
                    topMargin = dp(10)
                }
            })
        }
        container.addView(panel, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply { topMargin = dp(10) })
    }

    private fun launchConfigured(packageName: String) {
        val mode = InstrumentationSettings.getModeForPackage(packageName)
        if (mode == InstrumentationSettings.MODE_LOCAL_SCRIPT) {
            val path = InstrumentationSettings.getScriptPathForPackage(packageName)
            if (path.isNullOrBlank() || !File(path).isFile) {
                chooseAgent(packageName)
                return
            }
            launch(packageName, mode)
            return
        }
        if (mode == InstrumentationSettings.MODE_COMPUTER) {
            MaterialAlertDialogBuilder(this)
                .setTitle(R.string.fb_computer_launch_title)
                .setMessage(R.string.fb_computer_launch_body)
                .setPositiveButton(R.string.fb_launch) { _, _ -> launch(packageName, mode) }
                .setNegativeButton(R.string.fb_cancel, null)
                .show()
            return
        }
        launch(packageName, mode)
    }

    private fun launch(packageName: String, mode: String) {
        setLoading(true)
        worker.execute {
            val result = runCatching {
                InstrumentationSettings.setModeForPackage(packageName, mode)
                BlackBoxCore.get().stopPackage(packageName, 0)
                Thread.sleep(180)
                BlackBoxCore.get().launchApk(packageName, 0)
            }
            runOnUiThread {
                setLoading(false)
                result.onSuccess { launched ->
                    if (!launched) toast("This guest has no launchable activity")
                    else if (mode == InstrumentationSettings.MODE_COMPUTER) showRuntime(packageName)
                }.onFailure { toast("Launch failed: ${it.message}") }
            }
        }
    }

    private fun chooseAgent(packageName: String) {
        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.fb_choose_trusted_title)
            .setMessage(R.string.fb_choose_trusted_body)
            .setPositiveButton(R.string.fb_choose) { _, _ ->
                pendingScriptPackage = packageName
                scriptPicker.launch(arrayOf(
                    "application/javascript",
                    "text/javascript",
                    "text/plain",
                    "application/octet-stream"
                ))
            }
            .setNegativeButton(R.string.fb_cancel, null)
            .show()
    }

    private fun importAgent(packageName: String, uri: Uri) {
        val name = displayName(uri, "agent.js")
        if (!name.lowercase(Locale.ROOT).endsWith(".js")) {
            notify("Select a JavaScript file ending in .js")
            return
        }
        setLoading(true)
        worker.execute {
            val result = runCatching {
                val directory = agentDirectory(packageName).apply { mkdirs() }
                val temporary = File(directory, "agent.js.partial")
                val destination = File(directory, "agent.js")
                val digest = MessageDigest.getInstance("SHA-256")
                var total = 0L
                contentResolver.openInputStream(uri).use { input ->
                    requireNotNull(input) { "Unable to open the selected JavaScript" }
                    FileOutputStream(temporary).use { output ->
                        val buffer = ByteArray(64 * 1024)
                        while (true) {
                            val count = input.read(buffer)
                            if (count < 0) break
                            total += count
                            if (total > MAX_AGENT_SIZE) error("JavaScript a…1946 tokens truncated…safePackage-${originalHash.take(12)}.apk")
                if (stored.exists() && !stored.delete()) error("Unable to replace the imported APK")
                if (!temporary.renameTo(stored)) error("Unable to move APK into private storage")
                if (ApkIntegrity.sha256(stored) != originalHash) error("APK integrity check failed after import")
                stored.setReadable(true, true)
                stored.setWritable(false, false)
                val install = BlackBoxCore.get().installPackageAsUser(stored, 0)
                if (!install.success) error(install.msg ?: "Virtual installation failed")
                if (ApkIntegrity.sha256(stored) != originalHash) error("Stored APK changed during installation")
                metadata.edit()
                    .putString("${archiveInfo.packageName}.sha256", originalHash)
                    .putString("${archiveInfo.packageName}.source", stored.absolutePath)
                    .putString("${archiveInfo.packageName}.abi", abi.description())
                    .putString("${archiveInfo.packageName}.version", archiveInfo.versionName)
                    .putInt("${archiveInfo.packageName}.targetSdk", archiveInfo.applicationInfo?.targetSdkVersion ?: -1)
                    .apply()
                InstrumentationSettings.setModeForPackage(archiveInfo.packageName, InstrumentationSettings.MODE_COMPUTER)
                archiveInfo.packageName
            }
            if (result.isFailure) temporary.delete()
            runOnUiThread {
                setLoading(false)
                result.onSuccess {
                    notify("$it imported and verified")
                    showWorkspace()
                }.onFailure { notify("APK import failed: ${it.message}") }
            }
        }
    }

    private fun showRuntime(packageHint: String? = null) {
        screen = Screen.RUNTIME
        resetScreen(R.id.nav_runtime, showImport = false)
        binding.toolbar.title = getString(R.string.fb_runtime_title)
        binding.toolbar.subtitle = getString(R.string.fb_runtime_subtitle)

        val packageName = settings.getString("runtime_package", packageHint) ?: packageHint
        val state = settings.getString("runtime_state", "idle") ?: "idle"
        val mode = settings.getString("runtime_mode", packageName?.let {
            InstrumentationSettings.getModeForPackage(it)
        } ?: InstrumentationSettings.MODE_CLEAN) ?: InstrumentationSettings.MODE_CLEAN
        val stateColor = when (state) {
            "local_script_active", "computer_attached" -> R.color.fb_success
            "failed" -> R.color.fb_error
            "waiting_for_attach", "loading_local_script" -> R.color.fb_warning
            else -> R.color.fb_text_secondary
        }

        binding.content.addView(pageHeading(
            getString(R.string.fb_runtime_title),
            getString(R.string.fb_runtime_subtitle)
        ))
        binding.content.addView(messageCard(
            runtimeStateLabel(state),
            packageName ?: "No guest process has reported runtime state yet.",
            stateColor
        ))

        if (mode == InstrumentationSettings.MODE_COMPUTER) {
            val command = "frida -U gadget -l path/to/agent.js"
            binding.content.addView(infoCard("Computer attach", buildString {
                append("The guest waits at Gadget until a controller attaches.\n\n")
                append(command)
            }, command))
        } else if (mode == InstrumentationSettings.MODE_LOCAL_SCRIPT) {
            val scriptName = packageName?.let { metadata.getString("$it.scriptName", null) }
            val scriptHash = packageName?.let { metadata.getString("$it.scriptSha", null) }
            binding.content.addView(infoCard(
                "On-device agent",
                buildString {
                    append(scriptName ?: "No agent selected")
                    if (scriptHash != null) append("\nSHA-256  ").append(scriptHash)
                    append("\n\nThe private agent is loaded autonomously by Frida Gadget.")
                }
            ))
        } else {
            binding.content.addView(infoCard("Clean launch", getString(R.string.fb_mode_clean_body)))
        }

        val details = listOf(
            "Guest package" to (packageName ?: "Not reported"),
            "Guest process" to (settings.getString("runtime_process", "—") ?: "—"),
            "Virtual process slot" to settings.getInt("runtime_vpid", -1).toString(),
            "Guest source" to (settings.getString("runtime_source", "—") ?: "—"),
            "Virtual user ID" to settings.getInt("runtime_user_id", -1).toString(),
            "ClassLoader" to (settings.getString("runtime_class_loader", "Not reported") ?: "Not reported"),
            "Mode" to modeLongLabel(mode),
            "Latest error" to (settings.getString("runtime_error", "None") ?: "None")
        )
        binding.content.addView(detailsCard("Process registry", details))
        binding.content.addView(outlineButton(getString(R.string.fb_refresh)) { showRuntime(packageHint) }.apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(50)).apply { topMargin = dp(14) }
        })
    }

    private fun showSettings() {
        screen = Screen.SETTINGS
        resetScreen(R.id.nav_settings, showImport = false)
        binding.toolbar.title = getString(R.string.fb_settings_title)
        binding.toolbar.subtitle = getString(R.string.fb_settings_subtitle)
        binding.content.addView(pageHeading(
            getString(R.string.fb_settings_title),
            getString(R.string.fb_settings_subtitle)
        ))

        val controls = surfaceCard()
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
        }
        controls.addView(body)
        val enabled = SwitchMaterial(this).apply {
            text = getString(R.string.fb_global_instrumentation)
            setTextColor(color(R.color.fb_text_primary))
            isChecked = settings.getBoolean(InstrumentationSettings.KEY_ENABLED, true)
        }
        val logs = SwitchMaterial(this).apply {
            text = getString(R.string.fb_advanced_logs)
            setTextColor(color(R.color.fb_text_primary))
            isChecked = settings.getBoolean(InstrumentationSettings.KEY_ADVANCED_LOGS, false)
        }
        val port = numberInput(getString(R.string.fb_base_port), settings.getInt(InstrumentationSettings.KEY_BASE_PORT, 27042))
        val count = numberInput(getString(R.string.fb_scan_count), settings.getInt(InstrumentationSettings.KEY_SCAN_COUNT, 32))
        body.addView(enabled)
        body.addView(logs)
        body.addView(port.first)
        body.addView(count.first)
        body.addView(primaryButton(getString(R.string.fb_save_settings)) {
            settings.edit()
                .putBoolean(InstrumentationSettings.KEY_ENABLED, enabled.isChecked)
                .putInt(InstrumentationSettings.KEY_BASE_PORT,
                    InstrumentationPreferenceParser.parsePort(port.second.text?.toString().orEmpty(), 27042))
                .putInt(InstrumentationSettings.KEY_SCAN_COUNT,
                    InstrumentationPreferenceParser.parseScanCount(count.second.text?.toString().orEmpty(), 32))
                .putBoolean(InstrumentationSettings.KEY_ADVANCED_LOGS, logs.isChecked)
                .apply()
            notify("Settings saved")
        }.apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(50)).apply { topMargin = dp(12) }
        })
        binding.content.addView(controls)
        binding.content.addView(messageCard(
            getString(R.string.fb_security_title),
            getString(R.string.fb_security_body),
            R.color.fb_warning
        ))
        binding.content.addView(messageCard(
            getString(R.string.fb_about_title),
            "${getString(R.string.fb_about_body)}\n\nFridaBox ${BuildConfig.VERSION_NAME}",
            R.color.fb_primary
        ))
    }

    private fun numberInput(label: String, value: Int): Pair<TextInputLayout, TextInputEditText> {
        val input = TextInputEditText(this).apply {
            setText(value.toString())
            inputType = InputType.TYPE_CLASS_NUMBER
            setTextColor(color(R.color.fb_text_primary))
        }
        return TextInputLayout(this).apply {
            hint = label
            boxBackgroundMode = TextInputLayout.BOX_BACKGROUND_OUTLINE
            boxStrokeColor = color(R.color.fb_outline)
            defaultHintTextColor = ColorStateList.valueOf(color(R.color.fb_text_secondary))
            setPadding(0, dp(12), 0, 0)
            addView(input)
        } to input
    }

    private fun pageHeading(title: String, subtitle: String): View = verticalText(title, subtitle).apply {
        setPadding(0, 0, 0, dp(18))
    }

    private fun messageCard(title: String, bodyText: String, accent: Int): View {
        return surfaceCard().apply {
            strokeColor = color(accent)
            addView(LinearLayout(this@FridaBoxActivity).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(dp(18), dp(18), dp(18), dp(18))
                addView(labelText(title, accent, 16f, true))
                addView(labelText(bodyText, R.color.fb_text_secondary, 13.5f, false).apply {
                    setPadding(0, dp(7), 0, 0)
                    setLineSpacing(0f, 1.1f)
                })
            })
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(14) }
        }
    }

    private fun infoCard(title: String, bodyText: String, copyValue: String? = null): View {
        val card = surfaceCard()
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
            addView(labelText(title, R.color.fb_text_primary, 16f, true))
            addView(labelText(bodyText, R.color.fb_text_secondary, 13f, false).apply {
                setPadding(0, dp(8), 0, 0)
                setTextIsSelectable(true)
            })
            if (copyValue != null) addView(outlineButton(getString(R.string.fb_copy_command)) {
                (getSystemService(CLIPBOARD_SERVICE) as ClipboardManager)
                    .setPrimaryClip(ClipData.newPlainText("FridaBox command", copyValue))
                notify("Command copied")
            }.apply {
                layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(46)).apply { topMargin = dp(12) }
            })
        }
        card.addView(body)
        card.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = dp(14) }
        return card
    }

    private fun detailsCard(title: String, rows: List<Pair<String, String>>): View {
        val card = surfaceCard()
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
            addView(labelText(title, R.color.fb_text_primary, 16f, true))
        }
        rows.forEach { (label, value) ->
            body.addView(labelText(label.uppercase(Locale.ROOT), R.color.fb_text_secondary, 10.5f, true).apply {
                setPadding(0, dp(13), 0, 0)
            })
            body.addView(labelText(value, R.color.fb_text_primary, 13f, false).apply { setTextIsSelectable(true) })
        }
        card.addView(body)
        card.layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT)
        return card
    }

    private fun verticalText(title: String, subtitle: String): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(labelText(title, R.color.fb_text_primary, 19f, true))
            addView(labelText(subtitle, R.color.fb_text_secondary, 12.5f, false).apply { setPadding(0, dp(3), 0, 0) })
        }
    }

    private fun surfaceCard(): MaterialCardView = MaterialCardView(this).apply {
        radius = resources.getDimension(R.dimen.fb_card_radius)
        cardElevation = 0f
        setCardBackgroundColor(color(R.color.fb_surface))
        strokeColor = color(R.color.fb_outline)
        strokeWidth = dp(1)
    }

    private fun labelText(value: String, colorResource: Int, size: Float, bold: Boolean): TextView {
        return TextView(this).apply {
            text = value
            textSize = size
            setTextColor(color(colorResource))
            if (bold) setTypeface(typeface, Typeface.BOLD)
        }
    }

    private fun badge(value: String, background: Int, foreground: Int): TextView {
        return TextView(this).apply {
            text = value
            textSize = 11f
            setTypeface(typeface, Typeface.BOLD)
            gravity = Gravity.CENTER
            setTextColor(foreground)
            backgroundTintList = ColorStateList.valueOf(background)
            this.background = rounded(background, dp(99))
            setPadding(dp(11), dp(6), dp(11), dp(6))
        }
    }

    private fun modeButton(id: Int, label: String): MaterialButton {
        return MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            this.id = id
            text = label
            textSize = 11.5f
            isAllCaps = false
            letterSpacing = 0f
            insetTop = 0
            insetBottom = 0
            setTextColor(checkedColors(color(R.color.fb_black), color(R.color.fb_text_primary)))
            strokeColor = checkedColors(color(R.color.fb_primary), color(R.color.fb_outline))
            backgroundTintList = checkedColors(color(R.color.fb_primary), color(R.color.fb_surface))
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f)
        }
    }

    private fun primaryButton(label: String, action: (View) -> Unit): MaterialButton {
        return MaterialButton(this).apply {
            text = label
            isAllCaps = false
            letterSpacing = 0f
            cornerRadius = dp(15)
            insetTop = 0
            insetBottom = 0
            setTextColor(color(R.color.fb_black))
            backgroundTintList = ColorStateList.valueOf(color(R.color.fb_primary))
            setOnClickListener(action)
        }
    }

    private fun outlineButton(label: String, action: (View) -> Unit): MaterialButton {
        return MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = label
            isAllCaps = false
            letterSpacing = 0f
            cornerRadius = dp(15)
            insetTop = 0
            insetBottom = 0
            setTextColor(color(R.color.fb_text_primary))
            strokeColor = ColorStateList.valueOf(color(R.color.fb_outline))
            backgroundTintList = ColorStateList.valueOf(color(R.color.fb_transparent))
            setOnClickListener(action)
        }
    }

    private fun resetScreen(navId: Int, showImport: Boolean): Int {
        screenGeneration += 1
        binding.content.removeAllViews()
        binding.contentScroll.scrollTo(0, 0)
        binding.importFab.isVisible = showImport
        changingNavigation = true
        binding.bottomNavigation.selectedItemId = navId
        changingNavigation = false
        setLoading(false)
        return screenGeneration
    }

    private fun setLoading(loading: Boolean) {
        if (::binding.isInitialized) binding.progress.isVisible = loading
    }

    private fun checkedColors(checked: Int, unchecked: Int): ColorStateList {
        return ColorStateList(
            arrayOf(intArrayOf(android.R.attr.state_checked), intArrayOf()),
            intArrayOf(checked, unchecked)
        )
    }

    private fun runtimeStateLabel(state: String): String = when (state) {
        "local_script_active" -> "On-device agent active"
        "computer_attached" -> "Computer attached"
        "waiting_for_attach" -> "Waiting for computer"
        "loading_local_script" -> "Loading on-device agent"
        "failed" -> "Instrumentation failed"
        "disabled" -> "Clean runtime"
        else -> "Runtime idle"
    }

    private fun modeShortLabel(mode: String): String = when (mode) {
        InstrumentationSettings.MODE_LOCAL_SCRIPT -> getString(R.string.fb_mode_local)
        InstrumentationSettings.MODE_CLEAN -> getString(R.string.fb_mode_clean)
        else -> getString(R.string.fb_mode_computer)
    }

    private fun modeLongLabel(mode: String): String = when (mode) {
        InstrumentationSettings.MODE_LOCAL_SCRIPT -> getString(R.string.fb_mode_local_title)
        InstrumentationSettings.MODE_CLEAN -> getString(R.string.fb_mode_clean_title)
        else -> getString(R.string.fb_mode_computer_title)
    }

    private fun modeColor(mode: String, background: Boolean): Int {
        val resource = when (mode) {
            InstrumentationSettings.MODE_LOCAL_SCRIPT -> if (background) R.color.fb_surface_tint else R.color.fb_success
            InstrumentationSettings.MODE_CLEAN -> if (background) R.color.fb_surface_tint else R.color.fb_text_secondary
            else -> if (background) R.color.fb_surface_tint else R.color.fb_warning
        }
        return color(resource)
    }

    private fun displayName(uri: Uri, fallback: String): String {
        contentResolver.query(uri, arrayOf(OpenableColumns.DISPLAY_NAME), null, null, null)?.use {
            if (it.moveToFirst()) return it.getString(0) ?: fallback
        }
        return uri.lastPathSegment ?: fallback
    }

    private fun agentDirectory(packageName: String): File =
        File(File(filesDir, "fridabox-agents"), safePackageName(packageName))

    private fun deleteAgentDirectory(packageName: String) {
        val root = File(filesDir, "fridabox-agents").canonicalFile
        val directory = agentDirectory(packageName).canonicalFile
        if (!directory.path.startsWith(root.path + File.separator)) return
        directory.listFiles()?.forEach { child -> if (child.isFile) child.delete() }
        directory.delete()
    }

    private fun safePackageName(packageName: String): String =
        packageName.replace(Regex("[^A-Za-z0-9._-]"), "_")

    private fun rounded(fill: Int, radius: Int) = GradientDrawable().apply {
        shape = GradientDrawable.RECTANGLE
        setColor(fill)
        cornerRadius = radius.toFloat()
    }

    private fun color(resource: Int): Int = ContextCompat.getColor(this, resource)
    private fun space(width: Int, height: Int) = Space(this).apply {
        layoutParams = LinearLayout.LayoutParams(width, height)
    }
    private fun notify(message: String) = Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    private fun toast(message: String) = Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()

    companion object {
        private const val MAX_AGENT_SIZE = 16L * 1024L * 1024L
        private const val MENU_DETAILS = 1
        private const val MENU_RUNTIME = 2
        private const val MENU_CLEAR = 3
        private const val MENU_REMOVE = 4
    }
}

