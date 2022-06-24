# waivpay-karta-sdk

The Waivpay SDK provides a simple interface to allow an application to be built with access to Waivpay Web Services which provisions digital cards.

The main features provided by the SDK include:
•	Information about the brands.
•	Digital and physical card information.
•	Purchasing a gift card.
•	Adding a card to a digital wallet.
•	Retrieving balance of a card.
•	Retrieving transaction history of a card.
•	Access to promotions and claims.
•	User management.
•	Promotions and cash back functionality.

## Documentation

Documentation of installation and usage can be found in the repository https://github.com/conn3cted/WaivpayReactNativeSDK/raw/master/WaivpaySDK.doc

## Access

This is a private repository and access needs to be provided for by emailing support@conn3cted.com

## Installation

Ensure that you have setup your access to project via the .npmrc or .yarnrc files and ssh access as per documentation in the repository https://github.com/conn3cted/WaivpayReactNativeSDK/raw/master/WaivpaySDK.doc

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

## Sample application

There is an example application in the repository under the Sample directory to show you the setup.
You can download and run this application for a working example.
See the read me notes for running the sample.

## Usage

Example on how to configure your application, see documentation for more APIs.

```js
import {setConfig} from "waivpay-karta-sdk/src/ApiCall";

import {AppConfig} from "waivpay-karta-sdk/src/Models/AppConfig";

…..

var appConfig = new AppConfig("client_id”, “client_secret”, “app_id”, “environment(staging|prod)");

setConfig(appConfig);
```
