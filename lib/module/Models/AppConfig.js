function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { EndPoints, EndPointsCashBack } from '../util/ServerEndPoints';
export class AppConfig {
  constructor(client_id, client_secret, app_id, environment) {
    _defineProperty(this, "client_id", void 0);

    _defineProperty(this, "client_secret", void 0);

    _defineProperty(this, "app_id", void 0);

    _defineProperty(this, "environment", void 0);

    this.client_id = client_id;
    this.client_secret = client_secret;
    this.app_id = app_id;
    this.environment = environment;
  }

  getHostEndPoints() {
    if (this.environment == 'staging') {
      return EndPoints.host_staging;
    } else if (this.environment == 'prod') {
      return EndPoints.host_prod;
    } else {
      return '';
    }
  }

  getHostEndPointsCashback() {
    if (this.environment == 'staging') {
      return EndPointsCashBack.host_staging;
    } else if (this.environment == 'prod') {
      return EndPointsCashBack.host_prod;
    } else {
      return '';
    }
  }

}
//# sourceMappingURL=AppConfig.js.map