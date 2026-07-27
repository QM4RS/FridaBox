package com.qm4rs.fridabox

import android.app.Activity
import android.app.Dialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import org.json.JSONObject
import top.niunaijun.blackbox.instrumentation.InstrumentationSettings
import java.io.File
import java.text.SimpleDateFormat
import java.util.Locale

/** Package-scoped floating log console shown inside a virtual guest Activity. */
object FridaBoxGuestLogOverlay {
    private const val OVERLAY_TAG = "fridabox.guest.log.overlay"
    private const val LOG_NAME = "runtime.jsonl"
    private const val REFRESH_INTERVAL_MS = 750L

    private val backgroundColor = Color.rgb(8, 13, 18)
    private val surfaceColor = Color.rgb(18, 26, 34)
    private val surfaceHighColor = Color.rgb(29, 40, 51)
    private val primaryColor = Color.rgb(110, 231, 216)
    private val textColor = Color.rgb(231, 238, 244)
    private val secondaryTextColor = Color.rgb(148, 164, 178)
    private val outlineColor = Color.rgb(49, 65, 80)

    fun attach(activity: Activity, packageName: String) {
        val decor = activity.window?.decorView as? ViewGroup ?: return
        val existing = decor.findViewWithTag<View>(OVERLAY_TAG)
        val localMode = InstrumentationSettings.MODE_LOCAL_SCRIPT ==
            InstrumentationSettings.getModeForPackage(packageName)
        val logFile = logFileFor(packageName)
        if (!localMode || logFile == null) {
            if (existing != null) decor.removeView(existing)
            return
        }
        if (existing != null) {
            existing.bringToFront()
            return
        }

        val bubble = TextView(activity).apply {
            tag = OVERLAY_TAG
            text = ">_"
            contentDescription = "Open Frida logs for $packageName"
            gravity = Gravity.CENTER
            setTextColor(Color.BLACK)
            textSize = 15f
            setTypeface(Typeface.MONOSPACE, Typeface.BOLD)
            background = rounded(primaryColor, dp(activity, 18))
            elevation = dp(activity, 10).toFloat()
            setOnClickListener { showConsole(activity, packageName, logFile) }
        }
        val margin = dp(activity, 18)
        decor.addView(bubble, FrameLayout.LayoutParams(dp(activity, 54), dp(activity, 54)).apply {
            gravity = Gravity.END or Gravity.BOTTOM
            marginEnd = margin
            bottomMargin = dp(activity, 30)
        })
        makeDraggable(bubble, decor)
        bubble.bringToFront()
    }

    fun show(activity: Activity, packageName: String): Boolean {
        val logFile = logFileFor(packageName) ?: return false
        showConsole(activity, packageName, logFile)
        return true
    }

