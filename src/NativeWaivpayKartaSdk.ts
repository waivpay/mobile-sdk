import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  addCard(
    cardId: string,
    cardSuffix: string,
    cardHolder: string,
    env: string,
    deliveryEmail: string,
    appId: string,
    accessToken: string,
    url: string,
    header: Object
  ): Promise<boolean>;
  cardExists(cardId: string): Promise<boolean>;
  checkIfReadyToPay(jsonReq: string, environment: string): Promise<boolean>;
  startBeacon(sessionToken: string, shop: string): Promise<void>;
  updateToken(sessionToken: string): Promise<void>;
  beaconLogRequest(requestUrl: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WaivpayKartaSdk');
