package com.waivpaykartasdk;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class WaivpayKartaSdkPackage extends TurboReactPackage {

    @Nullable
    @Override
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext context) {
        if (WaivpayKartaSdkModule.NAME.equals(name)) {
            return new WaivpayKartaSdkModule(context);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(
                    WaivpayKartaSdkModule.NAME,
                    new ReactModuleInfo(
                            WaivpayKartaSdkModule.NAME,     // name
                            WaivpayKartaSdkModule.NAME,     // className
                            false,                          // canOverrideExistingModule
                            false,                          // needsEagerInit
                            false,                          // hasConstants
                            false,                          // isCxxModule
                            true                            // isTurboModule
                    ));
            return map;
        };
    }
}
