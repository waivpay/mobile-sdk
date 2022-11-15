import { NativeModules, Platform } from 'react-native';
import { getConfig } from './ApiCall';

const LINKING_ERROR =
  `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const WaivpayKartaSdk = NativeModules.WaivpayKartaSdk
  ? NativeModules.WaivpayKartaSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function addCard(cardId: String, cardSuffix: String, cardHolder: String, env: String, deliveryEmail: String, appId: String, accessToken: String): Promise<String> {
  const config = await getConfig();
  var custHeader: {[key: string]: string} = {"":""};
  var url = "";
  
  if(config != null && config.headers != null)
  {
    custHeader = config.headers;
  }
  if(config != null && config.host != null && config.host != ""){
    url = config.host
  }
  return WaivpayKartaSdk.addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken, url, custHeader);
}

export function cardExists(cardId: String): Promise<String> {
  return WaivpayKartaSdk.cardExists(cardId);
}

export function checkIfReadyToPay(jsonReq: String, environment: String): Promise<String> {
  return WaivpayKartaSdk.checkIfReadyToPay(jsonReq, environment);
  
}
export function startBeacon(sessionToken: String, shop: String): Promise<String> {
  return WaivpayKartaSdk.startBeacon(sessionToken, shop);
}

export function updateToken(sessionToken: String): Promise<String> {
  return WaivpayKartaSdk.updateToken(sessionToken);
}

export function beaconLogRequest(requestUrl: String): Promise<String> {
  return WaivpayKartaSdk.beaconLogRequest(requestUrl);
}
