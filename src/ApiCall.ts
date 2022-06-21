import { AppConfig } from './Models/AppConfig';
import EncryptedStorage from 'react-native-encrypted-storage/lib/typescript/EncryptedStorage';
import { EndPoints } from './util/ServerEndPoints';
import type { Profile } from './Models/Profile';
import type { Order } from './Models/Order';

async function consoleLog(config: AppConfig, message: string) {
    if (config && config.environment == 'staging') {
      console.log(message);
    }
  }

async function getConfig() {
  let appConfig = new AppConfig('','','','');
  const config = await EncryptedStorage.getItem('waivpay_sdk_config_app_id');
  appConfig = JSON.parse(config || '{}');
  return appConfig;
}

function getHostEndPoints(config: AppConfig) {
    consoleLog(config, 'API call - getHostEndPoints');
    if (config!=null && config.environment!=null && config.environment!='') {
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

  function replacer(key: string, value: string) {
    console.log(key);
    if (value == 'undefined') return undefined;
    else if (value == null) return undefined;
    else return value;
  }


  async function sendToEndPoint(config:AppConfig, accessType:string, url:string, accessToken:String, data: string){
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
  }

  //sets client key,  client secret and app_id in asyncstorage, to be used in subsequent api calls tp Waivpay
export async function setConfig(appConfig:AppConfig) {
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

  // function to get an access token by authenticating with Waivpay Api
// if there is a saved token in async storage and the token is not yet expired , will return the saved token, otherwise will reauthenticate and fetch a new access token
export async function getAccessToken() {
    const config = await getConfig();
    consoleLog(config, 'API call - getAccessToken');
    const accessToken = await EncryptedStorage.getItem('accessToken');
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
  
  export async function sendTwoFactor(mobile:string) {
    const config = await getConfig();
    consoleLog(config, 'API call - sendTwoFactor');
    return new Promise(async function(resolve) {
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor;
      const data = { "mobile_number": mobile };
      const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(data));
      if (responseText) {
        EncryptedStorage.setItem('waivpay_sdk_verificationId', responseText.verification_id.toString());
        resolve(responseText);
      } else {
        resolve(null);
      }
    });
  }

  export async function verifyTwoFactor(code:string) {
    const config = await getConfig();
    return new Promise(async function(resolve) {
      consoleLog(config, 'API call - verifyTwoFactor');
      const verificationId = await EncryptedStorage.getItem('waivpay_sdk_verificationId');
      const accessToken = await getAccessToken();
      const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.sendTwoFactor + '/' + verificationId;
      const data = {verification_code: code};
  
      const responseText = await sendToEndPoint(config, 'PUT', url, accessToken, JSON.stringify(data));
      if (responseText) {
        resolve(responseText);
      } else {
        resolve(null);
      }
    });
  }

  // get App Details
export async function getBrand() {
  const config = await getConfig();
  consoleLog(config, 'API call - getBrand');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, "");
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

// get catalogue
export async function getCatalogue() {
  const config = await getConfig();
  consoleLog(config, 'API call - getCatalogue');

  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url = getHostEndPoints(config) + EndPoints.appSpecific + config.app_id + EndPoints.catalogue;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, "");
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

export async function getBalance(cardId: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - getBalance');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.balance;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

// get transactions
export async function getTransactions(cardId: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - getTransactions');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId +
      EndPoints.transaction;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

// get cardDetails
export async function getCardDetails(cardId: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - getCardDetails');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '/' +
      cardId;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

//create a new user
export async function createProfile(user: Profile) {
  const config = await getConfig();
  consoleLog(config, 'API call - createProfile');
    return new Promise(async function(resolve) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.users;

      const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(user));
      if (responseText) {
        resolve(responseText);
      } else {
        resolve(null);
      }
    });
}

//create an order
export async function createOrder(order: Order) {
  const config = await getConfig();
  consoleLog(config, 'API call - createOrder');
    return new Promise(async function(resolve) {
      const accessToken = await getAccessToken();
      const url =
        getHostEndPoints(config) +
        EndPoints.appSpecific +
        config.app_id +
        EndPoints.orders;

      const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(order));
      if (responseText) {
         resolve(responseText);
      }else {
        resolve(null);
      }
    });
}

// get cards by mobile number
export async function searchCards(mobile: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - searchCards');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.cards +
      '?mobile_number=' +
      mobile;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

// get User Profile
export async function getProfile(userId: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - getProfile');
  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
      getHostEndPoints(config) +
      EndPoints.appSpecific +
      config.app_id +
      EndPoints.users +
      '/' +
      userId;
    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

//update a user profile
export async function updateProfile(user: Profile) {
  const config = await getConfig();
  consoleLog(config, 'API call - updateProfile');
    if (user.id != null) {
      return new Promise(async function(resolve) {
        const accessToken = await getAccessToken();
        const url =
          getHostEndPoints(config) +
          EndPoints.appSpecific +
          config.app_id +
          EndPoints.users +
          '/' +
          user.id;
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

export async function getOrders(user_id: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - getOrders');

  return new Promise(async function(resolve) {
    const accessToken = await getAccessToken();
    const url =
    getHostEndPoints(config) +
    EndPoints.appSpecific +
    config.app_id +
    EndPoints.orders +
    "?user_id=" +
    user_id;

    const responseText = await sendToEndPoint(config, 'GET', url, accessToken, '');
    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}

export async function cardCallBack(callBackUrl: string, token: string) {
  const config = await getConfig();
  consoleLog(config, 'API call - cardCallBack');
  return new Promise(async function(resolve) {
    const accessToken = token;
    const url = callBackUrl;
    const req = {"tokenId": token};
    const responseText = await sendToEndPoint(config, 'POST', url, accessToken, JSON.stringify(req));

    if (responseText) {
      resolve(responseText);
    } else {
      resolve(null);
    }
  });
}
  