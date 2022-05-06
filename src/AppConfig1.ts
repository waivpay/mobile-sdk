

export class AppConfig1 {
  client_id: String;
  client_secret: String ;
  app_id: number;
  environment: String;

  constructor(client_id: String, client_secret: String, app_id: number, environment: String) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.app_id = app_id;
    this.environment = environment;
  }
}
