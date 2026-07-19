package com.qm4rs.fridabox.sample;

import android.app.Application;
import android.content.Context;
import android.util.Log;

public final class SampleApplication extends Application {
    private static final String TAG = "FridaBox.Sample";

    @Override
    protected void attachBaseContext(Context base) {
        Log.i(TAG, "Application.attachBaseContext package=" + base.getPackageName());
        super.attachBaseContext(base);
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(TAG, "Application.onCreate package=" + getPackageName());
    }
}
