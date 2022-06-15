"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCard = addCard;
exports.cardExists = cardExists;
exports.multiply = multiply;

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

function addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken) {
  return WaivpayKartaSdk.addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken);
}

function cardExists(cardId) {
  return WaivpayKartaSdk.cardExists(cardId);
}

function multiply(a, b) {
  return WaivpayKartaSdk.multiply(a, b);
}
//# sourceMappingURL=index.js.map