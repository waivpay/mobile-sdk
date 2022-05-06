import { EndPoints, EndPointsCashBack } from '../util/ServerEndPoints';

export class AppConfig {
  client_id;
  client_secret;
  app_id;
  environment;

  constructor(client_id, client_secret, app_id, environment) {
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
