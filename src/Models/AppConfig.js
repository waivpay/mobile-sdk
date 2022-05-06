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


}
