"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardCallBack = cardCallBack;
exports.createOrder = createOrder;
exports.createProfile = createProfile;
exports.getAccessToken = getAccessToken;
exports.getBalance = getBalance;
exports.getBrand = getBrand;
exports.getCardDetails = getCardDetails;
exports.getCatalogue = getCatalogue;
exports.getOrders = getOrders;
exports.getProfile = getProfile;
exports.getTransactions = getTransactions;
exports.searchCards = searchCards;
exports.sendTwoFactor = sendTwoFactor;
exports.setConfig = setConfig;
exports.updateProfile = updateProfile;
exports.verifyTwoFactor = verifyTwoFactor;

var _AppConfig = require("./Models/AppConfig");

var _EncryptedStorage = _interopRequireDefault(require("react-native-encrypted-storage/lib/typescript/EncryptedStorage"));

var _ServerEndPoints = require("./util/ServerEndPoints");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function consoleLog(config, message) {
  if (config && config.environment == 'staging') {
    console.log(message);
  }
}

async function getConfig() {
  let appConfig = new _AppConfig.AppConfig('', '', '', '');
  const config = await _EncryptedStorage.default.getItem('waivpay_sdk_config_app_id');
  appConfig = JSON.parse(config || '{}');
  return appConfig;
}

function getHostEndPoints(config) {
  consoleLog(config, 'API call - getHostEndPoints');

  if (config != null && config.environment != null && config.environment != '') {
    if (config.environment == 'staging') {
      return _ServerEndPoints.EndPoints.host_staging;
    } else if (config.environment == 'prod') {
      return _ServerEndPoints.EndPoints.host_prod;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function replacer(key, value) {
  console.log(key);
  if (value == 'undefined') return undefined;else if (value == null) return undefined;else return value;
}

async function sendToEndPoint(config, accessType, url, accessToken, data) {
  consoleLog(config, '_________________________________________');
  consoleLog(config, 'sendToEndPoint ' + accessType + ' ' + url + ' ' + accessToken);
  consoleLog(config, 'Request');
  consoleLog(config, data);
  const authorization = 'Bearer ' + accessToken;
  const response = await fetch(url, {
    method: accessType,
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(JSON.parse(data), replacer)
  });

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const responseText = await response.json();
  consoleLog(config, 'Response');
  consoleLog(config, responseText);
  consoleLog(config, '_________________________________________');
  return responseText;
} //sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay


async function setConfig(appConfig) {
  if (appConfig != null && appConfig instanceof _AppConfig.AppConfig) {
    const client_id = appConfig.client_id;
    const client_secret = appConfig.client_secret;
    const app_id = appConfig.app_id;
    const environment = appConfig.environment;

    if (client_id != null && client_id !== 'undefined' && client_secret != null && client_secret !== 'undefined' && app_id != null && app_id !== 'undefined' && environment != null && environment !== 'undefined') {
      appConfig = new _AppConfig.AppConfig(client_id, client_secret, app_id, environment);
      await _EncryptedStorage.default.setItem('waivpay_sdk_config_app_id', JSON.stringify(appConfig));
    } else {
      throw new Error('All parameters need to be passed to set config');
    }
  } else {
    throw new Error('Please use AppConfig class to pass app configuration parameters');
  }
} // function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token


async function getAccessToken() {
  const config = await getConfig();
  consoleLog(config, 'API call - getAccessToken');
  const accessToken = await _EncryptedStorage.default.getItem('accessToken');

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

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.accessToken;

    const data = 'grant_type=client_credentials&' + 'client_id=' + config.client_id + '&client_secret=' + config.client_secret;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();

    if (responseText) {
      _EncryptedStorage.default.setItem('accessToken', JSON.stringify(responseText));

      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}

async function sendTwoFactor(mobile) {
  const config = await getConfig();
  consoleLog(config, 'API call - sendTwoFactor');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.sendTwoFactor;

    const data = {
      "mobile_number": mobile
    };
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(data));

    if (responseText) {
      _EncryptedStorage.default.setItem('waivpay_sdk_verificationId', responseText.verification_id.toString());

      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

async function verifyTwoFactor(code) {
  const config = await getConfig();
  return new Promise(async function (resolve) {
    consoleLog(config, 'API call - verifyTwoFactor');
    const verificationId = await _EncryptedStorage.default.getItem('waivpay_sdk_verificationId');
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.sendTwoFactor + '/' + verificationId;
    const data = {
      verification_code: code
    };
    const responseText = await sendToEndPoint(config, 'PUT', url, accessToken, JSON.stringify(data));

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get App Details


async function getBrand() {
  const config = await getConfig();
  consoleLog(config, 'API call - getBrand');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, "");

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get catalogue


async function getCatalogue() {
  const config = await getConfig();
  consoleLog(config, 'API call - getCatalogue');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.catalogue;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, "");

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

async function getBalance(cardId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getBalance');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.cards + '/' + cardId + _ServerEndPoints.EndPoints.balance;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get transactions


async function getTransactions(cardId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getTransactions');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.cards + '/' + cardId + _ServerEndPoints.EndPoints.transaction;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get cardDetails


async function getCardDetails(cardId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getCardDetails');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.cards + '/' + cardId;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} //create a new user


async function createProfile(user) {
  const config = await getConfig();
  consoleLog(config, 'API call - createProfile');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.users;

    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(user));

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} //create an order


async function createOrder(order) {
  const config = await getConfig();
  consoleLog(config, 'API call - createOrder');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.orders;

    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(order));

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get cards by mobile number


async function searchCards(mobile) {
  const config = await getConfig();
  consoleLog(config, 'API call - searchCards');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.cards + '?mobile_number=' + mobile;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get User Profile


async function getProfile(userId) {
  const config = await getConfig();
  consoleLog(config, 'API call - getProfile');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.users + '/' + userId;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} //update a user profile


async function updateProfile(user) {
  const config = await getConfig();
  consoleLog(config, 'API call - updateProfile');

  if (user.id != null) {
    return new Promise(async function (resolve) {
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.users + '/' + user.id;
      const responseText = await sendToEndPoint(config, 'PUT', url, accessToken, JSON.stringify(user));

      if (responseText) {
        resolve(responseText);
      } else {
        resolve(null);
      }
    });
  } else {
    throw 'Please provide an id for the user';
  }
}

async function getOrders(user_id) {
  const config = await getConfig();
  consoleLog(config, 'API call - getOrders');
  return new Promise(async function (resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.orders + "?user_id=" + user_id;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

async function cardCallBack(callBackUrl, token) {
  const config = await getConfig();
  consoleLog(config, 'API call - cardCallBack');
  return new Promise(async function (resolve) {
    const accessToken = token;
    const url = callBackUrl;
    const req = {
      "tokenId": token
    };
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(req));

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}
//# sourceMappingURL=ApiCall.js.mapned' && user.id != null) {
      return new Promise(async function (resolve, reject) {
        const accessToken = await getAccessToken();
        const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.users + '/' + user.id;
        const responseText = await sendToEndPoint(config, 'PUT', url, accessToken, user);

        if (responseText) {
          let profile = new _Profile.Profile();
          profile = responseText.user;
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

async function getOrders(user_id) {
  const config = await getConfig();
  consoleLog(config, 'API call - getOrders');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.appSpecific + config.app_id + _ServerEndPoints.EndPoints.orders + "?user_id=" + user_id;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, null);

    if (responseText) {
      const orderList = new _OrderList.OrderList([]);
      let orders = [];
      orders = responseText.orders;

      for (let i = 0; i < orders.length; i++) {
        let order = new _Order.Order();
        order = orders[i];
        orderList.orders.push(order);
      }

      resolve(orderList);
    } else {
      resolve(null);
    }
  });
}

async function cardCallBack(callBackUrl, token) {
  const config = await getConfig();
  consoleLog(config, 'API call - cardCallBack');
  return new Promise(async function (resolve, reject) {
    const accessToken = token;
    const url = callBackUrl;
    const req = {
      "tokenId": token
    };
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, req);

    if (responseText) {
      let carCallBackResponse = new _CardCallBackResponse.CardCallBackResponse();
      carCallBackResponse = responseText;
      resolve(carCallBackResponse);
    } else {
      resolve(null);
    }
  });
}
/* ***********

CashBack Api calls

************* */
// file Upload


async function fileUpload(fileInput) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - fileUpload');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessTokenCashBack();

    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack.api + _ServerEndPoints.EndPointsCashBack.claims + _ServerEndPoints.EndPointsCashBack.fileUpload;

    const data = new FormData();
    data.append('file', fileInput.files[0], fileInput.files[0].name);
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, data);

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // list Promotions


async function listPromotions() {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - listPromotions');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessTokenCashBack();

    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack.orgSpecific + config.app_id + _ServerEndPoints.EndPointsCashBack.promotions;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, null);

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} //sets client key,  client secret and app_id in EncryptedStorage, to be used in subsequent api calls tp Waivpay


async function setConfigCashBack(appConfig) {
  if (appConfig != null && appConfig instanceof _AppConfig.AppConfig) {
    const client_id = appConfig.client_id;
    const client_secret = appConfig.client_secret;
    const app_id = appConfig.app_id;
    const environment = appConfig.environment;

    if (client_id != null && client_id !== 'undefined' && client_secret != null && client_secret !== 'undefined' && app_id != null && app_id !== 'undefined' && environment != null && environment !== 'undefined') {
      appConfig = new _AppConfig.AppConfig(client_id, client_secret, app_id, environment);
      await _reactNativeEncryptedStorage.default.setItem('waivpay_sdk_config_cashback_app_id', JSON.stringify(appConfig));
    } else {
      throw new Error('All parameters need to be passed to set config');
    }
  } else {
    throw new Error('Please use AppConfig class to pass app configuration parameters');
  }
} // get Promotion


async function getPromotion(promotionId) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getPromotion');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack.orgSpecific + config.app_id + _ServerEndPoints.EndPointsCashBack.promotions + '/' + promotionId;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, null);

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} //create claim


async function createClaim(claim, promotionId) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - createClaim');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessTokenCashBack();

    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack._api + _ServerEndPoints.EndPointsCashBack.promotions + '/' + promotionId + _ServerEndPoints.EndPointsCashBack.claims;

    const data = JSON.stringify(claim);
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, data);

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
} // get claims for user


async function getClaims(external_user_id) {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getClaims');
  return new Promise(async function (resolve, reject) {
    const accessToken = await getAccessTokenCashBack();
    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack.api + _ServerEndPoints.EndPointsCashBack.claims + '?external_user_id=' + external_user_id;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, null);

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

async function getConfigCashBack() {
  let appConfig = new _AppConfig.AppConfig();
  const config = await _reactNativeEncryptedStorage.default.getItem('waivpay_sdk_config_cashback_app_id');

  if (config) {
    appConfig = JSON.parse(config);
    return appConfig;
  } else {
    return null;
  }
} // function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token


async function getAccessToken() {
  const config = await getConfig();
  consoleLog(config, 'API call - getAccessToken');
  const accessToken = await _reactNativeEncryptedStorage.default.getItem('accessToken');

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

    const url = getHostEndPoints(config) + _ServerEndPoints.EndPoints.accessToken;

    const data = 'grant_type=client_credentials&' + 'client_id=' + config.client_id + '&client_secret=' + config.client_secret;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();

    if (responseText) {
      _reactNativeEncryptedStorage.default.setItem('accessToken', JSON.stringify(responseText));

      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
} // function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token


async function getAccessTokenCashBack() {
  const config = await getConfigCashBack();
  consoleLog(config, 'API call - getAccessTokenCashBack');
  const accessToken = await _reactNativeEncryptedStorage.default.getItem('accessToken_cashBack');

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

    const url = getHostEndPointsCashback(config) + _ServerEndPoints.EndPointsCashBack.accessToken;

    const data = 'grant_type=client_credentials&' + 'client_id=' + config.client_id + '&client_secret=' + config.client_secret;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const responseText = await response.json();

    if (responseText) {
      _reactNativeEncryptedStorage.default.setItem('accessToken_cashBack', JSON.stringify(responseText));

      return responseText.access_token;
    } else {
      return null;
    }
  } else {
    throw new Error('Please use AppConfig class and config function to setup app configuration parameters');
  }
}
//# sourceMappingURL=ApiCall.js.map