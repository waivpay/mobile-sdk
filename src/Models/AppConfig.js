export class AppConfig {
    clientId;
    clientSecret;
    appId;

     constructor(clientId, clientSecret, appId) { 
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.appId = appId;
      }
   }