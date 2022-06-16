package com.waivpaykartasdk;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = WaivpayKartaSdkModule.NAME)
public class WaivpayKartaSdkModule extends ReactContextBaseJavaModule {
    public static final String NAME = "WaivpayKartaSdk";

    public WaivpayKartaSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void cardExists(String cardId, Promise promise) {
        Log.e("KLHERE","cardExists");
        promise.resolve(false);
    }

    public static native boolean nativeCardExists(String cardId);

    @ReactMethod
    public void addCard(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail, String appId, String accessToken, Promise promise) {
        Log.e("KLHERE","addCard");
        try {
            AddToWallet addToWallet = new AddToWallet();
            addToWallet.addCardToWallet(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken, this.getCurrentActivity());
        } catch (Exception e) {
            e.printStackTrace();
        }
        promise.resolve(false);
    }

    public static native boolean nativeAddCard(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail, String appId, String accessToken);
}
