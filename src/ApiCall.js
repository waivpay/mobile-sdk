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
import { AppConfig } from './Models/AppConfig';
import { Order } from './Models/Order';
import { OrderResponse } from './Models/OrderResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getConfig() {
  console.log('API call - getConfig');
  let appConfig = new AppConfig();
  const config = await AsyncStorage.getItem('waivpay_sdk_config_app_id');
  appConfig = JSON.parse(config);
  return appConfig;
}

function getHostEndPoints(config) {
  console.log('API call - getHostEndPoints');
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

function getHostEndPointsCashback(config) {
  console.log('API call - getHostEndPointsCashback');
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

async function sendToEndPoint(accessType, url, accessToken, data) {
  console.log('sendToEndPoint ' + accessType + ' ' + url + ' ' + accessToken);
  const authorization = 'Bearer ' + accessToken;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status === 200) {
      return xhr.responseText;
    } else {
      throw new Error(
        'API call failed ' + url + ' ' + xhr.responseText,
      );
    }
  };
  xhr.open(accessType, url);
  xhr.setRequestHeader('Authorization', authorization);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(data);
}

function replacer(key, value) {
  if (value == 'undefined') return undefined;
  else if (value == null) return undefined;
  else return value;
}

//sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(appConfig) {
  console.log('API call - setConfig');
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
      await AsyncStorage.setItem(
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
  console.log('API call - sendTwoFactor');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor;
    const data = JSON.stringify({ mobile_number: mobile });
    const responseText = await sendToEndPoint('POST', url, accessToken, data);
    if (responseText) {
      const verification_id = JSON.parse(
        responseText,
      ).verification_id.toString();
      AsyncStorage.setItem('waivpay_sdk_verificationId', verification_id);
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

export async function verifyTwoFactor(code) {
  console.log('API call - verifyTwoFactor');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const verificationId = await AsyncStorage.getItem('waivpay_sdk_verificationId');
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor + '/' + verificationId;
    const data = JSON.stringify({
      verification_code: code,
    });

    const responseText = await sendToEndPoint('PUT', url, accessToken, data);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}


// get App Details
export async function getBrand() {
  console.log('API call - getBrand');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id;
    console.log('Shoudl have a token  ' + accessToken);
    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let app = new Brand('', '', [], '');
      app = JSON.parse(responseText).app;
      const locs = [];
      const locations = JSON.parse(responseText).app.locations;
      for (let i = 0; i < locations.length; i++) {
        let location = new Location();
        location = locations[i];
        locs.push(location);
      }
      app.locations = locs;
      resolve(app);
    } else {
      resolve(null);
    }
  });
}

// get catalogue
export async function getCatalogue() {
  console.log('API call - getCatalogue');

  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.catalogue;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      const cat = new Catalogue([]);
      let prods = [];
      prods = JSON.parse(responseText).products;
      for (let i = 0; i < prods.length; i++) {
        let prod = new Product();
        prod = prods[i];
        cat.products.push(prod);
      }
      resolve(cat);
    } else {
      resolve(null);
    }
  });
}

// get balance
export async function getBalance(cardId) {
  console.log('API call - getBalance');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.balance;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let bal = new Balance();
      bal = JSON.parse(responseText);
      resolve(bal);
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

// get transactions
export async function getTransactions(cardId) {
  console.log('API call - getTransactions');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.transaction;
    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let transs = [];
      let transactionList = new TransactionList([]);
      transs = JSON.parse(responseText).transactions;
      for (let x = 0; x < transs.length; x++) {
        let transaction = new Transaction();
        transaction = transs[x];
        transactionList.transactions.push(transaction);
      }
      resolve(transactionList);
    } else {
      resolve(null);
    }
  });
}

// get cardDetails
export async function getCardDetails(cardId) {
  console.log('API call - getCardDetails');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId;
    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let card = new Card();
      card = JSON.parse(responseText);
      resolve(card);
    } else {
      resolve(null);
    }
  });
}

//create a new user
export async function createProfile(user) {
  console.log('API call - createProfile');
  if (user != null && user instanceof Profile) {
    const config = await getConfig();
    return new Promise(async function(resolve, reject) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users;

      const responseText = await sendToEndPoint('POST', url, accessToken, user);
      if (responseText) {
        let profile = new Profile();
        profile = JSON.parse(responseText).user;
        resolve(profile);
      } else {
        resolve(null);
      }
    });
  } else {
    throw 'Please pass object of type Profile';
  }
}

//create an order
export async function createOrder(order) {
  console.log('API call - createOrder');
  if (order != null && order instanceof Order) {
    const config = await getConfig();
    return new Promise(async function(resolve, reject) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders;

      const responseText = await sendToEndPoint('POST', url, accessToken, order);
      if (responseText) {
        let orderResponse = new OrderResponse();
        if (responseText.error != 'undefined' && responseText.error != null) {
          orderResponse.error = responseText.error;
          orderResponse.hasError = true;
        } else {
          orderResponse = JSON.parse(responseText);
        }

        resolve(orderResponse);
      } else {
        resolve(null);
      }
    });
  } else {
    throw 'Please pass object of type Order';
  }
}

