import { EndPoints } from './util/ServerEndPoints';
import { AsyncStorage } from 'react-native';

//sets client keyt,  client secret and appid in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(clientId, clientSecret, appId) {
  if (clientId != null && clientId !== 'undefined' && clientSecret != null && clientSecret !== 'undefined' && appId != null && appId !== 'undefined') {
    await AsyncStorage.setItem(
      'waivpay_sdk_config_appId',
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        appId: appId,
    }));
  } else {
    throw new Error('All parameters need to be passed to set config');
  }
}

// function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
const getAccessToken = new Promise(async function(resolve, reject) {
  var accessToken = await AsyncStorage.getItem('accessToken');
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  if (typeof accessToken !== 'undefined' && accessToken != null) {
    var accessToken_Obj = JSON.parse(accessToken);
    var createdTime = accessToken_Obj.created_at + 6000;
    var expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
    expiresAt.setUTCSeconds(createdTime);
    if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
      resolve(accessToken_Obj.access_token);
    }
  } else {
    var url = EndPoints.host + EndPoints.accessToken;
    var data = 'grant_type=client_credentials&' + 'client_id=' + JSON.parse(config).client_id + '&client_secret=' + JSON.parse(config).client_secret;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        AsyncStorage.setItem('accessToken', this.responseText);
        resolve(JSON.parse(this.responseText).access_token);
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(data);
  }

});

// get catalogue
export async function getCatalogue(appId) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.catalogue;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// get balance
export async function getBalance(cardId) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.cards + '/' + cardId + EndPoints.balance;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// get transactions
export async function getTransactions(cardId) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.cards + '/' + cardId + EndPoints.transaction;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// get cardDetails
export async function getCardDetails(cardId) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.cards + '/' + cardId;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

export async function sendTwoFactor(mobile) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.sendTwoFactor;
      var authorization = 'Bearer ' + accessToken;

      var data = JSON.stringify({
        'mobile_number': mobile,
      });
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          var verification_id = JSON.parse(this.responseText).verification_id.toString();
          AsyncStorage.setItem('waivpay_sdk_verificationId', verification_id);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}

export async function verifyTwoFactor(code) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  var verificationId = await AsyncStorage.getItem('waivpay_sdk_verificationId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.sendTwoFactor + '/' + verificationId;

      var authorization = 'Bearer ' + accessToken;

      var data = JSON.stringify({
        'verification_code': code,
      });
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('PUT', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}

// get App Details
export async function getApp(appId) {
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + appId;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

//create a new user
export async function createProfile(user) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.users;
      var authorization = 'Bearer ' + accessToken;

      var data = JSON.stringify(user);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}

// get App Details
export async function searchCards(mobile) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.cards + '?mobile_number=' + mobile;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// get User Profile
export async function getProfile(userId) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.users + '/' + userId;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}


//update a user profile
export async function updateProfile(user) {
  var config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function(resolve, reject) {
    getAccessToken.then((value) => {
      var accessToken = value;
      var url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId + EndPoints.users;
      var authorization = 'Bearer ' + accessToken;

      var data = JSON.stringify(user);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('User Created :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}


/* ***********

CashBack Api calls

************* */

//sets client keyt,  client secret and appid in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfigCashBack(clientId, clientSecret, orgId) {
  if (clientId != null && clientId !== 'undefined' && clientSecret != null && clientSecret !== 'undefined' && orgId != null && orgId !== 'undefined') {
    await AsyncStorage.setItem('cachback_config', JSON.stringify({
      'client_id': clientId,
      'client_secret': clientSecret,
      'orgId': orgId,
    }));
  } else {
    throw new Error('All parameters need to be passed to set config');
  }
}

// function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
const getAccessTokenCashBack = new Promise(async function(resolve, reject) {
  var accessToken = await AsyncStorage.getItem('accessToken_cashBack');
  var config = await AsyncStorage.getItem('cachback_config');
  if (typeof accessToken !== 'undefined' && accessToken != null) {
    var accessToken_Obj = JSON.parse(accessToken);
    var createdTime = accessToken_Obj.created_at + 6000;
    var expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
    expiresAt.setUTCSeconds(createdTime);
    if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
      resolve(accessToken_Obj.access_token);
    }
  } else {
    var url = EndPointsCashBack.host + EndPointsCashBack.accessToken;
    var data = 'grant_type=client_credentials&' + 'client_id=' + JSON.parse(config).client_id + '&client_secret=' + JSON.parse(config).client_secret;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        AsyncStorage.setItem('accessToken_cashBack', this.responseText);
        resolve(JSON.parse(this.responseText).access_token);
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send(data);
  }

});

// list Promotions
export async function listPromotions(orgId) {
  var config = await AsyncStorage.getItem('cachback_config');
  return new Promise(async function(resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      var accessToken = value;
      var url = EndPointsCashBack.host + EndPointsCashBack.orgSpecific + orgId + EndPointsCashBack.promotions;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('List of Promotions :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// get Promotion
export async function getPromotion(promotionId) {
  var config = await AsyncStorage.getItem('cachback_config');
  return new Promise(async function(resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      var accessToken = value;
      var url = EndPointsCashBack.host + EndPointsCashBack.orgSpecific + JSON.parse(config).orgId + EndPointsCashBack.promotions + '/' + promotionId;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('Promotion Details :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

//create claim
export async function createClaim(claim, promotionId) {
  var config = await AsyncStorage.getItem('cachback_config');
  return new Promise(async function(resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      var accessToken = value;
      var url = EndPointsCashBack.host + EndPointsCashBack._api + EndPointsCashBack.promotions + '/' + promotionId + EndPointsCashBack.claims;
      var authorization = 'Bearer ' + accessToken;
      var data = JSON.stringify(claim);
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('Claim Created :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}

// get claims for user
export async function getClaims(external_user_id) {
  var config = await AsyncStorage.getItem('cachback_config');
  return new Promise(async function(resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      var accessToken = value;
      var url = EndPointsCashBack.host + EndPointsCashBack.api + EndPointsCashBack.claims + '?external_user_id=' + external_user_id;
      var authorization = 'Bearer ' + accessToken;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('Claims for the user :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send();
    });
  });
}

// file Upload
export async function fileUpload(fileInput) {
  var config = await AsyncStorage.getItem('cachback_config');
  return new Promise(async function(resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      var accessToken = value;
      var url = EndPointsCashBack.host + EndPointsCashBack.api + EndPointsCashBack.claims + EndPointsCashBack.fileUpload;
      var authorization = 'Bearer ' + accessToken;

      var data = new FormData();
      data.append('file', fileInput.files[0], fileInput.files[0].name);

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          alert('Claims for the user :' + this.responseText);
          resolve(JSON.parse(this.responseText));
        }
      });

      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', authorization);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    });
  });
}
