export class AppConfig {
  client_id: string;
  client_secret: string;
  app_id: string;
  environment: string;

  constructor(client_id: string, client_secret: string, app_id: string, environment: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.app_id = app_id;
    this.environment = environment;
  }
}
