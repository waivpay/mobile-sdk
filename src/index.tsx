import { Platform } from 'react-native';
import NativeWaivpayKartaSdk from './NativeWaivpayKartaSdk';
import type { Spec } from './NativeWaivpayKartaSdk';
import { getConfig } from './ApiCall';

const LINKING_ERROR =
  `The package 'waivpay-karta-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const WaivpayKartaSdk: Spec = NativeWaivpayKartaSdk
  ? NativeWaivpayKartaSdk
  : (new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    ) as Spec);

export async function addCard(
  cardId: string,
  cardSuffix: string,
  cardHolder: string,
  env: string,
  deliveryEmail: string,
  appId: string,
  accessToken: string
): Promise<boolean> {
  const config = await getConfig();
  var custHeader: { [key: string]: string } = { '': '' };
  var url = '';

  if (config != null && config.headers != null) {
    custHeader = config.headers;
  }
  if (config != null && config.host != null && config.host != '') {
    url = config.host;
  }
  return WaivpayKartaSdk.addCard(
    cardId,
    cardSuffix,
    cardHolder,
    env,
    deliveryEmail,
    appId,
    accessToken,
    url,
    custHeader
  );
}

export function cardExists(cardId: string): Promise<boolean> {
  return WaivpayKartaSdk.cardExists(cardId);
}

export function checkIfReadyToPay(
  jsonReq: string,
  environment: string
): Promise<boolean> {
  return WaivpayKartaSdk.checkIfReadyToPay(jsonReq, environment);
}

export function startBeacon(sessionToken: string, shop: string): Promise<void> {
  return WaivpayKartaSdk.startBeacon(sessionToken, shop);
}

export function updateToken(sessionToken: string): Promise<void> {
  return WaivpayKartaSdk.updateToken(sessionToken);
}

export function beaconLogRequest(requestUrl: string): Promise<void> {
  return WaivpayKartaSdk.beaconLogRequest(requestUrl);
}

export { getStores, setLogout } from './ApiCall';
export type { Store } from './Models/Store';
