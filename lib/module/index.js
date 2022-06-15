import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const WaivpayKartaSdk = NativeModules.WaivpayKartaSdk ? NativeModules.WaivpayKartaSdk : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});
export function addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken) {
  return WaivpayKartaSdk.addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken);
}
export function cardExists(cardId) {
  return WaivpayKartaSdk.cardExists(cardId);
}
export function multiply(a, b) {
  return WaivpayKartaSdk.multiply(a, b);
}
//# sourceMappingURL=index.js.map