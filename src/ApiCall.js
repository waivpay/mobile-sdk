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

// get catalogue
export async function getCatalogue() {
  console.log('API call - getCatalogue');

  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.catalogue;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        const cat = new Catalogue([]);
        let prods = [];
        prods = JSON.parse(this.responseText).products;
        for (let i = 0; i < prods.length; i++) {
          let prod = new Product();
          prod = prods[i];
          cat.products.push(prod);
        }
        resolve(cat);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

// get balance
export async function getBalance(cardId) {
  console.log('API call - getBalance');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.balance;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let bal = new Balance();
        bal = JSON.parse(this.responseText);
        resolve(bal);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

// get transactions
export async function getTransactions(cardId) {
  console.log('API call - getTransactions');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.transaction;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let transs = [];
        let transactionList = new TransactionList([]);
        transs = JSON.parse(this.responseText).transactions;
        for (let x = 0; x < transs.length; x++) {
          let transaction = new Transaction();
          transaction = transs[x];
          transactionList.transactions.push(transaction);
        }
        resolve(transactionList);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

// get cardDetails
export async function getCardDetails(cardId) {
  console.log('API call - getCardDetails');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let card = new Card();
        card = JSON.parse(this.responseText);
        resolve(card);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

export async function sendTwoFactor(mobile) {
  console.log('API call - sendTwoFactor');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.sendTwoFactor;
    const authorization = 'Bearer ' + accessToken;

    const data = JSON.stringify({
      mobile_number: mobile,
    });
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        const verification_id = JSON.parse(
          this.responseText,
        ).verification_id.toString();
        AsyncStorage.setItem('waivpay_sdk_verificationId', verification_id);
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
  });
}

export async function verifyTwoFactor(code) {
  console.log('API call - verifyTwoFactor');
  return new Promise(async function(resolve, reject) {
    const config = await getConfig();
    const verificationId = await AsyncStorage.getItem(
      'waivpay_sdk_verificationId',
    );
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.sendTwoFactor +
      '/' +
      verificationId;

    const authorization = 'Bearer ' + accessToken;

    const data = JSON.stringify({
      verification_code: code,
    });
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('PUT', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
  });
}

// get App Details
export async function getBrand() {
  console.log('API call - getBrand');
  const config = await getConfig();
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) + EndPoints.appSpecific + config.app_id;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let app = new Brand('', '', [], '');
        app = JSON.parse(this.responseText).app;
        const locs = [];
        const locations = JSON.parse(this.responseText).app.locations;
        for (let i = 0; i < locations.length; i++) {
          let location = new Location();
          location = locations[i];
          locs.push(location);
        }
        app.locations = locs;
        resolve(app);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

//create a new user
export async function createProfile(user) {
  console.log('API call - createProfile');
  if (user != null && user instanceof Profile) {
    const config = await getConfig();
    return new Promise(async function(resolve, reject) {
      const accessToken = await getAccessTokenCashBack();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users;
      const authorization = 'Bearer ' + accessToken;

      const data = JSON.stringify(user);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          let profile = new Profile();
          profile = JSON.parse(this.responseText).user;
          resolve(profile);
        } else if (this.readyState > 4) {
          reject('Device not ready');
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
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
      const accessToken = await getAccessTokenCashBack();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders;
      const authorization = 'Bearer ' + accessToken;

      const data = JSON.stringify(order, replacer);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          let orderResponse = new OrderResponse();
          if (this.responseText.error != 'undefined' && this.responseText.error != null) {
            orderResponse.error = this.responseText.error;
            orderResponse.hasError = true;
          } else {
            orderResponse = JSON.parse(this.responseText);
          }

          resolve(orderResponse);
        } else if (this.readyState > 4) {
          reject('Device not ready');
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
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
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '?mobile_number=' +
      mobile;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let cards = [];
        const cardList = new CardList([]);
        cards = JSON.parse(this.responseText).cards;
        for (let i = 0; i < cards.length; i++) {
          let card = new Card();
          card = cards[i];
          cardList.cards.push(card);
        }
        resolve(cardList);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

// get User Profile
export async function getProfile(userId) {
  console.log('API call - getProfile');
  const config = await getConfig();
  return new Promise(async function(resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.users +
      '/' +
      userId;
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        let profile = new Profile();
        profile = JSON.parse(this.responseText).user;
        resolve(profile);
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
  });
}

//update a user profile
export async function updateProfile(user) {
  console.log('API call - updateProfile');
  if (user != null && user instanceof Profile) {
    if (user.id != 'undefined' && user.id != null) {
      const config = await getConfig();
      return new Promise(async function(resolve, reject) {
        const accessToken = await getAccessTokenCashBack();
        const url =
          getHostEndPoints(config) +
          EndPoints.appSpecific +
          config.app_id +
          EndPoints.users +
          '/' +
          user.id;
        const authorization = 'Bearer ' + accessToken;

        const data = JSON.stringify(user);
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function() {
          if (this.readyState === 4) {
            let profile = new Profile();
            profile = JSON.parse(this.responseText).user;
            resolve(profile);
          } else if (this.readyState > 4) {
            reject('Device not ready');
          }
        });

        xhr.open('PUT', url);
        xhr.setRequestHeader('Authorization', authorization);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(data);
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
    const authorization = 'Bearer ' + accessToken;

    const data = new FormData();
    data.append('file', fileInput.files[0], fileInput.files[0].name);

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
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
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
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
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
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
    const authorization = 'Bearer ' + accessToken;
    const data = JSON.stringify(claim);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(data);
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
    const authorization = 'Bearer ' + accessToken;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        resolve(JSON.parse(this.responseText));
      } else if (this.readyState > 4) {
        reject('Device not ready');
      }
    });

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', authorization);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();
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

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        AsyncStorage.setItem('accessToken', this.responseText);
        return JSON.parse(this.responseText).access_token;
      } else {
        reject('Device not ready');
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(data);
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}

// function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
async function getAccessTokenCashBack() {
  console.log('API call - getAccessTokenCashBack');
  const accessToken = await AsyncStorage.getItem('accessToken_cashBack');
  const config = await getConfigCashBack();
  if (config) {
    if (typeof accessToken !== 'undefined' && accessToken != null) {
      const accessToken_Obj = JSON.parse(accessToken);
      const createdTime = accessToken_Obj.created_at + 6000;
      const expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
      expiresAt.setUTCSeconds(createdTime);
      if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
        return accessToken_Obj.access_token;
      }
    }
    const url =
      getHostEndPointsCashback(config) + EndPointsCashBack.accessToken;
    const data =
      'grant_type=client_credentials&' +
      'client_id=' +
      config.client_id +
      '&client_secret=' +
      config.client_secret;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        AsyncStorage.setItem('accessToken_cashBack', this.responseText);
        return JSON.parse(this.responseText).access_token;
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(data);

    return null;
  }

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

  function replacer(key, value) {
    if (value == 'undefined') return undefined;
    else if (value == null) return undefined;
    else return value;
  }
}
