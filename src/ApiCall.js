import { EndPoints, EndPointsCashBack } from './util/ServerEndPoints';
import { AsyncStorage } from 'react-native';
import {Product} from './Models/Product'
import { Catalogue } from './Models/Catalogue';
import {Brand} from './Models/Brand';
import { Location } from './Models/Location';
import { Balance } from "./models/Balance";
import { Transaction } from './Models/Transaction';
import { TransactionList } from './Models/TransactionList';
import { CardList } from './Models/CardList';
import { Card } from './Models/Card';
import { Profile } from './Models/Profile';

//sets client key,  client secret and appid in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(clientId, clientSecret, appId) {
  if (
    clientId != null &&
    clientId !== 'undefined' &&
    clientSecret != null &&
    clientSecret !== 'undefined' &&
    appId != null &&
    appId !== 'undefined'
  ) {
    await AsyncStorage.setItem(
      'waivpay_sdk_config_appId',
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        appId: appId,
      })
    );
  } else {
    throw new Error('All parameters need to be passed to set config');
  }
}

// function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
const getAccessToken = new Promise(async function (resolve, reject) {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  if (typeof accessToken !== 'undefined' && accessToken != null) {
    const accessToken_Obj = JSON.parse(accessToken);
    const createdTime = accessToken_Obj.created_at + 6000;
    const expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
    expiresAt.setUTCSeconds(createdTime);
    if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
      resolve(accessToken_Obj.access_token);
    }
  } else {
    const url = EndPoints.host + EndPoints.accessToken;
    const data =
      'grant_type=client_credentials&' +
      'client_id=' +
      JSON.parse(config).client_id +
      '&client_secret=' +
      JSON.parse(config).client_secret;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
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
export async function getCatalogue() {
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.catalogue;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var cat = new Catalogue(new Array());
          var prods = new Array();
          prods = JSON.parse(this.responseText).products;
          for(i=0; i<prods.length; i++)
          {
            var prod = new Product();
            prod = prods[i];
            cat.products.push(prod);
          }
          resolve(cat);
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.cards +
        '/' +
        cardId +
        EndPoints.balance;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var bal = new Balance();
          bal = JSON.parse(this.responseText);
          resolve(bal);
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.cards +
        '/' +
        cardId +
        EndPoints.transaction;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var transs = new Array();
          var transactionList = new TransactionList(new Array());
         transs = JSON.parse(this.responseText).transactions;
         for(x=0; x<transs.length; x++)
         {
            var transaction = new Transaction();
            transaction = transs[x];
            transactionList.transactions.push(transaction);
         }
          resolve(transactionList);
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.cards +
        '/' +
        cardId;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var card = new Card();
          card = JSON.parse(this.responseText);
          resolve(card);
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.sendTwoFactor;
      const authorization = 'Bearer ' + accessToken;

      const data = JSON.stringify({
        mobile_number: mobile,
      });
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          const verification_id = JSON.parse(
            this.responseText
          ).verification_id.toString();
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  const verificationId = await AsyncStorage.getItem(
    'waivpay_sdk_verificationId'
  );
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.sendTwoFactor +
        '/' +
        verificationId;

      const authorization = 'Bearer ' + accessToken;

      const data = JSON.stringify({
        verification_code: code,
      });
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
export async function getBrand() {
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url = EndPoints.host + EndPoints.appSpecific + JSON.parse(config).appId;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var app = new Brand('','',new Array(),'');
          app = JSON.parse(this.responseText).app;
          var locs = new Array();
          var locations = JSON.parse(this.responseText).app.locations;
          for(i=0; i<locations.length;i++)
          {
            var location = new Location();
            location = locations[i];
            locs.push(location);
          }
          app.locations = locs;
          resolve(app);
         // resolve(JSON.parse(this.responseText));
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
  if(user != null && user instanceof Profile)
  {
    const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
    return new Promise(async function (resolve, reject) {
      getAccessToken.then((value) => {
        const accessToken = value;
        const url =
          EndPoints.host +
          EndPoints.appSpecific +
          JSON.parse(config).appId +
          EndPoints.users;
        const authorization = 'Bearer ' + accessToken;
  
        const data = JSON.stringify(user);
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
  
        xhr.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            var profile = new Profile();
              profile = JSON.parse(this.responseText).user;
              resolve(profile);
          }
        });
  
        xhr.open('POST', url);
        xhr.setRequestHeader('Authorization', authorization);
        xhr.setRequestHeader('Content-Type', 'application/json');
  
        xhr.send(data);
      });
    });
  }
  else{
    throw 'Please pass object of type Profile';
  }
  
}

