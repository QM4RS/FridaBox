package top.niunaijun.blackbox.utils;

import java.io.File;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import top.niunaijun.blackbox.BlackBoxCore;


public class AbiUtils {
    private final Set<String> mLibs = new HashSet<>();
    private static final Map<File, AbiUtils> sAbiUtilsMap = new HashMap<>();

    public static boolean isSupport(File apkFile) {
        AbiUtils abiUtils = sAbiUtilsMap.get(apkFile);
        if (abiUtils == null) {
            abiUtils = new AbiUtils(apkFile);
            sAbiUtilsMap.put(apkFile, abiUtils);
        }
        if (abiUtils.isEmptyAib()) {
            return true;
        }

        return abiUtils.supports(ProcessAbi.detect(BlackBoxCore.getContext()));
    }

    public AbiUtils(File apkFile) {
        ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(apkFile);
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry zipEntry = entries.nextElement();
                String name = zipEntry.getName();
                if (name.startsWith("lib/arm64-v8a")) {
                    mLibs.add("arm64-v8a");
                } else if (name.startsWith("lib/armeabi-v7a")) {
                    mLibs.add("armeabi-v7a");
                } else if (name.startsWith("lib/armeabi")) {
                    mLibs.add("armeabi");
                } else if (name.startsWith("lib/x86_64")) {
                    mLibs.add("x86_64");
                } else if (name.startsWith("lib/x86")) {
                    mLibs.add("x86");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            CloseUtils.close(zipFile);
        }
    }

    public boolean is64Bit() {
        return mLibs.contains("arm64-v8a") || mLibs.contains("x86_64");
    }

    public boolean is32Bit() {
        return mLibs.contains("armeabi") || mLibs.contains("armeabi-v7a") || mLibs.contains("x86");
    }

    public boolean isEmptyAib() {
        return mLibs.isEmpty();
    }

    public boolean supports(String processAbi) {
        if ("armeabi-v7a".equals(processAbi)) {
            return mLibs.contains("armeabi-v7a") || mLibs.contains("armeabi");
        }
        return processAbi != null && mLibs.contains(processAbi);
    }
}
