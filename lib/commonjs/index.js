"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCard = addCard;

var _reactNative = require("react-native");

const LINKING_ERROR = `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const WaivpayKartaSdk = _reactNative.NativeModules.WaivpayKartaSdk ? _reactNative.NativeModules.WaivpayKartaSdk : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});

function addCard(cardId, cardHolder, env, deliveryEmail, appId, accessToken) {
  return WaivpayKartaSdk.addCard(cardId, cardHolder, env, deliveryEmail, appId, accessToken);
}
//# sourceMappingURL=index.js.map