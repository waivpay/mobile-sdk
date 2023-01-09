export declare function addCard(cardId: String, cardSuffix: String, cardHolder: String, env: String, deliveryEmail: String, appId: String, accessToken: String): Promise<String>;
export declare function cardExists(cardId: String): Promise<String>;
export declare function checkIfReadyToPay(jsonReq: String, environment: String): Promise<String>;
