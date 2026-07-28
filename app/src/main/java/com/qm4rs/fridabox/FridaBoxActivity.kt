package com.qm4rs.fridabox

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.animation.PropertyValuesHolder
import android.app.Dialog
import android.content.Context
import android.content.SharedPreferences
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.OpenableColumns
import android.text.InputType
import android.view.Gravity
import android.view.HapticFeedbackConstants
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.view.WindowManager
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator
import android.widget.FrameLayout
import android.widget.GridLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Space
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.core.widget.NestedScrollView
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
import top.niunaijun.blackbox.instrumentation.RuntimeBridgeCatalog
import top.niunaijun.blackbox.utils.ProcessAbi
import com.qm4rs.fridabox.databinding.ActivityFridaboxBinding
import java.io.File
import java.io.FileOutputStream
import java.security.MessageDigest
import java.util.Locale
import java.util.concurrent.Executors

/** Product workspace for importing, configuring, and launching FridaBox guests. */
class FridaBoxActivity : AppCompatActivity() {
    private enum class Screen { WORKSPACE, GADGETS, SETTINGS }

    private data class ImportBubbleViews(
        val scrim: View,
        val actions: List<MaterialButton>
    )

    private lateinit var binding: ActivityFridaboxBinding
    private val worker = Executors.newSingleThreadExecutor()
    private var screen = Screen.WORKSPACE
    private var screenGeneration = 0
    private var catalogRequest = 0
    private var installedAppsRequest = 0
    private var changingNavigation = false
    private var pendingScriptPackage: String? = null
    private var importMenuOverlay: FrameLayout? = null
    private var importMenuAnimator: AnimatorSet? = null
    private var importMenuAnimationGeneration = 0
    private var importMenuClosing = false

    @Suppress("DEPRECATION")
    private val settings: SharedPreferences by lazy {
        getSharedPreferences(InstrumentationSettings.PREFERENCES, Context.MODE_MULTI_PROCESS)
    }
    private val metadata: SharedPreferences by lazy {
        getSharedPreferences("fridabox_imports", Context.MODE_PRIVATE)
    }
    private val gadgetManager: GadgetManager by lazy { GadgetManager(applicationContext) }

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
        settings.edit()
            .remove(InstrumentationSettings.KEY_ENABLED)
            .remove(InstrumentationSettings.KEY_ADVANCED_LOGS)
            .apply()

