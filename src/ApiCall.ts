import { AppConfig } from './Models/AppConfig';
import { EndPoints } from './util/ServerEndPoints';
import { Profile } from './Models/Profile';
import type { Order } from './Models/Order';
import { Brand } from './Models/Brand';
import { Balance } from './Models/Balance';
import { Catalogue } from './Models/Catalogue';
import { Transaction } from './Models/Transaction';
import { Card } from './Models/Card';
import { OrderResponse } from './Models/OrderResponse';
import { CardList } from './Models/CardList';
import { OrderList } from './Models/OrderList';
import { CardCallBackResponse } from './Models/CardCallBackResponse';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Eway } from './util/ServerEndPoints';
import { encryptFromSDK2 } from './util/SDKEncryptionTS.d'
import { startBeacon } from './index';
import { updateToken } from './index';
import { beaconLogRequest } from './index';

let appIdC = 'appId';
let waivpay_sdk_config_app_id = '_waivpay_sdk_config_app_id';
let sidC = '_sid';
let waivpay_sdk_verificationId = '_waivpay_sdk_verificationId';
let accessToken_staging = '_accessToken_staging';
let accessToken_prod = '_accessToken_prod';


async function consoleLog(config: AppConfig, message: string) {
  if (config && config.environment == 'staging') {
    console.log(message);
  }
}

export async function getConfig() {
  let appConfig = new AppConfig();
  let appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
  const config = await EncryptedStorage.getItem(appId + waivpay_sdk_config_app_id);
  appConfig = JSON.parse(config || '{}');
  return appConfig;
}

