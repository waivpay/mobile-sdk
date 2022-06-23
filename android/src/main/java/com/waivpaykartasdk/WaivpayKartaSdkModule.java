package com.waivpaykartasdk;

import android.content.Context;
import android.content.Intent;
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

//            Context context = getReactApplicationContext();
//            Intent intent = this.intentWithContentUri(uri, PKPASS_TYPE);
//            context.startActivity(intent);

            AddToWallet addToWallet = new AddToWallet();
            addToWallet.addCardToWallet(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken, getCurrentActivity());
        } catch (Exception e) {
            e.printStackTrace();
        }
        promise.resolve(false);
    }

    public static native boolean nativeAddCard(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail, String appId, String accessToken);

//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        if (requestCode == REQUEST_CODE_PUSH_TOKENIZE) {
//            if (resultCode == RESULT_CANCELED) {
//                // TODO: Handle provisioning failure here.
//                return;
//            } else if (resultCode == RESULT_OK) {
//                // TODO: Handle successful provisioning here.
//                String tokenId = data.getStringExtra(TapAndPay.EXTRA_ISSUER_TOKEN_ID);
//                return;
//            }
//        }
//        // TODO: Handle results for other request codes.
//        // ...
//    }

//    private Intent intentWithContentUri(Uri uri, String type) {
//        return new Intent(Intent.ACTION_VIEW)
//                .setDataAndType(uri, type)
//                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
//                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
//    }
}
