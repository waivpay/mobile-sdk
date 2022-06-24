# waivpay-karta-sdk

A React Native SDK for Waivpay to Karta APIs that enable provisioning of digital cards for iOS and Android

## Installation

Using NPM
```sh
npm install @conn3cted/waivpay-karta-sdk@0.1.0
cd ios
pod install
```

Using YARN
```sh
yarn add @conn3cted/waivpay-karta-sdk@0.1.0
cd ios
pod install
```

## Run Sample

iOS
```sh
npm run ios
```

Android
```sh
npm run android
```

Ensure that you have setup the android gradle as per documentation in the repository https://github.com/conn3cted/WaivpayReactNativeSDK/blob/master/WaivpaySDk.doc

## Usage

Example on how to configure your application, see documentation for more APIs.

```js
import {setConfig} from "waivpay-karta-sdk/src/ApiCall";

import {AppConfig} from "waivpay-karta-sdk/src/Models/AppConfig";

…..

var appConfig = new AppConfig("client_id”, “client_secret”, “app_id”, “environment(staging|prod)");

setConfig(appConfig);
```
