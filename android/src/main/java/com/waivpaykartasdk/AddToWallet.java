package com.waivpaykartasdk;

import android.app.Activity;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.issuer.GeneratePaymentCredentialsRequest;
import com.google.android.gms.tapandpay.issuer.GeneratePaymentCredentialsResponse;
import com.google.android.gms.tapandpay.issuer.PaymentCredentialsGenerator;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import com.google.android.gms.tapandpay.issuer.TokenInfo;
import com.google.android.gms.wallet.IsReadyToPayRequest;
import com.google.android.gms.wallet.Wallet;
import com.google.android.gms.wallet.PaymentsClient;
import com.google.android.gms.wallet.WalletConstants;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.OnCompleteListener;
import androidx.annotation.NonNull;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;
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
  private static final int REQUEST_CREATE_WALLET = 4;
  private static final String TAG = "AddToWallet";

  public AddToWallet() {

  }

  public void addCardToWallet(String cardId, String cardSuffix, String cardHolder, String env, String deliveryEmail,
      String appId, String accessToken, String url, ReadableMap header, Activity activity) {
    try {
      String postUrl = HOST_STAGING;
      if (url != null && !url.equalsIgnoreCase("")) {
        postUrl = url + "/";
      } else if (env.toLowerCase(Locale.ROOT).equalsIgnoreCase("prod")) {
        postUrl = HOST_PRODUCTION;
      }
      postUrl = postUrl + "api/apps/" + appId + "/cards/" + cardId + "/provision";

      // Copy the headers on the RN thread; the generator runs its HTTP call on a
      // background thread and ReadableMap is not safe to read there.
      final Map<String, String> headerMap = new HashMap<>();
      if (header != null) {
        ReadableMapKeySetIterator iterator = header.keySetIterator();
        while (iterator.hasNextKey()) {
          String key = iterator.nextKey();
          if (!key.equalsIgnoreCase("") && !header.getString(key).equalsIgnoreCase("")) {
            headerMap.put(key, header.getString(key));
          }
        }
      }

      TapAndPayClient tapAndPayClient = TapAndPay.getClient(activity);

      // UPP: no OPC is passed up front. Google Play services calls the
      // PaymentCredentialsGenerator during pushTokenize() and the OPCs are
      // fetched there (serverSessionId only exists inside that callback).
      PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
          .setNetwork(TapAndPay.CARD_NETWORK_MASTERCARD)
          .setTokenServiceProvider(TapAndPay.TOKEN_PROVIDER_MASTERCARD)
          .setDisplayName(cardHolder)
          .setLastDigits(cardSuffix)
          .setPaymentCredentialsGenerator(
              new KartaPaymentCredentialsGenerator(postUrl, accessToken, headerMap, deliveryEmail))
          .build();

      tapAndPayClient
          .listTokens()
          .addOnCompleteListener(new OnCompleteListener<List<TokenInfo>>() {
            @Override
            public void onComplete(@NonNull Task<List<TokenInfo>> task) {
              if (task.isSuccessful()) {
                for (TokenInfo token : task.getResult()) {
                  if (token.getFpanLastFour().equals(cardSuffix) && String
                      .valueOf(TapAndPay.TOKEN_STATE_NEEDS_IDENTITY_VERIFICATION)
                      .equals(String.valueOf(token.getTokenState()))) {
                    tapAndPayClient.tokenize(
                        activity,
                        String.valueOf(token.getIssuerTokenId()),
                        TapAndPay.TOKEN_PROVIDER_MASTERCARD,
                        cardHolder,
                        TapAndPay.CARD_NETWORK_MASTERCARD,
                        3);
                    return;
                  }
                }
              }
              tapAndPayClient.pushTokenize(
                  activity,
                  pushTokenizeRequest,
                  3);
            }
          });
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * Supplies the two OPCs Google Wallet needs during a pushTokenize() session.
   * Calls the /provision wrapper with the serverSessionId handed over by
   * Google Play services. New response shape: {tsp_opc: {...}, google_opc: "..."}.
   * Falls back to the legacy whole-body OPC when those keys are absent.
   */
  private static class KartaPaymentCredentialsGenerator implements PaymentCredentialsGenerator {
    private final String postUrl;
    private final String accessToken;
    private final Map<String, String> headers;
    private final String deliveryEmail;

    KartaPaymentCredentialsGenerator(String postUrl, String accessToken, Map<String, String> headers,
        String deliveryEmail) {
      this.postUrl = postUrl;
      this.accessToken = accessToken;
      this.headers = headers;
      this.deliveryEmail = deliveryEmail;
    }

    @Override
    public Future<GeneratePaymentCredentialsResponse> generate(
        final GeneratePaymentCredentialsRequest request) {
      final CompletableFuture<GeneratePaymentCredentialsResponse> future = new CompletableFuture<>();
      new Thread(new Runnable() {
        @Override
        public void run() {
          try {
            String serverSessionId = request.getServerSessionId();
            Log.i(TAG, "generate() called, serverSessionId=" + serverSessionId
                + ", googleOpaquePaymentCardRequested=" + request.getGoogleOpaquePaymentCardRequested());

            org.json.JSONObject body = new org.json.JSONObject();
            body.put("wallet_type", "android");
            body.put("delivery_email", deliveryEmail);
            if (serverSessionId != null && !serverSessionId.isEmpty()) {
              body.put("server_session_id", serverSessionId);
            }

            String response = postForCredentials(body);
            Log.i(TAG, "/provision response: " + response);

            org.json.JSONObject parsed = new org.json.JSONObject(response);
            byte[] tspOpc;
            byte[] googleOpc = null;
            if (parsed.has("tsp_opc") || parsed.has("google_opc")) {
              if (parsed.has("tsp_opc")) {
                // tsp_opc is what the API used to return; the OPC handed to
                // setOpaquePaymentCard is that payload Base64-encoded.
                String tspOpcJson = parsed.getJSONObject("tsp_opc").toString();
                tspOpc = Base64.encode(tspOpcJson.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP);
              } else {
                tspOpc = null;
              }
              // The wrapper returns the Google OPC pre-encoded; the SDK wants
              // the decoded bytes. Note Karta's own API uses the field name
              // "opaquePaymentCard" instead of "google_opc".
              if (parsed.has("google_opc") && request.getGoogleOpaquePaymentCardRequested()) {
                googleOpc = Base64.decode(parsed.getString("google_opc"), Base64.DEFAULT);
              }
            } else {
              // Legacy response: whole body is the OPC payload.
              tspOpc = Base64.encode(response.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP);
            }

            future.complete(new GeneratePaymentCredentialsResponse.Builder()
                .setOpaquePaymentCard(tspOpc)
                .setGoogleOpaquePaymentCard(googleOpc)
                .build());
          } catch (Exception e) {
            Log.e(TAG, "Failed to generate payment credentials", e);
            future.completeExceptionally(e); // -> Wallet reports cardStatus=15032
          }
        }
      }).start();
      return future;
    }

    @Override
    public boolean getGoogleOpaquePaymentCardSupported() {
      return true;
    }

    private String postForCredentials(org.json.JSONObject body) throws Exception {
      OkHttpClient.Builder builder = new OkHttpClient.Builder();
      builder.connectTimeout(5, TimeUnit.MINUTES) // connect timeout
          .writeTimeout(5, TimeUnit.MINUTES) // write timeout
          .readTimeout(5, TimeUnit.MINUTES); // read timeout

      OkHttpClient client = builder.build();
      Request.Builder build = new Request.Builder();

      build = build.addHeader("Authorization", "Bearer " + accessToken);
      for (Map.Entry<String, String> entry : headers.entrySet()) {
        build = build.addHeader(entry.getKey(), entry.getValue());
      }

      Request request = build
          .url(postUrl)
          .post(RequestBody.create(MediaType.parse("application/json"), body.toString()))
          .build();

      Call call = client.newCall(request);
      Response response = call.execute();
      String responseBody = response.body().string();
      if (!response.isSuccessful()) {
        throw new RuntimeException("/provision failed: HTTP " + response.code() + " - " + responseBody);
      }
      return responseBody;
    }
  }

  public void checkIfReadyToPay(String jsonReq, String environT, Activity activity, Promise promise) {

    int environ = WalletConstants.ENVIRONMENT_TEST;
    if (environT.toLowerCase(Locale.ROOT).equalsIgnoreCase("prod")) {
      environ = WalletConstants.ENVIRONMENT_PRODUCTION;
    }

    Wallet.WalletOptions walletOptions = new Wallet.WalletOptions.Builder().setEnvironment(environ).build();

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

  public void checkIsCardAdded(String id, Activity activity, Promise promise) {
    TapAndPayClient tapAndPayClient = TapAndPay.getClient(activity);
    tapAndPayClient
        .getActiveWalletId()
        .addOnCompleteListener(
            new OnCompleteListener<String>() {
              @Override
              public void onComplete(@NonNull Task<String> task) {
                if (task.isSuccessful()) {
                  tapAndPayClient
                      .listTokens()
                      .addOnCompleteListener(new OnCompleteListener<List<TokenInfo>>() {
                        @Override
                        public void onComplete(@NonNull Task<List<TokenInfo>> task) {
                          if (task.isSuccessful()) {
                            for (TokenInfo token : task.getResult()) {
                              if (token.getFpanLastFour().equals(id) &&
                                  String.valueOf(TapAndPay.TOKEN_STATE_ACTIVE)
                                      .equals(String.valueOf(token.getTokenState()))) {
                                promise.resolve(true);
                                return;
                              }
                            }
                            promise.resolve(false);
                          }
                        }
                      });
                } else {
                  tapAndPayClient.createWallet(activity, REQUEST_CREATE_WALLET);
                  checkIsCardAdded(id, activity, promise);
                }
              }
            });
  }
}
