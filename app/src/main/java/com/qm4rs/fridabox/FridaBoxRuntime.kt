package com.qm4rs.fridabox

import android.app.Application
import android.content.Context
import android.util.Log
import java.io.File
import top.niunaijun.blackbox.BlackBoxCore
import top.niunaijun.blackbox.app.BActivityThread
import top.niunaijun.blackbox.app.configuration.AppLifecycleCallback
import top.niunaijun.blackbox.app.configuration.ClientConfiguration

object FridaBoxRuntime {
    private const val TAG = "FridaBox.Runtime"

    fun attach(context: Context) {
        BlackBoxCore.get().doAttachBaseContext(context, object : ClientConfiguration() {
            override fun getHostPackageName(): String = context.packageName
            override fun isHideRoot(): Boolean = false
            override fun isEnableDaemonService(): Boolean = true
            override fun isUseVpnNetwork(): Boolean = false
            override fun isDisableFlagSecure(): Boolean = false
            override fun requestInstallPackage(file: File?, userId: Int): Boolean = false
        })

        BlackBoxCore.get().addAppLifecycleCallback(object : AppLifecycleCallback() {
            override fun beforeCreateApplication(
                packageName: String?,
                processName: String?,
                context: Context?,
                userId: Int
            ) {
                Log.d(TAG, "beforeCreateApplication: package=$packageName process=$processName user=${BActivityThread.getUserId()}")
            }

            override fun beforeApplicationOnCreate(
                packageName: String?,
                processName: String?,
                application: Application?,
                userId: Int
            ) {
                Log.d(TAG, "beforeApplicationOnCreate: package=$packageName process=$processName")
            }

            override fun afterApplicationOnCreate(
                packageName: String?,
                processName: String?,
                application: Application?,
                userId: Int
            ) {
                Log.d(TAG, "afterApplicationOnCreate: package=$packageName process=$processName")
            }

            override fun onStoragePermissionNeeded(packageName: String?, userId: Int): Boolean {
                Log.w(TAG, "Storage permission required by guest: package=$packageName user=$userId")
                return false
            }
        })
    }

    fun create() {
        BlackBoxCore.get().doCreate()
        BlackBoxCore.get().addServiceAvailableCallback {
            Log.d(TAG, "Virtual runtime services are ready")
        }
    }
}