function getHostEndPoints(config: AppConfig) {
  consoleLog(config, 'API call - getHostEndPoints');
  if (config != null && config.host != null && config.host != '') {
    return config.host;
  }
  else if (config != null && config.environment != null && config.environment != '') {
    if (config.environment == 'staging') {
      return EndPoints.host_staging;
    } else if (config.environment == 'prod') {
      return EndPoints.host_prod;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function getEWayEncryptionKey(config: AppConfig) {
  consoleLog(config, 'API call - getEWayEncryptionKey');
  if (config != null && config.environment != null && config.environment != '') {
    if (config.environment == 'staging') {
      return Eway.encryptionKeyStaging;
    } else if (config.environment == 'prod') {
      return Eway.encryptionKeyProd;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

async function sendToEndPoint(config: AppConfig, accessType: string, url: string, accessToken: String, data: string): Promise<any> {
  consoleLog(config, '_________________________________________');
  consoleLog(config, 'sendToEndPoint TS ' + accessType + ' ' + url + ' ' + accessToken);
  consoleLog(config, 'Request');
  consoleLog(config, data);
  const authorization = 'Bearer ' + accessToken;

  var head: { [key: string]: string } = {
    'Authorization': authorization,
    'Content-Type': 'application/json'
  };
  if (config != null && config.headers != null) {
    var custHeader: { [key: string]: string } = config.headers;

    for (const key in custHeader) {
      if (custHeader.hasOwnProperty(key)) {
        head[key] = custHeader[key]!;
      }
    }
  }
  const response = await fetch(url, {
    method: accessType,
    headers: head,
    body: data,
  }).catch((error) => {
    throw (error);
  });

  const responseText = await response.json();
  consoleLog(config, 'Response');
  consoleLog(config, responseText);
  consoleLog(config, '_________________________________________');

  if (!response.ok) {
    throw new Error(JSON.stringify(responseText));
  }
  logRequestBeacon(url);
  return responseText;
}


async function getBeaconSessionId() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 22; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  var appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
  await EncryptedStorage.setItem(appId + sidC, result);
  return result;


}

export async function activateBeacon() {
  const config = await getConfig();
  var sid = await getBeaconSessionId();
  startBeacon(sid, config.shop);
}

async function logRequestBeacon(url: String) {
  beaconLogRequest(url);
}

async function updateBeacon() {
  var sid = await getBeaconSessionId();
  updateToken(sid);
}

//sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(appConfig: AppConfig) {
  if (appConfig != null && appConfig instanceof AppConfig) {
    const client_id = appConfig.client_id;
    const client_secret = appConfig.client_secret;
    const app_id = appConfig.app_id;
    const environment = appConfig.environment;
    const host = appConfig.host;
    const headers = appConfig.headers;
    var shop = appConfig.shop;
    if (
      client_id != null &&
      client_id !== 'undefined' &&
      client_secret != null &&
      client_secret !== 'undefined' &&
      app_id != null &&
      app_id !== 'undefined' &&
      environment != null &&
      environment !== 'undefined'
    ) {
      if (shop == null ||
        shop == 'undefined') {
        shop = 'www.waivpay.com'
      }
      appConfig = new AppConfig();
      appConfig.client_id = client_id;
      appConfig.app_id = app_id;
      appConfig.client_secret = client_secret;
      appConfig.environment = environment;
      appConfig.shop = shop;
      if (host != null) {
        appConfig.host = host;
      }
      if (headers != null) {
        appConfig.headers = headers;
      }
      await EncryptedStorage.setItem(appConfig.app_id +
        waivpay_sdk_config_app_id,
        JSON.stringify(appConfig),
      );
      await EncryptedStorage.setItem(appIdC,
        JSON.stringify(appConfig.app_id),
      );
    } else {
      throw new Error('All parameters need to be passed to set config');
    }
  } else {
    throw new Error(
      'Please use AppConfig class to pass app configuration parameters',
    );
  }
}

// function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
export async function getAccessToken() {
  const config = await getConfig();
  consoleLog(config, 'API call - getAccessToken');
  var accessToken = null;
  if (config.environment == 'staging') {
    accessToken = await EncryptedStorage.getItem(appId + accessToken_staging);
  }
  else {
    accessToken = await EncryptedStorage.getItem(appId + accessToken_prod);
  }
  if (config != null) {
    if (typeof accessToken !== 'undefined' && accessToken != null) {
      const accessToken_Obj = JSON.parse(accessToken);
      const createdTime = accessToken_Obj.created_at + 6000;
      const expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
      expiresAt.setUTCSeconds(createdTime);
      if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
        return accessToken_Obj.access_token;
      }
    }
    const url = getHostEndPoints(config) + EndPoints.accessToken;
    const data =
      'grant_type=client_credentials&' +
      'client_id=' +
      config.client_id +
      '&client_secret=' +
      config.client_secret;

    var head: { [key: string]: string } = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    if (config != null && config.headers != null) {
      var custHeader: { [key: string]: string } = config.headers;

      for (const key in custHeader) {
        if (custHeader.hasOwnProperty(key)) {
          head[key] = custHeader[key]!;
        }
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: head,
      body: data,
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();
    var appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
    if (responseText) {
      if (config.environment == 'staging') {
        EncryptedStorage.setItem(appId + accessToken_staging, JSON.stringify(responseText));
      }
      else {
        EncryptedStorage.setItem(appId + accessToken_prod, JSON.stringify(responseText));
      }
      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}

export async function sendTwoFactor(mobile: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - sendTwoFactor');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor;
      const data = { 'mobile_number': mobile };
      await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(data)).then(async response => {
        var appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
        EncryptedStorage.setItem(appId + waivpay_sdk_verificationId, response.verification_id.toString());
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function verifyTwoFactor(code: string) {
  const config = await getConfig();
  return new Promise(async function (resolve, reject) {
    try {
      consoleLog(config, 'API call - verifyTwoFactor');
      var appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
      const verificationId = await EncryptedStorage.getItem(appId + waivpay_sdk_verificationId);
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor + '/' + verificationId;
      const data = { verification_code: code };

      await sendToEndPoint(config, 'PUT', url, accessToken, JSON.stringify(data)).then(response => {
        resolve(response);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get App Details
export async function getBrand(): Promise<Brand> {
  const config = await getConfig();
  consoleLog(config, 'API call - getBrand');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id;
      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Brand();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get catalogue
export async function getCatalogue(): Promise<Catalogue> {
  const config = await getConfig();
  consoleLog(config, 'API call - getCatalogue');

  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.catalogue;

      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Catalogue();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getBalance(cardId: string): Promise<Balance> {
  const config = await getConfig();
  consoleLog(config, 'API call - getBalance');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.cards +
        '/' +
        cardId +
        EndPoints.balance;

      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Balance();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get transactions
export async function getTransactions(cardId: string): Promise<Transaction> {
  const config = await getConfig();
  consoleLog(config, 'API call - getTransactions');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.cards +
        '/' +
        cardId +
        EndPoints.transaction;
      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Transaction();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get cardDetails
export async function getCardDetails(cardId: string, email: string, mobile: string): Promise<Card> {
  const config = await getConfig();
  consoleLog(config, 'API call - getCardDetails');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.cards +
        '/' +
        cardId;
      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Card();
        responseObject = response;
        if (email != null && mobile == responseObject.delivery_sms_number) {
          const url2 = getHostEndPoints(config) +
            EndPoints.appSpecific +
            config.app_id +
            EndPoints.cards +
            '/' +
            responseObject.card_id;
          const data2 = { 'email': email };
          sendToEndPoint(config, 'PUT', url2, accessToken, JSON.stringify(data2)).catch((error2: Error) => {
            consoleLog(config, 'Update failed ' + error2);
          });
        }
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Remove card from app
export async function removeCard(cardId: string): Promise<Card> {
  const config = await getConfig();
  consoleLog(config, 'API call - removeCard');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessToken();

    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId;
    await sendToEndPoint(config, 'DELETE', url, accessToken, '').then(
      function (responseText) {
        resolve(responseText);
      }).catch((error: Error) => {
        reject(error);
      });
  });
}

//create a new user
export async function createProfile(user: Profile): Promise<Profile> {
  const config = await getConfig();
  consoleLog(config, 'API call - createProfile');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users;

      await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(user)).then(response => {
        let responseObject = new Profile();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

//create an order
export async function createOrder(order: Order): Promise<OrderResponse> {
  const config = await getConfig();
  var appId = JSON.parse(await EncryptedStorage.getItem(appIdC) || '{}');
  var sid = await EncryptedStorage.getItem(appId + sidC);
  consoleLog(config, 'API call - createOrder');
  return new Promise(async function (resolve, reject) {
    try {
      var encryptionKey = getEWayEncryptionKey(config);
      if (order.credit_card_number != null && order.credit_card_number != 'undefined') {
        order.credit_card_number = encryptFromSDK2(order.credit_card_number, encryptionKey)!;
      }
      if (order.credit_card_security_code != null && order.credit_card_security_code != 'undefined') {
        order.credit_card_security_code = encryptFromSDK2(order.credit_card_security_code, encryptionKey)!;
      }
      if (sid != null) {
        order.session_identifier = sid;
      }
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders;

      await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(order)).then(async response => {
        let responseObject = new OrderResponse();
        responseObject = response;
        var sidInStorage = await EncryptedStorage.getItem(appId + sidC);
        if (sidInStorage != 'undefined' && sidInStorage != null) {
          await EncryptedStorage.removeItem(appId + sidC);
        }
        updateBeacon();
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get cards by mobile number
export async function searchCards(mobile: string): Promise<CardList> {
  const config = await getConfig();
  consoleLog(config, 'API call - searchCards');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.cards +
        '?mobile_number=' +
        mobile;

      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new CardList();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// get User Profile
export async function getProfile(userId: string): Promise<Profile> {
  const config = await getConfig();
  consoleLog(config, 'API call - getProfile');
  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users +
        '/' +
        userId;
      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new Profile();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

//update a user profile
export async function updateProfile(user: Profile): Promise<Profile> {
  const config = await getConfig();
  consoleLog(config, 'API call - updateProfile');
  if (user.id != null) {
    return new Promise(async function (resolve, reject) {
      try {
        const accessToken = await getAccessToken();
        const url =
          getHostEndPoints(config) +
          EndPoints.appSpecific +
          config.app_id +
          EndPoints.users +
          '/' +
          user.id;
        await sendToEndPoint(config, 'PUT', url, accessToken, JSON.stringify(user)).then(response => {
          let responseObject = new Profile();
          responseObject = response;
          resolve(responseObject);
        }).catch((error: Error) => {
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    throw 'Please provide an id for the user';
  }
}

// Delete user profile
export async function deleteProfile(userId: string): Promise<Profile> {
  const config = await getConfig();
  consoleLog(config, 'API call - deleteProfile');

  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.users +
      '/' +
      userId;

    await sendToEndPoint(config, 'DELETE', url, accessToken, '').then(response => {
      resolve(response);
    }).catch((error: Error) => {
      reject(error);
    });
  });
}

export async function getOrders(user_id: string): Promise<OrderList> {
  const config = await getConfig();
  consoleLog(config, 'API call - getOrders');

  return new Promise(async function (resolve, reject) {
    try {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders +
        '?user_id=' +
        user_id;

      await sendToEndPoint(config, 'GET', url, accessToken, '').then(response => {
        let responseObject = new OrderList();
        responseObject = response;
        resolve(responseObject);
      }).catch((error: Error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function cardCallBack(callBackUrl: string, token: string): Promise<CardCallBackResponse> {
  const config = await getConfig();
  consoleLog(config, 'API call - cardCallBack');
  return new Promise(async function (resolve, reject) {
    const accessToken = token;
    const url = callBackUrl;
    const req = { tokenId: token };
    await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(req)).then(response => {
      let responseObject = new CardCallBackResponse();
      responseObject = response;
      resolve(responseObject);
    }).catch((error: Error) => {
      reject(error);
    });
  });
}