    private fun makeDraggable(view: View, parent: ViewGroup) {
        val touchSlop = dp(view.context, 8).toFloat()
        var downX = 0f
        var downY = 0f
        var startTranslationX = 0f
        var startTranslationY = 0f
        var dragged = false
        view.setOnTouchListener { target, event ->
            when (event.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    downX = event.rawX
                    downY = event.rawY
                    startTranslationX = target.translationX
                    startTranslationY = target.translationY
                    dragged = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = event.rawX - downX
                    val dy = event.rawY - downY
                    dragged = dragged || kotlin.math.abs(dx) > touchSlop || kotlin.math.abs(dy) > touchSlop
                    val minX = -target.left.toFloat()
                    val maxX = (parent.width - target.right).toFloat()
                    val minY = -target.top.toFloat()
                    val maxY = (parent.height - target.bottom).toFloat()
                    target.translationX = (startTranslationX + dx).coerceIn(minX, maxX)
                    target.translationY = (startTranslationY + dy).coerceIn(minY, maxY)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (!dragged) target.performClick()
                    true
                }
                MotionEvent.ACTION_CANCEL -> true
                else -> false
            }
        }
    }

    private fun showConsole(activity: Activity, packageName: String, logFile: File) {
        if (activity.isFinishing || activity.isDestroyed) return
        val handler = Handler(Looper.getMainLooper())
        val root = LinearLayout(activity).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(activity, 20), dp(activity, 20), dp(activity, 20), dp(activity, 16))
            background = rounded(surfaceColor, dp(activity, 22))
        }
        root.addView(TextView(activity).apply {
            text = "On-device agent logs"
            textSize = 20f
            setTypeface(typeface, Typeface.BOLD)
            setTextColor(textColor)
        })
        val status = TextView(activity).apply {
            text = packageName
            textSize = 11.5f
            setTextColor(secondaryTextColor)
            setPadding(0, dp(activity, 4), 0, 0)
        }
        root.addView(status)

        val output = TextView(activity).apply {
            text = "No logs yet."
            typeface = Typeface.MONOSPACE
            textSize = 12f
            setTextColor(textColor)
            setTextIsSelectable(true)
            setPadding(dp(activity, 14), dp(activity, 14), dp(activity, 14), dp(activity, 14))
            background = rounded(backgroundColor, dp(activity, 12))
        }
        val scroll = ScrollView(activity).apply {
            isFillViewport = true
            addView(output, ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ))
        }
        root.addView(scroll, LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1f
        ).apply {
            topMargin = dp(activity, 14)
            bottomMargin = dp(activity, 14)
        })

        val actions = LinearLayout(activity).apply {
            orientation = LinearLayout.HORIZONTAL
        }
        var hiddenBefore = 0L
        var fileSignature = Long.MIN_VALUE
        val clear = button(activity, "Clear view", false) {
            hiddenBefore = System.currentTimeMillis()
            fileSignature = Long.MIN_VALUE
            output.text = "No logs yet."
        }
        val copy = button(activity, "Copy", false) {
            val clipboard = activity.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
            clipboard.setPrimaryClip(ClipData.newPlainText("$packageName Frida logs", output.text))
            Toast.makeText(activity, "Agent logs copied", Toast.LENGTH_SHORT).show()
        }
        lateinit var dialog: Dialog
        val close = button(activity, "Close", true) { dialog.dismiss() }
        actions.addView(clear, LinearLayout.LayoutParams(0, dp(activity, 44), 1f))
        actions.addView(copy, LinearLayout.LayoutParams(0, dp(activity, 44), 1f).apply {
            marginStart = dp(activity, 8)
        })
        actions.addView(close, LinearLayout.LayoutParams(0, dp(activity, 44), 1f).apply {
            marginStart = dp(activity, 8)
        })
        root.addView(actions)

        dialog = Dialog(activity).apply {
            setContentView(root)
            setCanceledOnTouchOutside(true)
            window?.apply {
                setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
                addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
                attributes = attributes.apply { dimAmount = 0.58f }
            }
        }
        var snapshot = ""
        lateinit var refresh: Runnable
        refresh = Runnable {
            if (!dialog.isShowing) return@Runnable
            val length = logFile.length()
            val nextSignature = length xor logFile.lastModified()
            if (nextSignature != fileSignature) {
                fileSignature = nextSignature
                val next = formatLogs(logFile, hiddenBefore)
                if (next != snapshot) {
                    val stayAtBottom = scroll.scrollY + scroll.height >= output.height - dp(activity, 24)
                    snapshot = next
                    output.text = next.ifBlank { "No logs yet." }
                    if (stayAtBottom) scroll.post { scroll.fullScroll(View.FOCUS_DOWN) }
                }
                val size = if (length in 1..1023) "<1 KiB" else "${length / 1024} KiB"
                status.text = "$packageName  ·  $size"
            }
            handler.postDelayed(refresh, REFRESH_INTERVAL_MS)
        }
        dialog.setOnShowListener {
            val metrics = activity.resources.displayMetrics
            dialog.window?.setLayout((metrics.widthPixels * 0.92f).toInt(), (metrics.heightPixels * 0.76f).toInt())
            handler.post(refresh)
        }
        dialog.setOnDismissListener { handler.removeCallbacks(refresh) }
        dialog.show()
    }

    private fun logFileFor(packageName: String): File? {
        val scriptPath = InstrumentationSettings.getScriptPathForPackage(packageName) ?: return null
        val directory = File(scriptPath).parentFile ?: return null
        return File(directory, LOG_NAME)
    }

    private fun formatLogs(file: File, hiddenBefore: Long): String {
        if (!file.isFile || file.length() == 0L) return ""
        val formatter = SimpleDateFormat("HH:mm:ss.SSS", Locale.ROOT)
        return runCatching {
            file.readLines(Charsets.UTF_8).mapNotNull { line ->
                runCatching<String?> {
                    val item = JSONObject(line)
                    val time = item.optLong("time")
                    if (time <= hiddenBefore) return@runCatching null
                    val timestamp = formatter.format(java.util.Date(time))
                    val level = item.optString("level", "log").uppercase(Locale.ROOT)
                    "[$timestamp] ${level.padEnd(6)} ${item.optString("message")}" 
                }.getOrElse { if (hiddenBefore == 0L) line else null }
            }.joinToString("\n")
        }.getOrElse { "Unable to read agent logs: ${it.message}" }
    }

    private fun button(context: Context, label: String, primary: Boolean, action: () -> Unit): TextView {
        return TextView(context).apply {
            text = label
            gravity = Gravity.CENTER
            textSize = 12f
            setTypeface(typeface, Typeface.BOLD)
            setTextColor(if (primary) Color.BLACK else textColor)
            background = rounded(if (primary) primaryColor else surfaceHighColor, dp(context, 12),
                if (primary) primaryColor else outlineColor)
            setOnClickListener { action() }
        }
    }

    private fun rounded(fill: Int, radius: Int, stroke: Int? = null): GradientDrawable {
        return GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            setColor(fill)
            cornerRadius = radius.toFloat()
            if (stroke != null) setStroke(1, stroke)
        }
    }

    private fun dp(context: Context, value: Int): Int =
        (value * context.resources.displayMetrics.density).toInt()
}
