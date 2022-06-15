package com.waivpaykartasdk;

import android.app.Activity;
import android.util.Base64;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;

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

    public static final String HOST_STAGING = "https://webstores-staging.herokuapp.com/";
    public static final String HOST_PRODUCTION = "https://webstores.herokuapp.com/";

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

            byte[] opc = Base64.encode(androidResponse.getBytes(), Base64.DEFAULT);

            TapAndPayClient tapAndPayClient = TapAndPay.getClient(activity);
            PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
                    .setOpaquePaymentCard(opc)
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
}
