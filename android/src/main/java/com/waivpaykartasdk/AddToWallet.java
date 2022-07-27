package com.waivpaykartasdk;

import android.app.Activity;
import android.util.Base64;
import android.util.Log;
import android.app.Application;

import androidx.appcompat.app.AppCompatActivity;

import com.facebook.react.bridge.Promise;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import org.json.JSONObject;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.Wallet;


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
//    public class AddToWallet extends AppCompatActivity {
// A client for interacting with the Google Pay API.
   private  PaymentsClient paymentsClient;


    public static final String HOST_STAGING = "https://webstores-staging.herokuapp.com/";
    public static final String HOST_PRODUCTION = "https://webstores.herokuapp.com/";

    public AddToWallet() {

    }

    public void addCardToWallet(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail, String appId, String accessToken, Activity activity) {
        try {
            String postUrl = HOST_STAGING;
            if (env.toLowerCase(Locale.ROOT).equalsIgnoreCase("prod")) {
                postUrl = HOST_PRODUCTION;
            }
            postUrl = postUrl + "api/apps/" + appId + "/cards/" + cardId + "/provision";

            Log.e("KLHERE", "postUrl " + postUrl);
            Log.e("KLHERE", "cardId " + cardId);
            Log.e("KLHERE", "cardSuffix " + cardSuffix);
            Log.e("KLHERE", "cardHolder " + cardHolder);
            Log.e("KLHERE", "env " + env);
            Log.e("KLHERE", "deliveryEmail " + deliveryEmail);
            Log.e("KLHERE", "appId " + appId);
            Log.e("KLHERE", "accessToken " + accessToken);


            String json = "{\"wallet_type\":\"android\",\"delivery_email\":\"" + deliveryEmail + "\"}";

            Log.e("KLHERE", "json " + json);

            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"), json);

            OkHttpClient.Builder builder = new OkHttpClient.Builder();
            builder.connectTimeout(5, TimeUnit.MINUTES) // connect timeout
                    .writeTimeout(5, TimeUnit.MINUTES) // write timeout
                    .readTimeout(5, TimeUnit.MINUTES); // read timeout

            OkHttpClient client = builder.build();
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .url(postUrl)
                    .post(body)
                    .build();

            Call call = client.newCall(request);
            Response response = call.execute();

            String androidResponse = response.body().string();
            Log.e("KLHERE",androidResponse);

//            byte[] opc = Base64.encode(androidResponse.getBytes(), Base64.DEFAULT);
            String opc = BaseEncoding.base64().encode(androidResponse.getBytes());
            Log.e("KLHERE","opc");
            TapAndPayClient tapAndPayClient = TapAndPay.getClient(activity);
            Log.e("KLHERE","client");

            PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
                    .setOpaquePaymentCard(opc.getBytes())
                    .setNetwork(TapAndPay.CARD_NETWORK_MASTERCARD)
                    .setTokenServiceProvider(TapAndPay.TOKEN_PROVIDER_MASTERCARD)
                    .setDisplayName(cardHolder)
                    .setLastDigits(cardSuffix)
                    .build();
            Log.e("KLHERE","pushTokenizeRequest");
            tapAndPayClient.pushTokenize(
                    activity,
                    pushTokenizeRequest,
                    3
            );
            Log.e("KLHERE","pushTokenize");
        } catch (Exception e) {
            Log.e("KLHERE",e.getMessage());
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

        paymentsClient = Wallet.getPaymentsClient(activity, walletOptions);
//       String jsonStringReq = "{\n" +
//               "  \"apiVersion\": 2,\n" +
//               "  \"apiVersionMinor\": 0,\n" +
//               "  \"allowedPaymentMethods\": [\n" +
//               "    {\n" +
//               "      \"type\": \"CARD\",\n" +
//               "      \"parameters\": {\n" +
//               "        \"allowedAuthMethods\": [\"PAN_ONLY\", \"CRYPTOGRAM_3DS\"],\n" +
//               "        \"allowedCardNetworks\": [\"AMEX\", \"DISCOVER\", \"INTERAC\", \"JCB\", \"MASTERCARD\", \"MIR\", \"VISA\"]\n" +
//               "      }\n" +
//               "    }\n" +
//               "  ]\n" +
//               "}";

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
