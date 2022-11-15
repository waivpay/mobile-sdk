package com.waivpaykartasdk;

import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.WalletConstants;
import com.google.common.io.BaseEncoding;

import java.util.Locale;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class AddToWallet {
    public static final String HOST_STAGING = "https://webstores-staging.herokuapp.com/";
    public static final String HOST_PRODUCTION = "https://webstore.egivv.com/";

    public AddToWallet() {

    }

    public void addCardToWallet(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail, String appId, String accessToken, String url, ReadableMap header, Activity activity) {
        try {
            String postUrl = HOST_STAGING;
            if(url != null && !url.equalsIgnoreCase(""))
            {
                postUrl = url + "/";
            }
            else if (env.toLowerCase(Locale.ROOT).equalsIgnoreCase("prod")) {
                postUrl = HOST_PRODUCTION;
            }
            postUrl = postUrl + "api/apps/" + appId + "/cards/" + cardId + "/provision";

            String json = "{\"wallet_type\":\"android\",\"delivery_email\":\"" + deliveryEmail + "\"}";

            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"), json);

            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.connectTimeout(5, TimeUnit.MINUTES) // connect timeout
                    .writeTimeout(5, TimeUnit.MINUTES) // write timeout
                    .readTimeout(5, TimeUnit.MINUTES); // read timeout

            OkHttpClient client = builder.build();
             Request.Builder build = new Request.Builder();


            build = build.addHeader("Authorization", "Bearer " + accessToken);
            if(header != null)
            {
                ReadableMapKeySetIterator iterator = header.keySetIterator();
                while (iterator.hasNextKey()) {
                    String key = iterator.nextKey();
                    if(!key.equalsIgnoreCase("") && !header.getString(key).equalsIgnoreCase(""))
                    {
                        build = build.addHeader(key, header.getString(key));
                    }

                }
            }

            Request request = build
                    .url(postUrl)
                    .post(body)
                    .build();

            Call call = client.newCall(request);
            Response response = call.execute();

            String androidResponse = response.body().string();
            String opc = BaseEncoding.base64().encode(androidResponse.getBytes());
            TapAndPayClient tapAndPayClient = TapAndPay.getClient(activity);

            PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
                    .setOpaquePaymentCard(opc.getBytes())
                    .setNetwork(TapAndPay.CARD_NETWORK_MASTERCARD)
                    .setTokenServiceProvider(TapAndPay.TOKEN_PROVIDER_MASTERCARD)
                    .setDisplayName(cardHolder)
                    .setLastDigits(cardSuffix)
                    .build();
            tapAndPayClient.pushTokenize(
                    activity,
                    pushTokenizeRequest,
                    3
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void checkIfReadyToPay(String jsonReq, String environT , Activity activity, Promise promise) {

         int environ = WalletConstants.ENVIRONMENT_TEST;
        if (environT.toLowerCase(Locale.ROOT).equalsIgnoreCase("prod")) {
            environ = WalletConstants.ENVIRONMENT_PRODUCTION;
        }

        Wallet.WalletOptions walletOptions =
                new Wallet.WalletOptions.Builder().setEnvironment(environ).build();

        PaymentsClient paymentsClient = Wallet.getPaymentsClient(activity, walletOptions);
        IsReadyToPayRequest request = IsReadyToPayRequest.fromJson(jsonReq);
       paymentsClient.isReadyToPay(request).addOnCompleteListener(completedTask -> {
           if (completedTask.isSuccessful()) {
               promise.resolve(true);
           } else {
               Log.w("isReadyToPay failed", completedTask.getException());
               promise.resolve(false);
           }
       });

    }
}
