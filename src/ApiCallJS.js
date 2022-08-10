import { EndPoints, EndPointsCashBack } from './util/ServerEndPoints';
import { Product } from './Models/Product';
import { Catalogue } from './Models/Catalogue';
import { Brand } from './Models/Brand';
import { Location } from './Models/Location';
import { Balance } from './Models/Balance';
import { Transaction } from './Models/Transaction';
import { TransactionList } from './Models/TransactionList';
import { CardList } from './Models/CardList';
import { Card } from './Models/Card';
import { Profile } from './Models/Profile';
import { ErrorResponse } from './Models/ErrorResponse';
import { AppConfig } from './Models/AppConfig';
import { Order } from './Models/Order';
import { OrderResponse } from './Models/OrderResponse';
import { OrderList } from './Models/OrderList';
import EncryptedStorage from 'react-native-encrypted-storage';
import { CardCallBackResponse } from './Models/CardCallBackResponse';

async function getConfig() {
  let appConfig = new AppConfig();
  const config = await EncryptedStorage.getItem('waivpay_sdk_config_app_id');
  appConfig = JSON.parse(config);
  return appConfig;
}

function getHostEndPoints(config) {
  consoleLog(config, 'API call - getHostEndPoints');
  if (config && config.environment) {
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

async function consoleLog(config, message) {
  if (config && config.environment == 'staging') {
    console.log(message);
  }
}

function replacer(key, value) {
  if (value == 'undefined') return undefined;
  else if (value == null) return undefined;
  else return value;
}

function getHostEndPointsCashback(config) {
  consoleLog(config, 'API call - getHostEndPointsCashback');
  if (config && config.environment) {
    if (config.environment == 'staging') {
      return EndPointsCashBack.host_staging;
    } else if (config.environment == 'prod') {
      return EndPointsCashBack.host_prod;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

async function sendToEndPointString(config, accessType, url, accessToken, data) {
  consoleLog(config, '_________________________________________');
  consoleLog(config, 'sendToEndPoint ' + accessType + ' ' + url + ' ' + accessToken);
  consoleLog(config, 'Request');
  consoleLog(config, data);
  const authorization = 'Bearer ' + accessToken;

  const response = await fetch(url, {
    method: accessType,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
    body: data,
  }).catch((e) => {
    reject("Unable to process request");
  });

  const responseText = await response.json();
  consoleLog(config, 'Response');
  consoleLog(config, responseText);
  consoleLog(config, '_________________________________________');

  if (response.ok) {
    alert('Good - Inner');
    return responseText;
  } else {
    alert('Error - Inner');
    alert(JSON.stringify(responseText));
    reject(new Error("Error " + JSON.stringify(responseText)));
  }
}

export async function sendString(order) {
  const config = await getConfig();
  consoleLog(config, 'API call - createOrder');

  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.orders;

    await sendToEndPointString(config, 'POST', url, accessToken, order).then(
      function(value) {
        alert('Good - Outer ' + value);
        resolve(value);
      }
    ).catch((e) => {
      alert('Error - Outer ');
      reject("Unable to process request");
    });
  });
}

async function sendToEndPoint(config, accessType, url, accessToken, data) {
  consoleLog(config, '_________________________________________');
  consoleLog(config, 'sendToEndPoint JS ' + accessType + ' ' + url + ' ' + accessToken);
  consoleLog(config, 'Request');
  consoleLog(config, data);
  const authorization = 'Bearer ' + accessToken;

  const response = await fetch(url, {
    method: accessType,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data, replacer),
  }).catch((error) => {
    reject(error);
  });

  const responseText = await response.json();
  consoleLog(config, 'Response');
  consoleLog(config, responseText);
  consoleLog(config, '_________________________________________');

  if (response.ok) {
    return responseText;
  } else {
    reject(new Error("Error " + JSON.stringify(responseText)));
  }
}

async function sendToEndPointFileUpload(config, accessType, url, accessToken, data) {
  consoleLog(config, '_________________________________________');
  consoleLog(config, 'sendToEndPoint JS ' + accessType + ' ' + url + ' ' + accessToken);
  consoleLog(config, 'Request');
  consoleLog(config, data);
  const authorization = 'Bearer ' + accessToken;

  const response = await fetch(url, {
    method: accessType,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'multipart/form-data;',
    },
    body: data,
    redirect: 'follow'
  }).catch((error) => {
    reject(error);
  });

  const responseText = await response.json();
  consoleLog(config, 'Response');
  consoleLog(config, responseText);
  consoleLog(config, '_________________________________________');

  if (response.ok) {
    return responseText;
  } else {
    console.log("error is " + response);
    reject(new Error("Error " + JSON.stringify(responseText)));
  }
}


//sets client key,  client secret and app_id in EncryptedStorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(appConfig) {
  if (appConfig != null && appConfig instanceof AppConfig) {
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
      app_id !== 'undefined' &&
      environment != null &&
      environment !== 'undefined'
    ) {
      appConfig = new AppConfig(client_id, client_secret, app_id, environment);
      await EncryptedStorage.setItem(
        'waivpay_sdk_config_app_id',
        JSON.stringify(appConfig),
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

export async function sendTwoFactor(mobile) {
  const config = await getConfig();
  consoleLog(config, 'API call - sendTwoFactor');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor;
    const data = { 'mobile_number': mobile };
    await sendToEndPoint(config, 'POST', url, accessToken, data).then(
      function(responseText) {
        EncryptedStorage.setItem('waivpay_sdk_verificationId', responseText.verification_id.toString());
        resolve(responseText);
      }).catch((e) => {
      reject(e);
    });
  });
}

export async function verifyTwoFactor(code) {
  const config = await getConfig();
  return new Promise(async function(resolve, reject) {
    consoleLog(config, 'API call - verifyTwoFactor');
    const verificationId = await EncryptedStorage.getItem('waivpay_sdk_verificationId');
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor + '/' + verificationId;
    const data = { verification_code: code };

    await sendToEndPoint(config, 'PUT', url, accessToken, data).then (
      function(responseText) {
        resolve(responseText);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get App Details
export async function getBrand() {
  const config = await getConfig();
  consoleLog(config, 'API call - getBrand');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let app = new Brand('', '', [], '');
        app = responseText.app;
        const locs = [];
        const locations = responseText.app.locations;
        for (let i = 0; i < locations.length; i++) {
          let location = new Location();
          location = locations[i];
          locs.push(location);
        }
        app.locations = locs;
        resolve(app);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get catalogue
export async function getCatalogue() {
  const config = await getConfig();
  consoleLog(config, 'API call - getCatalogue');

  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.catalogue;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        const cat = new Catalogue([]);
        let prods = [];
        prods = responseText.products;
        for (let i = 0; i < prods.length; i++) {
          let prod = new Product();
          prod = prods[i];
          cat.products.push(prod);
        }
        resolve(cat);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get balance
export async function getBalance(cardId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getBalance');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.balance;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let bal = new Balance();
        bal = responseText;
        resolve(bal);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get transactions
export async function getTransactions(cardId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getTransactions');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.transaction;
    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let transs = [];
        let transactionList = new TransactionList([]);
        transs = responseText.transactions;
        for (let x = 0; x < transs.length; x++) {
          let transaction = new Transaction();
          transaction = transs[x];
          transactionList.transactions.push(transaction);
        }
      resolve(transactionList);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get cardDetails
export async function getCardDetails(cardId, email, mobile) {
  const config = await getConfig();
  consoleLog(config, 'API call - getCardDetails');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();

    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId;
    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let card = new Card();
        card = responseText;

        if (email != null && mobile == responseText.delivery_sms_number) {
          const url2 = getHostEndPoints(config) +
            EndPoints.appSpecific +
            config.app_id +
            EndPoints.cards +
            '/' +
            responseText.card_id;
          const data2 = { 'email': email };
           sendToEndPoint(config, 'PUT', url2, accessToken, data2);
        }
        resolve(card);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

//create a new user
export async function createProfile(user) {
  const config = await getConfig();
  consoleLog(config, 'API call - createProfile');
  if (user != null && user instanceof Profile) {
    return new Promise(async function(resolve, reject) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users;

      await sendToEndPoint(config, 'POST', url, accessToken, user).then (
        function(responseText) {
          let profile = new Profile();
          profile = responseText.user;
          resolve(profile);
        }).catch((e) => {
        reject("Unable to process request");
      });
    });
  } else {
    reject('Please pass object of type Profile');
  }
}

//create an order
export async function createOrder(order) {
  const config = await getConfig();
  consoleLog(config, 'API call - createOrder');
  if (order != null && order instanceof Order) {
    return new Promise(async function(resolve, reject) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders;

      await sendToEndPoint(config, 'POST', url, accessToken, order).then (
        function(responseText) {
          let orderResponse = new OrderResponse();
          if (responseText.error != 'undefined' && responseText.error != null) {
            orderResponse.error = responseText.error;
            orderResponse.hasError = true;
          } else {
            orderResponse = responseText;
          }

          resolve(orderResponse);
        }).catch((e) => {
        reject("Unable to process request");
      });
    });
  } else {
    reject('Please pass object of type Order');
  }
}

// get cards by mobile number
export async function searchCards(mobile) {
  const config = await getConfig();
  consoleLog(config, 'API call - searchCards');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '?mobile_number=' +
      mobile;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let cards = [];
        const cardList = new CardList([]);
        cards = responseText.cards;
        for (let i = 0; i < cards.length; i++) {
          let card = new Card();
          card = cards[i];
          cardList.cards.push(card);
        }
        resolve(cardList);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get User Profile
export async function getProfile(userId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getProfile');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.users +
      '/' +
      userId;
    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        let profile = new Profile();
        profile = responseText.user;
        resolve(profile);
    }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

//update a user profile
export async function updateProfile(user) {
  const config = await getConfig();
  consoleLog(config, 'API call - updateProfile');
  if (user != null && user instanceof Profile) {
    if (user.id != 'undefined' && user.id != null) {
      return new Promise(async function(resolve, reject) {
        const accessToken = await getAccessToken();
        const url =
          getHostEndPoints(config) +
          EndPoints.appSpecific +
          config.app_id +
          EndPoints.users +
          '/' +
          user.id;
        await sendToEndPoint(config, 'PUT', url, accessToken, user).then (
          function(responseText) {
            let profile = new Profile();
            profile = responseText.user;
            resolve(profile);
          }).catch((e) => {
          reject("Unable to process request");
        });
      });
    } else {
      reject('Please provide an id for the user');
    }
  } else {
    reject('Please pass object of type Profile');
  }
}

export async function getOrders(user_id) {
  const config = await getConfig();
  consoleLog(config, 'API call - getOrders');

  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.orders +
      '?user_id=' +
      user_id;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
        const orderList = new OrderList([]);
        let orders = [];
        orders = responseText.orders;
        for (let i = 0; i < orders.length; i++) {
          let order = new Order();
          order = orders[i];
          orderList.orders.push(order);
        }
        resolve(orderList);
      }).catch((e) => {
        reject("Unable to process request");
    });
  });
}

export async function cardCallBack(callBackUrl, token) {
  const config = await getConfig();
  consoleLog(config, 'API call - cardCallBack');
  return new Promise(async function(resolve, reject) {
    const accessToken = token;
    const url = callBackUrl;
    const req = { 'tokenId': token };
    await sendToEndPoint(config, 'POST', url, accessToken, req).then (
      function(responseText) {
        let carCallBackResponse = new CardCallBackResponse();
        carCallBackResponse = responseText;
        resolve(carCallBackResponse);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

/* ***********

CashBack Api calls

************* */


// file Upload
export async function fileUpload(fileInput, filename) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - fileUpload');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack._api +
      EndPointsCashBack.claims +
      EndPointsCashBack.fileUpload;
      var file = new File([fileInput.files[0]], filename);
    const data = new FormData();

    await sendToEndPointFileUpload(config, 'POST', url, accessToken, data).then (
      function(responseText) {
        resolve(responseText);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// list Promotions
export async function listPromotions() {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - listPromotions');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.orgSpecific +
      config.app_id +
      EndPointsCashBack.promotions;

    await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
      resolve(responseText);
    }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

//sets client key,  client secret and app_id in EncryptedStorage, to be used in subsequent api calls tp Waivpay
export async function setConfigCashBack(appConfig) {
  if (appConfig != null && appConfig instanceof AppConfig) {
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
      app_id !== 'undefined' &&
      environment != null &&
      environment !== 'undefined'
    ) {
      appConfig = new AppConfig(client_id, client_secret, app_id, environment);
      await EncryptedStorage.setItem(
        'waivpay_sdk_config_cashback_app_id',
        JSON.stringify(appConfig),
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

// get Promotion
export async function getPromotion(promotionId) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getPromotion');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.orgSpecific +
      config.app_id +
      EndPointsCashBack.promotions +
      '/' +
      promotionId;

    sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
      resolve(responseText);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

//create claim
export async function createClaim(claim, promotionId) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - createClaim');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack._api +
      EndPointsCashBack.promotions +
      '/' +
      promotionId +
      EndPointsCashBack.claims;

     await sendToEndPoint(config, 'POST', url, accessToken, claim).then (
      function(responseText) {
      resolve(responseText);
    }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// get claims for user
export async function getClaims(external_user_id) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getClaims');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack._api +
      EndPointsCashBack.claims +
      '?external_user_id=' +
      external_user_id;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
      resolve(responseText);
    }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

async function getConfigCashBack() {
  let appConfig = new AppConfig();
  const config = await EncryptedStorage.getItem(
    'waivpay_sdk_config_cashback_app_id',
  );
  if (config) {
    appConfig = JSON.parse(config);
    return appConfig;
  } else {
    return null;
  }
}

// function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
export async function getAccessToken() {
  const config = await getConfig();
  consoleLog(config, 'API call - getAccessToken');
  const accessToken = await EncryptedStorage.getItem('accessToken');
  if (config != 'undefined' && config != null) {
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();
    if (responseText) {
      EncryptedStorage.setItem('accessToken', JSON.stringify(responseText));
      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}

// get Promotion
export async function getClaimDetails(claimId, promotionId) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getPromotion');
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack._api + EndPointsCashBack.promotions + '/' + promotionId  + EndPointsCashBack.claims + '/' + claimId;

    sendToEndPoint(config, 'GET', url, accessToken, null).then (
      function(responseText) {
      resolve(responseText);
      }).catch((e) => {
      reject("Unable to process request");
    });
  });
}

// function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token

async function getAccessTokenCashBack() {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getAccessTokenCashBack');
  const accessToken = await EncryptedStorage.getItem('accessToken_cashBack');
  if (config != 'undefined' && config != null) {
    if (typeof accessToken !== 'undefined' && accessToken != null) {
      const accessToken_Obj = JSON.parse(accessToken);
      const createdTime = accessToken_Obj.created_at + 6000;
      const expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
      expiresAt.setUTCSeconds(createdTime);
      if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
        return accessToken_Obj.access_token;
      }
    }
    const url = getHostEndPointsCashback(config) + EndPointsCashBack.accessToken;
    const data =
      'grant_type=client_credentials&' +
      'client_id=' +
      config.client_id +
      '&client_secret=' +
      config.client_secret;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: data,
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();
    if (responseText) {
      EncryptedStorage.setItem('accessToken_cashBack', JSON.stringify(responseText));
      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}
