import { EndPoints, EndPointsCashBack } from '../util/ServerEndPoints';

export class AppConfig {
  client_id;
  client_secret;
  app_id;
  environment;
  shop;

  constructor(client_id, client_secret, app_id, environment, shop) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.app_id = app_id;
    this.environment = environment;
    this.shop = shop;
  }
}
