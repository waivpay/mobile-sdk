"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCard = addCard;
exports.beaconLogRequest = beaconLogRequest;
exports.cardExists = cardExists;
exports.checkIfReadyToPay = checkIfReadyToPay;
exports.startBeacon = startBeacon;
exports.updateToken = updateToken;

var _reactNative = require("react-native");

var _ApiCall = require("./ApiCall");

const LINKING_ERROR = `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo managed workflow\n';
const WaivpayKartaSdk = _reactNative.NativeModules['WaivpayKartaSdk'] ? _reactNative.NativeModules['WaivpayKartaSdk'] : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }

});

async function addCard(cardId, cardSuffix, cardHolder, env, deliveryEmail, appId, accessToken) {
  const config = await (0, _ApiCall.getConfig)();
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

function cardExists(cardId) {
  return WaivpayKartaSdk.cardExists(cardId);
}

function checkIfReadyToPay(jsonReq, environment) {
  return WaivpayKartaSdk.checkIfReadyToPay(jsonReq, environment);
}

function startBeacon(sessionToken, shop) {
  return WaivpayKartaSdk.startBeacon(sessionToken, shop);
}

function updateToken(sessionToken) {
  return WaivpayKartaSdk.updateToken(sessionToken);
}

function beaconLogRequest(requestUrl) {
  return WaivpayKartaSdk.beaconLogRequest(requestUrl);
}
//# sourceMappingURL=index.js.map