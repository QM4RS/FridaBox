package com.qm4rs.fridabox

import android.app.Application
import android.content.Context
import android.util.Log
import top.niunaijun.blackbox.BlackBoxCore

class FridaBoxApplication : Application() {
    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        appContext = base

        runCatching { BlackBoxCore.get().closeCodeInit() }
            .onFailure { Log.e(TAG, "Native bootstrap failed", it) }
        runCatching { BlackBoxCore.get().onBeforeMainApplicationAttach(this, base) }
            .onFailure { Log.e(TAG, "Pre-attach hook failed", it) }

        FridaBoxRuntime.attach(base)

        runCatching { BlackBoxCore.get().onAfterMainApplicationAttach(this, base) }
            .onFailure { Log.e(TAG, "Post-attach hook failed", it) }
    }

    override fun onCreate() {
        super.onCreate()
        FridaBoxRuntime.create()
    }

    companion object {
        private const val TAG = "FridaBox.Application"

        @Volatile
        lateinit var appContext: Context
            private set
    }
}
