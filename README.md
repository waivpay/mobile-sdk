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

## Usage

```js
import {setConfig} from "waivpay-karta-sdk/src/ApiCall";

import {AppConfig} from "waivpay-karta-sdk/src/Models/AppConfig";

…..

var appConfig = new AppConfig("client_id”, “client_secret”, “app_id”, “environment(staging|prod)");

setConfig(appConfig);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
