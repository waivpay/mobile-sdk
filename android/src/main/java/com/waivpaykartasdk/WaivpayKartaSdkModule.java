package com.waivpaykartasdk;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.riskified.android_sdk.RiskifiedBeaconMain;
import com.riskified.android_sdk.RiskifiedBeaconMainInterface;

// Base class is the Codegen-generated TurboModule spec
// (com.waivpaykartasdk.NativeWaivpayKartaSdkSpec, output under
// android/build/generated/source/codegen/ at build time). It extends
// ReactContextBaseJavaModule, so we keep the same lifecycle as before.
@ReactModule(name = WaivpayKartaSdkModule.NAME)
public class WaivpayKartaSdkModule extends NativeWaivpayKartaSdkSpec {
    public static final String NAME = "WaivpayKartaSdk";

    public WaivpayKartaSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @Override
    public void cardExists(String cardId, Promise promise) {
        AddToWallet addToWallet = new AddToWallet();
        addToWallet.checkIsCardAdded(cardId, getCurrentActivity(), promise);
    }

    @Override
    public void startBeacon(String sessionToken, String shop, Promise promise) {
        RiskifiedBeaconMainInterface RXBeacon = new RiskifiedBeaconMain();
        RXBeacon.startBeacon(shop, sessionToken, false,
                getCurrentActivity().getApplicationContext());
    }

    @Override
    public void updateToken(String sessionToken, Promise promise) {
        RiskifiedBeaconMainInterface RXBeacon = new RiskifiedBeaconMain();
        RXBeacon.updateSessionToken(sessionToken);
    }

    @Override
    public void beaconLogRequest(String requestUrl, Promise promise) {
        RiskifiedBeaconMainInterface RXBeacon = new RiskifiedBeaconMain();
        RXBeacon.logRequest(requestUrl);
    }

    @Override
    public void checkIfReadyToPay(String jsonReq, String env, Promise promise) {
        AddToWallet addToWallet = new AddToWallet();
        addToWallet.checkIfReadyToPay(jsonReq, env, getCurrentActivity(), promise);
        promise.resolve(false);
    }

    @Override
    public void addCard(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail,
            String appId, String accessToken, String url, ReadableMap header, Promise promise) {
        try {
            AddToWallet addToWallet = new AddToWallet();
            addToWallet.addCardToWallet(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken, url,
                    header, getCurrentActivity());
        } catch (Exception e) {
            e.printStackTrace();
        }
        promise.resolve(false);
    }
}
