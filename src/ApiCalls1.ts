import AsyncStorage from '@react-native-async-storage/async-storage';

//sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay
import { AppConfig1 } from './AppConfig1';

export async function setConfig(appConfig: AppConfig1) {
  if (appConfig != null && appConfig instanceof AppConfig1) {
    const client_id = appConfig.client_id;
    const client_secret = appConfig.client_secret;
    const app_id = appConfig.app_id;
    const environment = appConfig.environment;
    if (
      client_id != null &&
      client_id !== 'undefined' &&
      client_secret != null &&
      client_secret !== 'undefined' &&
      app_id != null &&
      environment != null &&
      environment !== 'undefined'
    ) {
      appConfig = new AppConfig1(client_id, client_secret, app_id, environment);
      await AsyncStorage.setItem(
        'waivpay_sdk_config_app_id',
        JSON.stringify(appConfig)
      );
    } else {
      throw new Error('All parameters need to be passed to set config');
    }
  } else {
    throw new Error(
      'Please use AppConfig class to pass app configuration parameters'
    );
  }
}
