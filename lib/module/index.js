import { NativeModules, Platform } from 'react-native';
import { getConfig } from './ApiCall';
const LINKING_ERROR = `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const WaivpayKartaSdk = NativeModules['WaivpayKartaSdk'] ? NativeModules['WaivpayKartaSdk'] : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
export async function addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken) {
  const config = await getConfig();
  var custHeader = {
    "": ""
  };
  var url = "";

  if (config != null && config.headers != null) {
    custHeader = config.headers;
  }

  if (config != null && config.host != null && config.host != "") {
    url = config.host;
  }

  return WaivpayKartaSdk.addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken, url, custHeader);
}
export function cardExists(cardId) {
  return WaivpayKartaSdk.cardExists(cardId);
}
export function checkIfReadyToPay(jsonReq, environment) {
  return WaivpayKartaSdk.checkIfReadyToPay(jsonReq, environment);
}
export function startBeacon(sessionToken, shop) {
  return WaivpayKartaSdk.startBeacon(sessionToken, shop);
}
export function updateToken(sessionToken) {
  return WaivpayKartaSdk.updateToken(sessionToken);
}
export function beaconLogRequest(requestUrl) {
  return WaivpayKartaSdk.beaconLogRequest(requestUrl);
}
//# sourceMappingURL=index.js.map