// get App Details
export async function searchCards(mobile) {
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.cards +
        '?mobile_number=' +
        mobile;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var cards = new Array();
          var cardList = new CardList(new Array());
          cards = JSON.parse(this.responseText).cards;
          for(i=0; i<cards.length ; i++)
          {
            var card = new Card();
            card = cards[i];
            cardList.cards.push(card);
          }
         resolve(cardList);
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
  const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
  return new Promise(async function (resolve, reject) {
    getAccessToken.then((value) => {
      const accessToken = value;
      const url =
        EndPoints.host +
        EndPoints.appSpecific +
        JSON.parse(config).appId +
        EndPoints.users +
        '/' +
        userId;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          var profile = new Profile();
                profile = JSON.parse(this.responseText).user;
                resolve(profile);
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
  if(user != null && user instanceof Profile)
  {
    if(user.id != 'undefined' && user.id != null)
    {
      const config = await AsyncStorage.getItem('waivpay_sdk_config_appId');
      return new Promise(async function (resolve, reject) {
        getAccessToken.then((value) => {
          const accessToken = value;
          const url =
            EndPoints.host +
            EndPoints.appSpecific +
            JSON.parse(config).appId +
            EndPoints.users + "/" + user.id;
          const authorization = 'Bearer ' + accessToken;
    
          const data = JSON.stringify(user);
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
    
          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              var profile = new Profile();
              profile = JSON.parse(this.responseText).user;
              resolve(profile);
            }
          });
    
          xhr.open('PUT', url);
          xhr.setRequestHeader('Authorization', authorization);
          xhr.setRequestHeader('Content-Type', 'application/json');
    
          xhr.send(data);
        });
      });
    }
    else{
      throw 'Please provide an id for the user';
    }
  }
  else{
    throw 'Please pass object of type Profile';

  }
  
}

/* ***********

CashBack Api calls

************* */

//sets client key,  client secret and appid in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfigCashBack(clientId, clientSecret, orgId) {
  if (
    clientId != null &&
    clientId !== 'undefined' &&
    clientSecret != null &&
    clientSecret !== 'undefined' &&
    orgId != null &&
    orgId !== 'undefined'
  ) {
    await AsyncStorage.setItem(
      'cashback_config',
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        orgId: orgId,
      })
    );
  } else {
    throw new Error('All parameters need to be passed to set config');
  }
}

// function to get an access token by authenticating with CashBack Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
const getAccessTokenCashBack = new Promise(async function (resolve, reject) {
  const accessToken = await AsyncStorage.getItem('accessToken_cashBack');
  const config = await AsyncStorage.getItem('cashback_config');
  if (typeof accessToken !== 'undefined' && accessToken != null) {
    const accessToken_Obj = JSON.parse(accessToken);
    const createdTime = accessToken_Obj.created_at + 6000;
    const expiresAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
    expiresAt.setUTCSeconds(createdTime);
    if (accessToken_Obj.access_token != null && expiresAt > new Date()) {
      resolve(accessToken_Obj.access_token);
    }
  } else {
    const url = EndPointsCashBack.host + EndPointsCashBack.accessToken;
    const data =
      'grant_type=client_credentials&' +
      'client_id=' +
      JSON.parse(config).client_id +
      '&client_secret=' +
      JSON.parse(config).client_secret;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
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
  return new Promise(async function (resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      const accessToken = value;
      const url =
        EndPointsCashBack.host +
        EndPointsCashBack.orgSpecific +
        orgId +
        EndPointsCashBack.promotions;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
  const config = await AsyncStorage.getItem('cashback_config');
  return new Promise(async function (resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      const accessToken = value;
      const url =
        EndPointsCashBack.host +
        EndPointsCashBack.orgSpecific +
        JSON.parse(config).orgId +
        EndPointsCashBack.promotions +
        '/' +
        promotionId;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
  return new Promise(async function (resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      const accessToken = value;
      const url =
        EndPointsCashBack.host +
        EndPointsCashBack._api +
        EndPointsCashBack.promotions +
        '/' +
        promotionId +
        EndPointsCashBack.claims;
      const authorization = 'Bearer ' + accessToken;
      const data = JSON.stringify(claim);
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
  return new Promise(async function (resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      const accessToken = value;
      const url =
        EndPointsCashBack.host +
        EndPointsCashBack.api +
        EndPointsCashBack.claims +
        '?external_user_id=' +
        external_user_id;
      const authorization = 'Bearer ' + accessToken;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
  return new Promise(async function (resolve, reject) {
    getAccessTokenCashBack.then((value) => {
      const accessToken = value;
      const url =
        EndPointsCashBack.host +
        EndPointsCashBack.api +
        EndPointsCashBack.claims +
        EndPointsCashBack.fileUpload;
      const authorization = 'Bearer ' + accessToken;

      const data = new FormData();
      data.append('file', fileInput.files[0], fileInput.files[0].name);

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
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