// get App Details
export async function searchCards(mobile) {
  console.log('API call - searchCards');
  const config = await getConfig();
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '?mobile_number=' +
      mobile;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let cards = [];
      const cardList = new CardList([]);
      cards = JSON.parse(responseText).cards;
      for (let i = 0; i < cards.length; i++) {
        let card = new Card();
        card = cards[i];
        cardList.cards.push(card);
      }
      resolve(cardList);
    } else {
      resolve(null);
    }
  });
}

// get User Profile
export async function getProfile(userId) {
  console.log('API call - getProfile');
  const config = await getConfig();
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.users +
      '/' +
      userId;
    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      let profile = new Profile();
      profile = JSON.parse(responseText).user;
      resolve(profile);
    } else {
      resolve(null);
    }
  });
}

//update a user profile
export async function updateProfile(user) {
  console.log('API call - updateProfile');
  if (user != null && user instanceof Profile) {
    if (user.id != 'undefined' && user.id != null) {
      const config = await getConfig();
      return new Promise(async function(resolve, reject) {
        const accessToken = await getAccessToken();
        const url =
          getHostEndPoints(config) +
          EndPoints.appSpecific +
          config.app_id +
          EndPoints.users +
          '/' +
          user.id;
        const responseText = await sendToEndPoint('POST', url, accessToken, user);
        if (responseText) {
          let profile = new Profile();
          profile = JSON.parse(responseText).user;
          resolve(profile);
        } else {
          resolve(null);
        }
      });
    } else {
      throw 'Please provide an id for the user';
    }
  } else {
    throw 'Please pass object of type Profile';
  }
}

/* ***********

CashBack Api calls

************* */


// file Upload
export async function fileUpload(fileInput) {
  console.log('API call - fileUpload');
  return new Promise(async function(resolve, reject) {
    const config = await getConfigCashBack();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.api +
      EndPointsCashBack.claims +
      EndPointsCashBack.fileUpload;

    const data = new FormData();
    data.append('file', fileInput.files[0], fileInput.files[0].name);

    const responseText = await sendToEndPoint('POST', url, accessToken, data);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

// list Promotions
export async function listPromotions() {
  console.log('API call - listPromotions');
  return new Promise(async function(resolve, reject) {
    const config = await getConfigCashBack();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.orgSpecific +
      config.app_id +
      EndPointsCashBack.promotions;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

//sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfigCashBack(appConfig) {
  console.log('API call - setConfigCashBack');
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
      await AsyncStorage.setItem(
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
  console.log('API call - getPromotion');
  return new Promise(async function(resolve, reject) {
    const config = await getConfigCashBack();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.orgSpecific +
      config.app_id +
      EndPointsCashBack.promotions +
      '/' +
      promotionId;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

//create claim
export async function createClaim(claim, promotionId) {
  console.log('API call - createClaim');
  return new Promise(async function(resolve, reject) {
    const config = await getConfigCashBack();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack._api +
      EndPointsCashBack.promotions +
      '/' +
      promotionId +
      EndPointsCashBack.claims;

    const data = JSON.stringify(claim);
    const responseText = await sendToEndPoint('POST', url, accessToken, data);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

// get claims for user
export async function getClaims(external_user_id) {
  console.log('API call - getClaims');
  return new Promise(async function(resolve, reject) {
    const config = await getConfigCashBack();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPointsCashback(config) +
      EndPointsCashBack.api +
      EndPointsCashBack.claims +
      '?external_user_id=' +
      external_user_id;

    const responseText = await sendToEndPoint('GET', url, accessToken, null);
    if (responseText) {
      resolve(JSON.parse(responseText));
    } else {
      resolve(null);
    }
  });
}

async function getConfigCashBack() {
  console.log('API call - getConfigCashBack');
  let appConfig = new AppConfig();
  const config = await AsyncStorage.getItem(
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
async function getAccessToken() {
  console.log('API call - getAccessToken');
  const accessToken = await AsyncStorage.getItem('accessToken');
  const config = await getConfig();
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
      AsyncStorage.setItem('accessToken', JSON.stringify(responseText));
      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}

// function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token

async function getAccessTokenCashBack() {
  console.log('API call - getAccessTokenCashBack');
  const accessToken = await AsyncStorage.getItem('accessToken_cashBack');
  const config = await getConfig();
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
    const url = getHostEndPointsCashback(config) + EndPoEndPointsCashBackints.accessToken;
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
      AsyncStorage.setItem('accessToken_cashBack', JSON.stringify(responseText));
      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}