        binding.importFabIcon.setOnClickListener { showImportActions() }
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            if (changingNavigation) return@setOnItemSelectedListener true
            when (item.itemId) {
                R.id.nav_workspace -> showWorkspace()
                R.id.nav_gadgets -> showGadgets()
                R.id.nav_settings -> showSettings()
                else -> return@setOnItemSelectedListener false
            }
            animateNavigationSelection(item.itemId)
            animateContentIn()
            true
        }
        binding.bottomNavigation.setOnItemReselectedListener { item ->
            animateNavigationSelection(item.itemId)
        }
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (importMenuOverlay != null) {
                    dismissImportActions()
                    return
                }
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
        dismissImportActions(immediate = true)
        worker.shutdown()
        super.onDestroy()
    }

    private fun showWorkspace() {
        screen = Screen.WORKSPACE
        val generation = resetScreen(R.id.nav_workspace, showImport = true)
        binding.toolbar.title = getString(R.string.fb_brand)
        binding.toolbar.subtitle = getString(R.string.fb_brand_tagline)

        binding.content.requestFocus()
        binding.contentScroll.post {
            binding.content.requestFocus()
            binding.contentScroll.scrollTo(0, 0)
        }
        val screenWidthDp = resources.configuration.screenWidthDp
        val columns = when {
            screenWidthDp < 600 -> 4
            screenWidthDp < 840 -> 6
            else -> 7
        }
        val cellSizeDp = ((screenWidthDp - 36) / columns).coerceIn(78, 112)
        val minimumRows = ((resources.configuration.screenHeightDp - 276) / cellSizeDp)
            .coerceAtLeast(4)
        val launcher = GridLayout(this).apply {
            columnCount = columns
            alignmentMode = GridLayout.ALIGN_BOUNDS
            useDefaultMargins = false
            setPadding(0, 0, 0, 0)
        }
        binding.content.addView(launcher, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ))
        setLoading(true)
        worker.execute {
            val result = runCatching {
                BlackBoxCore.get().getInstalledPackages(PackageManager.GET_META_DATA, 0)
                    .sortedBy { info ->
                        runCatching {
                            info.applicationInfo?.loadLabel(BlackBoxCore.getPackageManager())?.toString()
                        }.getOrNull().orEmpty().ifBlank { info.packageName }.lowercase(Locale.ROOT)
                    }
            }
            runOnUiThread {
                if (generation != screenGeneration || isFinishing) return@runOnUiThread
                setLoading(false)
                result.onSuccess { packages ->
                    packages.forEach { launcher.addView(appIcon(it, cellSizeDp)) }
                    val occupiedSlots = packages.size
                    val completedRows = (occupiedSlots + columns - 1) / columns
                    val totalSlots = maxOf(minimumRows, completedRows) * columns
                    repeat(totalSlots - occupiedSlots) {
                        launcher.addView(emptyLauncherCell(cellSizeDp))
                    }
                }.onFailure { error ->
                    binding.content.addView(messageCard(
                        "Workspace unavailable",
                        error.message ?: "Unable to read virtual applications",
                        R.color.fb_error
                    ))
                }
            }
        }
    }

    private fun appIcon(info: PackageInfo, cellSizeDp: Int): View {
        val packageName = info.packageName
        val appLabel = runCatching {
            info.applicationInfo?.loadLabel(BlackBoxCore.getPackageManager())?.toString()
        }.getOrNull().orEmpty().ifBlank { packageName.substringAfterLast('.') }
        return FrameLayout(this).apply {
            contentDescription = appLabel
            isClickable = true
            isFocusable = true
            background = ContextCompat.getDrawable(this@FridaBoxActivity, R.drawable.bg_launcher_cell)
            setOnClickListener { showAppLaunchDialog(info, this) }
            addView(ImageView(this@FridaBoxActivity).apply {
                runCatching {
                    setImageDrawable(info.applicationInfo?.loadIcon(BlackBoxCore.getPackageManager()))
                }
                scaleType = ImageView.ScaleType.FIT_CENTER
            }, FrameLayout.LayoutParams(
                dp((cellSizeDp * 0.62f).toInt().coerceIn(48, 64)),
                dp((cellSizeDp * 0.62f).toInt().coerceIn(48, 64)),
                Gravity.CENTER
            ))
            layoutParams = launcherCellLayoutParams(cellSizeDp)
        }
    }

    private fun emptyLauncherCell(cellSizeDp: Int): View = View(this).apply {
        importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
        background = ContextCompat.getDrawable(this@FridaBoxActivity, R.drawable.bg_launcher_cell_empty)
        layoutParams = launcherCellLayoutParams(cellSizeDp)
    }

    private fun launcherCellLayoutParams(cellSizeDp: Int): GridLayout.LayoutParams {
        return GridLayout.LayoutParams().apply {
            width = 0
            height = dp(cellSizeDp)
            columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
            setMargins(dp(4), dp(4), dp(4), dp(4))
        }
    }

    private fun showAppLaunchDialog(info: PackageInfo, source: View) {
        val dialog = Dialog(this)
        val root = FrameLayout(this).apply {
            importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
        }
        val scrim = View(this).apply {
            alpha = 0f
            setBackgroundColor(Color.BLACK)
        }
        root.addView(scrim, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        var dismissAnimated: ((() -> Unit)?) -> Unit = { after ->
            dialog.dismiss()
            resetAppIconMorph(source)
            after?.invoke()
        }
        val panel = appCard(info) { after -> dismissAnimated(after) }.apply {
            isClickable = true
            alpha = 0f
        }
        val popoverWidth = minOf(
            resources.displayMetrics.widthPixels - dp(24),
            dp(300)
        )
        root.addView(panel, FrameLayout.LayoutParams(
            popoverWidth,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            Gravity.TOP or Gravity.START
        ).apply {
            leftMargin = dp(12)
            topMargin = dp(12)
        })
        scrim.setOnClickListener { dismissAnimated(null) }
        dialog.setContentView(root)
        dialog.setCanceledOnTouchOutside(false)
        dialog.setCancelable(false)
        dialog.setOnKeyListener { _, keyCode, event ->
            if (keyCode == KeyEvent.KEYCODE_BACK && event.action == KeyEvent.ACTION_UP) {
                dismissAnimated(null)
                true
            } else {
                false
            }
        }
        dialog.setOnDismissListener { resetAppIconMorph(source) }
        dialog.window?.apply {
            setBackgroundDrawable(ColorDrawable(android.graphics.Color.TRANSPARENT))
            addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
            attributes = attributes.apply { dimAmount = 0.18f }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                attributes = attributes.apply { blurBehindRadius = dp(24) }
            }
        }
        dialog.show()
        dialog.window?.setLayout(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )
        animateAppIconMorph(source, opening = true)

        root.post {
            if (!dialog.isShowing || panel.width == 0 || panel.height == 0) return@post
            val sourceLocation = IntArray(2)
            val rootLocation = IntArray(2)
            source.getLocationOnScreen(sourceLocation)
            root.getLocationOnScreen(rootLocation)
            val sourceCenterX = sourceLocation[0] - rootLocation[0] + source.width / 2f
            val sourceCenterY = sourceLocation[1] - rootLocation[1] + source.height / 2f
            val margin = dp(12)
            val idealLeft = (sourceCenterX - dp(44)).toInt()
            val idealTop = (sourceCenterY - dp(44)).toInt()
            val maxLeft = (root.width - panel.width - margin).coerceAtLeast(margin)
            val maxTop = (root.height - panel.height - margin).coerceAtLeast(margin)
            panel.layoutParams = (panel.layoutParams as FrameLayout.LayoutParams).apply {
                leftMargin = idealLeft.coerceIn(margin, maxLeft)
                topMargin = idealTop.coerceIn(margin, maxTop)
            }

            panel.post panelReady@ {
                if (!dialog.isShowing || !panel.isAttachedToWindow) return@panelReady
                val pivotX = (sourceCenterX - panel.left).coerceIn(0f, panel.width.toFloat())
                val pivotY = (sourceCenterY - panel.top).coerceIn(0f, panel.height.toFloat())
                val startScale = (source.width.toFloat() / panel.width).coerceIn(0.18f, 0.28f)
                panel.apply {
                    this.pivotX = pivotX
                    this.pivotY = pivotY
                    scaleX = startScale
                    scaleY = startScale
                    rotation = -0.8f
                    alpha = 0.42f
                }
                val body = panel.getChildAt(0) as? LinearLayout
                val animatedChildren = body?.let { container ->
                    (0 until container.childCount).map { container.getChildAt(it) }
                }.orEmpty()
                animatedChildren.forEach { child ->
                    child.alpha = 0f
                    child.scaleX = 0.94f
                    child.scaleY = 0.94f
                    child.translationY = dp(12).toFloat()
                }

                addAppLaunchRipple(root, panel, sourceCenterX, sourceCenterY, delay = 0L)
                var animation: AnimatorSet? = null
                val openAnimators = mutableListOf<Animator>(
                    ObjectAnimator.ofFloat(scrim, View.ALPHA, 0f, 0.14f).apply { duration = 190L },
                    ObjectAnimator.ofPropertyValuesHolder(
                        panel,
                        PropertyValuesHolder.ofFloat(View.ALPHA, 0.42f, 1f),
                        PropertyValuesHolder.ofFloat(View.SCALE_X, startScale, 1f),
                        PropertyValuesHolder.ofFloat(View.SCALE_Y, startScale, 1f),
                        PropertyValuesHolder.ofFloat(View.ROTATION, -0.8f, 0f)
                    ).apply {
                        duration = 360L
                        interpolator = OvershootInterpolator(0.48f)
                    }
                )
                animatedChildren.forEachIndexed { index, child ->
                    openAnimators += ObjectAnimator.ofPropertyValuesHolder(
                        child,
                        PropertyValuesHolder.ofFloat(View.ALPHA, 0f, 1f),
                        PropertyValuesHolder.ofFloat(View.SCALE_X, 0.94f, 1f),
                        PropertyValuesHolder.ofFloat(View.SCALE_Y, 0.94f, 1f),
                        PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, dp(12).toFloat(), 0f)
                    ).apply {
                        duration = 215L
                        startDelay = 95L + index * 28L
                        interpolator = OvershootInterpolator(0.88f)
                    }
                }
                animation = AnimatorSet().apply {
                    playTogether(openAnimators)
                    start()
                }

                var closing = false
                dismissAnimated = dismiss@ { after ->
                    if (closing) return@dismiss
                    closing = true
                    animation?.cancel()
                    animateAppIconMorph(source, opening = false)
                    val closeAnimators = mutableListOf<Animator>(
                        ObjectAnimator.ofFloat(scrim, View.ALPHA, scrim.alpha, 0f).apply { duration = 150L },
                        ObjectAnimator.ofPropertyValuesHolder(
                            panel,
                            PropertyValuesHolder.ofFloat(View.ALPHA, panel.alpha, 0.18f),
                            PropertyValuesHolder.ofFloat(View.SCALE_X, panel.scaleX, startScale),
                            PropertyValuesHolder.ofFloat(View.SCALE_Y, panel.scaleY, startScale),
                            PropertyValuesHolder.ofFloat(View.ROTATION, panel.rotation, 0.6f)
                        ).apply {
                            duration = 255L
                            interpolator = AccelerateInterpolator(1.15f)
                        }
                    )
                    animatedChildren.asReversed().forEachIndexed { index, child ->
                        closeAnimators += ObjectAnimator.ofPropertyValuesHolder(
                            child,
                            PropertyValuesHolder.ofFloat(View.ALPHA, child.alpha, 0f),
                            PropertyValuesHolder.ofFloat(View.SCALE_X, child.scaleX, 0.92f),
                            PropertyValuesHolder.ofFloat(View.SCALE_Y, child.scaleY, 0.92f)
                        ).apply {
                            duration = 105L
                            startDelay = index * 18L
                        }
                    }
                    animation = AnimatorSet().apply {
                        playTogether(closeAnimators)
                        addListener(object : AnimatorListenerAdapter() {
                            override fun onAnimationEnd(animator: Animator) {
                                if (dialog.isShowing) dialog.dismiss()
                                resetAppIconMorph(source)
                                after?.invoke()
                            }
                        })
                        start()
                    }
                }
            }
        }
    }

    private fun appCard(
        info: PackageInfo,
        dismiss: (after: (() -> Unit)?) -> Unit
    ): MaterialCardView {
        val packageName = info.packageName
        val mode = InstrumentationSettings.getModeForPackage(packageName)
        val appLabel = runCatching {
            info.applicationInfo?.loadLabel(BlackBoxCore.getPackageManager())?.toString()
        }.getOrNull().orEmpty().ifBlank { packageName.substringAfterLast('.') }

        val card = surfaceCard().apply {
            radius = dp(28).toFloat()
            setCardBackgroundColor(color(R.color.fb_glass_surface_strong))
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
            background = rounded(color(R.color.fb_glass_surface_soft), dp(16))
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
            dismiss { launchConfigured(packageName) }
        }, LinearLayout.LayoutParams(0, dp(50), 1f))
        actions.addView(space(dp(10), 1))
        actions.addView(outlineButton(getString(R.string.fb_more)) { anchor ->
            showAppMenu(anchor, info, appLabel)
        }, LinearLayout.LayoutParams(0, dp(50), 0.56f))
        body.addView(actions)
        return card
    }

    private fun animateAppIconMorph(source: View, opening: Boolean) {
        source.animate().cancel()
        val squash = ObjectAnimator.ofPropertyValuesHolder(
            source,
            PropertyValuesHolder.ofFloat(View.SCALE_X, source.scaleX, if (opening) 1.08f else 0.94f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, source.scaleY, if (opening) 0.88f else 1.06f)
        ).apply { duration = 70L }
        val stretch = ObjectAnimator.ofPropertyValuesHolder(
            source,
            PropertyValuesHolder.ofFloat(View.SCALE_X, if (opening) 1.08f else 0.94f, if (opening) 0.94f else 1.05f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, if (opening) 0.88f else 1.06f, if (opening) 1.06f else 0.95f),
            PropertyValuesHolder.ofFloat(View.ALPHA, source.alpha, if (opening) 0.38f else 0.84f)
        ).apply { duration = 85L }
        val settle = ObjectAnimator.ofPropertyValuesHolder(
            source,
            PropertyValuesHolder.ofFloat(View.SCALE_X, if (opening) 0.94f else 1.05f, if (opening) 0.96f else 1f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, if (opening) 1.06f else 0.95f, if (opening) 0.96f else 1f),
            PropertyValuesHolder.ofFloat(View.ALPHA, if (opening) 0.38f else 0.84f, if (opening) 0.22f else 1f)
        ).apply {
            duration = 145L
            interpolator = OvershootInterpolator(0.9f)
        }
        AnimatorSet().apply {
            playSequentially(squash, stretch, settle)
            start()
        }
    }

    private fun resetAppIconMorph(source: View) {
        source.animate().cancel()
        source.scaleX = 1f
        source.scaleY = 1f
        source.rotation = 0f
        source.alpha = 1f
    }

    private fun addAppLaunchRipple(
        root: FrameLayout,
        panel: View,
        centerX: Float,
        centerY: Float,
        delay: Long
    ) {
        val size = dp(72)
        val ripple = View(this).apply {
            alpha = 0f
            scaleX = 0.28f
            scaleY = 0.28f
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.TRANSPARENT)
                setStroke(dp(2), color(R.color.fb_glass_highlight))
            }
        }
        root.addView(ripple, root.indexOfChild(panel).coerceAtLeast(1), FrameLayout.LayoutParams(size, size).apply {
            leftMargin = (centerX - size / 2f).toInt()
            topMargin = (centerY - size / 2f).toInt()
        })
        AnimatorSet().apply {
            playTogether(
                ObjectAnimator.ofFloat(ripple, View.ALPHA, 0f, 0.58f, 0f),
                ObjectAnimator.ofFloat(ripple, View.SCALE_X, 0.28f, 1.32f),
                ObjectAnimator.ofFloat(ripple, View.SCALE_Y, 0.28f, 1.32f)
            )
            startDelay = delay
            duration = 410L
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    (ripple.parent as? ViewGroup)?.removeView(ripple)
                }
            })
            start()
        }
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
            background = rounded(color(R.color.fb_glass_surface_soft), dp(16))
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
        if (mode != InstrumentationSettings.MODE_CLEAN
            && settings.getBoolean(InstrumentationSettings.KEY_ENABLED, true)
            && gadgetManager.selected() == null) {
            notify(getString(R.string.fb_gadget_required))
            showGadgets()
            return
        }
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
            showGlassAlert(MaterialAlertDialogBuilder(this)
                .setTitle(R.string.fb_computer_launch_title)
                .setMessage(R.string.fb_computer_launch_body)
                .setPositiveButton(R.string.fb_launch) { _, _ -> launch(packageName, mode) }
                .setNegativeButton(R.string.fb_cancel, null))
            return
        }
        launch(packageName, mode)
    }

    private fun launch(packageName: String, mode: String) {
        settings.edit()
            .putString("runtime_package", packageName)
            .putString("runtime_mode", mode)
            .putString("runtime_state", when (mode) {
                InstrumentationSettings.MODE_LOCAL_SCRIPT -> "loading_local_script"
                InstrumentationSettings.MODE_COMPUTER -> "waiting_for_attach"
                else -> "idle"
            })
            .putString("runtime_error", null)
            .apply()
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
                }.onFailure { toast("Launch failed: ${it.message}") }
            }
        }
    }

    private fun chooseAgent(packageName: String) {
        showGlassAlert(MaterialAlertDialogBuilder(this)
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
            .setNegativeButton(R.string.fb_cancel, null))
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
                            if (total > MAX_AGENT_SIZE) error("JavaScript agent exceeds the 16 MiB limit")
                            digest.update(buffer, 0, count)
                            output.write(buffer, 0, count)
                        }
                        output.fd.sync()
                    }
                }
                if (total == 0L) error("JavaScript agent is empty")
                if (destination.exists() && !destination.delete()) error("Unable to replace the previous agent")
                if (!temporary.renameTo(destination)) error("Unable to store the selected agent")
                if (!destination.setReadable(true, true) || !destination.setWritable(false, false)) {
                    error("Unable to secure the selected agent")
                }
                val sha = digest.digest().joinToString("") { "%02x".format(it) }
                InstrumentationSettings.setScriptPathForPackage(packageName, destination.absolutePath)
                InstrumentationSettings.setModeForPackage(packageName, InstrumentationSettings.MODE_LOCAL_SCRIPT)
                metadata.edit()
                    .putString("$packageName.scriptName", name)
                    .putString("$packageName.scriptSha", sha)
                    .putLong("$packageName.scriptSize", total)
                    .apply()
                BlackBoxCore.get().stopPackage(packageName, 0)
                name
            }
            runOnUiThread {
                setLoading(false)
                result.onSuccess {
                    notify("$it is ready for on-device launch")
                    showWorkspace()
                }.onFailure { error ->
                    File(agentDirectory(packageName), "agent.js.partial").delete()
                    notify("Agent import failed: ${error.message}")
                }
            }
        }
    }

    private fun showAppMenu(anchor: View, info: PackageInfo, appLabel: String) {
        val popup = PopupWindow(this).apply {
            width = dp(250)
            height = ViewGroup.LayoutParams.WRAP_CONTENT
            isFocusable = true
            isOutsideTouchable = true
            setBackgroundDrawable(ColorDrawable(android.graphics.Color.TRANSPARENT))
            elevation = dp(14).toFloat()
        }
        val panel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(10), dp(10), dp(10), dp(2))
            background = ContextCompat.getDrawable(this@FridaBoxActivity, R.drawable.bg_glass_popup)
        }
        panel.addView(menuActionButton(getString(R.string.fb_details), R.drawable.ic_fb_details) {
            popup.dismiss()
            showAppDetails(info, appLabel)
        })
        panel.addView(menuActionButton(getString(R.string.fb_clear_data), R.drawable.ic_fb_clear) {
            popup.dismiss()
            clearApp(info.packageName)
        })
        panel.addView(menuActionButton(getString(R.string.fb_remove_guest), R.drawable.ic_fb_remove) {
            popup.dismiss()
            removeApp(info.packageName, appLabel)
        })
        popup.contentView = panel
        popup.showAtLocation(anchor, Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL, 0, dp(28))
    }

    private fun menuActionButton(label: String, iconResource: Int, action: () -> Unit): MaterialButton {
        return importActionButton(label, iconResource, action)
    }

    private fun showAppDetails(info: PackageInfo, appLabel: String) {
        val packageName = info.packageName
        val details = buildString {
            append(appLabel).append('\n').append(packageName)
            append("\n\nVersion  ").append(info.versionName ?: "—")
            append("\nTarget SDK  ").append(metadata.getInt("$packageName.targetSdk", info.applicationInfo?.targetSdkVersion ?: -1))
            append("\nABI  ").append(metadata.getString("$packageName.abi", "Unknown"))
            append("\n\nSource\n").append(metadata.getString("$packageName.source", "Unknown"))
            append("\n\nAPK SHA-256\n").append(metadata.getString("$packageName.sha256", "Unknown"))
        }
        showGlassAlert(MaterialAlertDialogBuilder(this)
            .setTitle(R.string.fb_details)
            .setMessage(details)
            .setPositiveButton(android.R.string.ok, null))
    }

    private fun clearApp(packageName: String) {
        setLoading(true)
        worker.execute {
            val result = runCatching {
                BlackBoxCore.get().stopPackage(packageName, 0)
                BlackBoxCore.get().clearPackage(packageName, 0)
            }
            runOnUiThread {
                setLoading(false)
                result.onSuccess { notify("Guest data cleared") }
                    .onFailure { notify("Unable to clear guest data: ${it.message}") }
            }
        }
    }

    private fun removeApp(packageName: String, appLabel: String) {
        showGlassAlert(MaterialAlertDialogBuilder(this)
            .setTitle(getString(R.string.fb_remove_title))
            .setMessage("$appLabel\n\n${getString(R.string.fb_remove_body)}")
            .setPositiveButton(R.string.fb_remove) { _, _ ->
                setLoading(true)
                worker.execute {
                    val result = runCatching {
                        BlackBoxCore.get().stopPackage(packageName, 0)
                        BlackBoxCore.get().uninstallPackageAsUser(packageName, 0)
                        deleteAgentDirectory(packageName)
                        InstrumentationSettings.clearPackage(packageName)
                        metadata.edit()
                            .remove("$packageName.scriptName")
                            .remove("$packageName.scriptSha")
                            .remove("$packageName.scriptSize")
                            .apply()
                    }
                    runOnUiThread {
                        setLoading(false)
                        result.onSuccess { showWorkspace() }
                            .onFailure { notify("Unable to remove guest: ${it.message}") }
                    }
                }
            }
            .setNegativeButton(R.string.fb_cancel, null))
    }

    private fun showGlassAlert(builder: MaterialAlertDialogBuilder): AlertDialog {
        return builder.create().also { dialog ->
            dialog.setOnShowListener {
                dialog.window?.apply {
                    setBackgroundDrawable(ContextCompat.getDrawable(
                        this@FridaBoxActivity,
                        R.drawable.bg_glass_popup
                    ))
                    addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
                    attributes = attributes.apply { dimAmount = 0.42f }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                        attributes = attributes.apply { blurBehindRadius = dp(36) }
                    }
                }
            }
            dialog.show()
        }
    }

    private fun openApkPicker() {
        apkPicker.launch(arrayOf("application/vnd.android.package-archive", "application/octet-stream"))
    }

    private fun showImportActions() {
        if (importMenuOverlay != null) {
            dismissImportActions()
            return
        }

        val root = binding.root
        val fab = binding.importFabIcon
        if (fab.width == 0 || fab.height == 0 || root.width == 0) {
            fab.post { if (!isFinishing) showImportActions() }
            return
        }

        importMenuClosing = false
        val overlay = FrameLayout(this).apply {
            isClickable = true
            isFocusable = true
            importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
        }
        importMenuOverlay = overlay
        root.addView(
            overlay,
            root.indexOfChild(fab).coerceAtLeast(0),
            ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )

        val scrim = View(this).apply {
            alpha = 0f
            setBackgroundColor(Color.BLACK)
            setOnClickListener { dismissImportActions() }
        }
        overlay.addView(scrim, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ))

        val actionWidth = dp(232)
        val actionHeight = dp(56)
        val actionGap = dp(10)
        val rightMargin = (root.width - fab.right).coerceAtLeast(dp(12))
        val entries = listOf(
            Triple(getString(R.string.fb_import_from_apps), R.drawable.ic_fb_apps) {
                showInstalledAppsBrowser()
            },
            Triple(getString(R.string.fb_import_from_file), R.drawable.ic_fb_file) {
                openApkPicker()
            }
        )
        val actions = entries.mapIndexed { index, entry ->
            val button = importBubbleActionButton(entry.first, entry.second) {
                dismissImportActions(after = entry.third)
            }
            val distanceFromFab = entries.size - index
            val desiredTop = fab.top - distanceFromFab * (actionHeight + actionGap)
            overlay.addView(button, FrameLayout.LayoutParams(actionWidth, actionHeight, Gravity.TOP or Gravity.END).apply {
                topMargin = desiredTop.coerceAtLeast(dp(12))
                this.rightMargin = rightMargin
            })
            button.apply {
                alpha = 0f
                scaleX = 0.28f
                scaleY = 0.28f
                translationX = dp(16).toFloat()
                translationY = dp(42).toFloat()
                pivotX = actionWidth.toFloat()
                pivotY = actionHeight.toFloat()
            }
        }
        overlay.tag = ImportBubbleViews(scrim, actions)

        addImportRipple(overlay, fab, delay = 0L)
        addImportRipple(overlay, fab, delay = 90L)

        val animationToken = ++importMenuAnimationGeneration
        importMenuAnimator?.cancel()
        val animators = mutableListOf<Animator>(
            importFabMorph(open = true),
            ObjectAnimator.ofFloat(scrim, View.ALPHA, 0f, 0.18f).apply { duration = 240L }
        )
        actions.forEachIndexed { index, button ->
            animators += ObjectAnimator.ofPropertyValuesHolder(
                button,
                PropertyValuesHolder.ofFloat(View.ALPHA, 0f, 1f),
                PropertyValuesHolder.ofFloat(View.SCALE_X, 0.28f, 1f),
                PropertyValuesHolder.ofFloat(View.SCALE_Y, 0.28f, 1f),
                PropertyValuesHolder.ofFloat(View.TRANSLATION_X, dp(16).toFloat(), 0f),
                PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, dp(42).toFloat(), 0f)
            ).apply {
                duration = 390L
                startDelay = if (index == actions.lastIndex) 75L else 135L
                interpolator = OvershootInterpolator(1.35f)
            }
        }
        importMenuAnimator = AnimatorSet().apply {
            playTogether(animators)
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    if (animationToken == importMenuAnimationGeneration) importMenuAnimator = null
                }
            })
            start()
        }
        fab.announceForAccessibility(getString(R.string.fb_import))
    }

    private fun importBubbleActionButton(
        label: String,
        iconResource: Int,
        action: () -> Unit
    ): MaterialButton {
        return importActionButton(label, iconResource, action).apply {
            cornerRadius = dp(28)
            backgroundTintList = ColorStateList.valueOf(color(R.color.fb_glass_surface_strong))
            strokeColor = ColorStateList.valueOf(color(R.color.fb_glass_outline))
            strokeWidth = dp(1)
            elevation = dp(12).toFloat()
            setPadding(dp(20), 0, dp(20), 0)
        }
    }

    private fun dismissImportActions(
        after: (() -> Unit)? = null,
        immediate: Boolean = false
    ) {
        val overlay = importMenuOverlay ?: run {
            after?.invoke()
            return
        }
        if (importMenuClosing && !immediate) return
        importMenuClosing = true
        val animationToken = ++importMenuAnimationGeneration
        importMenuAnimator?.cancel()
        importMenuAnimator = null

        val fab = binding.importFabIcon
        val views = overlay.tag as? ImportBubbleViews
        if (immediate || views == null || !overlay.isAttachedToWindow) {
            (overlay.parent as? ViewGroup)?.removeView(overlay)
            importMenuOverlay = null
            importMenuClosing = false
            resetImportFab()
            after?.invoke()
            return
        }

        val animators = mutableListOf<Animator>(
            importFabMorph(open = false),
            ObjectAnimator.ofFloat(views.scrim, View.ALPHA, views.scrim.alpha, 0f).apply {
                duration = 180L
            }
        )
        views.actions.asReversed().forEachIndexed { index, button ->
            animators += ObjectAnimator.ofPropertyValuesHolder(
                button,
                PropertyValuesHolder.ofFloat(View.ALPHA, button.alpha, 0f),
                PropertyValuesHolder.ofFloat(View.SCALE_X, button.scaleX, 0.35f),
                PropertyValuesHolder.ofFloat(View.SCALE_Y, button.scaleY, 0.35f),
                PropertyValuesHolder.ofFloat(View.TRANSLATION_X, button.translationX, dp(14).toFloat()),
                PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, button.translationY, dp(36).toFloat())
            ).apply {
                duration = 190L
                startDelay = index * 28L
                interpolator = AccelerateInterpolator(1.4f)
            }
        }
        importMenuAnimator = AnimatorSet().apply {
            playTogether(animators)
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    if (animationToken != importMenuAnimationGeneration) return
                    (overlay.parent as? ViewGroup)?.removeView(overlay)
                    importMenuOverlay = null
                    importMenuAnimator = null
                    importMenuClosing = false
                    resetImportFab()
                    after?.invoke()
                }
            })
            start()
        }
    }

    private fun importFabMorph(open: Boolean): AnimatorSet {
        val fab = binding.importFabIcon
        val squash = ObjectAnimator.ofPropertyValuesHolder(
            fab,
            PropertyValuesHolder.ofFloat(View.SCALE_X, fab.scaleX, if (open) 1.22f else 0.82f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, fab.scaleY, if (open) 0.72f else 1.18f),
            PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, fab.translationY, dp(4).toFloat())
        ).apply { duration = 95L }
        val stretch = ObjectAnimator.ofPropertyValuesHolder(
            fab,
            PropertyValuesHolder.ofFloat(View.SCALE_X, if (open) 1.22f else 0.82f, if (open) 0.82f else 1.18f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, if (open) 0.72f else 1.18f, if (open) 1.20f else 0.78f),
            PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, dp(4).toFloat(), -dp(3).toFloat()),
            PropertyValuesHolder.ofFloat(View.ROTATION, fab.rotation, if (open) 145f else 35f)
        ).apply {
            duration = 115L
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationStart(animation: Animator) {
                    fab.setImageResource(if (open) R.drawable.ic_fb_close else R.drawable.ic_fb_import)
                    fab.contentDescription = getString(if (open) R.string.fb_close else R.string.fb_import)
                }
            })
        }
        val settle = ObjectAnimator.ofPropertyValuesHolder(
            fab,
            PropertyValuesHolder.ofFloat(View.SCALE_X, if (open) 0.82f else 1.18f, 1f),
            PropertyValuesHolder.ofFloat(View.SCALE_Y, if (open) 1.20f else 0.78f, 1f),
            PropertyValuesHolder.ofFloat(View.TRANSLATION_Y, -dp(3).toFloat(), 0f),
            PropertyValuesHolder.ofFloat(View.ROTATION, if (open) 145f else 35f, if (open) 180f else 0f)
        ).apply {
            duration = 210L
            interpolator = OvershootInterpolator(1.55f)
        }
        return AnimatorSet().apply { playSequentially(squash, stretch, settle) }
    }

    private fun addImportRipple(overlay: FrameLayout, fab: View, delay: Long) {
        val rippleSize = dp(78)
        val ripple = View(this).apply {
            alpha = 0f
            scaleX = 0.35f
            scaleY = 0.35f
            background = GradientDrawable().apply {
                shape = GradientDrawable.OVAL
                setColor(Color.TRANSPARENT)
                setStroke(dp(2), color(R.color.fb_glass_highlight))
            }
        }
        overlay.addView(ripple, FrameLayout.LayoutParams(rippleSize, rippleSize).apply {
            leftMargin = fab.left + (fab.width - rippleSize) / 2
            topMargin = fab.top + (fab.height - rippleSize) / 2
        })
        AnimatorSet().apply {
            playTogether(
                ObjectAnimator.ofFloat(ripple, View.ALPHA, 0f, 0.72f, 0f),
                ObjectAnimator.ofFloat(ripple, View.SCALE_X, 0.35f, 1.55f),
                ObjectAnimator.ofFloat(ripple, View.SCALE_Y, 0.35f, 1.55f)
            )
            startDelay = delay
            duration = 520L
            addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    (ripple.parent as? ViewGroup)?.removeView(ripple)
                }
            })
            start()
        }
    }

    private fun resetImportFab() {
        if (!::binding.isInitialized) return
        binding.importFabIcon.apply {
            animate().cancel()
            setImageResource(R.drawable.ic_fb_import)
            contentDescription = getString(R.string.fb_import)
            scaleX = 1f
            scaleY = 1f
            translationY = 0f
            rotation = 0f
        }
    }

    private fun importActionButton(label: String, iconResource: Int, action: () -> Unit): MaterialButton {
        return outlineButton(label) { action() }.apply {
            icon = ContextCompat.getDrawable(this@FridaBoxActivity, iconResource)
            iconTint = ColorStateList.valueOf(color(R.color.fb_text_primary))
            iconPadding = dp(12)
            iconGravity = MaterialButton.ICON_GRAVITY_TEXT_START
            gravity = Gravity.START or Gravity.CENTER_VERTICAL
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(50)).apply {
                bottomMargin = dp(8)
            }
        }
    }

    @Suppress("DEPRECATION")
    private fun showInstalledAppsBrowser() {
        val dialog = Dialog(this)
        val root = FrameLayout(this).apply {
            setPadding(dp(12), dp(32), dp(12), dp(12))
            setOnClickListener { dialog.dismiss() }
        }
        val panel = surfaceCard().apply {
            radius = dp(28).toFloat()
            setCardBackgroundColor(color(R.color.fb_glass_surface_strong))
            isClickable = true
        }
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(10))
        }
        panel.addView(body)
        body.addView(LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            addView(labelText(
                getString(R.string.fb_installed_apps),
                R.color.fb_text_primary,
                19f,
                true
            ), LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
            addView(iconButton(R.drawable.ic_fb_close, getString(R.string.fb_close)) { dialog.dismiss() },
                LinearLayout.LayoutParams(dp(40), dp(40)))
        })

        val list = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(10), 0, 0)
        }
        val scroll = NestedScrollView(this).apply {
            isFillViewport = false
            overScrollMode = View.OVER_SCROLL_NEVER
            addView(list, ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ))
        }
        body.addView(scroll, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1f
        ))
        val footer = labelText(
            getString(R.string.fb_loading_apps),
            R.color.fb_text_secondary,
            12f,
            false
        ).apply {
            gravity = Gravity.CENTER
            setPadding(0, dp(14), 0, dp(8))
        }
        body.addView(footer)

        root.addView(panel, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            (resources.displayMetrics.heightPixels * 0.82f).toInt(),
            Gravity.BOTTOM
        ))
        dialog.setContentView(root)
        dialog.setCanceledOnTouchOutside(true)
        dialog.window?.apply {
            setBackgroundDrawable(ColorDrawable(android.graphics.Color.TRANSPARENT))
            addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
            attributes = attributes.apply { dimAmount = 0.42f }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                attributes = attributes.apply { blurBehindRadius = dp(36) }
            }
        }
        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)

        val request = ++installedAppsRequest
        worker.execute {
            val result = runCatching {
                val imported = BlackBoxCore.get()
                    .getInstalledPackages(0, 0)
                    .mapTo(HashSet()) { it.packageName }
                val packages = packageManager.getInstalledPackages(PackageManager.GET_META_DATA)
                    .asSequence()
                    .filter { it.packageName != packageName }
                    .filter { it.applicationInfo?.enabled == true }
                    .filter { packageManager.getLaunchIntentForPackage(it.packageName) != null }
                    .filter { info ->
                        info.applicationInfo?.sourceDir?.let { File(it).isFile } == true
                    }
                    .sortedBy { info ->
                        info.applicationInfo?.loadLabel(packageManager)?.toString()
                            .orEmpty().ifBlank { info.packageName }.lowercase(Locale.ROOT)
                    }
                    .toList()
                packages to imported
            }
            runOnUiThread {
                if (request != installedAppsRequest || !dialog.isShowing || isFinishing) {
                    return@runOnUiThread
                }
                result.onSuccess { (packages, imported) ->
                    footer.isVisible = packages.isEmpty()
                    if (packages.isEmpty()) footer.text = getString(R.string.fb_no_importable_apps)
                    packages.forEach { info ->
                        list.addView(installedAppRow(info, info.packageName in imported, dialog))
                    }
                }.onFailure { error ->
                    footer.text = error.message ?: getString(R.string.fb_no_importable_apps)
                }
            }
        }
    }

    private fun installedAppRow(info: PackageInfo, imported: Boolean, dialog: Dialog): View {
        val appInfo = info.applicationInfo
        val label = runCatching { appInfo?.loadLabel(packageManager)?.toString() }
            .getOrNull().orEmpty().ifBlank { info.packageName }
        return LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(9), 0, dp(9))
            addView(ImageView(this@FridaBoxActivity).apply {
                runCatching { setImageDrawable(appInfo?.loadIcon(packageManager)) }
                scaleType = ImageView.ScaleType.FIT_CENTER
            }, LinearLayout.LayoutParams(dp(46), dp(46)))
            addView(LinearLayout(this@FridaBoxActivity).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(dp(12), 0, dp(8), 0)
                addView(labelText(label, R.color.fb_text_primary, 14.5f, true).apply {
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.END
                })
                addView(labelText(info.packageName, R.color.fb_text_secondary, 10.5f, false).apply {
                    maxLines = 1
                    ellipsize = android.text.TextUtils.TruncateAt.END
                })
            }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
            addView(outlineButton(getString(
                if (imported) R.string.fb_app_imported else R.string.fb_import_app
            )) {
                dialog.dismiss()
                importInstalledApp(info.packageName)
            }.apply {
                isEnabled = !imported
            }, LinearLayout.LayoutParams(dp(92), dp(40)))
        }
    }

    @Suppress("DEPRECATION")
    private fun importInstalledApp(packageName: String) {
        setLoading(true)
        worker.execute {
            val result = runCatching {
                require(packageName != this.packageName) { "FridaBox cannot import itself" }
                val info = packageManager.getPackageInfo(packageName, PackageManager.GET_META_DATA)
                val appInfo = requireNotNull(info.applicationInfo) { "Application metadata is unavailable" }
                val apkFiles = buildList {
                    appInfo.sourceDir?.let { add(File(it)) }
                    appInfo.splitSourceDirs?.forEach { add(File(it)) }
                }.distinctBy { it.canonicalPath }
                require(apkFiles.isNotEmpty() && apkFiles.all { it.isFile }) {
                    "Installed APK files are unavailable"
                }
                val processAbi = requireNotNull(ProcessAbi.detect(this)) {
                    "Unable to determine the FridaBox process ABI"
                }
                val abi = ApkInspector.inspect(apkFiles, processAbi)
                if (!abi.supported) error("Unsupported native ABI: ${abi.description()}")
                val originalHash = installedPackageSha256(apkFiles)
                val install = BlackBoxCore.get().installPackageAsUser(packageName, 0)
                if (!install.success) error(install.msg ?: "Virtual installation failed")
                if (installedPackageSha256(apkFiles) != originalHash) {
                    error("Installed package changed during import")
                }
                metadata.edit()
                    .putString("$packageName.sha256", originalHash)
                    .putString("$packageName.source", appInfo.sourceDir)
                    .putString("$packageName.abi", abi.description())
                    .putString("$packageName.version", info.versionName)
                    .putInt("$packageName.targetSdk", appInfo.targetSdkVersion)
                    .putInt("$packageName.apkCount", apkFiles.size)
                    .putBoolean("$packageName.fromInstalledApp", true)
                    .apply()
                InstrumentationSettings.setModeForPackage(packageName, InstrumentationSettings.MODE_COMPUTER)
                appInfo.loadLabel(packageManager).toString().ifBlank { packageName }
            }
            runOnUiThread {
                setLoading(false)
                result.onSuccess {
                    notify("$it imported from installed apps")
                    showWorkspace()
                }.onFailure { notify("App import failed: ${it.message}") }
            }
        }
    }

    private fun importApk(uri: Uri) {
        val name = displayName(uri, "selected.apk")
        val lowerName = name.lowercase(Locale.ROOT)
        if (!lowerName.endsWith(".apk") || lowerName.endsWith(".apks") ||
            lowerName.endsWith(".xapk") || lowerName.endsWith(".apkm")) {
            notify("Select one base .apk file; app bundles and split sets are not supported")
            return
        }
        setLoading(true)
        worker.execute {
            val directory = File(filesDir, "imported-apks").apply { mkdirs() }
            val temporary = File.createTempFile("import-", ".partial", directory)
            val result = runCatching {
                val digest = MessageDigest.getInstance("SHA-256")
                contentResolver.openInputStream(uri).use { input ->
                    requireNotNull(input) { "Unable to open the selected APK" }
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
                if (!archiveInfo.splitNames.isNullOrEmpty()) error("Split-only APKs are not supported")
                val processAbi = requireNotNull(ProcessAbi.detect(this)) {
                    "Unable to determine the FridaBox process ABI"
                }
                val abi = ApkInspector.inspect(listOf(temporary), processAbi)
                if (!abi.supported) error("Unsupported native ABI: ${abi.description()}")
                val safePackage = safePackageName(archiveInfo.packageName)
                val stored = File(directory, "$safePackage-${originalHash.take(12)}.apk")
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

    private fun showGadgets(preserveScroll: Boolean = false) {
        val previousScrollY = binding.contentScroll.scrollY
        screen = Screen.GADGETS
        resetScreen(R.id.nav_gadgets, showImport = false, resetScroll = !preserveScroll)
        binding.toolbar.title = getString(R.string.fb_gadgets_title)

        val abi = gadgetManager.detectedAbi()
        if (abi == null) {
            binding.toolbar.subtitle = null
            binding.content.addView(messageCard(
                getString(R.string.fb_gadget_unsupported_title),
                Build.SUPPORTED_ABIS.joinToString(),
                R.color.fb_error
            ))
            return
        }
        binding.toolbar.subtitle = abi.androidName

        val selected = gadgetManager.selected()
        binding.content.addView(LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(8), 0, dp(20))
            addView(labelText(getString(R.string.fb_active_gadget), R.color.fb_text_secondary, 12f, false))
            addView(labelText(
                selected?.version ?: getString(R.string.fb_no_active_gadget_short),
                R.color.fb_text_primary,
                22f,
                true
            ).apply { setPadding(0, dp(3), 0, 0) })
            if (selected != null) {
                addView(labelText(
                    "${selected.source.title} / ${selected.abi.androidName}",
                    R.color.fb_text_secondary,
                    12.5f,
                    false
                ).apply { setPadding(0, dp(3), 0, 0) })
            }
        })

        binding.content.addView(primaryButton(getString(R.string.fb_browse_gadgets)) {
            showGadgetBrowser(abi)
        }.apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(52)).apply {
                bottomMargin = dp(24)
            }
        })

        if (selected != null && RuntimeBridgeCatalog.supportsRuntimeBridges(selected.version)) {
            binding.content.addView(runtimeBridgeControls(selected.version))
        }

        val installed = gadgetManager.installed()
        if (installed.isNotEmpty()) {
            binding.content.addView(labelText(
                getString(R.string.fb_installed_gadgets), R.color.fb_text_secondary, 12f, false
            ).apply { setPadding(0, 0, 0, dp(6)) })
            installed.forEach { gadget ->
                binding.content.addView(installedGadgetRow(gadget, selected?.identity == gadget.identity))
            }
        }
        if (preserveScroll) restoreScrollBeforeNextDraw(previousScrollY)
    }

    private fun runtimeBridgeControls(gadgetVersion: String): View {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(labelText(
                getString(R.string.fb_runtime_bridges), R.color.fb_text_secondary, 12f, false
            ).apply { setPadding(0, 0, 0, dp(6)) })
            addView(labelText(
                getString(R.string.fb_runtime_bridges_body, gadgetVersion),
                R.color.fb_text_secondary,
                12.5f,
                false
            ).apply { setPadding(0, 0, 0, dp(10)) })
            RuntimeBridgeCatalog.specs().forEach { spec ->
                addView(runtimeBridgeRow(spec))
            }
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(20) }
        }
    }

    private fun runtimeBridgeRow(spec: RuntimeBridgeCatalog.BridgeSpec): View {
        val version = RuntimeBridgeCatalog.selectedVersion(spec)
        val enabled = InstrumentationSettings.isRuntimeBridgeEnabled(spec.id)
        return surfaceCard().apply {
            addView(LinearLayout(this@FridaBoxActivity).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(dp(16), dp(14), dp(16), dp(14))
                addView(LinearLayout(this@FridaBoxActivity).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = Gravity.CENTER_VERTICAL
                    addView(verticalText(spec.title, spec.description), LinearLayout.LayoutParams(
                        0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f
                    ))
                    addView(SwitchMaterial(this@FridaBoxActivity).apply {
                        isChecked = enabled
                        contentDescription = getString(R.string.fb_runtime_bridge_toggle, spec.title)
                        var rollingBack = false
                        setOnCheckedChangeListener { button, checked ->
                            if (rollingBack) return@setOnCheckedChangeListener
                            if (!InstrumentationSettings.setRuntimeBridge(spec.id, checked, version)) {
                                rollingBack = true
                                button.isChecked = !checked
                                rollingBack = false
                                notify(getString(R.string.fb_runtime_bridge_save_failed))
                            } else {
                                notify(getString(
                                    if (checked) R.string.fb_runtime_bridge_enabled else R.string.fb_runtime_bridge_disabled,
                                    spec.title
                                ))
                            }
                        }
                    }, LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.WRAP_CONTENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ).apply { marginStart = dp(8) })
                })
                addView(outlineButton(getString(R.string.fb_runtime_bridge_version, version)) { button ->
                    showRuntimeBridgeVersions(
                        spec,
                        RuntimeBridgeCatalog.selectedVersion(spec),
                        button as MaterialButton
                    )
                }.apply {
                    layoutParams = LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        dp(42)
                    ).apply { topMargin = dp(10) }
                })
            })
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply { bottomMargin = dp(10) }
        }
    }

    private fun showRuntimeBridgeVersions(
        spec: RuntimeBridgeCatalog.BridgeSpec,
        current: String,
        versionButton: MaterialButton
    ) {
        val versions = spec.versions().toTypedArray()
        MaterialAlertDialogBuilder(this)
            .setTitle(getString(R.string.fb_runtime_bridge_choose_version, spec.title))
            .setSingleChoiceItems(versions, versions.indexOf(current)) { dialog, which ->
                val enabled = InstrumentationSettings.isRuntimeBridgeEnabled(spec.id)
                if (InstrumentationSettings.setRuntimeBridge(spec.id, enabled, versions[which])) {
                    dialog.dismiss()
                    versionButton.text = getString(R.string.fb_runtime_bridge_version, versions[which])
                } else {
                    notify(getString(R.string.fb_runtime_bridge_save_failed))
                }
            }
            .setNegativeButton(getString(R.string.fb_cancel), null)
            .show()
    }

    private fun installedGadgetRow(gadget: InstalledGadget, active: Boolean): View {
        return gadgetRow(
            gadget.version,
            "${gadget.abi.androidName} / ${humanSize(gadget.size)}",
            if (active) getString(R.string.fb_gadget_active) else getString(R.string.fb_use_gadget),
            active
        ) {
            runCatching { gadgetManager.select(gadget) }
                .onSuccess {
                    notify(getString(R.string.fb_gadget_selected, gadget.version))
                    showGadgets(preserveScroll = true)
                }
                .onFailure { notify(it.message ?: getString(R.string.fb_gadget_select_failed)) }
        }
    }

    private fun releaseRow(release: GadgetRelease, dialog: Dialog): View {
        val installed = gadgetManager.findInstalled(release)
        val activePath = InstrumentationSettings.getSelectedGadgetPath()
        val active = installed != null && runCatching {
            installed.file.canonicalPath == File(activePath.orEmpty()).canonicalPath
        }.getOrDefault(false)
        val details = listOfNotNull(
            release.publishedAt.takeIf { it.isNotBlank() }?.take(10),
            release.compressedSize.takeIf { it > 0 }?.let(::humanSize)
        ).joinToString(" / ")
        return gadgetRow(
            release.version,
            details,
            when {
                active -> getString(R.string.fb_gadget_active)
                installed != null -> getString(R.string.fb_use_gadget)
                else -> getString(R.string.fb_download)
            },
            active
        ) {
            when {
                installed != null -> runCatching { gadgetManager.select(installed) }
                    .onSuccess {
                        dialog.dismiss()
                        showGadgets(preserveScroll = true)
                    }
                    .onFailure { notify(it.message ?: getString(R.string.fb_gadget_select_failed)) }
                else -> {
                    dialog.dismiss()
                    downloadGadget(release)
                }
            }
        }
    }

    private fun gadgetRow(
        version: String,
        details: String,
        actionLabel: String,
        actionDisabled: Boolean,
        action: () -> Unit
    ): View = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER_VERTICAL
        setPadding(0, dp(10), 0, dp(10))
        addView(LinearLayout(this@FridaBoxActivity).apply {
            orientation = LinearLayout.VERTICAL
            addView(labelText(version, R.color.fb_text_primary, 16f, true))
            if (details.isNotBlank()) {
                addView(labelText(details, R.color.fb_text_secondary, 11.5f, false).apply {
                    setPadding(0, dp(2), 0, 0)
                })
            }
        }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        addView(outlineButton(actionLabel) { action() }.apply {
            isEnabled = !actionDisabled
        }, LinearLayout.LayoutParams(dp(106), dp(40)).apply { marginStart = dp(12) })
    }

    private fun showGadgetBrowser(abi: GadgetAbi) {
        val dialog = Dialog(this)
        val root = FrameLayout(this).apply {
            setPadding(dp(12), dp(20), dp(12), dp(20))
            setOnClickListener { dialog.dismiss() }
        }
        val panel = surfaceCard().apply {
            radius = dp(28).toFloat()
            setCardBackgroundColor(color(R.color.fb_glass_surface_strong))
            isClickable = true
        }
        val body = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(10))
        }
        panel.addView(body)

        body.addView(LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            addView(verticalText(
                getString(R.string.fb_browse_gadgets),
                abi.androidName
            ), LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
            addView(iconButton(R.drawable.ic_fb_close, getString(R.string.fb_close)) { dialog.dismiss() },
                LinearLayout.LayoutParams(dp(40), dp(40)))
        })

        val list = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(0, dp(10), 0, 0)
        }
        val scroll = NestedScrollView(this).apply {
            isFillViewport = false
            overScrollMode = View.OVER_SCROLL_NEVER
            addView(list, ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ))
        }
        body.addView(scroll, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1f
        ))
        val footer = labelText("", R.color.fb_text_secondary, 12f, false).apply {
            gravity = Gravity.CENTER
            setPadding(0, dp(10), 0, dp(4))
            isVisible = false
        }
        body.addView(footer)

        root.addView(panel, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT,
            Gravity.CENTER
        ))
        dialog.setContentView(root)
        dialog.setCanceledOnTouchOutside(true)
        dialog.window?.apply {
            setBackgroundDrawable(ColorDrawable(android.graphics.Color.TRANSPARENT))
            addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
            attributes = attributes.apply { dimAmount = 0.42f }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                addFlags(WindowManager.LayoutParams.FLAG_BLUR_BEHIND)
                attributes = attributes.apply { blurBehindRadius = dp(36) }
            }
        }
        dialog.show()
        dialog.window?.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        panel.apply {
            alpha = 0f
            scaleX = 0.96f
            scaleY = 0.96f
            translationY = dp(10).toFloat()
            animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .translationY(0f)
                .setDuration(280L)
                .setInterpolator(DecelerateInterpolator(1.6f))
                .start()
        }

        val request = ++catalogRequest
        val identities = HashSet<String>()
        var page = 1
        var loading = false
        var hasMore = true
        val loader = object : Runnable {
            override fun run() {
                if (loading || !hasMore || !dialog.isShowing) return
                loading = true
                footer.text = getString(R.string.fb_loading_versions)
                footer.isVisible = true
                footer.setOnClickListener(null)
                worker.execute {
                    val result = runCatching {
                        gadgetManager.loadCatalog(GadgetSource.OFFICIAL, abi, page)
                    }
                    runOnUiThread {
                        if (request != catalogRequest || !dialog.isShowing || isFinishing) {
                            return@runOnUiThread
                        }
                        loading = false
                        result.onSuccess { catalog ->
                            catalog.releases.forEach { release ->
                                val identity = "${release.source.id}:${release.version}:${release.abi.androidName}"
                                if (identities.add(identity)) list.addView(releaseRow(release, dialog))
                            }
                            page += 1
                            hasMore = catalog.hasMore
                            footer.text = when {
                                !hasMore -> getString(R.string.fb_all_versions_loaded)
                                catalog.fromCache -> getString(R.string.fb_cached_versions)
                                else -> ""
                            }
                            footer.isVisible = !hasMore || catalog.fromCache
                            if (hasMore && (catalog.releases.isEmpty() || !scroll.canScrollVertically(1))) {
                                scroll.post(this)
                            }
                        }.onFailure { error ->
                            footer.text = error.message ?: getString(R.string.fb_catalog_failed_body)
                            footer.isVisible = true
                            footer.setOnClickListener { run() }
                        }
                    }
                }
            }
        }
        scroll.setOnScrollChangeListener { view: NestedScrollView, _, scrollY, _, _ ->
            val child = view.getChildAt(0) ?: return@setOnScrollChangeListener
            if (child.bottom - (view.height + scrollY) <= dp(120)) loader.run()
        }
        loader.run()
    }

    private fun downloadGadget(release: GadgetRelease) {
        setLoading(true)
        notify(getString(R.string.fb_gadget_downloading, release.version))
        worker.execute {
            val hadSelection = gadgetManager.selected() != null
            val result = runCatching {
                gadgetManager.download(release).also { if (!hadSelection) gadgetManager.select(it) }
            }
            runOnUiThread {
                setLoading(false)
                result.onSuccess {
                    notify(getString(
                        if (hadSelection) R.string.fb_gadget_downloaded else R.string.fb_gadget_downloaded_selected,
                        release.version
                    ))
                    showGadgets(preserveScroll = true)
                }.onFailure { notify(getString(R.string.fb_gadget_download_failed, it.message ?: "Unknown error")) }
            }
        }
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
        val port = numberInput(getString(R.string.fb_base_port), settings.getInt(InstrumentationSettings.KEY_BASE_PORT, 27042))
        val count = numberInput(getString(R.string.fb_scan_count), settings.getInt(InstrumentationSettings.KEY_SCAN_COUNT, 32))
        body.addView(port.first)
        body.addView(count.first)
        body.addView(primaryButton(getString(R.string.fb_save_settings)) {
            settings.edit()
                .putInt(InstrumentationSettings.KEY_BASE_PORT,
                    InstrumentationPreferenceParser.parsePort(port.second.text?.toString().orEmpty(), 27042))
                .putInt(InstrumentationSettings.KEY_SCAN_COUNT,
                    InstrumentationPreferenceParser.parseScanCount(count.second.text?.toString().orEmpty(), 32))
                .apply()
            notify("Settings saved")
        }.apply {
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dp(50)).apply { topMargin = dp(12) }
        })
        controls.layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        ).apply { bottomMargin = dp(14) }
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
            boxBackgroundColor = color(R.color.fb_glass_surface_soft)
            boxStrokeColor = color(R.color.fb_glass_outline)
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

    private fun verticalText(title: String, subtitle: String): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            addView(labelText(title, R.color.fb_text_primary, 19f, true))
            addView(labelText(subtitle, R.color.fb_text_secondary, 12.5f, false).apply { setPadding(0, dp(3), 0, 0) })
        }
    }

    private fun surfaceCard(): MaterialCardView = MaterialCardView(this).apply {
        radius = resources.getDimension(R.dimen.fb_card_radius)
        cardElevation = dp(8).toFloat()
        setCardBackgroundColor(color(R.color.fb_glass_surface))
        strokeColor = color(R.color.fb_glass_outline)
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
            strokeColor = checkedColors(color(R.color.fb_primary), color(R.color.fb_glass_outline))
            backgroundTintList = checkedColors(color(R.color.fb_primary), color(R.color.fb_glass_surface_soft))
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f)
        }.also(::installPressMotion)
    }

    private fun primaryButton(label: String, action: (View) -> Unit): MaterialButton {
        return MaterialButton(this).apply {
            text = label
            isAllCaps = false
            letterSpacing = 0f
            cornerRadius = dp(18)
            insetTop = 0
            insetBottom = 0
            setTextColor(color(R.color.fb_black))
            backgroundTintList = ColorStateList.valueOf(color(R.color.fb_primary))
            strokeColor = ColorStateList.valueOf(color(R.color.fb_glass_highlight))
            strokeWidth = dp(1)
            elevation = dp(3).toFloat()
            setOnClickListener(action)
        }.also(::installPressMotion)
    }

    private fun outlineButton(label: String, action: (View) -> Unit): MaterialButton {
        return MaterialButton(this, null, com.google.android.material.R.attr.materialButtonOutlinedStyle).apply {
            text = label
            isAllCaps = false
            letterSpacing = 0f
            cornerRadius = dp(18)
            insetTop = 0
            insetBottom = 0
            setTextColor(color(R.color.fb_text_primary))
            strokeColor = ColorStateList.valueOf(color(R.color.fb_glass_outline))
            backgroundTintList = ColorStateList.valueOf(color(R.color.fb_glass_surface_soft))
            setOnClickListener(action)
        }.also(::installPressMotion)
    }

    private fun iconButton(iconResource: Int, description: String, action: () -> Unit): MaterialButton {
        return outlineButton("") { action() }.apply {
            contentDescription = description
            icon = ContextCompat.getDrawable(this@FridaBoxActivity, iconResource)
            iconTint = ColorStateList.valueOf(color(R.color.fb_text_primary))
            iconPadding = 0
            iconGravity = MaterialButton.ICON_GRAVITY_TEXT_START
            minWidth = 0
            setPadding(dp(8), 0, dp(8), 0)
        }
    }

    private fun installPressMotion(view: View) {
        view.isHapticFeedbackEnabled = true
        view.setOnTouchListener { target, event ->
            if (!target.isEnabled) return@setOnTouchListener false
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    target.animate().cancel()
                    target.performHapticFeedback(
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            HapticFeedbackConstants.CONTEXT_CLICK
                        } else {
                            HapticFeedbackConstants.VIRTUAL_KEY
                        }
                    )
                    target.animate()
                        .scaleX(0.965f)
                        .scaleY(0.965f)
                        .alpha(0.9f)
                        .translationY(dp(1).toFloat())
                        .setDuration(85L)
                        .setInterpolator(AccelerateInterpolator(1.4f))
                        .start()
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    target.animate().cancel()
                    target.animate()
                        .scaleX(1f)
                        .scaleY(1f)
                        .alpha(1f)
                        .translationY(0f)
                        .setDuration(240L)
                        .setInterpolator(OvershootInterpolator(1.45f))
                        .start()
                }
            }
            false
        }
    }

    private fun animateNavigationSelection(itemId: Int) {
        updateNavigationIconEmphasis(itemId)
        val item = binding.bottomNavigation.findViewById<View>(itemId) ?: return
        val target = firstImageDescendant(item) ?: item
        target.animate().cancel()
        target.scaleX = 0.9f
        target.scaleY = 0.9f
        target.translationY = dp(2).toFloat()
        target.animate()
            .scaleX(1.18f)
            .scaleY(1.18f)
            .translationY(0f)
            .setDuration(360L)
            .setInterpolator(OvershootInterpolator(1.8f))
            .start()
    }

    private fun updateNavigationIconEmphasis(selectedItemId: Int) {
        intArrayOf(R.id.nav_workspace, R.id.nav_gadgets, R.id.nav_settings).forEach { itemId ->
            val item = binding.bottomNavigation.findViewById<View>(itemId) ?: return@forEach
            val icon = firstImageDescendant(item) ?: return@forEach
            icon.animate().cancel()
            val scale = if (itemId == selectedItemId) 1.18f else 1f
            icon.scaleX = scale
            icon.scaleY = scale
            icon.translationY = 0f
        }
    }

    private fun firstImageDescendant(view: View): ImageView? {
        if (view is ImageView) return view
        if (view !is ViewGroup) return null
        for (index in 0 until view.childCount) {
            firstImageDescendant(view.getChildAt(index))?.let { return it }
        }
        return null
    }

    private fun animateContentIn() {
        binding.content.animate().cancel()
        binding.content.alpha = 0.62f
        binding.content.translationY = dp(8).toFloat()
        binding.content.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(260L)
            .setInterpolator(DecelerateInterpolator(1.5f))
            .start()
    }

    private fun restoreScrollBeforeNextDraw(scrollY: Int) {
        if (scrollY <= 0) return
        val scroll = binding.contentScroll
        scroll.viewTreeObserver.addOnPreDrawListener(object : ViewTreeObserver.OnPreDrawListener {
            override fun onPreDraw(): Boolean {
                if (scroll.viewTreeObserver.isAlive) {
                    scroll.viewTreeObserver.removeOnPreDrawListener(this)
                }
                val maximum = (scroll.getChildAt(0)?.height ?: 0) - scroll.height
                scroll.scrollTo(0, scrollY.coerceIn(0, maximum.coerceAtLeast(0)))
                return true
            }
        })
    }

    private fun resetScreen(navId: Int, showImport: Boolean, resetScroll: Boolean = true): Int {
        dismissImportActions(immediate = true)
        screenGeneration += 1
        binding.content.removeAllViews()
        if (resetScroll) binding.contentScroll.scrollTo(0, 0)
        binding.importFabIcon.isVisible = showImport
        changingNavigation = true
        binding.bottomNavigation.selectedItemId = navId
        changingNavigation = false
        updateNavigationIconEmphasis(navId)
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

    private fun modeShortLabel(mode: String): String = when (mode) {
        InstrumentationSettings.MODE_LOCAL_SCRIPT -> getString(R.string.fb_mode_local)
        InstrumentationSettings.MODE_CLEAN -> getString(R.string.fb_mode_clean)
        else -> getString(R.string.fb_mode_computer)
    }

    private fun modeColor(mode: String, background: Boolean): Int {
        val resource = when (mode) {
            InstrumentationSettings.MODE_LOCAL_SCRIPT -> if (background) R.color.fb_glass_surface_soft else R.color.fb_success
            InstrumentationSettings.MODE_CLEAN -> if (background) R.color.fb_glass_surface_soft else R.color.fb_text_secondary
            else -> if (background) R.color.fb_glass_surface_soft else R.color.fb_warning
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
    private fun notify(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).apply {
            setAnchorView(binding.bottomNavigation)
            setTextColor(color(R.color.fb_text_primary))
            view.background = ContextCompat.getDrawable(this@FridaBoxActivity, R.drawable.bg_glass_popup)
            view.elevation = dp(12).toFloat()
            show()
        }
    }
    private fun toast(message: String) = notify(message)
    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()

    private fun humanSize(bytes: Long): String {
        if (bytes < 1024L) return "$bytes B"
        val units = arrayOf("KiB", "MiB", "GiB")
        var value = bytes.toDouble()
        var unit = -1
        while (value >= 1024.0 && unit < units.lastIndex) {
            value /= 1024.0
            unit++
        }
        return String.format(Locale.ROOT, "%.1f %s", value, units[unit])
    }

    private fun installedPackageSha256(apks: List<File>): String {
        val digest = MessageDigest.getInstance("SHA-256")
        apks.sortedBy { it.name }.forEach { apk ->
            digest.update(apk.name.toByteArray(Charsets.UTF_8))
            digest.update(byteArrayOf(0))
            apk.inputStream().use { input ->
                val buffer = ByteArray(128 * 1024)
                while (true) {
                    val count = input.read(buffer)
                    if (count < 0) break
                    digest.update(buffer, 0, count)
                }
            }
        }
        return digest.digest().joinToString("") { "%02x".format(it) }
    }

    companion object {
        private const val MAX_AGENT_SIZE = 16L * 1024L * 1024L
    }
}
